// Modal functionality
(function() {
	// Open modal
	window.openModal = function(modalId) {
		const modal = document.getElementById(modalId);
		if (!modal) return;

		modal.removeAttribute('hidden');
		document.body.style.overflow = 'hidden';

		// Focus first focusable element
		const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
		if (focusable.length > 0) {
			focusable[0].focus();
		}
	};

	// Close modal
	function closeModal(modal) {
		modal.setAttribute('hidden', '');
		document.body.style.overflow = '';
	}

	// Handle close button clicks and backdrop clicks
	document.addEventListener('click', function(e) {
		// Check if clicked element or any parent has data-modal-close
		const closeElement = e.target.closest('[data-modal-close]');
		if (closeElement) {
			const modal = closeElement.closest('.modal');
			if (modal) closeModal(modal);
		}
	});

	// Handle ESC key
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			const openModal = document.querySelector('.modal:not([hidden])');
			if (openModal) closeModal(openModal);
		}
	});

	// Focus trap
	document.addEventListener('keydown', function(e) {
		const openModal = document.querySelector('.modal:not([hidden])');
		if (!openModal || e.key !== 'Tab') return;

		const focusable = openModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
		const firstFocusable = focusable[0];
		const lastFocusable = focusable[focusable.length - 1];

		if (e.shiftKey && document.activeElement === firstFocusable) {
			e.preventDefault();
			lastFocusable.focus();
		} else if (!e.shiftKey && document.activeElement === lastFocusable) {
			e.preventDefault();
			firstFocusable.focus();
		}
	});
})();
