function emptyAlert(){
	$("#alert .modal-content").empty();
	window.location.reload(true);
}


$(document).ready(function() {
    $('#modalLogin').modal();
    $('#modalSignup').modal();
    $("#addShift").modal();
    $("#addEmployee").modal();
    $("#alert").modal({
    	complete: emptyAlert
    });
    $("#setAvailability").modal();
    $("#override").modal();
    $("select").material_select();

    $('#modal2').modal();
});

$("#logout").on("click", function() {
	$.get("/auth/logout", function(data, err) {
		window.location.href = window.location.origin;
	})
})

$("#empSubmit").on("click",function(){
	var myEmployee =  {};
	myEmployee.name = $("#empName").val().trim();
	myEmployee.date_of_birth = $("#empDob").val().trim();
	myEmployee.is_manager = $("#empManager").prop('checked');

	$.post("/employees/add",myEmployee,function(data,err){
		//window.location.href = window.location.origin + '/dashboard';
		console.log("done");
		console.log(data);
		$("#alert .modal-content").append("<h3> Your new employee's id is:</h3>");
		$("#alert .modal-content").append("<h1>"+data.id+"</h1>");
		$("#alert .modal-content").append("<h3> Be sure to share it with them when they create an account.</h3>");
		$("#alert").modal('open');
	});
	$("#empName").val("");
	$("#empDob").val("");
});

$("#shiftSubmit").on("click",function(){
	var myShift = {};
	myShift.start_time = $("#shiftStart").val();
	myShift.end_time = $("#shiftEnd").val();
	myShift.date = moment($("#shiftDate").val(),"YYYY-MM-DD").hour(12).format();
	myShift.position = $("#shiftPosition").val();
	myShift.EmployeeId = $("#shiftName").val();
	console.log(myShift);
	$.post("/shifts/add",myShift,function(data,err){
		if(data.isValid){
			//reload page
			window.location.reload(true);
		} else if(data.data){
			//this means that I am outside of availability, need to ask if OK
			$("#availStart").text(data.data.start);
			$("#availEnd").text(data.data.end);
			$("#btnOverride").attr("data-value",JSON.stringify(data.data.newShift));
			$("#override").modal("open");
		}else{
			$("#alert .modal-content").append("<h3>This shift overlaps with an already scheduled shift</h3>");
			$("#alert").modal('open');
		}
	});
});

$("#loginSubmit").on("click",function(){
	var myUser = {};
	myUser.email = $("#loginEmail").val().trim();
	myUser.password = $("#loginPassword").val();

	$.post("/auth/login",myUser,function(data,err){
		//be sure that you sign in the newly created user
		if(data){
			window.location.href = window.location.origin + '/dashboard';
		}else{
			console.log("signin failed");
		}
	});
});

$("#signupSubmit").on("click",function(){
	var myUser = {};
	myUser.email = $("#signupEmail").val().trim();
	myUser.password = $("#signupPassword").val();
	myUser.EmployeeId = $("#signupId").val();
	myUser.imageURL = $("#signupImageURL").val();

	$.post("/auth/signup",myUser,function(data,err){

		//be sure that you sign in the newly created user
		if(data){
			window.location.href = window.location.origin + '/dashboard';
		}else{
			console.log("signup failed");
		}
	});
});

$("#btnOverride").on("click",function(){
	var newShift = JSON.parse($(this).attr("data-value"));
	console.log(newShift);
	$.post("/shifts/override",newShift,function(data,err){
		window.location.reload(true);
	});
});



$("#submitAvailability").on("click",function(){

	var myAvail = {};
	if($("#mondayStart").val()){
		myAvail.monday_start = $("#mondayStart").val();
	}
	if($("#mondayEnd").val()){
		myAvail.monday_end = $("#mondayEnd").val();
	}

	if($("#tuesdayStart").val()){
		myAvail.tuesday_start = $("#tuesdayStart").val();
	}
	if($("#tuesdayEnd").val()){
		myAvail.tuesday_end = $("#tuesdayEnd").val();
	}

	if($("#wednesdayStart").val()){
		myAvail.wednesday_start = $("#wednesdayStart").val();
	}
	if($("#wednesdayEnd").val()){
		myAvail.wednesday_end = $("#wednesdayEnd").val();
	}

	if($("#thursdayStart").val()){
		myAvail.thursday_start = $("#thursdayStart").val();
	}
	if($("#thursdayEnd").val()){
		myAvail.thursday_end = $("#thursdayEnd").val();
	}

	if($("#fridayStart").val()){
		myAvail.friday_start = $("#fridayStart").val();
	}
	if($("#fridayEnd").val()){
		myAvail.friday_end = $("#fridayEnd").val();
	}

	if($("#saturdayStart").val()){
		myAvail.saturday_start = $("#saturdayStart").val();
	}
	if($("#saturdayEnd").val()){
		myAvail.saturday_end = $("#saturdayEnd").val();
	}

	if($("#sundayStart").val()){
		myAvail.sunday_start = $("#sundayStart").val();
	}
	if($("#sundayEnd").val()){
		myAvail.sunday_end = $("#sundayEnd").val();
	}
	myAvail.EmployeeId = $(this).attr("data-value")
	$.post("/availability/update/",myAvail,function(data,err){
		window.location.reload(true);
	});
});

var datetime = null,
        date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format('MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
    datetime = $('#current-time-display')
    update();
    setInterval(update, 1000);
    Materialize.updateTextFields();
});

$(".day-btn").click( function() {
	// $(this).addClass("week-month-selected");
	// $(".week-btn").removeClass("week-month-selected");
	window.location = window.location.origin + "/day";
});

$(".week-btn").click( function() {
	// $(this).addClass("week-month-selected");
	// $(".month-btn").removeClass("week-month-selected");
	window.location = window.location.origin + "/dashboard";
});

$(".arrowBtn").on("click",function(){
	if($(this).attr("data-type") === "week"){
		var redirectUrl = "/dashboard/" + $(this).attr("data-value");
	} else if($(this).attr("data-type") === "day"){
		var redirectUrl = "/day/" + $(this).attr("data-value");
	}
	
	window.location.href = window.location.origin + redirectUrl;
});
