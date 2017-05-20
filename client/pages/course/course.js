var app = getApp()
Page({
  data: {
    userInfo:{},
    courses:[]
  },
  bookCourse:function(event){
    var that = this;
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/wx/course/book',
      method:"POST",
      data: {
        courseId: event.target.id,
        userInfo: that.data.userInfo
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          courses: res.data
        });
      }
    })
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
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    });
    that.retrieveCourse(option.addressId);
  }
})
