# QuietTab Chrome Extension

**Tagline:** "Shut down noisy ads. Reclaim your browser. Instantly."

QuietTab is a Chrome extension that shows you exactly what's making your browser slow, hot, and loud - then fixes it with one click. Unlike traditional ad blockers that work invisibly, QuietTab is a **performance monitor with blocking capabilities** that gives you real-time visibility into resource-heavy scripts and provides instant relief without breaking websites.

## Features

### 🔍 Real-time Performance Monitoring
- Shows the top 3 resource-heavy scripts currently running on your active tab
- Visual indicators show relative impact with simple, user-friendly labels
- Identifies "Heavy Ad Scripts", "Tracking Networks", "Video Ads", and more

### ⚡ Instant Quiet Mode
- **One-click performance relief** - the hero feature
- Blocks the most resource-heavy, privacy-invading scripts and trackers
- Provides immediate feedback with noticeable performance improvements
- Users should feel the difference immediately (fan stops, browser feels snappier)

### 🛡️ Safe & Smart Operation
- Uses **modern, safe blocking** via Chrome's Declarative Net Request API
- No risky script injections or page modifications that can cause breakage
- Easy "Deactivate" functionality to restore normal operation if needed

### 📊 Performance Impact Visualization
- Simple before/after indicators show resource usage changes
- Visual feedback reinforces the value delivered
- Color-coded impact levels (High, Medium, Low)

## Getting Started

This guide covers how to download, install, run, and test the QuietTab extension.

### 1. Download and Install

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/relativityE/quiettab-extension.git
    cd quiettab-extension
    ```
2.  **(Optional) Install dependencies:** This project has no external dependencies, but it's good practice to run `npm install`.
    ```bash
    npm install
    ```

### 2. Run the Extension in Developer Mode

1.  **Open Chrome Extensions:** Navigate to `chrome://extensions`.
2.  **Enable Developer Mode:** Turn on the "Developer mode" toggle in the top-right corner.
3.  **Load the Extension:**
    *   Click "Load unpacked".
    *   Select the `quiettab-extension` folder you cloned earlier.
4.  **Pin the Extension:** Click the puzzle icon in the toolbar, find QuietTab, and click the pin icon to keep it visible.

### 3. Running Unit Tests

This project uses a browser-based test runner for its unit tests.

1.  **Load the extension** as described in the previous step.
2.  **Find the Extension ID** on the `chrome://extensions` page.
3.  **Open the test runner:** In a new tab, navigate to `chrome-extension://<YOUR_EXTENSION_ID>/test-runner.html`, replacing `<YOUR_EXTENSION_ID>` with the actual ID.
4.  The page will display the results of the automated unit tests.

### 4. Manual & E2E Testing

For manual testing and to see the extension in action, a special test page is provided.

1.  **Open the Test Page:** Click the QuietTab icon in the toolbar to open the popup, then click the "Test Page" link at the bottom.
2.  **Start the Simulation:** On the test page, click the "Start Simulation" button. This will start a CPU-intensive script that the extension can detect.
3.  **Use QuietTab:** While the simulation is running, use the QuietTab popup to activate and deactivate "Quiet Mode" and observe the effects on the test page and the extension's UI.

## Usage

### Basic Usage

1. **Click the QuietTab Icon:**
   - Look for the QuietTab icon in your Chrome toolbar
   - Click it to open the performance monitor popup

2. **Monitor Performance:**
   - The extension automatically analyzes the current tab
   - View real-time data about resource-heavy scripts
   - See which scripts are impacting your browser's performance

3. **Activate Quiet Mode:**
   - Click the "Activate" button in the Instant Quiet Mode section
   - Feel immediate performance improvements
   - Monitor the impact statistics to see the difference

### Understanding the Interface

- **Status Indicator:** Shows current monitoring status (Monitoring/Quiet Mode)
- **Resource Activity:** Lists the top 3 resource-heavy scripts with impact levels
- **Instant Quiet Mode:** One-click toggle for performance relief
- **Performance Impact:** Shows CPU and network usage improvements when active
- **Test Page Button:** Opens a demonstration page to test QuietTab's effectiveness

### When to Use Quiet Mode

- Your laptop fan starts spinning on simple websites
- Browser feels sluggish for no apparent reason
- Battery drains faster than expected during browsing
- Laptop gets hot from basic web browsing
- You notice excessive network activity from ads/trackers

## Technical Details

### How It Works

1. **Performance Monitoring:**
   - The content script (`content.js`) still uses the PerformanceObserver API to monitor resources and identify resource-heavy scripts for display in the popup.
   - This monitoring is **read-only** and does not modify the page.

2. **Script Blocking (Quiet Mode):**
   - When "Quiet Mode" is activated, the extension enables a set of rules using Chrome's `declarativeNetRequest` API.
   - These rules block network requests to known ad, tracking, and analytics domains.
   - This approach is managed by Chrome, is extremely efficient, and does not require injecting risky scripts to modify page behavior.

3. **Safe Operation:**
   - The blocking mechanism is the one recommended by Google for Manifest V3 extensions, ensuring safety and performance.
   - Deactivating "Quiet Mode" instantly disables the blocking rules, restoring normal network requests.

### Browser Compatibility

- **Supported:** Chrome 88+ (Manifest V3 compatible)
- **Permissions Required:**
  - `activeTab`: Monitor current tab performance
  - `scripting`: Inject monitoring scripts
  - `storage`: Save user preferences
  - `tabs`: Access tab information

## Troubleshooting

### Extension Not Working

1. **Check Permissions:**
   - Ensure the extension has all required permissions
   - Try refreshing the page and reopening the popup

2. **Reload Extension:**
   - Go to `chrome://extensions/`
   - Click the refresh icon on the QuietTab extension
   - Refresh any open tabs

3. **Check Console:**
   - Open Developer Tools (F12)
   - Check the Console tab for any error messages
   - Report issues with console logs

### Website Issues After Using Quiet Mode

1. **Deactivate Quiet Mode:**
   - Click the QuietTab icon
   - Click "Deactivate" to restore normal operation

2. **Refresh the Page:**
   - Reload the page to reset all scripts
   - Try browsing normally

3. **Report Compatibility Issues:**
   - Note which website had issues
   - Include steps to reproduce the problem

## Privacy & Security

- **No Data Collection:** QuietTab does not collect or transmit any personal data
- **Local Processing:** All analysis happens locally in your browser
- **No External Servers:** No data is sent to external servers
- **Open Source:** Code is available for review and audit


## Contributing

This is a proof-of-concept implementation. For production use, consider:

1. **Enhanced Detection:** Improve resource attribution accuracy
2. **User Preferences:** Add customizable throttling levels
3. **Site Whitelisting:** Allow users to exclude specific sites
4. **Performance Analytics:** Provide detailed performance reports
5. **Cross-browser Support:** Extend to Firefox and other browsers

## License

This project is provided as-is for educational and demonstration purposes.

## Support

For issues, questions, or feedback:
- Check the troubleshooting section above
- Review the browser console for error messages
- Ensure you're using a supported Chrome version (88+)

---

**Remember:** QuietTab is a **performance tool that happens to block ads** rather than an **ad blocker that happens to improve performance**. This positioning makes it genuinely differentiated and valuable for users frustrated with browser performance.