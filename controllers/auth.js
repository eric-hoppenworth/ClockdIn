const db = require("../models");
var router = require("express").Router();
var path = require("path");
var passport = require("passport");

const User = db.User;

router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/dashboard',
		failureRedirect: '/'
	}), 
	function(req, res) {
    	res.redirect('/');
	}
);

router.post('/signin', passport.authenticate('local-signin', {
		successRedirect: '/dashboard',
		failureRedirect: '/'
	}), 
	function(req, res) {
    	res.redirect('/');
	}
);


module.exports = router;