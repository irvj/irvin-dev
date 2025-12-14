// Automatic image modal functionality
(function() {
	window.initImageModals = function() {
		// Find all images with modal-image class that haven't been initialized
		const images = document.querySelectorAll('img.modal-image:not([data-modal-initialized])');

		images.forEach((img, index) => {
			// Mark as initialized to prevent duplicate processing
			img.setAttribute('data-modal-initialized', 'true');

			const modalId = `image-modal-${Date.now()}-${index}`;
			const title = img.alt || img.src.split('/').pop().split('?')[0]; // Use alt text or filename
			const imageSrc = img.src;

			// Make image clickable
			img.style.cursor = 'pointer';
			img.setAttribute('tabindex', '0');
			img.setAttribute('role', 'button');
			img.setAttribute('aria-label', `View larger: ${title}`);

			// Create modal HTML
			const modalHTML = `
				<div id="${modalId}" class="modal" role="dialog" aria-modal="true" aria-labelledby="${modalId}-title" hidden>
					<div class="modal-backdrop" data-modal-close></div>
					<div class="modal-container">
						<div class="modal-header">
							<h2 id="${modalId}-title" class="modal-title">${title}</h2>
							<button class="modal-close" data-modal-close aria-label="Close modal">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M18 6 6 18"/><path d="m6 6 12 12"/>
								</svg>
							</button>
						</div>
						<div class="modal-content">
							<img src="${imageSrc}" alt="${title}" class="modal-profile-image">
						</div>
					</div>
				</div>
			`;

			// Append modal to body
			document.body.insertAdjacentHTML('beforeend', modalHTML);

			// Add click handler
			img.addEventListener('click', function() {
				openModal(modalId);
			});

			// Add keyboard handler (Enter key)
			img.addEventListener('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					openModal(modalId);
				}
			});
		});
	}

	// Initialize on page load
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', window.initImageModals);
	} else {
		window.initImageModals();
	}
})();
