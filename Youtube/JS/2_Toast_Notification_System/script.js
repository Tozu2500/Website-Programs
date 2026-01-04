
// Sample messages for the toast notification
const toasts = {
    success: {
        title: 'Success!',
        messages: [
            'Your action was completed successfully',
            'File uploaded successfully',
            'Changes saved successfully',
            'Operation completed'
        ],
        icon: '✓'
    },

    error: {
        title: 'Error!',
        messages: [
            'Something went wrong',
            'Failed to complete action',
            'Network connection lost',
            'Unable to process request'
        ],
        icon: '✕'
    },

    warning: {
        title: 'Warning!',
        messages: [
            'Please review your input',
            'Action requires confirmation',
            'Low disk space detected',
            'Session about to expire'
        ],
        icon: '⚠'
    },

    info: {
        title: 'Info',
        messages: [
            'New update available',
            'Maintenance scheduled for tonight',
            '3 new notifications',
            'System status: All system operational'
        ],
        icon: 'ℹ'
    }
};

function showToast(type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const config = toasts[type];
    const randomMessage = config.messages[Math.floor(Math.random() * config.messages.length)];

    toast.innerHTML = `
        <div class="toast-icon">${config.icon}</div>
        <div class="toast-content">
            <div class="toast-title">${config.title}</div>
            <div class="toast-message">${randomMessage}</div>
        </div>
        <button class="toast-close" onclick="removeToast(this)">×</button>
        <div class="progress-bar"></div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        removeToast(toast);
    }, 3000);
}

function removeToast(element) {
    const toast = element.classList ? element : element.parentElement;
    toast.classList.add('removing');

    setTimeout(() => {
        toast.remove();
    }, 400);
}

