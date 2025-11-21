/* eslint-disable import/first */
// // Add these lines FIRST — before all imports
// window.addEventListener("error", (event) => {
//   event.preventDefault(); // stop overlay
//   console.error("Caught by global handler:", event.error);
// });

// window.addEventListener("unhandledrejection", (event) => {
//   if (event.reason?.response?.status === 401) {
//     event.preventDefault(); // stop overlay for 401
//     console.warn("Suppressed 401 error:", event.reason);
//   }
// });



// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import {Provider} from "react-redux";
// import store from "./store";
// //through this we can use react-alert anywhere in our project
// import {positions, transitions, Provider as AlertProvider} from "react-alert";
// import AlertTemplate from "react-alert-template-basic";

// // Error will be 5 secs  
// const options = {
//   timeout: 5000,
//   position: positions.BOTTOM_CENTER,
//   transition: transitions.SCALE,
// };

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <Provider store={store}>
//     <AlertProvider template= {AlertTemplate} {...options}>
//     <App />
//     </AlertProvider>
//   </Provider>,
//   document.getElementById("root")
// );





import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Redux
import { Provider } from "react-redux";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
    <ToastContainer position="top-center" />
  </Provider>
);
