// QuietTab Popup Script - Clean and Simple

class QuietTabPopup {
  constructor() {
    this.currentTabId = null;
    this.quietModeActive = false;
    this.init();
  }

  async init() {
    await this.getCurrentTabInfo();
    this.setupEventListeners();
    await this.loadData();
    
    // Update every 3 seconds
    setInterval(() => {
      this.loadData();
    }, 3000);
  }

  async getCurrentTabInfo() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTabId = tab?.id;
      
      const currentSiteElement = document.getElementById("currentSite");
      if (currentSiteElement && tab?.url) {
        const hostname = new URL(tab.url).hostname;
        currentSiteElement.textContent = hostname;
      }
    } catch (error) {
      console.error("Failed to get current tab info:", error);
      const currentSiteElement = document.getElementById("currentSite");
      if (currentSiteElement) {
        currentSiteElement.textContent = "Unable to access site";
      }
    }
  }

  setupEventListeners() {
    const toggleButton = document.getElementById("toggleButton");
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        this.toggleQuietMode();
      });
    }

    const testPageLink = document.getElementById("testPageLink");
    if (testPageLink) {
      testPageLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.openTestPage();
      });
    }

    const helpLink = document.getElementById("helpLink");
    if (helpLink) {
      helpLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.openHelp();
      });
    }
  }

  async loadData() {
    if (!this.currentTabId) return;

    if (!chrome.runtime?.id) {
      this.showError("Extension needs to be reloaded");
      return;
    }

    try {
      // Get performance data
      const response = await chrome.runtime.sendMessage({
        type: "GET_PERFORMANCE_DATA",
        tabId: this.currentTabId,
      });

      if (response && response.data) {
        this.updateMetrics(response.data);
      }

      // Get quiet mode status
      const statusResponse = await chrome.runtime.sendMessage({
        type: "GET_QUIET_MODE_STATUS",
        tabId: this.currentTabId,
      });

      this.quietModeActive = (statusResponse && statusResponse.active) || false;
      this.updateUI();

    } catch (error) {
      console.error("Failed to load data:", error);
      // Silently handle errors to keep UI clean
    }
  }

  updateMetrics(data) {
    const blockedCountElement = document.getElementById("blockedCount");
    const performanceGainElement = document.getElementById("performanceGain");

    if (blockedCountElement) {
      blockedCountElement.textContent = data.blockedCount || "0";
    }
    if (performanceGainElement) {
      performanceGainElement.textContent = `${data.performanceGain || 0}%`;
    }
  }

  updateUI() {
    const statusIndicator = document.getElementById("statusIndicator");
    const statusText = document.getElementById("statusText");
    const statusDescription = document.getElementById("statusDescription");
    const siteStatus = document.getElementById("siteStatus");
    const toggleButton = document.getElementById("toggleButton");

    if (this.quietModeActive) {
      // Active state
      if (statusIndicator) {
        statusIndicator.classList.remove("inactive");
        statusIndicator.classList.add("active");
        statusIndicator.textContent = "✓";
      }
      
      if (statusText) statusText.textContent = "QuietTab Active";
      if (statusDescription) statusDescription.textContent = "Page performance is being optimized";
      if (siteStatus) siteStatus.textContent = "Performance optimized • Scripts throttled";
      
      if (toggleButton) {
        toggleButton.textContent = "Deactivate QuietTab";
        toggleButton.classList.remove("inactive");
      }
    } else {
      // Inactive state
      if (statusIndicator) {
        statusIndicator.classList.remove("active");
        statusIndicator.classList.add("inactive");
        statusIndicator.textContent = "🔇";
      }
      
      if (statusText) statusText.textContent = "QuietTab Inactive";
      if (statusDescription) statusDescription.textContent = "Click below to optimize this page's performance";
      if (siteStatus) siteStatus.textContent = "Monitoring page performance...";
      
      if (toggleButton) {
        toggleButton.textContent = "Activate QuietTab";
        toggleButton.classList.add("inactive");
      }
    }
  }

  async toggleQuietMode() {
    if (!this.currentTabId) return;

    if (!chrome.runtime?.id) {
      this.showError("Extension needs to be reloaded");
      return;
    }

    try {
      await chrome.runtime.sendMessage({
        type: "TOGGLE_QUIET_MODE",
        tabId: this.currentTabId,
      });

      // Update state immediately for responsive UI
      this.quietModeActive = !this.quietModeActive;
      this.updateUI();

    } catch (error) {
      console.error("Failed to toggle quiet mode:", error);
      this.showError("Failed to toggle QuietTab");
    }
  }

  showError(message) {
    const siteStatus = document.getElementById("siteStatus");
    if (siteStatus) {
      siteStatus.textContent = `Error: ${message}`;
      siteStatus.style.color = "#ef4444";
    }
  }

  openTestPage() {
    chrome.tabs.create({
      url: chrome.runtime.getURL("test-page.html"),
    });
  }

  openHelp() {
    chrome.tabs.create({
      url: "https://github.com/relativityE/quiettab-extension/blob/main/README.md",
    });
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new QuietTabPopup();
});

