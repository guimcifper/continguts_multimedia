function calcula(opera){
	
		
		switch (opera){
		
	
		case 1:
		
		document.getElementById("resultado").innerHTML=parseFloat(document.getElementById("num1").value)+parseFloat(document.getElementById("num2").value);
		break;

		case 2:
		
		document.getElementById("resultado").innerHTML=parseFloat(document.getElementById("num1").value)-parseFloat(document.getElementById("num2").value);
		break;
		case 3:
		
		document.getElementById("resultado").innerHTML=parseFloat(document.getElementById("num1").value)*parseFloat(document.getElementById("num2").value);
		break;
		case 4:
		
		document.getElementById("resultado").innerHTML=parseFloat(document.getElementById("num1").value)/parseFloat(document.getElementById("num2").value);
		break;
		}		
		
	}