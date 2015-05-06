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
    if (item.shortname === req.params.productid) {
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
      if (err)
        return res.status(500)
          .jsonp(err);

      return res.jsonp(contacts);
    });
  })
  .post('/api/contact', function (req, res) {
    return db.contactlist.insert(req.body, function (err, contact) {
      if (err)
        return res.status(500)
          .jsonp(err);

      res.jsonp(contact);
    });
  });

router.get('/api/contact/:id', function (req, res) {
    return db.contactlist.find({
      _id: mongojs.ObjectId(req.params.id)
    }, function (err, contact) {
      if (err)
        return res.status(500)
          .jsonp(err);

      return res.jsonp(contact);
    });
  })
  .put('/api/contact/:id', function (req, res) {
    // make sure we don't interfere with the _id
    delete req.body._id;

    return db.contactlist.update({
      _id: mongojs.ObjectId(req.params.id)
    }, req.body, function (err, updated) {
      if (err)
        return res.status(500)
          .jsonp(err);
      else if (updated.ok) {
        // we get it from req.body to avoid one more query
        req.body._id = req.params.id;
        return res.jsonp(req.body);
      } else {
        return res.status(500)
          .jsonp(new Error('Not updated'));
      }
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
          .jsonp({
            message: 'success'
          });
      }
    });
  });

module.exports = router;
