var jsonData = "assets/json/mockdata.json";
var dasConfig = "assets/json/config.json";
var initVars;
var tableVars;
var TtrendVal = [];
var PtrendVal = [];
var trendDate = [];
var Tval = 0;
var Pval = 0;
var TtrendAv = 0;
var PtrendAv = 0;
var Ttag;
var Ptag;
var gauge1;
var gauge2;
var startNum = 0;
var stopNum = 0;
var availTarget = ' 99.50%';
var availTarNum = '99.50';
var perfTarget = ' 4.00ms';
var availLine =[];
var perfLine = [];

function initApp(){
	/*$.getJSON(dasConfig, function(confdata){
		initVars = confdata;
		cacheVars(initVars);
	});
	*/
	var initButton = 'menu-link-digitalMedia';
	buildout(initButton);
}


function selectedTab(tabID){
	//Checks strings from the table ID
	if (typeof String.prototype.startsWith != 'function') {
	    String.prototype.startsWith = function(prefix) {
	        return this.slice(0, prefix.length) == prefix;
	    };
	}
	 
	if (typeof String.prototype.endsWith != 'function') {
	    String.prototype.endsWith = function(suffix) {
	        return this.slice(-suffix.length) == suffix;
	    };
	}
	var thisID = tabID+'-table';
	
	if (thisID.startsWith('Digital')){
		tableVars = 'Digital_Media';
		buildTables(thisID, tableVars);
	}else if(thisID.startsWith('Software')){
		tableVars = 'Software';
		buildTables(thisID, tableVars);
	}else if(thisID.startsWith('Enterprise')){
		tableVars = 'Enterprise';
		buildTables(thisID, tableVars);
	}else if(thisID.startsWith('Issues')){
		tableVars = 'Issues';
		buildTables(thisID, tableVars);
	}


}

function buildTables(tableID, VarID){
	var currentID = tableID;
	var currentTable = VarID;
	var divVar, thisDiv;
	var cellName;
	var cellTTarget;
	var cellPTarget;
	var IDTag;
	var celldataCall;
	$.getJSON(dasConfig, function(confdata){
		for (var i=0, len=confdata.length; i < len; i++){
			divVar = confdata[i].division;
			if (divVar == currentTable){
				thisDiv = confdata[i].units;
				for(var j=0, jlen=thisDiv.length; j < jlen; j++){
					cellName = thisDiv[j].name;
					cellTTarget = thisDiv[j].availTarget;
					cellPTarget = thisDiv[j].perfTarget;
					celldataCall = thisDiv[j].dataURI;
					//Make it happen
					IDTag = cellName.toLowerCase();
					IDTag = IDTag.split(' ').join('-');
					$('#'+currentID+' tbody').append('<tr><td>'+cellName+'</td><td>'+cellTTarget+'</td><td><span id="'+IDTag+'-avail"></span></td><td class="sparkCell"><span id="'+IDTag+'-availtrend" class="theme-global-spark-link"  seq-loc="'+i+','+j+'"></span></td><td>'+cellPTarget+'</td><td><span id="'+IDTag+'-perf"></span></td><td class="sparkCel"><span id="'+IDTag+'-perftrend" class="theme-global-spark-link"  seq-loc="'+i+','+j+'"></span></td><td class="cellNudge"><button class="btn btn-outline btn-xs btn-labeled btn-primary" id="'+IDTag+'-notes"><span class="btn-label icon fa  fa-files-o"></span>Notes</button></td><td class="cellNudge"><button class="btn btn-outline btn-xs btn-labeled btn-primary" id="'+IDTag+'-trends"><span class="btn-label icon fa fa-bar-chart-o"></span>Trends</button></td></tr>');
					loadSparkDyn(IDTag, celldataCall);
				}
				
			}
		}
		initTagButtons();
	});
	
}

// Do stuff more stuff
function loadSpark(){
	var Tval = 0;
	var Pval = 0;
	var TtrendAv = 0;
	var PtrendAv = 0;
	$.getJSON(jsonData, function(jdata) {
		//Parse data from the json values
		for (var i=0, len=jdata.length; i < len; i++) {
			TtrendVal.push(jdata[i].availability);
			PtrendVal.push(jdata[i].performance);
			trendDate.push(jdata[i].date);
			Tval = Tval + jdata[i].availability;
			Pval = Pval + jdata[i].performance;
		}
		
		stopNum = TtrendVal.length;
		
		//get the average of values vs dates
		TtrendAv = Tval / jdata.length;
		PtrendAv = Pval / jdata.length;
		
		//Round it off
		TtrendAv = TtrendAv.toFixed(2);
		PtrendAv = PtrendAv.toFixed(2);	
	
		// Plug em into the table
		$('#atc-avail').text(TtrendAv);
		$('#atc-perf').text(PtrendAv);
		$('#atc-availtrend').sparkline(TtrendVal, {width: 150, lineColor: '#238C00', fillColor: '#B3FF99'});
		$('#atc-perftrend').sparkline(PtrendVal, {width: 150, lineColor: '#238C00', fillColor: '#B3FF99'});
    });
	tagCells(PtrendAv, TtrendAv);	
	
	$('#atc-availtrend').click(function(){
		var chartDialog = $('<div id="at-avail-diag"><div class="kpi-row"><div id="kpi-1" class="kpi-box"><div class="kpi-actual">.</div><div class="target-label">Target</div><div class="kpi-target fa fa-arrow-up">.</div><div class="clear-this"></div></div><div id="kpi-3" class="kpi-box"><div class="kpi-actual">.</div><div class="target-label">Target</div><div class="kpi-target fa fa-arrow-down">.</div><div class="clear-this"></div></div><div class="clear-this"></div></div><div id="atc-avail-chart"></div><div class="chart-button-row" id="chart-buttons"></div><div class="full-box"><div id="atc-avail-full" class="full-bar"></div><div id="atc-long-chart" class="full-chart"></div></div></div>');
		
		chartDialog.dialog({
			title: 'ATC Availabiliy',
            resizable: false,
            modal: true,
            width: 960,
            height: 560,
            close: function(click){
            	$(this).dialog('destroy');
            },
        });
		bigChart(TtrendVal, trendDate);
		buildButtons(TtrendVal, trendDate);
	});
	
	$('#atc-perftrend').click(function(){
		var chartDialog2 = $('<div id="at-perf-diag"><div id="atc-perf-chart"></div></div>');
		
		chartDialog2.dialog({
			title: 'ATC Performance',
            resizable: false,
            modal: true,
            width: 960,
            height: 560,
            close: function(click){
            	$(this).dialog('destroy');
            },
        });
		bigChart2(PtrendVal, trendDate);
	});
	
	$('.btn-primary').click(function(){
		var thisID = $(this).attr('id');
		var miniWidth, miniHeight, whichType, miniDialogID;
		var miniDiag = $('<div id="'+thisID+'-diag"><div id="'+thisID+'-smallBox"></div></div>');
		var prettyStr = thisID.split('-').join(' ');
		if (thisID.search('notes') > -1){
			miniWidth = 480;
			miniHeight = 420;
			whichType = 'notes';
		}else{
			miniWidth = 760;
			miniHeight = 420;
			whichType= 'trending';
		}
		
		miniDiag.dialog({
			title: prettyStr,
            resizable: false,
            modal: true,
            width: miniWidth,
            height: miniHeight,
            close: function(click){
            	$(this).dialog('destroy');
            },
        });
		
		miniDialogID = $(miniDiag).attr('ID');
		miniDialogs(miniDialogID, whichType);
	});
}

function loadSparkDyn(IDChain, chainData){
	var localID = IDChain;
	var localData = chainData;
	var Tval = 0;
	var Pval = 0;
	var TtrendAv = 0;
	var PtrendAv = 0;
	TtrendVal = [];
	PtrendVal = [];
	trendDate = [];

	$.getJSON(localData, function(jdata) {
		//Parse data from the json values
		for (var i=0, len=jdata.length; i < len; i++) {
			TtrendVal.push(jdata[i].availability);
			PtrendVal.push(jdata[i].performance);
			trendDate.push(jdata[i].date);
			Tval = Tval + jdata[i].availability;
			Pval = Pval + jdata[i].performance;
		}
		
		stopNum = TtrendVal.length;
		
		//get the average of values vs dates
		TtrendAv = Tval / jdata.length;
		PtrendAv = Pval / jdata.length;
		
		//Round it off
		TtrendAv = TtrendAv.toFixed(2);
		PtrendAv = PtrendAv.toFixed(2);	

		// Plug em into the table
		$('#'+localID+'-avail').text(TtrendAv);
		$('#'+localID+'-perf').text(PtrendAv);
		$('#'+localID+'-availtrend').sparkline(TtrendVal, {width: 150, lineColor: '#238C00', fillColor: '#B3FF99'});
		$('#'+localID+'-perftrend').sparkline(PtrendVal, {width: 150, lineColor: '#238C00', fillColor: '#B3FF99'});
		tagCells(localID, PtrendAv, TtrendAv);
		TtrendVal = [];
		PtrendVal = [];
		trendDate = [];
    }).fail(function(){
    	$('#'+localID+'-avail').text('No Data').css('font-size','0.8em').css('color','#F72D00');
		$('#'+localID+'-perf').text('No Data').css('font-size','0.7em').css('color','#F72D00');
		$('#'+localID+'-availtrend').text('No Data').css('font-size','0.7em').css('color','#F72D00');
		$('#'+localID+'-perftrend').text('No Data').css('font-size','0.7em').css('color','#F72D00');
    });		
}

function initTagButtons(){
	$('.theme-global-spark-link').click(function(){
		var thisLocal = $(this).attr('id');
		var thisSeq = $(this).attr('seq-loc');
		var thisDiv, celldataCall, dialogID;
		var confLoc = thisSeq.split(',')[0];
		var jLoc = thisSeq.split(',')[1];
		confLoc = parseInt(confLoc);
		jLoc = parseInt(jLoc);
		var chartDialog;
		
		if(thisLocal.indexOf('availtrend') > -1){
			chartDialog = $('<div id="'+thisLocal+'-avail-diag"><div class="kpi-row"><div id="kpi-1" class="kpi-box"><div class="kpi-title">Availability</div><div class="kpi-actual">.</div><div class="target-label">Target</div><div class="kpi-target fa fa-arrow-up">.</div><div class="clear-this"></div></div><div id="kpi-3" class="kpi-box"><div class="kpi-title">Performance</div><div class="kpi-actual">.</div><div class="target-label">Target</div><div class="kpi-target fa fa-arrow-down">.</div><div class="clear-this"></div></div><div class="clear-this"></div></div><div id="'+thisLocal+'-avail-chart"></div><div class="chart-button-row" id="chart-buttons"></div><div class="full-box"><div id="'+thisLocal+'-avail-chart-slide" class="full-bar"></div><div id="'+thisLocal+'-long-chart" class="full-chart"></div></div></div>');
			dialogID = thisLocal+'-avail-chart';
			//thisName = thisName + '  AVAILABILITY';
		}else if(thisLocal.indexOf('perftrend') > -1){
			chartDialog = $('<div id="'+thisLocal+'-perf-diag"><div class="kpi-row"><div id="kpi-1" class="kpi-box"><div class="kpi-title">Availability</div><div class="kpi-actual">.</div><div class="target-label">Target</div><div class="kpi-target fa fa-arrow-up">.</div><div class="clear-this"></div></div><div id="kpi-3" class="kpi-box"><div class="kpi-title">Performance</div><div class="kpi-actual">.</div><div class="target-label">Target</div><div class="kpi-target fa fa-arrow-down">.</div><div class="clear-this"></div></div><div class="clear-this"></div></div><div id="'+thisLocal+'-perf-chart"></div><div class="chart-button-row" id="chart-buttons"></div><div class="full-box"><div id="'+thisLocal+'-perf-chart-slide" class="full-bar"></div><div id="'+thisLocal+'-long-chart" class="full-chart"></div></div></div>');
			dialogID = thisLocal+'-perf-chart';
			//thisName = thisName + '  PERFORMANCE';
		}
		
		chartDialog.dialog({
			title: thisLocal,
            resizable: false,
            modal: true,
            width: 960,
            height: 560,
            close: function(click){
            	$(this).dialog('destroy');
            },
        });
		
		$.getJSON(dasConfig, function(confdata){
			thisDiv = confdata[confLoc].units;
			celldataCall = thisDiv[jLoc].dataURI;
			largeData(celldataCall, dialogID);
		});
	});	
	
	$('.btn-primary').click(function(){
		var thisID = $(this).attr('id');
		var miniWidth, miniHeight, whichType, miniDialogID;
		var miniDiag = $('<div id="'+thisID+'-diag"><div id="'+thisID+'-smallBox"></div></div>');
		var prettyStr = thisID.split('-').join(' ');
		prettyStr = prettyStr.toUpperCase();
		if (thisID.search('notes') > -1){
			miniWidth = 480;
			miniHeight = 420;
			whichType = 'notes';
		}else{
			miniWidth = 760;
			miniHeight = 420;
			whichType= 'trending';
		}
		
		miniDiag.dialog({
			title: prettyStr,
            resizable: false,
            modal: true,
            width: miniWidth,
            height: miniHeight,
            close: function(click){
            	$(this).dialog('destroy');
            },
        });
		
		miniDialogID = $(miniDiag).attr('ID');
		miniDialogs(miniDialogID, whichType);
	});
	
}

function largeData(dataChain, dialogID){
	var celldataCall = dataChain;
	var funcID = dialogID;
	var Tval = 0;
	var Pval = 0;
	var TtrendAv = 0;
	var PtrendAv = 0;
	var avTar = [];
	var avPer = [];
	var tTarget = 99.50;
	var pTarget = 4.00;
	var chartType;
	var altTrend;
	var altPerf;
	TtrendVal = [];
	PtrendVal = [];
	trendDate = [];
	
	$.getJSON(celldataCall, function(jldata) {
		//Parse data from the json values
		for (var i=0, len=jldata.length; i < len; i++) {
			TtrendVal.push(jldata[i].availability);
			PtrendVal.push(jldata[i].performance);
			trendDate.push(jldata[i].date);
			avTar.push(tTarget);
			avPer.push(pTarget);
			Tval = Tval + jldata[i].availability;
			Pval = Pval + jldata[i].performance;
		}
		
		//get the average of values vs dates
		TtrendAv = Tval / jldata.length;
		PtrendAv = Pval / jldata.length;
	
		//Round it off
		TtrendAv = TtrendAv.toFixed(2);
		PtrendAv = PtrendAv.toFixed(2);
		//alts
		altTrend = TtrendVal;
		altPerf = PtrendVal;
		if(funcID.indexOf('avail') > -1){
			chartType = "Availibility";
			bigChartDyn(TtrendVal, trendDate, TtrendAv, PtrendAv, avTar, chartType, funcID);
			buildButtons(altTrend, trendDate, avTar, funcID);
		}else if(funcID.indexOf('perf') > -1){
			chartType = "Performance";
			bigChartDyn(PtrendVal, trendDate, TtrendAv, PtrendAv, avPer, chartType, funcID);
			buildButtons(altPerf, trendDate, avPer, funcID);
		}
	});
}

function miniDialogs(miniDialogID, whichType){
	var thisType = whichType;
	var thisID = miniDialogID;
	var thisContent, tableType;
	if(thisType == 'notes'){
		thisContent = $('<div class="table-warning"><div class="table-header"><div class="table-caption">Notes</div></div><table class="table table-bordered" id="notes-table"><thead><tr><th>Date</th><th>Unit</th><th>Notes</th></tr></thead><tbody></tbody></table></div>');
		tableType = thisType+'-table';
	}
	else{
		thisContent = $('<div class="table-warning"><div class="table-header"><div class="table-caption">Year Trending</div></div><table class="table table-bordered" id="trending-table"><thead><tr><th>Quarter</th><th>Target Availability</th><th>Actual</th><th>Performance Target</th><th>Performance</th></tr></thead><tbody></tbody></table></div>');
		tableType = thisType+'-table';
	}
	
	$('#'+thisID).append(thisContent);
	
	tableBuild(tableType);
}

function tableBuild(dataType){
	var thisTableType = dataType;
	var numberNudge;
	for(var i = 0; i < 4; i++){
		if(thisTableType == 'notes-table'){
			$('#'+thisTableType+' tbody').append('<tr><td>9-30-2014</td><td>ATC</td><td>A Bunch of happy notes... A Bunch of happy notes... A Bunch of happy notes... A Bunch of happy notes... </td></tr>');
		}else{
			numberNudge = i + 1;
			$('#'+thisTableType+' tbody').append('<tr><td>Q'+numberNudge +'</td><td>.</td><td>.</td><td>.</td><td>.</td></tr>');
		}
	}
}	


function bigChart(TtrendVal, trendDate){
	var trendPush = TtrendVal;
	var trendDate = trendDate;
	$('#atc-avail-chart').wijlinechart({ 
		height: 270,
        header: { 
            text: ""
        }, 
       
        axis: { 
            y: { 
                text: "Percentages", 
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
                //Label shown in legend 
                label: "Availability", 
                data: { 
                    //X axis values as Date objects. We are using a shared x value array for this chart with multiple y value arrays. 
                    x: trendDate, 
                    //Y axis values for 1st series 
                    y: trendPush 
                } 
            } 
        ],
        seriesStyles: [ 
             { stroke: "#ED6412", "stroke-width": 1 }, 
             { stroke: "#00468C", "stroke-width": 1 } 
         ]
    });
	
	$('#atc-long-chart').wijlinechart({ 

        header: { 
            text: ""
        }, 
        showChartLabels: false,
        height: 40,
        axis: { 
            y: {
            	textVisible: false,
                text: "", 
            }, 
            x: {
            	textVisible: false,
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

	makeSlider(startNum, stopNum);
	
	$('#kpi-1 .kpi-actual').text('99.2%');
	$('#kpi-2 .kpi-actual').text('99.5%');
	$('#kpi-3 .kpi-actual').text('4.3ms');
	$('#kpi-1 .kpi-target').text(availTarget);
	$('#kpi-2 .kpi-target').text(availTarget);
	$('#kpi-3 .kpi-target').text(perfTarget);
}

function bigChart2(PtrendVal, trendDate){
	var perfPush = PtrendVal;
	var trendDate = trendDate;
		
	$('#atc-perf-chart').wijlinechart({ 

        header: { 
            text: ""
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
                    x: trendDate, 
                    y: perfPush 
                } 
            } 
        ],
        seriesStyles: [{ 
            stroke: "#1D70A7"
        }] 
    }); 
}

function bigChartDyn(TrendVal, trendDate, TtrendAv, PtrendAv, theTarget, chartType, diagID){
	var trendPush = TrendVal;
	var trendDate = trendDate;
	var thisChart = chartType;
	var availAv = TtrendAv;
	var perAv = PtrendAv;
	var targeted = theTarget;
	var localDiagID = diagID;
	var starter = 0;
	var stopper = targeted.length;
	$('#'+localDiagID).wijlinechart({ 
		height: 270,
        header: { 
            text: ""
        }, 
       
        axis: { 
            y: { 
                text: "Values", 
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
                //Label shown in legend 
                label: thisChart, 
                data: { 
                    //X axis values as Date objects. We are using a shared x value array for this chart with multiple y value arrays. 
                    x: trendDate, 
                    //Y axis values for 1st series 
                    y: trendPush 
                } 
            },
            { 
                //Label shown in legend 
                label: "Target", 
                data: { 
                    //X axis values as Date objects. We are using a shared x value array for this chart with multiple y value arrays. 
                    x: trendDate, 
                    //Y axis values for 1st series 
                    y: targeted
                } 
            },
            
        ],
        seriesStyles: [ 
           { stroke: "#ED6412", "stroke-width": 1 }, 
           { stroke: "#00468C", "stroke-width": 1 } 
       ]
    });
	$('#kpi-1 .kpi-actual').text('99.2%');
	$('#kpi-2 .kpi-actual').text('99.5%');
	$('#kpi-3 .kpi-actual').text('4.3ms');
	$('#kpi-1 .kpi-target').text(availTarget);
	$('#kpi-2 .kpi-target').text(availTarget);
	$('#kpi-3 .kpi-target').text(perfTarget);
	makeSlider(starter, stopper, trendPush, trendDate, targeted, localDiagID);
	TtrendVal = [];
	PtrendVal = [];
	trendDate = [];
}
function makeSlider(startNum, stopNum, ATCtrendVal, trendDate, trendTarget, funcID){
	var thisID = funcID;
	var thisStart = startNum;
	var thisStop = stopNum;
	var thisVal = ATCtrendVal;
	var thisDate = trendDate;
	var targeted = trendTarget;
	$('#'+thisID+'-slide').wijslider({
		orientation: "horizontal",
		dragFill: true,
		range: true, 
		min: thisStart, 
		max: thisStop, 
		step: 1, 
		values: [thisStart, thisStop],
		stop: function(event, ui){
			thisStart = ui.values[0];
			thisStop = ui.values[1];
			reDoChart(thisStart, thisStop, thisVal, thisDate, targeted, thisID);
		},
		buttonClick: function(event, ui){
			thisStart = ui.values[0];
			thisStop = ui.values[1];
			reDoChart(thisStart, thisStop, thisVal, thisDate, targeted, thisID);
		}
	});	
}


function reDoChart(startNum, stopNum, ATCtrendVal, trendDate, trendTarget, funcID){
	var starter = startNum;
	var stopper = stopNum;
	var trendPush = ATCtrendVal;
	var trendDate = trendDate;
	var thisChart = funcID;
	var thisTarget = trendTarget;
	trendPush = trendPush.slice(starter, stopper);
	trendDate = trendDate.slice(starter, stopper);
	thisTarget = thisTarget.slice(starter, stopper);

	$('#'+thisChart).wijlinechart({
			seriesList: [{
				label: "Availability", 
                data: {x: trendDate, y: trendPush}
		    },{
				label: "Target", 
                data: {x: trendDate, y: thisTarget}
		    }],
		    seriesStyles: [ 
                { stroke: "#ED6412", "stroke-width": 1 }, 
                { stroke: "#00468C", "stroke-width": 1 } 
            ] 
	});
}

function tagCells(chainedID, PtrendAv, TtrendAV){
	var localID = chainedID;
	//Tag the Perf cell
	switch (true) {
		case (PtrendAv <= 4.00):
			Ptag = '#1DFF00';
			$('#'+localID+'-perf').parent().css('background-color', Ptag);
			$('#'+localID+'atc-perf').css('color', '#555');
			break;
		case (PtrendAv > 4.00 && PtrendAv <= 8.00):
			Ptag = '#F9B916';
			$('#'+localID+'-perf').parent().css('background-color', Ptag);
			$('#'+localID+'-perf').css('color', '#555');
			break;
		case (PtrendAv > 8.00):
			Ptag = '#F72D00';
			$('#'+localID+'-perf').css('color','#EFEFEF').parent().css('background-color', Ptag);
			$('#'+localID+'-perf').css('color', '#EFEFEF');
			break;
		default:
			// Yarp
			break;
	}
	
	//Tag the Availabilty cell
	switch (true) {
		case (TtrendAV >= 99.55):
			Ttag = '#1DFF00';
			$('#'+localID+'-avail').parent().css('background-color', Ttag);
			$('#'+localID+'-avail').css('color', '#555');
			break;
		case (TtrendAV >= 99.50 && TtrendAV < 99.55):
			Ttag = '#F9B916';
			$('#'+localID+'-avail').parent().css('background-color', Ttag);
			$('#'+localID+'-avail').css('color', '#555');
			break;
		case (TtrendAV < 99.50):
			Ttag = '#F72D00';
			$('#'+localID+'-avail').css('color', '#EFEFEF').parent().css('background-color', Ttag);
			$('#'+localID+'-avail').css('color','#EFEFEF').next().css('color', '#EFEFEF');
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
        height: 150,
        width: 150,
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
        height: 150,
        width: 150,
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
	var newVal3 = Math.random() * (4.5 - 4) + 4;
	newVal1 = newVal1.toFixed(2);
	newVal2 = newVal2.toFixed(2);
	newVal3 = newVal3.toFixed(2);
	$('#perf-chart').wijradialgauge('option', 'value', newVal1);
	$('#perf-chart2').wijradialgauge('option', 'value', newVal2);
}


//Navigation
function buildout(button){
	var thisBttn = button;
	var tableRow;
	var truncTableRow;
	var tableContent;
	var colSize;
	
	$('#content-row-table').empty();
	$('#main-menu-buttons').children().removeClass('active');
	
	switch (thisBttn){
		case 'menu-link-digitalMedia':
			tableRow = "  Digital Media";
			colSize = 12;
			$('#'+thisBttn).parent().addClass('active');
			$('#page-header-title').text(tableRow);
			break;
		case 'menu-link-software':
			tableRow = "  Software Division";
			colSize = 12;
			$('#'+thisBttn).parent().addClass('active');
			$('#page-header-title').text(tableRow);
			break;
		case 'menu-link-enterprise':
			tableRow = "  Enterprise Division";
			colSize = 12;
			$('#'+thisBttn).parent().addClass('active');
			$('#page-header-title').text(tableRow);
			break;
		case 'menu-link-issues':
			tableRow = "  Issues Summary";
			colSize = 12;
			$('#'+thisBttn).parent().addClass('active');
			$('#page-header-title').text(tableRow);
			break;
	}
	
	truncTableRow = tableRow.split(' ').join('');
	//Build table
	tableContent = '<div class="col-md-'+ colSize +'"><div class="table-primary"> \
	<div class="table-header clearfix"> \
	<div class="table-caption">'+ tableRow +' Monthly Summary</div> \
	<div class="DT-lf-right"><div class="DT-per-page"><label>Date Range&nbsp;</label><select name="jq-datatables-example_length" aria-controls="jq-datatables-example" class="form-control input-sm"><option value="" selected>Select</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option></select></div></div></div> \
	<table class="table table-bordered" id="'+truncTableRow+'-table"> \
	<thead><tr><th>ATG'+tableRow+'</th><th>Target</th><th>Availability</th><th>Avail Trend</th><th>Target</th><th>Performance</th><th>Perf Trend</th><th>Notes</th><th>Trending</th></tr></thead> \
	<tbody></tbody> \
	</table> \
	</div></div>';
	$('#content-row-table').append(tableContent);
	
	selectedTab(truncTableRow);
}

//Select chart range.
function chartRanger(Tval, trendDate, trendTarget, funcID){
	$('#chart-buttons li').click(function(){
		var thisCartButton = $(this).attr('id');
		var startNum, stopNum;
		var thisTrend = Tval;
		var thisDate = trendDate;
		var thisTarget = trendTarget;
		var thisChart = funcID;
		switch (thisCartButton){
			case 'chart-weekly':
				startNum = 0;
				stopNum = 7;
				reDoChart(startNum, stopNum, thisTrend, thisDate, thisTarget, thisChart);
				break;
			case 'chart-daily':
				startNum = 0;
				stopNum = thisTrend.length;
				reDoChart(startNum, stopNum, thisTrend, thisDate, thisTarget, thisChart);
				break;
		
		}
	}).hover(function(){
			$(this).addClass('bttnSelected');
		}, function(){
			$(this).removeClass('bttnSelected');
		
	});
}

//Chart Buttons
function buildButtons(newTrend, trendDate, newTarget, funcID){
	var thisVal = newTrend;
	var thisDate = trendDate;
	var thisTarget = newTarget;
	var thisChart = funcID;
	$('#chart-buttons').append('<ul><li id="chart-weekly">1 w</li><li id="chart-daily">1 m</li><li id="chart-quaterly">3 m</li><li id="chart-simi">6 m</li><li id="chart-year">1 y</li></ul>');
	chartRanger(thisVal, thisDate, thisTarget, thisChart);
}

$('.navigation li a').click(function(){
	var linkBttn = $(this).attr('id');
	buildout(linkBttn);
});