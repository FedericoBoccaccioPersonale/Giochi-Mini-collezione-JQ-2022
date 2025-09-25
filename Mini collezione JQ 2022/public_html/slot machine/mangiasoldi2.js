// In realtà ho iniziato questo prima del Pescatore, ma l' ho finito dopo
$(function()
{		
    var arraySimboli = [  '😣',  '😁',  '😴',  '🤩',  '🙄',  '🤗'];
    var numRuote=3;

    // Inizializzo la slot
    for (let i = 1; i <= numRuote; i++)$("#slot"+i).text(arraySimboli[numeriTentativi(0,arraySimboli.length-1)]);

    document.getElementById("button-slot").addEventListener("click", gioca);

    function gioca()
    {
	$("#button-slot").prop("disabled", true); // Disattivo il pulsante fino al prossimo tiro
	$("#risultato").html('Giocata in corso');

	// Quanti giri faccio fare a ogni ruota prima di fermarsi (ovvero quanti smile mostro in sequenza)
	for (let i = 1; i <= numRuote; i++)setData("#slot"+i,"tentativi",numeriTentativi(3,12));

	//setData("#slot1","cont",0);

	// setInterval esegue una funzione, che teoricamente può anche essere direttamente contenuta,
	// anche se la leggibilità ne risente, fino a che non viene chiamato clearInterval con parametro
	// il valore restituito da setInterval.
	// In JS pare non esista il passaggio per argomento, e dato che dichiare il ritorno con var fuori
	// dalla funzione non lo rende visibile alla funzione (strano), devo usare questo contorto metodo;
	// che comunque sostituisce il camel case con trattini!
	
	for (let i = 1; i <= numRuote; i++)
	{
	    setData("#slot"+i,"cont",0);
	    let identificatore=setInterval(FaiRuotareSimboli, 100,"#slot"+i);
	    setData("#slot"+i,"identificatoreSetInterval",identificatore);
	}
	
	// Attendo e basta - metodo un po' contorto ma equivalente a quello nel for
	setData("#slots","idAttesa",setInterval(AttendiTermineRotazioni, 100));

    }
    
    function AttendiTermineRotazioni()
    {
	let fermati=true;
	for (let i = 1; i <= numRuote; i++)
	{
	    let s=getData("#slot"+i,"cont","int"); // quanti giri ha già fatto la ruota
	    let max=getData("#slot"+i,"tentativi","int");
	    if(s<max)fermati=false; // Rimane vero fino a quando non ne trova una che deve girare ancora
	}
	
	if(fermati)
	{
	    let idBlocco=getData("#slots","idAttesa");
	   
	    clearInterval(idBlocco);
	    vittoria();
	}
    }

    function FaiRuotareSimboli(QualeRuota)
    {
	let t1=getData(QualeRuota,"cont","int"); // Contatore della ruota in questione: JS non contempla le variabili statiche

	numeroRandom = generaRandom(arraySimboli.length);
	$(QualeRuota).text(arraySimboli[numeroRandom]);
	console.log(QualeRuota+": "+arraySimboli[numeroRandom]);
	t1++;
	setData(QualeRuota,"cont",t1);

	
	let tentativi=getData(QualeRuota,"tentativi","int");
	console.log("t1: "+t1+" | tentativi: "+tentativi);

	if (t1 === tentativi)
	{
	    //alert(parseInt(document.querySelector(QualeRuota).getAttribute("data-identificatore-set-interval")));
	    //clearInterval(parseInt(document.querySelector(QualeRuota).getAttribute("data-identificatore-set-interval")));
	    clearInterval(getData(QualeRuota,"identificatoreSetInterval","int"));
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
	
	
	let slot1 = $("#slot1").innerHTML;
	let uguali=true;
	for (let i = 2; i <= numRuote; i++)
	{
	    let slot_ = $("#slot"+i).html();
	    uguali=uguali && slot_==slot1;
	}
	
	//console.log(document.getElementById("slot1").innerHTML);
	if (uguali)$("#risultato").html('HAI VINTO');
	else  $("#risultato").html('HAI PERSO');

	//document.getElementById("button-slot").disabled = false;
	$("#button-slot").prop("disabled", false);
    }
    
    // Davvero non capisco perchè farla tanto lunga!
    // Passare in oggetto l' ID comprensivo di #
    // tipo accetta int per gli interi, altri tipi non sono ancora definiti
    // Questa funzione agisce diversamente: non sostituisce il camelcase coi trattini ma si limita a tolower
    // Anche se sembra funzionare sia con che senza trattino (forse)
    function getData(oggetto,proprietà,tipo="string")
    {
	let ris=document.querySelector(oggetto).getAttribute("data-"+proprietà);
	
	switch(tipo)
	{
	    case "int": return parseInt(ris);
	    default: return ris;
	}
    }
    function setData(oggetto,proprietà,valore)
    {
	document.querySelector(oggetto).setAttribute("data-"+proprietà, valore);
    }
});