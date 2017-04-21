var express = require('express');
var router = express.Router();
var path = require('path');
var spotcrime = require('spotcrime');

/* GET index page */
router.get('/', function(req, res) {
    res.render('index', {title: "New Home"});
});

router.post('/', function(req, res) {
    res.redirect('/home');
});

router.post('/crime',function(req, res, next) {

		var data = req.body;
		var loc = {
		  lat: data.lat,
		  lon: data.lng
		};

		var radius = 0.1; // this is miles

		spotcrime.getCrimes(loc, radius, function(err, crimes){
				res.send(crimes);
		});

});

module.exports = router;
