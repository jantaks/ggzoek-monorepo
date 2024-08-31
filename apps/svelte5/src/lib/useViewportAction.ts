export default function viewport(
	element: Element,
	{ onEnter, onExit }: { onEnter: (() => void) | undefined; onExit: (() => void) | undefined }
) {
	if (!onEnter || !onExit) {
		console.error('onEnter and onExit are required');
		return;
	}
	const intersectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				console.debug('Element is in view');
				onEnter();
			}
			if (!entry.isIntersecting) {
				console.debug('Element is out of view');
				onExit();
			}
		});
	});
	intersectionObserver.observe(element);

	return {
		destroy() {
			intersectionObserver.unobserve(element);
		}
	};
}
