const db = require("../models");
var router = require("express").Router();
var path = require("path");

//HTML routing for home page
router.route("/").get(function(req,res){
	res.sendFile(path.resolve("public/test.html"));
});



module.exports = router;