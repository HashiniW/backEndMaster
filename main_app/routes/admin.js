var express = require('express');
var router = express.Router();

var Admin = require('../resource/admin');

router.route('/')
    .post(Admin.create);

router.route('/login')
    .post(Admin.login);

module.exports = router;