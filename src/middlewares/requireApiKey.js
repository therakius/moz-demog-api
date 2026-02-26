import { make_response } from "../../utils.js"
import { validateApiKey } from "../validators.js"


export async function requireApiKey(req, res, next) {

    const apiKey = req.headers['x-api-key']
    
    if (!apiKey) return res.status(401).json(make_response(false, 401, "Missing x-api-key header", [], [], []))

    const isValidApiKey = await validateApiKey(apiKey)

    if (!isValidApiKey) return res.status(401).json(make_response(false, 401, "Invalid x-api-key header", [], [], []))
    
    next()
}