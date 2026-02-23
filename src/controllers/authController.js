
import { hashPassword } from "../../utils.js"
import { createKeyQuery, userQuery } from "../models/authModel.js"
import { make_response } from "../../utils.js"
import db from "../models/db.js"
import { validateUser } from "../validators.js"
import { keyGenerator } from "../../utils.js"
import { sendEmail } from "../services/emailService.js"
import { getUserQuery } from "../models/authModel.js"
import validator from "validator"

async function authResponse (query, params = [], operationType) {
    let message;
    let error = "";
    let status = 201

    try {
        const result = await db.query(query, params);
        let user_id = ""
        let key_id = ""
        if (operationType === 'createUser') {
            if (result.rows[0].user_id) {
                user_id = result.rows[0].user_id
                message = 'Account created successfully, please check your imbox for further instructions'
           }
        
        } else if (operationType === 'generateKey'){
            if (result.rows[0].key_id) {
                key_id = result.rows[0].key_id
                message = 'api key generated successfully! please check your inbox for further instructions'
            }


        }         

        return {status, message, operationType, user_id, key_id, error}

    } catch (error){
            status = 500           
    }
}

export async function getUser(query, params){
    try {
        const result = await db.query(query, params)
        
        return result.rows[0] || false

    } catch (error) {
        console.error(error)
    }
}

export async function createUser(req, res){
    const {username, email, password} = req.body

    if (!validator.isEmail(email)) return res.status(400).json(make_response(false, 400, "Invalid email", [], [], []))

    const emailExistQuery =  getUserQuery(email)

    const emailExists = await getUser(emailExistQuery.query, emailExistQuery.values)

    if (emailExists) return res.status(400).json(make_response(false, 400, "Email already in use", [], [], []))
    const passwdHash = hashPassword(password)

    let builtQuery = userQuery(username, email, passwdHash)

    const createdUserResult = await authResponse(builtQuery.query, builtQuery.values, 'createUser')

    if (createdUserResult.status === 500) return res.status(createdUserResult.status).json(make_response(true, createdUserResult.status, "An error occured while creating account", [], [], []))

    await sendEmail(email, "Account Created Successfully")

    const userID = createdUserResult.user_id
    const userApiKey = keyGenerator()


    const KeyQuery = createKeyQuery(userID, "default", userApiKey)

    let mailStatus;
    const registerKeyToDb = await authResponse(KeyQuery.query, KeyQuery.values, 'generateKey')
    if(registerKeyToDb.status === 201) {
        mailStatus = await sendEmail(email, "Your API Key", "", userApiKey)
        
    }
    

    if (mailStatus.accepted.length > 0) return res.status(createdUserResult.status).json(make_response(true, createdUserResult.status, createdUserResult.message, [], [], []))

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
        const mailStatus = await sendEmail(user_email, 'Your API Key', '', key)

        //send key through email
        if (mailStatus.accepted.length > 0){
            return res.status(createKeyResult.status).json(make_response(true, createKeyResult.status, createKeyResult.message, [], [], []))

        } else {
            return res.status().json(make_response(false, 500, "there was an error generating your key. please try again later.", [], [], []))
        }
    }
}