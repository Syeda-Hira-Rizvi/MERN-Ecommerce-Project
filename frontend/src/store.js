import { legacy_createStore } from 'redux';
// import {configureStore} from "@reduxjs/toolkit";
import {combineReducers, applyMiddleware} from "redux";
import {thunk} from "redux-thunk";
//to connect with the chrome extension.
import {composeWithDevTools} from "@redux-devtools/extension";
import {reviewReducer, productReviewsReducer, productReducer, productDetailsReducer, productsReducer,newReviewReducer, newProductReducer } from './reducers/productReducer';
import { userDetailsReducer, allUsersReducer, forgotPasswordReducer, profileReducer, userReducer } from './reducers/userReducer';

import {cartReducer} from "./reducers/cartReducer";
import {  orderReducer, allOrdersReducer, orderDetailsReducer, myOrdersReducer, newOrderReducer } from './reducers/orderReducer';


//we have to make reducer of product and to show that how to fetch the product.As we we have to make reducer of many things in addition to product so that's why we are using combineReducers here and store it in the variable store.
const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product: productReducer,
    allOrders: allOrdersReducer,
    order:  orderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
});

let initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems")
          ? JSON.parse(localStorage.getItem("cartItems"))
          : [],
        shippingInfo: localStorage.getItem("shippingInfo")
          ? JSON.parse(localStorage.getItem("shippingInfo"))
          : {},
      },
};

const middleware = [thunk];

 const store = legacy_createStore(reducer,initialState, composeWithDevTools(applyMiddleware(...middleware)));

 export default store;