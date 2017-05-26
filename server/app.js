'use strict';

require('./globals');
require('./setup-qcloud-sdk');

const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
var path = require('path');
var moment = require('moment');
var db = require('./models/DB');
var fs = require('fs');
var Util = require('./utils/Util');
var util = new Util();
var key = fs.readFileSync('./2_64078752.jinjinyoga.net.key');
var cert = fs.readFileSync('./1_64078752.jinjinyoga.net_bundle.crt');
var https_options = {
    key: key,
    cert: cert
};

const app = express();
app.set('query parser', 'simple');
app.set('case sensitive routing', true);
app.set('jsonp callback name', 'callback');
app.set('strict routing', true);
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.disable('x-powered-by');

// 记录请求日志
app.use(morgan('tiny'));

// parse `application/x-www-form-urlencoded`
app.use(bodyParser.urlencoded({ extended: true }));

// parse `application/json`
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes'));

// 打印异常日志
process.on('uncaughtException', error => {
    console.log(error);
});

app.post('/yoga/wx/course/book',(req,res) => {
    var userId = req.body.userId;
    var courseId = req.body.courseId;
    db.booking.findOrCreate({where:{userId:userId,courseId:courseId}}).then((booking) =>{
        if(booking[1]){
            res.end(JSON.stringify(booking[0].getDataValue('id')));
        }else{
            res.status(404).json({message:"Rebooking: courseId: " + courseId + " and userId: " + userId})
            console.log("Rebooking: courseId: " + courseId + " and userId: " + userId);
        }

    })
})

app.post('/yoga/wx/course/cancel',(req,res) => {
    var bookingId = req.body.bookingId;
    
    db.booking.destroy({where:{id:bookingId}}).then((deletedRecord) =>{
        if(deletedRecord === 1){
            res.status(200).json({message:"Deleted successfully"});
        }else{
            res.status(404).json({message:"record not found"})
        }
    })
})

app.get('/yoga/wx/course/retrieve',(req,res) => {
    db.course.findAll({
      where:{addressId:req.query.addressId, course_date:{$gt:new Date()}},
      include: [
        {
          model: db.booking,
          include: [
            {
              model: db.user,
              include:[{
                  model: db.payment
                }]
            }
          ]
        }
      ],
     order:['course_date','start_time']}).then(result => {
        var group_to_values = result.reduce(function(obj,item){
            obj[item.course_date] = obj[item.course_date] || [];
            obj[item.course_date].push(item);
            return obj;
        }, {});

        var resultMap = Object.keys(group_to_values).map(function(key){
            var dayNumber  =moment(key).day();
            return {course_date: key + ' ' + Util.days_cn[dayNumber], periods: group_to_values[key]};
        });

        res.end(JSON.stringify(resultMap));
    })
})

app.post('/yoga/wx/user/verify',(req,res) => {
    var userInfo = req.body.userInfo;
    
    util.authencate(config.appId,config.appSecret,userInfo.code,function(data){
        db.user.findOrCreate({
            where:{wechat_id: data.openid},
            defaults:{
                wechat_name:userInfo.nickName,
                avatar_url:userInfo.avatarUrl
            }}).then((result) => {
                if(result[1]){
                   console.log("New user of " + result[0].getDataValue('id') + ", " + result[0].getDataValue('nickName') + " has been created") 
                }
                res.end(JSON.stringify(result[0]));
            })
    });

})


app.get('/yoga/wx/address/retrieve',(req,res) => {
    db.address.findAll().then(result => {
        res.end(JSON.stringify(result));
    })
})

app.get('/yoga/wx/payment/retrieve',(req,res) => {
    db.payment.findOne({where:{userId:req.query.userId}}).then(foundPayment => {
        var result = {paymentNumber: 0,bookingNumber:0};
        
        if(foundPayment){
            result.paymentNumber = foundPayment.times;
        }
        db.booking.findAll({where:{userId:req.query.userId}}).then(foundBookings => {
            if(foundBookings){
                var courseIds = foundBookings.map(function(booking){
                   return booking.courseId;      
                })
                db.course.findAll({where:{id:{$in:courseIds},course_date:{$gt:new Date()}},
                               attributes:[[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'course_num']]}).then(foundCourseNumber =>{
                    result.bookingNumber = foundCourseNumber[0].getDataValue('course_num');
                    res.end(JSON.stringify(result));
                })     
            }
        })
    })
})

app.get('/yoga/manage/user/retrieve', (req, res) => {
    console.log(req.query.managerId);
    if(db.authenticateUser(req.query.managerId)){
        db.user.findAll({
            order:['id'],
            attributes: { exclude: ['createdAt','updatedAt'] }
        }).then(users =>{
            res.end(JSON.stringify(users));
        })  
    }
})

app.post('/yoga/manage/user/update', (req, res) => {
    console.log(req.body.managerId);
    console.log(req.body.userInfo);
    if(db.authenticateUser(req.body.managerId)){
        db.user.findOne(
            {where:{id:req.body.userInfo.id}}
        ).then(foundUser =>{
            if(foundUser){
                foundUser.updateAttributes({
                    full_name:req.body.userInfo.full_name
                })
                res.end(JSON.stringify(foundUser));
            }else{
                res.end("Error, no user can be found" + JSON.stringify(req.body.userInfo));
            }
        })  
    }
})

app.post('/yoga/manage/payment/update', (req, res) => {
    console.log(req.body.managerId);
    console.log(req.body.userId);
    console.log(req.body.payment);
    if(db.authenticateUser(req.body.managerId)){
        db.payment.findOne(
            {where:{userId:req.body.userId}}
        ).then(foundPayment =>{
            if(foundPayment){
                foundPayment.updateAttributes({
                    amount:foundPayment.amount + payment.amount,
                    times:foundPayment.times + payment.times
                })
                res.end(JSON.stringify(foundPayment));
            }else{
                db.payment.create({amount:payment.amount,times:payment.times,userId:req.body.userId})
                .then(function(newPayment){
                    res.end(JSON.stringify(newPayment));
                })
            }
        })  
    }
})

db.sequelize.sync().then(function(){
	https.createServer(https_options,app).listen(config.port, () => {
	   console.log('Express server listening on port: %s', config.port);
	});
  }
)