var defaultRegion;
var currentRegion;

//This line opens up a long-lived connection to your background page.
var port = chrome.runtime.connect({ name: "aws_region" });
port.postMessage({ command: "GetDefaultRegion" });

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

function alertOnDifference() {
  var regionLabel = getRegionLabel();

  if (currentRegion &&
    defaultRegion &&
    (currentRegion !== "Global") &&
    currentRegion !== defaultRegion) {
      if (!regionLabel.className.includes("aws-wrong-region-warning")) {
        regionLabel.className = regionLabel.className + " aws-wrong-region-warning";
      }
  } else {
   regionLabel.className = regionLabel.className.replace(" aws-wrong-region-warning", "");
  }
}

port.onMessage.addListener(function(message, sender) {
  defaultRegionCheck();

  if (message.command && message.command === "DefaultRegion") {
    defaultRegion = message.response;
    alertOnDifference();
  }
});

chrome.runtime.onMessage.addListener(function(message, sender) {
  defaultRegionCheck();

  if (message.command && message.command === "DefaultRegion") {
    defaultRegion = message.response;
    alertOnDifference();
  }
});

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

docReady(function() {
  defaultRegionCheck();  
});
