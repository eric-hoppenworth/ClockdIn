var express 		= require("express");
var app 			= express();
var passport		= require("passport");
var cookieParser	= require("cookie-parser");
var path 			= require("path");
var bodyParser 		= require("body-parser");
var session			= require("express-session");
var flash 			= require("connect-flash")
var db 				= require("./models");

var port = process.env.PORT || 8080;

//attach bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

//enable passport.js
app.use(session({ secret: 'teamemergencrymedicalservices' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var routes = require("./controllers/routes.js");
//connect router
app.use("/",routes);

//make static folder
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));


db.sequelize.sync().then(function() {
	app.listen(port,function(){
		console.log("listening on port "+ port);
	});
});