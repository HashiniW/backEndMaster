var express = require('express');
var router = express.Router();


const admin = require('./admin');
const instructor = require('./instructor');
const course = require('./course');

router.use('/admin', admin);
router.use('/instructor', instructor);
router.use('/course', course);

module.exports = router;
