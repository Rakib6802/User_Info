module.exports = async function (req, res, next) {
    let username = null;
    let password = null;
    const api_user = process.env.API_USER || 'test';
    const api_key = process.env.API_KEY || '123123';

    const authheader = req.headers.authorization;
    console.log(req.headers);
    if (!authheader) {
        return ApiErrorResponse(res, 'AUTH_FAILURE', 'Your provided Username/Password is invalid');
    }
 
    const auth = new Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    if (api_user == user && api_key == pass) {
        // If Authorized user
        next();
    } else {
        return ApiErrorResponse(res,'ACCESS_DENIED','Your Username/Password is invalid');
    }
    
/*
    if (req.fields) {
        if (req.fields.username == undefined || req.fields.password == undefined) {
            return ApiErrorResponse(res, 'AUTH_FAILURE', 'Your provided Username/Password is invalid');
        }
        if (req.fields.username == '' || req.fields.password == '' || req.fields.file == '') {
            return ApiErrorResponse(res, 'AUTH_FAILURE', 'Your provided Username/Password is invalid');
        }
        //for form-data
        username = req.fields.username;
        password = req.fields.password;
    }
    else if (req.body) {
        if (req.body.username == undefined || req.body.password == undefined) {
            return ApiErrorResponse(res, 'AUTH_FAILURE', 'Your provided Username/Password is invalid');
        }

        if (req.body.username == '' || req.body.password == '' || req.body.file == '') {
            return ApiErrorResponse(res, 'AUTH_FAILURE', 'Your provided Username/Password is invalid');
        }
        //for JSON-data
        username = req.body.username;
        password = req.body.password;
    }
    else {
        return ApiErrorResponse(res,'ACCESS_DENIED','Your Username/Password is invalid');
    }


    try {

        if (!(username && password)) return ApiErrorResponse(res,'ACCESS_DENIED','Your Username/Password is invalid');
        if (username != api_user || password != api_key) return ApiErrorResponse(res, 'AUTH_FAILURE', 'Your provided Username/Password is invalid');

        console.log(`--------------------Auth successful by ${api_user}------------------------`);
        next();
    }
    catch (error) {
        return ApiErrorResponse(res, 'AUTH_FAILURE', 'Your provided Username/Password is invalid');
    }*/
};