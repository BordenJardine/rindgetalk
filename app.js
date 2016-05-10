var express = require('express');
var templates = require('express-handlebars');
var MongoDB = require('mongodb').MongoClient;

var app = express();
var dbUrl = 'mongodb://localhost:27017/rps';
var db;

app.engine('handlebars', templates({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use((req,res,next) => {
  req.db = db;
  next();
});
app.use('/', require('./routes'));

MongoDB.connect(dbUrl, (err, database) => {
  if(err) console.log(err);
  db = database;
  app.listen(9001);
  console.log('listening on 9001!');
});
