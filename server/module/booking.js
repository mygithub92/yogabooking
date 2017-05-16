module.exports = function(sequelize, DataTypes) {
  var Booking = sequelize.define('booking', {
   id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
  });
  return Booking;
};