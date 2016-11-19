var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var emotion = require('./emotion.js');

var routes = require('./routes/index');
var users = require('./routes/users');

var fs = require('fs');

var imageProcessor = require('./imageProcessor.js');

var Client = require("ibmiotf");
var config = {
    "org" : "go6dmz",
    "id" : "777-777-7777",
    "domain": "internetofthings.ibmcloud.com",
    "type" : "Phone",
    "auth-method" : "token",
    "auth-token" : "123456789"
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/', routes);
app.use('/users', users);

app.get('/display',function(req,res){
    res.render('display');
});

app.get('/Neutral.mp4',function(req,res){
    var imageName = 'Neutral.mp4';

    //console.log('videoName',videoName);
 
    var __dirname = 'public/videos';
    var file = path.resolve(__dirname,videoName);

    fs.stat(file, function(err, stats) {
      if (err) {
        if (err.code === 'ENOENT') {
          // 404 Error if file not found
          return res.writeHead(404, { "Content-Type": "text/html" });
        }
      res.end(err);
      }
      var range = req.headers.range;
      if (!range) {
       // 416 Wrong range
       return res.writeHead(416, { "Content-Type": "text/html" });
      }
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = (end - start) + 1;

      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      });

      var stream = fs.createReadStream(file, { start: start, end: end })
        .on("open", function() {
          stream.pipe(res);
        }).on("error", function(err) {
          res.end(err);
        });
    });
});

app.post('/image', function(req,res) {
    var base64 = req.body.imageData.replace(/^data:image\/(png|jpg|jpeg|1);base64,/, "");

    // microsoft image processing
    emotion.getEmotion(base64).then(function(data) {
        console.log(data);
    });

    // ibm watson processing
    var bitmap = new Buffer(base64, 'base64');
    fs.writeFile("image/temp.jpg", bitmap, function(err) {
        console.log('file return');
        fs.readFile('image/temp.jpg', function (error, data) {
            if (error) throw error;
            publish(data);
        });
    });
    res.send("Done");
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


/// ibm connection
var deviceClient = new Client.IotfDevice(config);

deviceClient.connect();
 
function publish(data) {
    deviceClient.publish(
        "frame", 
        "buffer",
        data,
        2
    );
    console.log('push an event');
}

deviceClient.on('connect', function () {
    console.log('Connect to server');
    // fs.readFile('image/female_old.jpg', function (err, data) {
    //     if (err) throw err;
    //     publish(data);
    // });
    // fs.readFile('image/male_old.jpg', function (err, data) {
    //     if (err) throw err;
    //     publish(data);
    // });
    // fs.readFile('image/female_young.png', function (err, data) {
    //     if (err) throw err;
    //     publish(data);
    // });
    fs.readFile('image/male_young.jpg', function (err, data) {
        if (err) throw err;
        publish(data);
        console.log('on connect: ', data);
    });
    // fs.readFile('image/party.jpg', function (err, data) {
    //     if (err) throw err;
    //     publish(data);
    //     console.log('on connect: ', data);
    // });
    // setInterval(function() {console.log('wait')}, 1000);
});

deviceClient.on('disconnect', function() {
    deviceClient.connect();
})

deviceClient.on("command", function (commandName,format,payload,topic) {

    if(commandName === "face") {

        var data = JSON.parse(payload);
        imageProcessor.getGenderAndAge(data).then(function(data) {
            console.log(data);
        })
                   
        console.log(data.images[0].image);
        // fs.writeFile('image/face.jpg', data.images[0].image, function(err) {
        //     console.log('write face image back');
        // })
        // console.log(result);
    } else {
        console.log("Command not supported.. " + commandName);
    }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
