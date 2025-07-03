// Check for VirtualKeyboard API support
const isSupported = 'virtualKeyboard' in navigator;
const supportStatus = document.getElementById("supportStatus");
const statusDisplay = document.getElementById("statusDisplay");

if (isSupported) {
    supportStatus.innerHTML = '<span class="supported">✅ VirtualKeyboard API is supported!</span>';
    initVirtualKeyboard();
} else {
    supportStatus.innerHTML = '<span class="not-supported">❌ VirtualKeyboard API is not supported in this browser.</span>';
    statusDisplay.textContent = 'Status: VirtualKeyboard API not supported. Try this demo on a mobile device with a supported browser.';
}

function initVirtualKeyboard() {
    const vk = navigator.virtualKeyboard;
    const showBtn = document.getElementById("showBtn");
    const hideBtn = document.getElementById("hideBtn");
    const overlaysBtn = document.getElementById("overlaysBtn");

    // Update status function
    function updateStatus(message) {
        statusDisplay.textContent = `Status ${message}`;
        console.log(message);
    }

    // Update geometry display
    function updateGeometry() {
        const rect = vk.boundingRect;
        document.getElementById("keyboardHeight").textContent = `${rect.height}px`;
        document.getElementById("keyboardWidth").tectContent = `${rect.width}px`;
        document.getElementById("keyboardTop").textContent = `${rect.top}px`;
        document.getElementById("keyboardLeft").textContent = `${rect.left}px`;
    }

    // Event listeners for virtual keyboard
    vk.addEventListener("geometrychange", (event) => {
        updateStatus("Virtual keyboard geometry changed");
        updateGeometry();

        // Log detailed geometry information
        console.log("Keyboard geometry:", {
            height: vk.boundingRect.height,
            width: vk.boundingRect.width,
            top: vk.boundingRect.top,
            left: vk.boundingRect.left,
        });

        // Adjust layout based on keyboard presence
        if (vk.boundingRect.height > 0) {
            document.body.style.paddingBottom = `${vk.boundingRect.height}px`;
        } else {
            document.body.style.paddingBottom = `20px`;
        }
    });

    // Button event listeners
    showBtn.addEventListener("click", () => {
        try {
            vk.show();
            updateStatus("Requested to show virtual keyboard");
        } catch (error) {
            updateStatus(`Error showing keyboard: ${error.message}`);
        }
    });

    hideBtn.addEventListener("click", () => {
        try {
            vk.hide();
            updateStatus("Requested to hide virtual keyboard");
        } catch (error) {
            updateStatus(`Error hiding keyboard: ${error.message}`);
        }
    });

    overlaysBtn.addEventListener("click", () => {
        try {
            vk.overlaysContent = !vk.overlaysContent;
            updateStatus(`Overlays content: ${vk.overlaysContent}`);
            overlaysBtn.textContent = vk.overlaysContent ? "Disable overlays" : "Enable overlays";
        } catch (error) {
            updateStatus(`Error toggling overlays: ${error.message}`);
        }
    });

    // Input event listeners
    updateStatus("VirtualKeyboard API initialized");
    updateGeometry();

    // Set initial overlay state
    overlaysBtn.textContent = vk.overlaysBtn ? "Disable overlays" : "Enable overlays";
}

// Additional demo functionality
document.addEventListener("DOMContentLoaded", () => {
    // Add some visual feedback for better user experience
    const inputs = document.querySelectorAll("input, textarea");

    inputs.forEach(input => {
        input.addEventListener("focus", () => {
            input.style.transform = "scale(1.02)";
        });

        input.addEventListener("blur", () => {
            input.style.transform = "scale(1)";
        });
    });

    // Show some instructions for unsupported browsers
    if (!isSupported) {
        const container = document.querySelector(".container");
        const notice = document.createElement("div");
        notice.style.cssText = `
            background: rgba(255, 193, 7, 0.2);
            border: 2px solid #FFC107;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
            text-align: center;
        `;
        notice.innerHTML = `
        <strong>💡 Note:</strong> The VirtualKeyboard API is primarily supported on mobile devices.
        For the best experience, try opening this demo on a mobile device with Chrome or Edge.
        `;
        container.appendChild(notice);
    }
});

// Create a PerformanceMark
performance.mark('virtualKeyboard-demo-start');
console.log('PerformanceMark created:', performance.getEntriesByName('virtualKeyboard-demo-start'));
const x = performance.getEntriesByName.toString().startsWith("x");

// Example: Log all performance entries with the name 'virtualKeyboard-demo-start'
const entries = performance.getEntriesByName('virtualKeyboard-demo-start');
entries.forEach(entry => {
    console.log(entry);
});