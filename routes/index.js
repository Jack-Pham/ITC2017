var express = require('express');
var router = express.Router();
var path = require('path');

/* GET index page */
router.get('/', function(req, res, next) {
	res.render('index');
});

/* GET home page */

router.get('/home', function(req, res, next) {
	res.render('home');
});


module.exports = router;
