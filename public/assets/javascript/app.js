console.log("connected");


$(document).ready(function() {
    $('#modal1').modal();
    $("#addShift").modal();
    $("#addEmployee").modal();
    $("#alert").modal();
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

$("#alertClear").on("click",function(){
	$("#alertClear .modal-content").empty();
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