/**
 * by Guim Cifré
 */
$(document).ready(function() {

    // Creem la pala
    var Pala = function(x_start, y_end){
        this.color_pala = "#FFF700";
        this.position = {x:x_start-2, y:canvas.height/2-10};
        this.size = {w:5, h:25};
        this.y_end = y_end;
    };

    Pala.prototype.render = function(ctx){
        ctx.fillStyle = this.color_pala;
        ctx.fillRect(   this.position.x,
                        this.position.y,
                        this.size.w,
                        this.size.h);
    };

    Pala.prototype.goUp = function(){
        if (this.position.y >= 5) this.position.y -= 5;
    };

    Pala.prototype.goDown = function(){
        if (this.position.y+this.size.h+5 <= this.y_end) this.position.y += 5;
    };

    Pala.prototype.setKeys = function(keyUp, keyDown){
        var _this = this;
        $(window).keydown(function(event) {
            
            if (event.which == keyUp) {
                _this.goUp();
            } else if (event.which == keyDown){
                _this.goDown();
            }
        });
    }
    var Bola = function(start_pos_x, start_pos_y, angle){
        this.position = {x:start_pos_x, y:start_pos_y};
        this.color_bola = "#000";
        this.radio = 2;
        this.angle =  angle;
        this.velocidad = 2;
    }

    Bola.prototype.render = function(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.color_bola;
        ctx.arc(this.position.x, this.position.y, this.radio, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    var canvas = document.getElementById("mycanvas");
    var ctx = canvas.getContext("2d");

    var pala_L = new Pala(10, canvas.height);
    var pala_R = new Pala(canvas.width-10, canvas.height);

    pala_L.setKeys(87,83);
    pala_R.setKeys(38,40); 


    var bola = new Bola(canvas.width/2, canvas.height/2, 70);


    // Inicialitzem marcadors
    var redL = 0;
    var blueR = 0;

    var socket = io();

    // Función para actualizar el movimiento de la bola
    function updateBola() {

        // Rebot
        if (bola.position.y < 0) {
            bola.position.y = 0;
            bola.angle = (Math.PI / 180.0) - bola.angle;
        } else if (bola.position.y + bola.radio > canvas.height) {
            bola.position.y = canvas.height - bola.radio;
            bola.angle = (Math.PI / 180.0) - bola.angle;
        }

        // Rebot raqueta esquerra
        if ((bola.position.x > pala_L.position.x)&&(bola.position.x < pala_L.position.x+pala_L.size.w) &&
            (bola.position.y+bola.radio > pala_L.position.y)&&(bola.position.y < pala_L.position.y+pala_L.size.h)){
            var newAngle = (bola.position.y + bola.radio/2) - (pala_L.position.y + pala_L.size.h/2);
            newAngle /= pala_L.size.h/2 + bola.radio/2;
            bola.angle = Math.PI/180 * (80*newAngle);

         // Rebot raqueta dreta
        } else if ((bola.position.x+bola.radio < pala_R.position.x+pala_R.size.w) &&
            (bola.position.x+bola.radio > pala_R.position.x) &&
            (bola.position.y+bola.radio > pala_R.position.y) &&
            (bola.position.y < pala_R.position.y+pala_R.size.h)){
            var newAngle = (pala_R.position.y + pala_R.size.h/2) - (bola.position.y + bola.radio/2);
            newAngle /= pala_R.size.h/2 + bola.radio/2;
            bola.angle = Math.PI/180 * (180 + 80*newAngle);
        }

        if (bola.position.x + bola.radio < 0){
            cambiaMarcador('R');
            bola = new Bola(canvas.width/2, canvas.height/2, 70);
        } else if (bola.position.x > canvas.width){
            cambiaMarcador('L');
            bola = new Bola(canvas.width/2, canvas.height/2, 15);
        }

        // Movimient de la bola
        bola.position.x += bola.velocidad * Math.cos(bola.angle);
        bola.position.y += bola.velocidad * Math.sin(bola.angle);
    }

       function cambiaMarcador(equipo){
        if (equipo == 'R') {
            socket.emit('m_visitante');
        } else {
            socket.emit('m_local');
        }
        socket.on('m_actual', function(marcador){
            redL=marcador.local;
            blueR=marcador.visitante;
        });
}

    function renderCampo(ctx){
        // Camp
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,canvas.width,canvas.width);
	ctx.fillRect(0,0,canvas.width,canvas.width);
        ctx.clearRect(canvas.width/2,0,1,canvas.width/2);

	//Noms
        ctx.fillStyle = "#FF0000";
        ctx.font = "10px";
        ctx.fillText("RED", 102, 10);

        ctx.fillStyle = "#0400FF";
        ctx.fillText("BLUE", 178, 10);

        //Marcador

        ctx.fillStyle = "#000";
        ctx.fillText(redL, canvas.width/2 - 18, 10);
        ctx.fillText(blueR, canvas.width/2 + 11, 10);
    }

    function render(){
        updateBola();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderCampo(ctx);
        pala_L.render(ctx);
        pala_R.render(ctx);
        bola.render(ctx);
    }
    setInterval(render, 1000/60);
});

var segundos = 0;
var minutos = 2;
var llamada;
var ceromin='';
var ceroseg='';

function cuentaAtras(){
    devolvercero(minutos,segundos);
    segundos = segundos % 60;
    document.getElementById("reloj").innerHTML=ceromin+minutos+':'+ceroseg+segundos;

    if (minutos == 0 && segundos == 0){
        alert ("PIIIIIP!!!");
        clearTimeOut(llamada);
    }

    if (segundos == 0){
        minutos --;
        segundos += 60;
    }
    segundos --;
    var llamada = setTimeout(cuentaAtras,1000);
}

function devolvercero(minutos,segundos){
    if (minutos < 10){
        ceromin='0';
    }

    if (segundos < 10){
        ceroseg = '0';
    }else {
        ceroseg = '';
    }
    return ceroseg;
}
