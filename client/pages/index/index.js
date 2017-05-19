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
    console.log('onLoad')
    var that = this
  	//调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      console.log(that.data.userInfo);
    });

    that.retrieveAddress();
  }
})
