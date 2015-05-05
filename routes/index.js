'use strict';

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
  return res.render('admin', {
    title: 'Admin',
  });
});

/*******************************************
 * API routes
 ******************************************/

router.get('/api/contact', function (req, res) {
  return db.contactlist.find(function (err, contacts) {
    return res.jsonp(contacts);
  });
});

router.post('/api/contact', function (req, res) {
  return db.contactlist.insert(req.body, function (err, doc) {
    res.jsonp(doc);
  });
});

router.get('/api/contact/:id', function (req, res) {
    return db.contactlist.find({
      _id: mongojs.ObjectId(req.params.id)
    }, function (err, contacts) {
      return res.jsonp(contacts);
    });
  })
  .delete('/api/contact/:id', function (req, res) {
    return db.contactlist.remove({
      _id: mongojs.ObjectId(req.params.id)
    }, function (err) {
      if (err) {
        return res.status(500)
          .jsonp(err);
      } else {
        return res.status(200)
          .end();
      }
    });
  });

module.exports = router;
