require('./system/require');
// configure the app for post request data convert to json
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(flash());
const session = require('express-session');


app.use((req, res, next)=>{
    if(req.hostname.includes('localhost')){
        // enable cors for all routes
        let cors = require('cors');
        app.use(cors())
    }
    next();
})

app.use(session({
    secret: 'user-session-key', 
    resave: false,
    saveUninitialized: true
  }));

app = require('./system/route-init')(app);

//exception handle
app.use(function (err, req, res, next) {
    if (err.type == 'entity.too.large') ApiErrorResponse(res, 'TOO_LARGE_REQUEST_ENTITY');
    if (err.type == 'entity.parse.failed') ApiErrorResponse(res, 'INVALID_JSON_BODY');
    else {
        console.log('Catch in global error handler app.js:', err)
        ApiErrorResponse(res, 'SOMETHING_WENT_WRONG');
    }
})

exports.app = app;