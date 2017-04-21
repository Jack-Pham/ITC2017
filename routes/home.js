var express = require('express');
var router = express.Router();
var path = require('path');


/* GET home page */
router.get('/', function(req, res) {
    res.render('home', {title: "New Home"});
});



module.exports = router;
