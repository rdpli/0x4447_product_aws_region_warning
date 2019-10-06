var currentRegion;
var defaultRegion;

function renderStatus(statusText) {
  document.getElementById("status").textContent = statusText;
}

docReady(function() {
  var port = chrome.runtime.connect({ name: "aws_region_popup" });
  var btn = document.getElementById("saveDefaultRegion");

  if (btn) {
    btn.onclick = function(e) {
      port.postMessage({
        command: "SetDefaultRegion",
        region: currentRegion
      });
    };
  }

  port.postMessage({ command: "GetDefaultRegion" });
  port.postMessage({ command: "GetCurrentRegion" });

  port.onMessage.addListener(function(message, sender) {
    var currentRegionMessage = document.getElementById("currentRegionMessage");

    if (
      message &&
      message.command &&
      message.command === "DefaultRegion" &&
      message.response
    ) {
      currentRegionMessage.innerText = `Your saved region is: ${message.response}`;
      defaultRegion = message.response;
      btn.innerText = "Change Default Region";
    } else if (message.command === "DefaultRegionSaved") {
      renderStatus("Saved");
      port.postMessage({ command: "GetDefaultRegion" });
    } else if (
      message.command === "CurrentRegion"
    ) {
      currentRegion = message.response;

      if (!currentRegion) {
        renderStatus(
          "Please refresh the page to use this extension."
        );

        btn.style = "display: none";

        return;
      }

      btn.value = `Use ${currentRegion}`;      
    }
  });
});
