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
        region: document.getElementById("defaultRegion").value
      });
    };
  }

  port.postMessage({ command: "GetDefaultRegion" });
  port.postMessage({ command: "GetCurrentRegion" });

  port.onMessage.addListener(function(message, sender) {
    var defaultRegionInput = document.getElementById("defaultRegion");

    if (
      message.command &&
      message.command === "DefaultRegion" &&
      message.response
    ) {
      renderStatus('');
      defaultRegionInput.value = message.response;
      btn.innerText = "Change Default Region";
    } else if (message.command === "DefaultRegionSaved") {
      renderStatus("Saved");
      port.postMessage({ command: "GetDefaultRegion" });
    } else if (
      message.command === "CurrentRegion" &&
      !defaultRegionInput.value
    ) {
      renderStatus(
        "No default region is saved. Your current region is " + message.response
      );
      defaultRegionInput.value = message.response;
    }
  });
});
