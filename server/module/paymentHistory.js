module.exports = function(sequelize, DataTypes) {
  var Payment = sequelize.define('paymentHistory', {
   id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
   amount:DataTypes.DOUBLE,
   receipt:DataTypes.STRING,
   operatorId: DataTypes.INTEGER
  });
  return Payment;
};