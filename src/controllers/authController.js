
import { Query } from "pg"
import { hashPassword } from "../../utils.js"
import { createKeyQuery, userQuery } from "../models/authModel.js"
import { make_response } from "../../utils.js"
import db from "../models/db.js"
import { validateUser } from "../validators.js"
import { keyGenerator } from "../../utils.js"
import { sendEmail } from "../services/emailService.js"

async function authResponse (query, params = [], operationType) {
    let message;
    let error = "";
    let status = 201

    try {
        const result = await db.query(query, params);
        
        if (operationType === 'createUser') {
            if (result.rows[0].user_id) {
            message = 'account created successfully'
           }
        
        } else if (operationType === 'generateKey'){
            if (result.rows[0].key_id) {
            message = 'api key generated successfully! please check your inbox for further instructions'
            }


        }         

        return {status, message, operationType, error}

    } catch (error){
            console.log(error)
            status = 500           
    }
}


export async function getUser(query, params){
    try {
        const result = await db.query(query, params)
        
        console.log(result.rows[0])

        return result.rows[0] || false

    } catch (error) {
        console.error(error.message)
    }
}



export async function createUser(req, res){
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    const passwdHash = hashPassword(password)

    let builtQuery = userQuery(username, email, passwdHash)
    console.log(builtQuery)

    const createdUserResult = await authResponse(builtQuery.query, builtQuery.values, 'createUser')

    if(createdUserResult.status === 201) {
        return res.status(createdUserResult.status).json(make_response(true, createdUserResult.status, createdUserResult.message, [], [], []))
    }

    if (createdUserResult.status === 500) {
        return res.status(createdUserResult.status).json(make_response(true, createdUserResult.status, "An error occured while creating account", [], [], []))
    }
    
  

}

export async function generateKey(req, res) {

    const keyName = req.body.key_name;
    const user_email = req.body.email
    const user_password = req.body.password

    let userExists = await validateUser(user_email, user_password)

    if (!userExists.IsValid) return res.status(400).json(make_response(false, 400, 'invalid username or password', [], [], {}))

    const key = keyGenerator()
    

    const KeyQuery = createKeyQuery(userExists.userId, keyName, key)

    const createKeyResult = await authResponse(KeyQuery.query, KeyQuery.values, 'generateKey')

    if(createKeyResult.status === 201) {
        const mailStatus = await sendEmail(user_email, key)

        //send key through email
        if (mailStatus.accepted.length > 0){
            return res.status(createKeyResult.status).json(make_response(true, createKeyResult.status, createKeyResult.message, [], [], []))

        } else {
            return res.status().json(make_response(false, 500, "there was an error generating your key. please try again later.", [], [], []))
        }
    }
}