var defaultRegion;
var currentRegion;

//
//    1.  This line opens up a long-lived connection to your background page.
//
var port = chrome.runtime.connect({ name: "aws_region" });
port.postMessage({ command: "GetDefaultRegion" });

//
//    2.  This script resides with the AWS Console scripts. This function finds the current region on the Console page.
//
function getRegionLabel() {
  var regionArea = document.getElementById("nav-regionMenu");

  if (!regionArea) {
    return null;
  }
  
  var regionLabels = regionArea.getElementsByClassName("nav-elt-label");

  if (regionLabels) {
      return regionLabels[0];
  }

  return null;
}

//
//    3.   This function finds the region and compares the saved region to the current one, changing the CSS styles of the region if necessary.
//
function alertOnDifference() {
  var regionLabel = getRegionLabel();

  if (currentRegion &&
    defaultRegion &&
    (currentRegion !== "Global") &&
    currentRegion !== defaultRegion) {
      regionLabel.className = regionLabel.className.replace(" aws-correct-region", "");

      if (!regionLabel.className.includes("aws-wrong-region-warning")) {
        regionLabel.className = regionLabel.className + " aws-wrong-region-warning";
      }
  } else {    
    regionLabel.className = regionLabel.className.replace(" aws-wrong-region-warning", "");
    
    if (!regionLabel.className.includes("aws-correct-region")) {
      regionLabel.className = regionLabel.className + " aws-correct-region";
    }
  }
}

//
//    4.  Listens for local messages from the background script. If the degault region changes, this fires, does the comparison and changes the color of the region
//
port.onMessage.addListener(function(message, sender) {
  defaultRegionCheck();

  if (message.command && message.command === "DefaultRegion") {
    defaultRegion = message.response;
    alertOnDifference();
  }
});

//
//    5.  Listens for messages sent to an active tab. If the degault region changes, this fires, does the comparison and changes the color of the region
//
chrome.runtime.onMessage.addListener(function(message, sender) {
  defaultRegionCheck();

  if (message.command && message.command === "DefaultRegion") {
    defaultRegion = message.response;
    alertOnDifference();
  }
});

//
//    6. Gets the current region from the HTML and checks to see if the region is the same as saved or not. It also sends the current region to any listeners.
//
function defaultRegionCheck() {
  var regionLabel = getRegionLabel();

  if (regionLabel) {
    var region = regionLabel.innerText;
    currentRegion = region;

    alertOnDifference();

    port.postMessage({
      command: "SetCurrentRegion",
      region: region
    });
  }
}

//
//    7. Runs the check above when the page has fully loaded
//
docReady(function() {
  defaultRegionCheck();  
});
