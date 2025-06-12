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
        await this.toggleQuietMode(message.tabId || tabId);
        sendResponse({ success: true });
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
    if (!tabId) return;

    const currentStatus = this.quietModeActive.get(tabId) || false;
    const newStatus = !currentStatus;
    
    this.quietModeActive.set(tabId, newStatus);

    // Send message to content script to activate/deactivate quiet mode
    try {
      await chrome.tabs.sendMessage(tabId, {
        type: 'SET_QUIET_MODE',
        active: newStatus
      });
    } catch (error) {
      console.error('Failed to toggle quiet mode:', error);
    }
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

