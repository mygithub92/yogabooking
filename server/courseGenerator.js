var db = require('./models/DB');
var moment = require('moment');
const config = require('./config');
const util = require('util');
var Promise = require('promise');
var logger = require("./utils/logger");
var dayInMillisecond = 8640000;
var numberDayInFuture = 18;
var querySql = "SELECT id FROM `courses` WHERE `course_date` = '%s' AND addressId = %d and coachId= %d LIMIT 1";
var insertSql = "INSERT INTO `courses`(`id`, `course_date`, `start_time`, `end_time`, `spot_number`, `createdAt`, `updatedAt`, `coachId`, `addressId`) VALUES (DEFAULT,'%s','%s','%s',%d,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,%d,%d)";
var courseInfo = [
    {
        coach: {id:1,name:'Jin Jin',level:7},
        address:{id:2,address:'10/1 Church Crescent Marion SA'},
        validDays: [1,2,3,4,5,6],
        validPeriods: {
            1:[{start:'18:30:00',end:'20:00:00',spotNumber:4}]
            ,2:[{start:'9:30:00',end:'11:00:00',spotNumber:4},{start:'13:30:00',end:'15:00:00',spotNumber:4},{start:'15:00:00',end:'16:30:00',spotNumber:4}]
            ,3:[{start:'18:30:00',end:'20:00:00',spotNumber:4}]
            ,4:[{start:'9:30:00',end:'11:00:00',spotNumber:4},{start:'13:30:00',end:'15:00:00',spotNumber:4},{start:'15:00:00',end:'16:30:00',spotNumber:4}]
            ,5:[{start:'18:30:00',end:'20:00:00',spotNumber:4}]
            ,6:[{start:'14:00:00',end:'15:30:00',spotNumber:4},{start:'16:00:00',end:'17:30:00',spotNumber:4}]
        }
    }
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
