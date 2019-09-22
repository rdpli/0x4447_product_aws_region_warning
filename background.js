var currentRegion;

chrome.runtime.onConnect.addListener(function(port){
    port.postMessage({greeting:'hello'});
  
    port.onMessage.addListener(function(message, sender) {
        console.log('back listener', message, sender);
        
        switch (sender.name) {
            case 'aws_region':
                aws_region_content_port = port;
                
                switch (message.command) {
                    case 'GetDefaultRegion':
                        getDefaultRegion(port);
                        break;

                    case 'SetCurrentRegion':
                        currentRegion = message.region;                        
                        break;
              }
  
  
                break;
  
            case 'aws_region_popup':
                aws_region_popup_port = port;
  
                if (!message || !message.command) return;
  
                switch (message.command) {
                    case 'GetDefaultRegion':
                        getDefaultRegion(port);
                    
                        break;
  
                    case 'SetDefaultRegion':
  
                        setDefaultRegion(message.defaultRegion, port);
  
                        break;
  
                    case 'GetCurrentRegion':
                        console.log('back GetCurrentRegion', currentRegion);
                        
                        port.postMessage({ command: 'CurrentRegion', response: currentRegion });

                        break;
                
                    case 'Authenticate':
                        console.log('Authenticating');
  
  
                        break;
                }
  
                break;
        }
    });
  });
  
  chrome.runtime.onInstalled.addListener(function() {
   // Replace all rules ...
   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
     // With a new rule ...
      chrome.declarativeContent.onPageChanged.addRules([
        {        
          conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                  pageUrl: { urlContains: 'aws.amazon.com' },
            })
          ],
          // And shows the extension's page action.
          actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }
      ]);
    });
  });
  
  
  function getDefaultRegion(port) {
  
      chrome.storage.sync.get('DefaultRegion', function(items) {
          if (items) {
              console.log('got region ' + items.DefaultRegion);
              port.postMessage({ command: 'DefaultRegion', response: items.DefaultRegion });
          }
          else {
              return false;
          }
      });
  }
  
  function setDefaultRegion(completionDate, port) {
      chrome.storage.sync.set({'DefaultRegion': completionDate}, function() {
            port.postMessage({ command: 'DefaultRegionSaved' })
          });
  }
  
  function loggedIn() {
      chrome.storage.sync.get('votingKey', function(items) {
          if (items) {
              votingKey = items.votingKey;
  
              return true;
          }
          else {
              return false;
          }
      });
  }
  
  // if (!this.loggedIn()) {
  // 	console.log('Not logged in');
  // }