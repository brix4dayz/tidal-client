// Cache requests
// src:
//   http://gosukiwi.svbtle.com/the-right-way-of-caching-ajax-requests-with-jquery

TidePull.requestCache = {};

// src: http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
TidePull.randomKey = function (obj) {
    var keys = Object.keys(obj)
    return keys[ keys.length * Math.random() << 0];
};

TidePull.CACHE_MAX = 10;

TidePull.options = null;
TidePull.tideData = null;

TidePull.PLOT_TIME = 1.0;
TidePull.first = true;

//grab div
//all work is applied to the context object
TidePull.canvas = document.getElementById("tideCanvas");
TidePull.context = TidePull.canvas.getContext("2d");

TidePull.stop = false;

/**
 * Requests the tides for a given period of time. Cache the quest in
 * case it is repeated. Store only up to a certain max then remove a random
 * cached request.
 *
 * TODO: optimization, choose least used request and keep useCounter...
 */
TidePull.requestTides = function() {
  // console.log(options['location'] + options["beginDate"] + options["endDate"]);
  // var canvas = document.getElementById("tideCanvas");
  // var context = canvas.getContext("2d");

  //console.log("Hello!");
  TidePull.context.clearRect(0,0,TidePull.clearWidth,TidePull.clearHeight);
  TidePull.context.fillStyle = "#ffffff";
  TidePull.context.fillRect(0,0,TidePull.clearWidth,TidePull.clearHeight);
  TidePull.context.fillStyle = "#000000";
  TidePull.context.font= "18px Sans Serif";
  TidePull.context.textAlign = "center";
  TidePull.context.fillText("Loading...", TidePull.chartHeight*.5, TidePull.chartWidth*.5);

  // Make the POST request
  if (!TidePull.requestCache[TidePull.options['location'] + TidePull.options["beginDate"] + TidePull.options["endDate"]]) {
      while (Object.keys(TidePull.requestCache).length >= TidePull.CACHE_MAX) {
        console.log("Removing a cached request...");
        delete TidePull.requestCache[TidePull.randomKey(TidePull.requestCache)];
      }
      TidePull.requestCache[TidePull.options['location'] + TidePull.options["beginDate"] + TidePull.options["endDate"]] = $.ajax({
        type: "POST",
        url: TidePull.SERVER + "/tides",
        contentType: "application/json",
        crossDomain: true,
        data: JSON.stringify(TidePull.options),
        dataType: "json" 
      }).promise();
  }
  
  TidePull.requestCache[TidePull.options['location'] + TidePull.options["beginDate"] + TidePull.options["endDate"]].done(
    function( data, status, xhr ) {
      var obj = JSON.parse(xhr.responseText);

      //console.log(obj["soapenv:Envelope"]["soapenv:Body"][0]["PredictionsAndMetadata"][0]["stationName"][0]);

      TidePull.tideData = obj["soapenv:Envelope"]["soapenv:Body"][0]["PredictionsAndMetadata"][0]["data"][0]["item"];
      TidePull.first = true;
      TidePull.stop = false;
      TidePull.getCanvas();
  });

  TidePull.requestCache[TidePull.options['location'] + TidePull.options["beginDate"] + TidePull.options["endDate"]].fail(function( error ){
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

TidePull.isMultipleDays = false;

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
	TidePull.isMultipleDays = false;
})	

/**
*choosing button #multDay makes the other disappear and 
*the prompt to choose first and final day appear
*/
$('#multDay').on('click', function(){
	$('#oneDay').toggle(300);
	$('#promptB').toggle(300);
	$('#promptC').toggle(300);
	TidePull.isMultipleDays = true;
})	

/**hides things that don't show before time button is selected**/
$('#promptA').hide();
$('#promptB').hide();
$('#promptC').hide();

/**Once #getTides is clicked, map and selection block disappear
and canvas comes into display**/
TidePull.alertArray = [
"Please select a valid date range no greater than 7 days.", 
"Please select a begin date and an end date.",
"Please choose a date.",
"Please select a location from the map and try again."
];
TidePull.alerts = document.getElementById("alerts");
TidePull.alerts.innerHTML = "";

$('#getTides').on('click', function(){
	if (TidePull.selectedKey !== null) {
		TidePull.options = {'location': TidePull.selectedKey, 'id': TidePull.coordinates[TidePull.selectedKey]['id']};
		// pass more than location and id
		var goAhead = false;
		if (TidePull.isMultipleDays) {
			if ($('#datepickerB').datepicker('getDate')!==null && $('#datepickerC').datepicker('getDate')!==null){
				TidePull.options.beginDate = $('#datepickerB').datepicker('getDate').noaaDate();
				TidePull.options.endDate = $('#datepickerC').datepicker('getDate');
				TidePull.options.endDate.setHours(23);
				TidePull.options.endDate.setMinutes(59);
				TidePull.options.endDate = TidePull.options.endDate.noaaDate();
				//Make sure they select a date range thats valid
				//No more than seven days
				//Begin date is before end date
				var d1 = parseInt(TidePull.options.beginDate.slice(6,8));
				var d2 = parseInt(TidePull.options.endDate.slice(6,8));
				var m1 = parseInt(TidePull.options.beginDate.slice(4,6));
				var m2 = parseInt(TidePull.options.endDate.slice(4,6));
				if (d2>d1 && d2-d1<=7 && m2==m1){
					goAhead = true;
				} else if (m2-1==m1 && 30-d1+d2<=6){
					goAhead = true;
				} else {
					TidePull.alerts.innerHTML = TidePull.alertArray[0];
				};
			} else {
				TidePull.alerts.innerHTML = TidePull.alertArray[1];
			}
			TidePull.options.interval = "06";
		} else {
			if ($('#datepickerA').datepicker('getDate')!==null){
				TidePull.options.beginDate = $('#datepickerA').datepicker('getDate').noaaDate();
				TidePull.options.endDate = $('#datepickerA').datepicker('getDate');
				TidePull.options.endDate.setHours(23);
				TidePull.options.endDate.setMinutes(59);
				TidePull.options.endDate = TidePull.options.endDate.noaaDate();
				TidePull.options.interval = "06";
				goAhead = true;
			} else {
				TidePull.alerts.innerHTML = TidePull.alertArray[2];
			}
		}
		if (goAhead){
			TidePull.alerts.innerHTML = "";
			TidePull.requestTides();
			$('#map').hide();
			$('#plotter').show();
			$('#returnBtn').show(300);
		};
	} else {
		//if no location
		TidePull.alerts.innerHTML = TidePull.alertArray[3];
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


