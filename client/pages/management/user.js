var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    users:[],
    selectedUser:{},
    modalHidden: true
  },

  doDeletionUser: function(){
    var that = this;
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/manage/user/delete',
      data: {
        managerId: that.data.userInfo.id,
        userId: that.data.selectedUser.id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.data.users.splice(that.data.selectedUser.index, 1)
        that.setData({
          users: that.data.users
        });
      }
    })

  },

  retrieveUser:function(managerId){
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

  modalBindaconfirm: function () {
    var that = this;
    if (that.data.userInfo.access_level) {
      that.setData({
        modalHidden: true
      })
      that.doDeletionUser();
    }
  },

  modalBindcancel: function () {
    var that = this;
    that.setData({
      modalHidden: true
    })
  },

  deleteUser: function(e){
    var that = this;
    for (var i = 0; i < that.data.users.length; i++) {
      if (that.data.users[i].id == e.currentTarget.id) {
        that.data.selectedUser = that.data.users[i];
        that.data.selectedUser.index = i;
        break;
      }
    }

    that.setData({
      modalHidden: false,
      selectedUser: that.data.selectedUser
    })
  },

  edit: function(e){
    var that = this;
    for(var i=0;i<that.data.users.length;i++){
      if (that.data.users[i].id == e.currentTarget.id){
        that.data.selectedUser = that.data.users[i];
        break;
      }
    }
    wx.navigateTo({
      url: './editUser',
    })
  },

  onLoad: function (options) {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.retrieveUser(userInfo.id);
    })
  },

  onShow: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      that.retrieveUser(userInfo.id);
    })
  }
})