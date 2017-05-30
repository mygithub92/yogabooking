const config = require('../config');
const Sequelize = require('sequelize');
var logger = require("../utils/logger");

var sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

var db = {
    operators :[],
    
    updateOrCreate: function(model, where, newItem, onCreate, onUpdate, onError) {
        // First try to find the record
        model.findOne({where: where}).then(function (foundItem) {
            if (!foundItem) {
                // Item not found, create a new one
                model.create(newItem)
                    .then(onCreate)
                    .catch(onError);
            } else {
                // Found an item, update it
                model.update(newItem, {where: where})
                    .then(onUpdate)
                    .catch(onError);
                ;
            }
        }).catch(onError);
    },
    create: function(model, where, newItem, onCreate, onError) {
        onError = onError || function(err){console.log(err)};
        model.findOne({where: where}).then(function (foundItem) {
            if (!foundItem) {
                model.create(newItem)
                    .then(onCreate)
                    .catch(onError);
            }
        }).catch(onError);
    },
    
    loadOperator: function(){
        db.user.findAll({
            where:{access_level:1},
            attributes:['id']}).then((foundOperator) => {
            operators = foundOperator.map(operator => {
                return operator.id;
            })
        })
    },
    
    authenticateUser: function(req,res,next){
        var operatorId;
        if(req.query){
            operatorId = req.query.managerId;
        }else{
            operatorId = req.body.managerId;
        }
        if(operatorId){
            var hasAccess = (operators.indexOf(parseInt(operatorId)) > -1);
            if(hasAccess){
                logger.info("Operator " + operatorId + " is doing......");
                next();
            }
        }else{
            res.end("You have no access!");
        }
        
    }
};

db.user = sequelize.import(__dirname + "/user");
db.address = sequelize.import(__dirname + "/address");
db.coach = sequelize.import(__dirname + "/coach");
db.payment = sequelize.import(__dirname + "/payment");
db.course = sequelize.import(__dirname + "/course");
db.booking = sequelize.import(__dirname + "/booking");
db.paymentHistory = sequelize.import(__dirname + "/paymentHistory");

db.user.hasMany(db.payment); //This will add the attribute userId to Payment
db.user.hasMany(db.paymentHistory); //This will add the attribute userId to PaymentHistory
db.payment.belongsTo(db.user); //Will add a userId attribute to Payment to hold the primary key value for User

db.course.belongsTo(db.coach);
db.course.belongsTo(db.address);

db.booking.belongsTo(db.user);
db.booking.belongsTo(db.course);
db.course.hasMany(db.booking);

db.sequelize = sequelize;

module.exports = db;


    
