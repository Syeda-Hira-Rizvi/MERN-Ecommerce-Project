const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendMail");
const crypto = require('crypto');
const cloudinary = require('cloudinary');
const { FRONTEND_URL } = require("../config/config.env");

const fs = require('fs');

// Register a User and Upload Avatar
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  // try {
    // // Check if file is present in request
    // if (!req.file) {
    //   return res.status(400).send('No avatar file uploaded.');
    // }

    // // Upload file to Cloudinary
    // const result = await cloudinary.uploader.upload(req.file.path, {
    //   folder: "avatars",
    //   width: 150,
    //   crop: "scale",
    // });

     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
       folder: "avatars",
       width: 150,
       crop: "scale",
    });

    // Extract user details from request body
    const { name, email, password} = req.body;

    // Create a new user with avatar details
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    // Remove the local file after upload
    //fs.unlinkSync(req.file.path);

    // Respond with success message and user details
    // res.status(201).json({
    //   success: true,
    //   message: 'User registered successfully',
    //   user,
    // });
    sendToken(user, 201, res);

  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({
  //     success: false,
  //     message: 'Internal Server Error'
  //   });
 // }
});


//Login user
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
  const{email,password} = req.body;

  //checking if user has given password and email both
  if(!email || !password){
    return next(new ErrorHandler("Please Enter Email & Password", 400)) //400 means bad request
  }
//finding user from the database
  const user = await User.findOne({email}).select("+password");

  if(!user){
    return next(new ErrorHandler("Invalid email or password",401)); //401 means unauthorized
  }
 
  const isPasswordMatched = await user.comparePassword(password); //after then we login the user.pass the password from above and check whether it is same as password stored in the database. 

  //if password not matched
  if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid email or password",401));
  }

  sendToken(user, 200, res);
});

//Logout User 
exports.logout = catchAsyncErrors(async(req,res,next)=>{
  //setting the value of keyword token as null.
  res.cookie("token", null,{
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success:true,
    message:"Logged Out",
  });
});

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
  //finding a user through email
  const user = await User.findOne({email:req.body.email});

  if(!user){
    return next(new ErrorHandler("User not found",404));
  }

  //Get ResetPassword Token ....saving resetToken as it is returned by function getResetPasswordToken.
  const resetToken = user.getResetPasswordToken();
  //as the hash and expire time is added in the document of User in userSchema not saved ..so we are saving it.
  await user.save({ validateBeforeSave: false });

  //const resetPasswordUrl =`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
  const resetPasswordUrl =`${FRONTEND_URL}/password/reset/${resetToken}`;

 //making message which we will send in email to user.
 const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it. `;

 //Now we have to send this message so we use try catch block.
 try{
  //calling method of sendEmail
  await sendMail({
    email: user.email,
    subject: `Ecommerce Password Recovery`,
    message,
  });
  res.status(200).json({
    success: true,
    message: `Email sent to ${user.email} successfully`
  });
   
 }catch(error){
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  //we also have to save the user after redefining this.
  await user.save({ validateBeforeSave: false });
   
  return next(new ErrorHandler(error.message, 500));
 }

});


//Reset Password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
   //we take token from url by req.params.token sent to user via email and then search that user in the database.
   //creating token hash
   const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");  
   //now we have to search the user from the database by using that hashed token as we have also written hashed token in the database.
   const user = await User.findOne({
    resetPasswordToken, //same name of property and value
    resetPasswordExpire: {$gt: Date.now()},  //time should be greater than now...we will get user.
   });
   
  if(!user){
    return next(new ErrorHandler("Reset Password Token is invalid or has been expired.",400));
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password does not match",400));
  }

  //if we will find user then change his or her password simply
  user.password = req.body.password;
  //make these undefined till the user again clicks on forgot password as these are chnged in database then save it.
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save({ validateBeforeSave: false });
  
  // to login the user
  sendToken(user, 200, res);
});





//Get User Details(User Profile:Details and updation)
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
   const user = await User.findById(req.user.id);

   res.status(200).json({
    success: true,
    user,
   });
});

//Update User Password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.user.id).select("+password");
  
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword); //after then we login the user.pass the password from above and check whether it is same as password stored in the database. 

  //if password not matched
  if(!isPasswordMatched){
    return next(new ErrorHandler("Old password is incorrect",400));
  }

  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHandler("Password does not match",400));
}

user.password = req.body.newPassword; //it's right to write newPassword or confirmPassword here as both are same.

await user.save({ validateBeforeSave: false });

sendToken(user,200,res);
});

//Update Profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

  //firstly make an object
  const newUserData ={
    name: req.body.name,
    email: req.body.email,
  }

  if(req.body.avatar !== ""){
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);
  

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
 });

 newUserData.avatar = {
  public_id: myCloud.public_id,
  url: myCloud.secure_url,
 };
}
  
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  
  res.status(200).json({
    success: true,
  });

  
// await user.save();

// sendToken(user, 200, res);
});

//Get all users ->(admin checks that how many users have made accounts.)
exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{
 const users = await User.find();

 res.status(200).json({
  success:true,
  users
 });
});

//Get single user(admin will check specific user details)
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.params.id);

  if (!user){
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
  }
 
  res.status(200).json({
   success:true,
   user,
  });
 });

 //Update User Role (Admin updating the user e.g user's role updation)--Admin
 exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{

  //firstly make an object
  const newUserData ={
    name: req.body.name,
    email: req.body.email,
    role: req.body.role, 
  }
 
//We will not add cloudinary here because admin will not change or update the user's product.
  
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, { //if we write req.user.id then the admin will update.
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  
  res.status(200).json({
    success: true,
    user
  });

});

//Delete User --Admin
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

  const user = await User.findById(req.params.id);

    //We will remove cloudinary later

  if(!user){
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id} `));
  }

 await user.deleteOne();

   
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});


