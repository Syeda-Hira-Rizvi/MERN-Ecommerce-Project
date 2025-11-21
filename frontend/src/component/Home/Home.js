import React, { Fragment, useEffect } from 'react';
import {CgMouse} from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import {clearErrors, getProduct} from "../../actions/productAction";
import {useSelector, useDispatch} from "react-redux";
import Loader from "../layout/Loader/Loader.js";
import { toast } from "react-toastify";



// const product = {
//   name: "Blue Tshirt",
//   images: [{url: "https://i.ibb.co/DRST11n/1.webp"}],
//   price: "PKR 3000",
//   _id: "hira",
// };

const Home = () => {

  const dispatch = useDispatch();
  //to render the products  on webpage that are in state we should use useSelector.
  const {loading,error,products} = useSelector(
    (state)=>state.products
    );

  useEffect(() => {

    if(error){
      toast.error(error);
      dispatch(clearErrors());
    }

   dispatch(getProduct());
  }, [dispatch, error]);

  return (
    <Fragment>
     {loading ? (
      <Loader />
     ): (
  <Fragment>

    <MetaData title ="ECOMMERCE" />
    <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>
          <div className='container' id="container">
            {/* <Product product={product} />
            <Product product={product} />
            <Product product={product} />
            <Product product={product} />
            
            <Product product={product} />
            <Product product={product} />
            <Product product={product} />
            <Product product={product} /> */}

            {/* we use map function on products that we got from state. */}
            {/* if we get products then apply map method */}
            {products && products.map((product) => <ProductCard product={product} />)}
          </div>
  </Fragment>
     )}
  </Fragment>
  );
};

export default Home;