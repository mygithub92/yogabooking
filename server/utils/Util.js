var WXBizDataCrypt = require('./WXBizDataCrypt')

function Util(){}

Util.prototype.decryptData = function(encryptedData, iv,sessionKey){
    var pc = new WXBizDataCrypt('wx7843d4407c191b44', sessionKey)
    var data = pc.decryptData(encryptedData , iv)
    return data;
}


module.exports = Util