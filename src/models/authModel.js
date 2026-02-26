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

export function checkValidTokenQuery(token){
    const query = `
    select us.user_id, urt.urt_id, urt_hash from use_user us
    inner join user_reset_token urt on us.user_id = urt.user_id
    where urt_hash = $1 and urt.urt_expires_at > now() and urt_is_used = 0;
    `
    const values = [token]

    return {query, values}
}

export function updateUserPasswordQuery(userId, newPassword) {
    const query = `
    update use_user set user_password_hash = $1, user_modified_at = current_timestamp
    where user_id = $2 returning user_id, user_email
    `
    const values = [newPassword, userId]

    return {query, values}
}

export function updateUserResetTokenQuery(tokenId) {
    const query = `
    update user_reset_token set urt_created_at = now(), urt_is_used = $1
    where urt_id = $2 returning urt_id
    `

    const values = [1, tokenId]

    return {query, values}
}

export function validateApiKeyQuery(apiKey){
    const query = `
    select apk_id, apk_key_hash, user_id from apk_api_keys
    where apk_key_hash = $1 and apk_end_date > now();
    `
    const values = [apiKey]

    return {query, values}
}