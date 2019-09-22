function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
  }
  console.log('before docReady popup');
  
  docReady(function() {
  console.log('popup docReady');
  
    // renderStatus("keystone: DOMContentLoaded loaded");
  
    var port = chrome.runtime.connect({name:"aws_region_popup"});
    
    var btn = document.getElementById('saveDefaultRegion');
  
    if (btn) {
      btn.onclick = function (e) {
        port.postMessage({command: "SetDefaultRegion", region: document.getElementById('defaultRegion').value})
      };
    }
    
    port.postMessage({ command: "GetDefaultRegion" });
    port.postMessage({ command: "GetCurrentRegion" });

    port.onMessage.addListener(function(message,sender){
        var defaultRegionInput = document.getElementById('defaultRegion');

        if (message.command && message.command === "DefaultRegion" && message.response) {      
            defaultRegionInput.value = message.response;
        }      
        else if (message.command === 'DefaultRegionSaved') {
            renderStatus("Saved");
        } else if (message.command === 'CurrentRegion') {
            renderStatus('No default region is saved. Your current region is ' + message.response);
            // if (!defaultRegionInput) {
                defaultRegionInput.value = message.response;
            // }
        }
    });
  
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     var timer = new chrome.Interval();
    //     timer.start();
    
        // var port = chrome.tabs.connect(tabs[0].id);
        // // port.postMessage({counter: 1});
        // port.onMessage.addListener(function getResp(response) {
        //   renderStatus("response rcvd " + response);
        // });
    // });
    // getCurrentTabUrl(function(url) {
    //   // Put the image URL in Google search.
    //   renderStatus('Performing Google Image search for ' + url);
  
    //   getImageUrl(url, function(imageUrl, width, height) {
  
    //     renderStatus('Search term: ' + url + '\n' +
    //         'Google image search result: ' + imageUrl);
    //     var imageResult = document.getElementById('image-result');
    //     // Explicitly set the width/height to minimize the number of reflows. For
    //     // a single image, this does not matter, but if you're going to embed
    //     // multiple external images in your page, then the absence of width/height
    //     // attributes causes the popup to resize multiple times.
    //     imageResult.width = width;
    //     imageResult.height = height;
    //     imageResult.src = imageUrl;
    //     imageResult.hidden = false;
  
    //   }, function(errorMessage) {
    //     renderStatus('Cannot display image. ' + errorMessage);
    //   });
    // });
  });
  