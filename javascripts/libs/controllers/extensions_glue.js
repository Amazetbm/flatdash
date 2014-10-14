//var jsonData = "assets/json/mockdata.json";
var dasConfig = "assets/json/config.json";
var initVars;
var tableVars;
var buttonVars;
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
					$('#'+currentID+' tbody').append('<tr><td>'+cellName+'</td><td>'+cellTTarget+'</td><td><span id="'+IDTag+'-avail"></span></td><td><span id="'+IDTag+'-avSign"></span></td><td class="sparkCell"><span id="'+IDTag+'-availtrend" class="theme-global-spark-link"  seq-loc="'+i+','+j+'"></span></td><td>'+cellPTarget+'</td><td><span id="'+IDTag+'-perf"></span></td><td><span id="'+IDTag+'-prfSign"></span></td><td class="sparkCel"><span id="'+IDTag+'-perftrend" class="theme-global-spark-link"  seq-loc="'+i+','+j+'"></span></td><td class="cellNudge"><button class="btn btn-outline btn-xs btn-labeled btn-primary" seq-loc="'+i+','+j+'" id="'+IDTag+'-notes"><span class="btn-label icon fa  fa-files-o"></span>Notes</button></td><td class="cellNudge"><button class="btn btn-outline btn-xs btn-labeled btn-primary" seq-loc="'+i+','+j+'" id="'+IDTag+'-trends"><span class="btn-label icon fa fa-bar-chart-o"></span>Qtr View</button></td></tr>');
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

	$('.btn-primary').click(function(){
		var thisID = $(this).attr('id');
		var miniWidth, miniHeight, whichType, miniDialogID;
		var miniDiag = $('<div id="'+thisID+'-diag"><div id="'+thisID+'-smallBox"></div></div>');
		var prettyStr = thisID.split('-').join(' ');
		if (thisID.search('notes') > -1){
			miniWidth = 760;
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
		var thisDiv, celldataCall, trendDataCall, notesDataCall, dialogID, longID;
		var confLoc = thisSeq.split(',')[0];
		var jLoc = thisSeq.split(',')[1];
		confLoc = parseInt(confLoc);
		jLoc = parseInt(jLoc);
		var chartDialog;
		var thisMarquee;
		
		if(thisLocal.indexOf('availtrend') > -1){
			thisMarquee = thisLocal.split('-availtrend')[0];
			thisMarquee = thisMarquee.split('-').join(' ');
			thisMarquee = thisMarquee.toUpperCase();
			chartDialog = $('<div id="'+thisLocal+'-avail-diag"><div class="kpi-row"><div id="kpi-1" class="kpi-box"><div class="kpi-title">Availability</div><div class="kpi-actual">.</div><div class="kpi-indicator fa fa-arrow-up"></div><div class="target-label">Target</div><div class="kpi-target">.</div><div class="clear-this"></div></div><div id="kpi-3" class="kpi-box"><div class="kpi-title">Performance</div><div class="kpi-actual">.</div><div class="kpi-indicator fa fa-arrow-down"></div><div class="target-label">Target</div><div class="kpi-target">.</div><div class="clear-this"></div></div><div id="avail-gauge"class="kpi-gauge">.</div><div id="perf-gauge"class="kpi-gauge">.</div><div class="clear-this"></div></div><div id="'+thisLocal+'-avail-chart"></div><div id="'+thisLocal+'-long-chart" class="full-chart"></div><div class="full-box"><div id="'+thisLocal+'-avail-chart-slide" class="full-bar"></div></div><div class="chart-button-row" id="chart-buttons"></div></div>');
			dialogID = thisLocal+'-avail-chart';
			longID = thisLocal+'-long-chart';
			//thisName = thisName + '  AVAILABILITY';
		}else if(thisLocal.indexOf('perftrend') > -1){
			thisMarquee = thisLocal.split('-perftrend')[0];
			thisMarquee = thisMarquee.split('-').join(' ');
			thisMarquee = thisMarquee.toUpperCase();
			chartDialog = $('<div id="'+thisLocal+'-perf-diag"><div class="kpi-row"><div id="kpi-1" class="kpi-box"><div class="kpi-title">Availability</div><div class="kpi-actual">.</div><div class="kpi-indicator fa fa-arrow-up"></div><div class="target-label">Target</div><div class="kpi-target">.</div><div class="clear-this"></div></div><div id="kpi-3" class="kpi-box"><div class="kpi-title">Performance</div><div class="kpi-actual">.</div><div class="kpi-indicator fa fa-arrow-down"></div><div class="target-label">Target</div><div class="kpi-target">.</div><div class="clear-this"></div></div><div id="avail-gauge" class="kpi-gauge">.</div><div id="perf-gauge"class="kpi-gauge">.</div><div class="clear-this"></div></div><div id="'+thisLocal+'-perf-chart"></div><div id="'+thisLocal+'-long-chart" class="full-chart"></div><div class="full-box"><div id="'+thisLocal+'-perf-chart-slide" class="full-bar"></div></div><div class="chart-button-row" id="chart-buttons"></div></div>');
			dialogID = thisLocal+'-perf-chart';
			longID = thisLocal+'-long-chart';
			//thisName = thisName + '  PERFORMANCE';
		}
		
		chartDialog.dialog({
			title: thisMarquee,
            resizable: false,
            modal: true,
            width: 960,
            height: 660,
            close: function(click){
            	$(this).dialog('destroy');
            },
        });
		
		$.getJSON(dasConfig, function(confdata){
			thisDiv = confdata[confLoc].units;
			celldataCall = thisDiv[jLoc].dataURI;
			largeData(celldataCall, dialogID, longID);
		});
	});	
	
	$('.btn-primary').click(function(){
		var thisID = $(this).attr('id');
		var thisSeq = $(this).attr('seq-loc');
		var miniWidth, miniHeight, whichType, miniDialogID;
		var miniDiag = $('<div id="'+thisID+'-diag"><div id="'+thisID+'-smallBox"></div></div>');
		var prettyStr = thisID.split('-').join(' ');
		prettyStr = prettyStr.toUpperCase();
		if (thisID.search('notes') > -1){
			miniWidth = 680;
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
		miniDialogs(miniDialogID, whichType, thisID, thisSeq);
	});
	
}

function largeData(dataChain, dialogID, longID){
	var celldataCall = dataChain;
	var funcID = dialogID;
	var barID = longID;
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
			bigChartDyn(TtrendVal, trendDate, TtrendAv, PtrendAv, avTar, chartType, funcID, barID);
			buildButtons(altTrend, trendDate, avTar, funcID);
			loadPies(TtrendAv, PtrendAv);
		}else if(funcID.indexOf('perf') > -1){
			chartType = "Performance";
			bigChartDyn(PtrendVal, trendDate, TtrendAv, PtrendAv, avPer, chartType, funcID, barID);
			buildButtons(altPerf, trendDate, avPer, funcID);
			loadPies(TtrendAv, PtrendAv);
		}
	});
}

function miniDialogs(miniDialogID, whichType, typeID, thisSeq){
	var thisType = whichType;
	var thisID = miniDialogID;
	var thisContent, tableType;
	var thisTypeID = typeID;
	var sequence = thisSeq;
	if(thisType == 'notes'){
		thisContent = $('<div class="table-warning"><div class="table-header"><div class="table-caption">Notes</div></div><table class="table table-bordered" id="notes-table"><thead><tr><th>Date</th><th>Unit</th><th>Notes</th></tr></thead><tbody></tbody></table></div>');
		tableType = thisType+'-table';
	}
	else{
		thisContent = $('<div class="table-warning"><div class="table-header"><div class="table-caption">Year Trending</div></div><table class="table table-bordered" id="trending-table"><thead><tr><th>Quarter</th><th>Target Availability</th><th>Actual</th><th>Performance Target</th><th>Performance</th></tr></thead><tbody></tbody></table></div>');
		tableType = thisType+'-table';
	}
	
	$('#'+thisID).append(thisContent);
	
	tableBuild(tableType, thisID, thisTypeID, sequence);
}

function tableBuild(dataType, whichID, typeID, thisSeq){
	var thisTableType = dataType;
	var thisID = whichID;
	var thisTypeID = typeID;
	var curSeq = thisSeq;
	var numberNudge, theName, atarget, ptarget;
	var confLoc = curSeq.split(',')[0];
	var jLoc = curSeq.split(',')[1];
	confLoc = parseInt(confLoc);
	jLoc = parseInt(jLoc);
	thisTypeID = thisTypeID.split('-notes')[0];

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
	
	$.getJSON(dasConfig, function(confdata){
		thisDiv = confdata[confLoc].units;
		trendDataCall = thisDiv[jLoc].trendingURI;
		notesDataCall = thisDiv[jLoc].notesURI;
		theName = thisDiv[jLoc].name;
		atarget = thisDiv[jLoc].availTarget;
		ptarget = thisDiv[jLoc].perfTarget;
		
		buildMiniTables(theName, thisTableType, atarget, ptarget, trendDataCall, notesDataCall);
	});
}	

function buildMiniTables(theName, tableType, availtarget, perftarget, trending, notes){
	var currName = theName;
	var theTable = tableType;
	var theTrend = trending;
	var theNotes = notes;
	var atarget = availtarget;
	var ptarget = perftarget;
	
	if(theTable == 'notes-table'){
		$.getJSON(theNotes, function(jdata){
			for (var i=0, len=jdata.length; i < len; i++) {
				var theUnit = jdata[i].unit;
				var theDate = jdata[i].modified_date;
				var theNote = jdata[i].message;
				$('#'+theTable+' tbody').append('<tr><td>'+theDate+'</td><td>'+theUnit+'</td><td>'+theNote+'</td></tr>');
			}
		}).fail(function(){
			console.log('error');
		});
	}else{
		$.getJSON(theTrend, function(jdata){
			for (var i=0, len=jdata.length; i < len; i++) {
				var numberNudge = i + 1;
				var avail = jdata[i].availability; 
				var perf = jdata[i].performance; 
				avail = avail.toFixed(2);
				perf = perf.toFixed(2);
				$('#'+theTable+' tbody').append('<tr><td>Q'+numberNudge +'</td><td>'+atarget+'</td><td>'+avail+'</td><td>'+ptarget+'</td><td>'+perf+'</td></tr>');
			}
		}).fail(function(){
			console.log('error');
		});
	}
}

function bigChartDyn(TrendVal, trendDate, TtrendAv, PtrendAv, theTarget, chartType, diagID, longID){
	var trendPush = TrendVal;
	var trendDate = trendDate;
	var thisChart = chartType;
	var availAv = TtrendAv;
	var perAv = PtrendAv;
	var targeted = theTarget;
	var localDiagID = diagID;
	var localBarID = longID;
	var starter = 0;
	var stopper = targeted.length;
	$('#'+localDiagID).wijcompositechart({ 
		height: 270,
        header: { 
            text: ""
        }, 
       
        axis: { 
            y: { 
                text: thisChart, 
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
            	type: "area",
                label: thisChart, 
                data: {  
                    x: trendDate, 
                    y: trendPush 
                } 
            },
            { 

            	type: "line",
                label: "Target", 
                data: { 
                    x: trendDate, 
                    y: targeted
                } 
            },
            
        ],
        seriesStyles: [ 
           { stroke: "#ED6412", "stroke-width": 1, fill: "#ED6412", "fill-opacity": 0.2}, 
           { stroke: "#00468C", "stroke-width": 2 } 
       ], 
       
    });
	
	//For small chart
	$('#'+localBarID).wijlinechart({ 
		type: "area",
		height: 90,
        header: { 
            text: ""
        }, 
       
        axis: { 
            y: {
            	textVisible:false
            }, 
            x: {
            	textVisible:false
            } 
        }, 
        showChartLabels: false, 
        legend: { 
            visible: false
        }, 
        seriesList: [ 
            { 
            	type: "area",
                label: "", 
                data: {  
                    x: trendDate, 
                    y: trendPush 
                } 
            }
        ],
        seriesStyles: [ 
           { stroke: "#ED6412", "stroke-width": 1, fill: "#ED6412", "fill-opacity": 0.2}
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

	$('#'+thisChart).wijcompositechart({
			seriesList: [{
				type: "area",
				label: "Values", 
                data: {x: trendDate, y: trendPush}
		    },{
		    	type: "line",
				label: "Target", 
                data: {x: trendDate, y: thisTarget}
		    }],
		    seriesStyles: [ 
                { stroke: "#ED6412", "stroke-width": 1, fill: "#ED6412", "fill-opacity": 0.2}, 
                { stroke: "#00468C", "stroke-width": 2 } 
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
			$('#'+localID+'-perf').css('color', '#555');
			$('#'+localID+'-prfSign').addClass('fa').addClass('fa-check');
			break;
		case (PtrendAv > 4.00 && PtrendAv <= 8.00):
			Ptag = '#F9B916';
			$('#'+localID+'-perf').parent().css('background-color', Ptag);
			$('#'+localID+'-perf').css('color', '#555');
			$('#'+localID+'-prfSign').addClass('fa').addClass('fa-circle');
			break;
		case (PtrendAv > 8.00):
			Ptag = '#F72D00';
			$('#'+localID+'-perf').css('color','#EFEFEF').parent().css('background-color', Ptag);
			$('#'+localID+'-perf').css('color', '#EFEFEF');
			$('#'+localID+'-prfSign').addClass('fa').addClass('fa-warning');
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
			$('#'+localID+'-avSign').addClass('fa').addClass('fa-check');
			break;
		case (TtrendAV >= 99.50 && TtrendAV < 99.55):
			Ttag = '#F9B916';
			$('#'+localID+'-avail').parent().css('background-color', Ttag);
			$('#'+localID+'-avail').css('color', '#555');
			$('#'+localID+'-avSign').addClass('fa').addClass('fa-circle');
			break;
		case (TtrendAV < 99.50):
			Ttag = '#F72D00';
			$('#'+localID+'-avail').css('color', '#EFEFEF').parent().css('background-color', Ttag);
			$('#'+localID+'-avail').css('color','#EFEFEF').next().css('color', '#EFEFEF');
			$('#'+localID+'-avSign').addClass('fa').addClass('fa-warning');
			break;
		default:
			// Smile and wave
			break;
	}
}

function loadPies(val, perf){
	var actual = val;
	var thePerf = perf;
	//Pie charts. Highly customizable
	$('#avail-gauge').wijradialgauge({ 
        value: actual, 
        max: 100, 
        min: 0,
        height: 100,
        width: 100,
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
	
	$('#perf-gauge').wijradialgauge({ 
        value: thePerf, 
        max: 8, 
        min: 0,
        height: 100,
        width: 100,
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
            interval: 1, 
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
            interval: 2, 
            visible: true
        }, 
        ranges: [ 
        { 
            startWidth: 3, 
            endWidth: 3, 
            startValue: 5, 
            endValue: 8, 
            startDistance: 0.6, 
            endDistance: 0.58, 
            style: { 
                fill: "#F72D00", 
                stroke: "#F72D00C", 
                "stroke-width": 0 
            } 
        }, 
        { 
            startWidth: 3, 
            endWidth: 3, 
            startValue: 3, 
            endValue: 5, 
            startDistance: 0.58, 
            endDistance: 0.54, 
            style: { 
                fill: "0-#EBF700-#F79C00", 
                stroke: "#FFFFFF", 
                "stroke-width": 0 
            } 
        }, 
        { 
            startWidth: 3, 
            endWidth: 3, 
            startValue: 0, 
            endValue: 3, 
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
	<div class="DT-lf-right"><div class="DT-per-page"><label for="from">Date Range From:&nbsp;</label><input type="text" class="dater" id="from" name="from"><label for="to">&nbsp;To:&nbsp;</label><input type="text" class="dater" id="to" name="to"></div></div></div> \
	<table class="table table-bordered" id="'+truncTableRow+'-table"> \
	<thead><tr><th>ATG'+tableRow+'</th><th>Target</th><th>Availability</th><th>&nbsp;</th><th>Avail Trend</th><th>Target</th><th>Performance</th><th>&nbsp;</th><th>Perf Trend</th><th>Notes</th><th>Trending</th></tr></thead> \
	<tbody></tbody> \
	</table> \
	</div></div>';
	$('#content-row-table').append(tableContent);
	
	selectedTab(truncTableRow);
	dateRanger();
}

function dateRanger(){
	$('#from').datepicker({
		showButtonPanel: true,
		dateFormat: 'mm/dd/yyyy',
	}).on('changeDate', function(selectedDate){
		var theDater = new Date(selectedDate.date);
		console.log(theDater);
		$('#from').val(selectedDate);
		$(this).datepicker( "option", "minDate", selectedDate );
        $(this).blur();
        $('.datepicker').hide();
    });
	
    $('#to').datepicker({
    	dateFormat: 'yy-mm-dd'
    }).on('changeDate', function(selectedDate){
    	$('#to').val(selectedDate);
    	$(this).datepicker( "option", "maxDate", selectedDate );
        $(this).blur();
        $('.datepicker').hide();
    });
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
				//makeSlider(startNum, stopNum, thisTrend, thisDate, thisTarget, thisChart);
				break;
			case 'chart-daily':
				startNum = 0;
				stopNum = thisTrend.length;
				reDoChart(startNum, stopNum, thisTrend, thisDate, thisTarget, thisChart);
				//makeSlider(startNum, stopNum, thisTrend, thisDate, thisTarget, thisChart);
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