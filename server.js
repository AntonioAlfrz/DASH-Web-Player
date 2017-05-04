var express = require('express');
var app = express();
// Serve static files
app.use('/',express.static('public'));
var server = require('http').createServer(app);
var port = process.env.PORT || 8080;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});