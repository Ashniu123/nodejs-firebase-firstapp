var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var firebase = require('firebase');
var config = require('../config.json');

firebase.initializeApp(config);//initializing configurations for firebase

router.use(bodyParser.json());

var ref = firebase.database().ref();//creating reference to root
var usersRef = ref.child('users/');//creating reference to child of root

//Insert Static Data in beginning
//push gives a unique id to data in database
/*usersRef.push({
 name: "John",
 email:"john@xyz.com",
 isNew:true
 });
 usersRef.push({
 name: "Amanda",
 email:"amanda@abc.com",
 isNew:true
 });*/

router.get('/endpoint', function (req, res) {
    /*Send all values currently in database to user*/
    usersRef.once("value", function (snapshot) {
        res.send(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
})
    .post('/endpoint', function (req, res) {
        /*Receive value entered by user, push it do database and give updated value back to user*/
        console.log("Received:", req.body);
        var newRef = usersRef.push(req.body);
        var key = newRef.key;
        usersRef.once("child_added", function (data, prevChildKey) {
            ref.child('/users/' + key).update({isNew: false});//Update isNew field to false
            res.send(data.val());
        });
    });

module.exports = router;
