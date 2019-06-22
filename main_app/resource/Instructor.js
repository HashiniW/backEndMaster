var pwd = require('../controllers/password');
var jwt = require('jsonwebtoken');
var config = require('../constant/config');
var statusCode = require('../constant/status_codes');
var respones = require('../constant/responses');
var invite = require('../emailTemplate/invite');

var Instructor = require('../models/instructor');

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
                var instructor = new Instructor();

                instructor.email = req.body.Email;
                instructor.name = req.body.Name;
                instructor.password = pwd.encrypt(req.body.Password);

                Instructor.findOne({ 'email': req.body.Email }).exec(function (err, instructors) {

                    if (err) {

                        res.json(respones.failure(statusCode.METHOD_FAILURE, err, 'server_error', "#UNR000"));
                    } else {

                        if (instructors !== null) {

                            res.json(respones.failure(statusCode.METHOD_FAILURE, "Looks like you’ve already registered that email.", 'user_already_exist', "#UNR001"));
                        } else {

                            instructor.save(function (err) {

                                if (err) {

                                    console.log(err);
                                    res.json(respones.failure(statusCode.METHOD_FAILURE, err, "server_error", "#UNR002"));
                                } else {

                                    
                                    invite.invite(req.body.Email);
                                    res.json(respones.success(statusCode.OK, 'success', 'Created Successfully', {

                                        name: instructor.name,
                                        email: instructor.email,
                                        _id: instructor._id
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
 * POST
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function approve(req, res, next) {

    try {

        var coursewebToken = req.headers['courseweb-access-token'];
        jwt.verify(coursewebToken, config.secret, async function (err, decoded) {

            console.log(decoded);
            if (err) {

                res.json(respones.failure(statusCode.NON_AUTHORITATIVE_INFORMATION, err, 'token fail', "#US001"));
            } else if (decoded.type == "Admin") {
                
                var query = { 'email': req.body.Email };
                var newValues = {

                    isEnable: req.body.IsEnable
                };

                Instructor.findOneAndUpdate(query, newValues, function (err, instructor) {

                    if (err) {

                        res.json(respones.failure(statusCode.NOT_MODIFIED, err, 'failed', "#PFU001"));
                    } else {

                        res.json(respones.success(statusCode.OK, 'success', "changed modifires Successfully.", { instructor: instructor.id }));
                    }
                });
            }
        });
    } catch (error) {

        console.log(error);
        res.json(respones.failure(statusCode.METHOD_FAILURE, error, 'execution fail', "#UNR004"));
    }
}

module.exports = {
    create,
    approve,
};
