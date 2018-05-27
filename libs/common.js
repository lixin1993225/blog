const crypto = require("crypto");
module.exports = {
	md5_suffix:'hajshdjahsd876786*a87d8a(*&*7a98s7d家哈就会是多久啊',
	md5:function(str){
		var obj = crypto.createHash("md5");
		obj.update(str);
		var val = obj.digest("hex");
		return val
	}
}