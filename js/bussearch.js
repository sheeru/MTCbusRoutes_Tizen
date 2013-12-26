var BusRouteMap = new Object();
$(document).load('chennai_bus_routes.txt', function(response){
	var BusDetails_Line = response.split('\n');
	for(i=0;i < BusDetails_Line.length; i++){
		var key = BusDetails_Line[i].split(":")[0].split("- ")[1];
		var value = BusDetails_Line[i].split(": ")[1];
		BusRouteMap[key] = value;
	}
});

function Search()
{
	var from = document.getElementById("from").value;
	var to = document.getElementById("to").value;
	var status = DirectRouteSearch(from,to);
	status = IndirectRouteSearch(from,to);
}

function DirectRouteSearch(from,to)
{
	for(var key in BusRouteMap){
		var BusStops = BusRouteMap[key].split(",");
		var frompresent = 0;
		var topresent = 0;
		for(var i=0;i<BusStops.length;i++){

		if(BusStops[i].toLowerCase().match(from.toLowerCase())){
//				alert("from present in :"+key);
				frompresent = 1;
				break;
			}	
		}
		
		if(frompresent){
			for(i=0;i<BusStops.length;i++){
				if(BusStops[i].toLowerCase().match(to.toLowerCase())){
//					alert("to present in :"+key);
					topresent = 1;
					break;
				}	
			}
		}
		
		if(frompresent && topresent)
			alert("from:"+from+" to:"+to+" via:"+key);	
	}
}

function IndirectRouteSearch(from,to)
{

}