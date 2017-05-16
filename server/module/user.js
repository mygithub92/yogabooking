module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
   id: {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    full_name:DataTypes.STRING,
    wechat_name:DataTypes.STRING,
    avatar_url:DataTypes.STRING,
    wechat_id:DataTypes.STRING
  });
  return User;
};