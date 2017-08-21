console.log("connected");
$.get("/dashboard").then(function(data){
	console.log(data);
});