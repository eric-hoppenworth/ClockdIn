const db = require("../models");
var router = require("express").Router();
var path = require("path");

const Shift = db.Shift;
const Employee = db.Employee;

//HTML routing for home page
router.route("/").get(function(req,res){
	//res.sendFile(path.resolve("public/test.html"));
	res.render("index");
});



/////////////////////////////////
// ADD OR UPDATE SHIFTS /////////
/////////////////////////////////
router.route("/shifts/add").post(function(req,res){
	var newShift = req.body;

	Shift.create(newShift)
		.then(data => res.json(data));
});

router.route("/shifts/update").post(function(){
	var myShift = req.body;

	Shift.update(myShift,{
		where: {
			id: myShift.id
		}
	}).then(data => res.json(data) );
});

/////////////////////////////////
// ADD OR UPDATE EMPLOYEES //////
/////////////////////////////////

router.route("/employee/add").post(function(req,res){
	//no code yet
});

router.route("/employee/update").post(function(req,res){
	//no code yet
});

/////////////////////////////////
//  FIND SHIFT/EMPLOYEES   //////
/////////////////////////////////

router.route("/api/shifts").get(function(req,res){
	Shifts.findAll({
		include: [{
			model: Employee,
			attributes: ["name","is_manager"]
		}]
	}).then(data => res.json(data) );
});

router.route("/api/shifts/:id").get(function(req,res){
	var myId = req.params.id;
	Shifts.findOne({
		include: [{
			model: Employee,
			attributes: ["name","is_manager"]
		}],
		where: {
			id: myId
		}
	}).then(data => res.json(data) );
});

module.exports = router;