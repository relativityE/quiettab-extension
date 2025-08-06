// Background script for QuietTab extension
// Handles performance monitoring coordination and data storage

class QuietTabBackground {
  constructor() {
    this.performanceData = new Map();
    this.quietModeActive = new Map();
    this.init();
  }

  init() {
    // Listen for messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Listen for tab updates to reset monitoring
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'loading') {
        this.resetTabData(tabId);
      }
    });

    // Clean up data when tabs are closed
    chrome.tabs.onRemoved.addListener((tabId) => {
      this.cleanupTabData(tabId);
    });
  }

  async handleMessage(message, sender, sendResponse) {
    const tabId = sender.tab?.id;

    switch (message.type) {
      case 'PERFORMANCE_UPDATE':
        this.updatePerformanceData(tabId, message.data);
        sendResponse({ success: true });
        break;

      case 'GET_PERFORMANCE_DATA':
        const data = this.getPerformanceData(message.tabId || tabId);
        sendResponse({ data });
        break;

      case 'TOGGLE_QUIET_MODE':
        const newStatus = await this.toggleQuietMode(message.tabId || tabId);
        sendResponse({ success: true, status: newStatus });
        break;

      case 'GET_QUIET_MODE_STATUS':
        const status = this.getQuietModeStatus(message.tabId || tabId);
        sendResponse({ active: status });
        break;

      case 'INJECT_MONITORING':
        await this.injectMonitoring(tabId);
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ error: 'Unknown message type' });
    }
  }

  updatePerformanceData(tabId, data) {
    if (!tabId) return;
    
    this.performanceData.set(tabId, {
      ...data,
      timestamp: Date.now()
    });
  }

  getPerformanceData(tabId) {
    if (!tabId) return null;
    return this.performanceData.get(tabId) || null;
  }

  async toggleQuietMode(tabId) {
    if (!tabId) return false;

    // Ensure the content script is ready before sending a message.
    // This is a robust way to avoid "Receiving end does not exist" errors.
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js'],
      });
    } catch (e) {
      console.warn(`QuietTab: Could not inject script into tab ${tabId}. This is expected on special pages like chrome://. Error: ${e.message}`);
    }

    // Ensure the content script is ready before sending a message.
    // This is a robust way to avoid "Receiving end does not exist" errors.
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js'],
      });
    } catch (e) {
      console.warn(`QuietTab: Could not inject script into tab ${tabId}. This is expected on special pages like chrome://. Error: ${e.message}`);
    }

    const currentStatus = this.quietModeActive.get(tabId) || false;
    const newStatus = !currentStatus;
    
    this.quietModeActive.set(tabId, newStatus);

    // Enable or disable the declarativeNetRequest ruleset
    if (newStatus) {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ["ruleset_1"]
      });
    } else {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ["ruleset_1"]
      });
    }

    // Send message to content script to update its state
    try {
      await chrome.tabs.sendMessage(tabId, {
        type: 'SET_QUIET_MODE',
        active: newStatus
      });
    } catch (error) {
      // This can still fail if the content script is not listening for some reason,
      // but the injection above makes it much less likely.
      console.debug('Failed to send quiet mode status to content script:', error.message);
    }

    return newStatus;
  }

  getQuietModeStatus(tabId) {
    if (!tabId) return false;
    return this.quietModeActive.get(tabId) || false;
  }

  async injectMonitoring(tabId) {
    if (!tabId) return;

    try {
      // Inject the monitoring script
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['injected.js']
      });
    } catch (error) {
      console.error('Failed to inject monitoring script:', error);
    }
  }

  resetTabData(tabId) {
    if (!tabId) return;
    this.performanceData.delete(tabId);
    this.quietModeActive.delete(tabId);
  }

  cleanupTabData(tabId) {
    this.resetTabData(tabId);
  }
}

// Initialize the background script
new QuietTabBackground();

