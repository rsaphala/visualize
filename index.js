const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const monitorCtrl = require('./controllers/monitor');
// var request = require('request');
const app = express();
const PORT = process.env.PORT || 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// parse body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// bind static file
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/font-awesome', express.static(__dirname + '/node_modules/font-awesome/'));
app.use('/chart.js', express.static(__dirname + '/node_modules/chart.js/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.get('/', monitorCtrl.monitor);

app.listen(PORT, () => console.log(`Listen port ${PORT}`));

module.exports = app;