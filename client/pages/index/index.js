//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    addresses: [],
    paymentNumber: 0,
    bookingNumber: 0
  },

  retrieveAddress: function () {
    var that = this;
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/wx/address/retrieve',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          addresses: res.data
        });
        that.retrievePayment();
      }
    })
  },
  retrievePayment: function () {
    var that = this;
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/wx/payment/retrieve',
      data: {
        userId: that.data.userInfo.id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          bookingNumber: res.data.bookingNumber,
          paymentNumber: res.data.paymentNumber
        });
        app.globalData.bookingNumber = res.data.bookingNumber;
        app.globalData.paymentNumber = res.data.paymentNumber;

        wx.hideLoading();
      }
    })
  },

  stepInto: function (e) {
    wx.navigateTo({ url: '../course/course?addressId=' + e.currentTarget.id });
  },

  goUserManagement: function(){
    var that = this;
    if (that.data.userInfo.access_level){
      wx.navigateTo({ url: '../management/user' });
    }
  },

  onShow: function(e){
    var that = this;
    that.retrievePayment();
  },
  
  onLoad: function () {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask:false
    })
    app.getUserInfo(function (userInfo) {
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
          userInfo.id = app.globalData.userInfo.id = res.data.id;
          userInfo.wechat_id = res.data.wechat_id;
          userInfo.access_level = res.data.access_level;
          userInfo.status = res.data.status;
          that.setData({
            userInfo: userInfo
          });

          that.retrieveAddress();
        }
      })
    });
  }
})
