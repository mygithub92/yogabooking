module.exports = function(sequelize, DataTypes) {
  var BookingHistory = sequelize.define('bookingHistory', {
   id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
   userId:DataTypes.INTEGER,
   courseId:DataTypes.INTEGER,
   action:DataTypes.INTEGER //0: cancelling, 1: booking
  });
  return BookingHistory;
};