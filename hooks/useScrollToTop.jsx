import { useState, useEffect } from 'react';
import { FiChevronUp } from 'react-icons/fi';

function ScrollToTop() {
	const [showScroll, setShowScroll] = useState(false);

	useEffect(() => {
		const updateVisibility = () => setShowScroll(window.scrollY > 400);
		updateVisibility();
		window.addEventListener('scroll', updateVisibility, { passive: true });
		return function cleanup() {
			window.removeEventListener('scroll', updateVisibility);
		};
	}, []);

	const backToTop = () => {
		document.querySelector('.np-nameplate')?.focus({ preventScroll: true });
		window.scrollTo({
			top: 0,
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
		});
	};

	return (
		<>
			<button
				type="button"
				aria-label="Back to top"
				className="scrollToTop"
				onClick={backToTop}
				style={{
					height: 44,
					width: 44,
					padding: 7,
					borderRadius: 50,
					right: 50,
					bottom: 50,
					display: showScroll ? 'flex' : 'none',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<FiChevronUp aria-hidden="true" size={26} />
			</button>
		</>
	);
}

export default ScrollToTop;
