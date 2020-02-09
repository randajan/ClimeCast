const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Handles any requests that don't match the ones above
app.get('/', (req,res) =>{
    const request = require('request');
    const coord = [req.query.lat, req.query.lon].join(",");
    const uri = [process.env.WEATHER_DOMAIN, process.env.WEATHER_KEY, coord].join("/")+"?lang=cs&exclude=minutely,hourly,daily,alerts,flags";
    console.log(uri);
    request(uri, function (error, response, body) {
        res.header('Access-Control-Allow-Origin', 'http://nas.me:3000');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept')
        res.status(response.statusCode).send(body);
    });
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);