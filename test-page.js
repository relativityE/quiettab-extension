// JavaScript for QuietTab Test Page - Modernized and Simplified

// Global variables for simulation intervals and states
let cpuInterval = null;
let memoryInterval = null;
let networkInterval = null;
let canvasAnimationId = null;
let quietModeActive = false;

// UI Elements
const cpuPercentageElement = document.getElementById("cpuPercentage");
const cpuFillElement = document.getElementById("cpuFill");
const cpuStatusElement = document.getElementById("cpuStatus");
const spinnerContainer = document.getElementById("spinnerContainer");
const flashGrid = document.getElementById("flashGrid");
const memoryBlocksContainer = document.getElementById("memoryBlocks");
const networkActivityLog = document.getElementById("networkActivity");
const demoCanvas = document.getElementById("demoCanvas");
const performanceLog = document.getElementById("performanceLog");
const beforeValue = document.getElementById("beforeValue");
const afterValue = document.getElementById("afterValue");

// Canvas context
const ctx = demoCanvas.getContext("2d");
let particles = [];
const PARTICLE_COUNT = 500; // Number of particles for canvas chaos

// --- Utility Functions ---
function logPerformance(message, type = "info") {
  const logEntry = document.createElement("div");
  logEntry.innerHTML = `[${new Date().toLocaleTimeString()}] <span class="log-${type}">${message}</span>`;
  performanceLog.prepend(logEntry); // Add to top
  // Limit log size
  if (performanceLog.children.length > 50) {
    performanceLog.removeChild(performanceLog.lastChild);
  }
}

function updateStatus(message, type = "good") {
  const statusElement = document.getElementById("status");
  statusElement.textContent = `Status: ${message}`;
  statusElement.className = `status ${type}`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Simulation Functions ---

// Heavy CPU Load Simulation
function startHeavyAnimations() {
  if (cpuInterval) return;
  updateStatus("Heavy CPU load active - Browser under stress!", "bad");
  logPerformance("Starting heavy CPU load simulation...", "warning");

  // Simulate CPU usage increase
  let currentCpu = 5;
  cpuInterval = setInterval(() => {
    currentCpu = Math.min(95, currentCpu + getRandomInt(5, 10));
    updateCpuDisplay(currentCpu);
  }, 200);

  // Start spinners
  spinnerContainer.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    spinnerContainer.appendChild(spinner);
  }
  document.getElementById("spinnerBox").classList.add("active");
}

function stopHeavyAnimations() {
  clearInterval(cpuInterval);
  cpuInterval = null;
  updateCpuDisplay(5); // Reset CPU display
  spinnerContainer.innerHTML = ""; // Remove spinners
  document.getElementById("spinnerBox").classList.remove("active");
  logPerformance("Heavy CPU load simulation stopped.");
}

function updateCpuDisplay(percentage) {
  cpuPercentageElement.textContent = `${percentage}%`;
  cpuFillElement.style.width = `${percentage}%`;
  if (percentage > 70) {
    cpuStatusElement.textContent = "Critical - Browser struggling!";
    cpuFillElement.style.background = "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)";
  } else if (percentage > 40) {
    cpuStatusElement.textContent = "High CPU usage - Performance impacted";
    cpuFillElement.style.background = "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)";
  } else {
    cpuStatusElement.textContent = "Normal - Browser running smoothly";
    cpuFillElement.style.background = "linear-gradient(90deg, #10b981 0%, #059669 100%)";
  }
}

// Memory Stress Simulation
function startMemoryStress() {
  if (memoryInterval) return;
  updateStatus("Memory stress active - High RAM usage!", "bad");
  logPerformance("Starting memory stress simulation...", "warning");

  // Fill memory blocks
  memoryBlocksContainer.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const block = document.createElement("div");
    block.className = "memory-block";
    memoryBlocksContainer.appendChild(block);
  }

  let usedBlocks = 0;
  memoryInterval = setInterval(() => {
    if (usedBlocks < 15) { // Simulate up to 15 red blocks
      memoryBlocksContainer.children[usedBlocks].classList.add("used");
      usedBlocks++;
    } else {
      clearInterval(memoryInterval);
      memoryInterval = null;
    }
  }, 300);
}

function stopMemoryStress() {
  clearInterval(memoryInterval);
  memoryInterval = null;
  // Reset memory blocks to green/optimized state
  Array.from(memoryBlocksContainer.children).forEach(block => {
    block.classList.remove("used");
    block.classList.add("optimized");
  });
  logPerformance("Memory stress simulation stopped. Memory optimized.");
}

// Network Flood Simulation (Ad Networks)
function simulateAdRequests() {
  if (networkInterval) return;
  updateStatus("Network flood active - Simulating ad requests!", "bad");
  logPerformance("Starting network flood simulation...", "warning");

  flashGrid.innerHTML = "";
  for (let i = 0; i < 24; i++) {
    const flashBox = document.createElement("div");
    flashBox.className = "flash-box";
    flashGrid.appendChild(flashBox);
  }
  document.getElementById("flashBox").classList.add("active");

  let requestCount = 0;
  networkInterval = setInterval(() => {
    const requestType = ["ad-script.js", "tracker.js", "analytics.js", "banner.gif"][getRandomInt(0, 3)];
    const requestUrl = `https://example.com/${requestType}?id=${Date.now()}`;
    const logEntry = document.createElement("div");
    logEntry.className = "network-request";
    logEntry.textContent = `GET ${requestUrl}`;
    networkActivityLog.prepend(logEntry);
    requestCount++;
    if (networkActivityLog.children.length > 10) {
      networkActivityLog.removeChild(networkActivityLog.lastChild);
    }
  }, 100);
}

function stopAdRequests() {
  clearInterval(networkInterval);
  networkInterval = null;
  flashGrid.innerHTML = ""; // Remove flashing boxes
  document.getElementById("flashBox").classList.remove("active");
  networkActivityLog.innerHTML = "<div>Network activity normal.</div>";
  logPerformance("Network flood simulation stopped.");
}

// Canvas Chaos Simulation
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Bounce off walls
    if (this.x + this.radius > demoCanvas.width || this.x - this.radius < 0) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y + this.radius > demoCanvas.height || this.y - this.radius < 0) {
      this.velocity.y = -this.velocity.y;
    }
  }
}

function initCanvasParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const radius = getRandomInt(2, 5);
    const x = getRandomInt(radius, demoCanvas.width - radius);
    const y = getRandomInt(radius, demoCanvas.height - radius);
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    };
    particles.push(new Particle(x, y, radius, color, velocity));
  }
}

function animateCanvas() {
  canvasAnimationId = requestAnimationFrame(animateCanvas);
  ctx.clearRect(0, 0, demoCanvas.width, demoCanvas.height);

  particles.forEach((particle) => {
    particle.update();
  });
}

function startCanvasAnimation() {
  if (canvasAnimationId) return;
  updateStatus("Canvas chaos active - High GPU usage!", "bad");
  logPerformance("Starting intensive canvas animation...", "warning");
  initCanvasParticles();
  animateCanvas();
}

function stopCanvasAnimation() {
  cancelAnimationFrame(canvasAnimationId);
  canvasAnimationId = null;
  ctx.clearRect(0, 0, demoCanvas.width, demoCanvas.height);
  logPerformance("Canvas animation stopped.");
}

// --- Main Control Functions ---

function startAllEffects() {
  logPerformance("Starting ALL simulations for maximum stress!", "critical");
  startHeavyAnimations();
  startMemoryStress();
  simulateAdRequests();
  startCanvasAnimation();
  updateStatus("ALL tests active - Browser under extreme stress!", "bad");
}

function stopAll() {
  logPerformance("Stopping ALL simulations. System returning to normal.", "info");
  stopHeavyAnimations();
  stopMemoryStress();
  stopAdRequests();
  stopCanvasAnimation();
  updateStatus("All tests stopped - System returning to normal", "good");
  // Reset performance impact display
  beforeValue.textContent = "95%";
  afterValue.textContent = "25%";
}

function activateQuietTab() {
  if (quietModeActive) {
    // Deactivate QuietTab
    quietModeActive = false;
    logPerformance("QuietTab DEACTIVATED. Simulations will run at full intensity.", "info");
    // Restore full speed animations
    Array.from(spinnerContainer.children).forEach(s => s.classList.remove("slow"));
    Array.from(flashGrid.children).forEach(f => f.classList.remove("slow"));
    Array.from(memoryBlocksContainer.children).forEach(block => {
      block.classList.remove("optimized");
      if (block.classList.contains("used")) {
        block.classList.add("used"); // Re-add if it was used
      }
    });
    // Reset canvas animation speed (if applicable, though canvas is hard to throttle directly)
    // For now, just visually indicate
    beforeValue.textContent = "95%";
    afterValue.textContent = "25%";
    updateStatus("QuietTab DEACTIVATED. Browser performance may degrade.", "warning");

  } else {
    // Activate QuietTab
    quietModeActive = true;
    logPerformance("QuietTab ACTIVATED! Optimizing performance...", "success");
    // Slow down animations
    Array.from(spinnerContainer.children).forEach(s => s.classList.add("slow"));
    Array.from(flashGrid.children).forEach(f => f.classList.add("slow"));
    // Optimize memory blocks
    Array.from(memoryBlocksContainer.children).forEach(block => {
      block.classList.remove("used");
      block.classList.add("optimized");
    });
    // Update performance impact display
    beforeValue.textContent = "95%"; // Example before value
    afterValue.textContent = "15%"; // Example optimized value
    updateStatus("QuietTab ACTIVE - Performance Optimized!", "good");
  }
}

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  // Initialize memory blocks to optimized state
  for (let i = 0; i < 20; i++) {
    const block = document.createElement("div");
    block.className = "memory-block optimized";
    memoryBlocksContainer.appendChild(block);
  }

  // Set up event listeners for buttons
  document.querySelector(".button[onclick='startHeavyAnimations()']").addEventListener("click", startHeavyAnimations);
  document.querySelector(".button[onclick='startFrequentTimers()']").addEventListener("click", startMemoryStress);
  document.querySelector(".button[onclick='simulateAdRequests()']").addEventListener("click", simulateAdRequests);
  document.querySelector(".button[onclick='startCanvasAnimation()']").addEventListener("click", startCanvasAnimation);
  document.querySelector(".button[onclick='startAllEffects()']").addEventListener("click", startAllEffects);
  document.querySelector(".button.danger[onclick='stopAll()']").addEventListener("click", stopAll);
  document.querySelector(".button[onclick='activateQuietTab()']").addEventListener("click", activateQuietTab);

  // Initial log message
  logPerformance("Test page loaded. Ready for simulations.");
});


