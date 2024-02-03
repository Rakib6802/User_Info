const express = require('express');
require('../system/loader');
const auth = loadMiddleware('auth');
const route = express.Router();


exports.prefix = 'api/v1/auth';
route.post('/sign-up', auth, controller('user/userRegistration'));
route.post('/login', auth, controller('user/userLogin'));
route.post('/check-otp', auth, controller('user/checkOTP'));

exports.routes = route;
