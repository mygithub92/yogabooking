var app = getApp()
Page({

  data: {
    userInfo: {},
    users:[]
  },

  retrieveUser: function (managerId) {
    var that = this;
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/manage/user/retrieve',
      data: {
        managerId: managerId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          users: res.data
        });
      }
    })
  },

  select: function(e){
    var that = this;
    var selectedUser;
    for(var i=0;i<that.data.users.length;i++){
      if (that.data.users[i].id == e.currentTarget.id){
        selectedUser = that.data.users[i];
        break;
      }
    }
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      var preData = prePage.data.selectedUser = selectedUser;
    }
    wx.navigateBack();   
  },

  onLoad: function (options) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      that.retrieveUser(userInfo.id);
    });
  }
})