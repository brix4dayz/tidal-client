// GLOBALS

/** 
 * Loads data from JSON file using jQuery
 * replace 0 - 60 with names of locations
 * i.e. North Pass
 * uses anonymous object rather array
 * objects in javascript are like arrays but
 * use strings as indices instead of integer numbers
 */ 
TidePull.coordinates = null;


/**
 * for 0 - 60, eventually will be
 * "North Pass, ...", stores gmap makrers
 * in an object mapping titles to markers
 * and adds markers to the map with a bounce
 * then once they click it, it stops bouncing
 */
TidePull.markers = {};
TidePull.selectedKey = null;

function map() {
  


    $.getJSON(TidePull.SERVER + "/locations?state=" + STATE, 

        function (data) {

            // THIS SHOULD BE RECEIVED FROM SERVER BASED ON STATE!
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 7,
                center: data.coordinates,
                streetViewControl:false
            });

            TidePull.map = map;

            /**
             * once jQuery has loaded the JSON file
             * it calls this function, putting the object
             * in data
             *
             * Use right click "Inspect Element" to see console
             * output, like system.out.println in Java
             * prints the first pair of coords
             */ 
            TidePull.coordinates = {};
            //console.log("Printing first point: " + coordinates["0"]["lat"] + "," + coordinates["0"]["lng"]);
			var key = null;
			var newOpt = null;
			var portList = document.getElementById("promptD");
            newOpt = document.createElement("option");
            newOpt.innerHTML = "---------";
            portList.appendChild(newOpt);
			for (var i in data.locations) {
                key = data.locations[i]['name'];
				newOpt = document.createElement("option");
				newOpt.innerHTML = key;
				portList.appendChild(newOpt);
                TidePull.coordinates[key] = {
                    'id': data.locations[i]['stationId'],
                    'position': { lat: data.locations[i]['lat'], lng: data.locations[i]['lng']}
                }
				TidePull.markers[key] = new google.maps.Marker({
				  position: TidePull.coordinates[key].position,
				  map: map,
				  title: key,
				  animation: google.maps.Animation.DROP
		         });

            }
		
            // for every marker
			for (var key in TidePull.coordinates){
				// make it clickable
                google.maps.event.addListener(TidePull.markers[key], 'click', 
					function(innerKey) { // do this when clicked
						return function() {
                            // reset other markers
                            if (TidePull.selectedKey !== innerKey && TidePull.selectedKey !== null) {
                                TidePull.markers[TidePull.selectedKey].setAnimation(null);
                            }
                            // turn bounce on, display name
							if (TidePull.markers[innerKey].animation === null) {
                                TidePull.selectedKey = innerKey;
								TidePull.markers[innerKey].setAnimation(google.maps.Animation.BOUNCE);
                                document.getElementById("portSelection").innerHTML = "<h3>You have selected: " + innerKey + "</h3>";
                                $('#promptD').val(innerKey);
                            } else { // turn off, tell them to choose a port
                                TidePull.selectedKey = null;
								TidePull.markers[innerKey].setAnimation(null);
                                document.getElementById("portSelection").innerHTML = "<h3>Choose port by selecting a map pin:</h3>";
                                $('#promptD').val("---------"); // SHOULD WE CHANGE THIS TO SOMETHING MORE PROFESSIONAL?
                            }
						};
					}(key)
                );
            }

            $(document).ready(function() {
                $(window).resize(function() {
                    google.maps.event.trigger(map, 'resize');
                });
                google.maps.event.trigger(map, 'resize');
            });  
        }
    );
}

