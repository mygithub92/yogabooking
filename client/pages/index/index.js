//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    courses: [],
    addresses:[]
  },

  retrieveCouse: function(){
    var that = this;
    wx.request({ 
      url: 'https://64078752.jinjinyoga.net/yoga/wx/user/view',
      data: {
        nickName: that.data.userInfo.nickName
      },
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
          console.log(res.data);
          that.setData({
             users:res.data
          });
          console.log(that.data.users);
      }
    })
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


  bindViewTap: function(){
    var that = this;
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/wx/user/add', 
      data: {
        userInfo: that.data.userInfo
      },
      method:'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          users: res.data
        });
      }
    })
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
