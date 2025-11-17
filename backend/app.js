// const express = require("express");
// const app = express();
// const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
// //const fileUpload = require("express-fileupload");
// const errorMiddleware = require("./middleware/error");
// const dotenv = require('dotenv');

// // Config
// if (process.env.NODE_ENV !== "PRODUCTION") {
//     require("dotenv").config({ path: "backend/config/config.env" });
//   }

// app.use(express.json());
// app.use(cookieParser());

// //Importing all routes
// const product = require("./routes/productRoute");
// const user = require("./routes/userRoute");
// const order = require("./routes/orderRoute");
// //const upload = require('./routes/uploadRoute');
// const payment = require("./routes/paymentRoute");


// app.use("/api/v1", product);
// app.use("/api/v1",user);
// app.use("/api/v1",order);
// //app.use('/api/v1', upload);
// app.use("/api/v1", payment);

// app.use(bodyParser.urlencoded({ extended: true }));
// //app.use(fileUpload());
// //app.use(fileUpload({ useTempFiles: true }));


// //Middleware for Errors
// app.use(errorMiddleware);

// module.exports = app;


const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");

// // Config
// if (process.env.NODE_ENV !== "PRODUCTION") {
//   require("dotenv").config({ path: "backend/config/config.env" });
// }

// Enable CORS
app.use(cors({
  origin: "http://localhost:3000",// Frontend's URL (adjust as needed)
  credentials: true, // Allow cookies to be sent with cross-origin requests
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;