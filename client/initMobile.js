//console.log(STATE);

const SERVER = "//45.33.68.196:80";

$('#tideApp').append("\
    <div class=\"container\" id=\"app\">\
      <div class=\"container\" id=\"portSelection\">\
        <p>Choose a port by selecting a map pin:</p>\
      </div>\
      <div id=\"map\"></div>\
	  <div id=\"plotter\"><canvas width=\"300\" height=\"250\" id=\"tideCanvas\"></canvas></div>\
	  <div class=\"container\" id=\"selectdate\">\
		<div class=\"row\" id=\"selectors\">\
			<p class=\"btn btn-info btn-sm\" id=\"oneDay\">Tides for one Day</p>\
			<p class=\"btn btn-info btn-sm\" id=\"multDay\">Tides for Multiple Days</p>\
			<ul class=\"pull-right\" id=\"daters\">\
			  <p id=\"promptA\"> Date: <input type=\"click\" id=\"datepickerA\"></p>\
			  <p id=\"promptB\"> Start Date: <input type=\"click\" id=\"datepickerB\"></p>\
			  <p id=\"promptC\"> End  Date:  <input type=\"click\" id=\"datepickerC\"></p>\
			</ul>\
		</div>\
		<p class=\"btn btn-sm\" id=\"getTides\">Get Tides</p>\
		<p class=\"btn btn-info btn-sm\" id=\"returnBtn\">Select New Location</p>\
		<p class=\"copyright\">TidePull © Wren Apps, 2016</p>\
	  </div>\
	  <p id=\"alerts\"></p>\
    </div>");

$('body').append("\
  <script async defer src=\"https://maps.googleapis.com/maps/api/js?key=AIzaSyBpN0l_qaCwhVFOKjFIHDuEgtlOkrlFixQ&signed_in=true&callback=map\">\
  </script>");