// editUser.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    managerId:0,
    selectedUser: {},
    modalHidden: true,
    values: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
      data:{
        managerId: that.data.managerId,
        userId: that.data.selectedUser.id,
        payment: that.data.values
      },
      method:"POST",
      success: function (res) {
        console.log(res.data);
        wx.navigateBack();
      }
    })
    
  },
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})