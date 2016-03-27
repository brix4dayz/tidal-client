//console.log(STATE);

const SERVER = "//45.33.68.196:80";

$('#tideApp').append("\
    <div class=\"container\" id=\"app\">\
      <div class=\"container\" id=\"portSelection\">\
        <h3>Choose port by selecting a map pin:</h3>\
      </div>\
      <div id=\"map\"></div>\
	  <div id=\"plotter\"><canvas width=\"540\" height=\"400\" id=\"tideCanvas\"></canvas></div>\
	  <div class=\"container\" id=\"selectdate\">\
		<div class=\"row\" id=\"selectors\">\
			<p class=\"btn btn-info btn-sm\" id=\"oneDay\">Tides for one Day</p>\
			<p class=\"btn btn-info btn-sm\" id=\"multDay\">Tides for Multiple Days</p>\
			<ul class=\"pull-right\" id=\"daters\">\
			  <p id=\"promptA\">Choose Date: <input type=\"click\" id=\"datepickerA\"></p>\
			  <p id=\"promptB\">Choose Start Date: <input type=\"click\" id=\"datepickerB\"></p>\
			  <p id=\"promptC\">Choose End Date: <input type=\"click\" id=\"datepickerC\"></p>\
			</ul>\
		</div>\
		<p class=\"btn btn-info btn-sm\" id=\"getTides\">Get Tides</p>\
		<p class=\"btn btn-info btn-sm\" id=\"returnBtn\">Select New Location</p>\
	  </div>\
    </div>");

$('body').append("\
  <script async defer src=\"https://maps.googleapis.com/maps/api/js?key=AIzaSyBpN0l_qaCwhVFOKjFIHDuEgtlOkrlFixQ&signed_in=true&callback=map\">\
  </script>");