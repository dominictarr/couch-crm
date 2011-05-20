
/**
 * Module dependencies.
 */

var express = require('express')
  , request = require('request')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){

  res.redirect('/demo/hello-world')
//  res.render('index', {
//    title: 'Express'
//  });
});

// Only listen on $ node app.js

app.get('/json/:database/:document', function (req,res){
  request({uri: "http://localhost:5984/" + req.params.database + "/" + req.params.document}
  , function (err,res2,body){
      res.end(body)
  })

})

app.get('/:database/:document', function (reqm,res){

    res.render('document', {
      title: 'CRM'
    });

})

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
