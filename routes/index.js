var express = require('express');
var router = express.Router();
var appdata = require('../data.json');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist', ['contactlist']);

/* GET home page. */
router.get('/', function (req, res) {
  var myArtwork = [];
  var myProducts = [];
  myProducts = appdata.products;
  appdata.products.forEach(function (item) {
    myArtwork = myArtwork.concat(item.artwork);
  });
  res.render('index', {
    title: 'Home',
    artwork: myArtwork,
    products: myProducts,
    page: 'home'
  });
});

/* Get Products page */
router.get('/products', function (req, res) {
  var myArtwork = [];
  var myProducts = [];

  myProducts = appdata.products;
  appdata.products.forEach(function (item) {
    myArtwork = myArtwork.concat(item.artwork);
  });
  res.render('products', {
    title: 'Products',
    artwork: myArtwork,
    products: myProducts,
    page: 'productList'
  });
});

/* Get Product detail page */
router.get('/products/:productid', function (req, res) {
  var myArtwork = [];
  var myProducts = [];
  appdata.products.forEach(function (item) {
    if (item.shortname == req.params.productid) {
      myProducts.push(item);
      myArtwork = myArtwork.concat(item.artwork);
    }
  });
  res.render('products', {
    title: 'Products',
    artwork: myArtwork,
    products: myProducts,
    page: 'productDetail'
  });
});

router.get('/contactlist', function (req, res) {
  console.log("I received a GET request");

  return db.contactlist.find(function (err, docs) {
    console.log(docs);
    return res.render('admin', {
      title: 'Admin',
      contactlist: docs
    });
  });
});

module.exports = router;
