var express = require('express');
var app = express();
var spawn = require('child_process').spawn;
var fs = require('fs');
var when = require('when');


var Capture = function(init) {
    var self = this;

    self.cameraInUse = false;

    self.doCapture = function() {
        if (self.cameraInUse) {
            return when.resolve();
        }
        var d = when.defer();

        self.cameraInUse = true;
        var child = spawn('fswebcam', ['-r', '80x60', '--jpeg', '100', '-D', '0', '-S', '13', '--no-banner', '/tmp/fswebcam.jpg']);
        child.stdout.on('close', function(code) {
            self.cameraInUse = false;
            console.log("capture completed at " + new Date());
            return d.resolve();
        });
        return d.promise;
    };

    self.interval = setInterval(function() {
        self.doCapture().then(function() {
        });
    }, init.intervalTime);
};

var capture = new Capture({
    intervalTime: 5*1000
});


app.get('/', function(req, res){
    res.sendFile('/home/pi/plantcam/index.html');
});

// serve the latest image
app.get('/webcam.jpg', function(req, res){
    return res.sendFile('/tmp/fswebcam.jpg');
});


// an API?
app.post('/api/v1/update', function(req, res){
    capture.doCapture.then(function() {
        return res.send({});
    });
});

app.listen(3000);
console.log('listening on 3000');
