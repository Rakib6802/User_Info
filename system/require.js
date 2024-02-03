require('./validation').validate();
global.Config = require('../config/config');
require('../config/global');
path = require('path');
flash = require('express-flash');
const morgan = require('morgan');

express = require('express');
moment = require('moment-timezone');
if (!moment.tz.zone('Asia/Dhaka')) moment.tz.add("Asia/Dhaka|HMT +0630 +0530 +06 +07|-5R.k -6u -5u -60 -70|0121343|-18LFR.k 1unn.k HB0 m6n0 2kxbu 1i00|16e6");

app = express();
app.use(flash());
app.use(morgan('combined'));

// const cookie = require('cookie-parser');
const session = require('cookie-session');
app.use(session({
    secret: 'set',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: Config.session_expired,
        sameSite: true
    }
}));

app.locals.toUpperFirstAll = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};