const Sequelize = require('sequelize');

var sequelize = new Sequelize('yoga_booking1', 'root', 'BBBBBBHHINci1z', {
    host: '10.66.227.99',
    port: 3306,
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

function db(){};

db.user = sequelize.import(__dirname + "/user");
db.address = sequelize.import(__dirname + "/address")
db.coach = sequelize.import(__dirname + "/coach");
db.payment = sequelize.import(__dirname + "/payment");
db.course = sequelize.import(__dirname + "/course");
db.booking = sequelize.import(__dirname + "/booking");

db.user.hasMany(db.payment); //This will add the attribute userId to Payment
db.payment.belongsTo(db.user); //Will add a userId attribute to Payment to hold the primary key value for User

db.course.belongsTo(db.coach);
db.course.belongsTo(db.address);

db.booking.belongsTo(db.user);
db.booking.belongsTo(db.course);

db.sequelize = sequelize;

db.prototype.updateOrCreate = function(model, where, newItem, onCreate, onUpdate, onError) {
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
}

module.exports = db;


    
