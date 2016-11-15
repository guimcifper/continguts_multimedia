var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var marcador = {
	local:0,
	visitante:0	
};

app.use("/pub", express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    io.emit('redibujar-marcador', marcador);
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('Gol-visitante', function(){
        marcador.visitante+=1;
        io.emit('redibujar-marcador', marcador);
    });
    socket.on('Gol-local', function(){
        marcador.local+=1;
        io.emit('redibujar-marcador', marcador);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


