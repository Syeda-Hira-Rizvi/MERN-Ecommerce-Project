const {COOKIE_EXPIRE} = require('../config/config.env');
//Creating Token and saving in cookie
const sendToken = (user,statusCode,res)=>{
    const token = user.getJWTToken();

    //Options for cookie because we have to send token to cookie
    const options = {
        expires: new Date(
            Date.now() + COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly:true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success:true,
        user,
        token,
    });
};

module.exports = sendToken;