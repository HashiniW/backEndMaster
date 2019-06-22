var pwd = require('../controllers/password');
var jwt = require('jsonwebtoken');
var config = require('../constant/config');
var statusCode = require('../constant/status_codes');
var respones = require('../constant/responses');

var Course = require('../models/course');

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
                var course = new Course();

                course.name = req.body.Name;
                course.instructor = req.body.instructor;

                Course.findOne({ 'id': req.body._id }).exec(function (err, courses) {

                    if (err) {

                        res.json(respones.failure(statusCode.METHeOD_FAILURE, err, 'server_error', "#UNR000"));
                    } else {

                        if (courses !== null) {

                            res.json(respones.failure(statusCode.METHOD_FAILURE, "Looks like you’ve already registered that course.", 'user_already_exist', "#UNR001"));
                        } else {

                            course.save(function (err) {

                                if (err) {

                                    console.log(err);
                                    res.json(respones.failure(statusCode.METHOD_FAILURE, err, "server_error", "#UNR002"));
                                } else {

                                    res.json(respones.success(statusCode.OK, 'success', 'Created Successfully', {

                                        name: course.name,
                                        instructor: course.instructor,
                                        _id: course._id
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
function assign(req, res, next) {

    try {

        var coursewebToken = req.headers['courseweb-access-token'];
        jwt.verify(coursewebToken, config.secret, async function (err, decoded) {

            console.log(decoded);
            if (err) {

                res.json(respones.failure(statusCode.NON_AUTHORITATIVE_INFORMATION, err, 'token fail', "#US001"));
            } else if (decoded.type == "Admin") {
                
                var query = { '_id': new ObjectID(req.body.Id) };
                var newValues = {

                    instructor: req.body.Instructor,
                    isEnable: true
                };

                Course.findOneAndUpdate(query, newValues, function (err, instructor) {

                    if (err) {

                        res.json(respones.failure(statusCode.NOT_MODIFIED, err, 'failed', "#PFU001"));
                    } else {

                        res.json(respones.success(statusCode.OK, 'success', "changed modifires Successfully.", course));
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
    assign,
};

