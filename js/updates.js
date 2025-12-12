// Updates/Blog management
class Updates {
    constructor() {
        this.updates = [];
    }

    async init() {
        try {
            await this.loadUpdates();
            this.render();
        } catch (error) {
            console.error('Error initializing updates:', error);
            this.showError('Failed to load updates');
        }
    }

    async loadUpdates() {
        const response = await fetch('data/updates.json');
        if (!response.ok) throw new Error('Failed to load updates');
        const data = await response.json();
        this.updates = data.updates || [];
    }

    render() {
        const container = document.getElementById('updates-container');

        if (this.updates.length === 0) {
            container.innerHTML = '<div class="loading">No updates yet. Check back soon!</div>';
            return;
        }

        // Sort updates by date (most recent first)
        const sortedUpdates = [...this.updates].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        const updatesList = document.createElement('div');
        updatesList.className = 'updates-list';

        sortedUpdates.forEach(update => {
            const updateCard = document.createElement('div');
            updateCard.className = 'update-card';

            updateCard.innerHTML = `
                <div class="update-header">
                    <h3 class="update-title">${this.escapeHtml(update.title)}</h3>
                    <span class="update-date">${this.formatDate(update.date)}</span>
                </div>
                <div class="update-content">
                    ${this.formatContent(update.content)}
                </div>
            `;

            updatesList.appendChild(updateCard);
        });

        container.innerHTML = '';
        container.appendChild(updatesList);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatContent(content) {
        // Convert line breaks to paragraphs
        return content
            .split('\n\n')
            .map(para => `<p>${this.escapeHtml(para)}</p>`)
            .join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        const container = document.getElementById('updates-container');
        container.innerHTML = `<div class="error">${message}</div>`;
    }

    async refresh() {
        await this.init();
    }
}

// Initialize updates
let updates;
document.addEventListener('DOMContentLoaded', () => {
    updates = new Updates();
    updates.init();
});
