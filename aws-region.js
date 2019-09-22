var defaultRegion;
var currentRegion;

//This line opens up a long-lived connection to your background page.
var port = chrome.runtime.connect({ name: "aws_region" });
port.postMessage({ command: "GetDefaultRegion" });

port.onMessage.addListener(function(message, sender) {
  if (message.command && message.command === "DefaultRegion") {
    defaultRegion = message.response;

    if (currentRegion && defaultRegion && currentRegion !== defaultRegion) {
      var regionArea = document.getElementById("nav-regionMenu");
      regionArea.className = regionArea.className + " aws-wrong-region-warning";
    }
  }
});

function defaultRegionCheck() {
  var regionArea = document.getElementById("nav-regionMenu");

  if (regionArea) {
    var regionLabel = regionArea.getElementsByClassName("nav-elt-label");

    if (regionLabel) {
      var region = regionLabel[0].innerText;
      currentRegion = region;

      port.postMessage({
        command: "SetCurrentRegion",
        region: region
      });
    }
  }
}

docReady(function() {
  defaultRegionCheck();
});
