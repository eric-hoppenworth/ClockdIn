const db = require("../models");
var router = require("express").Router();
var path = require("path");
var moment = require("moment");

const Shift = db.Shift;
const Employee = db.Employee;

//HTML routing for home page
router.route("/").get(function(req,res){
	//res.sendFile(path.resolve("public/test.html"));
	res.render("splash");
});

router.route("/dashboard/:weekStart?").get(function(req,res){
	//This is in testing phase.
	//this is the object that is retrieved from the database.
	//for testing, I have used a hard coded object.
	var weekStart;
	var weekEnd;

	if (!req.params.weekStart) {
		weekStart = moment().startOf('week');
		weekEnd = moment().endOf('week');
	} else {
		weekStart = moment(req.params.weekStart).startOf('week');
		weekEnd = moment(weekStart).endOf("week");
	
	}
	
	Employee.findAll({
		attributes: ["name","is_manager"],
		include: [{
			model: Shift,
			where: {
				date: {
					$gt: weekStart,
					$lt: weekEnd
				}
			}
		}]
	}).then(function(dbData){
		//console.log(dbData);
		var weekDates = [];
		//insert dates for checking against(starts on the first day of the current week)
		for (var i = 0; i < 7; i ++){
			weekDates.push(moment().startOf('week').add(i,"day").format("MM-DD-YYYY"));
		}
		//properly formated dates for display on page
		var formatedDates = [];
		for (var i = 0; i < 7; i ++){
			formatedDates.push(moment().startOf('week').add(i,"day").format("MMM D ddd"));
		}
		//build Objects for entering into the template.
		var templateData = {
			rows: []
		};
		for(var i = 0; i < dbData.length;i++){
			var myEmployee = dbData[i];
			var myRow = {};
			myRow.name = myEmployee.name;
			myRow.days = [];
			for (var j = 0; j < 7; j++){
				myRow.days[j] = [];
				for (var k = 0; k < myEmployee.Shifts.length ; k++){
					var myShift = myEmployee.Shifts[k];
					var myDate = myShift.date;
					myDate = moment(myDate).format("MM-DD-YYYY");
					//if this shift happens to be on this day...
					if(weekDates[j] === myDate){
						var shift = {};
						shift.start = moment(myShift.start_time,"HH:mm:ss").format("h:mm a");
						shift.end = moment(myShift.end_time,"HH:mm:ss").format("h:mm a");
						shift.position = myShift.position;
						myRow.days[j].push(shift);
					}
				}
			}
			templateData.rows.push(myRow);
		}
		//attach week dates
		templateData.formatedDates = formatedDates;
		templateData.button.back = weekStart.add(-1,"day");
		templateData.button.forward = weekEnd.add(1,"day");
		//perform second query to get all employees
		Employee.findAll({
			attributes: ["id","name","is_manager"]
		}).then(function(empData){
			templateData.employees = empData;
			//send to Template for rendering.
			//currently it just sends to the browser
			res.render("dashboard",{data: templateData});
		});
		
	});
});


/////////////////////////////////
// ADD OR UPDATE SHIFTS /////////
/////////////////////////////////
router.route("/shifts/add").post(function(req,res){
	var newShift = req.body;
	console.log(newShift);
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

router.route("/employees/add").post(function(req,res){
	//no code yet
	var newEmployee = req.body;

	Employee.create(newEmployee)
		.then(data => res.json(data))
});

router.route("/employees/update").post(function(req,res){
	//no code yet
});

/////////////////////////////////
//  FIND SHIFT/EMPLOYEES   //////
/////////////////////////////////

router.route("/api/shifts").get(function(req,res){
	Shift.findAll({
		include: [{
			model: Employee,
			attributes: ["name","is_manager","id"]
		}]
	}).then(data => res.json(data) );
});

router.route("/api/shifts/:id").get(function(req,res){
	var myId = req.params.id;
	Shift.findOne({
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