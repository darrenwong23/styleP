var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.listen(port);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
	res.render('index');
});

console.log('Server now listening on port ' + port);