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

Date.prototype.format = function(format) {
    var returnStr = '';
    var replace = Date.replaceChars;
    for (var i = 0; i < format.length; i++) {       var curChar = format.charAt(i);         if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
            returnStr += curChar;
        }
        else if (replace[curChar]) {
            returnStr += replace[curChar].call(this);
        } else if (curChar != "\\"){
            returnStr += curChar;
        }
    }
    return returnStr;
};

Date.replaceChars = {
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    // Day
    d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
    D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
    j: function() { return this.getDate(); },
    l: function() { return Date.replaceChars.longDays[this.getDay()]; },
    N: function() { return this.getDay() + 1; },
    S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
    w: function() { return this.getDay(); },
    z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
    // Week
    W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
    // Month
    F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
    m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
    M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
    n: function() { return this.getMonth() + 1; },
    t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
    // Year
    L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
    o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
    Y: function() { return this.getFullYear(); },
    y: function() { return ('' + this.getFullYear()).substr(2); },
    // Time
    a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
    A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
    B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
    g: function() { return this.getHours() % 12 || 12; },
    G: function() { return this.getHours(); },
    h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
    H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
    i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
    s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
    u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?
'0' : '')) + m; },
    // Timezone
    e: function() { return "Not Yet Supported"; },
    I: function() {
        var DST = null;
            for (var i = 0; i < 12; ++i) {
                    var d = new Date(this.getFullYear(), i, 1);
                    var offset = d.getTimezoneOffset();

                    if (DST === null) DST = offset;
                    else if (offset < DST) { DST = offset; break; }                     else if (offset > DST) break;
            }
            return (this.getTimezoneOffset() == DST) | 0;
        },
    O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
    P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
    T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
    Z: function() { return -this.getTimezoneOffset() * 60; },
    // Full Date/Time
    c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
    r: function() { return this.toString(); },
    U: function() { return this.getTime() / 1000; }
};

function initApp(){
	var initButton = 'menu-link-digitalMedia';
	buildout(initButton);
}

function selectedTab(tabID, queryFrom, queryTo){
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
	var fromThis = queryFrom;
	var toThis = queryTo;

	if (thisID.startsWith('Digital')){
		tableVars = 'Digital_Media';
		buildTables(thisID, tableVars, fromThis, toThis);
	}else if(thisID.startsWith('Software')){
		tableVars = 'Software';
		buildTables(thisID, tableVars, fromThis, toThis);
	}else if(thisID.startsWith('Enterprise')){
		tableVars = 'Enterprise';
		buildTables(thisID, tableVars, fromThis, toThis);
	}else if(thisID.startsWith('Issues')){
		tableVars = 'Issues';
		buildTables(thisID, tableVars, fromThis, toThis);
	}
}

function buildTables(tableID, VarID, queryFrom, queryTo){
	var currentID = tableID;
	var currentTable = VarID;
	var divVar, thisDiv;
	var cellName;
	var cellTTarget;
	var cellPTarget;
	var IDTag;
	var celldataCall;
	var fromThis = queryFrom;
	var toThis = queryTo;
	//Checks strings from the current ID
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
		for (var i=0, len=confdata.length; i < len; i++){
			divVar = confdata[i].division;
			if (divVar == currentTable){
				thisDiv = confdata[i].units;
				for(var j=0, jlen=thisDiv.length; j < jlen; j++){
					if(currentID.startsWith('Issues')){
						cellName = thisDiv[j].name;
						celldataCall = thisDiv[j].notesURI;
						celldataCall = celldataCall.replace('fromThis', fromThis);
						celldataCall = celldataCall.replace('toThis', toThis);
						//Make it happen
						IDTag = cellName.toLowerCase();
						IDTag = IDTag.split(' ').join('-');
						stuffNotes(currentID, celldataCall, fromThis, toThis);
					}else{
						cellName = thisDiv[j].name;
						cellTTarget = thisDiv[j].availTarget;
						cellPTarget = thisDiv[j].perfTarget;
						celldataCall = thisDiv[j].dataURI;
						celldataCall = celldataCall.replace('fromThis', fromThis);
						celldataCall = celldataCall.replace('toThis', toThis);
						//Make it happen
						IDTag = cellName.toLowerCase();
						IDTag = IDTag.split(' ').join('-');
						$('#'+currentID+' tbody').append('<tr><td>'+cellName+'</td><td id="'+IDTag+'-avail-target">'+cellTTarget+'</td><td><span id="'+IDTag+'-avail"></span></td><td><span id="'+IDTag+'-avSign"></span></td><td class="sparkCell"><span id="'+IDTag+'-availtrend" class="theme-global-spark-link"  seq-loc="'+i+','+j+'"></span></td><td id="'+IDTag+'-perf-target">'+cellPTarget+'</td><td><span id="'+IDTag+'-perf"></span></td><td><span id="'+IDTag+'-prfSign"></span></td><td class="sparkCel"><span id="'+IDTag+'-perftrend" class="theme-global-spark-link"  seq-loc="'+i+','+j+'"></span></td><td class="cellNudge"><button class="btn btn-outline btn-xs btn-labeled btn-primary" seq-loc="'+i+','+j+'" id="'+IDTag+'-notes"><span class="btn-label icon fa  fa-files-o"></span>Notes</button></td><td class="cellNudge"><button class="btn btn-outline btn-xs btn-labeled btn-primary" seq-loc="'+i+','+j+'" id="'+IDTag+'-trends"><span class="btn-label icon fa fa-bar-chart-o"></span>Qtr View</button></td></tr>');
						loadSparkDyn(IDTag, celldataCall);
					}
				}				
			}
		}
		initTagButtons(fromThis, toThis);
	});	
}

function stuffNotes(dataID, theURI, fromQuery, toQuery){
	var currentID = dataID;
	var notesURI = theURI;
	var fromThis = fromQuery;
	var toThis = toQuery;

	$.getJSON(notesURI, function(jdata){
		for (var i=0, len=jdata.length; i < len; i++) {
			var theUnit = jdata[i].company;
			var theDate = jdata[i].opened_at;
			var theNote = jdata[i].description;
			var dateTimer = new Date(theDate);
			if(!theUnit){
				theUnit = 'General';
			}
			dateTimer = dateTimer.format('M d, Y');
			$('#'+currentID+' tbody').append('<tr><td>'+dateTimer+'</td><td>'+theUnit+'</td><td>'+theNote+'</td></tr>');
		}
	}).fail(function(){
		console.log('error');
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
		if(TtrendVal == '' || TtrendVal == null){
			$('#'+localID+'-avail').text('No Data').css('font-size','0.8em').css('color','#F72D00');
			$('#'+localID+'-perf').text('No Data').css('font-size','0.7em').css('color','#F72D00');
			$('#'+localID+'-availtrend').text('No Data').css('font-size','0.7em').css('color','#F72D00');
			$('#'+localID+'-perftrend').text('No Data').css('font-size','0.7em').css('color','#F72D00');
		}else{
			$('#'+localID+'-avail').text(TtrendAv);
			$('#'+localID+'-perf').text(PtrendAv);
			$('#'+localID+'-availtrend').sparkline(TtrendVal, {width: 130, lineColor: '#238C00', fillColor: '#B3FF99'});
			$('#'+localID+'-perftrend').sparkline(PtrendVal, {width: 130, lineColor: '#238C00', fillColor: '#B3FF99'});
			tagCells(localID, PtrendAv, TtrendAv);
			TtrendVal = [];
			PtrendVal = [];
			trendDate = [];
		}
    }).fail(function(){
    	$('#'+localID+'-avail').text('No Data').css('font-size','0.8em').css('color','#F72D00');
		$('#'+localID+'-perf').text('No Data').css('font-size','0.7em').css('color','#F72D00');
		$('#'+localID+'-availtrend').text('No Data').css('font-size','0.7em').css('color','#F72D00');
		$('#'+localID+'-perftrend').text('No Data').css('font-size','0.7em').css('color','#F72D00');
    });		
}

function initTagButtons(fromQuery, toQuery){
	var fromThis = fromQuery;
	var toThis = toQuery;
	
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
		var fromThis = fromQuery;
		var toThis = toQuery;
		var past = new Date(fromThis);
		var today = new Date(toThis);
		var dd = today.getDate()+1;
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		var p_dd = past.getDate()+1;
		var p_mm = past.getMonth()+1;
		var p_yyyy = past.getFullYear();
		var queryTo, queryFrom, thisMonth, pastMonth;
		var availTar, perfTar;
		if(dd<10) {
		    dd='0'+dd;
		} 

		if(mm<10) {
		    mm='0'+mm;
		}
		if(p_dd<10) {
		    p_dd='0'+p_dd;
		} 

		if(p_mm<10) {
		    p_mm='0'+p_mm;
		} 
		
		var todayRe = new Date(mm+'/'+dd+'/'+yyyy);
		var pastRe = new Date(p_mm+'/'+p_dd+'/'+p_yyyy);
		
		thisMonth = todayRe.format('M d, Y');
		pastMonth = pastRe.format('M d, Y');
		queryFrom = pastRe.format('yyyy-mm-dd');
		queryTo = todayRe.format('yyyy-mm-dd');
		if(thisLocal.indexOf('availtrend') > -1){
			thisMarquee = thisLocal.split('-availtrend')[0];
			thisMarquee = thisMarquee.split('-').join(' ');
			thisMarquee = thisMarquee.toUpperCase();
			chartDialog = $('<div class="noDialog"><div class="thisMarquee">'+thisMarquee+' AVAILABILITY</div><div class="closer"><button id="closeChart" class="btn btn-outline btn-xs btn-labeled btn-primary"><span class="btn-label icon fa fa-times-circle-o"></span>Close</button></div><div class="clear-this"></div></div><div id="'+thisLocal+'-avail-diag"><div class="chart-date-row">Base date range: <span id="fromThis">'+pastMonth+'</span> - <span id="toThis">'+thisMonth+'</span></div><div class="kpi-row"><div id="kpi-1" class="kpi-box"><div id="kpi-avail-overlay"></div><div class="kpi-data-wrap"><div class="kpi-title">Availability</div><div class="kpi-actual">.</div><div class="kpi-indicator fa fa-arrow-up"></div><div class="target-label">Target</div><div class="kpi-target">.</div><div class="clear-this"></div></div><div class="kpi-gauge-wrap"><div id="avail-gauge"class="kpi-gauge">.</div><div class="clear-this"></div></div><div class="clear-this"></div></div><div id="kpi-3" class="kpi-box"><div id="kpi-perf-overlay"></div><div class="kpi-data-wrap"><div class="kpi-title">Performance</div><div class="kpi-actual">.</div><div class="kpi-indicator fa fa-arrow-down"></div><div class="target-label">Target</div><div class="kpi-target">.</div><div class="clear-this"></div></div><div class="kpi-gauge-wrap"><div id="perf-gauge"class="kpi-gauge">.</div><div class="clear-this"></div></div><div class="clear-this"></div></div><div class="clear-this"></div></div><div id="'+thisLocal+'-avail-chart" ctseq="'+thisSeq+'"></div><div id="'+thisLocal+'-long-chart" class="full-chart"></div><div class="full-box"><div id="'+thisLocal+'-avail-chart-slide" class="full-bar"></div></div><div class="chart-button-row" id="chart-buttons"></div></div>');
			dialogID = thisLocal+'-avail-chart';
			longID = thisLocal+'-long-chart';
			//thisName = thisName + '  AVAILABILITY';
		}else if(thisLocal.indexOf('perftrend') > -1){
			thisMarquee = thisLocal.split('-perftrend')[0];
			thisMarquee = thisMarquee.split('-').join(' ');
			thisMarquee = thisMarquee.toUpperCase();
			chartDialog = $('<div class="noDialog"><div class="thisMarquee">'+thisMarquee+' PERFORMANCE</div><div class="closer"><button id="closeChart" class="btn btn-outline btn-xs btn-labeled btn-primary"><span class="btn-label icon fa fa-times-circle-o"></span>Close</button></div><div class="clear-this"></div></div><div id="'+thisLocal+'-perf-diag"><div class="chart-date-row">Base date range: <span id="fromThis">'+pastMonth+'</span> - <span id="toThis">'+today+'</span></div><div class="kpi-row"><div id="kpi-1" class="kpi-box"><div id="kpi-avail-overlay"></div><div class="kpi-data-wrap"><div class="kpi-title">Availability</div><div class="kpi-actual">.</div><div class="kpi-indicator fa fa-arrow-up"></div><div class="target-label">Target</div><div class="kpi-target">.</div><div class="clear-this"></div></div><div class="kpi-gauge-wrap"><div id="avail-gauge"class="kpi-gauge">.</div><div class="clear-this"></div></div><div class="clear-this"></div></div><div id="kpi-3" class="kpi-box"><div id="kpi-perf-overlay"></div><div class="kpi-data-wrap"><div class="kpi-title">Performance</div><div class="kpi-actual">.</div><div class="kpi-indicator fa fa-arrow-down"></div><div class="target-label">Target</div><div class="kpi-target">.</div><div class="clear-this"></div></div><div class="kpi-gauge-wrap"><div id="perf-gauge"class="kpi-gauge">.</div><div class="clear-this"></div></div><div class="clear-this"></div></div><div class="clear-this"></div></div><div id="'+thisLocal+'-perf-chart" ctseq="'+thisSeq+'"></div><div id="'+thisLocal+'-long-chart" class="full-chart"></div><div class="full-box"><div id="'+thisLocal+'-perf-chart-slide" class="full-bar"></div></div><div class="chart-button-row" id="chart-buttons"></div></div>');
			dialogID = thisLocal+'-perf-chart';
			longID = thisLocal+'-long-chart';
			//thisName = thisName + '  PERFORMANCE';
		}
		$('#content-row-table').css('display','none');
		$('#content-row-incident').css('display','none');
		$('#content-row-chart').css('display','block');
		$('#chart-col').append(chartDialog);

		$.getJSON(dasConfig, function(confdata){
			thisDiv = confdata[confLoc].units;	
			celldataCall = thisDiv[jLoc].dataURI;
			celldataCall = celldataCall.replace('fromThis', fromThis);
			celldataCall = celldataCall.replace('toThis', toThis);
			availTar = thisDiv[jLoc].availTarget;
			perfTar = thisDiv[jLoc].perfTarget;
			largeData(celldataCall, availTar, perfTar, dialogID, longID);
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
		miniDialogs(miniDialogID, whichType, thisID, thisSeq, fromThis, toThis);
	});
	
}

function largeData(dataChain, availTarget, perfTarget, dialogID, longID){
	var celldataCall = dataChain;
	var funcID = dialogID;
	var barID = longID;
	var Tval = 0;
	var Pval = 0;
	var TtrendAv = 0;
	var PtrendAv = 0;
	var avTar = [];
	var avPer = [];
	var tTarget = parseFloat(availTarget);
	var pTarget = parseFloat(perfTarget);
	var chartType;
	var altTrend;
	var altPerf;
	var tempdate;
	TtrendVal = [];
	PtrendVal = [];
	trendDate = [];

	$.getJSON(celldataCall, function(jldata) {
		//Parse data from the json values
		for (var i=0, len=jldata.length; i < len; i++) {
			TtrendVal.push(jldata[i].availability);
			PtrendVal.push(jldata[i].performance);
			tempdate = new Date(jldata[i].date);
			tempdate.setDate(tempdate.getDate() + 1);
			trendDate.push(tempdate);
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
			$('#kpi-perf-overlay').css({"z-index":3,"opacity":.7});
			chartType = "Availibility";
			bigChartDyn(TtrendVal, trendDate, TtrendAv, PtrendAv, avTar, avPer, chartType, funcID, barID);
			buildButtons(altTrend, trendDate, avTar, funcID, '', tTarget, pTarget);
			loadPies(TtrendAv, PtrendAv, tTarget, pTarget);
		}else if(funcID.indexOf('perf') > -1){
			$('#kpi-avail-overlay').css({"z-index":3,"opacity":.7});
			chartType = "Performance";
			bigChartDyn(PtrendVal, trendDate, TtrendAv, PtrendAv, avTar, avPer, chartType, funcID, barID);
			buildButtons(altPerf, trendDate, avPer, funcID, '', tTarget, pTarget);
			loadPies(TtrendAv, PtrendAv, tTarget, pTarget);
		}
	});
	
	$('#closeChart').click(function(){
		$('#content-row-table').css('display','block');
		$('#content-row-incident').css('display','block');
		$('#content-row-chart').css('display','none');
		$('#chart-col').empty();
	});
}

function redoTheData(dataChain, dialogID, longID, active, avTarg, perTarg){
	var celldataCall = dataChain;
	var funcID = dialogID;
	var barID = longID;
	var Tval = 0;
	var Pval = 0;
	var TtrendAv = 0;
	var PtrendAv = 0;
	var avTar = [];
	var avPer = [];
	var tTarget = avTarg;
	var pTarget = perTarg;
	var chartType;
	var altTrend;
	var altPerf;
	var bttnAct = active;
	TtrendVal = [];
	PtrendVal = [];
	trendDate = [];

	$.getJSON(celldataCall, function(jldata) {
		//Parse data from the json values
		for (var i=0, len=jldata.length; i < len; i++) {
			TtrendVal.push(jldata[i].availability);
			PtrendVal.push(jldata[i].performance);
			trendDate.push(new Date(jldata[i].date));
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
			reDoTheChart(TtrendVal, trendDate, TtrendAv, PtrendAv, avTar, funcID, barID, tTarget, pTarget);
			buildButtons(altTrend, trendDate, avTar, funcID, bttnAct, tTarget, pTarget);
			loadPies(TtrendAv, PtrendAv, tTarget, pTarget);
		}else if(funcID.indexOf('perf') > -1){
			chartType = "Performance";
			reDoTheChart(PtrendVal, trendDate, TtrendAv, PtrendAv, avPer, funcID, barID, tTarget, pTarget);
			buildButtons(altPerf, trendDate, avPer, funcID, bttnAct, tTarget, pTarget);
			loadPies(TtrendAv, PtrendAv, tTarget, pTarget);
		}
	});
}

function miniDialogs(miniDialogID, whichType, typeID, thisSeq, fromQuery, toQuery){
	var thisType = whichType;
	var thisID = miniDialogID;
	var thisContent, tableType;
	var thisTypeID = typeID;
	var sequence = thisSeq;
	var fromThis = fromQuery;
	var toThis = toQuery;
	
	if(thisType == 'notes'){
		thisContent = $('<div class="table-warning"><div class="table-header"><div class="table-caption">Notes</div></div><table class="table table-bordered" id="notes-table"><thead><tr><th class="notesDate">Date</th><th>Unit</th><th>Notes</th></tr></thead><tbody></tbody></table></div>');
		tableType = thisType+'-table';
	}
	else{
		thisContent = $('<div class="table-warning"><div class="table-header"><div class="table-caption">Year Trending</div></div><table class="table table-bordered" id="trending-table"><thead><tr><th>Quarter</th><th>Target Availability</th><th>Actual</th><th>Performance Target</th><th>Performance</th></tr></thead><tbody></tbody></table></div>');
		tableType = thisType+'-table';
	}
	
	$('#'+thisID).append(thisContent);
	
	tableBuild(tableType, thisID, thisTypeID, sequence, fromThis, toThis);
}

function tableBuild(dataType, whichID, typeID, thisSeq, fromQuery, toQuery){
	var thisTableType = dataType;
	var thisID = whichID;
	var thisTypeID = typeID;
	var curSeq = thisSeq;
	var fromThis = fromQuery;
	var toThis = toQuery;
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
		notesDataCall = notesDataCall.replace('fromThis', fromThis);
		notesDataCall = notesDataCall.replace('toThis', toThis);
		theName = thisDiv[jLoc].name;
		atarget = thisDiv[jLoc].availTarget;
		ptarget = thisDiv[jLoc].perfTarget;
		buildMiniTables(theName, thisTableType, atarget, ptarget, trendDataCall, fromThis, toThis, notesDataCall);
	});
}	

function buildMiniTables(theName, tableType, availtarget, perftarget, trending, fromQuery, toQuery, notes){
	var currName = theName;
	var theTable = tableType;
	var theTrend = trending;
	var theNotes = notes;
	var atarget = availtarget;
	var ptarget = perftarget;
	var fromThis = fromQuery;
	var toThis = toQuery;
	
	if(theTable == 'notes-table'){
		$.getJSON(theNotes, function(jdata){
			for (var i=0, len=jdata.length; i < len; i++) {
				var theUnit = jdata[i].company;
				var theDate = jdata[i].opened_at;
				var theNote = jdata[i].description;
				var dateTimer = new Date(theDate);
				if(!theUnit){
					theUnit = 'General';
				}
				dateTimer = dateTimer.format('M d, Y');
				$('#'+theTable+' tbody').append('<tr><td>'+dateTimer+'</td><td>'+theUnit+'</td><td>'+theNote+'</td></tr>');
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

function bigChartDyn(TrendVal, trendDate, TtrendAv, PtrendAv, theTarget, perTarget, chartType, diagID, longID){
	var trendPush = TrendVal;
	var trendDate = trendDate;
	var thisChart = chartType;
	var availAv = TtrendAv;
	var perAv = PtrendAv;
	var targeted = theTarget;
	var pertargeted = perTarget;
	var avTar = theTarget[0];
	var perTar = perTarget[0];
	avTar = avTar.toFixed(2);
	perTar = perTar.toFixed(2);
	var localDiagID = diagID;
	var localBarID = longID;
	var starter = 0;
	var stopper = targeted.length;
	var targetType;
	if(localDiagID.indexOf('-avail') > -1){
		targetType = targeted;
	}else if(localDiagID.indexOf('-perf') > -1){
		targetType = pertargeted;
	}

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
                text: "",
                labels: {textAlign: 'near'},
                tickMajor: {
                    position: "outside",
                    style: {
                        stroke: "#999999"
                    }
                }
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
                },
                offset: 0
            },
            { 

            	type: "line",
                label: "Target", 
                data: { 
                    x: trendDate, 
                    y: targetType
                }, 
            	offset: 0
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
            	textVisible:false,
            	text: "",
                alignment: "near", 
                labels: { textAlign: "near" }
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
	
	$('#kpi-1 .kpi-actual').text(availAv+'%');
	$('#kpi-3 .kpi-actual').text(perAv+'ms');
	$('#kpi-1 .kpi-target').text(avTar);
	$('#kpi-3 .kpi-target').text(perTar);
	makeSlider(starter, stopper, trendPush, trendDate, availAv, perAv, targeted, localDiagID, localBarID, avTar, perTar);
	
	$(window).resize(function () {
		$('#'+localDiagID).wijcompositechart("redraw");
		$('#'+localBarID).wijlinechart("redraw");
    });
	
	TtrendVal = [];
	PtrendVal = [];
	trendDate = [];
}

function makeSlider(startNum, stopNum, ATCtrendVal, trendDate, availAv, perAv, trendTarget, thefuncID, thebarID, avTarg, perTarg){
	var thisID = thefuncID;
	var barID = thebarID;
	var thisStart = startNum;
	var thisStop = stopNum;
	var thisVal = ATCtrendVal;
	var thisAvilav = availAv;
	var thisPerav = perAv;
	var thisDate = trendDate;
	var targeted = trendTarget;
	var avTar = avTarg;
	var perTar = perTarg;
	
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
			reDoTheSlideChart(thisStart, thisStop, thisVal, thisDate, thisAvilav, thisPerav, targeted, thisID, barID, avTar, perTar);
		}
	});
	
	$(window).resize(function () {
		$('#'+thisID+'-slide').wijslider("refresh");
    });
}

function reDoTheChart(TrendVal, trendDater, TtrendAv, PtrendAv, theTarget, funcID, barID, avTarg, perTarg){

	var trendPush = TrendVal;
	var trendDate = trendDater;
	var availAv = TtrendAv;
	var perAv = PtrendAv;
	var thisChart = funcID;
	var longChart = barID;
	var thisTarget = theTarget;
	var starter = 0;
	var stopper = trendPush.length;
    var avTar = avTarg;
	var perTar = perTarg;
	avTar = avTar.toFixed(2);
	perTar = perTar.toFixed(2);
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
	
	$('#'+longChart).wijlinechart({ 
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
	
	$('#kpi-1 .kpi-actual').text(availAv+'%');
	$('#kpi-3 .kpi-actual').text(perAv+'ms');
	$('#kpi-1 .kpi-target').text(avTar);
	$('#kpi-3 .kpi-target').text(perTar);
	
	makeSlider(starter, stopper, trendPush, trendDate, availAv, perAv, thisTarget, thisChart, longChart, avTar, perTar);
}

function reDoTheSlideChart(startNum, stopNum, TrendVal, trendDater, TtrendAv, PtrendAv, theTarget, funcID, barID, avTarg, perTarg){
	var starter = startNum;
	var stopper = stopNum;
	var trendPush = TrendVal;
	var trendDate = trendDater;
	var availAv = TtrendAv;
	var perAv = PtrendAv;
	var thisChart = funcID;
	var longChart = barID;
	var thisTarget = theTarget;
	var avTar = avTarg;
	var perTar = perTarg;
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

	$('#kpi-1 .kpi-actual').text(availAv+'%');
	$('#kpi-3 .kpi-actual').text(perAv+'ms');
	$('#kpi-1 .kpi-target').text(avTar);
	$('#kpi-3 .kpi-target').text(perTar);

}

//Tag cells based on performance
function tagCells(chainedID, PtrendAv, TtrendAV){
	var localID = chainedID;
	var pAv = parseFloat(PtrendAv);
	var tAv = TtrendAV;
	var pTargetText = $('#'+localID+'-perf-target').text();
	var pTarget = parseFloat(pTargetText);
	pAv = pAv.toFixed(2);
	pTarget = pTarget.toFixed(2);
    var perRedline = pTarget * 2;
	var pMax = pTarget *2.5;
	perRedline = perRedline.toFixed(2);
	pMax = pMax.toFixed(2);
	//Tag the Perf cell
	switch (true) {
		case (pAv <= pTarget):
			Ptag = '#1DFF00';
			$('#'+localID+'-perf').parent().css('background-color', Ptag);
			$('#'+localID+'-perf').css('color', '#555');
			$('#'+localID+'-prfSign').addClass('fa').addClass('fa-check');
			break;
		case (pAv > pTarget && pAv <= perRedline):
			Ptag = '#F9B916';
			$('#'+localID+'-perf').parent().css('background-color', Ptag);
			$('#'+localID+'-perf').css('color', '#555');
			$('#'+localID+'-prfSign').addClass('fa').addClass('fa-circle');
			break;
		case (pAv > perRedline):
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
		case (tAv >= 99.50):
			Ttag = '#1DFF00';
			$('#'+localID+'-avail').parent().css('background-color', Ttag);
			$('#'+localID+'-avail').css('color', '#555');
			$('#'+localID+'-avSign').addClass('fa').addClass('fa-check');
			break;
		case (tAv >= 98.00 && tAv < 99.50):
			Ttag = '#F9B916';
			$('#'+localID+'-avail').parent().css('background-color', Ttag);
			$('#'+localID+'-avail').css('color', '#555');
			$('#'+localID+'-avSign').addClass('fa').addClass('fa-circle');
			break;
		case (tAv < 98.00):
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

// Loading gauges.
function loadPies(val, perf, avTarg, perTarg){
	var actual = val;
	var thePerf = perf;
	var aTarget = avTarg;
	var pTarget = perTarg;
	aTarget = aTarget.toFixed(2);
	pTarget = pTarget.toFixed(2);
	var pRedline = pTarget * 2;
	var pMax = pTarget * 2.5;
	pRedline = parseInt(pRedline);
	pMax = parseInt(pMax);

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
        max: pMax, 
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
            startValue: pRedline, 
            endValue: pMax, 
            startDistance: 0.54, 
            endDistance: 0.54, 
            style: { 
                fill: "#F72D00", 
                stroke: "#F72D00C", 
                "stroke-width": 0 
            } 
        }, 
        { 
            startWidth: 3, 
            endWidth: 3, 
            startValue: pTarget, 
            endValue: pRedline, 
            startDistance: 0.54, 
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
            endValue: pTarget, 
            startDistance: 0.54, 
            endDistance: 0.54, 
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

//Navigation
function buildout(button){
	var thisBttn = button;
	var tableRow;
	var truncTableRow;
	var tableContent;
	var colSize;
	var today = new Date();
	var past = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	past = past.setDate(past.getDate()-30);
	var pastMonth = new Date(past);
	var p_dd = pastMonth.getDate();
	var p_mm = pastMonth.getMonth()+1;
	var p_yyyy = pastMonth.getFullYear();
	var queryTo, queryFrom;
	if(dd<10) {
	    dd='0'+dd;
	} 

	if(mm<10) {
	    mm='0'+mm;
	} 
	
	if(p_dd<10) {
	    p_dd='0'+p_dd;
	} 

	if(p_mm<10) {
	    p_mm='0'+p_mm;
	} 

	today = mm+'/'+dd+'/'+yyyy;
	pastMonth = p_mm+'/'+p_dd+'/'+p_yyyy;
	queryTo = yyyy+'-'+mm+'-'+dd;
	queryFrom = p_yyyy+'-'+p_mm+'-'+p_dd;
	

	$('#content-row-table').empty();
	$('#content-row-table').css('display','block');
	$('#content-row-incident').css('display','block');
	$('#content-row-chart').css('display','none');
	$('#chart-col').empty();
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
			$('#content-row-incident').css('display','none');
			break;
	}
	
	//Build table
	
	truncTableRow = tableRow.split(' ').join('');
	if (thisBttn == 'menu-link-issues'){
		tableContent = '<div class="col-md-'+ colSize +'"><div class="table-primary"> \
		<div class="table-header clearfix"> \
		<div class="table-caption">'+ tableRow +'</div> \
		<div class="DT-lf-right"><div class="DT-per-page"><div id="fromText">'+pastMonth+'</div><div id="toText">'+today+'</div><label for="from">Date Range From:&nbsp;</label><input type="text" class="dater" id="from" name="from" value="'+pastMonth+'"><label for="to">&nbsp;To:&nbsp;</label><input type="text" class="dater" id="to" name="to" value="'+today+'"></div><button id="newRanger" class="btn btn-info btn-sm">New Range</button></div></div> \
		<table class="table table-bordered" id="'+truncTableRow+'-table"> \
		<thead><tr><th class="issueDate">Date</th><th class="issueUnit">Unit&nbsp;</th><th>Notes&nbsp;</th></tr></thead> \
		<tbody></tbody> \
		</table> \
		</div></div>';
	}else{
		tableContent = '<div class="col-md-'+ colSize +'"><div class="table-primary"> \
		<div class="table-header clearfix"> \
		<div class="table-caption">'+ tableRow +' Summary</div> \
		<div class="DT-lf-right"><div class="DT-per-page"><div id="fromText">'+pastMonth+'</div><div id="toText">'+today+'</div><label for="from">Date Range From:&nbsp;</label><input type="text" class="dater" id="from" name="from" value="'+pastMonth+'"><label for="to">&nbsp;To:&nbsp;</label><input type="text" class="dater" id="to" name="to" value="'+today+'"></div><button id="newRanger" class="btn btn-info btn-sm">New Range</button></div></div> \
		<table class="table table-bordered" id="'+truncTableRow+'-table"> \
		<thead><tr><th>ATG'+tableRow+'</th><th>Target</th><th>Availability</th><th>&nbsp;</th><th>Avail Trend</th><th>Target</th><th>Performance</th><th>&nbsp;</th><th>Perf Trend</th><th>Notes</th><th>Trending</th></tr></thead> \
		<tbody></tbody> \
		</table> \
		</div></div>';
	}

	$('#content-row-table').append(tableContent);
	
	selectedTab(truncTableRow, queryFrom, queryTo);
	dateRanger(truncTableRow);
}

//Range
function dateRanger(tabID){
	var currentID = tabID;
	$('#from').datepicker({
		dateFormat: 'yyyy-mm-dd',
		maxDate: '0',
		autoclose: true
	}).on('changeDate', function(selectedDate){
		var theDater = new Date(selectedDate.date);
		var targetDate = (theDater.getMonth() + 1) + '/' + theDater.getDate() + '/' +  theDater.getFullYear();
		$('#fromText').text(targetDate);
		$(this).datepicker( "option", "minDate", selectedDate);
		$(this).datepicker('setDate', selectedDate);
        $(this).blur();
        $('.datepicker').hide();
    });
	
    $('#to').datepicker({
    	dateFormat: 'yyyy-mm-dd',
    	maxDate: '0',
    	autoclose: true
    }).on('changeDate', function(selectedDate){
    	var theDater = new Date(selectedDate.date);
		var targetDate = (theDater.getMonth() + 1) + '/' + theDater.getDate() + '/' +  theDater.getFullYear();
		$('#toText').text(targetDate);
    	$(this).datepicker( "option", "maxDate", selectedDate);
    	$(this).datepicker('setDate', selectedDate);
        $(this).blur();
        $('.datepicker').hide();
    });
    
    $('#newRanger').click(function(){
    	var prefromThis = $('#from').val();
    	var pretoThis = $('#to').val();
    	var fromThis, toThis;
    	var mmF = prefromThis.split('/')[0];
    	var ddF = prefromThis.split('/')[1];
    	var yyyyF = prefromThis.split('/')[2];
    	var mmT = pretoThis.split('/')[0];
    	var ddT = pretoThis.split('/')[1];
    	var yyyyT = pretoThis.split('/')[2];
    	fromThis = yyyyF+'-'+mmF+'-'+ddF;
    	toThis = yyyyT+'-'+mmT+'-'+ddT;
    	//Reformate date range for database query
    	$('#'+currentID+'-table tbody').empty();
    	selectedTab(currentID, fromThis, toThis);
    	
    });
}

//Select chart range.
function chartRanger(Tval, trendDate, trendTarget, funcID, avTarg, perTarg){
	$('#chart-buttons li').click(function(){
		var thisCartButton = $(this).attr('id');
		var startNum, stopNum;
		var thisTrend = Tval;
		var thisDate = trendDate;
		var thisTarget = trendTarget;
		var thisChart = funcID;
		var thisSeq = $('#'+thisChart).attr('ctseq');
		var confLoc = thisSeq.split(',')[0];
		var jLoc = thisSeq.split(',')[1];
		confLoc = parseInt(confLoc);
		jLoc = parseInt(jLoc);
		var longChart;
		var currentStart = thisDate[0];
		var fromThisTxt = $('#fromThis').text();
		var toThisTxt =  $('#toThis').text();
		var past = new Date(fromThisTxt);
		var today = new Date(toThisTxt);
		var notCurrent, thePast;
		var celldataCall, thisDiv;
		var pastText, todayText;
		var avTar = avTarg;
		var perTar = perTarg;

		todayText = today.format('M d, Y');
		today = today.format('Y-m-d');
		
		if(thisChart.indexOf('-avail-') > -1){
			longChart = thisChart.replace('-avail-', '-long-');
		}else if(thisChart.indexOf('-perf-') > -1){
			longChart = thisChart.replace('-perf-', '-long-');
		}else{
			console.log('I fart in your general direction');
		}
		$('.kpi-actual').empty();
		$('.kpi-gauge').empty();
		$('#chart-buttons').empty();
		//Buttns switching
		switch (thisCartButton){
			case 'chart-weekly':
				notCurrent = new Date(today);
				notCurrent.setDate(notCurrent.getDate()-7);
				thePast = new Date(notCurrent);
				pastText = thePast.format('M d, Y');
				thePast = thePast.format('Y-m-d');
				$('#fromThis').text(pastText);
				$('#toThis').text(todayText);
				$.getJSON(dasConfig, function(confdata){
					thisDiv = confdata[confLoc].units;
					celldataCall = thisDiv[jLoc].dataURI;
					celldataCall = celldataCall.replace('fromThis', thePast);
					celldataCall = celldataCall.replace('toThis', today);
					redoTheData(celldataCall, thisChart, longChart, thisCartButton, avTar, perTar);
				});
				
				break;
			case 'chart-daily':
				notCurrent = new Date(today);
				notCurrent.setDate(notCurrent.getDate()-30);
				thePast = new Date(notCurrent);
				pastText = thePast.format('M d, Y');
				thePast = thePast.format('Y-m-d');
				$('#fromThis').text(pastText);
				$('#toThis').text(todayText);
				$.getJSON(dasConfig, function(confdata){
					thisDiv = confdata[confLoc].units;
					celldataCall = thisDiv[jLoc].dataURI;
					celldataCall = celldataCall.replace('fromThis', thePast);
					celldataCall = celldataCall.replace('toThis', today);
					redoTheData(celldataCall, thisChart, longChart, thisCartButton, avTar, perTar);
				});

				break;
			case 'chart-quaterly':
				notCurrent = new Date(today);
				notCurrent.setDate(notCurrent.getDate()-90);
				thePast = new Date(notCurrent);
				pastText = thePast.format('M d, Y');
				thePast = thePast.format('Y-m-d');
				$('#fromThis').text(pastText);
				$('#toThis').text(todayText);
				$.getJSON(dasConfig, function(confdata){
					thisDiv = confdata[confLoc].units;
					celldataCall = thisDiv[jLoc].dataURI;
					celldataCall = celldataCall.replace('fromThis', thePast);
					celldataCall = celldataCall.replace('toThis', today);
					redoTheData(celldataCall, thisChart, longChart, thisCartButton, avTar, perTar);
				});

				break;
			case 'chart-simi':
				notCurrent = new Date(today);
				notCurrent.setDate(notCurrent.getDate()-180);
				thePast = new Date(notCurrent);
				pastText = thePast.format('M d, Y');
				thePast = thePast.format('Y-m-d');
				$('#fromThis').text(pastText);
				$('#toThis').text(todayText);
				$.getJSON(dasConfig, function(confdata){
					thisDiv = confdata[confLoc].units;
					celldataCall = thisDiv[jLoc].dataURI;
					celldataCall = celldataCall.replace('fromThis', thePast);
					celldataCall = celldataCall.replace('toThis', today);
					redoTheData(celldataCall, thisChart, longChart, thisCartButton, avTar, perTar);
				});

				break;
			case 'chart-year':
				notCurrent = new Date(today);
				notCurrent.setDate(notCurrent.getDate()-365);
				thePast = new Date(notCurrent);
				pastText = thePast.format('M d, Y');
				thePast = thePast.format('Y-m-d');
				$('#fromThis').text(pastText);
				$('#toThis').text(todayText);
				$.getJSON(dasConfig, function(confdata){
					thisDiv = confdata[confLoc].units;
					celldataCall = thisDiv[jLoc].dataURI;
					celldataCall = celldataCall.replace('fromThis', thePast);
					celldataCall = celldataCall.replace('toThis', today);
					redoTheData(celldataCall, thisChart, longChart, thisCartButton, avTar, perTar);
				});

				break;
		}
	}).hover(function(){
			$(this).addClass('bttnSelected');
		}, function(){
			$(this).removeClass('bttnSelected');		
	});
}

//Chart Buttons
function buildButtons(newTrend, trendDate, newTarget, funcID, bttnPress, avTarget, perTarget){
	var thisVal = newTrend;
	var thisDate = trendDate;
	var thisTarget = newTarget;
	var thisChart = funcID;
	var active = bttnPress;
	var tTarget = avTarget;
	var pTarget = perTarget;

	switch (active){
	case 'chart-weekly':
		$('#chart-buttons').append('<ul><li id="chart-weekly" class="bttnActive">7 Days</li><li id="chart-daily">30 Days</li><li id="chart-quaterly">90 Days</li><li id="chart-simi">180 Days</li><li id="chart-year">1 y</li></ul>');
		break;
	case 'chart-daily':
		$('#chart-buttons').append('<ul><li id="chart-weekly">7 Days</li><li id="chart-daily" class="bttnActive">30 Days</li><li id="chart-quaterly">90 Days</li><li id="chart-simi">180 Days</li><li id="chart-year">1 y</li></ul>');
		break;
	case 'chart-quaterly':
		$('#chart-buttons').append('<ul><li id="chart-weekly">7 Days</li><li id="chart-daily">30 Days</li><li id="chart-quaterly" class="bttnActive">90 Days</li><li id="chart-simi">180 Days</li><li id="chart-year">1 y</li></ul>');
		break;
	case 'chart-simi':
		$('#chart-buttons').append('<ul><li id="chart-weekly">7 Days</li><li id="chart-daily">30 Days</li><li id="chart-quaterly">90 Days</li><li id="chart-simi" class="bttnActive">180 Days</li><li id="chart-year">1 y</li></ul>');
		break;
	case 'chart-year':
		$('#chart-buttons').append('<ul><li id="chart-weekly">7 Days</li><li id="chart-daily">30 Days</li><li id="chart-quaterly">90 Days</li><li id="chart-simi">180 Days</li><li id="chart-year"  class="bttnActive">1 y</li></ul>');
		break;
		default:
			$('#chart-buttons').append('<ul><li id="chart-weekly">7 Days</li><li id="chart-daily">30 Days</li><li id="chart-quaterly">90 Days</li><li id="chart-simi">180 Days</li><li id="chart-year">1 y</li></ul>');
	}

	chartRanger(thisVal, thisDate, thisTarget, thisChart, tTarget, pTarget);
}

$('.navigation li a').click(function(){
	var linkBttn = $(this).attr('id');
	buildout(linkBttn);
});