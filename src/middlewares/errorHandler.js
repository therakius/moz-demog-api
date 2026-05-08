export function emailErrorHandler(type, error) {
  
   return {
    errorType: error.type,
    code: error.code,
    responseCode: error.responseCode,
    message: error.message
  }

}