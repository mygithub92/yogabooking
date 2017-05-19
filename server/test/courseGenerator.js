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
		var formattedCurrent = current.format('YYYY-MM-DD');
		console.log('Starting creating course for date: ' + formattedCurrent);
		var dow = current.day();
		if(validDays.indexOf(dow) > -1){
			var courses = [];
			for (i = 0; i < validPeriods[dow].length; i++) {
				var period = validPeriods[dow][i];
				courses[i] = {date:formattedCurrent,start_time:period.start,end_time:period.end,spot_number:period.spotNumber}
			}
		}
		console.log(courses);
	},3000);
})()