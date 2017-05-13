module.exports = function(sequelize, DataTypes) {
  var Course = sequelize.define('course', {
   id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date:DataTypes.DATE,
    start_time: DataTypes.TIME,
    end_time:DataTypes.TIME,
    spot_number:DataTypes.INTEGER
  });
  return Course;
};