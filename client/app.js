App({
  onLaunch: function () {
    this.getUserInfo();
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (e) {
          console.log(e);
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.userInfo = res.userInfo;
              that.globalData.userInfo.encryptedData = res.encryptedData;
              that.globalData.userInfo.iv = res.iv;
              that.globalData.userInfo.code = e.code;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  globalData:{
    userInfo:null
  }
})
