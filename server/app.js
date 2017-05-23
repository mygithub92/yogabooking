'use strict';

require('./globals');
require('./setup-qcloud-sdk');

const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
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

app.get('/yoga/user',function(req,res){
	res.sendFile(__dirname + '/user.html');
})

app.post('/yoga/wx/course/book',(req,res) => {
    var userId = req.body.userId;
    var courseId = req.body.courseId;
    db.booking.findOrCreate({where:{userId:userId,courseId:courseId}}).then((booking) =>{
        if(booking[1]){
            res.end(JSON.stringify(booking[0].getDataValue('id')));
        }else{
            console.err("Rebooking: courseId: " + courseId + " and userId: " + userId);
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
              model: db.user
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

        //console.log(JSON.stringify(resultMap));
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

app.post('/yoga/wx/user/add', (req, res) => {
    console.log(req.body);
    var userInfo = req.body.userInfo;
    util.authencate(config.appId,config.appSecret,userInfo.code,function(data){
        var newUser = {
            wechat_name:userInfo.nickName,
            avatar_url:userInfo.avatarUrl,
            wechat_id:data.openid
        };
        db.create(db.user,{wechat_id: newUser.wechat_id},newUser,
            function(){
                res.end(newUser.wechat_id + " has been added")
            },
            function(err){
                console.log(err);
                res.end('err')
            });
    });
})


db.sequelize.sync().then(function(){
	https.createServer(https_options,app).listen(config.port, () => {
	   console.log('Express server listening on port: %s', config.port);
	});
  }
)