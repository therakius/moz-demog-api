export function userQuery(username, email, user_password) {
    const query = `
    insert into use_user (user_name, user_email, user_password_hash)
    values($1, $2, $3) returning user_id;
    `
    const values = [username, email, user_password]

    return {query, values}
}