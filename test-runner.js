// Simple Browser-Based Test Runner for QuietTab

(function() {
  const resultsContainer = document.getElementById('results');
  let testsPassed = 0;
  let testsFailed = 0;

  // --- Test Suite ---
  console.log('Starting QuietTab tests...');

  // Helper function to run a test
  function test(description, testFn) {
    try {
      testFn();
      logPass(description);
    } catch (error) {
      logFail(description, error);
    }
  }

  // --- Tests for QuietTabMonitor ---
  if (typeof QuietTabMonitor !== 'undefined') {
    const monitor = new QuietTabMonitor();

    test('QuietTabMonitor: categorizeResource should identify ad scripts', () => {
      const url = 'https://www.doubleclick.net/ad.js';
      assertEqual(monitor.categorizeResource(url), 'Heavy Ad Scripts');
    });

    test('QuietTabMonitor: categorizeResource should identify tracking scripts', () => {
      const url = 'https://www.google-analytics.com/analytics.js';
      assertEqual(monitor.categorizeResource(url), 'Tracking Networks');
    });

    test('QuietTabMonitor: categorizeResource should identify video ads', () => {
      const url = 'https://ad.video.com/media.mp4';
      assertEqual(monitor.categorizeResource(url), 'Video Ads');
    });

    test('QuietTabMonitor: categorizeResource should identify unknown scripts', () => {
      const url = 'https://www.example.com/main.js';
      assertEqual(monitor.categorizeResource(url), 'Unknown Scripts');
    });

  } else {
    logFail('QuietTabMonitor class is not defined.');
  }

  // --- Summary ---
  logSummary();


  // --- Helper Functions ---
  function assertEqual(actual, expected) {
    if (actual !== expected) {
      throw new Error(`Assertion Failed: Expected "${expected}", but got "${actual}"`);
    }
  }

  function log(content) {
    const p = document.createElement('pre');
    p.innerHTML = content;
    resultsContainer.appendChild(p);
  }

  function logPass(description) {
    testsPassed++;
    log(`<span class="pass">PASS:</span> ${description}`);
  }

  function logFail(description, error) {
    testsFailed++;
    log(`<span class="fail">FAIL:</span> ${description}\n  ${error.stack || error}`);
  }

  function logSummary() {
    const summary = `\n--- Summary ---\nTests Passed: ${testsPassed}\nTests Failed: ${testsFailed}`;
    const summaryEl = document.createElement('h3');
    if (testsFailed > 0) {
        summaryEl.style.color = 'red';
    } else {
        summaryEl.style.color = 'green';
    }
    summaryEl.textContent = `Tests Complete: ${testsPassed} passed, ${testsFailed} failed.`;
    resultsContainer.appendChild(document.createElement('hr'));
    resultsContainer.appendChild(summaryEl);
  }

})();
