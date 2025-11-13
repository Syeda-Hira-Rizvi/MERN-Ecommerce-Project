const express = require("express");
const {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser} = require("../controllers/userController");
const  {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth")
const router = express.Router();
// const upload = require('../config/multerConfig');


// router.route("/register", upload.single('avatar')).post(registerUser); //here we are seeing the password being shown in the response so we have to convert it into hash.So we encrypt the password in the userModel.js before saving it.
router.route("/register").post(registerUser); //here we are seeing the password being shown in the response so we have to convert it into hash.So we encrypt the password in the userModel.js before saving it.
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser,updateProfile);
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser).put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

//router.route("/user/:id").get(isAuthenticatedUser, getSingleUser).put(isAuthenticatedUser, updateUserRole).delete(isAuthenticatedUser, deleteUser);


module.exports = router;