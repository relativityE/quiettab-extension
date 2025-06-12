// Injected script for QuietTab extension
// Runs in page context for deeper performance monitoring and script control

(function() {
  'use strict';

  class QuietTabInjected {
    constructor() {
      this.quietModeActive = false;
      this.originalFunctions = {};
      this.throttledElements = new Set();
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

      // Store original functions
      this.storeOriginalFunctions();
    }

    storeOriginalFunctions() {
      // Store original implementations
      this.originalFunctions = {
        requestAnimationFrame: window.requestAnimationFrame,
        setInterval: window.setInterval,
        setTimeout: window.setTimeout,
        fetch: window.fetch,
        XMLHttpRequest: window.XMLHttpRequest
      };
    }

    activateQuietMode() {
      if (this.quietModeActive) return;
      this.quietModeActive = true;

      console.log('QuietTab: Activating Quiet Mode');

      // Throttle animation frames
      this.throttleAnimationFrames();
      
      // Throttle network requests to ad domains
      this.throttleNetworkRequests();
      
      // Pause/slow down resource-heavy elements
      this.throttleMediaElements();
      
      // Throttle frequent DOM updates
      this.throttleDOMUpdates();
    }

    deactivateQuietMode() {
      if (!this.quietModeActive) return;
      this.quietModeActive = false;

      console.log('QuietTab: Deactivating Quiet Mode');

      // Restore original functions
      this.restoreOriginalFunctions();
      
      // Resume throttled elements
      this.resumeThrottledElements();
    }

    throttleAnimationFrames() {
      let frameCount = 0;
      window.requestAnimationFrame = (callback) => {
        frameCount++;
        // Only allow every 3rd frame (reduce from 60fps to ~20fps)
        if (frameCount % 3 === 0) {
          return this.originalFunctions.requestAnimationFrame.call(window, callback);
        }
        return this.originalFunctions.requestAnimationFrame.call(window, () => {});
      };
    }

    throttleNetworkRequests() {
      const adDomains = [
        'doubleclick.net',
        'googlesyndication.com',
        'googleadservices.com',
        'amazon-adsystem.com',
        'facebook.com',
        'google-analytics.com',
        'googletagmanager.com'
      ];

      // Throttle fetch requests
      window.fetch = (...args) => {
        const url = args[0];
        if (typeof url === 'string' && adDomains.some(domain => url.includes(domain))) {
          // Delay ad-related requests
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(this.originalFunctions.fetch.apply(window, args));
            }, 2000);
          });
        }
        return this.originalFunctions.fetch.apply(window, args);
      };

      // Throttle XMLHttpRequest
      const OriginalXHR = this.originalFunctions.XMLHttpRequest;
      window.XMLHttpRequest = function() {
        const xhr = new OriginalXHR();
        const originalOpen = xhr.open;
        
        xhr.open = function(method, url, ...args) {
          if (typeof url === 'string' && adDomains.some(domain => url.includes(domain))) {
            // Delay ad-related XHR requests
            setTimeout(() => {
              originalOpen.apply(this, [method, url, ...args]);
            }, 1500);
            return;
          }
          return originalOpen.apply(this, [method, url, ...args]);
        };
        
        return xhr;
      };
    }

    throttleMediaElements() {
      // Pause autoplay videos and reduce quality
      const videos = document.querySelectorAll('video[autoplay]');
      videos.forEach(video => {
        if (!video.paused) {
          video.pause();
          this.throttledElements.add(video);
          
          // Add visual indicator
          this.addQuietModeIndicator(video, 'Video paused by QuietTab');
        }
      });

      // Throttle canvas animations
      const canvases = document.querySelectorAll('canvas');
      canvases.forEach(canvas => {
        const context = canvas.getContext('2d');
        if (context) {
          // Reduce canvas update frequency
          const originalClearRect = context.clearRect;
          let clearCount = 0;
          context.clearRect = function(...args) {
            clearCount++;
            if (clearCount % 3 === 0) {
              return originalClearRect.apply(this, args);
            }
          };
        }
      });
    }

    throttleDOMUpdates() {
      // Throttle frequent DOM mutations that might be from ads
      const observer = new MutationObserver((mutations) => {
        let adRelatedMutations = 0;
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node;
                // Check if it looks like an ad
                if (this.isLikelyAdElement(element)) {
                  adRelatedMutations++;
                  if (adRelatedMutations > 5) {
                    // Too many ad-like elements being added, throttle
                    setTimeout(() => {
                      if (element.parentNode) {
                        element.style.display = 'none';
                        this.throttledElements.add(element);
                      }
                    }, 1000);
                  }
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      this.domObserver = observer;
    }

    isLikelyAdElement(element) {
      const adIndicators = [
        'ad', 'ads', 'advertisement', 'banner', 'sponsor',
        'promo', 'commercial', 'marketing'
      ];

      const className = element.className || '';
      const id = element.id || '';
      
      return adIndicators.some(indicator => 
        className.toLowerCase().includes(indicator) || 
        id.toLowerCase().includes(indicator)
      );
    }

    addQuietModeIndicator(element, message) {
      const indicator = document.createElement('div');
      indicator.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(59, 130, 246, 0.9);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-family: Arial, sans-serif;
        z-index: 10000;
        pointer-events: none;
      `;
      indicator.textContent = message;
      
      element.style.position = 'relative';
      element.appendChild(indicator);
      
      this.throttledElements.add(indicator);
    }

    restoreOriginalFunctions() {
      // Restore all original functions
      Object.keys(this.originalFunctions).forEach(key => {
        window[key] = this.originalFunctions[key];
      });
    }

    resumeThrottledElements() {
      // Resume all throttled elements
      this.throttledElements.forEach(element => {
        if (element.tagName === 'VIDEO') {
          element.play().catch(() => {}); // Ignore errors
        } else if (element.style) {
          element.style.display = '';
        }
        
        // Remove indicators
        if (element.parentNode && element.textContent && element.textContent.includes('QuietTab')) {
          element.remove();
        }
      });
      
      this.throttledElements.clear();
      
      // Disconnect DOM observer
      if (this.domObserver) {
        this.domObserver.disconnect();
      }
    }
  }

  // Initialize the injected script
  new QuietTabInjected();

})();

