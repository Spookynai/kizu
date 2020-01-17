
'use strict';

let deferredInstallPrompt = null;
const installButton = document.getElementById('butInstall');
installButton.addEventListener('click', installPWA);

// Add event listener for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

/**
* Event handler for beforeinstallprompt event.
*   Saves the evnt & shows install button/
*@param {Event} evt
*/
function saveBeforeInstallPromptEvent(evt) {
  deferredInstallPrompt = evt;
  installButton.removeAttribute('hidden');
}

/**
* Event handler for butInstall - Does the PWA installation
*
*@param {Event} evt
*/
function installPWA(evt) {
  // Show install prompt
  deferredInstallPrompt.prompt();
  
  // Hide the install button, it can't be called twice.
  evt.srcElement.setAttribute("hidden", true);
  
  // Log user response to prompt.
  deferredInstallPrompt.userChoice.then(choice => {
    if (choice.outcome === "accepted") {
      console.log("User accepted the A2HS prompt", choice);
    } else {
      console.log("User dismissed the A2HS prompt", choice);
    }
    deferredInstallPrompt = null;
  });
} // installPWA

// Add event listener for appinstalled event
window.addeventListener('appinstalled', logAppInstalled);

/*
* Event handler for appinstalled event.
*   Log the installation to analytics or save the event somehow.
*
*@param {Event} evt
*/
function logAppInstalled(evt) {
  // Log the event, in a real app, you would save this information
  // in a file, database, or analytics software
  console.log('Kizuna was Installed.', evt);
}