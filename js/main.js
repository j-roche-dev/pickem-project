// Main application logic and navigation
class App {
    constructor() {
        this.currentSection = 'leaderboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.handleHashChange();

        // Listen for hash changes (for browser back/forward)
        window.addEventListener('hashchange', () => this.handleHashChange());
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Save scroll position before navigation
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

                const target = link.getAttribute('href').substring(1);
                this.navigateToSection(target);

                // Force scroll position to stay the same
                window.scrollTo(0, currentScroll);

                // Use requestAnimationFrame to ensure scroll stays put
                requestAnimationFrame(() => {
                    window.scrollTo(0, currentScroll);
                });
            });
        });
    }

    navigateToSection(sectionId) {
        // Update URL hash without triggering scroll using history API
        history.pushState(null, null, '#' + sectionId);

        // Update active states
        this.updateActiveStates(sectionId);

        // Show the selected section
        this.showSection(sectionId);
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1);
        const section = hash || 'leaderboard';
        this.updateActiveStates(section);
        this.showSection(section);
    }

    updateActiveStates(sectionId) {
        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            const target = link.getAttribute('href').substring(1);
            if (target === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show the target section using data attribute
        const targetSection = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
