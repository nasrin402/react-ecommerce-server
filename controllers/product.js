const Product = require("../models/product");
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
