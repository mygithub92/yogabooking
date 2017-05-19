module.exports = function(sequelize, DataTypes) {
  var Course = sequelize.define('course', {
   id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    course_date:{
        type: DataTypes.DATEONLY,
        get: function()  {
            if(this.getDataValue('course_date')){
              return this.getDataValue('course_date').toISOString().slice(0,10);
            }
        },
    },
    start_time: DataTypes.TIME,
    end_time:DataTypes.TIME,
    spot_number:DataTypes.INTEGER
  });
  return Course;
};