// GLOBALS

/** 
 * Loads data from JSON file using jQuery
 * replace 0 - 60 with names of locations
 * i.e. North Pass
 * uses anonymous object rather array
 * objects in javascript are like arrays but
 * use strings as indices instead of integer numbers
 */ 
var coordinates = null;


/**
 * for 0 - 60, eventually will be
 * "North Pass, ...", stores gmap makrers
 * in an object mapping titles to markers
 * and adds markers to the map with a bounce
 * then once they click it, it stops bouncing
 */
var markers = {};
var selectedKey = null;

function map() {
  


    $.getJSON(SERVER + "/locations?state=" + STATE, 

        function (data) {

            // THIS SHOULD BE RECEIVED FROM SERVER BASED ON STATE!
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 7,
                center: data.coordinates,
                streetViewControl:false
            });

            /**
             * once jQuery has loaded the JSON file
             * it calls this function, putting the object
             * in data
             *
             * Use right click "Inspect Element" to see console
             * output, like system.out.println in Java
             * prints the first pair of coords
             */ 
            coordinates = {};
            //console.log("Printing first point: " + coordinates["0"]["lat"] + "," + coordinates["0"]["lng"]);
			var key = null;
			for (var i in data.locations) {
                key = data.locations[i]['name'];
                coordinates[key] = {
                    'id': data.locations[i]['stationId'],
                    'position': { lat: data.locations[i]['lat'], lng: data.locations[i]['lng']}
                }
				markers[key] = new google.maps.Marker({
				  position: coordinates[key].position,
				  map: map,
				  title: key,
				  animation: google.maps.Animation.DROP
		         });

            }
		
            // for every marker
			for (var key in coordinates){
				// make it clickable
                google.maps.event.addListener(markers[key], 'click', 
					function(innerKey) { // do this when clicked
						return function() {
                            // reset other markers
                            if (selectedKey !== innerKey && selectedKey !== null) {
                                markers[selectedKey].setAnimation(null);
                            }
                            // turn bounce on, display name
							if (markers[innerKey].animation === null) {
                                selectedKey = innerKey;
								markers[innerKey].setAnimation(google.maps.Animation.BOUNCE);
                                document.getElementById("portSelection").innerHTML = "<h3>You have selected: " + innerKey + "</h3>";
							} else { // turn off, tell them to choose a port
                                selectedKey = null;
								markers[innerKey].setAnimation(null);
                                document.getElementById("portSelection").innerHTML = "<h3>Choose port by selecting a map pin:</h3>";
                            }
						};
					}(key)
                );
            }   
        }
    );
}

