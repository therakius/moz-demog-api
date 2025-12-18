
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
