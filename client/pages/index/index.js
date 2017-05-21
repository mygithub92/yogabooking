//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    addresses:[]
  },

  retrieveAddress: function(){
    var that = this;
    wx.request({ 
      url: 'https://64078752.jinjinyoga.net/yoga/wx/address/retrieve', 
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
          console.log(res.data);
          that.setData({
             addresses:res.data
          });
      }
    })
  },


  stepInto: function(e){
    wx.navigateTo({ url: '../course/course?addressId=' + e.currentTarget.id });
  },

  onLoad: function () {
    var that = this
    app.getUserInfo(function(userInfo){
      wx.request({
        url: 'https://64078752.jinjinyoga.net/yoga/wx/user/verify',
        method: "POST",
        data: {
          userInfo: userInfo
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          userInfo.id = res.data.id;
          userInfo.wechat_id = res.data.wechat_id;
          that.setData({
            userInfo: userInfo
          });
        }
      })
    });

    that.retrieveAddress();
  }
})
