const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET,JWT_EXPIRE} = require('../config/config.env');
const crypto = require("crypto"); //it is built-in module


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter Name"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minLength:[4,"Name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true, "Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a Valid Email"],
    },
    password:{
        type:String,
        required:[true, "Please Enter Your Password"],
        minLength:[8,"Password should be greater than 8 characters"],
       
    },
    avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
    },
    role:{
        type:String,
        default: "user",
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

//event will create that works before saving the userSchema.We cannot use this in arrow function we use function keyword here.
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    //10 shows that how strong the password should be .Means here password is of 10 characters and it is recommended value.
  this.password = await bcrypt.hash(this.password,10);
});

//JWT Token(we create a a token when the user registers and then server will recognize that user through this token...this is used in login)
//method of userSchema:
userSchema.methods.getJWTToken = function(){
    //here we are making jwt token , we will get _id of individual user from this._id and  process.env.JWT_SECRET is the key that we can write anything.
    return jwt.sign({ id: this._id }, JWT_SECRET , {
        expiresIn: JWT_EXPIRE,
    });
};

//Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password); //enteredPassword is same as password that we passed in this function call in userController.js.
}

//Generating Password Reset Token

userSchema.methods.getResetPasswordToken = function(){
//Generating Token
const resetToken =crypto.randomBytes(20).toString("hex");
//Hashing and adding to userShema
this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//Setting expiry date to 15 minutes 
this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

return resetToken;
};

module.exports = mongoose.model("User",userSchema);