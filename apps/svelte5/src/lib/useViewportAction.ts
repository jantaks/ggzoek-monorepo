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
				onEnter();
			}
			if (!entry.isIntersecting) {
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
