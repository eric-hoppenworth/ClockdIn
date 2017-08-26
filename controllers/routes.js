const db = require("../models");
var router = require("express").Router();
var path = require("path");
var moment = require("moment");
var passport = require("passport");

const Shift = db.Shift;
const Employee = db.Employee;
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

	router.route("/day/:dayStart?").get(function (req, res) {
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
				templateData.dayHours.push(moment(myDay).hour(6 + i).format("h:mm A"));
			}

			for (var i = 0; i < dbData.length; i++) {
				var myEmployee = dbData[i];
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
					var shiftHours = [];

					for (var i = 0; i < 24; i++) {
						checkStart = moment(myDay).hour(6 + i);
						checkEnd = moment(checkStart).add(1, "hour");
						if (shiftStart.isBetween(checkStart, checkEnd, null, "[)")) {
							shiftHours[i] = moment(myShift.start_time, "HH:mm:ss").format("h:mm A");
						} else if (checkStart.isBetween(shiftStart, shiftEnd, null, "[)")) {
							shiftHours[i] = "middle";
						} else if (shiftEnd.isBetween(checkStart, checkEnd, null, "[)")) {
							shiftHours[i] = moment(myShift.end_time, "HH:mm:ss").format("h:mm A");
						} else {
							shiftHours[i] = null;
						}
					}
					myRow.hours[j] = shiftHours;
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
				}).then(function (res) {
					templateData.userInfo.isManager = res.is_manager;
					templateData.userInfo.name = res.name;
					//send to Template for rendering.
					//currently it just sends to the browser
					//res.json(templateData);
					console.log(templateData);
					res.render("dashboard", {
						data: templateData
					});
				});
			});
		});
	});

	// passport.authenticate("local-signin")
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
				formatedDates.push(moment(weekStart).add(i, "day").format("MMM D ddd"));
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
				}).then(function (res) {
					templateData.userInfo.isManager = res.is_manager;
					templateData.userInfo.name = res.name;
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
		var newShift = req.body;
		console.log(newShift);
		Shift.create(newShift)
			.then(data => res.json(data));
	});

	router.route("/shifts/update").post(function () {
		var myShift = req.body;
		Shift.update(myShift, {
			where: {
				id: myShift.id
			}
		}).then(data => res.json(data));
	});

	/////////////////////////////////
	// ADD OR UPDATE EMPLOYEES //////
	/////////////////////////////////

	router.route("/employees/add").post(function (req, res) {
		//no code yet
		var newEmployee = req.body;
		Employee.create(newEmployee)
			.then(data => res.json(data))
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
};