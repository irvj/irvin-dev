// Theme toggle with localStorage persistence
(function() {
	const STORAGE_KEY = 'theme-preference';

	// Get theme from localStorage or system preference
	function getThemePreference() {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return stored;
		}

		// Check system preference
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		}

		return 'light';
	}

	// Apply theme to document
	function applyTheme(theme) {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem(STORAGE_KEY, theme);
	}

	// Toggle between themes
	function toggleTheme() {
		const current = getThemePreference();
		const next = current === 'light' ? 'dark' : 'light';
		applyTheme(next);
		updateToggleButton(next);
	}

	// Update toggle button text/state
	function updateToggleButton(theme) {
		const button = document.getElementById('theme-toggle');
		if (button) {
			// Moon icon for light mode (click to switch to dark)
			const moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>';
			// Sun icon for dark mode (click to switch to light)
			const sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';

			button.innerHTML = theme === 'light' ? moonIcon : sunIcon;
			button.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
		}
	}

	// Initialize theme on page load
	const initialTheme = getThemePreference();
	applyTheme(initialTheme);

	// Set up toggle button when DOM is ready
	document.addEventListener('DOMContentLoaded', function() {
		const button = document.getElementById('theme-toggle');
		if (button) {
			updateToggleButton(initialTheme);
			button.addEventListener('click', toggleTheme);
		}
	});
})();
