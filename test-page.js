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
    log.innerText = "Starting CPU simulation...";

    const intervalId = setInterval(() => {
      const n = Math.random() * 100000;
      for (let i = 0; i < n; i++) Math.sqrt(i);
    }, 100);

    this.intervals.set("cpu", intervalId);
  }

  stopSimulation() {
    const log = document.getElementById("log-output");
    log.innerText = "Stopped simulation.";

    this.intervals.forEach(clearInterval);
    this.intervals.clear();
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
