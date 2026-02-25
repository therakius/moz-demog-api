import bcrypt from "bcryptjs"
import { generateApiKey } from "generate-api-key"

export function make_response(success, status, message, errors=[], data, metadata) {
    return {
        success,
        status,
        message,
        errors,
        data,
        metadata
    }
}


const salt = bcrypt.genSaltSync(10)
export function hashPassword(password) {
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

export async function comparePasswords(password, dbHash){    
    const isValid = await bcrypt.compare(password, dbHash);

    return isValid;
}

export const keyGenerator = (type)=>{

    let prefix;
    let hash;
    
    if (type === 'key') {
        prefix = "mz"
    }

    if (type ==='pass') {
        prefix =  "cred"
    }

    hash = prefix+generateApiKey({length: 32, method: "base62"})
    
    return hash
}



