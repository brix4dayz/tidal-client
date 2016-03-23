// for requestAnimationFrame
// -------------------------------------------------------------------------
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

// (function (){ ...code }()); is a trick to create a private scope for the variables within
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
	window.totalTime = 0.0;

    function updateDeltaTime() {
        var now = Date.now();
        deltaTime = ( now - (timer || now) ) / 1000.0;
        window.totalTime = window.totalTime + deltaTime;
     
        timer = now;
    }

    function resetTime() {
    	deltaTime = 0.0;
    	window.totalTime = 0.0;
    	timer = null;
    }

    window.updateDeltaTime = updateDeltaTime;
    window.resetTime = resetTime;

} ());

function getCanvas(){

	if (first) {
		first = false;
		resetTime();
	}
	updateDeltaTime();

	if (!stop) {
		requestAnimationFrame(getCanvas);
		getMax(context, options, tideData);
	} else {
		tideData = null;
		options = null;
	}

}

function getMax(context, options, tideData){
	//get Max and Min Values and round them to the upper .25 increment
	var maxVal= .5;
	var minVal= -.25;
	for (i in tideData) {
		if (tideData[i]["pred"] > maxVal){
			maxVal = (Math.round(tideData[i]["pred"]*4)/4) +.25;
		};
		if (tideData[i]["pred"] < minVal){
			minVal = Math.round(tideData[i]["pred"]*4)/4 - .25;
		};	
	}
	drawAxis(context, options, tideData, maxVal, minVal);
}


function drawAxis(context, options, tideData, maxVal, minVal){
	//Draws axis lines, and background grid
	//Bar Count is the dynamic number of blue and white horizontal bars.
	//It depends on our range of data
	//zeroLine marks the y value of our x axis
	var barCount = (maxVal - minVal)/.25;
	context.clearRect(0,0,clearWidth,clearHeight);
	for (var gridBar = 0; gridBar < barCount; gridBar++ ){
		if (gridBar % 2 == 0){
			context.fillStyle = "#e8f8ff";
		} else {
			context.fillStyle = "#fbfdfb";
		}
		context.fillRect(51, gridBar*chartHeight/barCount + 25, chartWidth, chartHeight/barCount);
	}
	var zeroLine = (chartHeight*maxVal)/(barCount*.25)+25;
	context.beginPath();
	context.moveTo(50, 25);
	context.lineTo(50, chartHeight + 25);
	context.moveTo(50, zeroLine);
	context.lineTo(chartWidth + 50, zeroLine);
	context.lineWidth = 2;
	context.strokeStyle = "#092643";
	context.stroke();
	
	plotData(context, options, tideData, chartHeight, chartWidth, zeroLine, barCount, maxVal, minVal);
}

function plotData(context, options, tideData, chartHeight, chartWidth, zeroLine, barCount, maxVal, minVal){
	//Plot the data and fill in the area in btwn data and axis
	//LineTo draws the line; fillRect the area.
	//I Plan to implement interpolation
	var frac = (totalTime / PLOT_TIME);
	if (frac >= 1.0) {
		frac = 1.0;
	}
	var dataLength = frac * tideData.length;
	var ttlLength = tideData.length;
	context.strokeStyle = "black";
	context.beginPath();
	context.moveTo(51, zeroLine - tideData[0]["pred"]*4*500/barCount);
	j=0;
	context.fillStyle = "#a0abb6";
	for (var i=0; i<dataLength; i++) {
		context.lineTo(chartWidth/ttlLength*j + 51, zeroLine- tideData[i]["pred"]*4*500/barCount);
		context.stroke();
		context.fillRect(chartWidth/ttlLength*j + 51, zeroLine- tideData[i]["pred"]*4*500/barCount, 3, tideData[i]["pred"]*4*500/barCount-1);
		j++;
	}
	labelAxis(context, options, tideData, maxVal, minVal, chartHeight, barCount, zeroLine, chartWidth);
}

function labelAxis(context, options, tideData, maxVal, minVal, chartHeight, barCount, zeroLine, chartWidth){
	//Put chart label//
	context.fillStyle= "#092643";
	context.font= "17px Sans Serif";
	context.fillText("Feet", 60, 60);
	//Put Y axis label//
	context.font = "16px Sans Serif";
	context.textAlign = "right";
	//Put some ticks, numbers on the y axis
	context.strokeStyle = "#092643";
	for (var yTick = 0; yTick <= maxVal; yTick+=.25){
		context.fillText(yTick, 42, zeroLine - 4*yTick * chartHeight/barCount);
		context.beginPath();
		context.moveTo(50, zeroLine -4*yTick*chartHeight/barCount);
		context.lineTo(55, zeroLine -4*yTick*chartHeight/barCount);
		context.stroke();
	}
	for (var yNTick = minVal; yNTick < 0; yNTick+=.25){
		context.fillText(yNTick, 42, zeroLine - 4*yNTick* chartHeight/barCount);
		context.beginPath();
		context.moveTo(50, zeroLine - 4*yNTick* chartHeight/barCount);
		context.lineTo(55, zeroLine - 4*yNTick* chartHeight/barCount);
		context.stroke();
	}
	timeAxis(context, options, chartWidth, zeroLine, tideData, chartHeight);
}

function timeAxis(context, options, chartWidth, zeroLine, tideData, chartHeight) {
	//Tick and Number the Time axis
	//If one day, we describe the time every two hours
	//If multDats, we describe noon and 12am
	if (tideData.length == 240) {
		context.font = "24px Sans Serif";
		context.textAlign = "left";
		context.fillStyle = "#012c57";
		var year = options.beginDate.slice(0,4);
		var month = options.beginDate.slice(4,6);
		var day = options.beginDate.slice(6,8);
		var location = options.location
		context.fillText("Tides for: "+location + " - " + month + '/' + day + '/' + year, 52, 20);
		context.font = "15px Sans Serif";
		context.strokeStyle = "#092643";
		context.fillStyle = "#092643";
		context.textAlign = "right";
		for (var xTick = 1; xTick < 12; xTick++){
			context.beginPath();
			context.moveTo(50 + xTick*chartWidth/12, zeroLine);
			context.lineTo(65 + xTick*chartWidth/12, zeroLine+15);
			context.stroke();
			context.closePath();
			context.beginPath();
			context.arc(50 + xTick*chartWidth/12, zeroLine, 3, 0, 2*Math.PI, true);
			context.closePath();
			context.fill();
			if (xTick < 6){
				context.fillText(xTick*2+"AM", 84+xTick*chartWidth/12, zeroLine+30);
			} else if (xTick == 6){
				context.fillText(xTick*2+"PM", 84+xTick*chartWidth/12, zeroLine+30);
			}
			else{
				context.fillText(xTick%6*2+"PM", 84+xTick*chartWidth/12, zeroLine+30);
			}
		}
	} else {
		context.font= "24px Sans Serif";
		context.textAlign = "left";
		context.fillStyle = "#012c57";
		var year = options.beginDate.slice(0,4);
		var month = options.beginDate.slice(4,6);
		var day = options.beginDate.slice(6,8);
		var location = options.location
		//console.log(location.length);
		if (location.length > 30){
			context.font = "20px Sans Serif";
		};
		var year2 = options.endDate.slice(0,4);
		var month2 = options.endDate.slice(4,6);
		var day2 = options.endDate.slice(6,8);
		context.fillText("Tides for: " + location + " - " + month + '/' + day + '/' + year + " to- " + month2 + '/' + day2 + '/' + year2, 52, 20);
		context.font= "15px Sans Serif";
		context.fillStyle = "#092643";
		var numDays = tideData.length/240;
		context.textAlign = "right";
		for(var n=0; n < numDays; n+=.5){
			context.beginPath();
			context.moveTo(50 + n*chartWidth/numDays, zeroLine);
			context.lineTo(55 + n*chartWidth/numDays, zeroLine+15);
			context.stroke();
			if ((n%1)==0){
				context.fillText("12AM", 90 + n*chartWidth/numDays, zeroLine + 30);
			} else {
				context.fillText("Noon", 90 + n*chartWidth/numDays, zeroLine + 30);
			}
		}
	}
}


