const express = require('express');
const morgan  = require('morgan');
const axios   = require('axios');

var cached    = {};

const app     = express();

app.use(morgan('dev'));

app.get('/', function(req, res) {
    //res.writeHead(200, {'Content-Type' : 'text/html'});
    if (req.query.i) {
        if (cached.hasOwnProperty(req.query.i)) {
            res.send(cached[req.query.i]);
            /* console.log('Cached request: ' + cached[req.query.i]); */
        } else {
            axiosI(req.query.i, res);
        }
    } else if (req.query.t) {
        req.query.t = req.query.t.replace(/ /g, '%20');
        if (cached.hasOwnProperty(req.query.t)) {
            res.send(cached[req.query.t]);
            /* console.log('Cached request: ' + cached[req.query.t]); */
        } else {
            axiosT(req.query.t, res);
        }
    }
    else {
        res.end('No i or t query!');
    }
});

function axiosI(movieId, res) {
    axios
        .get('http://www.omdbapi.com/?i=' + movieId + '&apikey=8730e0e')
        .then(function (response) {
            cached[movieId] = response.data;
            /* console.log('Remote request: ' + response.data.Title + ', ' + response.data.Year); */
            return res.send(response.data);
        })
        .catch(function (error){
            console.log(error.message);
        });
}

function axiosT(movieTitle, res) {
    axios
        .get('http://www.omdbapi.com/?t=' + movieTitle + '&apikey=8730e0e')
        .then(function (response) {
            cached[movieTitle] = response.data;
            /* console.log('Remote request: ' + response.data.Title + ', ' + response.data.Year); */
            return res.send(response.data);
        })
        .catch(function (error) {
            console.log(error.message);
        });
}



// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter

module.exports = app;