var BusRouteMap = new Object();
var content="Please take any of the buses below to reach the destination<br/>";
var contentDirSearch = "";
var StationList_Unique_To = new Array();
var StationList_Unique = new Array();

$(document).load('chennai_bus_routes.txt', function(response){
	var BusDetails_Line = response.split('\n');
	for(i=0;i < BusDetails_Line.length; i++){
		var key = BusDetails_Line[i].split(":")[0].split("- ")[1];
		var value = BusDetails_Line[i].split(": ")[1];
		BusRouteMap[key] = value;
	}
	populateStationList();
});

function ToPopulate()
{
	$('#to').autocomplete({
		lookup: StationList_Unique_To,
	});	

}

function FromPopulate()
{
	$('#from').autocomplete({
		lookup: StationList_Unique,
		onSelect: function (suggestion) {
			StationList_Unique_To = GetUnique(StationList_Unique);
			var index = StationList_Unique_To.indexOf(suggestion.value);
			alert(index);
			StationList_Unique_To.splice(index, 1);
		}
	});		
}

function Search()
{
//	document.getElementById("RouteDisplay").innerHTML = "";
//	var content="Please take any of the buses below to reach the destination<br/>";
	contentDirSearch="";
	content="";
	var from = document.getElementById("from").value;
	var to = document.getElementById("to").value;

	if(DirectRouteSearch(from,to) != 0)
		status = IndirectRouteSearch(from,to);
	document.getElementById("RouteDisplay").innerHTML += contentDirSearch;
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





	//$("#from").autocompleteArray(StationList_Unique);
	//alert(StationList_Unique);
}

function GetUnique(inputArray)
{
	var outputArray = [];

	for (var i = 0; i < inputArray.length; i++)
	{
		if ((jQuery.inArray(inputArray[i], outputArray)) == -1)
		{
			outputArray.push(inputArray[i]);
		}
	}

	return outputArray;
}

function DirectRouteSearch(from,to)
{
	var status = -1;
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

function IndirectRouteSearch(from,to)
{
	var FwdTravel = 0;
	var BwdTravel = 0;
	for(var key in BusRouteMap){
		var BusStops = BusRouteMap[key].split(",");
		for(i=0;i<BusStops.length;i++){
			if(BusStops[i].toLowerCase().match(from.toLowerCase())){
				FwdCounter = i+1;
				BwdCounter = i-1;
				while(FwdTravel == 0 || BwdTravel == 0){

					if(FwdCounter < BusStops.length){
						var status = DirectRouteSearch(BusStops[FwdCounter], to);
						FwdCounter++;
						if(status == 0){
							FwdTravel = 1;
							BwdTravel = 1;
							content = "Please take the Bus "+key+" for reaching "+BusStops[FwdCounter]+" from "+from+" and take any of the buses to reach the destination <br/>";
							document.getElementById("RouteDisplay").innerHTML = content;
						}
					}
					else{
						FwdTravel = 1;
					}

					if(BwdCounter != 0){
						var status = DirectRouteSearch(BusStops[BwdCounter], to);
						BwdCounter--;
						if(status == 0){
							BwdTravel = 1;
							FwdTravel = 1;
							content = "Please take the Bus "+key+" for reaching "+BusStops[BwdCounter]+" from "+from+" and take any of the buses to reach the destination <br/>";
							document.getElementById("RouteDisplay").innerHTML = content;
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