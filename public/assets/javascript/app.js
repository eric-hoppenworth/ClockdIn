console.log("connected");


$(document).ready(function() {
    $('#modalLogin').modal();
    $('#modalSignup').modal();
    $("#addShift").modal();
    $("#addEmployee").modal();
    $("#alert").modal();
    $("select").material_select();

    $('#modal2').modal();
});


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
	$.post("/shifts/add",myShift,function(data,err){
		console.log("done");
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

	$.post("/auth/signUp",myUser,function(data,err){

		//be sure that you sign in the newly created user
		if(data){
			window.location.href = window.location.origin + '/dashboard';
		}else{
			console.log("signup failed");
		}
	});
});


$("#alertClear").on("click",function(){
	$("#alert .modal-content").empty();
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
});

$(".month-btn").click( function() {
	$(this).addClass("week-month-selected");
	$(".week-btn").removeClass("week-month-selected");
});

$(".week-btn").click( function() {
	$(this).addClass("week-month-selected");
	$(".month-btn").removeClass("week-month-selected");
});

$(".arrowBtn").on("click",function(){
	if($(this).attr("data-type") === "week"){
		var redirectUrl = "/dashboard/" + $(this).attr("data-value");
	} else if($(this).attr("data-type") === "day"){
		var redirectUrl = "/day/" + $(this).attr("data-value");
	}
	
	window.location.href = window.location.origin + redirectUrl;
});
