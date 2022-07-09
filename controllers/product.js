const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    //console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = new Product(req.body).save();
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    //res.status(400).send("product create failed")
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  const products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deleted);
  } catch (err) {
    console.log(err);
    // return res.status(400).send("Product deleted")
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subs")
    .exec();
  res.json(product);
};

exports.update = async (req, res) => {
  try {
   
    // if(req.body.title){
    //   req.body.slug = slugify(req.body.title);
    // }
    const updated = await Product.findOneAndUpdate(
      {slug:req.params.slug},
      req.body,
      {new: true}
    );
    res.json(updated);
  } catch (err) {
    console.log("PRODUCT UPDATED FAILED ------>", err);
    // return res.status(400).send("Product Update Failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

// without pagination

// exports.list = async(req, res) =>{
//   try{
// const {sort, order, limit} = req.body;
// const products = await Product.find({})
// .populate("category")
// .populate("subs")
// .sort([[sort, order]])
// .limit(limit)
// .exec();
// res.json(products)
//   }catch(err){
// console.log(err)
//   }
// }

//WITH PAGINATION
exports.list = async(req, res) =>{
  try{
const {sort, order, page} = req.body;
const currentPage = page || 1;
const perPage = 3; //3

const products = await Product.find({})
.skip((currentPage -1) * perPage)
.populate("category")
.populate("subs")
.sort([[sort, order]])
.limit(perPage)
.exec();
res.json(products)
  }catch(err){
console.log(err)
  }
}

exports.productsCount = async(req, res) =>{
  const total = await Product.find({}).estimatedDocumentCount();
  res.json(total); 
}

exports.productStar = async(req, res) =>{
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({email: req.user.email}).exec();
  const {star} = req.body;

  //who is updating
  //check if currently logged in user have already added rating to this product
  let existingRatingObject = product.ratings.find((ele) =>ele.postedBy.toString() === user._id.toString());

  //if user haven't left rating yet, push it
  if(existingRatingObject === undefined){
    let ratingAdded = await Product.findByIdAndUpdate(product._id, {
      $push: {ratings: {star: star, postedBy: user._id}},
    },
    {new:true}).exec();
    console.log("ratingAdded", ratingAdded);
    res.json(ratingAdded)
  }else {
    //if user have a;ready left rating, update it
    const ratingUpdated = await Product.updateOne(
      {
      ratings:{
        $elemMatch: existingRatingObject
      }},
      {
        $set: {"ratings.$.star": star}
      },
      {new: true}
    ).exec();

    console.log("ratingUpdate", ratingUpdated)
    res.json(ratingUpdated);
  }
};

exports.listRelated = async (req, res) =>{
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: {$ne: product._id},
    category: product.category,
  })
  .limit(3)
  .populate("category")
  .populate("subs")
  .exec();

  res.json(related)
}