var express = require('express');
var connect = require('connect');
var path = require('path');
var nodeMailer = require('nodemailer');
var bodyParser = require('body-parser');
var cors=require('cors');
var routes = require('./routes/router');
var app = express();

// Configuration
//app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

var server = app.listen(3100, function () {
    console.log("Listening on port %s...", server.address().port);
});