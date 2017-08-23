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

router.route("/dashboard").get(function(req,res){
	//This is in testing phase.
	//this is the object that is retrieved from the database.
	//for testing, I have used a hard coded object.
	var dbData = [
	    {
	        "name": "Eric",
	        "is_manager": false,
	        "Shifts": [
	            {
	                "id": 1,
	                "start_time": "09:00:00",
	                "end_time": "13:00:00",
	                "date": "2017-08-15T04:00:00.000Z",
	                "position": "Sushi",
	                "createdAt": "2017-08-19T19:13:14.000Z",
	                "updatedAt": "2017-08-19T19:13:14.000Z",
	                "EmployeeId": 1
	            },
	            {
	                "id": 2,
	                "start_time": "09:00:00",
	                "end_time": "13:00:00",
	                "date": "2017-08-25T04:00:00.000Z",
	                "position": "Sushi",
	                "createdAt": "2017-08-19T19:14:29.000Z",
	                "updatedAt": "2017-08-19T19:14:29.000Z",
	                "EmployeeId": 1
	            },
	            {
	                "id": 3,
	                "start_time": "09:00:00",
	                "end_time": "13:00:00",
	                "position": "BAP",
	                "date": "2017-08-22T04:00:00.000Z",
	                "createdAt": "2017-08-19T19:14:53.000Z",
	                "updatedAt": "2017-08-19T19:14:53.000Z",
	                "EmployeeId": 1
	            },
	            {
	                "id": 4,
	                "start_time": "09:00:00",
	                "end_time": "13:00:00",
	                "date": "2017-08-21T04:00:00.000Z",
	                "createdAt": "2017-08-21T01:36:07.000Z",
	                "updatedAt": "2017-08-21T01:36:07.000Z",
	                "EmployeeId": 1
	            },
	            {
	                "id": 5,
	                "start_time": "09:00:00",
	                "end_time": "13:00:00",
	                "date": "2017-08-28T04:00:00.000Z",
	                "createdAt": "2017-08-21T01:36:14.000Z",
	                "updatedAt": "2017-08-21T01:36:14.000Z",
	                "EmployeeId": 1
	            }
	        ]
	    },
	    {
	        "name": "Chris",
	        "is_manager": true,
	        // The first shift should not show up because it is not happening this week
	        "Shifts": [{
                "id": 1,
                "start_time": "09:00:00",
                "end_time": "16:00:00",
                "date": "2017-08-15T04:00:00.000Z",
                "position": "Kitchen",
                "createdAt": "2017-08-19T19:13:14.000Z",
                "updatedAt": "2017-08-19T19:13:14.000Z",
                "EmployeeId": 2
            },{
                "id": 1,
                "start_time": "09:00:00",
                "end_time": "16:00:00",
                "date": "2017-08-26T04:00:00.000Z",
                "position": "Kitchen",
                "createdAt": "2017-08-19T19:13:14.000Z",
                "updatedAt": "2017-08-19T19:13:14.000Z",
                "EmployeeId": 2
            }]
	    }
	];
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
	//send to Template for rendering.
	//currently it just sends to the browser
	//res.json(templateData);
	res.render("dashboard",{data: templateData})
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

router.route("/api/employee").get(function(req,res){
	Employee.findAll({
		attributes: ["name","is_manager"],
		include: [{
			model: Shift
		}]
	}).then(data => res.json(data));
});

//this route will be used to fill the weekly schedule
router.route("/api/employees/:weekStart").get(function(req,res){
	//week start should come in as a string "mm-dd-yyyy"
	//We will need a where clause to ensure that each shift's ".date" is between weekStart and weekEnd
	Employee.findAll({
		attributes: ["name","is_manager"],
		include: [{
			model: Shift
		}]
	}).then(data => res.json(data));
});



module.exports = router;