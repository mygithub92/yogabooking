var request = require("request");

var WXBizDataCrypt = require('./WXBizDataCrypt')

function Util(){}

Util.prototype.decryptData = function(encryptedData, iv,sessionKey){
    var pc = new WXBizDataCrypt('wx7843d4407c191b44', sessionKey)
    var data = pc.decryptData(encryptedData , iv)
    return data;
}

Util.prototype.getOpenid = function(appId, secret,code){
    var data = {};
   var url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+appId+'&secret='+secret+'&js_code='+code+'&grant_type=authorization_code';
   request({
     uri: url,
     method: "GET"
    }, function(error, response, body) {
       console.log("***************************************************");
       console.log(response);
       data.sessionKey = "session_key";
       data.opendid = "openid"
    });
    return data;
}


module.exports = Util