const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//Create new Order
exports.newOrder = catchAsyncErrors(async (req,res,next)=>{
    //firstly destructuring the data taken from req.body
  const {
     shippingInfo,
     orderItems,
     paymentInfo,
     itemsPrice,
     taxPrice,
     shippingPrice,
     totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
     paymentInfo,
     itemsPrice,
     taxPrice,
     shippingPrice,
     totalPrice,
     paidAt: Date.now(),
     user:  req.user._id,
  });

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
});

//Get Single Order 
exports.getSingleOrder = catchAsyncErrors(async (req,res,next)=>{
   const order = await Order.findById(req.params.id).populate(
    //we will get name and email of user in addition to its id by using the user id.
    "user",
    "name email"
   );

   if(!order){
    return next (new ErrorHandler("Order not found with this Id", 404));
   }

   res.status(200).json({
    success: true,
    order,
   });
});  
    
//Get Logged in User Orders
exports.myOrders = catchAsyncErrors(async (req,res,next)=>{
  //we have to find the orders that have the id in the user field same as our logged in user id.
  const orders = await Order.find({user: req.user._id});

  res.status(200).json({
   success: true,
   orders,
  });
});  

//Get All Orders --Admin
exports.getAllOrders = catchAsyncErrors(async (req,res,next)=>{
  //we have to find the orders that have the id in the user field same as our logged in user id.
  const orders = await Order.find({user: req.user._id});

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
   success: true,
   totalAmount,
   orders,
  });
});  

//Update Order Status --Admin
exports.updateOrder = catchAsyncErrors(async (req,res,next)=>{
  //we have to find the orders that have the id in the user field same as our logged in user id.
  const order = await Order.findById(req.params.id);

  if(!order){
    return next (new ErrorHandler("Order not found with this Id", 404));
   }

  if(order.orderStatus==="Delivered"){
    return next(new ErrorHandler("You have already delivered this order",404));
  }

  if(req.body.status === "Shipped"){
  order.orderItems.forEach(async(order)=>{  //this order in braces is actually object which is only one in orderItems array 
    await updateStock(order.product,order.quantity);
  });
} 

  order.orderStatus = req.body.status; //status whichever we will send goes into req.body.status
  if(req.body.status==="Delivered"){
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
   success: true,
   order,
  });
}); 

async function updateStock(id,quantity){
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
};

//Delete Order --Admin
exports.deleteOrder = catchAsyncErrors(async (req,res,next)=>{
  //we have to find the orders that have the id in the user field same as our logged in user id.
  const order = await Order.findById(req.params.id);
 
  if(!order){
    return next (new ErrorHandler("Order not found with this Id", 404));
   }

   await order.deleteOne();
 
  res.status(200).json({
   success: true,
  
  });
});  
