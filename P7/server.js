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
    io.emit('m_actual', marcador);
    socket.on('m_visitante', function(){
        marcador.visitante++;
        io.emit('m_actual', marcador);
    });
    socket.on('m_local', function(){
        marcador.local++;
        io.emit('m_actual', marcador);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});


