var currentRegion;

chrome.runtime.onConnect.addListener(function(port) {
  port.postMessage({ greeting: "hello" });

  //
  //    1. Listen for messages on the chrome port from both the popup and the aws-region.js.
  //
  port.onMessage.addListener(function(message, sender) {
    
    // Which script send me the message?
    switch (sender.name) {
      case "aws_region":
        switch (message.command) {
          case "GetDefaultRegion":
            getDefaultRegion(port);
            break;

          case "SetCurrentRegion":
            currentRegion = message.region;
            break;
        }

        break;

      case "aws_region_popup":
        if (!message || !message.command) return;

        switch (message.command) {
          case "GetDefaultRegion":
            getDefaultRegion(port);

            break;

          case "SetDefaultRegion":
            setDefaultRegion(message.region, port);
            sendContentSavedRegion(message.region);

            break;

          case "GetCurrentRegion":
            port.postMessage({
              command: "CurrentRegion",
              response: currentRegion
            });

            break;
        }

        break;
    }
  });
});

//
//    2.  When the extension first starts, set it so that it only listens and injects code into AWS comsole page
//
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "aws.amazon.com" }
          })
        ],
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

//
//    3. Grabs the default region from local storage and posts a message to return it to the necessary script that called for it
//
function getDefaultRegion(port) {
  chrome.storage.sync.get("DefaultRegion", function(items) {
    if (items) {
      port.postMessage({
        command: "DefaultRegion",
        response: items.DefaultRegion
      });
    } else {
      return false;
    }
  });
}

//
//    4. Saves the default region that the user chose to local browser storage.
//
function setDefaultRegion(region, port) {
  chrome.storage.sync.set({ DefaultRegion: region }, function() {
    port.postMessage({ 
      command: "DefaultRegion",
      response: region });
  });  
}

//
//    5. This function sends a tab-wide message to any open tab in the current window that has the AWS console open, with the payload being the default region.
//
function sendContentSavedRegion(region) {
  chrome.tabs.query({
    currentWindow: true,
    url: "*://*.aws.amazon.com/*"
  }, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, {
        command: "DefaultRegion",
        response: region
      });
    });
  });
}
