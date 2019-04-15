var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');
router.use(fileUpload());
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dsq09ouxb',
  api_key: '243513648698352',
  api_secret: 'JFzMEBmfMOJnCYTHV4NKC-t25yk'
});

'use strict';

const request = require('request');

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = 'b8c74fca278842fb96b3db5fa46680f8';

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

const imageUrl =
    'https://res.cloudinary.com/dsq09ouxb/image/upload/v1541672879/vmeqruh2wztyj5c7weaw.jpg';

// Request parameters.
const params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
        'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};

const option = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
};

request.post(option, (error, response, body) => {
  if (error) {
    console.log('Error: ', error);
    return;
  }
  let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
  console.log('JSON Response\n');
  console.log(jsonResponse);
});

var mongoose= require('mongoose');
var options = { server: { socketOptions: {connectTimeoutMS: 5000 } }};
mongoose.connect('mongodb://sofyen:aaaa1234@ds155823.mlab.com:55823/locapic',
    options,
    function(err) {
     console.log(err);
    }
);

var pictureSchema = mongoose.Schema({
  url:String,
  latitude:String,
  longitude:String
})
var pictureModel = mongoose.model('picture', pictureSchema)



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// NOM DE PHOTO DYNMIC
var i = 0;

router.post('/upload', function(req, res) {

// FILEPATH DYNAMIC >> DRY (don't repeat yourself! Aka Thierry!)
let photoPath = `public/images/nomImageAChoisir-${i}.jpg`;

i++;
  //recup l'image depuis le front
let filename = req.files.photo;

// envoyer l'image dans le dossier publi/images en mettant le nom et le format de l'image
 filename.mv(photoPath, function(err) {
   if (err){
     return res.status(500).send(err);
   }
   cloudinary.v2.uploader.upload(photoPath,
    function(error, result){
      if(result){

        var newPicture = new pictureModel({
          url:result.secure_url,
          latitude:req.body.lat,
          longitude:req.body.lng
        })

        newPicture.save(function(err, picture){
          console.log("photo OK");
        })

        res.send(`File uploaded --> ${result}`);
      } else if (error) {
        res.send(error);
      }
    });
    // res.send à intégrer dans la fonction de call back
 });
});



router.get('/displayPicture', function(req, res, next) {

  pictureModel.find(function(err, picture){
    console.log("PHOTO RECUP",picture);
    res.json(picture)
  })

});


router.get('/coordsMaps', function(req, res, next) {

  pictureModel.find(function(err, picture){
    res.json(picture)
  })

});




module.exports = router;
