console.log("connected");

$.get("/dashboard").then(function(data){
	console.log(data);
});

$(document).ready(function() {
    $('#modal1').modal();
    $('#modal2').modal();
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