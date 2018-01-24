console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());

// serve files from the public directory
app.use(express.static('public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
const url =  'mongodb://localhost:27017/CA';

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080');
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



app.put('/score', (req, res) => {

  console.log(JSON.stringify(req.body));


  db.collection('scores').save(req.body, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('score added to db');
    res.redirect('/'); 
  }); 
});

app.put('/deleteMyScores', (req, res) => {

  console.log(JSON.stringify(req.body.username));

  db.collection('scores').deleteMany(req.body, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('score deleted from database');
    res.redirect('/'); 
  });

 
});

app.get('/getScores', (req, res) => {

  let list = db.collection('scores').find().sort({"score":-1}).toArray(); //to sort the scores, highest first
  console.log("LIST :" + list.username);
  db.collection('scores').find().sort({"score":-1}).toArray((err, result) => {
    if (err) return console.log(err);
    res.send(result);
  });
});

app.get('/latestScores', (req, res) => {

  let list = db.collection('scores').find().sort({"date":-1}).toArray(); //to sort the scores, highest first
  console.log("LIST :" + list.username);
  db.collection('scores').find().sort({"date":-1}).toArray((err, result) => {
    if (err) return console.log(err);
    res.send(result);
  });
});


