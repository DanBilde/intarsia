'use strict';

var express = require('express');
var router = express.Router();
var appdata = require('../data.json');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('products', ['products']);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressSession = require('express-session');

var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');

router.use(bodyParser.urlencoded({
  extended: false
}));

router.use(cookieParser());

router.use(expressSession({
      secret: process.env.SESSION_SECRET || 'secret',
      resave:false,
      saveUninitialized:false
  }));


router.use(passport.initialize());
router.use(passport.session());

passport.use(new passportLocal.Strategy(function(username, password, done) {
     //Pretend this is using a real database!

     if(username === password) {

      done(null, { id: username, name: username});
     } else {
      done(null, null);
     }

}));

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  //Query the database or cache here
  done(null, { id: id , name: id });
});

function ensureAuthenticated(req, res , next) {
   if(req.isAuthenticated()) {
    next();
   } else {
        res.send(403);
   }
}

router.post('/login', passport.authenticate('local'), function(req,res) {
    res.redirect('/productlist');
});

router.get('/logout' , function(req,res) {
  req.logout();
  res.redirect('/');
});


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

router.get('/productlist',  ensureAuthenticated , function (req, res) {
  return res.render('admin', {
    title: 'Admin',
    isAuthenticated:req.isAuthenticated(),
    user:req.user
  });
});

router.get('/login', function(req,res) {
    res.render('login');
});



/*******************************************
 * API routes
 ******************************************/

router.get('/api/product', function (req, res) {
    return db.products.find(function (err, products) {
      if (err)
        return res.status(500)
          .jsonp(err);

      return res.jsonp(products);
    });
  })
  .post('/api/product', function (req, res) {
    return db.products.insert(req.body, function (err, product) {
      if (err)
        return res.status(500)
          .jsonp(err);

      res.jsonp(product);
    });
  });

router.get('/api/product/:id', function (req, res) {
    return db.products.find({
      _id: mongojs.ObjectId(req.params.id)
    }, function (err, product) {
      if (err)
        return res.status(500)
          .jsonp(err);

      return res.jsonp(product);
    });
  })
  .put('/api/product/:id', function (req, res) {
    // make sure we don't interfere with the _id
    delete req.body._id;

    return db.products.update({
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
  .delete('/api/product/:id', function (req, res) {
    return db.product.remove({
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
