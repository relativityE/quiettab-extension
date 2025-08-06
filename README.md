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

## Installation

### Method 1: Load Unpacked Extension (Developer Mode) - RECOMMENDED

1. **Enable Developer Mode in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

2. **Load the Extension:**
   - Click "Load unpacked"
   - Select the `quiettab-extension` folder
   - The QuietTab extension should now appear in your extensions list

3. **Pin the Extension:**
   - Click the puzzle piece icon in Chrome's toolbar
   - Find QuietTab and click the pin icon to keep it visible

4. **Test the Extension:**
   - Click the QuietTab icon to open the popup
   - Click "🧪 Test Page" to open the demonstration page
   - Try the resource-heavy simulations to see QuietTab in action!

### Method 2: Package and Install

1. **Create Extension Package:**
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select the `quiettab-extension` folder as the root directory
   - Click "Pack Extension" to create a `.crx` file

2. **Install the Package:**
   - Drag and drop the `.crx` file onto the `chrome://extensions/` page
   - Click "Add extension" when prompted

## Usage

### Getting Started

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

### Testing QuietTab

**IMPORTANT:** Use the built-in test page to see QuietTab in action!

1. **Open Test Page:**
   - Click the QuietTab icon in your toolbar
   - Click "🧪 Test Page" button
   - This opens a special demonstration page

2. **Run Simulations:**
   - Click "💥 START ALL" to simulate heavy resource usage
   - Watch CPU usage spike and animations go crazy
   - Notice your browser becoming sluggish

3. **Activate QuietTab:**
   - Click the QuietTab icon while simulations are running
   - Click "Activate" to enable Quiet Mode
   - **Immediately see the difference:**
     - CPU usage drops dramatically
     - Animations slow down
     - Memory blocks turn green
     - Browser becomes responsive again

4. **Visual Feedback:**
   - Green memory blocks show optimized resources
   - Slower animations indicate throttling is working
   - CPU meter shows reduced usage
   - Performance impact cards show before/after comparison

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

## Development

### File Structure

```
quiettab-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for coordination
├── content.js            # Content script for page monitoring
├── injected.js           # Page context script for deep monitoring
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

### Key Components

- **Background Script:** Coordinates between popup and content scripts, manages blocking rules.
- **Content Script:** Monitors page performance for display in the popup.
- **Injected Script:** No longer used for throttling, kept for potential future features.
- **Popup Interface:** Displays data and controls for users.

### Running Tests

Due to limitations in some development environments, this project uses a browser-based test runner instead of a command-line tool like Jest.

1. **Load the Extension:** Make sure the extension is loaded in Chrome as an unpacked extension.
2. **Open the Test Runner:**
   - After loading the extension, note the **Extension ID** from the `chrome://extensions` page.
   - Open a new tab and navigate to: `chrome-extension://<YOUR_EXTENSION_ID>/test-runner.html`
   - Replace `<YOUR_EXTENSION_ID>` with the actual ID of the extension.
3. **View Results:** The page will display the results of the automated unit tests.

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