var app = getApp()
Page({
  data: {
    userInfo: {},
    addressId: {},
    courses: [],
    modalHidden: true,
    forceCancel:{},
    selectedUser:null,
    selectedPeriodId:null
  },

  nextValidSpot: [],

  bookASpot: function (event) {
    var that = this;
    var user = that.data.userInfo;
    var onbehalf = false;
    if (event.user) {
      onbehalf = true;
      user = event.user;
    }
    wx.request({
      url: 'https://64078752.jinjinyoga.net/yoga/wx/course/book',
      method: "POST",
      data: {
        courseId: event.target.id,
        userId: user.id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.data.courses.forEach(function (course) {
          course.periods.forEach(function (period) {
            if (period.id == event.target.id) {
              period.booked = !onbehalf;
              period.bookings.splice(0, 0, { courseId: period.id, id: res.data, userId: user.id, user: { wechat_name: user.nickName, avatar_url: user.avatarUrl } })
              period.bookings.splice(period.bookings.length - 1, 1);
              return;
            }
          })
        })
        that.setData({
          courses: that.data.courses
        });
        wx.showToast({
          title: '预定成功',
          icon: 'success',
          duration: 500
        });
        var pages = getCurrentPages();
        if (pages.length > 1) {
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

  cancelASpot: function (event) {
    var that = this;
    var periodId = event.onbehalf ? event.onbehalf.periodid : event.target.id;
    var courseBookingIndex = event.onbehalf ? event.onbehalf.courseBookingIndex : that.findBooking(periodId, -1);

    var period = that.data.courses[courseBookingIndex.courseIndex].periods[courseBookingIndex.periodIndex];
    period.booked = false;
    var bookingId = event.onbehalf ? event.onbehalf.bookingid : period.bookings[courseBookingIndex.bookingIndex].id;
    period.bookings.splice(courseBookingIndex.bookingIndex, 1);
    period.bookings.push({ user: { avatar_url: "empty.png", wechat_name: "E" } })

    that.setData({
      courses: that.data.courses
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
  },

  longTap: function (e) {
    var that = this;
    if (that.data.userInfo.access_level) {
      if (e.target.dataset.bookingid){
        that.forceCancel(e.target.dataset.periodid, e.target.dataset.bookingid);
      }else{
        that.data.selectedPeriodId = e.target.dataset.periodid;
        that.goSelectUser();
      }
    }
  },

  forceCancel: function (periodId, bookingId){
    var that = this;
    var forceCancel = { onbehalf: that.data.forceCancel };
    var courseBookingIndex = that.findBooking(periodId, bookingId);
    forceCancel.onbehalf.courseBookingIndex = courseBookingIndex;
    var period = that.data.courses[courseBookingIndex.courseIndex].periods[courseBookingIndex.periodIndex];
    var booking = period.bookings[courseBookingIndex.bookingIndex];
    forceCancel.onbehalf.periodid = periodId;
    forceCancel.onbehalf.bookingid = bookingId;
    forceCancel.courseInfo = {
      date: period.course_date,
      start: period.start_time,
      end: period.end_time,
      userName: booking.user.wechat_name,
      userAvatar: booking.user.avatar_url
    };
    that.setData({
      modalHidden: false,
      forceCancel: forceCancel
    })
  },

  goSelectUser: function(){
    wx.navigateTo({ url: 'userList'});
  },

  modalBindaconfirm: function () {
    var that = this;
    if (that.data.userInfo.access_level) {
      that.setData({
        modalHidden: true
      })
      that.cancelASpot(that.data.forceCancel);
    }
  },

  modalBindcancel: function () {
    var that = this;
    that.setData({
      modalHidden: true
    })
  },

  findBooking: function(periodId, bookingId){
    var that = this;
    periodId = parseInt(periodId);
    bookingId = parseInt(bookingId);

    var result = {courseIndex:-1,periodIndex:-1,bookingIndex:0};
    for (var i = 0; i < that.data.courses.length;i++){
      var course = that.data.courses[i];
      for (var j = 0; j < course.periods.length; j++) {
        var period = course.periods[j];
        if (period.id === periodId){
          result.courseIndex = i;
          result.periodIndex = j;
          if (bookingId > 0){
            for (var k = 0; k < period.bookings.length; k++) {
              var booking = period.bookings[k];
              if (booking.id === bookingId){
                result.bookingIndex = k;
                break;
              }
            }
          }
          break;
        }
      }
    }
    return result;
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
          if (currentUserPostion > 0) {
            var currentUser = period.bookings[currentUserPostion];
            period.bookings[currentUserPostion] = period.bookings[0];
            period.bookings[0] = currentUser;
          }
          for (var i = bookingLen; i < period.spot_number; i++) {
            period.bookings.push({ user: { avatar_url: "empty.png", wechat_name: "E" } })
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

  onShow: function(){
    var that = this;
    if(that.data.selectedPeriodId && that.data.selectedUser){
      var parameter = {
        target: { id: that.data.selectedPeriodId},
        user: that.data.selectedUser
      }
      parameter.user.nickName = parameter.user.wechat_name;
      parameter.user.avatarUrl = parameter.user.avatar_url;

      that.bookASpot(parameter);
      that.data.selectedPeriodId = null;
      that.data.selectedUser = null;
    }
    
  },

  onLoad: function (option) {
    console.log(option);
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
