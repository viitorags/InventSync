class FeedbackSystem {
    constructor() {
        this.container = null;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        if (!document.body) {
            console.warn('Body not ready, retrying...');
            setTimeout(() => this.init(), 10000);
            return;
        }

        if (!document.querySelector('.feedback-container')) {
            this.container = document.createElement('div');
            this.container.className = 'feedback-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.feedback-container');
        }
    }

    show(message, type = 'info', duration = 10000) {
        if (!this.container) {
            this.init();
            if (!this.container) {
                console.error('Feedback container not initialized');
                return;
            }
        }

        const feedbackEl = document.createElement('div');
        feedbackEl.className = `feedback-message ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ',
        };

        feedbackEl.innerHTML = `
            <span class="feedback-icon">${icons[type] || icons.info}</span>
            <span class="feedback-text">${message}</span>
        `;

        this.container.appendChild(feedbackEl);

        setTimeout(() => {
            feedbackEl.remove();
        }, duration);
    }

    success(message, duration = 10000) {
        this.show(message, 'success', duration);
    }

    error(message, duration = 10000) {
        this.show(message, 'error', duration);
    }

    warning(message, duration = 10000) {
        this.show(message, 'warning', duration);
    }

    info(message, duration = 10000) {
        this.show(message, 'info', duration);
    }
}

window.feedback = new FeedbackSystem();
