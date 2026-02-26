import { make_response } from "../../utils.js"


export function requireApiKey(req, res, next) {

    const apiKey = req.headers['x-api-key']
    
    if (!apiKey) return res.status(401).json(make_response(false, 401, "Missing x-api-key header", [], [], []))

    

    next()
}