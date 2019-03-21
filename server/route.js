// post.model.js
const fs = require('fs');

const express = require('express');
const postRoutes = express.Router();

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

// Defined edit route
// postRoutes.route('/edit/:id').get(function (req, res) {
//   let id = req.params.id;
//   findById(id, function (err, post){
//       if(err) {
//         res.json(err);
//       }
//       res.json(post);
//   });
// });

//  Defined update route
// postRoutes.route('/update/:id').post(function (req, res) {
//     findById(req.params.id, function(err, post) {
//     if (!post)
//       res.status(404).send("data is not found");
//     else {
//         post.title = req.body.title;
//         post.body = req.body.body;
//         post.save().then(() => {
//           res.json('Update complete');
//       })
//       .catch(() => {
//             res.status(400).send("unable to update the database");
//       });
//     }
//   });
// });

// Defined delete | remove | destroy route
// postRoutes.route('/delete/:id').delete(function (req, res) {
//     findByIdAndRemove({_id: req.params.id}, function(err){
//         if(err) res.json(err);
//         else res.json('Successfully removed');
//     });
// });

module.exports = postRoutes;
