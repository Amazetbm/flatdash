var jsonData = "assets/json/mockdata.json";
var ATCTtrendVal = [];
var ATCPtrendVal = [];
var ATCtrendDate = [];
var ATCTval = 0;
var ATCPval = 0;
var TtrendAv = 0;
var PtrendAv = 0;
var Ttag;
var Ptag;
var gauge1;
var gauge2;

// Do stuff more stuff
function loadSpark(){
	var ATCTval = 0;
	var ATCPval = 0;
	var TtrendAv = 0;
	var PtrendAv = 0;
	$.getJSON(jsonData, function(jdata) {
		//Parse data from the json values
		for (var i=0, len=jdata.length; i < len; i++) {
			ATCTtrendVal.push(jdata[i].availability);
			ATCPtrendVal.push(jdata[i].performance);
			ATCtrendDate.push(jdata[i].date);
			ATCTval = ATCTval + jdata[i].availability;
			ATCPval = ATCPval + jdata[i].performance;
		}
		
		//get the average of values vs dates
		TtrendAv = ATCTval / jdata.length;
		PtrendAv = ATCPval / jdata.length;
		
		//Round it off
		TtrendAv = TtrendAv.toFixed(2);
		PtrendAv = PtrendAv.toFixed(2);	

		
		// Plug em into the table
		$('#atc-avail').text(TtrendAv);
		$('#atc-perf').text(PtrendAv);
		$('#atc-availtrend').sparkline(ATCTtrendVal);
		$('#atc-perftrend').sparkline(ATCPtrendVal);
    });
	tagCells(PtrendAv, TtrendAv);	
	
	$('#atc-availtrend').click(function(){
		var chartDialog = $('<div id="at-avail-diag"><div id="atc-avail-chart"></div></div>');
		
		chartDialog.dialog({
			title: 'ATC Availability',
            resizable: false,
            modal: true,
            width: 800,
            height: 450,
            close: function(click){
            	$(this).dialog('destroy');
            },
        });
		bigChart(ATCTtrendVal, ATCtrendDate);
	});
	
	$('#atc-perftrend').click(function(){
		var chartDialog2 = $('<div id="at-perf-diag"><div id="atc-perf-chart"></div></div>');
		
		chartDialog2.dialog({
			title: 'ATC Performance',
            resizable: false,
            modal: true,
            width: 800,
            height: 450,
            close: function(click){
            	$(this).dialog('destroy');
            },
        });
		bigChart2(ATCPtrendVal, ATCtrendDate);
	});
}

function reDoChart(){
	//Resizing chart
	$('#atc-avail-chart').wijlinechart('redraw', false);
}

function bigChart(ATCTtrendVal, ATCtrendDate){
	var trendPush = ATCTtrendVal;
	var trendDate = ATCtrendDate;
		
	$('#atc-avail-chart').wijlinechart({ 

        header: { 
            text: "ATC Availabiliy"
        }, 
       
        axis: { 
            y: { 
                text: "Percentages", 
            }, 
            x: { 
                text: "Dates"
            } 
        }, 
        showChartLabels: false, 
        legend: { 
            visible: false
        }, 
        seriesList: [ 
            { 
                //Label shown in legend 
                label: "Availability", 
                data: { 
                    //X axis values as Date objects. We are using a shared x value array for this chart with multiple y value arrays. 
                    x: trendDate, 
                    //Y axis values for 1st series 
                    y: trendPush 
                } 
            } 
        ]
    });
	
	$('#atc-perf-full').wijlinechart({ 

        header: { 
            text: ""
        }, 
       
        axis: { 
            y: { 
                text: "", 
            }, 
            x: { 
                text: ""
            } 
        }, 
        showChartLabels: false, 
        legend: { 
            visible: false
        }, 
        seriesList: [ 
            { 
                label: "", 
                data: { 
                    x: trendDate, 
                    y: trendPush 
                } 
            } 
        ]
    });
}

function bigChart2(ATCPtrendVal, ATCtrendDate){
	var perfPush = ATCPtrendVal;
	var trendDate = ATCtrendDate;
		
	$('#atc-perf-chart').wijlinechart({ 

        header: { 
            text: "ATC Performance"
        }, 
       
        axis: { 
            y: { 
                text: "Values", 
            }, 
            x: { 
                text: "Dates"
            } 
        }, 
        // hide chart points values 
        showChartLabels: false, 
        // hide legend 
        legend: { 
            visible: false
        }, 
        seriesList: [ 
            { 
                //Label shown in legend 
                label: "Performance", 
                data: { 
                    //X axis values as Date objects. We are using a shared x value array for this chart with multiple y value arrays. 
                    x: trendDate, 
                    //Y axis values for 1st series 
                    y: perfPush 
                } 
            } 
        ],
        seriesStyles: [{ 
            stroke: "#1D70A7"
        }] 
    }); 
}

function tagCells(PtrendAv, TtrendAV){
	//Tag the Perf cell
	switch (true) {
		case (PtrendAv <= 4.00):
			Ptag = '#1DFF00';
			$('#atc-perf').parent().css('background-color', Ptag);
			$('#atc-perf').css('color', '#555');
			break;
		case (PtrendAv > 4.00 && PtrendAv <= 8.00):
			Ptag = '#F9B916';
			$('#atc-perf').parent().css('background-color', Ptag);
			$('#atc-perf').css('color', '#555');
			break;
		case (PtrendAv > 8.00):
			Ptag = '#F72D00';
			$('#atc-perf').css('color','#EFEFEF').parent().css('background-color', Ptag);
			$('#atc-perf').css('color', '#EFEFEF');
			break;
		default:
			// Yarp
			break;
	}
	
	//Tag the Availabilty cell
	switch (true) {
		case (TtrendAv >= 99.95):
			Ttag = '#1DFF00';
			$('#atc-avail').parent().css('background-color', Ttag);
			$('#atc-avail').css('color', '#555');
			break;
		case (TtrendAv >= 99.80 && TtrendAv < 99.95):
			Ttag = '#F9B916';
			$('#atc-avail').parent().css('background-color', Ttag);
			$('#atc-avail').css('color', '#555');
			break;
		case (TtrendAv < 99.80):
			Ttag = '#F72D00';
			$('#atc-avail').css('color', '#EFEFEF').parent().css('background-color', Ttag);
			$('#atc-avail').css('color','#EFEFEF').next().css('color', '#EFEFEF');
			break;
		default:
			// Yarp Too
			break;
	}
}

function loadPies(){
	//Pie charts. Highly customizable
	$('#perf-chart').wijradialgauge({ 
        value: 90, 
        max: 100, 
        min: 0,
        height: 200,
        width: 200,
        startAngle: -45, 
        sweepAngle: 270, 
        radius: "auto", 
        islogarithmic: false, 
        origin: { 
            x: 0.5, y: 0.5 
        }, 
        labels: { 
            offset: 27, //4F6B82 
            style: { 
                fill: "#1E395B", 
                "font-size": 12, 
                "font-weight": "600"
            } 
        }, 
        tickMinor: { 
            position: "inside", 
            offset: 30, 
            style: { 
                "height": 2, 
                "width": 4, 
                fill: "#1E395B", 
                stroke: "#E7EFF8"
            }, 
            interval: 5, 
            visible: true
        }, 
        tickMajor: { 
            position: "inside", 
            offset: 27, 
            style: { 
                fill: "#1E395B", 
                "height": 3, 
                "width": 10, 
                stroke: "#E7EFF8", 
                "stroke-width": 1.5 
            }, 
            interval: 25, 
            visible: true
        }, 
        ranges: [ 
        { 
            startWidth: 2, 
            endWidth: 5, 
            startValue: 0, 
            endValue: 10, 
            startDistance: 0.6, 
            endDistance: 0.58, 
            style: { 
                fill: "#F72D00", 
                stroke: "#F72D00C", 
                "stroke-width": 0 
            } 
        }, 
        { 
            startWidth: 5, 
            endWidth: 20, 
            startValue: 10, 
            endValue: 90, 
            startDistance: 0.58, 
            endDistance: 0.54, 
            style: { 
                fill: "0-#F79C00-#EBF700", 
                stroke: "#FFFFFF", 
                "stroke-width": 0 
            } 
        }, 
        { 
            startWidth: 20, 
            endWidth: 25, 
            startValue: 90, 
            endValue: 100, 
            startDistance: 0.54, 
            endDistance: 0.5, 
            style: { 
                fill: "#1DE100", 
                stroke: "#1DE100", 
                "stroke-width": 0 
            } 
        } 
        ], 
        face: { 
            style: { 

                fill: "r(0.9, 0.60)#FFFFFF-#D9E3F0", 
                stroke: "#7BA0CC", 
                "stroke-width": 2 
            } 
        }, 
        pointer: { 
            length: 0.8, 
            offset: 0, 
            shape: "tri", 
            width: 3, 
            style: { 
                fill: "#1E395B", 
                stroke: "#1E395B"
            } 
        }, 
        cap: { 
            radius: 10, 
            style: { 
                fill: "#1E395B", 
                stroke: "#1E395B"
            } 
        } 
    }); 
	
	$('#perf-chart2').wijradialgauge({ 
        value: 82, 
        max: 100, 
        min: 0,
        height: 200,
        width: 200,
        startAngle: -45, 
        sweepAngle: 270, 
        radius: "auto", 
        islogarithmic: false, 
        origin: { 
            x: 0.5, y: 0.5 
        }, 
        labels: { 
            offset: 27, //4F6B82 
            style: { 
                fill: "#1E395B", 
                "font-size": 12, 
                "font-weight": "800"
            } 
        }, 
        tickMinor: { 
            position: "inside", 
            offset: 30, 
            style: { 
                "height": 2, 
                "width": 4, 
                fill: "#1E395B", 
                stroke: "#E7EFF8"
            }, 
            interval: 5, 
            visible: true
        }, 
        tickMajor: { 
            position: "inside", 
            offset: 27, 
            style: { 
                fill: "#1E395B", 
                "height": 3, 
                "width": 10, 
                stroke: "#E7EFF8", 
                "stroke-width": 1.5 
            }, 
            interval: 25, 
            visible: true
        }, 
        ranges: [ 
        { 
            startWidth: 2, 
            endWidth: 5, 
            startValue: 0, 
            endValue: 10, 
            startDistance: 0.6, 
            endDistance: 0.58, 
            style: { 
                fill: "#F72D00", 
                stroke: "#F72D00C", 
                "stroke-width": 0 
            } 
        }, 
        { 
            startWidth: 5, 
            endWidth: 20, 
            startValue: 10, 
            endValue: 90, 
            startDistance: 0.58, 
            endDistance: 0.54, 
            style: { 
                fill: "0-#F79C00-#EBF700", 
                stroke: "#FFFFFF", 
                "stroke-width": 0 
            } 
        }, 
        { 
            startWidth: 20, 
            endWidth: 25, 
            startValue: 90, 
            endValue: 100, 
            startDistance: 0.54, 
            endDistance: 0.5, 
            style: { 
                fill: "#1DE100", 
                stroke: "#1DE100", 
                "stroke-width": 0 
            } 
        } 
        ], 
        face: { 
            style: { 

                fill: "r(0.9, 0.60)#FFFFFF-#D9E3F0", 
                stroke: "#7BA0CC", 
                "stroke-width": 2 
            } 
        }, 
        pointer: { 
            length: 0.8, 
            offset: 0, 
            shape: "tri", 
            width: 3, 
            style: { 
                fill: "#1E395B", 
                stroke: "#1E395B"
            } 
        }, 
        cap: { 
            radius: 10, 
            style: { 
                fill: "#1E395B", 
                stroke: "#1E395B"
            } 
        } 
    }); 
}

function changeGauge(){
	//Update the value of the gauge based on live data.
	var newVal1 = Math.random() * (100 - 70) + 70;
	var newVal2 = Math.random() * (100 - 60) + 60;
	$('#perf-chart').wijradialgauge('option', 'value', newVal1);
	$('#perf-chart2').wijradialgauge('option', 'value', newVal2);
}

function buildout(button){
	var thisBttn = button;
	
	$('#content-wrapper').empty('.row');
}

$('.navigation li a').click(function(){
	var linkBttn = $(this).attr('id');
	buildout(linkBttn);
});