var express = require('express');
var router = express.Router();
const fs = require('fs')
const ObjectId = require('mongodb').ObjectID
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const secret = "a;lkdjalsjf"
const googleAuth = new OAuth2Client("1061817163593-ridc8unsnc47kqqb5c7dr0p4f7dip11d.apps.googleusercontent.com")
/* GET home page. */
router.get('/', function (req, res, next) {
    try {
        req.app.locals.collectionUsers.find({}).toArray(function (err, result) {
            if (err) {
                throw err;
            }
            res.json(result)


        })
    }
    catch (error) {
        console.log('Error, error')
    }

})

router.post('/', function (req, res, next) {
    console.log(req.body)
    console.log('POST')
    req.app.locals.collectionsUsers.findOne({ email: req.body.email })
        .then(foundDoc => {
            if (foundDoc !== null) {
                throw new Error("User Exists")
            }

            return bcrypt.hash(req.body.password, 10)
        })
        .then(passwordHash => {
            req.body.passwordHash = passwordHash
            delete req.body.password

            return req.app.locals.collectionUsers.insertOne(req.body)
        })
        .then(result => {
            res.send("OK")
        })
        .catch(error => {
            res.status(400).json({ msg: "User Not Added" })
        })
})


router.post('/login', function (req, res, next) {


    console.log(req.body)
    console.log('POST')
    req.app.locals.collectionsUsers.findOne({ email: req.body.email })
        .then(foundDoc => {

            if (foundDoc === null) {
                throw new Error("No such user")
            }

            return bcrypt.compare(req.body.password, foundDoc.passwordHash)
        })
        .then(validPassword => {

            if (validPassword != true) {
                throw new Error("INvalid Password")
            }

            // create jwt
            return new Promise((resolve, reject) => {
                jwt.sign({ email: foundDoc.email }, secret, (error, token) => {
                    if (error !== null) {
                        reject(error)
                    }
                    else {
                        resolve(token)
                    }
                })

            })
                .then(token => {
                    res.json(token)
                })
                .catch(error => {
                    res.status(403).statusMessage(error.msg)
                })
        })
})

router.post('/oauth/google', function (req, res, next) {
    console.log(req.body)
    // verify google token
    googleAuth.verifyIdTokenAsync({
        idToken: req.body.tokenId,
        audience: "1061817163593-ridc8unsnc47kqqb5c7dr0p4f7dip11d.apps.googleusercontent.com"
    })
        .then(ticket => {
            return ticket.getPayload()
        })
        .then(payload => {

            return req.app.locals.collectionsUsers.findOne({ email: payload.email })
        })
        .then(foundDoc => {

            if (foundDoc === null) {
                throw new Error("No such user")
            }

            // create jwt
            return new Promise((resolve, reject) => {
                jwt.sign({ email: req.body.email }, secret, (error, token) => {
                    if (error !== null) {
                        reject(error)
                    }
                    else {
                        resolve(token)
                    }
                })

            })
        })
        .then(token => {
            console.log(token)
            res.json(token)
        })
        .catch(error => {
            res.status(403)//.statusMessage(error.msg)
        })

})

// replacement method updates array value of specified element or position//
router.delete('/:id', function (req, res, next) {

    try {
        req.app.locals.collectionUsers.deleteOne({ _id: ObjectId(req.params.id) }, function (err, obj) {

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
        req.app.locals.collectionUsers.replaceOne({ _id: ObjectId(req.params.id) }, req.body)
        res.send("OK")
    }
    catch (error) {

        console.log('Error', error)
    }

})

module.exports = router;