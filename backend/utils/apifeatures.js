class ApiFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    //we can access anything in the object ApiFeatures by writing same as this.query or this.queryStr. here this.queryStr.keyword is same as req.query.
search(){
   const keyword = this.queryStr.keyword ? {
    name: {
        //here regex is mongodb operator called as regular expression.
        $regex:this.queryStr.keyword,
        $options: "i",
    },
   } : {};

   //console.log(keyword);

   this.query = this.query.find({...keyword});
   return this;
}

//we have to make some changings to the queryStr in the filtering so we amke a copy of if it .
filter(){
 const queryCopy =  {...this.queryStr}; //if we write this.queryStr like that it will create problem means as queryStr is an object and in javascript objects are passes as reference not value so if we do any changing in the query this wil affect the queryStr ....so to avoid that we use spread operator.
  
 //console.log(queryCopy);
 //Removing some fields for category
 const removeFields = ["keyword","page","limit"];
 removeFields.forEach(key=>delete queryCopy[key]);
 //console.log(queryCopy);

 //Filter for Price and Rating

 //console.log(queryCopy); for checking gt and lt 
 //console.log(queryCopy);
 let queryStr = JSON.stringify(queryCopy);
 queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
 

// this.query = this.query.find(queryCopy);  //this.query means Product.find().
 this.query = this.query.find(JSON.parse(queryStr));  //this.query means Product.find().
// console.log(queryStr);
 return this;
}

pagination(resultPerPage){
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
}
}
 
module.exports = ApiFeatures;