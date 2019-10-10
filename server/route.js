// post.model.js
const fs = require('fs');
const https = require('https');
const express = require('express');
const postRoutes = express.Router();
const axios = require('axios');

// Defined store route
// postRoutes.route('/add').post(function (req, res) {
//   let post = new Post(req.body);
//   post.save()
//     .then(() => {
//       res.status(200).json({'business': 'business in added successfully'});
//     })
//     .catch(() => {
//       res.status(400).send("unable to save to database");
//     });
// });

// Defined get data(index or listing) route
postRoutes.route('/pippo').get(function (req, res) {
    // find(function(err, posts){
    // if(err){
    //   res.json(err);
    // }
    // else {
    //   res.json(posts);
    // }

  //});
  console.log("Called /pippo with get function");
  res.json({'answerFromServer':'ciao'});
});

// Send crystals info via json
postRoutes.route('/getcrystals').get(function (req, res) {
  console.log("Called /getcrystals with get function");
  var obj = JSON.parse(fs.readFileSync('utils/EE_channels_border_map.json', 'utf8'));
  res.json({'crystal_map':obj});
});

postRoutes.route('/getroot').post(function (req, res) {

  //console.log(req);
  
  var newLink = "https://cmsweb.cern.ch/dqm/online/jsonfairy/archive/327483/Global/Online/ALL/EcalEndcap/EEOccupancyTask/EEOT digi occupancy EE +";
  
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // (NOTE: this will disable client verification)
    cert: fs.readFileSync("./utils/certificates/usercert.pem"),
    key: fs.readFileSync("./utils/certificates/userkey.pem"),
    passphrase: req.body.dqmpass
  })

  axios.get(newLink,{httpsAgent})
  .then(function (response) {
    // console.log(response.data);
    res.json({'data':response.data});
  })
  .catch(function (error) {
    // console.log(error);
    res.json({'data':'error'});
  });
  //res.json({'data':'error'});
  
});

module.exports = postRoutes;
