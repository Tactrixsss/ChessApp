var express = require('express');
var router = express.Router();
const fs = require('fs')
const ObjectId = require('mongodb').ObjectID


function verifyToken(req, res, next) {

  //get authorization header from api packetm
  let auth = req.headers('authorization')
  //check to be sure header I got the authorized header
  if (auth !== 'undefined') {
    //split the header into the bearer and the token
    let [, token] = auth.split(" ")

  
  try {
    const payload = jwt.verify(token, req.app.locals.jwtSecret)
    new Promise((resolve, reject) => {
      jwt.sign({ email: payload.email }, req.app.locals.jwtSecret, (error, token) => {

        if (error !== null) {
          reject(error)
        }
        else {
          resolve(token)
        }
      })

    })


      .then(freshToken => {
        req.freshToken = freshToken
        next()
      })
  }
  catch (error) {
    res.sendStatus(403)
  }
}
else {
  res.sendStatus(403)
}
}
/* GET home page. */
router.get('/', function (req, res, next) {
  try {
    //.to array takes my objects in my db and converts to an array of objects.
    req.app.locals.collectionOpenings.find({}).toArray(function (err, result) {
      if (err) {
        throw err;
      }
      res.json(result)


    })
  }
  // res.json takes array of objects and converts it to json then sends it to whoever is req info.(react, postman etc..)
  catch (error) {
    console.log('Error, error')
  }

})

router.post('/', function (req, res, next) {
  console.log(req.body)
  try {
    req.app.locals.collectionOpenings.insertOne(req.body)
  }
  catch (error) {
    console.log("Error", error)
  }

  res.send("OK")

})

// replacement method updates array value of specified element or position//
router.delete('/:id', function (req, res, next) {

  try {
    req.app.locals.collectionOpenings.deleteOne({ _id: ObjectId(req.params.id) }, function (err, obj) {

      if (err) {
        throw err
      }
      else {
        res.send("OK")
      }
    })

  }
  catch{
    res.send("NOT OK")
  }

})

// replacement method updates array value of specified element or position//
router.put('/:id', function (req, res, next) {

  try {
    req.app.locals.collectionOpenings.replaceOne({ _id: ObjectId(req.params.id) }, req.body)
    res.send("OK")
  }
  catch (error) {

    console.log('Error', error)
  }

})


module.exports = router;