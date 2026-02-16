
import { Query } from "pg"
import { hashPassword } from "../../utils.js"
import { userQuery } from "../models/authModel.js"
import { make_response } from "../../utils.js"
import db from "../models/db.js"


async function authResponse (res, query, params = []) {
    console.log(query)
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





export function createUser(req, res){
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    const passwdHash = hashPassword(password)

    let builtQuery = userQuery(username, email, passwdHash)
    console.log(builtQuery)

    authResponse(res, builtQuery.query, builtQuery.values)
  

}