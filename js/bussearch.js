//	$(document).ready(function(){
		$(document).load('chennai_bus_routes.txt', function(response){
			alert(response.split('\n')[0]);
		});
//	});