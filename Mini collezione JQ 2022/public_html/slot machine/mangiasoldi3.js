// In realtà ho iniziato questo prima del Pescatore, ma l' ho finito dopo
$(function()
{		
    var dizionarioCompleto = ['😣','😁','😴','🤩','🙄','🤗','😀','😺','💥','🐏','🐫','🐘','🦔','🦇','🐾','🦉','🐸','🐉','🐛','🐝','🌻','🌷',
    '🌴','🍂','🍄','🌍','🌙','🌟','⛈','🌦','🌩','⚡','✨','🍇','🍎','🍒','🍓','🥐','🥩','☕','🎂','🍰','🍦','🎼','🏹','🎓','💍','🎈','💣','💸',
    '💰','🎁','👑','💎','🕹','✂','💖','👋','👍','🖖','👁️‍🗨️','🎨','🎮','🎰','🚀','🛸','🛰','✔'];
    var numRuote=3;
    //alert(arraySimboli);
    var dimDizionario=20;
    $("#QuantiSimboli").prop("max", dizionarioCompleto.length);
    const arraySimboli=[4]; // Inizializzazione qualsiasi
    ScegliSimboli();
    
    

    // Inizializzo la slot
    function InizializzaSlot()
    {
	for (let i = 1; i <= numRuote; i++)$("#slot"+i).text(arraySimboli[numeriTentativi(0,arraySimboli.length-1)]);
    }
    InizializzaSlot(); // Lo chiamo già subito
    
    function ScegliSimboli()
    {
	// Scelgo dei simboli a caso
	let Vet=shuffle(dizionarioCompleto);
	dimDizionario=$("#QuantiSimboli").val();
	let Sub=Vet.slice(0,dimDizionario); // Dato che non si può essegnare direttamente qui
	// Ed ecco un altro errore di progettazione JS!!! Non è possibile riassegnare un vettore, ma solo modificarlo!
	console.log(arraySimboli);
	arraySimboli.length=0;
	for(let i=0;i<Sub.length;++i)arraySimboli.push(Sub[i]);
	console.log(arraySimboli);
	
	ResettaPunteggio();
    }
    function shuffle(array)
    {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0!==currentIndex)
	{
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random()*currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	}

	return array;
    }
    
    // Tuttavia devo anche fare in modo che venga riassegnato ad ogni modifica della dimensione - non posso farlo da HTML, probabilmente perchè questa funzione esiste solo dopo aver finito la pagina
    document.getElementById("QuantiSimboli").addEventListener("change", ScegliSimboli);
    
    
    function CambiaNumeroRuote()
    {
	numRuote=$("#QuanteRuote").val();
	let str='';
	for(let i=1;i<=numRuote;++i)str=str+'<div id="slot'+i+'" class="icons"></div>';
	$("#slots").html(str);
	InizializzaSlot();
	// Devo espandere il CSS della #slot-machine width a 150*numRuote+50:
	// 150 è lo spazio assegnato ad ogni ruota, comprensivo dell' offset tra una e l' altra,
	// +50 sono gli offset aggiuntivi del bordo (costanti) e lo spazio tra la prima ruota e il bordo
	 $("#slot-machine").css("width", 150*numRuote+50);
	 
	 // Se sono più di 10 non ci sta nelle colonne di bootstrap, lo metto fuori e basta!
	 
	ResettaPunteggio();
    }
    document.getElementById("QuanteRuote").addEventListener("change", CambiaNumeroRuote);
    
    document.getElementById("TipoSlot").addEventListener("change", CambiaDescrizioneTipoRuota);
    function CambiaDescrizioneTipoRuota()
    {
	// Qui devo anche resettare il putneggio, perchè è un tipo diverso di slot - l' altra select è ininfluente
	ResettaPunteggio();
	
	switch(parseInt($("#TipoSlot").val()))
	{
	    case 1:
		$("#spiegazione").html("Le ruote girano a caso e si fermano.");
		break;
	    case 2:
		$("#spiegazione").html("La macchina decide in anticipo se farti vincere e quando si ferma mostra una quasi vittoria, illudendoti che con un po' di fortuna in più avresti potuto vincere, invogliandoti a giocare ancora. Ovviamente Questa modalità e la successiva hanno poco senso se i simboli si fermano in ordine casuale.");
		// E non ho voglia di andare ad impostare di mettere il simbolo diverso sull' ultima che si ferma, e avrebbe anche poco senso.
		break;
	    case 3:
		$("#spiegazione").html("Non solo la macchina decide in anticipo, ma la probabilità di vittoria è ancora più scarsa.");
		break;
	}
    }
    
    function ResettaPunteggio()
    {
	setData("#punteggio","vinte",0);
	setData("#punteggio","totali",0);
    }
    

    document.getElementById("button-slot").addEventListener("click", gioca);

    function gioca()
    {
	$("#button-slot").prop("disabled", true); // Disattivo il pulsante fino al prossimo tiro
	$("#risultato").html('Giocata in corso');

	// Quanti giri faccio fare a ogni ruota prima di fermarsi (ovvero quanti smile mostro in sequenza)
	let prima=numeriTentativi(3,12);
	for (let i = 1; i <= numRuote; i++)
	{
	    switch(parseInt($("#OrdineTerminazione").val()))
	    {
		case 1:
		    setData("#slot"+i,"tentativi",numeriTentativi(3,12));
		    break;
		case 2:
		    setData("#slot"+i,"tentativi",prima+i*5);
		    break;
		case 3:
		    setData("#slot"+i,"tentativi",prima);
		    break;
	    }
	    
	}
	
	// In caso di slot digitale o virtuale devo decidere prima
	let TipoRuota=parseInt($("#TipoSlot").val());
	let probVittoria= Math.pow(arraySimboli.length, numRuote);
	setData("#punteggio","prob",probVittoria); // A ben pensarci non è necessario ricalcolarlo ogni volta.
	if(TipoRuota==3)probVittoria=probVittoria*probVittoria; // Riduco ulteriormente
	let DecidiVittoria=generaRandom(probVittoria);
	if(TipoRuota>1)
	{
	    if(DecidiVittoria!=1)
	    {
		// Probabilità 1 su N di vincere... nel caso di digitale è una sulle possibili combinazioni, nel caso di virtuale è uncora di meno (al quadrato)
		// Devo assegnare solo per digitale e virtuale, e mettere a vuoto nel caso di meccanica
		let QualeSimboloMostrare=generaRandom(arraySimboli.length);
		for (let i = 1; i < numRuote; i++)setData("#slot"+i,"MostraSimbolo",arraySimboli[QualeSimboloMostrare]);
		setData("#slot"+numRuote,"MostraSimbolo",arraySimboli[(QualeSimboloMostrare+1) % arraySimboli.length]);
	    }
	    else
	    {
		// Non posso testare questo ramo
		let QualeSimboloMostrare=generaRandom(arraySimboli.length);
		for (let i = 1; i <= numRuote; i++)setData("#slot"+i,"MostraSimbolo",arraySimboli[QualeSimboloMostrare]);
	    }
	}
	else
	{
	    for (let i = 1; i <= numRuote; i++)setData("#slot"+i,"MostraSimbolo",null); // Annullo tutti i simboli
	}
	
	
	
	
	

	//setData("#slot1","cont",0);

	// setInterval esegue una funzione, che teoricamente può anche essere direttamente contenuta,
	// anche se la leggibilità ne risente, fino a che non vhiene chiamato clearInterval con parametro
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
	    /*for (let i = 1; i <= numRuote; i++)
	    {
		let id_=getData("#slot"+i,"identificatoreSetInterval","int");
		clearInterval(id_);
	    }*/
	    clearInterval(idBlocco);
	    vittoria();
	}
    }

    function FaiRuotareSimboli(QualeRuota)
    {
	// Anche se qui i simboli vengono comunque mostrati in ordine casuale e non nella stessa sequenza come sulle ruote delle slot machine reali.
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
	    
	    // In caso di ruota truccata (il miglio modo per definirla) metto il simbolo impostato
	    let simbolo=getData(QualeRuota,"MostraSimbolo");
	    if(simbolo!="null")$(QualeRuota).text(simbolo);
	    
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
	let slot1 = $("#slot1").html();
	let uguali=true;
	for (let i = 2; i <= numRuote; i++)
	{
	    let slot_ = $("#slot"+i).html();
	    uguali=uguali && slot_==slot1;
	}
	
	//console.log(document.getElementById("slot1").innerHTML);
	if (uguali){$("#risultato").html('HAI VINTO');setData("#punteggio","vinte",getData("#punteggio","vinte","int")+1)}
	else  $("#risultato").html('HAI PERSO');
	setData("#punteggio","totali",getData("#punteggio","totali","int")+1)

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
    
    $("#ElencaSmile").click(function ()
    {
	// Modifica fa funzione usando la variabile dizionarioCompleto per averli tutti nell' ordine iniziale.
	$("#elenco").text(arraySimboli.join());
    });
});