var Util = require('../utils/Util');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Course = sequelize.define('course', {
   id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    course_date:{
        type: DataTypes.DATE,
        get: function()  {
            if(this.getDataValue('course_date')){
                var date = this.getDataValue('course_date').toISOString().slice(0,10);
                var dayNumber = moment(date).day();
                return date + ' ' + Util.days_cn[dayNumber];
            }
        }
    },
    start_time: {
        type: DataTypes.TIME,
        get: function(){
            if(this.getDataValue('start_time')){
              return this.getDataValue('start_time').slice(0,5);
            }
        }
    },
    end_time:{
        type: DataTypes.TIME,
        get: function(){
            if(this.getDataValue('end_time')){
              return this.getDataValue('end_time').slice(0,5);
            }
        }
    },
    spot_number:DataTypes.INTEGER
  });
  return Course;
};