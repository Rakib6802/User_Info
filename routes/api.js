const express = require('express');
require('../system/loader');
const auth = loadMiddleware('auth');
const route = express.Router();

exports.prefix = 'api/v1';

//user information
route.post('/user-information-update',auth, controller('user/userInformationUpdate'));
route.post('/user-information',auth, controller('user/getuserInformation'));
route.get('/all-user-information',auth, controller('user/getAllUserInformation'));

exports.routes = route;
