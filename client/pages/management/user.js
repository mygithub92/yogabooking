var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:[],
    selectedUser:{}
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
        console.log(res.data);
        that.setData({
          users: res.data
        });
      }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.retrieveUser(userInfo.id);
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