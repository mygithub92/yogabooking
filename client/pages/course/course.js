var app = getApp()
Page({
  data: {
    userInfo: {},
    addressId: {},
    courses: [],
  },

  nextValidSpot: [],

  bookASport: function (event) {
    var that = this;
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/wx/course/book',
      method: "POST",
      data: {
        courseId: event.target.id,
        userId: that.data.userInfo.id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.data.courses.forEach(function (course) {
          course.periods.forEach(function (period) {
            if (period.id == event.target.id) {
              period.booked = true;
              period.bookings.splice(0, 0, { courseId: period.id, id: res.data, userId: that.data.userInfo.id, user: { wechat_name: that.data.userInfo.nickName, avatar_url: that.data.userInfo.avatarUrl}})
              period.bookings.splice(period.bookings.length-1,1);
              return;
            }
          })
        })
        that.setData({
          courses: that.data.courses
        });
        wx.showToast({
          title: '预定成功',
          icon:'success',
          duration: 500
        });
        var pages = getCurrentPages();
        if(pages.length > 1){
          var prePage = pages[pages.length - 2];
          var preData = prePage.data;
          preData.paymentNumber--;
          preData.bookingNumber++;
          app.globalData.paymentNumber--;
          app.globalData.bookingNumber++;
          prePage.setData(preData)
        }
      }
    })
  },

  cancelASport: function (event) {
    var that = this;
    var bookingId;
    that.data.courses.forEach(function (course) {
      course.periods.forEach(function (period) {
        if (period.id == event.target.id) {
          period.booked = false;
          bookingId = period.bookings[0].id;
          period.bookings.splice(0,1);
          period.bookings.push({ user: { avatar_url: "empty.png", wechat_name: "E" } })
          return;
        }
      })
    })
    that.setData({
      courses: that.data.courses
    });
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/wx/course/cancel',
      method: "POST",
      data: {
        bookingId: bookingId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
      }
    })
    wx.showToast({
      title: '取消成功',
      icon: 'success',
      duration: 500
    });
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      var preData = prePage.data;
      preData.paymentNumber++;
      preData.bookingNumber--;
      app.globalData.paymentNumber++;
      app.globalData.bookingNumber--;
      prePage.setData(preData)
    }
  },

  populateSpots: function (courses, periodId) {
    var that = this;
    courses.forEach(function (course) {
      course.periods.forEach(function (period) {
        var bookingLen = period.bookings.length;
        if (period.spot_number > bookingLen) {
          period.valid = true;
          var currentUserPostion = 0;
          for (var i = 0; i < bookingLen; i++) {
            if (period.bookings[i].user.id === that.data.userInfo.id) {
              period.booked = true;
              currentUserPostion = i;
              break;
            }
          }
          if (currentUserPostion > 0){
            var currentUser = period.bookings[currentUserPostion];
            period.bookings[currentUserPostion] = period.bookings[0];
            period.bookings[0] = currentUser;
          }
          for (var i = bookingLen; i < period.spot_number; i++) {
            period.bookings.push({ user: { avatar_url: "empty.png", wechat_name:"E" } })
          }
          that.nextValidSpot[period.id] = bookingLen;
        }
      })
    })
    that.setData({
      courses: courses
    });
  },

  retrieveCourse: function () {
    var that = this;
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/wx/course/retrieve',
      data: {
        addressId: that.data.addressId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.populateSpots(res.data);
        that.setData({
          courses: res.data
        });
      }
    })
  },



  onLoad: function (option) {
    var that = this
    that.setData({
      addressId: option.addressId
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    });
    that.retrieveCourse();
  }
})
