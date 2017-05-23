var db = require('./models/DB');
var moment = require('moment');
const config = require('./config');

var validDays = [2,4,6];
var validPeriods = {
    2:[{start:'14:00:00',end:'16:00:00',spotNumber:9},{start:'19:00:00',end:'21:00:00',spotNumber:9}]
    ,4:[{start:'10:30:00',end:'12:00:00',spotNumber:9},{start:'19:00:00',end:'21:00:00',spotNumber:9}]
    ,6:[{start:'14:00:00',end:'16:00:00',spotNumber:9},{start:'16:00:00',end:'18:00:00',spotNumber:9}]
};
var coach = {id:1,name:'Jin Jin',level:7}
var address = {id:1,address:'68 Lascelles Avenue Warradale SA'}

var dayInMillisecond = 86400000;
(function(){
    if(!config.intialize){
        setInterval(function(){
            var current = moment();
            console.log('Starting creating course for date: ' + current.format('YYYY-MM-DD'));
            var dow = current.day();
            if(validDays.indexOf(dow) > -1){
                for (i = 0; i < validPeriods[dow].length; i++) {
                    var period = validPeriods[dow][i];
                    var newCourse = {course_date:current.format('YYYY-MM-DD') + ' ' + period.start,start_time:period.start,end_time:period.end,spot_number:period.spotNumber,coachId:coach.id,addressId:address.id}

                    db.create(db.course,{course_date: newCourse.course_date,start_time:newCourse.start_time,end_time:newCourse.end_time},newCourse,function(){
                        console.log("**********************************");
                        console.log(newCourse);
                        console.log(" has been created");
                        console.log("**********************************");
                    })
                }
            }
        },dayInMillisecond);
    }else{
 //        
//       db.create(db.coach,{id: coach.id},coach,
//            function(){
//                console.log("Coach " + coach.name + " has been added")
//            });
//
//       db.create(db.address,{id: address.id},address,
//            function(){
//                console.log("Address " + address.address + " has been added")
//            });
//        db.create(db.address1,{id: address1.id},address1,
//            function(){
//                console.log("Address " + address1.address + " has been added")
//            });
        
        var current = moment();
        for(j=0;j<31;j++){
            var dow = current.day();
            if(validDays.indexOf(dow) > -1){
                for (i = 0; i < validPeriods[dow].length; i++) {
                    var period = validPeriods[dow][i];
                    var newCourse = {course_date:current.format('YYYY-MM-DD') + ' ' + period.start,start_time:period.start,end_time:period.end,spot_number:period.spotNumber,coachId:coach.id,addressId:address.id}

                    db.create(db.course,{course_date: newCourse.course_date,start_time:newCourse.start_time,end_time:newCourse.end_time},newCourse,function(){
                        console.log("**********************************");
                        console.log(newCourse);
                        console.log(" has been created");
                        console.log("**********************************");
                    })
                }
            }
            current.add(1,'day');
        }
    }
})();
