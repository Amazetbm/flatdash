var adminConfig = "../assets/json/config.json";

function initAdminApp(){
	var initButton = 'menu-link-digitalMedia-admin';
	buildoutAdmin(initButton);
}

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
	$('#main-menu-buttons').children().removeClass('active');
	
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
					$('#'+currentID+' tbody').append('<tr><td>'+cellName+'</td><td id="'+IDTag+'-avail-target" data-thecount="" pageID="">'+cellTTarget+'</td><td><span id="'+IDTag+'-avail"></span></td><td id="'+IDTag+'-perf-target">'+cellPTarget+'</td><td><span id="'+IDTag+'-perf"></span></td><td class="cellNudge"><button class="btn btn-outline btn-xs btn-labeled btn-primary" seq-loc="'+i+','+j+'" id="'+IDTag+'-notes"><span class="btn-label icon fa fa-pencil"></span>Edit</button></td></tr>');
					loadSparkDynAdmin(IDTag, celldataCall);
				}				
			}
		}
		//initTagButtons(fromThis, toThis);
	});	
}

function loadSparkDynAdmin(IDChain, chainData){
	var localID = IDChain;
	var localData = chainData;
	var Tval = 0;
	var Pval = 0;
	var TtrendAv = 0;
	var PtrendAv = 0;
	var tCount = 0;
	var pageID;
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
			pageID = jdata[i].page_id;
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
			$('#'+localID+'-avail-target').attr('data-thecount', tCount);
			$('#'+localID+'-avail-target').attr('pageID', pageID);
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

//Nav
$('#main-menu-buttons-admin li a').click(function(){
	var linkBttn = $(this).attr('id');
	buildoutAdmin(linkBttn);
});