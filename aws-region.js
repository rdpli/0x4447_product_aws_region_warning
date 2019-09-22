var defaultRegion;

//This line opens up a long-lived connection to your background page.
var port = chrome.runtime.connect({name:"aws_region"});
port.postMessage({command: "GetDefaultRegion"});

port.onMessage.addListener(function(message,sender){
    console.log('aws-region addListener', message);
    
	if(message.command && message.command === "DefaultRegion") {
      // renderStatus("response is " + message.response);
      defaultRegion = message.response;
    }
});

function defaultRegionCheck() {
console.log('defaultRegionCheck');
    var regionArea = document.getElementById('nav-regionMenu');

    if (regionArea) {
        var regionLabel = regionArea.getElementsByClassName("nav-elt-label");

        if (regionLabel) {
            var region = regionLabel[0].innerText;
            console.log('region', region);

            port.postMessage({
                command: "SetCurrentRegion",
                region: region
            });
        }
    }
	// if ($('#contentFrame') && $('#contentFrame').length > 0) {
	// 	paneContents = $('#contentFrame').contents().find('.contentPane').contents();
	// } else {
	// 	paneContents = $('#contentPanel').contents()
	// }

	// if (paneContents !== '') {
	// 	var totalAssignmentsCount = paneContents.find('.sortable_item_row').length;
	// }
	
	// if (totalAssignmentsCount > 0) {

	// 	if (defaultRegion) {
	// 		var compDate = moment(defaultRegion);
	// 		var daysLeft = compDate.diff(moment(), 'days');			
	// 	}

	// 	var gradedAssignmentsCount = paneContents.find('.graded_item_row').length;
	// 	var submittedAssignmentsCount = paneContents.find('.submitted_item_row').length;

	// 	var upcomingAssignments = paneContents.find('.upcoming_item_row');
	// 	var upcomingAssignmentsCount = upcomingAssignments.length;

	// 	var inProgressAssignmentsCount = upcomingAssignments.contents().find('.inProgress').length;

	// 	if (defaultRegion) {
	// 		var neededPerDay = (upcomingAssignmentsCount / daysLeft).toFixed(1);

	// 		var npdColor = 'green';
	// 		var npdBold = 'normal';

	// 		if (neededPerDay >= 1.1) {
	// 			npdColor = '#ff6c02';
	// 			npdBold = 'bold';
	// 		}

	// 		if (neededPerDay >= 2.0) {
	// 			npdColor = 'red';
	// 			npdBold = 'bold';
	// 		}
	// 	}

	// 	var currentHtml = paneContents.find('#_titlebarExtraContent').html;

	// 	var daysHtml = defaultRegion ? ', Days Left: ' + daysLeft +
	// 		', Needed per Day: <span style="color:' + npdColor + ';font-weight:' + npdBold + '">' + neededPerDay + '</span>' : "";

	// 	paneContents.find('#_titlebarExtraContent').html(
	// 		' Assignments Total: ' +  totalAssignmentsCount +
	// 		', Graded: ' + gradedAssignmentsCount +
	// 		' (' + ((gradedAssignmentsCount / totalAssignmentsCount) * 100).toFixed(1) + '%)' +
	// 		', Submitted: ' + submittedAssignmentsCount +
	// 		' (' + ((submittedAssignmentsCount / totalAssignmentsCount) * 100).toFixed(1) + '%)' +
	// 		', Upcoming: ' + upcomingAssignmentsCount +
	// 		' (' + ((upcomingAssignmentsCount / totalAssignmentsCount) * 100).toFixed(1) + '%)' +
	// 		', In Progress: ' + inProgressAssignmentsCount +
	// 		' (' + ((inProgressAssignmentsCount / totalAssignmentsCount) * 100).toFixed(1) + '%)' +
	// 		daysHtml);						
	// }
}

docReady(function() {
    defaultRegionCheck();
});