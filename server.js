var express 	= require('express');
var app 		= express();
var passport 	= require('passport');
var session 	= require('express-session');
var bodyParser 	= require('body-parser');
var exphbs 		= require('express-handlebars');
var path 		= require("path");

var port = process.env.PORT || 8080;

//Models
var models = require("./models");

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


 // For Passport
app.use(session({ secret: 'team EMS',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport/passport.js')(passport,models.User);

//make static folder
app.use('/assets', express.static(path.join(__dirname, '/public/assets')));

//load helpers
var handlebars  = require('./helpers/helpers.js')(exphbs);
 //For Handlebars
//app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");


//Routes
var routes = require("./controllers/routes.js")(app, passport);


//Sync Database
models.sequelize.sync().then(function(){
	app.listen(port, function(err){
	    if(!err){
	    	console.log("Site is live on " + port);
	    }
	     else {
	 		console.log(err);
	 	}
	});

	})
	.catch(function(err){
		console.log(err,"Database failure")
	}
);




