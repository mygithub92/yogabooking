//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    courses: [],
    users:[],
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    this.addCurrentUser();
  },

  retrieveCouse: function(){
    var that = this;
    wx.request({ 
      url: 'https://64078752.jinjinyoga.net/yoga/wx/user/view', //仅为示例，并非真实的接口地址
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

  addCurrentUser: function(){
    var that = this;
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/wx/user/add', //仅为示例，并非真实的接口地址
      data: {
        encryptedData: that.data.userInfo.encryptedData,
        iv: that.data.userInfo.iv
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          users: res.data
        });
        console.log(that.data.users);
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

    //that.retrieveCouse();
  }
})
