let currentRegion;
let defaultRegion;

//
//  1.  Finds the status div tag on the popup and places contents inside
//      statusText inside.
//
function renderStatus(statusText) {

    document.getElementById("status").textContent = statusText;

}

//
//  2.  The docReady function is in its own file. Code within will fire once
//      the page has fully loaded.
//
docReady(function() {

    //
    //  1.  Initial setup of the port and btn. The port is used to communicate
    //        with the code in background.js.
    let port = chrome.runtime.connect({ name: "aws_region_popup" });

    //
    //  2.  btn is used do capture the save button on the
    //      change-region-popup.html.
    //
    let btn = document.getElementById("saveDefaultRegion");

    //
    //  3.  When the save button is clicked, send a message to the background
    //      script to save the default region.
    //
    if(btn)
    {
        btn.onclick = function(e) {

            port.postMessage({
                command: "SetDefaultRegion",
                region: currentRegion
            });

        };
    }

    //
    //  4.  Post two initial messages to the background script to get the
    //      default region from local storage and capture the current region
    //      from the web page. This helps initially setup the page.
    //
    port.postMessage({ command: "GetDefaultRegion" });
    port.postMessage({ command: "GetCurrentRegion" });

    //
    //  5.  Listen for messages on the chrome port. This allows for UI changes
    //      on the popup window.
    //
    port.onMessage.addListener(function(message, sender) {

        //
        //  1. Get a reference to the div tag to hold messages about region.
        //
        let currentRegionMessage = document.getElementById("currentRegionMessage");

        //
        //  2.  Read the command in a received message. If the default message
        //      was retrieved by the background script, set the page
        //      accordingly.
        //
        if (
            message &&
            message.command &&
            message.command === "DefaultRegion" &&
            message.response
        ) {
            currentRegionMessage.innerText = `Your saved region is: ${message.response}`;
            defaultRegion = message.response;
            btn.innerText = "Change Default Region";
        } else if (message.command === "DefaultRegionSaved") { // This shows a confirmation that the default region was saved to local storage

            renderStatus("Saved");

            port.postMessage({ command: "GetDefaultRegion" });

        } else if (
            message.command === "CurrentRegion"
        ) { // The current region has been retrieved by the background page

            currentRegion = message.response;

            //
            //  10. If there isn't a current region, the page hasn't
            //      refreshed and the aws-region script is not on the page
            //
            if(!currentRegion)
            {
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
