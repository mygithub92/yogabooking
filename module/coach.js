module.exports = function(sequelize, DataTypes) {
  var Coach = sequelize.define('coach', {
   id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
   name: DataTypes.STRING,
   level: DataTypes.INTEGER
  });
  return Coach;
};