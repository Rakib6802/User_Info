module.exports = (app) => {
    let { allRoutes } = require('./autoload');
    for (let key in allRoutes) {
        if (process.env.NODE_ENV != 'development' && (key == 'dev' || key == 'development')) continue;
        let route = allRoutes[key];
        if (route.prefix == '' || route.prefix == '/' || route.prefix == undefined) app.use('/', route.routes);
        else app.use('/' + route.prefix, route.routes);
    }
    //Didn't match any route then it'll be executed
    app.use(function (req, res) {
        return ApiErrorResponse(res, 'NOT_FOUND');
    });
    return app;
}