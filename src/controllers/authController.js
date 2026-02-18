
import { Query } from "pg"
import { hashPassword } from "../../utils.js"
import { userQuery } from "../models/authModel.js"
import { make_response } from "../../utils.js"
import db from "../models/db.js"
import { validateUser } from "../validators.js"
import { keyGenerator } from "../../utils.js"
import { sendEmail } from "../services/emailService.js"

async function authResponse (res, query, params = [], operationType) {
    console.log(query)

    if (operationType === 'createUser') {
        try {
            const result = await db.query(query, params);
            if (!result) {
                return res.status(500).json(make_response(false, 500, 'an error occured while creating the user', [], []))
            }

            return res.status(201).json(make_response(true, 201, 'account created successfully', [], {user: result.rows.user_id}))


        } catch (error){
            console.log(error)
            return res.status(500).json(make_response(false, 500, 'There was an internal server error', [], {}, {}))
        }
    }

    if (operationType === 'generateKey') {


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


export function createUser(req, res){
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    const passwdHash = hashPassword(password)

    let builtQuery = userQuery(username, email, passwdHash)
    console.log(builtQuery)

    authResponse(res, builtQuery.query, builtQuery.values, 'createUser')
  

}

export async function generateKey(req, res) {
    /**
    * 1. check if user exists
    * 2. if user does not exist, tell the user to verify the email or password
    * 3. if user exists, generate key and send via email
    * 4. give tell the user to verify the mailbox
    * 5. create a database entry for the api key
    */

    const keyName = req.body.keyName;
    const user_email = req.body.email
    const user_password = req.body.password

    let userExists = await validateUser(user_email, user_password)

    if (!userExists) return res.status(400).json(make_response(false, 400, 'invalid username or password', [], [], {}))
    
    // genarate key
    const key = keyGenerator()
    //send key through email
    const mailStatus = await sendEmail(user_email, key)
    
    if (mailStatus.accepted.length > 0){
        return res.status(201).json(make_response(true, 201, 'your key was generated successfully, please check your mail box (including spam)', [], [], []))
    } else {
        return res.status(400).json(make_response(false, 400, "there was an error generating your key. please try again later.", [], [], []))
    }
}