var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Inventory = require('../models/inventory');
var Hotel = require('../models/hotel');
var Partner = require('../models/partner');
var Forgot = require('../models/forgot');
var User = require('../models/user');
var nodemailer = require('nodemailer');
var Offer = require('../models/offer')

//support on x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));


//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//Discover page with today Offeres

//get all the inventory rooms
router.get('/rooms', function(req, res, next){
  console.log('================ getting all rooms =================');
  Inventory.find({})
  .exec(function(err, inventories){
    if(err){
      console.log('error occured');
      res.send('error occured!');
    } else {
      console.log(inventories);
      res.json(inventories);
    }
  });
});

//get today offered all rooms
//{"rooms": {id: this.todayOfferIndex}}
router.get('/offeredRooms', function(req, res, next){
  console.log('================ getting all today offered rooms =================');
  Inventory.find({"rooms": {$elemMatch: {_id: mongoose.Types.ObjectId(Inventory.todayOfferIndex)}}})
  .exec(function(err, offeredRooms){
    if(err){
      console.log('error occured');
      res.send('error occured!');
    } else {
      console.log(offeredRooms);
      res.json(offeredRooms);
    }
  });
});

router.get('/dateAndTimeNow', function(req, res, next){
  console.log('================ getting Now Date and Time =================');
  var timeNow = new Date()
  res.json({message: "success", status: "dateAndTimeNow", content: timeNow})
});


//location
router.post('/nearme', function(req, res, next){
  console.log('################# checking hotels in near radar ###################');
  console.log(req.body);

  var lat = parseFloat(req.body.Lat, 10);
  var lon = parseFloat(req.body.Lon, 10);

  var lat_low = lat - 0.001569612;//6.8740928;//
  var lat_hi = lat + 0.001569612; //6.8741928;//
  var lon_low = lon - 0.000008998719243599958; //79.860028;//
  var lon_hi = lon + 0.000008998719243599958; //79.860125; //
  // Let’s define r = d/R = (1000 km)/(6371 km) = 0.1570 as the angular radius of the query circle.
  // 10km/6371km = 0.001569612
  // const RAD = 0.000008998719243599958;
  // Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(long1 - long2, 2)) / RAD;
  //((hotel.location.lat <  lat_hi) && (hotel.location.lat > lat_low) && (hotel.location.lon <  lat_hi) && (hotel.location.lon > lat_low)
  //{"created_on": {"$gte": start, "$lt": end}}
  //.where('hotel.location.lat').gt(lat_low).lt(lat_hi) // && (hotel.location.lon).gt(lat_low).lt(lat_hi))
  //"location": {
            //     "lon": 79.86001825329367,
            //     "lat": 6.874234214394656
            // },
  //'location.lat': {"$gte": lat_low, "$lt": lat_hi}, 'location.lon': {"$gte": lon_low , "$lt": lon_hi}

  Offer.find({'location.lon': {"$gte": lon_low, "$lt": lon_hi}, 'location.lat': {"$gte": lat_low, "$lt": lat_hi}})
    .exec(function(err, hotels){
      console.log(`######### =======> range of the place ###### lat: lat_low = ${lat_low} | lat_hi = ${lat_hi} ###### lon: lon_low = ${lon_low} | lon_hi = ${lon_hi}`);
      if(err){
        console.log('error occured');
        res.send('error');
      } else {
        if(typeof hotels[0] !== 'undefined' && hotels[0] !== null){
          console.log("hotel exist : operation on");
          console.log(hotels);
          console.log('############## coordinates matched ###############');
          res.json({ message: 'success', status: 'near_hotels_found', content: hotels});
        }else{
          console.log("null data : hotel does not exist");
          res.json({ message: 'failed', status: 'near_hotels_not_found'});
        }
      }
    });
});

module.exports = router;
