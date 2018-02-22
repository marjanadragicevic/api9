var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressWs = require('express-ws');
var sharp = require('sharp');


var ews = expressWs(express());
var app = ews.app;


var Cylon = require('cylon');


var robot = Cylon.robot ({
  connections: {
    arduino: { adaptor: 'firmata', port: 1411}
  },

  devices: {
    led: { driver: 'led', pin: 2}
  },

  work: function(my) {
    every((1).second(), function() {
      my.led.toggle();
    });

    every((8).second(), function() {
      my.led.turnOff();
    });

    every((10).second(), function() {
      my.led.turnOn();
    });

  }
}). start();

// Set up the '/ws' resource to handle web socket connections
app.ws('/ws', function (ws, req) {
  // A message has been received from a client
  ws.on('message', function (msg) {
    var clients = ews.getWss('/ws').clients;
    // Debug print it
    sharp('testimage.png')
  .resize(300, 200)
  .toFile('output.jpg', function(err) {
    // output.jpg is a 300 pixels wide and 200 pixels high image
    // containing a scaled and cropped version of input.jpg
  });
if(msg){
  console.log(msg);
}
    console.log(new Date().toLocaleTimeString() + '> ' + msg);

    // Broadcast it to all other clients
    clients.forEach(c => {
      c.send(msg);
    });
  });
});

//var expressWs = require('express-ws')(app);
app.use(require('middleware-static-livereload')({
  documentRoot: 'public/'
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  if (err.status)
    res.sendStatus(err.status);
  else
    res.sendStatus(500);
});

let port = 4040;

app.listen(port);
console.log('Webserver started: http://localhost:' + port);
module.exports = app;