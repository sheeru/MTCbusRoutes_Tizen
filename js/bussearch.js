var BusRouteMap = new Object();
var content="Please take any of the buses below to reach the destination<br/>";
var contentDirSearch = "";
var StationList_Unique_To = new Array();
var StationList_Unique = new Array();
var searchCount= 0;

function GetUnique(inputArray)
{
	var outputArray = ["Dummy"];

	for (var i = 0; i < inputArray.length; i++)
	{

		if ((jQuery.inArray(inputArray[i], outputArray)) == -1)
		{
			outputArray.push(inputArray[i]);
		}
	}

	return outputArray;
}

function populateStationList()
{
	var StationList = new Array();


	for(var key in BusRouteMap){
		var BusStops = BusRouteMap[key].split(",");
		for(var i=0;i<BusStops.length;i++){
			StationList.push(BusStops[i]);
		}
	}
	StationList_Unique = GetUnique(StationList);
}

$(document).load('chennai_bus_routes.txt', function(response){
	var BusDetails_Line = response.split('\n');
	for(i=0;i < BusDetails_Line.length; i++){
		var key = BusDetails_Line[i].split(":")[0].split("- ")[1];
		var value = BusDetails_Line[i].split(": ")[1];
		BusRouteMap[key] = value;
	}
	populateStationList();
});

function addNewRow_Indirect(FirstDest,FinalDest,jshandle) {

	var table = document.getElementById(jshandle);

	var rDiv = document.createElement('div'); 
	table.appendChild(rDiv);
	rDiv.setAttribute('class', 'row');

	var c1Div = document.createElement('div');
	rDiv.appendChild(c1Div);
	c1Div.setAttribute('class', 'column');
	c1Div.innerHTML = FirstDest;

	var c2Div = document.createElement('div');
	rDiv.appendChild(c2Div);
	c2Div.setAttribute('class', 'column');
	c2Div.innerHTML = FinalDest;

}

function addNewRow_Direct(to,BusNos,jshandle) {

	var table = document.getElementById(jshandle);

	var rDiv = document.createElement('div'); 
	table.appendChild(rDiv);
	rDiv.setAttribute('class', 'row');

	var c1Div = document.createElement('div');
	rDiv.appendChild(c1Div);
	c1Div.setAttribute('class', 'column');
	c1Div.innerHTML = to;

	var c2Div = document.createElement('div');
	rDiv.appendChild(c2Div);
	c2Div.setAttribute('class', 'column');
	c2Div.innerHTML = BusNos;

}

function DirectSearchTableHeader(from,to,jshandle)
{
	var elem = document.getElementById('content');

	var table = document.createElement('div'); 
	elem.appendChild(table);
	table.setAttribute('class', 'table');
	table.setAttribute('id', jshandle);
	table.innerHTML = searchCount+") SearchResult from : "+from+ " to "+to;
	table.onclick=function(){ 
		$(this).children(':first').toggle(1500);
	}

	var content = document.createElement('div');
	table.appendChild(content);
	content.setAttribute('id', 'content'+searchCount);


	var row1 = document.createElement('div');
	content.appendChild(row1);
	row1.setAttribute('class', 'row');
	row1.innerHTML = "Below are buses from " + from;

	var rDiv = document.createElement('div');
	content.appendChild(rDiv);
	rDiv.setAttribute('class', 'row');

	var c1Div = document.createElement('div');
	rDiv.appendChild(c1Div);
	c1Div.setAttribute('class', 'column');
	c1Div.setAttribute('style', 'font-style:italic');
	c1Div.style.fontWeight = 'bold';
	c1Div.innerHTML = "To";

	var c2Div = document.createElement('div');
	rDiv.appendChild(c2Div);
	c2Div.setAttribute('class', 'column');
	c2Div.setAttribute('style', 'font-style:italic');
	c2Div.style.fontWeight = 'bold';
	c2Div.innerHTML = "Bus Numbers";


}

function InDirectSearchTableHeader(from,to,jshandle)
{
	var elem = document.getElementById('content');

	var table = document.createElement('div'); 
	elem.appendChild(table);
	table.setAttribute('class', 'table');
	table.setAttribute('id', jshandle);
	table.innerHTML = searchCount+") SearchResult from : "+from+ " to "+to;
	table.onclick=function(){ 
		$(this).children(':first').toggle(1500);
	}

	var content = document.createElement('div');
	table.appendChild(content);
	content.setAttribute('id', 'content'+searchCount);

	var row1 = document.createElement('div');
	content.appendChild(row1);
	row1.setAttribute('class', 'row');
	row1.innerHTML = "Route map from " + from +" " + " to " + to;

	var rDiv = document.createElement('div');
	content.appendChild(rDiv);
	rDiv.setAttribute('class', 'row');

	var c1Div = document.createElement('div');
	rDiv.appendChild(c1Div);
	c1Div.setAttribute('class', 'column');
	c1Div.setAttribute('style', 'font-style:italic');
	c1Div.style.fontWeight = 'bold';
	c1Div.innerHTML = from + " to 1st Dest - BusNo. ";

	var c2Div = document.createElement('div');
	rDiv.appendChild(c2Div);
	c2Div.setAttribute('class', 'column');
	c2Div.setAttribute('style', 'font-style:italic');
	c2Div.style.fontWeight = 'bold';
	c2Div.innerHTML = "FinalDest from 1stDestination";


}

function IndirectRouteSearch(from,to,jshandle)
{
	for(var key in BusRouteMap){
		var FwdTravel = 0;
		var BwdTravel = 0;
		var BusStops = BusRouteMap[key].split(",");
		for(i=0;i<BusStops.length;i++){
			if(BusStops[i].toLowerCase().match(from.toLowerCase())){
				FwdCounter = i+1;
				BwdCounter = i-1;
				while(FwdTravel == 0 || BwdTravel == 0){

					if(FwdCounter < BusStops.length && FwdTravel==0){
						var status = DirectRouteSearch(BusStops[FwdCounter], to);
						FwdCounter++;
						if(status == 0){
							FwdTravel = 1;
							BwdTravel = 1;
							var FirstDest = BusStops[FwdCounter] + " " +key;
							var FinalDest = contentDirSearch;
							addNewRow_Indirect(FirstDest, FinalDest,jshandle);
						}
					}
					else{
						FwdTravel = 1;
					}

					if(BwdCounter > 0 && BwdTravel==0){
						var status = DirectRouteSearch(BusStops[BwdCounter], to);
						BwdCounter--;
						if(status == 0){
							BwdTravel = 1;
							FwdTravel = 1;
							var FirstDest = BusStops[BwdCounter] + " " + key;
							var FinalDest = contentDirSearch;
							addNewRow_Indirect	(FirstDest, FinalDest,jshandle);
						}
					}
					else{
						BwdTravel = 1;
					}

				}
			}	
		}
	}
}

function DirectRouteSearch(from,to)
{
	var status = -1;
	contentDirSearch = "";
	for(var key in BusRouteMap){
		var BusStops = BusRouteMap[key].split(",");
		var frompresent = 0;
		var topresent = 0;
		for(var i=0;i<BusStops.length;i++){
			if(BusStops[i].toLowerCase().match(from.toLowerCase())){
				frompresent = 1;
				break;
			}	
		}

		if(frompresent){
			for(i=0;i<BusStops.length;i++){
				if(BusStops[i].toLowerCase().match(to.toLowerCase())){
					topresent = 1;
					break;
				}	
			}
		}

		if(frompresent && topresent){
			status = 0;
			contentDirSearch += key+" ";
		}
	}
	return status;
}

function ToPopulate()
{
	if(StationList_Unique_To.length != 0){
		$('#to').autocomplete({
			lookup: StationList_Unique_To,
		});	
	}
	else{
		$('#to').autocomplete({
			lookup: StationList_Unique,
		});	
	}
}

function FromPopulate()
{
	$('#from').autocomplete({
		lookup: StationList_Unique,
		onSelect: function (suggestion) {
			StationList_Unique_To = StationList_Unique;
			//var index = StationList_Unique_To.indexOf(suggestion.value);
			//StationList_Unique_To.splice(index, 1);
		}
	});		
}


function loading_starts()
{
    var over = '<div id="overlay">' +
    '<img id="loading" src="images/loading.gif">' +
    '</div>';
    $(over).appendTo('body');	
}

function loading_ends()
{
	$("#overlay").remove();
}

function Search()
{
	var content="Please take any of the buses below to reach the destination<br/>";
	contentDirSearch="";

	var from = document.getElementById("from").value;
	var to = document.getElementById("to").value;

	var status = -1;
	
	if(DirectRouteSearch(from,to) != 0){
		searchCount++;
		var hidecontent=searchCount - 1;
		$("#content"+hidecontent).hide(5500);
		loading_starts();
		setTimeout(function(){
			InDirectSearchTableHeader(from,to,"jshandle"+searchCount);
			IndirectRouteSearch(from,to,"content"+searchCount);
			loading_ends();
		},100);


	}
	else{
		searchCount++;
		status = 0;
		var hidecontent=searchCount - 1;
		$("#content"+hidecontent).hide(1500);
		DirectSearchTableHeader(from,to,"jshandle"+searchCount);
		addNewRow_Direct(to,contentDirSearch,"content"+searchCount);
	}
}

function ClearAll()
{
	for(var i=1; i<=searchCount; i++){
		var content = document.getElementById('content');
		var jshandles = document.getElementById('jshandle'+i);
		content.removeChild(jshandles);
	}
	searchCount = 0;
}



