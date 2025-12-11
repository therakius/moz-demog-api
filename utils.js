
export function make_response(success, status, message, errors=[], data) {
    return {
        'success': success,
        'status': status,
        'message': message,
        'errors': errors,
        'data': data


    }
}
