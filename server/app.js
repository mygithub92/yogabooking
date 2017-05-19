'use strict';

require('./globals');
require('./setup-qcloud-sdk');

const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
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

app.use('/', require('./routes'));

// 打印异常日志
process.on('uncaughtException', error => {
    console.log(error);
});

app.get('/yoga/course/view',function(req,res){
   console.log(db.user);
   console.log(db.user.id);
   res.end("test");
})

app.get('/yoga/course/book',function(req,res){
   console.log(db.user);
   console.log(db.user.id);
   res.end("test");
})

app.get('/yoga/user',function(req,res){
	res.sendFile(__dirname + '/user.html');
})

app.post('/yoga/user/add',function(req,res){
  db.user
  .create(req.body)
  .then(function() {
    db.user
      .findOrCreate({where: {wechat_id: req.body.wechat_id}})
      .spread(function(user, created) {
        console.log(user.get({
          plain: true
        }))
        console.log(created)
      })
  })
  res.end(req.body.full_name + " has been added");
})

app.get('/yoga/user/view', (req, res) => {
  db.user.findAll().then(function(users) {
    res.render('users.ejs', {users: users})
  })
})

app.get('/yoga/wx/user/view', (req, res) => {
  db.user.findAll().then(function(users) {
    res.end(JSON.stringify(users));
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
        db.updateOrCreate(db.user,{wechat_id: newUser.wechat_id},newUser,
            function(){
                res.end(newUser.wechat_id + " has been added")
            },
            function(){
                res.end(newUser.wechat_id + " has been updated")
            },
            function(err){
                console.log(err);
                res.end('err')
            });
    });
})

app.post('/yoga/manage/coach/add', (req, res) => {
    var coach = {
        id:1,
        name:'Jin Jin',
        level:7
        
    }
    
   db.create(db.coach,{id: coach.id},coach,
        function(){
            res.end("Coach " + coach.name + " has been added")
        },
       
        function(err){
            console.log(err);
            res.end('err')
    });
})

app.post('/yoga/manage/address/add', (req, res) => {
    var address = {
        id:1,
        address:'68 Lascelles Avenue Warradale SA'
        
    }
    
   db.create(db.address,{id: coach.id},address,
        function(){
            res.end("Address " + address.address + " has been added")
        },
       
        function(err){
            console.log(err);
            res.end('err')
    });
})


// 启动server
//http.createServer(app).listen(config.port, () => {
 //   console.log('Express server listening on port: %s', config.port);
//});

db.sequelize.sync().then(function(){
	https.createServer(https_options,app).listen(config.port, () => {
	   console.log('Express server listening on port: %s', config.port);
	});
  }
)