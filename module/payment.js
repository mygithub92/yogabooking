module.exports = function(sequelize, DataTypes) {
  var Payment = sequelize.define('payment', {
   id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
   amount:DataTypes.DOUBLE,
   times: DataTypes.INTEGER
  });
  return Payment;
};