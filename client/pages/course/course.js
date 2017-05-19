var app = getApp()
Page({
  data: {
    courses:[]
  },

  retrieveCourse: function(addressId){
    var that = this;
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/wx/course/retrieve', 
      data: {
        addressId:addressId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          courses: res.data
        });
      }
    })
  },
  onLoad: function (option) {
    var that = this
    that.retrieveCourse(option.addressId);
  }
})
