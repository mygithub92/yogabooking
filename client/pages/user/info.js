var app = getApp()
Page({

  data: {
    bookingInfo: {},
    globalData: app.globalData
  },

  retrieve: function () {
    var that = this;
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/wx/user/details',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        userId: app.globalData.userInfo.id
      },
      success: function (res) {
        that.setData({
          bookingInfo: res.data,
          globalData: app.globalData
        });
      }
    })
  },
  
  onLoad: function (options) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      that.retrieve();
    });
  },
  onShow: function (e) {
    var that = this;
    that.retrieve();
  }
})