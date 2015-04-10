var express = require('express');
var app = express();
var spawn = require('child_process').spawn;
var fs = require('fs');

app.get('/', function(req, res){
  res.send('hello world');
});

app.get('/webcam.jpg', function(req, res){
  return res.sendFile('/tmp/fswebcam.jpg');
});

app.get('/webcam_now.jpg', function(req, res){
  return res.sendFile('/tmp/pony.jpg');
});


function capture(cb) {
  var child = spawn('fswebcam', ['-r', '640x480', '--jpeg', '100', '-D', '0', '-S', '13', '/tmp/fswebcam.jpg']);
  child.stdout.on('close', function(code) {
    cb();
  });
};

capture(function() { console.log('done'); });
setInterval(function() { capture(function(){ console.log('done');}); }, 30*1000);


app.listen(3000);
