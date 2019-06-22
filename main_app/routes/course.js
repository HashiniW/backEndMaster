var express = require('express');
var router = express.Router();

var Instructor = require('../resource/course');

router.route('/')
    .post(Instructor.create);

router.route('/assign')
    .post(Instructor.assign);

module.exports = router;