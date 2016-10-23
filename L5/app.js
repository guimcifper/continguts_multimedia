/**
 * Created by boyander on 11/10/16.
 */

var express = require('express');
var Item = require('./Item.js').Item;
var app = express();

// Configure jade to be our rendering engine
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

// Enable boostrap from npm as a served static directory
app.use("/libs",express.static('node_modules/bootstrap/dist'));

// Our CSS and JS files
app.use("/public",express.static('public'));


/*

var pics = [
	new Item("DUKE ELLINGTON","https://m2.game.es/COVERV2/3D_L/130/130711.png","5.99"),
	new Item("JOHN COLTRANE","http://www.musicpriceguide.com/ItemPic/101998970529960.JPG","9.99"),
	new Item("JOE CUBA SEXTET","http://thumbs1.picclick.com/d/l400/pict/401183217260_/Joe-Cuba-Breakin-Out-Latin-Jazz-LP-Seeco.jpgG","13.99"),
	new Item("ZOOT SIMS","http://www.popsike.com/pix/20050311/4709352582.jpg","9.99"),
	new Item("JOHN COLTRANE","http://www.musicpriceguide.com/ItemPic/475849953360176.JPG","9.99"),
	new Item("MAL WALDRON","http://www.popsike.com/pix/20061229/150075555684.jpg","9.99"),
	new Item("BILLIE & STAN","https://s-media-cache-ak0.pinimg.com/564x/b6/9e/e3/b69ee3e45bf83c2538de99208ed5e41e.jpg","19.99"),
	new Item("SOUTH AFRICAN JAZZ","https://s-media-cache-ak0.pinimg.com/564x/b6/9e/e3/b69ee3e45bf83c2538de99208ed5e41e.jpg","10.99")

*/
// Modulo 500px con la función searchByTerm() para conseguir fotos del resultado de la busqueda "Barcelona"

// Use 500px API to get random pictures for our products
var API500px = require('500px');
var api500px = new API500px("YecP85RjzG08DN0MqvgFa0N780dNaDmJX6iTPbYp");
var pics = [];
api500px.photos.searchByTerm('Jazz club', {'sort': 'created_at', 'rpp': '12','image_size':200},  function(error, results) {
	// Do something
	pics = results.photos.map(function(a){
		// Compose object to be used in show items template
		return new Item(a.image_url);
	});
});

// Render frontpage
app.get('/', function (req, res) {
    res.render('portada',{
        pics: pics
    });
});


// Server start
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
