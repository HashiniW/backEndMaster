var crypto = require("crypto")

//encription key
var key = "this_is_courseweb_password_encryption_key_$%^&&*12345";

/**
 * encryption
 * @param {*} data 
 */
exports.encrypt = function (data) {

    console.log(">>>>>>>>>>>>>>>>>>>>>>>");
    console.log(data);
    var cipher = crypto.createCipher('aes-256-cbc', key);
    var crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

/**
 * decrypting password
 * @param {*} data 
 */
exports.decrypt = function (data) {

    try {

        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    } catch (error) {

        return 'error'
    }

}

