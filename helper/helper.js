const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "sumitkosta",
  api_key: '922241532775668',
  api_secret: '4Klie5zj1qYfEJ2_cTey_EkUiEQ'
});

var crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = 'd6F3Efeq3hd6f3'
let key = crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32)
const iv = Buffer.alloc(16, 0)
const jwt = require("jsonwebtoken");


module.exports.isEmpty = function (obj) {
  switch (obj) {
    case "":
    case 0:
    case "0":
    case null:
      return true;
      break;
    case false:
    default:
      if (typeof obj == "undefined") {
        return true;
      } else if (obj.length === 0) {
        return true;
      } else {
        return false;
      }
  }
};

module.exports.encrypt = function (text) {
  var cipher = crypto.createCipheriv(algorithm, key, iv);
  var crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
};

module.exports.decrypt = function (text) {
  var decipher = crypto.createDecipheriv(algorithm, key, iv);
  var dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
};


module,exports.verifyToken = function (req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers["authorization"];

    // Check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader;
        // Set the token
        req.token = bearerToken.trim();
    
        const user = jwt.verify(req.token, process.env.SECRET_TOKEN);
        req.authData = {};
        req.authData.user = user;
        // Next middleware
        next();
    } else {
        res.status(403).json({ status: false, message: "Unauthorised user!" });
    }
}   

module.exports.uploadSingleFile = async function (file, result) {
    cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, res) => {      
        if (error) {
          result(error, null);
        } else {
          
          let url = res.secure_url;
          let type = res.resource_type;

          result(null, {type, url});
        }
    }).end(file.data);
}