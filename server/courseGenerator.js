var db = require('./models/DB');
var moment = require('moment');

var addressId = 1;
var coachId = 1;
var validDays = [2,4,5,6];
var validPeriods = {
					2:[{start:'14:00',end:'16:00',spotNumber:9},{start:'19:00',end:'21:00',spotNumber:9}]
					,4:[{start:'10:30',end:'12:00',spotNumber:9},{start:'19:00',end:'21:00',spotNumber:9}]
					,5:[{start:'14:00',end:'16:00',spotNumber:9},{start:'16:00',end:'18:00',spotNumber:9}]
					,6:[{start:'14:00',end:'16:00',spotNumber:9},{start:'16:00',end:'18:00',spotNumber:9}]
				    };
					
var dayInMillisecond = 86400000;
(function(){
	setInterval(function(){
		var current = moment();
		console.log('Starting creating course for date: ' + current.format('YYYY-MM-DD'));
		var dow = current.day();
		if(validDays.includes(dow)){
			for (i = 0; i < validPeriods[dow].length; i++) {
				var period = validPeriods[dow][i];
				var course = {date:current.format('YYYY-MM-DD'),start_time:period.start,end_time:period.end,spot_number:period.spotNumber,coachId:coachId,addressId:addressId}
                db.create(db.course,{date: course.date,start_time:course.start_time,end_time:course.end_time},course,function(){
                    console.log(course + "has been created");
                })
		        console.log(course);
			}
		}
	},3000);
})()
