const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

//Connecting to database
connectDatabase();
 
module.exports = app;