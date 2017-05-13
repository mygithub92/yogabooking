'use strict';

require('./globals');
require('./setup-qcloud-sdk');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
const db = require('./models/DB');
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

app.get('/booking',function(req,res){
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

// 启动server
//http.createServer(app).listen(config.port, () => {
 //   console.log('Express server listening on port: %s', config.port);
//});

db.sequelize.sync().then(function(){
	http.createServer(app).listen(config.port, () => {
	   console.log('Express server listening on port: %s', config.port);
	});
  }
)