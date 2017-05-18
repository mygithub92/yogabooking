var request = require('request-promise');

var WXBizDataCrypt = require('./WXBizDataCrypt')

function Util(){}

Util.prototype.decryptData = function(encryptedData, iv,sessionKey){
    var pc = new WXBizDataCrypt('wx7843d4407c191b44', sessionKey)
    var data = pc.decryptData(encryptedData , iv)
    return data;
}

Util.prototype.authencate = function(appId, secret,code,callback){
   var url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+appId+'&secret='+secret+'&js_code='+code+'&grant_type=authorization_code';
    
   request(url)
       .then(function(body) {
            var result = JSON.parse(body);
            if(result.errcode !== 40163){
                callback.call(this,result);
            }
        })
       .catch(function(err) {
            console.log(err);
        })
}


module.exports = Util