var pwd = require('../controllers/password');
var jwt = require('jsonwebtoken');
var config = require('../constant/config');
var statusCode = require('../constant/status_codes');
var respones = require('../constant/responses');

var Admin = require('../models/admin');

/**
 * normal user register
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function create(req, res, next) {

    try {

        var coursewebToken = req.headers['courseweb-access-token'];
        jwt.verify(coursewebToken, config.secret, async function (err, decoded) {

            console.log(decoded);
            if (err) {

                res.json(respones.failure(statusCode.NON_AUTHORITATIVE_INFORMATION, err, 'token fail', "#US001"));
            } else if (decoded.type == "Admin") {
                var admin = new Admin();

                admin.email = req.body.Email;
                admin.name = req.body.Name;
                admin.password = pwd.encrypt(req.body.Password);

                Admin.findOne({ 'email': req.body.Email }).exec(function (err, admins) {

                    if (err) {

                        res.json(respones.failure(statusCode.METHOD_FAILURE, err, 'server_error', "#UNR000"));
                    } else {

                        if (admins !== null) {

                            res.json(respones.failure(statusCode.METHOD_FAILURE, "Looks like you’ve already registered that email.", 'user_already_exist', "#UNR001"));
                        } else {

                            admin.save(function (err) {

                                if (err) {

                                    console.log(err);
                                    res.json(respones.failure(statusCode.METHOD_FAILURE, err, "server_error", "#UNR002"));
                                } else {

                                    res.json(respones.success(statusCode.OK, 'success', 'Registered successfully', {

                                        name: admin.name,
                                        email: admin.email,
                                        _id: admin._id
                                    }));
                                }
                            });
                        }
                    }
                });
            }
        });
    } catch (error) {

        console.log(error);
        res.json(respones.failure(statusCode.METHOD_FAILURE, error, 'execution fail', "#UNR004"));
    }
}


/**
 * normal user login
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function login(req, res, next) {

    try {

        Admin.findOne({ 'email': req.body.Email }).exec(function (err, admin) {

            if (err) {

                res.json(respones.failure(statusCode.SERVICE_UNAVAILABLE, "Server error. Please try again in a bit.", "server_error", "#UL001"));
            } else {

                if (admin !== null) {
                    console.log(pwd.decrypt(admin.password));
                    if (pwd.decrypt(admin.password) === req.body.Password) {

                        const payload = {
                            id: admin._id,
                            type: "Admin"
                        };

                        var coursewebToken = jwt.sign(payload, config.secret, {
                        });

                        res.json(respones.success(statusCode.OK, 'success', 'Login successfully', {

                            id: admin.id,
                            token: coursewebToken,
                            email: admin.email,
                            name: admin.name,

                        }));
                    } else {

                        res.json(respones.failure(statusCode.NON_AUTHORITATIVE_INFORMATION, 'Looks like your password is incorrect!', 'wrong_password', "#UL003"));
                    }
                } else {

                    res.json(respones.failure(statusCode.NOT_FOUND, 'Hey! Your email address is not valid.', 'invalid_email', "#UL004"));
                }
            }
        });
    } catch (error) {

        res.json(respones.failure(statusCode.METHOD_FAILURE, error, 'execution fail', "#UL005"));
    }
}


module.exports = {
    create,
    login,
};
