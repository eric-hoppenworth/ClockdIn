const db = require("../models");
var router = require("express").Router();
var path = require("path");
var passport = require("passport");

const User = db.User;

router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}), 
	function(req, res) {
    	
	}
);

router.post('/login', passport.authenticate('local-signin', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}), 
	function(req, res) {
    	
	}
);

router.get("/success",function(req,res){
	res.json(true);
});

router.get("/failure",function(req,res){
	res.json(false);
});

module.exports = router;