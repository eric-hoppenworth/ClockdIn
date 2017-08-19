var express    = require('express')
var app        = express()
var passport   = require('passport')
var session    = require('express-session')
var bodyParser = require('body-parser')
var exphbs     = require('express-handlebars')

var port = process.env.PORT || 8080;

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


 // For Passport
app.use(session({ secret: 'team EMS',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


 //For Handlebars
app.set('views', './public/views')
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');


//Models
var models = require("./models");


//Routes
var authRoute = require('./controllers/auth.js')(app,passport);


//load passport strategies
require('./config/passport/passport.js')(passport,models.user);


//Sync Database
   models.sequelize.sync().then(function(){
console.log('Database connected')

}).catch(function(err){
console.log(err,"Database failure")
});



app.listen(port, function(err){
    if(!err)
    console.log("Site is live on " + port); else console.log(err)

});



app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


