const db = require("../models");
var router = require("express").Router();
var path = require("path");
var moment = require("moment");
var passport = require("passport");

const Shift = db.Shift;
const Employee = db.Employee;
const Availability = db.Availability;
module.exports = function (router, passport) {

	//HTML routing for home page
	router.route("/").get(function (req, res) {
		//res.sendFile(path.resolve("public/test.html"));
		res.render("splash");
	});

	router.post('/auth/signup', passport.authenticate('local-signup', {
			successRedirect: '/auth/success',
			failureRedirect: '/auth/failure'
		}),
		function (req, res) {

		}
	);

	router.post('/auth/login', passport.authenticate('local-signin', {
			successRedirect: '/auth/success',
			failureRedirect: '/auth/failure'
		}),
		function (req, res) {

		}
	);

	router.get("/auth/success", function (req, res) {
		res.json(true);
	});

	router.get("/auth/failure", function (req, res) {
		res.json(false);
	});

	router.get("/auth/logout", function (req, res) {
		req.session.destroy(function (err) {
			res.redirect('/');
		});
	})

	router.get("/day/:dayStart?",isLoggedIn,function (req, res) {
		//TESTING
		var dayStart;
		var dayEnd;
		if (!req.params.dayStart) {
			dayStart = moment().hour(6);
			dayEnd = moment(dayStart).add(23, "hour");
		} else {
			dayStart = moment(req.params.dayStart).hour(6);
			dayEnd = moment(dayStart).add(23, "hour");
		}
		Employee.findAll({
			attributes: ["name", "is_manager"],
			include: [{
				model: Shift,
				where: {
					date: {
						$gt: dayStart,
						$lt: dayEnd
					}
				}
			}]
		}).then(function (dbData) {
			// testing
			var myDay = req.params.dayStart;
			var checkStart = moment(myDay).hour(6);
			var checkEnd = moment(checkStart).add(1, "hour");
			var templateData = {
				rows: []
			};

			templateData.dayHours = [];
			for (var i = 0; i < 24; i++) {
				templateData.dayHours.push(moment(myDay).hour(6 + i).format("h a"));
			}
			for (var k = 0; k < dbData.length; k++) {
				var myEmployee = dbData[k];
				var myRow = {};
				myRow.name = myEmployee.name;
				myRow.hours = [];
				for (var j = 0; j < myEmployee.Shifts.length; j++) {
					var myShift = myEmployee.Shifts[j];
					var shiftDate = moment(myShift.date).format("YYYY-MM-DD");
					var shiftStart = moment(shiftDate + " " + myShift.start_time)
					var shiftEnd = moment(shiftDate + " " + myShift.end_time)
					//basically, if the end time is between the start of the day and the start time, it needs to be moved to tomorrow.
					if (shiftEnd.isBetween(moment(shiftStart).startOf("day"), moment(shiftStart), null, "[)")) {
						shiftEnd.add(1, "day");
					}
					//if this shift happens to be on this day...
					for (var i = 0; i < 24; i++) {
						checkStart = moment(myDay).hour(6 + i);
						checkEnd = moment(checkStart).add(1, "hour");
						if (shiftStart.isBetween(checkStart, checkEnd, null, "[)")) {
							myRow.hours[i] = moment(myShift.start_time, "HH:mm:ss").format("h:mm a");
						} else if (checkStart.isBetween(shiftStart, shiftEnd, null, "[)")) {
							myRow.hours[i] = "middle";
						} else if (shiftEnd.isBetween(checkStart, checkEnd, null, "[)")) {
							myRow.hours[i] = moment(myShift.end_time, "HH:mm:ss").format("h:mm a");
						} else if(!myRow.hours[i]){
							myRow.hours[i] = null;
						}
					}
				}
				templateData.rows.push(myRow);
			}
			//Now that each employee is set, add in the meta-data
			templateData.head = {};
			templateData.head.type = "day";
			templateData.head.back = moment(myDay).startOf('day').add(-1, "day").format();
			templateData.head.forward = moment(myDay).startOf('day').add(1, "day").format();
			templateData.head.middle = moment(myDay).format("MMMM DD dddd");
			//perform second query to get all employees
			templateData.userInfo = {};
			Employee.findAll({
				attributes: ["id", "name", "is_manager"]
			}).then(function (empData) {
				templateData.employees = empData;
				templateData.userInfo.imageURL = req.user.imageURL;
				Employee.findOne({
					where: {
						id: req.user.EmployeeId
					}
				}).then(function (infoData) {
					templateData.userInfo.isManager = infoData.is_manager;
					templateData.userInfo.name = infoData.name;
					templateData.userInfo.id = infoData.id;
					//send to Template for rendering.
					//currently it just sends to the browser
					//res.json(templateData);
					res.render("dashboard", {
						data: templateData
					});
				});
			});
		});
	});

	// passport.authenticate("local-signin")
	// router.get("/dashboard/:weekStart?", function (req, res) {
	router.get("/dashboard/:weekStart?", isLoggedIn, function (req, res) {
		console.log(req.user);
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
			attributes: ["name", "is_manager"],
			include: [{
				model: Shift,
				where: {
					date: {
						$gt: weekStart,
						$lt: weekEnd
					}
				}
			}]
		}).then(function (dbData) {
			//console.log(dbData);
			var weekDates = [];
			//insert dates for checking against(starts on the first day of the current week)
			for (var i = 0; i < 7; i++) {
				weekDates.push(moment(weekStart).add(i, "day").format("MM-DD-YYYY"));
			}
			//properly formated dates for display on page
			var formatedDates = [];
			for (var i = 0; i < 7; i++) {
				formatedDates.push(moment(weekStart).add(i, "day").format("D ddd"));
			}
			//build Objects for entering into the template.
			var templateData = {
				rows: []
			};
			for (var i = 0; i < dbData.length; i++) {
				var myEmployee = dbData[i];
				var myRow = {};
				myRow.name = myEmployee.name;
				myRow.days = [];
				for (var j = 0; j < 7; j++) {
					myRow.days[j] = [];
					for (var k = 0; k < myEmployee.Shifts.length; k++) {
						var myShift = myEmployee.Shifts[k];
						var myDate = myShift.date;
						myDate = moment(myDate).format("MM-DD-YYYY");
						//if this shift happens to be on this day...
						if (weekDates[j] === myDate) {
							var shift = {};
							shift.start = moment(myShift.start_time, "HH:mm:ss").format("h:mm a");
							shift.end = moment(myShift.end_time, "HH:mm:ss").format("h:mm a");
							shift.position = myShift.position;
							myRow.days[j].push(shift);
						}
					}
				}
				templateData.rows.push(myRow);
			}
			//attach week dates
			templateData.formatedDates = formatedDates;
			templateData.head = {};
			templateData.head.type = "week";
			templateData.head.back = weekStart.add(-1, "day").format();
			templateData.head.forward = weekEnd.add(1, "day").format();
			templateData.head.middle = weekStart.format("MMMM") + " " + weekStart.add(1, 'day').format("DD") + " - " + weekEnd.add(-1, 'day').format("DD");
			//perform second query to get all employees
			templateData.userInfo = {};
			Employee.findAll({
				attributes: ["id", "name", "is_manager"]
			}).then(function (empData) {
				templateData.employees = empData;
				templateData.userInfo.imageURL = req.user.imageURL;
				Employee.findOne({
					where: {
						id: req.user.EmployeeId
					}
				}).then(function (infoData) {
					templateData.userInfo.isManager = infoData.is_manager;
					templateData.userInfo.name = infoData.name;
					templateData.userInfo.id = infoData.id;
					//send to Template for rendering.
					//currently it just sends to the browser
					//res.json(templateData);
					res.render("dashboard", {
						data: templateData
					});
				})
			});
		});
	});

	/////////////////////////////////
	// ADD OR UPDATE SHIFTS /////////
	/////////////////////////////////
	router.route("/shifts/add").post(function (req, res) {
		var isValid = true;

		var newShift = req.body;
		var shiftDate = moment(newShift.date).format("YYYY-MM-DD");
		var shiftStart = moment(shiftDate + " " + newShift.start_time);
		var shiftEnd = moment(shiftDate + " " + newShift.end_time);
		//basically, if the end time is between the start of the day and the start time, it needs to be moved to tomorrow.
		if (shiftEnd.isBetween(moment(shiftStart).startOf("day"), shiftStart, null, "[)")) {
			shiftEnd.add(1, "day");
		}
		// We need to check to see if this new shift overlaps with any current shifts
		Shift.findAll({
			where: {
				EmployeeId: newShift.EmployeeId,
				date: newShift.date
			}
		}).then(function(shiftData){
			//This grabs the shifts for the same day as the one that is trying to be added
			for (var i = 0; i < shiftData.length; i ++){
				var myShift = shiftData[i];
				var shiftDate = moment(myShift.date).format("YYYY-MM-DD");
				var checkStart = moment(shiftDate + " " + myShift.start_time)
				var checkEnd = moment(shiftDate + " " + myShift.end_time)
				//basically, if the end time is between the start of the day and the start time, it needs to be moved to tomorrow.
				if (checkEnd.isBetween(moment(checkStart).startOf("day"), moment(checkStart), null, "[)")) {
					checkEnd.add(1, "day");
				}

				//if the start(or end) of the new shift is between any one of the checkShifts...
				if(shiftStart.isBetween(checkStart,checkEnd,null,"()") || shiftEnd.isBetween(checkStart,checkEnd,null,"()") ){
					isValid = false;
				} else if(checkStart.isBetween(shiftStart,shiftEnd,null,"()")){
					//My new shift completely overlaps an existing one
					isValid = false;
				}
			}
			if(isValid){
				//check to see if that shift is within the employee's availability
				checkAvail(newShift).then(function(availResult){
					if(availResult.isValid){
						Shift.create(newShift).then(function(data){
							res.json({isValid: true, data:data});
						});
					} else {
						res.json(availResult);
					}
				});
			} else {
				res.json({isValid: false, data: null})
			}
		});
	});

	router.route("/shifts/update").post(function (req,res) {
		var myShift = req.body;
		Shift.update(myShift, {
			where: {
				id: myShift.id
			}
		}).then(data => res.json(data));
	});

	router.route("/shifts/override").post(function (req,res) {
		var newShift = req.body;
		Shift.create(newShift)
			.then(data => res.json(data));
	});

	///////////////////////////////////
	// Update Availability     ////////
	///////////////////////////////////

	router.post("/availability/update",function(req,res){
		var newAvail = req.body
		Availability.update(newAvail,{
			where:{
				EmployeeId: newAvail.EmployeeId
			}
		});
	});


	/////////////////////////////////
	// ADD OR UPDATE EMPLOYEES //////
	/////////////////////////////////

	router.route("/employees/add").post(function (req, res) {
		//no code yet
		var newEmployee = req.body;
		Employee.create(newEmployee).then(function(data){
			Availability.create({EmployeeId: data.id}).then(function(moreData){
				res.json(moreData);
			})
		});
	});

	router.route("/employees/update").post(function (req, res) {
		//no code yet
	});

	/////////////////////////////////
	//  FIND SHIFT/EMPLOYEES   //////
	/////////////////////////////////

	router.route("/api/shifts").get(function (req, res) {
		Shift.findAll({
			include: [{
				model: Employee,
				attributes: ["name", "is_manager", "id"]
			}]
		}).then(data => res.json(data));
	});

	router.route("/api/shifts/:id").get(function (req, res) {
		var myId = req.params.id;
		Shift.findOne({
			include: [{
				model: Employee,
				attributes: ["name", "is_manager"]
			}],
			where: {
				id: myId
			}
		}).then(data => res.json(data));
	});

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();

		res.redirect('/');
	}

	function checkAvail(newShift){
		var shiftDate = moment(newShift.date).format("YYYY-MM-DD");
		var shiftStart = moment(shiftDate + " " + newShift.start_time);
		var shiftEnd = moment(shiftDate + " " + newShift.end_time);
		var format = "YYYY-MM-DD HH:mm:ss";
		//basically, if the end time is between the start of the day and the start time, it needs to be moved to tomorrow.
		if (shiftEnd.isBetween(moment(shiftStart).startOf("day"), shiftStart, null, "[)")) {
			shiftEnd.add(1, "day");
		}
		return new Promise(function(resolve,reject){
			Availability.findOne({
				where: {
					EmployeeId: newShift.EmployeeId
				}
			}).then(function(data){
				var myDay = moment(newShift.date).day();
				var availStart;
				var availEnd;
				switch (myDay){
					case 0:
						availStart = moment(shiftDate + " " + data.sunday_start,format);
						availEnd = moment(shiftDate + "  "+ data.sunday_end,format);
						break;
					case 1:
						availStart = moment(shiftDate + " " + data.monday_start,format);
						availEnd = moment(shiftDate + "  "+ data.monday_end,format);
						break;
					case 2:
						availStart = moment(shiftDate + " " + data.tuesday_start,format);
						availEnd = moment(shiftDate + "  "+ data.tuesday_end,format);
						break;
					case 3:
						availStart = moment(shiftDate + " " + data.wednesday_start,format);
						availEnd = moment(shiftDate + "  "+ data.wednesday_end,format);
						break;
					case 4:
						availStart = moment(shiftDate + " " + data.thursday_start,format);
						availEnd = moment(shiftDate + "  "+ data.thursday_end,format);
						break;
					case 5:
						availStart = moment(shiftDate + " " + data.friday_start,format);
						availEnd = moment(shiftDate + "  "+ data.friday_end,format);
						break;
					case 6:
						availStart = moment(shiftDate + " " + data.saturday_start,format);
						availEnd = moment(shiftDate + "  "+ data.saturday_end,format);
						break;
				}
				if (availEnd.isBetween(moment(availStart).startOf("day"), availStart, null, "[)")) {
					availEnd.add(1, "day");
				}
				//OK now check
				console.log("///////////////////////////")
				console.log(myDay);
				console.log(data.tuesday_start);
				console.log(data.tuesday_end);
				console.log(availStart);
				console.log(availEnd);
				console.log(shiftStart);
				console.log(shiftEnd);
				console.log("///////////////////////////")
				if(shiftStart.isBetween(availStart,availEnd,null,"[]") && shiftEnd.isBetween(availStart,availEnd,null,"[]") ){
					console.log("within avail")
					var result ={
						isValid: true, 
						data: {
							start: availStart.format("hh:mm a"),
							end: availEnd.format("hh:mm a"),
							newShift: newShift
						}
					};
					resolve(result);
				} else {
					//My new shift completely overlaps availability
					console.log("outside of Avail")
					var result = {
						isValid: false, 
						data: {
							start: availStart.format("hh:mm a"),
							end: availEnd.format("hh:mm a"),
							newShift: newShift
						}
					};
					resolve(result);
				}
			});
		})
		
	}
};


