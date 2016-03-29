// Cache requests
// src:
//   http://gosukiwi.svbtle.com/the-right-way-of-caching-ajax-requests-with-jquery

var requestCache = {};

// src: http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
var randomKey = function (obj) {
    var keys = Object.keys(obj)
    return keys[ keys.length * Math.random() << 0];
};

const CACHE_MAX = 10;

var options = null;
var tideData = null;

const PLOT_TIME = 1.0;
var first = true;

//grab div
//all work is applied to the context object
var canvas = document.getElementById("tideCanvas");
var context = canvas.getContext("2d");

var stop = false;

/**
 * Requests the tides for a given period of time. Cache the quest in
 * case it is repeated. Store only up to a certain max then remove a random
 * cached request.
 *
 * TODO: optimization, choose least used request and keep useCounter...
 */
function requestTides() {
  // console.log(options['location'] + options["beginDate"] + options["endDate"]);
  // var canvas = document.getElementById("tideCanvas");
  // var context = canvas.getContext("2d");

  //console.log("Hello!");
  context.clearRect(0,0,clearWidth,clearHeight);
  context.fillStyle = "#ffffff";
  context.fillRect(0,0,clearWidth,clearHeight);
  context.fillStyle = "#000000";
  context.font= "18px Sans Serif";
  context.textAlign = "center";
  context.fillText("Loading...", chartHeight*.5, chartWidth*.5);

  // Make the POST request
  if (!requestCache[options['location'] + options["beginDate"] + options["endDate"]]) {
      while (Object.keys(requestCache).length >= CACHE_MAX) {
        console.log("Removing a cached request...");
        delete requestCache[randomKey(requestCache)];
      }
      requestCache[options['location'] + options["beginDate"] + options["endDate"]] = $.ajax({
        type: "POST",
        url: SERVER + "/tides",
        contentType: "application/json",
        crossDomain: true,
        data: JSON.stringify(options),
        dataType: "json" 
      }).promise();
  }
  
  requestCache[options['location'] + options["beginDate"] + options["endDate"]].done(
    function( data, status, xhr ) {
      var obj = JSON.parse(xhr.responseText);

      //console.log(obj["soapenv:Envelope"]["soapenv:Body"][0]["PredictionsAndMetadata"][0]["stationName"][0]);

      tideData = obj["soapenv:Envelope"]["soapenv:Body"][0]["PredictionsAndMetadata"][0]["data"][0]["item"];
      first = true;
      stop = false;
      getCanvas();
  });

  requestCache[options['location'] + options["beginDate"] + options["endDate"]].fail(function( error ){
    // Log any error.
    console.log( "ERROR:", error );
  });
}

Date.prototype.yyyymmdd = function () {
	 var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

Date.prototype.noaaDate = function () {
	var hh = this.getHours().toString();
	var mm = this.getMinutes().toString();
	return this.yyyymmdd() + " " + (hh[1]?hh:"0"+hh[0]) + ":" + (mm[1]?mm:"0"+mm[0]);
};

var isMultipleDays = false;

/** Hide canvas and return button. */
$('#plotter').hide();
$('#returnBtn').hide();

/**
*This page organizes the sequence of our app
*setting up the first page as the map and date selection
*and the second page as the canvas rendering of tide data.
*/

/**
*choosing button #oneday makes the other disappear and
*the prompt to choose a day appear
*/
$('#oneDay').on('click', function(){
	$('#multDay').toggle(300);
	$('#promptA').toggle(300);
	isMultipleDays = false;
})	

/**
*choosing button #multDay makes the other disappear and 
*the prompt to choose first and final day appear
*/
$('#multDay').on('click', function(){
	$('#oneDay').toggle(300);
	$('#promptB').toggle(300);
	$('#promptC').toggle(300);
	isMultipleDays = true;
})	

/**hides things that don't show before time button is selected**/
$('#promptA').hide();
$('#promptB').hide();
$('#promptC').hide();

/**Once #getTides is clicked, map and selection block disappear
and canvas comes into display**/
var alertArray = [
"Please select a valid date range no greater than 7 days.", 
"Please select a begin date and an end date.",
"Please choose a date.",
"Please select a location from the map and try again."
];
var alerts = document.getElementById("alerts");
alerts.innerHTML = "";

$('#getTides').on('click', function(){
	if (selectedKey !== null) {
		options = {'location': selectedKey, 'id': coordinates[selectedKey]['id']};
		// pass more than location and id
		var goAhead = false;
		if (isMultipleDays) {
			if ($('#datepickerB').datepicker('getDate')!==null && $('#datepickerC').datepicker('getDate')!==null){
				options.beginDate = $('#datepickerB').datepicker('getDate').noaaDate();
				options.endDate = $('#datepickerC').datepicker('getDate');
				options.endDate.setHours(23);
				options.endDate.setMinutes(59);
				options.endDate = options.endDate.noaaDate();
				//Make sure they select a date range thats valid
				//No more than seven days
				//Begin date is before end date
				var d1 = parseInt(options.beginDate.slice(6,8));
				var d2 = parseInt(options.endDate.slice(6,8));
				var m1 = parseInt(options.beginDate.slice(4,6));
				var m2 = parseInt(options.endDate.slice(4,6));
				if (d2>d1 && d2-d1<=7 && m2==m1){
					goAhead = true;
				} else if (m2-1==m1 && 30-d1+d2<=6){
					goAhead = true;
				} else {
					alerts.innerHTML = alertArray[0];
				};
			} else {
				alerts.innerHTML = alertArray[1];
			}
			options.interval = "06";
		} else {
			if ($('#datepickerA').datepicker('getDate')!==null){
				options.beginDate = $('#datepickerA').datepicker('getDate').noaaDate();
				options.endDate = $('#datepickerA').datepicker('getDate');
				options.endDate.setHours(23);
				options.endDate.setMinutes(59);
				options.endDate = options.endDate.noaaDate();
				options.interval = "06";
				goAhead = true;
			} else {
				alerts.innerHTML = alertArray[2];
			}
		}
		if (goAhead){
			alerts.innerHTML = "";
			requestTides(options);
			$('#map').hide();
			$('#plotter').show();
			$('#returnBtn').show(300);
		};
	} else {
		//if no location
		alerts.innerHTML = alertArray[3];
		};
});

//Immediately clear canvas upon selecting get more tides
$('#returnBtn').on('click', function() {
		$('#map').show();
		$('#plotter').hide();
		$('#returnBtn').hide(300);
});

/**
 * Datepickers.
 */
$(function() {
	$( "#datepickerA" ).datepicker();
	});
$(function() {
    $( "#datepickerB" ).datepicker();
	});
$(function() {
    $( "#datepickerC" ).datepicker();
	});


