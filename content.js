// Content script for QuietTab extension
// Monitors page performance and manages script throttling

class QuietTabMonitor {
  constructor() {
    this.resourceData = [];
    this.observer = null;
    this.performanceObserver = null;
    this.quietModeActive = false;
    this.throttledScripts = new Set();
    this.originalSetInterval = window.setInterval;
    this.originalSetTimeout = window.setTimeout;
    this.init();
  }

  init() {
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true;
    });

    // Start monitoring when page is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startMonitoring());
    } else {
      this.startMonitoring();
    }

    // Inject monitoring script into page context
    this.injectPageScript();
  }

  handleMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'SET_QUIET_MODE':
        this.setQuietMode(message.active);
        sendResponse({ success: true });
        break;
      
      case 'GET_CURRENT_DATA':
        sendResponse({ data: this.getCurrentData() });
        break;

      default:
        sendResponse({ error: 'Unknown message type' });
    }
  }

  startMonitoring() {
    this.monitorResources();
    this.monitorPerformance();
    this.sendPerformanceUpdate();
    
    // Update performance data every 3 seconds
    setInterval(() => {
      this.sendPerformanceUpdate();
    }, 3000);
  }

  monitorResources() {
    // Monitor network requests
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'resource') {
          this.analyzeResource(entry);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
      this.performanceObserver = observer;
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  monitorPerformance() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'longtask') {
              this.analyzeLongTask(entry);
            }
          });
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        console.warn('Long task monitoring not supported:', error);
      }
    }
  }

  analyzeResource(entry) {
    // Identify potentially problematic resources
    const suspiciousPatterns = [
      /doubleclick/i,
      /googlesyndication/i,
      /facebook\.com\/tr/i,
      /google-analytics/i,
      /googletagmanager/i,
      /amazon-adsystem/i,
      /adsystem/i,
      /ads\./i,
      /analytics/i,
      /tracking/i
    ];

    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(entry.name)
    );

    if (isSuspicious || entry.transferSize > 100000) { // Large resources
      this.resourceData.push({
        name: entry.name,
        type: this.categorizeResource(entry.name),
        size: entry.transferSize || 0,
        duration: entry.duration || 0,
        suspicious: isSuspicious,
        timestamp: Date.now()
      });

      // Keep only recent data
      this.resourceData = this.resourceData.slice(-50);
    }
  }

  analyzeLongTask(entry) {
    // Track long-running tasks that might be from ads/trackers
    console.log('Long task detected:', entry.duration + 'ms');
  }

  categorizeResource(url) {
    if (/ads|doubleclick|googlesyndication/i.test(url)) {
      return 'Heavy Ad Scripts';
    } else if (/analytics|tracking|facebook\.com\/tr/i.test(url)) {
      return 'Tracking Networks';
    } else if (/video|media/i.test(url)) {
      return 'Video Ads';
    } else {
      return 'Unknown Scripts';
    }
  }

  getCurrentData() {
    // Get top 3 resource-heavy items
    const sortedResources = this.resourceData
      .sort((a, b) => (b.size + b.duration) - (a.size + a.duration))
      .slice(0, 3);

    return {
      topResources: sortedResources,
      totalResources: this.resourceData.length,
      quietModeActive: this.quietModeActive,
      timestamp: Date.now()
    };
  }

  sendPerformanceUpdate() {
    // Check if extension context is still valid
    if (!chrome.runtime?.id) {
      return; // Extension context invalidated, skip update
    }

    const data = this.getCurrentData();
    try {
      chrome.runtime.sendMessage({
        type: 'PERFORMANCE_UPDATE',
        data: data
      }).catch(error => {
        // Extension might be reloading, ignore errors
        console.debug('QuietTab: Failed to send performance update:', error.message);
      });
    } catch (error) {
      // Extension context invalidated
      console.debug('QuietTab: Extension context invalidated, stopping updates');
    }
  }

  setQuietMode(active) {
    this.quietModeActive = active;
    
    if (active) {
      this.activateQuietMode();
    } else {
      this.deactivateQuietMode();
    }
  }

  activateQuietMode() {
    // Send message to injected script to throttle page scripts
    window.postMessage({
      type: 'QUIETTAB_ACTIVATE',
      source: 'content-script'
    }, '*');
  }

  deactivateQuietMode() {
    // Send message to injected script to restore normal operation
    window.postMessage({
      type: 'QUIETTAB_DEACTIVATE',
      source: 'content-script'
    }, '*');
  }

  injectPageScript() {
    // Inject script into page context for deeper monitoring
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.onload = function() {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  }
}

// Initialize the monitor if in a browser context
if (typeof window !== 'undefined') {
  new QuietTabMonitor();
}

// Export for testing
if (typeof module !== 'undefined') {
  module.exports = QuietTabMonitor;
}

