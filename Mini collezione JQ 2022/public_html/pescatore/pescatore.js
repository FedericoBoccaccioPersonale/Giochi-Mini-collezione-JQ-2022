// Vedere: https://it.javascript.info/js-animation

$(function()
{
    AggiungiPesce(); // Uno iniziale
    var cursore="";
    var prob=0.005; // Sarebbe certo stato meglio fatto a tempo casuale, ma qui non è Unity, vediamo futura versione
    
    
    let timer = setInterval(function()
    {
	disegnaOnda("#onde1");
	disegnaOnda("#onde2");
	if(Math.random()<prob)AggiungiPesce();
	AnimaPesci();
	if(Math.random()<prob)AggiungiSigaretta();
	AnimaSigaretta();
	prob+=0.000001; // Rimane comunque la probabilità che per un po' non esca niente
    }, 20); // Chiamerà queste funzioni ogni 20ms

    function disegnaOnda(quale)
    {
	let onda=$(quale);
	let posizione=parseInt(onda.css("left"));
	let direzione=parseInt(getData(quale,"dir"));
	
	
	
	//console.log(posizione,direzione);
	
	// Visto che non c' è modo per farlo in maniera intelligente in JS
	
	if(direzione<0)
	{
	    if (posizione>-100)
	    {
		posizione+=direzione;
		onda.css("left",posizione+"px");
	    }
	    else setData(quale,"dir",1); // Inverto
	}
	else
	{
	    if (posizione<0)
	    {
		posizione+=direzione;
		onda.css("left",posizione+"px");
	    }
	    else setData(quale,"dir",-1); // Inverto
	}
	
	
    }
    
    // Davvero non capisco perchè farla tanto lunga!
    function getData(oggetto,proprietà)
    {
	return (document.querySelector(oggetto).getAttribute("data-"+proprietà));
    }
    function setData(oggetto,proprietà,valore)
    {
	document.querySelector(oggetto).setAttribute("data-"+proprietà, valore);
    }
    
   
   function AggiungiPesce()
   {
	const boxWrapper = document.getElementById("canvas"); // Non si può fare in JQuery!!!!

	const box = document.createElement("img");
	box.src = 'pesce.png';
	//box.style.backgroundColor = "orange";
	box.classList.add("pesce");
	box.id="P"+OraAttuale();

	boxWrapper.appendChild(box);
	
	setData("#"+box.id,"altezza",Math.random()*100+350);
	setData("#"+box.id,"direzione","su");
	$("#"+box.id).css("left",Math.random()*300+50);
	
	$("#"+box.id).click(function()
	{
	    /*
	     * La funzione di assegnazione non funziona su tutti gli oggetti della classe ma su tutti gli oggetti che danno quella classe,
	     * o altro selettore solo quando viene chiamata. Non c' è modo per assegnarlo alla classe quale che sia il momento che viene creata.
	     * Va aggiunto manualmente per ogni istanziazione. Per questo devo usare l' ID, altrimenti i pesci più vecchi avrebbero aggiunto
	     * un evento per ogni nuovo pesce.
	     */
	    //alert(cursore);
	    let _id="#"+$(this).attr('id');
	    let direzione=getData(_id,"direzione");
	    if(direzione=="su" && cursore=="c" || direzione=="giù" && cursore=="r")
	    {
		let p=parseInt($("#punti").text());
		$("#punti").text(p+1);
		$(_id).remove();
	    }
	});
   }
   
   function AggiungiSigaretta()
   {
       const boxWrapper = document.getElementById("canvas"); // Non si può fare in JQuery!!!!

	const box = document.createElement("img");
	box.src = 'sigaretta.png';
	box.classList.add("sigaretta");
	box.id=""+OraAttuale();

	boxWrapper.appendChild(box);
	
	$("#"+box.id).css("left",Math.random()*300+50);
	
	$("#"+box.id).click(function()
	{
	    let _id="#"+$(this).attr('id');
	    if(cursore=="i")
	    {
		$(_id).remove();
	    }
	});
   }
   
    // Preso da https://www.w3docs.com/snippets/javascript/how-to-get-the-current-date-and-time-in-javascript.html
    // C' è anche la data
    function OraAttuale()
    {
	let currentDate = new Date();
	return currentDate.getHours() + "_" + currentDate.getMinutes() + "_" + currentDate.getSeconds() + "_" + currentDate.getMilliseconds();
    }
    
    function AnimaPesci()
    {
	
	
	$(".pesce").each(function(index)
	{
	    let _id="#"+$(this).attr('id');
	    console.log( index + ": " + _id);
	    let posizione=parseInt($(_id).css("bottom"));
	    let direzione=(getData(_id,"direzione"));
	    let maxH=parseInt(getData(_id,"altezza"));
	    
	    if(direzione=="su")
	    {
		$(_id).css("bottom",posizione+3);
		if(posizione>maxH)
		{
		    // Capovolgo
		    setData(_id,"direzione","giù");
		    $(_id).css("rotate","-90deg");
		}
	    }
	    else
	    {
		$(_id).css("bottom",posizione-3);
		if(posizione<0)
		{
		    // Distruggo
		    $(_id).remove();
		}
	    }    
	});
    }
    
    function AnimaSigaretta()
    {
	$(".sigaretta").each(function(index)
	{
	    let _id="#"+$(this).attr('id');
	    console.log( index + ": " + _id);
	    let posizione=parseInt($(_id).css("top"));
	    
	    
	    $(_id).css("top",posizione+4);
	    if(posizione>500)
	    {
		// Fine partita
		clearInterval(timer);
		$("#fine").show();
	    }
	    
	});
    }


    

    $("#canna").click(function()
    {
	// Devo usare due immagini già della dimensione giusta perchè CSS e JS non sono capaci di ridimensionarla!
	// Credo che i due numeri dopo il nome del file indichino di quanto spostare l' area attiva del cursore.
	// Tuttavia la sua dimensione rimane costante.
	$('body').css('cursor' , 'url(canna2.png) 32 20,auto');
	
	// Anche se sarebbe più comodo (forse) ottenere ogni volta l' icona del cursore, sembra non essere fattibile.
	cursore="c";
    });
    $("#retino").click(function()
    {
	// Devo usare due immagini già della dimensione giusta perchè CSS e JS non sono capaci di ridimensionarla!
	$('body').css('cursor' , 'url(retino2.png) 30 32,auto');
	
	cursore="r";
    });
    $("#carro").click(function()
    {
	// Devo usare due immagini già della dimensione giusta perchè CSS e JS non sono capaci di ridimensionarla!
	$('body').css('cursor' , 'url(ikarus2.png) 32 17,auto');
	
	cursore="i"; // Il carro armato si chiama Ikarus
    });
    
    


});