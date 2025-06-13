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
- Automatically throttles the most resource-heavy non-essential scripts
- Provides immediate feedback with noticeable performance improvements
- Users should feel the difference immediately (fan stops, browser feels snappier)

### 🛡️ Safe & Smart Operation
- Prioritizes **throttling over blocking** to minimize page breakage
- Internal safelist protects essential scripts (payment, login, core functionality)
- Easy "Undo" functionality to restore normal operation if needed

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
   - Uses Chrome's PerformanceObserver API for resource monitoring
   - Monitors network requests, long tasks, and resource usage
   - Identifies suspicious patterns in script behavior

2. **Script Throttling:**
   - Reduces execution frequency of resource-heavy scripts
   - Throttles animation frames from 60fps to ~20fps
   - Delays ad-related network requests
   - Pauses autoplay videos and reduces canvas update frequency

3. **Safe Operation:**
   - Maintains a safelist of essential scripts
   - Prioritizes throttling over complete blocking
   - Provides easy restoration of normal operation

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

- **Background Script:** Coordinates between popup and content scripts
- **Content Script:** Monitors page performance and manages throttling
- **Injected Script:** Runs in page context for deeper script control
- **Popup Interface:** Displays data and controls for users

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