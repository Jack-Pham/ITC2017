var express = require('express');
var router = express.Router();

/* GET index page */
router.get('/', function(req, res) {
    res.render('index', {title: "New Home"});
});

router.post('/', function(req, res) {
    res.redirect('/home');
});

module.exports = router;
