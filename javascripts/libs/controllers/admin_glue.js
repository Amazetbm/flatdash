var adminConfig = "../assets/json/config.json";

//Turn on he app
function initAdminApp(){
	var initButton = 'menu-link-digitalMedia-admin';
	buildoutAdmin(initButton);
}

//Cookie functions
function writedateCookieAdmin(queryFrom, queryTo){
	var fromThis = queryFrom;
	var toThis = queryTo;
	document.cookie='fromThisAdmin='+fromThis;	
	document.cookie='toThisAdmin='+toThis;
}

function deleteCookieAdmin(){
	document.cookie='fromThisAdmin=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
	document.cookie='toThisAdmin=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
	initAdminApp();
}

//Build Inital Page
function buildoutAdmin(button){
	var thisBttn = button;
	var tableRow;
	var truncTableRow;
	var tableContent;
	var colSize;
	var today = new Date();
	var past = new Date();
	var dd = today.getDate()-1;
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	past = past.setDate(past.getDate()-30);
	var pastMonth = new Date(past);
	var p_dd = pastMonth.getDate();
	var p_mm = pastMonth.getMonth()+1;
	var p_yyyy = pastMonth.getFullYear();
	var cookieDates = document.cookie;
	var queryTo, queryFrom;	
	if(dd<10) {
	    dd='0'+dd;
	} 

	if(mm<10) {
	    mm='0'+mm;
	} 

	if (!cookieDates){
		// console.log('No data, dude');
		today = mm+'/'+dd+'/'+yyyy;
		pastMonth = p_mm+'/'+p_dd+'/'+p_yyyy;
		queryTo = yyyy+'-'+mm+'-'+dd;
		queryFrom = queryTo;
	}else{
		var cookieArray = cookieDates.split(';');
		var epocFrom = new Date(cookieArray[0].split('=')[1]);
		var epocTo = new Date(cookieArray[1].split('=')[1]);
		epocFrom.setDate(epocFrom.getDate() + 1);
		epocTo.setDate(epocTo.getDate() + 1);
		pastMonth = new Date(epocFrom);
		today = new Date(epocTo);
		pastMonth = pastMonth.format('m/d/Y');
		today = today.format('m/d/Y');
		queryFrom = cookieArray[0].split('=')[1];
	    queryTo = cookieArray[1].split('=')[1];
	}
	
	$('#content-row-table').empty();
	$('#content-row-table').css('display','block');
	$('#content-row-incident').css('display','block');
	$('#content-row-chart').css('display','none');
	$('#chart-col').empty();
	$('#main-menu-buttons-admin').children().removeClass('active');
	
	switch (thisBttn){
		case 'menu-link-digitalMedia-admin':
			tableRow = "  Digital Media";
			colSize = 12;
			$('#'+thisBttn).parent().addClass('active');
			$('#page-header-title').text(tableRow);
			break;
		case 'menu-link-software-admin':
			tableRow = "  Software Division";
			colSize = 12;
			$('#'+thisBttn).parent().addClass('active');
			$('#page-header-title').text(tableRow);
			break;
		case 'menu-link-enterprise-admin':
			tableRow = "  Enterprise Division";
			colSize = 12;
			$('#'+thisBttn).parent().addClass('active');
			$('#page-header-title').text(tableRow);
			break;
		
	}
	
	//Build table	
	truncTableRow = tableRow.split(' ').join('');
	if (thisBttn == 'menu-link-issues'){
		tableContent = '<div class="col-md-'+ colSize +'"><div class="table-primary"> \
		<div class="table-header clearfix"> \
		<div class="table-caption">'+ tableRow +'</div> \
		<div class="DT-lf-right"><div class="DT-per-page"><div id="fromText">'+pastMonth+'</div><div id="toText">'+today+'</div><label for="from">Date:&nbsp;</label><input type="text" class="dater" id="to" name="to" value="'+today+'"></div><button id="newRanger" class="btn btn-info btn-sm">Custom</button><button id="dateReset" class="btn btn-info btn-sm">Reset</button></div></div> \
		<table class="table table-bordered" id="'+truncTableRow+'-table"> \
		<thead><tr><th class="issueDate">Date</th><th class="issueUnit">Unit&nbsp;</th><th>Notes&nbsp;</th></tr></thead> \
		<tbody></tbody> \
		</table> \
		</div></div>';
	}else{
		tableContent = '<div class="col-md-'+ colSize +'"><div class="table-primary"> \
		<div class="table-header clearfix"> \
		<div class="table-caption">'+ tableRow +' Summary</div> \
		<div class="DT-lf-right"><div class="DT-per-page"><div id="fromText">'+pastMonth+'</div><div id="toText">'+today+'</div><label for="from">Date:&nbsp;</label><input type="text" class="dater" id="to" name="to" value="'+today+'"></div><button id="newRanger" class="btn btn-info btn-sm">Custom</button><button id="dateReset" class="btn btn-info btn-sm">Reset</button></div></div> \
		<table class="table table-bordered" id="'+truncTableRow+'-table"> \
		<thead><tr><th>ATG'+tableRow+'</th><th>Target</th><th>Availability</th><th>Target</th><th>Performance</th><th>Notes</th></tr></thead> \
		<tbody></tbody> \
		</table> \
		</div></div>';
	}

	$('#content-row-table').append(tableContent);
	
	selectedTabAdmin(truncTableRow, queryFrom, queryTo);
	dateRangerAdmin(truncTableRow);
}

//Controls for Left Navigation
function selectedTabAdmin(tabID, queryFrom, queryTo){
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
		buildTablesAdmin(thisID, tableVars, fromThis, toThis);
	}else if(thisID.startsWith('Software')){
		tableVars = 'Software';
		buildTablesAdmin(thisID, tableVars, fromThis, toThis);
	}else if(thisID.startsWith('Enterprise')){
		tableVars = 'Enterprise';
		buildTablesAdmin(thisID, tableVars, fromThis, toThis);
	}
}

//Set New range for the date
function dateRangerAdmin(tabID){
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
    });
    
    $('#newRanger').click(function(){
    	var prefromThis = $('#to').val();
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
		
    	writedateCookieAdmin(fromThis, toThis);

    	//Reformat date range for database query
    	$('#'+currentID+'-table tbody').empty();
    	selectedTabAdmin(currentID, fromThis, toThis);	
    });
    
    $('#dateReset').click(function(){
    	deleteCookieAdmin();
    });
}

//Build out the table row for each subdivision
function buildTablesAdmin(tableID, VarID, queryFrom, queryTo){
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
	var cookieDates = document.cookie;
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
	
	if (!cookieDates){
		// console.log('No data, dude');
	}else{
		var cookieArray = cookieDates.split(';');
		fromThis = cookieArray[0].split('=')[1];
	    toThis = cookieArray[1].split('=')[1];
	}
	
	$.getJSON(adminConfig, function(confdata){
		for (var i=0, len=confdata.length; i < len; i++){
			divVar = confdata[i].division;
			if (divVar == currentTable){
				thisDiv = confdata[i].units;
				for(var j=0, jlen=thisDiv.length; j < jlen; j++){	
					cellName = thisDiv[j].name;
					cellTTarget = thisDiv[j].availTarget;
					cellPTarget = thisDiv[j].perfTarget;
					celldataCall = thisDiv[j].dataURI;
					celldataCall = celldataCall.replace('fromThis', fromThis);
					celldataCall = celldataCall.replace('toThis', toThis);
					//Make it happen
					IDTag = cellName.toLowerCase();
					IDTag = IDTag.split(' ').join('-');
					$('#'+currentID+' tbody').append('<tr><td dammit="">'+cellName+'</td><td id="'+IDTag+'-avail-target">'+cellTTarget+'</td><td><span id="'+IDTag+'-avail"></span></td><td id="'+IDTag+'-perf-target">'+cellPTarget+'</td><td><span id="'+IDTag+'-perf"></span></td><td class="cellNudge"><button class="btn btn-outline btn-xs btn-labeled btn-primary" seq-loc="'+i+','+j+'" id="'+IDTag+'-notes" data-thecount="" thisID="" data-avail="" data-perf="" data-page="" thisPageID=""><span class="btn-label icon fa fa-pencil"></span>Edit</button></td></tr>');
					loadSparkDynAdmin(IDTag, celldataCall, fromThis);
				}				
			}
		}
	});	
}

//Populate the cells with data
function loadSparkDynAdmin(IDChain, chainData, fromDate){
	var localID = IDChain;
	var localData = chainData;
	var fromThis = fromDate;
	var Tval = 0;
	var Pval = 0;
	var TtrendAv = 0;
	var PtrendAv = 0;
	var tCount = 0;
	var thisID, pageID, thisUnit, thisPage;
	TtrendVal = [];
	PtrendVal = [];
	trendDate = [];
	$.getJSON(localData, function(jdata) {
		//Parse data from the json values
		for (var i=0, len=jdata.length; i < len; i++) {
			TtrendVal.push(jdata[i].availability);
			PtrendVal.push(jdata[i].performance);
			trendDate.push(jdata[i].date);
			tCount = jdata[i].count;
			thisID = jdata[i]._id;
			pageID = jdata[i].page_id;
			thisUnit = jdata[i].unit;
			thisPage = jdata[i].page;
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
			$('#'+localID+'-notes').attr('data-thecount', tCount);
			$('#'+localID+'-notes').attr('data-avail', TtrendAv);
			$('#'+localID+'-notes').attr('data-perf', PtrendAv);
			$('#'+localID+'-notes').attr('data-page', thisPage);
			$('#'+localID+'-notes').attr('thisPageID', pageID);
			$('#'+localID+'-notes').attr('thisID', thisID);
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
	
	$('.btn-primary').unbind().click(function(){
		var thisID = $(this).attr('id');
		var thisSeq = $(this).attr('seq-loc');
		var thisUnit = thisID.split('-notes')[0];
		var thisID = $(this).attr('thisID');
		var thisAvail = $(this).attr('data-avail');
		var thisCount = $(this).attr('data-thecount');
		var currentPerf = $(this).attr('data-perf');
		var currentPage = $(this).attr('data-page');
		var currPageID = $(this).attr('thisPageID');
		var prettyStr = thisUnit.split('-').join(' ');
		thisCount = parseInt(thisCount);
		thisAvail = parseFloat(thisAvail);
		thisAVail = thisAvail.toFixed(2);
		prettyStr = prettyStr.toUpperCase();
		editForm(thisID, prettyStr, currentPage, currPageID, thisAvail, currentPerf, thisCount, fromThis);
	});	
}

//Opens Edit Form Populates it with proper data
function editForm (thisID, unit, page, pgID, avail, perf, count, fromDate){
	var thisUnit = unit;
	var thisPage = page;
	var pageID = pgID;
	var thisAvail = avail;
	var thisPerf = perf;
	var thisCount = count;
	var thisID = thisID;
	var fromThis = fromDate;
	var displayDate = new Date(fromThis);
	displayDate.setDate(displayDate.getDate() + 1);
	displayDate = displayDate.format('M d, Y');
	var total, errorCount, converted;
	converted = thisAvail/100;
	total = thisCount/converted;
	total = Math.round(total);
	total = parseInt(total);
	errorCount = total - thisCount;

	var chartDialog = '<div class="panel"><div id="formHeader" class="panel-heading" thisID="'+thisID+'"><div class="panel-title"><strong>'+thisUnit+'</strong><div class="closer"><button id="closeChart" class="btn btn-outline btn-xs btn-labeled btn-primary"><span class="btn-label icon fa fa-times-circle-o"></span>Close</button></div></div></div><div class="panel-body"><div><p><strong>Total: <span id="thisTotal">'+total+'</span>&nbsp;&nbsp;-&nbsp;&nbsp;Good Count: <span id="goodCount">'+thisCount+'</span>&nbsp;&nbsp;-&nbsp;&nbsp;<span id="currentLine">Current Availability: <span id="thisAvail">'+thisAvail+'</span>%</span>&nbsp;&nbsp;-&nbsp;&nbsp;<spanRecord >Date: </span><span id="displayDate">'+displayDate+'</span></strong></p></div><div class="row form-group"><label class="col-sm-2">Error Count:</label><div class="col-sm-4"><input type="text" id="inCount" name="count" class="form-control" value="'+errorCount+'"></div><div id="alertBox_avail" class="col-sm-5"></div></div><div class="row form-group"><label class="col-sm-2">Notes: </label><div class="col-sm-4"><textarea rows="5" cols="40" id="inNote" name="notes" class="form-control"></textarea></div><div id="alertBox_note" class="col-sm-5"></div></div><div class="panel-footer text-right"><button id="cancelThis" class="btn btn-primary">Cancel</button>&nbsp;<button id="updateRecord" class="btn btn-primary" disabled>Update</button></div></div></div>';
	$('#content-row-table').css('display','none');
	$('#content-row-incident').css('display','none');
	$('#content-row-chart').css('display','block');
	$('#chart-col').append(chartDialog);
	recUpdate(thisID, pageID, thisUnit, thisAvail, thisPerf, errorCount, total, fromThis);
	theCloser();
}

//Updates availablity record and allows user to enter notes as to "why"
function recUpdate(thisID, pgID, unit, avail, perf, errors, total, fromDate){
	var thisID = thisID;
	var pageID = pgID;
	pageID = parseInt(pageID);
	var thisPage = unit;
	var thisUnit = unit;
	var thisCount;
	var thisAVail = avail;
	var thisPerf = perf;
	thisPerf = parseFloat(thisPerf);
	thisPerf = thisPerf.toFixed(2);
	var theseErrors = errors;
	var thisTotal = total;
	var fromThis = fromDate;
	var today, opened_AT, newAvail, newNote, availSuccess, noteSuccess, logSuccess, actionType;
	
	$('#inCount').blur(function(){
		theseErrors = $(this).val();
		theseErrors = parseInt(theseErrors);
		thisCount = thisTotal - theseErrors;
		newAvail = thisCount / thisTotal;
		newAvail = newAvail * 100;
		newAvail = parseFloat(newAvail);
		newAvail = newAvail.toFixed(2);
		today = new Date();
		opened_AT = new Date();
		today = today.format('c');
		opened_AT = opened_AT.format('m/d/Y');
		$('#goodCount').text(thisCount).addClass('currentPulse').delay(500).removeClass('currentPulse', 1000);
		$('#thisAvail').text(newAvail).addClass('currentPulse').delay(500).removeClass('currentPulse', 1000);
		$('#updateRecord').prop('disabled', false);
		
	}).focus(function(){
		$('#alertBox_avail').empty().removeClass('errorPulse');
	});
	
	
	$('#updateRecord').click(function(){
		newNote = $('#inNote').val();	
		var availData = new Object();	
		availData = {
			date: fromThis,
			page_id: pageID,
			availability: newAvail,
			performance: thisPerf,
			count: thisCount,
			unit: thisUnit,
			page: thisPage
		};
		
		var noteData = {
				opend_at: today,
				date: opened_AT,
				page_id: pageID,
				unit: thisUnit,
				company: '',
				description: newNote
		};
		
		var dataURL = 'https://itsc.autotrader.com:3000/scorecard/daily/'+thisID;
		var notesURL = 'https://itsc.autotrader.com:3000/scorecard/daily_upd_notes/';
	
		$.ajax({
			  url: dataURL,
			  type: "PUT",
			  crossDomain: true,
		      data: JSON.stringify(availData),
		      contentType: "application/json; charset=utf-8",
		      dataType: "json",
		      success: function (data, textStatus, jqXHR) {
	              $('#alertBox_avail').text('Record Updated!').addClass('successPulse');
	              availSuccess = true;
	              actionType = 'avail';
	              actionLogger(today, actionType, availSuccess, thisID); 
	              
	              if(!newNote || newNote == ''){
		      			console.log('Note field is empty');
		      			noteSucces = true;
		      			setTimeout(closeBox, 2000);
		      		}else{
		      			$.ajax({
		      				  url: notesURL,
		      				  type: 'POST',
		      				  crossDomain: true,
		      			      data: JSON.stringify(noteData),  
		      			      contentType: "application/json; charset=utf-8",
		      			      dataType: "json",
		      			      success: function (data, textStatus, jqXHR) {        
		      		              $('#alertBox_note').text('Record Updated!').addClass('successPulse');
		      		              noteSuccess = true;
		      		              actionType = 'note';
		      		              actionLogger(today, actionType, noteSuccess, thisID);
		      		              setTimeout(closeBox, 2000);
		      			      },
		      			      error: function (req, status, err){
		      			    	  var errorType = req.status;
		      			    	  $('#alertBox_note').text('Unable to update record! Error Code: '+errorType).addClass('errorPulse');	    	  
		      			    	  noteSuccess = false;
		      			    	  actionType = 'note';
		      			    	  actionLogger(today, actionType, noteSuccess, thisID);
		      			      }
		      			});
		      		}
		      },
		      error: function (req, status, err){
		    	  var errorType = req.status;
		    	  $('#alertBox_avail').text('Unable to update record! Error Code: '+errorType).addClass('errorPulse');    
                  availSuccess = false;
                  actionType = 'avail';
                  actionLogger(today, actionType, availSuccess, thisID);
		      }
		});
	});
}

// Write actions to external log
function actionLogger(thisDate, thisType, thisState, thisPage){
	var today = thisDate;
	var logType = thisType;
	var currentState = thisState;
	var thisID = thisPage;
	var displayState, displayType;
	var logData = new Object();
	var logURL = 'https://itsc.autotrader.com:3000/scorecard/last_upd_log/';
	if (logType == 'avail'){
		displayType = 'Availability';
	}else if (logType == 'note'){
		displayType = 'Note';
	}
	
	if (currentState == true){
		displayState = 'Succeeded';
	}else{
		displayState = 'Failed';
	}
	
	logData = {
		Timestamp: today,
		Log_Type: displayType,
		Log_State: displayState,
		Record: thisID
	};
	
	$.ajax({
		  url: logURL,
		  type: 'POST',
		  crossDomain: true,
	      data: JSON.stringify(logData),  
	      contentType: "application/json",
	      dataType: "json",
	      success: function (data, textStatus, jqXHR) {        
              console.log('success!');
	      },
	      error: function (req, status, err){
	    	  var errorType = req.status;
	    	  console.log('error: '+errorType);
	      }
	});
}
//Reload new data
function closeBox(){
	$('#content-row-table').css('display','block');
	$('#content-row-incident').css('display','block');	
	$('#content-row-chart').css('display','none');
	$('#chart-col').empty();
	initAdminApp();
}

function theCloser(){
	$('#closeChart, #cancelThis').click(function(){
		$('#content-row-table').css('display','block');
		$('#content-row-incident').css('display','block');
		$('#content-row-chart').css('display','none');
		$('#chart-col').empty();
	});
}

//Nav
$('#main-menu-buttons-admin li a').click(function(){
	var linkBttn = $(this).attr('id');
	buildoutAdmin(linkBttn);
});