const dotenv = require('dotenv');
dotenv.config();

let { app } = require('./app');

const http = require('http');
const fs = require('fs');
const https = require('https');


var server = http.createServer(app, (req, res) => {
    // console.log(req.headers);
    if (process.env.HTTPS_MODE == 'on') {
        res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
        res.end();
    }
});

server.listen(process.env.HTTPS_PORT, () => {
    console.log(`Https Listening on port: http://localhost:${process.env.HTTPS_PORT}`);
});
