// for requestAnimationFrame
// -------------------------------------------------------------------------
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

// (function (){ ...code }()); is a trick to create a private scope for the variables within

if (!TidePull.mobile) {

	TidePull.chartHeight = 365;
	TidePull.chartWidth = 490;

	TidePull.labelFont1 = 15; //Font size for Feet indicator
	TidePull.labelFont2 = 14; //Font size for Y axis Numbers
	TidePull.timeFont = 12;
	TidePull.Yfact = 6 //The Spacing btwn y axis and numbers 
	

} else {

	TidePull.chartHeight = 225;
	TidePull.chartWidth = 280;

	TidePull.labelFont1 = 10;
	TidePull.labelFont2 = 8;
	TidePull.timeFont = 8;
	TidePull.Yfact = 2;
}

TidePull.leftMarg = TidePull.chartWidth * .0714; //offset btwn left side and y axis bar; replaces 50's
TidePull.topMarg = TidePull.chartHeight /18; //offset btwn top of canvas and top of chart; replaces 25's

TidePull.clearHeight = TidePull.chartHeight + TidePull.topMarg+20;
TidePull.clearWidth = TidePull.chartWidth + TidePull.leftMarg+10;

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o', ''];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());



// Time "singleton"
// -------------------------------------------------------
(function () {
  var timer = null;
  var deltaTime = 0.0;
	window.TidePull.totalTime = 0.0;

    function updateDeltaTime() {
        var now = Date.now();
        deltaTime = ( now - (timer || now) ) / 1000.0;
        window.TidePull.totalTime = window.TidePull.totalTime + deltaTime;
     
        timer = now;
    }

    function resetTime() {
    	deltaTime = 0.0;
    	window.TidePull.totalTime = 0.0;
    	timer = null;
    }

    window.TidePull.updateDeltaTime = updateDeltaTime;
    window.TidePull.resetTime = resetTime;

} ());

TidePull.getCanvas = function() {

	if (TidePull.first) {
		TidePull.first = false;
		TidePull.resetTime();
	}
	TidePull.updateDeltaTime();

	if (!TidePull.stop) {
		requestAnimationFrame(TidePull.getCanvas);
		TidePull.getMax(TidePull.context, TidePull.options, TidePull.tideData);
	} else {
		TidePull.tideData = null;
		TidePull.options = null;
	}

}

TidePull.getMax = function (context, options, tideData){
	//get Max and Min Values and round them to the upper .25 increment
	var maxVal= .5;
	var minVal= -.5;
	for (i in tideData) {
		if (tideData[i]["pred"] > maxVal){
			maxVal = (Math.round(tideData[i]["pred"]*4)/4) +.25;
		};
		if (tideData[i]["pred"] < minVal){
			minVal = Math.round(tideData[i]["pred"]*4)/4 - .25;
		};	
	}
	TidePull.drawAxis(context, options, tideData, maxVal, minVal);
}


TidePull.drawAxis = function(context, options, tideData, maxVal, minVal){
	//Draws axis lines, and background grid
	//Bar Count is the dynamic number of blue and white horizontal bars.
	//It depends on our range of data
	//zeroLine marks the y value of our x axis
	var barCount = (maxVal - minVal)/.25;
	context.clearRect(0,0,TidePull.clearWidth,TidePull.clearHeight);
	for (var gridBar = 0; gridBar < barCount; gridBar++ ){
		if (gridBar % 2 == 0){
			context.fillStyle = "#e8f8ff";
		} else {
			context.fillStyle = "#fbfdfb";
		}
		context.fillRect(TidePull.leftMarg+1, gridBar*TidePull.chartHeight/barCount + TidePull.topMarg, TidePull.chartWidth, TidePull.chartHeight/barCount);
	}
	var zeroLine = (TidePull.chartHeight*maxVal)/(barCount*.25)+TidePull.topMarg;
	context.beginPath();
	context.moveTo(TidePull.leftMarg, TidePull.topMarg);
	context.lineTo(TidePull.leftMarg, TidePull.chartHeight + TidePull.topMarg);
	context.moveTo(TidePull.leftMarg, zeroLine);
	context.lineTo(TidePull.chartWidth + TidePull.leftMarg, zeroLine);
	context.lineWidth = 2;
	context.strokeStyle = "#092643";
	context.stroke();
	
	TidePull.plotData(context, options, tideData, TidePull.chartHeight, TidePull.chartWidth, zeroLine, barCount, maxVal, minVal);
}

TidePull.plotData = function(context, options, tideData, chartHeight, chartWidth, zeroLine, barCount, maxVal, minVal){
	//Plot the data and fill in the area in btwn data and axis
	//LineTo draws the line; fillRect the area.
	//I Plan to implement interpolation
	console.log("Plotting.");
	var frac = (TidePull.totalTime / TidePull.PLOT_TIME);
	if (frac >= 1.0) {
		frac = 1.0;
		TidePull.stop = true;
		console.log("Should stop.");
	}
	var dataLength = frac * tideData.length;
	var ttlLength = tideData.length;
	context.strokeStyle = "black";
	context.lineWidth = .1;
	context.beginPath();
	context.moveTo(TidePull.leftMarg+1, zeroLine - tideData[0]["pred"]*4*chartHeight/barCount);
	j=0;
	context.fillStyle = "#a0abb6";
	for (var i=0; i<dataLength; i++) {
		context.lineTo(chartWidth/ttlLength*j + TidePull.leftMarg+1, zeroLine- tideData[i]["pred"]*4*chartHeight/barCount);
		context.stroke();
		context.fillRect(chartWidth/ttlLength*j + TidePull.leftMarg+1, zeroLine- tideData[i]["pred"]*4*chartHeight/barCount, 1, tideData[i]["pred"]*4*chartHeight/barCount-1);
		j++;
	}
	TidePull.labelAxis(context, options, tideData, maxVal, minVal, chartHeight, barCount, zeroLine, chartWidth);
}

TidePull.labelAxis = function(context, options, tideData, maxVal, minVal, chartHeight, barCount, zeroLine, chartWidth){
	//Put chart label//
	context.fillStyle= "#092643";
	context.font= TidePull.labelFont1 + "px Sans Serif";
	context.fillText("Tides in Feet", TidePull.leftMarg*2.5, TidePull.topMarg*.8);
	//Put Y axis label//
	context.font = TidePull.labelFont2 + "px Sans Serif";
	if (barCount > 15){
		context.font = (TidePull.labelFont2-2) + "px Sans Serif";
	}
	context.textAlign = "right";
	//Put some ticks, numbers on the y axis
	context.strokeStyle = "black";
	context.lineWidth = 1;
	for (var yTick = 0; yTick <= maxVal; yTick+=.25){
		context.fillText(yTick, TidePull.leftMarg-TidePull.Yfact, zeroLine - 4*yTick * chartHeight/barCount+.2*TidePull.topMarg);
		context.beginPath();
		context.moveTo(TidePull.leftMarg, zeroLine -4*yTick*chartHeight/barCount);
		context.lineTo(TidePull.leftMarg+TidePull.chartWidth, zeroLine -4*yTick*chartHeight/barCount);
		context.stroke();
	}
	for (var yNTick = minVal; yNTick < 0; yNTick+=.25){
		context.fillText(yNTick,TidePull.leftMarg-TidePull.Yfact, zeroLine - 4*yNTick* chartHeight/barCount+2);
		context.beginPath();
		context.moveTo(TidePull.leftMarg, zeroLine - 4*yNTick* chartHeight/barCount);
		context.lineTo(TidePull.leftMarg+TidePull.chartWidth, zeroLine - 4*yNTick* chartHeight/barCount);
		context.stroke();
	}
	TidePull.timeAxis(context, options, chartWidth, zeroLine, tideData, chartHeight);
}

TidePull.timeAxis = function(context, options, chartWidth, zeroLine, tideData, chartHeight) {
	//Tick and Number the Time axis
	//If one day, we describe the time every two hours
	//If multDats, we describe noon and 12am



	if (tideData.length == 240) {
		context.font = TidePull.timeFont + "px Sans Serif";
		context.strokeStyle = "#092643";
		context.fillStyle = "#092643";
		context.textAlign = "center";
		for (var xTick = 1; xTick < 12; xTick++){
			context.beginPath();
			context.moveTo(TidePull.leftMarg + xTick*chartWidth/12, zeroLine);
			context.lineTo(TidePull.leftMarg+.32*TidePull.leftMarg + xTick*chartWidth/12, zeroLine+TidePull.topMarg*.6);
			context.stroke();
			context.closePath();
			context.beginPath();
			context.arc(TidePull.leftMarg + xTick*chartWidth/12, zeroLine, 3, 0, 2*Math.PI, true);
			context.closePath();
			context.fill();
			context.beginPath();
			context.moveTo(TidePull.leftMarg+xTick*chartWidth/12, TidePull.topMarg);
			context.lineTo(TidePull.leftMarg+xTick*chartWidth/12, TidePull.topMarg + chartHeight);
			context.stroke();
			context.closePath();
			if (xTick < 6){
				context.fillText(xTick*2+"AM", TidePull.leftMarg*1.6+xTick*chartWidth/12, zeroLine+TidePull.topMarg*1.2);
			} else if (xTick == 6){
				context.fillText(xTick*2+"PM", TidePull.leftMarg*1.6+xTick*chartWidth/12, zeroLine+TidePull.topMarg*1.2);
			}
			else{
				context.fillText(xTick%6*2+"PM", TidePull.leftMarg*1.6+xTick*chartWidth/12, zeroLine+TidePull.topMarg*1.2);
			}
		}
	} else {
		context.font=(TidePull.timeFont+1) + "px Sans Serif";
		context.fillStyle = "#092643";
		var numDays = tideData.length/240;
		context.textAlign = "center";
		context.fillText("(Vertical lines mark every six hours)", TidePull.leftMarg+TidePull.leftMarg*6, TidePull.topMarg*.8);
		context.font= "bold " + (TidePull.timeFont+1) + "px Sans Serif";
		for(var n=0; n < numDays; n+=.25){
			if (n%.5==0){
			context.beginPath();
			context.moveTo(TidePull.leftMarg + n*chartWidth/numDays, zeroLine);
			context.lineTo(TidePull.leftMarg+.2*TidePull.leftMarg + n*chartWidth/numDays, zeroLine+TidePull.topMarg*.6);
			context.stroke();
			context.closePath();
			context.beginPath();
			context.arc(TidePull.leftMarg + n*chartWidth/numDays, zeroLine, 3, 0, 2*Math.PI, true);
			context.closePath();
			context.fill();
			}
			context.beginPath();
			context.moveTo(TidePull.leftMarg+n*chartWidth/numDays, TidePull.topMarg);
			context.lineTo(TidePull.leftMarg+n*chartWidth/numDays, TidePull.topMarg+TidePull.chartHeight);
			context.stroke();
			context.closePath();
			if ((n%1)==0){
				context.fillText("12AM", TidePull.leftMarg*1.5 + n*chartWidth/numDays, zeroLine + TidePull.topMarg*1.2);
				if (n!=0){
					context.fillText("Day" + (n+1), TidePull.leftMarg*1.4+n*chartWidth/numDays,zeroLine-TidePull.topMarg*.3);
				}
			} else if (n%.5==0 && n%1!=0){
				context.fillText("Noon", TidePull.leftMarg*1.6 + n*chartWidth/numDays, zeroLine + TidePull.topMarg*1.2);
			}
		}
	}
	context.beginPath();
	context.moveTo(TidePull.leftMarg+TidePull.chartWidth, TidePull.topMarg)
	context.lineTo(TidePull.leftMarg+TidePull.chartWidth, TidePull.topMarg+TidePull.chartHeight);
	context.stroke();
	context.closePath();
}

$('body').append("\
  <script async defer src=\"https://maps.googleapis.com/maps/api/js?key=AIzaSyBpN0l_qaCwhVFOKjFIHDuEgtlOkrlFixQ&signed_in=true&callback=map\">\
  </script>");
