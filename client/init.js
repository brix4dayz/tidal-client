
$('head').append("\
    <style>\
      html, body {\
        height: 100%;\
        margin: 50px;\
        padding: 0;\
      }\
      #map {\
        height: 350px; width: 750px;\
        padding-left: 0;\
        padding-right: 0;\
        margin-left: auto;\
        margin-right: auto;\
        display: block;\
    border-left:solid;\
    border-right:solid;\
    border-color: #49796b;\
      }\
    #selectdate {\
    background-color: #a0d6b4;\
    height: auto;\
    width:750px;\
    display: block;\
    margin-left: auto;\
        margin-right: auto;\
    border:solid;\
    border-color: #49796b;\
    }\
    #selectors {margin-left: auto; margin-right: auto;}\
    #selectdate {padding-bottom: 5px;}\
    #getTides {float:right;}\
    #portSelection{\
    border:solid;\
    height: auto;\
    width:750px;\
    display: block;\
    margin-left: auto;\
    margin-right: auto;\
    border-color:#49796b;\
    background-color: #a0d6b4;\
    }\
    #getTides {background:#49796b;} #oneDay {background:#49796b;} #multDay {background:#49796b;}\
    #chooseLocation {background:#49796b;}\
    #tideCanvas {margin-left: 200px;}\
    </style>");


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