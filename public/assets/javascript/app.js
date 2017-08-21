console.log("connected");

$.get("/dashboard").then(function(data){
	console.log(data);
});

$(document).ready(function() {
    $('#modal1').modal();
});