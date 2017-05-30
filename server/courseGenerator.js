var db = require('./models/DB');
var moment = require('moment');
const config = require('./config');
const util = require('util');
var Promise = require('promise');
var logger = require("./utils/logger");
var dayInMillisecond = 86400000;
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
                                    logger.info('Done');
                                }
                            })})(courseDetails.address.id,courseDetails.coach.id,courseStartTime,period)
                        )
                    }
                }
            }
            current.add(1,'day');
        }
        Promise.all(promises)
    }
    
    var instantiate = function(callback){
        var userSql = "INSERT INTO `users` (`id`, `full_name`, `wechat_name`, `avatar_url`, `wechat_id`, `access_level`, `createdAt`, `updatedAt`) VALUES"+
            "(1, NULL, 'David', 'http://wx.qlogo.cn/mmopen/vi_32/hNcMYqibwsnnwBMpjYvKIgGWD5Oz0VCDIB18LV01suHW4foHyWzZ974XSKLVmuIqhtChvia9v14R1iahDnMVbxGVg/0', 'ooULt0Dxk13--jLtmccjepakucgI', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(2, NULL, 'Jin YOGA', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKibNLzQkiamsQItpibV2JicrOp82sQLxba7mYAxR3zszvrDAhpt9Q2kxMnIiaSibMCNFt9bfqUfEsiaosIg/0', 'ooULt0KV0MMH1k362vRbbciBK_og', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(3, NULL, 'Jin-可乐妈', 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erHCYAf0YKsAujQeHeiau5TKsLmxV6spqczrJ4ukiassLQQ20sGRHfFndPW5Xnx9STW3doxWuhaEmQw/0', 'ooULt0KZmfnqPI-NYBiJRx0upLeQ', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(4, NULL, '꧁ Z。妃 ꧂', 'http://wx.qlogo.cn/mmopen/vi_32/azI8gckEsJkhW2ibmstKiaicR6LProkz77NiavX3k8gCRaNQ2KFSqbbaIofLPafjicia2AaaOSpGuUibkzq0gicoanRuMQ/0', 'ooULt0AlZ5iXc7duPyQCKsXLDjlE', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(5, NULL, '小桃子', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL7NBlVAasYWBZcl2PKmjME64JuleWMfng3ciaicqGneibyic4BZ3ia9C4gq2oZwsu9HiccUMpH3FrubLdQ/0', 'ooULt0PKyZJGlUvQpogZJHgcKDeA', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(6, NULL, '孙萍', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLaqVibt7eUz5fzVuYGmYtMgQ4NEUibQxHGSNNT65MykJTcCN9ib9ZJQT5VMku4Nxnib2TicF9MOSib9ExQ/0', 'ooULt0ArmA2k7F0u5dlJyWfQWr3k', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),"+
            "(7, NULL, 'Kandice', 'http://wx.qlogo.cn/mmopen/vi_32/Sg04tg4rs4OMb6Q38tWKAlNHXkMEmQ8TLKAFTouSdoRgt7uWyuWLq0EUQkLy7p934RYezHd0hGbibxxHRxODD9g/0', 'ooULt0Hh3WWEVPtGP0WzsPKxKdM4', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);"
        
        var coachSql = "INSERT INTO `coaches` (`id`, `name`, `level`, `createdAt`, `updatedAt`) VALUES(1, 'Jin Jin', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);";
        var addressSql = "INSERT INTO `addresses` (`id`, `address`, `createdAt`, `updatedAt`) VALUES (1, '68 Lascelles Avenue Warradale SA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);";
        var bookTrigger = "CREATE TRIGGER `reduce_pay_number_after_book` BEFORE INSERT ON `bookings` FOR EACH ROW IF((SELECT id FROM `payments` WHERE userId = NEW.userId)>0) THEN UPDATE `payments` set times = times - 1 WHERE userId = NEW.userId; ELSE INSERT `payments`(`id`, `amount`, `times`,`createdAt`, `updatedAt`,`userId`) VALUES (DEFAULT, 0, -1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,NEW.userId); END IF";
        var cancelTrigger = "CREATE TRIGGER `increas_pay_number_after_cancel` BEFORE DELETE ON `bookings` FOR EACH ROW UPDATE `payments` set times = times + 1 WHERE userId = OLD.userId";
        
        db.sequelize.query(userSql).then(function(){
            db.sequelize.query(coachSql).then(function(){
                db.sequelize.query(addressSql).then(function(){
                    db.sequelize.query(bookTrigger).then(function(){
                        db.sequelize.query(cancelTrigger).then(function(){
                            var current = moment();
                            courseGenerator(current,15);
                        })
                    })
                })
            })
        })
    }
    
    db.sequelize.sync().then(function(){
        if(true){
            setInterval(function(){
                var sql = "SELECT MAX(course_date) as maxDate FROM courses";
                db.sequelize.query(sql,{type: db.sequelize.QueryTypes.SELECT}).then(function(maxDate){
                    var d = moment(maxDate[0].maxDate);
                    d.add(1,'day');
                    logger.info('Checking the date of ' + d.toDate() + '..........');
                    courseGenerator(d,1)
                })
            },dayInMillisecond/10);
        }else{
            instantiate();
        }
  }
)

})();
