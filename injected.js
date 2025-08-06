// Injected script for QuietTab extension
// Runs in page context for deeper performance monitoring and script control

(function() {
  'use strict';

  class QuietTabInjected {
    constructor() {
      this.quietModeActive = false;
      this.init();
    }

    init() {
      // Listen for messages from content script
      window.addEventListener('message', (event) => {
        if (event.source !== window) return;
        
        if (event.data.type === 'QUIETTAB_ACTIVATE' && event.data.source === 'content-script') {
          this.activateQuietMode();
        } else if (event.data.type === 'QUIETTAB_DEACTIVATE' && event.data.source === 'content-script') {
          this.deactivateQuietMode();
        }
      });
    }

    activateQuietMode() {
      if (this.quietModeActive) return;
      this.quietModeActive = true;
      console.log('QuietTab: Quiet Mode Activated (Injected Script)');
      // The dangerous monkey-patching has been removed.
      // Future, safer implementations could be added here.
    }

    deactivateQuietMode() {
      if (!this.quietModeActive) return;
      this.quietModeActive = false;
      console.log('QuietTab: Quiet Mode Deactivated (Injected Script)');
      // The dangerous monkey-patching has been removed.
      // Future, safer implementations could be added here.
    }
  }

  // Initialize the injected script
  new QuietTabInjected();

})();
