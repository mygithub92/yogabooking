var db = require('./models/DB');
var moment = require('moment');
const config = require('./config');
const util = require('util');
var Promise = require('promise');
var logger = require("./utils/logger");
var dayInMillisecond = 86400000;
var numberDayInFuture = 15;
var querySql = "SELECT id FROM `courses` WHERE `course_date` = '%s' AND addressId = %d and coachId= %d LIMIT 1";
var insertSql = "INSERT INTO `courses`(`id`, `course_date`, `start_time`, `end_time`, `spot_number`, `createdAt`, `updatedAt`, `coachId`, `addressId`) VALUES (DEFAULT,'%s','%s','%s',%d,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,%d,%d)";
var courseInfo = [
    {
        coach: {id:1,name:'Jin Jin',level:7},
        address:{id:1,address:'68 Lascelles Avenue Warradale SA'},
        validDays: [2,4,6],
        validPeriods: {
            2:[{start:'14:00:00',end:'16:00:00',spotNumber:8},{start:'19:00:00',end:'21:00:00',spotNumber:8}]
            ,4:[{start:'10:30:00',end:'12:00:00',spotNumber:8},{start:'19:00:00',end:'21:00:00',spotNumber:8}]
            ,6:[{start:'14:00:00',end:'16:00:00',spotNumber:8},{start:'16:00:00',end:'18:00:00',spotNumber:8}]
        }
    }
//    ,{
//        coach: {id:1,name:'Jin Jin',level:7},
//        address:{id:2,address:'46 Prescott Terrace, Toorak Gardens SA'},
//        validDays: [1,3,5],
//        validPeriods: {
//            1:[{start:'10:00:00',end:'12:00:00',spotNumber:10},{start:'13:00:00',end:'15:00:00',spotNumber:10}]
//            ,3:[{start:'10:00:00',end:'12:00:00',spotNumber:10},{start:'14:00:00',end:'16:00:00',spotNumber:10}]
//            ,5:[{start:'14:00:00',end:'16:00:00',spotNumber:10},{start:'16:00:00',end:'18:00:00',spotNumber:10}]
//        }
//    }
];



(function(){
    var courseGenerator = function(starDate,times){
        var promises = [];
        var current = starDate;
        for(var j=0;j<times;j++){
            var dow = current.day();
            for(var k=0;k<courseInfo.length;k++){
                var courseDetails = courseInfo[k];
                if(courseDetails.validDays.indexOf(dow) > -1){
                    for (var i = 0; i < courseDetails.validPeriods[dow].length; i++) {
                        var period = courseDetails.validPeriods[dow][i];
                        var courseStartTime = current.format('YYYY-MM-DD') + ' ' + period.start;
                        promises.push(
                            (function(addressId,coachId,courseStartTime,period){
                                var fullQuerySql = util.format(querySql,courseStartTime,addressId,coachId);
                                db.sequelize.query(fullQuerySql,{type: db.sequelize.QueryTypes.SELECT}).then(function(foundCourse){
                                    if(foundCourse.length === 0){
                                        var fullInsertSql = util.format(insertSql,courseStartTime,period.start,period.end,period.spotNumber,coachId,addressId);
                                        db.sequelize.query(fullInsertSql);
                                    }
                                })
                        })(courseDetails.address.id,courseDetails.coach.id,courseStartTime,period))
                    }
                }else{
                    logger.info('No need to insert');
                }
            }
            current.add(1,'day');
        }
        Promise.all(promises)
    }
    
    db.sequelize.sync().then(function(){
        setInterval(function(){
            var sql = "SELECT MAX(course_date) as maxDate FROM courses";
            db.sequelize.query(sql,{type: db.sequelize.QueryTypes.SELECT}).then(function(result){
                var daysNeed = numberDayInFuture;
                var currentMaxDate = moment();
                if(result && result.length > 0 && result[0].maxDate){
                    currentMaxDate = moment(result[0].maxDate);
                    currentMaxDate.add(1,'day');
                    var now = moment();
                    var daysBetween = currentMaxDate.diff(now,'day');
                    daysNeed = numberDayInFuture - daysBetween;
                }
                logger.info('Checking the date of ' + currentMaxDate.toDate() + '..........');
                courseGenerator(currentMaxDate,daysNeed);
            })
    },8640000);
  })
})();
