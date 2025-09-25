/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var hdc;
 // shorthand func
 function byId(e){return document.getElementById(e);}
 // takes a string that contains coords eg - "227,307,261,309, 339,354, 328,371, 240,331"
 // draws a line from each co-ord pair to the next - assumes starting point needs to be repeated as ending point.
 function drawPoly(coOrdStr)
 {
     var mCoords = coOrdStr.split(',');
     var i, n;
     n = mCoords.length;
     hdc.beginPath();
     hdc.moveTo(mCoords[0], mCoords[1]);
     for (i=2; i<n; i+=2)
     {
         hdc.lineTo(mCoords[i], mCoords[i+1]);
     }
     hdc.lineTo(mCoords[0], mCoords[1]);
     hdc.stroke();
 }
 function drawRect(coOrdStr)
 {
     var mCoords = coOrdStr.split(',');
     var top, left, bot, right;
     left = mCoords[0];
     top = mCoords[1];
     right = mCoords[2];
     bot = mCoords[3];
     hdc.strokeRect(left,top,right-left,bot-top); 
 }
  function drawCerchio(coOrdStr)
 {
	var mCoords = coOrdStr.split(',');
	var XXX, YYY, Raggio;
	XXX = mCoords[0];
	YYY = mCoords[1];
	Raggio = mCoords[2];
	hdc.beginPath();
	hdc.arc(XXX, YYY, Raggio, 0, 2 * Math.PI); // X, Y, r, inizio e fine in radianti
	hdc.stroke();
 }
   function drawCerchioCheTantoNonFunziona(coOrdStr)
 {
	var mCoords = coOrdStr.split(',');
	var XXX, YYY, Raggio;
	XXX = mCoords[0];
	YYY = mCoords[1];
	Raggio = mCoords[2];
	
	const gradient = ctx.createRadialGradient(10,10,3, 10,10,7);

	// Add three color stops
	gradient.addColorStop(0, '#0F9');
	gradient.addColorStop(0.9, 'green');
	gradient.addColorStop(0.95, 'white'); // L' ultimo raggiunge il quadrato esterno

	// Set the fill style and draw a rectangle
	hdc.fillStyle = gradient;
	hdc.fillRect(20, 20, 80, 80);
	
	
	//hdc.beginPath();
	//hdc.arc(XXX, YYY, Raggio, 0, 2 * Math.PI); // X, Y, r, inizio e fine in radianti
	//hdc.stroke();
 }
 function myHover(element)
 {
     var hoveredElement = element;
     var coordStr = element.getAttribute('coords');
     var areaType = element.getAttribute('shape');
     switch (areaType)
     {
	case 'polygon':
	case 'poly':
             drawPoly(coordStr);
             break;
	case 'rect':
             drawRect(coordStr);
	     break;
	case 'circle':
	    drawCerchio(coordStr);
	    break;
     }
 }
 function myLeave(canv)
 {
     var canvas = byId(canv);
     hdc.clearRect(0, 0, canvas.width, canvas.height);
 }