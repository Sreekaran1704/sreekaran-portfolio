import { useCallback, useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiDownload, FiMaximize, FiMaximize2, FiMinimize2, FiMove, FiX } from 'react-icons/fi';

// A live prototype in the same window as the project videos (ProjectVideo.jsx):
// a title bar with "Pop out" and "Full screen", and on wide screens a floating
// picture-in-picture window with the same strip, drag, minimize, back-to-page
// and close controls. It floats on its own once the visitor has used it and
// scrolls on. Floating is a CSS state on one element, never a DOM move, so the
// prototype keeps whatever the visitor has done in it. While floating, the
// prototype is drawn at `scale` of its size; `size` is its natural width and
// height in pixels. `inset` moves its starting corner in from the right, so two
// windows can float side by side. `download` ({ label, href }) adds a link to
// the app's file in the title bar, where the videos link to YouTube.
const WIDE = '(min-width: 768px)';
const EDGE = 8;
const KEY_STEP = 24;

function PrototypeWindow({ label, title, storageKey, inset, size, scale, download, className = '', children }) {
	const [wide, setWide] = useState(false);
	const [pip, setPip] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [dismissed, setDismissed] = useState(false);
	const [used, setUsed] = useState(false);
	const [slotHeight, setSlotHeight] = useState(null);
	const [position, setPosition] = useState(null);
	const [minimized, setMinimized] = useState(false);
	const [dragging, setDragging] = useState(false);
	const dragRef = useRef(null);
	const slotRef = useRef(null);
	const stageRef = useRef(null);
	const returningRef = useRef(false);

	// Keep the window fully on screen, below the sticky masthead.
	const clamp = useCallback((point) => {
		const stage = stageRef.current;
		if (!point || !stage) return point;
		const top = (parseFloat(getComputedStyle(stage).getPropertyValue('--np-sticky-h')) || 46) + EDGE;
		const maxX = Math.max(EDGE, window.innerWidth - stage.offsetWidth - EDGE);
		const maxY = Math.max(top, window.innerHeight - stage.offsetHeight - EDGE);
		return {
			x: Math.round(Math.min(Math.max(EDGE, point.x), maxX)),
			y: Math.round(Math.min(Math.max(top, point.y), maxY)),
		};
	}, []);

	const enterPip = useCallback(() => {
		setSlotHeight(stageRef.current?.offsetHeight || null);
		setPip(true);
	}, []);

	useEffect(() => {
		const query = window.matchMedia(WIDE);
		const apply = () => {
			setWide(query.matches);
			if (!query.matches) setPip(false);
		};
		apply();
		query.addEventListener('change', apply);
		return () => query.removeEventListener('change', apply);
	}, []);

	// Float once it has been used and scrolled off the top; dock again when its
	// place on the page is back in view.
	useEffect(() => {
		const slot = slotRef.current;
		if (!slot || !wide || typeof IntersectionObserver === 'undefined') return undefined;
		const observer = new IntersectionObserver(
			([entry]) => {
				const inView = entry.intersectionRatio > 0.2;
				if (inView) returningRef.current = false;
				if (inView && !pinned) setPip(false);
				else if (!inView && entry.boundingClientRect.top < 0 && used && !dismissed && !returningRef.current) {
					enterPip();
				}
			},
			{ threshold: [0, 0.2, 0.5] }
		);
		observer.observe(slot);
		return () => observer.disconnect();
	}, [wide, used, dismissed, pinned, enterPip]);

	const close = () => {
		setMinimized(false);
		setPip(false);
		setPinned(false);
		setDismissed(true);
	};

	// Escape closes the window; the back-to-top button steps aside for it.
	useEffect(() => {
		document.documentElement.classList.toggle('pc-pip-open', pip);
		if (!pip) return undefined;
		const onKey = (event) => {
			if (event.key === 'Escape' && !dragRef.current) close();
		};
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('keydown', onKey);
			document.documentElement.classList.remove('pc-pip-open');
		};
	});

	useEffect(() => {
		try {
			const saved = JSON.parse(window.localStorage.getItem(storageKey));
			if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) setPosition(saved);
		} catch {
			// No storage: start in the default corner.
		}
	}, [storageKey]);

	useEffect(() => {
		if (dragging) return;
		try {
			if (position) window.localStorage.setItem(storageKey, JSON.stringify(position));
			else window.localStorage.removeItem(storageKey);
		} catch {
			// Position just won't be remembered.
		}
	}, [position, dragging, storageKey]);

	useEffect(() => {
		if (!pip) return undefined;
		const refit = () => setPosition((point) => clamp(point));
		const frame = requestAnimationFrame(refit);
		window.addEventListener('resize', refit);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', refit);
		};
	}, [pip, minimized, clamp]);

	useEffect(() => {
		document.documentElement.classList.toggle('pc-pip-dragging', dragging);
		return () => document.documentElement.classList.remove('pc-pip-dragging');
	}, [dragging]);

	const startDrag = (event) => {
		if (event.button !== 0 || event.target.closest('button:not(.pc-pip-grip)')) return;
		const rect = stageRef.current.getBoundingClientRect();
		dragRef.current = { dx: event.clientX - rect.left, dy: event.clientY - rect.top };
		try {
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {
			// Without capture the drag still works while the pointer stays on the strip.
		}
		setDragging(true);
		event.preventDefault();
	};

	const moveDrag = (event) => {
		if (!dragRef.current) return;
		setPosition(clamp({ x: event.clientX - dragRef.current.dx, y: event.clientY - dragRef.current.dy }));
	};

	const endDrag = () => {
		dragRef.current = null;
		setDragging(false);
	};

	const nudge = (event) => {
		const step = event.shiftKey ? KEY_STEP * 4 : KEY_STEP;
		const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
		if (event.key === 'Home') {
			event.preventDefault();
			setPosition(null);
			return;
		}
		if (!delta) return;
		event.preventDefault();
		const rect = stageRef.current.getBoundingClientRect();
		setPosition(clamp({ x: rect.left + delta[0], y: rect.top + delta[1] }));
	};

	const popOut = () => {
		setUsed(true);
		setPinned(true);
		setDismissed(false);
		enterPip();
	};

	const backToPage = () => {
		returningRef.current = true;
		setMinimized(false);
		setPip(false);
		setPinned(false);
		requestAnimationFrame(() => {
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			slotRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
		});
	};

	const fullscreen = () => {
		const stage = stageRef.current;
		if (document.fullscreenElement) document.exitFullscreen?.();
		else stage?.requestFullscreen?.();
	};

	const defaultCorner = inset ? { right: inset } : undefined;
	const floatingStyle = pip
		? position
			? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' }
			: defaultCorner
		: undefined;

	return (
		<figure className={`pj-proto ${className}`}>
			<div
				ref={slotRef}
				className={`pj-video-slot${pip ? ' is-holding' : ''}`}
				style={pip && slotHeight ? { minHeight: slotHeight } : undefined}
			>
				{pip && (
					<div className="pj-video-placeholder">
						<p>The {label.toLowerCase()} is in a floating window. Drag its title strip to move it.</p>
						<button type="button" className="notice-link-btn notice-link-outline" onClick={backToPage}>
							Bring it back here
						</button>
					</div>
				)}

				<div
					ref={stageRef}
					className={['pj-window', 'pj-proto-window', pip && 'is-pip', pip && minimized && 'is-minimized', dragging && 'is-dragging']
						.filter(Boolean)
						.join(' ')}
					style={{ ...floatingStyle, '--proto-w': `${size.width}px`, '--proto-h': `${size.height}px`, '--proto-scale': scale }}
					role={pip ? 'region' : undefined}
					aria-label={pip ? `${title}, picture-in-picture` : undefined}
				>
					{pip ? (
						<div
							className="pc-pip-handle"
							onPointerDown={startDrag}
							onPointerMove={moveDrag}
							onPointerUp={endDrag}
							onPointerCancel={endDrag}
							onDoubleClick={(event) => !event.target.closest('button:not(.pc-pip-grip)') && setPosition(null)}
						>
							<button
								type="button"
								className="pc-pip-grip"
								onKeyDown={nudge}
								aria-label={`Move the ${label.toLowerCase()} window`}
								title="Drag to move · arrow keys move · Home or double-click resets"
							>
								<FiMove aria-hidden="true" />
							</button>
							<span className="pc-pip-title">{title}</span>
							<span className="pc-pip-actions">
								<button
									type="button"
									onClick={() => setMinimized((value) => !value)}
									aria-expanded={!minimized}
									aria-label={minimized ? 'Expand window' : 'Minimize window'}
									title={minimized ? 'Expand' : 'Minimize'}
								>
									{minimized ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
								</button>
								<button type="button" onClick={backToPage} aria-label="Put it back on the page" title="Back to page">
									<FiMaximize2 aria-hidden="true" />
								</button>
								<button type="button" onClick={close} aria-label="Close the floating window" title="Close">
									<FiX aria-hidden="true" />
								</button>
							</span>
						</div>
					) : (
						<div className="pc-demo-bar">
							<span className="pc-demo-bar-label">
								<i aria-hidden="true" /> {label}
							</span>
							<span className="pc-demo-bar-actions">
								{wide && (
									<>
										<button type="button" onClick={popOut} title="Keep it in the corner while you scroll">
											<FiMinimize2 aria-hidden="true" /> Pop out
										</button>
										<button type="button" onClick={fullscreen} title="Full screen">
											<FiMaximize aria-hidden="true" /> Full screen
										</button>
									</>
								)}
								{download && (
									<a href={download.href} target="_blank" rel="noopener noreferrer" className="pj-proto-download">
										{download.label} <FiDownload aria-hidden="true" />
									</a>
								)}
							</span>
						</div>
					)}

					{/* Any press inside counts as using it, which lets it float on scroll. */}
					<div className="pj-proto-body" onPointerDown={() => setUsed(true)}>
						<div className="pj-proto-inner">{children}</div>
					</div>
				</div>
			</div>
		</figure>
	);
}

export default PrototypeWindow;
