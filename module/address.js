module.exports = function(sequelize, DataTypes) {
  var Address = sequelize.define('address', {
   id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
   address:DataTypes.STRING
  });
  return Address;
};