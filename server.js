const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var db = require("./models");

var app = express();


//attach bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

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