var myDay = "2017-08-20";
var checkStart = moment(myDay,"YYYY-MM-DD").hour(6);
var checkEnd = moment(checkStart).add(1,"hour");

var myShift = {
	start_time: "10:00:00",
	end_time: "17:00:00",
	date: "2017-08-20 05:00:00"
};
//Start_time must be 6am or Later
//end_time can be 5:00am at the latest
//if end_time is less than "06:00:00" then it should be on the NEXT day

//IF the end time is on the next day, this may not work
var shiftDate = myShift.date.substring(0,11);
var shiftStart = moment(shiftDate + myShift.start_time)
var shiftEnd = moment(shiftDate + myShift.end_time)
//basically, if the end time is between the start of the day and the start time, it needs to be moved to tomorrow.
if(shiftEnd.isBetween( moment(shiftStart).startOf("day"),moment(shiftStart) ,null,"[)")){
	shiftEnd.add(1,"day");
}

var shiftHours = [];
var hours = [];

for(var i = 0; i < 24 ; i++){
	checkStart = moment(myDay, "YYYY-MM-DD").hour(6+i);
	checkEnd = moment(checkStart).add(1,"hour");
	if( shiftStart.isBetween(checkStart,checkEnd,null,"[)") ){
		shiftHours[i] = "start";
	}else if( checkStart.isBetween(shiftStart,shiftEnd,null, "[)") ){
		shiftHours[i] = "middle";
	}else if( shiftEnd.isBetween(checkStart,checkEnd,null,"[)") ){
		shiftHours[i] = "end";
	}else{
		shiftHours[i] = "none";
	}
	hours.push(checkStart.format("HH:mm"));
}