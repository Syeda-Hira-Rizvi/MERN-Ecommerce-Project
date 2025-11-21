import React, {Fragment, useEffect, useState }from 'react';
import {useSelector,useDispatch} from "react-redux";
import {clearErrors, getProduct} from "../../actions/productAction";
import { useParams } from 'react-router-dom';
import Loader from '../layout/Loader/Loader.js';
import ProductCard from "../Home/ProductCard.js";
import "./Products.css";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import { toast } from "react-toastify";
import Typography from "@mui/material/Typography";
import MetaData from "../layout/MetaData";


const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];


const Products = ({match}) => {
 const dispatch = useDispatch();
 const { keyword } = useParams();

 const [currentPage, setCurrentPage] = useState(1);
 const [price, setPrice] =useState([0, 25000]);
 const [category, setCategory] = useState("");
 const [ratings, setRatings] = useState(0);
 

 const {
    products,
    loading,
    error,
    productsCount, 
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  //const keyword = match.params.keyword;

  const setCurrentPageNo = (e) => {
   setCurrentPage(e);
  }

  const priceHandler = ((event, newPrice) => {
    setPrice(newPrice);
  });
 

  useEffect(() =>{
    if(error){
      toast.error(error);
      dispatch(clearErrors());
    }
    //console.log(products,"products before");
  dispatch(getProduct(keyword, currentPage, price, category, ratings));
  //console.log(products,"products after");
  }, [dispatch, keyword, currentPage, price, category, ratings, error]);


  let count = filteredProductsCount;

   return ( <Fragment>{loading  ? (<Loader/> 
): (
   <Fragment>
        <MetaData title="PRODUCTS -- ECOMMERCE" />
       <h2 className='productsHeading'>Products</h2>

       <div className='products'>
         { products &&
         products.map((product) => (
            <ProductCard key={product._id} product= {product} />
         ))}
       </div>

       <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
              size='small'  
            />

      <Typography>Categories</Typography>
        <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                size='small' 
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>


            </div>
      
      {resultPerPage < count && (
         <div className="paginationBox">
         <Pagination
           activePage={currentPage}
           itemsCountPerPage={resultPerPage}
           totalItemsCount={productsCount}
           onChange={setCurrentPageNo}
           nextPageText="Next"
           prevPageText="Prev"
           firstPageText="1st"
           lastPageText="Last"
           itemClass="page-item"
           linkClass="page-link"
           activeClass="pageItemActive"
           activeLinkClass="pageLinkActive"
         />
       </div>
      )}

    </Fragment>
)}
    </Fragment>
   );
};

  


export default Products;