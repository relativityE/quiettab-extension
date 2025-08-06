class QuietTabTestPage {
  constructor() {
    this.activeSimulations = new Set();
    this.intervals = new Map();
    this.animationFrames = new Set();
    this.quietModeActive = false;

    this.init();
  }

  init() {
    document.getElementById("start-simulation").addEventListener("click", () => this.startSimulation());
    document.getElementById("stop-simulation").addEventListener("click", () => this.stopSimulation());
    document.getElementById("toggle-quiet-mode").addEventListener("click", () => this.toggleQuietMode());
  }

  startSimulation() {
    const log = document.getElementById("log-output");
    log.innerText = "Starting CPU simulation... Sent message to content script.";

    // This message will be picked up by the content script
    window.postMessage({ type: 'QUIETTAB_START_SIMULATION', source: 'test-page' }, '*');
  }

  stopSimulation() {
    const log = document.getElementById("log-output");
    log.innerText = "Stopping simulation... Sent message to content script.";

    // This message will be picked up by the content script
    window.postMessage({ type: 'QUIETTAB_STOP_SIMULATION', source: 'test-page' }, '*');
  }

  toggleQuietMode() {
    chrome.runtime.sendMessage({ type: "TOGGLE_QUIET_MODE" }, (res) => {
      const log = document.getElementById("log-output");
      if (chrome.runtime.lastError) {
        log.innerText = "Error: " + chrome.runtime.lastError.message;
      } else {
        log.innerText = "Quiet mode toggled: " + res?.status;
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", () => new QuietTabTestPage());
