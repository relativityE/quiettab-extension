// Popup script for QuietTab extension
// Handles UI interactions and displays performance data

class QuietTabPopup {
  constructor() {
    this.currentTabId = null;
    this.performanceData = null;
    this.quietModeActive = false;
    this.init();
  }

  async init() {
    // Get current tab
    await this.getCurrentTab();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Load initial data
    await this.loadData();
    
    // Update UI every 2 seconds
    setInterval(() => {
      this.loadData();
    }, 2000);
  }

  async getCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTabId = tab?.id;
    } catch (error) {
      console.error('Failed to get current tab:', error);
    }
  }

  setupEventListeners() {
    // Quiet Mode toggle
    const toggleButton = document.getElementById('toggleButton');
    toggleButton.addEventListener('click', () => {
      this.toggleQuietMode();
    });

    // Test button
    const testButton = document.getElementById('testButton');
    testButton.addEventListener('click', () => {
      this.openTestPage();
    });

    // Settings button
    const settingsButton = document.getElementById('settingsButton');
    settingsButton.addEventListener('click', () => {
      this.openSettings();
    });

    // Help button
    const helpButton = document.getElementById('helpButton');
    helpButton.addEventListener('click', () => {
      this.openHelp();
    });
  }

  async loadData() {
    if (!this.currentTabId) return;

    // Check if extension context is still valid
    if (!chrome.runtime?.id) {
      this.showError('Extension context invalidated. Please reload the extension.');
      return;
    }

    try {
      // Get performance data
      const response = await chrome.runtime.sendMessage({
        type: 'GET_PERFORMANCE_DATA',
        tabId: this.currentTabId
      });

      if (response && response.data) {
        this.performanceData = response.data;
        this.updatePerformanceDisplay();
      }

      // Get quiet mode status
      const statusResponse = await chrome.runtime.sendMessage({
        type: 'GET_QUIET_MODE_STATUS',
        tabId: this.currentTabId
      });

      this.quietModeActive = (statusResponse && statusResponse.active) || false;
      this.updateQuietModeDisplay();

    } catch (error) {
      console.error('Failed to load data:', error);
      if (error.message.includes('Extension context invalidated')) {
        this.showError('Extension reloaded. Please close and reopen this popup.');
      } else {
        this.showError('Failed to communicate with extension');
      }
    }
  }

  updatePerformanceDisplay() {
    const resourceList = document.getElementById('resourceList');

    if (!this.performanceData || !this.performanceData.topResources || this.performanceData.topResources.length === 0) {
      resourceList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">✅</div>
          <div class="empty-state-text">No resource-heavy scripts detected.<br><strong>Your browser is running smoothly!</strong></div>
        </div>
      `;
      return;
    }

    const resourcesHtml = this.performanceData.topResources.map(resource => {
      const impact = this.calculateImpact(resource);
      const impactClass = impact.level.toLowerCase();

      return `
        <div class="resource-item ${impactClass}-impact fade-in">
          <div class="resource-info">
            <div class="resource-type">${this.escapeHtml(resource.type)}</div>
            <div class="resource-details">
              ${this.formatSize(resource.size)} • ${this.formatDuration(resource.duration)}
            </div>
          </div>
          <div class="resource-impact ${impactClass}">${impact.label}</div>
        </div>
      `;
    }).join('');

    resourceList.innerHTML = resourcesHtml;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  calculateImpact(resource) {
    const totalImpact = (resource.size || 0) + (resource.duration || 0) * 1000;
    
    if (totalImpact > 500000 || resource.suspicious) {
      return { level: 'High', label: 'High' };
    } else if (totalImpact > 100000) {
      return { level: 'Medium', label: 'Medium' };
    } else {
      return { level: 'Low', label: 'Low' };
    }
  }

  formatSize(bytes) {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatDuration(ms) {
    if (!ms) return '0ms';
    if (ms < 1000) return Math.round(ms) + 'ms';
    return Math.round(ms / 1000 * 100) / 100 + 's';
  }

  updateQuietModeDisplay() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const toggleButton = document.getElementById('toggleButton');
    const toggleIcon = document.getElementById('toggleIcon');
    const toggleText = document.getElementById('toggleText');
    const quietModeCard = document.getElementById('quietModeCard');
    const quietModeDescription = document.getElementById('quietModeDescription');
    const impactSection = document.getElementById('impactSection');

    if (this.quietModeActive) {
      // Quiet mode is active
      statusDot.className = 'status-dot quiet';
      statusText.textContent = 'Quiet Mode';
      toggleButton.className = 'toggle-button active';
      toggleIcon.textContent = '🔊';
      toggleText.textContent = 'Deactivate';
      quietModeCard.className = 'quiet-mode-card active';
      quietModeDescription.textContent = 'Resource-heavy scripts are being throttled for better performance';
      impactSection.style.display = 'block';
      
      // Update impact stats
      this.updateImpactStats();
    } else {
      // Quiet mode is inactive
      statusDot.className = 'status-dot';
      statusText.textContent = 'Monitoring';
      toggleButton.className = 'toggle-button';
      toggleIcon.textContent = '🔇';
      toggleText.textContent = 'Activate';
      quietModeCard.className = 'quiet-mode-card';
      quietModeDescription.textContent = 'Throttle resource-heavy scripts for immediate performance relief';
      impactSection.style.display = 'none';
    }
  }

  updateImpactStats() {
    const cpuFill = document.getElementById('cpuFill');
    const cpuValue = document.getElementById('cpuValue');
    const networkFill = document.getElementById('networkFill');
    const networkValue = document.getElementById('networkValue');

    // Simulate performance improvements
    cpuFill.style.width = '30%';
    cpuFill.className = 'stat-fill';
    cpuValue.textContent = 'Reduced';

    networkFill.style.width = '20%';
    networkFill.className = 'stat-fill';
    networkValue.textContent = 'Throttled';
  }

  async toggleQuietMode() {
    if (!this.currentTabId) return;

    // Check if extension context is still valid
    if (!chrome.runtime?.id) {
      this.showError('Extension context invalidated. Please reload the extension.');
      return;
    }

    try {
      await chrome.runtime.sendMessage({
        type: 'TOGGLE_QUIET_MODE',
        tabId: this.currentTabId
      });

      // Update status immediately
      this.quietModeActive = !this.quietModeActive;
      this.updateQuietModeDisplay();

      // Show feedback
      this.showFeedback(this.quietModeActive ? 'Quiet Mode activated!' : 'Quiet Mode deactivated!');

    } catch (error) {
      console.error('Failed to toggle quiet mode:', error);
      if (error.message.includes('Extension context invalidated')) {
        this.showError('Extension reloaded. Please close and reopen this popup.');
      } else {
        this.showError('Failed to toggle Quiet Mode');
      }
    }
  }

  showFeedback(message, type = 'success') {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b';

    feedback.style.cssText = `
      position: fixed;
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
      background: ${bgColor};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideInDown 0.3s ease;
    `;
    feedback.textContent = message;

    // Add slide in animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInDown {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.animation = 'slideInDown 0.3s ease reverse';
      setTimeout(() => {
        feedback.remove();
        style.remove();
      }, 300);
    }, 2500);
  }

  showError(message = 'Something went wrong') {
    const resourceList = document.getElementById('resourceList');
    resourceList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-text">${message}</div>
      </div>
    `;
  }

  openTestPage() {
    // Open test page in a new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL('test-page.html')
    });
    this.showFeedback('Test page opened! Try the simulations.');
  }

  openSettings() {
    // Open settings page (could be implemented later)
    this.showFeedback('Settings coming soon!', 'info');
  }

  openHelp() {
    // Open help page
    chrome.tabs.create({
      url: 'https://github.com/quiettab/help'
    });
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new QuietTabPopup();
});

