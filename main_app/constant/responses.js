/**
 * success response
 * @param {*} code 
 * @param {*} message 
 * @param {*} details 
 * @param {*} content 
 */
function success(code, message, details, content){

    console.log("#########console log#########\n#########Successfully executed#########");
    const response = {
        code: code,
        status: 'success',
        message: message,
        details: details,
        content:content
    }

    return response;
}

/**
 * failure response
 * @param {*} code 
 * @param {*} message 
 * @param {*} details 
 * @param {*} errorCode 
 */
function failure(code, message, details, errorCode){

    console.log("#########console log#########\n#########failure#########\n#########" + errorCode + "#########");
    const response = {
        code: code,
        status: 'fail',        
        details: message,
        errorCode: errorCode,
        message: details,
    }

    return response;
}

module.exports = {success, failure};