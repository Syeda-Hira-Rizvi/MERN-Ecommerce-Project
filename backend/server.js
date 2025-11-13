const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");
const {PORT, CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = require('./config/config.env');
// const dotenv = require("dotenv");

//Handling uncaught exception
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});
//console.log(youtube);

//Config 
// dotenv.config({path:"backend/config/config.env"});

//Connecting to database
connectDatabase();

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

const server = app.listen(PORT,()=>{
    console.log(`Server is working on http://localhost:${PORT}`)
});

//console.log(youtube); // youtube is not defined..this kind of error is called uncaught error and we handle it on the top of the file because if we handle it in the last and and write console.log on the top of it or the file then it won't work for it.

//Unhandled Promise Rejection (error which occurs if we write mongo instead of mongodbthen we handle it like here..... if we remove the catch block from the database.js file then it is called as unhandled otherwise not.)
process.on("unhandledRejection",(err) =>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise Rejection`);
    server.close(() =>{
        process.exit(1);
    });
});
















