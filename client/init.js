//console.log(STATE);

const SERVER = "//45.33.68.196:80";

$('#tideApp').append("\
    <div class=\"container\" id=\"firstPage\">\
      <div class=\"container\" id=\"portSelection\">\
        <h3>Choose port by selecting a map pin:</h3>\
      </div>\
      <div id=\"map\"></div>\
          <div class=\"container\" id=\"selectdate\">\
            <h4>Choose between tides for one day and tides for multiple days:</h4>\
            <div class=\"row\" id=\"selectors\">\
                <p class=\"btn btn-info btn-sm\" id=\"oneDay\">Tides for one Day</p>\
                <p class=\"btn btn-info btn-sm\" id=\"multDay\">Tides for Multiple Days</p>\
                <ul class=\"pull-right\">\
                  <p id=\"promptA\">Choose Date: <input type=\"click\" id=\"datepickerA\"></p>\
                  <p id=\"promptB\">Choose Start Date: <input type=\"click\" id=\"datepickerB\"></p>\
                  <p id=\"promptC\">Choose End Date: <input type=\"click\" id=\"datepickerC\"></p>\
                </ul>\
            </div>\
            <p class=\"btn btn-info btn-sm\" id=\"getTides\">Get Tides</p>\
          </div>\
    </div>\
    <div class=\"container\" id=\"secondPage\">\
    <p class=\"btn btn-info btn-sm\" id=\"returnBtn\">Get More Tides</p>\
      <canvas width=\"750\" height=\"550\" id=\"tideCanvas\"></canvas>\
    </div>");

$('body').append("\
  <script async defer src=\"https://maps.googleapis.com/maps/api/js?key=AIzaSyBpN0l_qaCwhVFOKjFIHDuEgtlOkrlFixQ&signed_in=true&callback=map\">\
  </script>");