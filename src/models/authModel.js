export function userQuery(username, email, user_password) {
    const query = `
    insert into use_user (user_name, user_email, user_password_hash)
    values($1, $2, $3) returning user_id;
    `
    const values = [username, email, user_password]

    return {query, values}
}

export function getUserQuery(email) {
    const query = `select user_id, user_password_hash from use_user where user_email = $1`
    const values = [email]
    return {query, values}
}

export function createKeyQuery(userId, keyName, keyHash){
    const query = `
    insert into apk_api_keys (user_id, apk_name, apk_key_hash)
    values($1, $2, $3) returning apk_id as key_id
    `
    const values = [userId, keyName, keyHash]

    return {query, values}
}

export function createResetTokenQuery(userID, resetToken) {
    const query = `
        insert into user_reset_token(urt_hash, user_id)
        values($1, $2) returning urt_id, urt_hash
    `
    const values = [resetToken, userID]

    return {query, values}
}