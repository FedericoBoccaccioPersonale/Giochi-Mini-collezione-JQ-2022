// In realtà ho iniziato questo prima del Pescatore, ma l' ho finito dopo
$(function()
{		
    var arraySimboli = [  '😣',  '😁',  '😴',  '🤩',  '🙄',  '🤗'];

    // Inizializzo la slot
    $("#slot1").text(arraySimboli[0]);
    $("#slot2").text(arraySimboli[1]);
    $("#slot3").text(arraySimboli[2]);

    document.getElementById("button-slot").addEventListener("click", gioca);

    function gioca()
    {
	document.getElementById("button-slot").disabled = true; // Disattivo il pulsante fino al prossimo tiro
	document.getElementById("risultato").innerHTML = 'Giocata in corso';

	document.querySelector(".slots").dataset.tentativi = numeriTentativi(3,12); // Quanti giri faccio fare a ogni ruota prima di fermarsi (ovvero quanti smile mostro in sequenza) | Sulla complicata assegnazione, vedi sotto
	
	document.querySelector("#slot1").dataset.cont=0; // Vedi sempre sotto

	// setInterval esegue una funzione, che teoricamente può anche essere direttamente contenuta,
	// anche se la leggibilità ne risente, fino a che non viene chiamato clearInterval con parametro
	// il valore restituito da setInterval.
	// In JS pare non esista il passaggio per argomento, e dato che dichiare il ritorno con var fuori
	// dalla funzione non lo rende visibile alla funzione (strano), devo usare questo contorto metodo;
	// che comunque sostituisce il camel case con trattini!
	// "document.querySelector" per ragioni ignote non è richiamabile tramite il dollaro
	document.querySelector("#slot1").dataset.cont=0;
	document.querySelector("#slot1").dataset.identificatoreSetInterval = setInterval(FaiRuotareSimboli, 100,"#slot1");

	document.querySelector("#slot2").dataset.cont=0;
	document.querySelector("#slot2").dataset.identificatoreSetInterval = setInterval(FaiRuotareSimboli, 100,"#slot2");

	document.querySelector("#slot3").dataset.cont=0;
	document.querySelector("#slot3").dataset.identificatoreSetInterval = setInterval(FaiRuotareSimboli, 100,"#slot3");


	// Il codice di esempio è profondamente sbagliato: essendo eseguiti in parallelo, nulla assicura che al termine dell' ultima ruota le altre siano ferme
	// Anche se ufficialmente JS non è multi thread, il risultato è questo!

	//setTimeout(vittoria(),1300); // Questa istruzione, sebbene dovrebbe eseguire la funzione quando ormai le ruote sono ferme, in realtà non fa affatto quello che dice in quanto esegue immediatamente!

	// Attendo e basta
	document.querySelector(".slots").dataset.idAttesa = setInterval(AttendiTermineRotazioni, 100);

    }
    
    function AttendiTermineRotazioni()
    {
	let s1=parseInt(document.querySelector("#slot1").getAttribute("data-cont"));
	let s2=parseInt(document.querySelector("#slot2").getAttribute("data-cont"));
	let s3=parseInt(document.querySelector("#slot3").getAttribute("data-cont"));
	let max=parseInt(document.querySelector(".slots").getAttribute("data-tentativi"));
	let idBlocco=parseInt(document.querySelector(".slots").getAttribute("data-id-attesa"));
	console.log("s1: "+s1+" s2: "+s2+" s3: "+s3+" max: "+max);
	let id1=parseInt(document.querySelector("#slot1").getAttribute("data-identificatore-set-interval"));
	let id2=parseInt(document.querySelector("#slot2").getAttribute("data-identificatore-set-interval"));
	let id3=parseInt(document.querySelector("#slot3").getAttribute("data-identificatore-set-interval"));

	if(s1==max && s2==max && s3==max)
	{
	    clearInterval(id1); // Credo che questi 3 siano ridondanti: si ferma già in FaiRuotareSimboli
	    clearInterval(id2);
	    clearInterval(id3);
	    clearInterval(idBlocco);
	    vittoria();
	}
    }

    function FaiRuotareSimboli(QualeRuota)
    {
	let t1 = parseInt(document.querySelector(QualeRuota).getAttribute("data-cont")); // Contatore della ruota in questione: JS non contempla le variabili statiche

	numeroRandom = generaRandom(arraySimboli.length);
	$(QualeRuota).text(arraySimboli[numeroRandom]);
	console.log(QualeRuota+": "+arraySimboli[numeroRandom]);
	t1++;
	document.querySelector(QualeRuota).dataset.cont=t1;

	// E anche qui pretende la sintassi estesa.
	//alert(document.querySelector(QualeRuota).getAttribute("data-tentativi"));

	let tentativi=parseInt(document.querySelector(".slots").getAttribute("data-tentativi"));
	console.log("t1: "+t1+" | tentativi: "+tentativi);

	if (t1 === tentativi)
	{
	    //alert(parseInt(document.querySelector(QualeRuota).getAttribute("data-identificatore-set-interval")));
	    clearInterval(parseInt(document.querySelector(QualeRuota).getAttribute("data-identificatore-set-interval")));
	    return null;
	}
    }


    // In definitiva è CASUALE.TRA
    function numeriTentativi(min, max)
    {
	return Math.floor((Math.random() * (max-min + 1)) + min);
    }
    // Genera numero casuale intero
    function generaRandom(max)
    {
	return Math.floor((Math.random() *  max));
    }

    function vittoria()
    {
	var slot1 = document.getElementById("slot1").innerHTML;
	var slot2 = document.getElementById("slot2").innerHTML;
	var slot3 = document.getElementById("slot3").innerHTML;
	console.log(document.getElementById("slot1").innerHTML);
	if (slot1 == slot2 && slot2 == slot3)document.getElementById("risultato").innerHTML = 'HAI VINTO';
	else  document.getElementById("risultato").innerHTML = 'HAI PERSO';

	document.getElementById("button-slot").disabled = false;
    }
});