var app = getApp()
Page({

  data: {
    managerId: 0,
    selectedUser: {},
    modalHidden: true,
    values: {},
    hideButtons:false
  },

  onLoad: function (options) {
    var that = this;
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      that.setData({ selectedUser: prePage.data.selectedUser, managerId: app.globalData.userInfo.id })
    }
    console.log(that.data)
  },

  formSubmit: function (e) {
    console.log(e);
    this.setData({
      modalHidden: !this.data.modalHidden,
      values: e.detail.value
    })
  },

  formReset: function (e) { },

  modalBindaconfirm: function () {
    var that = this;
    this.setData({
      modalHidden: !this.data.modalHidden
    })
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/manage/payment/update',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        managerId: that.data.managerId,
        userId: that.data.selectedUser.id,
        payment: that.data.values
      },
      method: "POST",
      success: function (res) {
        console.log(res.data);
        if (that.data.selectedUser.payments.length > 0){
          that.data.selectedUser.payments[0].times = res.data.times;
        }else{
          that.data.selectedUser.payments[0] = res.data;
        }
        that.setData({
          modalHidden: true,
          selectedUser: that.data.selectedUser,
          hideButtons:true
        })
        var pages = getCurrentPages();
        if (pages.length > 1) {
          var prePage = pages[pages.length - 2];
          if (prePage.data.selectedUser.payments.length > 0){
            prePage.data.selectedUser.payments[0].times = res.data.times;
          }else{
            prePage.data.selectedUser.payments[0] = res.data;
          }
        }
      }
    })

  },
  modalBindcancel: function () {
    var that = this;
    that.setData({
      modalHidden: !that.data.modalHidden
    })
  },
})