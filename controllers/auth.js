const db = require("../models");
var router = require("express").Router();
var path = require("path");

const User = db.User;

//passport.authenticate
router.route("/signup").post(
	passport.authenticate('local-signup', {
		successRedirect: '/dashboard',
		failureRedirect: '/signup'
	});
);

router.route("/signin").post(
	passport.authenticate('local-signin', {
		successRedirect: '/dashboard',
		failureRedirect: '/signin'
	}
);

module.exports = router;