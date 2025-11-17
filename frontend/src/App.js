import './App.css';
import { useEffect, useState } from "react";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from './component/Product/Search.js';
import LoginSignup from './component/User/LoginSignup.js';
import store from "./store";
import { loadUser } from './actions/userAction.js';
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js";
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile.js';
import UpdatePassword from './component/User/UpdatePassword.js';
import ForgotPassword from './component/User/ForgotPassword.js';
import ResetPassword from './component/User/ResetPassword.js';
import Cart from './component/Cart/Cart.js';
import Shipping from './component/Cart/Shipping.js';
import ConfirmOrder from './component/Cart/ConfirmOrder.js';
import Payment from './component/Cart/Payment.js';
import OrderSuccess from './component/Cart/OrderSuccess.js';
import MyOrders from './component/Order/MyOrders.js';
import OrderDetails from './component/Order/OrderDetails.js';
import Dashboard from './component/Admin/Dashboard.js';
import ProductList from './component/Admin/ProductList.js';
import UpdateProduct from './component/Admin/UpdateProduct.js';
import OrderList from './component/Admin/OrderList.js';
import ProcessOrder from './component/Admin/ProcessOrder.js';
import UsersList from './component/Admin/UsersList.js';
import UpdateUser from './component/Admin/UpdateUser.js';
import ProductReviews from './component/Admin/ProductReviews.js';
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios';
import NotFound from "./component/layout/Not Found/NotFound";


function App() {

  const {isAuthenticated, user} = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/stripeapikey`);

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(()=>{
   WebFont.load({
    google:{
      families:["Roboto","Driod Sans","Chilanka"],
    },
   });
   
   //new way to use dispatch.
  store.dispatch(loadUser());
 // store.dispatch(loadUser()).catch(() => {});
//  (async () => {
//     try {
//       await store.dispatch(loadUser());
//     } catch (error) {
//       // Hide harmless 401 errors
//       if (error.response?.status !== 401) {
//         console.error("Unexpected error during loadUser:", error);
//       }
//     }
//   })();

   getStripeApiKey();
  }, []);

  // window.addEventListener("contextmenu", (e) => e.preventDefault());
  
  return (
    <Router>
   <Header />
   {isAuthenticated && <UserOptions user={user} />} 
   <ProtectedRoute exact path='/account' element={<Profile />} />
   <ProtectedRoute exact path='/me/update' element={<UpdateProfile />} />
   <ProtectedRoute exact path='/password/update' element={<UpdatePassword />} />
   <ProtectedRoute exact path='/shipping' element={<Shipping />} />
   <ProtectedRoute exact path='/order/confirm' element={<ConfirmOrder />} />
   {stripeApiKey && ( 
   <Elements stripe={loadStripe(stripeApiKey)}>
   <ProtectedRoute exact path='/process/payment' element={<Payment />} />
   </Elements>
   )} 
   <ProtectedRoute exact path='/success' element={<OrderSuccess />} />
   <ProtectedRoute exact path='/orders' element={<MyOrders />} />
   <ProtectedRoute exact path='/order/:id' element={<OrderDetails />} />
   <ProtectedRoute isAdmin = {true} exact path='/admin/dashboard' element={<Dashboard />} />
   <ProtectedRoute isAdmin = {true} exact path='/admin/products' element={<ProductList />} />
   <ProtectedRoute isAdmin = {true} exact path='/admin/product/:id' element={<UpdateProduct />} />
   <ProtectedRoute isAdmin = {true} exact path='/admin/orders' element={<OrderList />} />
   <ProtectedRoute isAdmin = {true} exact path='/admin/order/:id' element={<ProcessOrder />} />
   <ProtectedRoute isAdmin = {true} exact path='/admin/users' element={<UsersList />} />
   <ProtectedRoute isAdmin = {true} exact path='/admin/user/:id' element={<UpdateUser/>} />
   <ProtectedRoute isAdmin={true} exact path="/admin/reviews" element={<ProductReviews />}/>

   <Routes>
   <Route exact path='/' element={<Home/>} />
   <Route exact path='/product/:id' element={<ProductDetails/>} />
   <Route exact path='/products' element={<Products/>} />
   <Route path='/products/:keyword' element={<Products/>} />
   <Route exact path='/search' element={<Search />} />
   <Route exact path="/contact" element={<Contact />} />
   <Route exact path="/about" element={<About />} />
   <Route exact path='/login' element={<LoginSignup/>} />
   <Route exact path='/password/forgot' element={<ForgotPassword />} />
   <Route exact path="/password/reset/:token" element={<ResetPassword/>} />
   <Route exact path='/cart' element={<Cart/>} />
   <Route
          path="*"
          element={
            window.location.pathname === "/process/payment" ? <></> : <NotFound />
          }
        />


    </Routes>
   <Footer />
   </Router>
  );
}

export default App;
