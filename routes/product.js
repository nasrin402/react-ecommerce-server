const express = require("express");
const router = express.Router();


//middlewares
const {authCheck, adminCheck} = require("../middlewares/auth");
//controllers
const {create, listAll, remove, read, update} = require('../controllers/product');
//routes
router.post('/product',authCheck, adminCheck, create);
router.get('/products/:count', listAll);
router.get('/product/:slug', read);
router.delete('/products/:slug', authCheck, adminCheck, remove);
router.put('/product/:slug', authCheck, adminCheck, update);


module.exports = router;
