import { useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiChevronDown, FiChevronUp, FiMaximize2, FiMinimize2, FiMove, FiX } from 'react-icons/fi';
import { photocullLinks } from '../../data/photocullStudy';
import { WalkthroughBar, WalkthroughDetails, useWalkthrough } from './PhotoCullWalkthrough';

// The Streamlit app is heavy, so the iframe only exists on the client: it
// loads by itself on tablet and desktop widths, and on phones (where an
// embedded Streamlit page is cramped) it waits behind a button. Server render
// and no-JS visitors get the open-in-new-tab card instead.
//
// Picture-in-picture is a CSS state on the same element, never a DOM move:
// moving an iframe reloads it, and that would throw away the visitor's
// Streamlit session.
const WIDE = '(min-width: 768px)';

// Where the visitor last left the floating window. A per-browser convenience
// only, so every read and write tolerates storage being unavailable.
const POSITION_KEY = 'pc-pip-position';
const EDGE = 8;
const KEY_STEP = 24;

export default function PhotoCullDemo() {
	const [embedded, setEmbedded] = useState(false);
	const [wide, setWide] = useState(false);
	const [detailsOpen, setDetailsOpen] = useState(false);

	// PiP state: `pip` is what's on screen; `pinned` means the visitor popped
	// it out by hand (so scrolling back doesn't dock it); `engaged` means they
	// have actually used the demo or guide, which is what earns an automatic
	// pop-out; `dismissed` means they closed it and want it left alone.
	const [pip, setPip] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [engaged, setEngaged] = useState(false);
	const [dismissed, setDismissed] = useState(false);
	const [slotHeight, setSlotHeight] = useState(null);

	// The floating window can be dragged anywhere (null = default corner) and
	// minimized to its title strip, so it never has to cover what's being read.
	const [position, setPosition] = useState(null);
	const [minimized, setMinimized] = useState(false);
	const [dragging, setDragging] = useState(false);
	const dragRef = useRef(null);

	const slotRef = useRef(null);
	const stageRef = useRef(null);
	const frameRef = useRef(null);
	// Set while "Back to page" scrolls up, so the demo isn't floated again
	// before it arrives.
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

	const engage = useCallback(() => setEngaged(true), []);
	const walk = useWalkthrough({ onInteract: engage });

	const enterPip = useCallback(() => {
		setSlotHeight(stageRef.current?.offsetHeight || null);
		setPip(true);
	}, []);

	useEffect(() => {
		const query = window.matchMedia(WIDE);
		const apply = () => {
			setWide(query.matches);
			if (query.matches) setEmbedded(true);
			else setPip(false);
		};
		apply();
		query.addEventListener('change', apply);
		return () => query.removeEventListener('change', apply);
	}, []);

	// Clicking into a cross-origin iframe blurs this window; that's the only
	// signal the parent page gets that the visitor is using the demo.
	useEffect(() => {
		const onBlur = () => {
			if (document.activeElement === frameRef.current) setEngaged(true);
		};
		window.addEventListener('blur', onBlur);
		return () => window.removeEventListener('blur', onBlur);
	}, []);

	// Float once the demo has scrolled off the top; dock again when it's back.
	useEffect(() => {
		const slot = slotRef.current;
		if (!slot || !embedded || !wide || typeof IntersectionObserver === 'undefined') return undefined;
		const observer = new IntersectionObserver(
			([entry]) => {
				const inView = entry.intersectionRatio > 0.2;
				if (inView) returningRef.current = false;
				if (inView && !pinned) setPip(false);
				else if (!inView && entry.boundingClientRect.top < 0 && engaged && !dismissed && !returningRef.current) {
					enterPip();
				}
			},
			{ threshold: [0, 0.2, 0.5] }
		);
		observer.observe(slot);
		return () => observer.disconnect();
	}, [embedded, wide, engaged, dismissed, pinned, enterPip]);

	// Keep the back-to-top button clear of the floating window, and let Escape
	// put the demo back.
	useEffect(() => {
		document.documentElement.classList.toggle('pc-pip-open', pip);
		if (!pip) return undefined;
		const onKey = (event) => {
			if (event.key === 'Escape' && !dragRef.current) {
				setPip(false);
				setPinned(false);
				setDismissed(true);
			}
		};
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('keydown', onKey);
			document.documentElement.classList.remove('pc-pip-open');
		};
	}, [pip]);


	useEffect(() => {
		try {
			const saved = JSON.parse(window.localStorage.getItem(POSITION_KEY));
			if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) setPosition(saved);
		} catch {
			// No storage: start in the default corner.
		}
	}, []);

	useEffect(() => {
		if (dragging) return;
		try {
			if (position) window.localStorage.setItem(POSITION_KEY, JSON.stringify(position));
			else window.localStorage.removeItem(POSITION_KEY);
		} catch {
			// Position just won't be remembered.
		}
	}, [position, dragging]);

	// Re-fit after anything that changes the window's size or the viewport's.
	useEffect(() => {
		if (!pip) return undefined;
		const refit = () => setPosition((point) => clamp(point));
		const frame = requestAnimationFrame(refit);
		window.addEventListener('resize', refit);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', refit);
		};
	}, [pip, minimized, detailsOpen, clamp]);

	// The back-to-top button moves aside only when the window is on its side.
	useEffect(() => {
		const stage = stageRef.current;
		const onLeft = Boolean(pip && position && stage && position.x + stage.offsetWidth / 2 < window.innerWidth / 2);
		document.documentElement.classList.toggle('pc-pip-left', onLeft);
		return () => document.documentElement.classList.remove('pc-pip-left');
	}, [pip, position]);

	// No accidental text selection on the page underneath while dragging.
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
		setPinned(true);
		setDismissed(false);
		setEngaged(true);
		enterPip();
	};

	const close = () => {
		setMinimized(false);
		setPip(false);
		setPinned(false);
		setDismissed(true);
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

	return (
		<section className="pc-demo" aria-labelledby="pc-demo-title">
			<div className="pc-demo-note">
				<h2 id="pc-demo-title">Try the Web Demo</h2>
				<p>
					Upload a small set of images for temporary session analysis, or use the bundled demo. The
					walkthrough above the demo tells you what to press and what to expect at each step
					{wide ? '; pop the demo out to keep both in the corner while you read on' : ''}. It is a guide
					only: it cannot see inside the demo, so you confirm each step yourself.
				</p>
			</div>

			<div
				ref={slotRef}
				className={`pc-stage-slot ${pip ? 'is-holding' : ''}`}
				style={pip && slotHeight ? { minHeight: slotHeight } : undefined}
			>
				{pip && (
					<div className="pc-stage-placeholder">
						<p>The demo is open in a floating window. Drag its title strip to move it.</p>
						<button type="button" className="notice-link-btn notice-link-outline" onClick={backToPage}>
							Bring it back here
						</button>
					</div>
				)}

				<div
					ref={stageRef}
					className={[
						'pc-stage',
						embedded && 'is-embedded',
						pip && 'is-pip',
						pip && detailsOpen && 'is-details-open',
						pip && minimized && 'is-minimized',
						dragging && 'is-dragging',
					]
						.filter(Boolean)
						.join(' ')}
					style={pip && position ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' } : undefined}
					role={pip ? 'region' : undefined}
					aria-label={pip ? 'PhotoCull demo, picture-in-picture' : undefined}
				>
					{pip && (
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
								aria-label="Move demo window"
								aria-describedby="pc-pip-move-hint"
								title="Drag to move · arrow keys move · Home or double-click resets"
							>
								<FiMove aria-hidden="true" />
							</button>
							<span id="pc-pip-move-hint" className="sr-only">
								Use the arrow keys to move the window, Shift for larger steps, and Home to return it to the
								corner.
							</span>
							<span className="pc-pip-title">
								{walk.state.finished ? 'Walkthrough complete' : `Step ${walk.index + 1} · ${walk.step.title}`}
							</span>
							<span className="pc-pip-actions">
								<button
									type="button"
									onClick={() => setMinimized((value) => !value)}
									aria-expanded={!minimized}
									aria-label={minimized ? 'Expand demo window' : 'Minimize demo window'}
									title={minimized ? 'Expand' : 'Minimize'}
								>
									{minimized ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
								</button>
								<button type="button" onClick={backToPage} aria-label="Put the demo back on the page" title="Back to page">
									<FiMaximize2 aria-hidden="true" />
								</button>
								<button type="button" onClick={close} aria-label="Close picture-in-picture demo" title="Close">
									<FiX aria-hidden="true" />
								</button>
							</span>
						</div>
					)}
					<WalkthroughBar
						walk={walk}
						compact={pip}
						detailsToggle={
							pip ? (
								<button
									type="button"
									className="pc-walk-skip"
									aria-expanded={detailsOpen}
									aria-controls="pc-walk-details"
									onClick={() => setDetailsOpen((open) => !open)}
								>
									{detailsOpen ? 'Hide details' : 'Expect · How · Next'}
								</button>
							) : null
						}
					/>
					<WalkthroughDetails walk={walk} id="pc-walk-details" />

					<div className="pc-demo-frame">
						<div className="pc-demo-bar">
							<span className="pc-demo-bar-label">
								<i aria-hidden="true" /> Live demo
							</span>
							<span className="pc-demo-bar-actions">
								{embedded && wide && !pip && (
									<button type="button" onClick={popOut} title="Keep the demo in the corner while you scroll">
										<FiMinimize2 aria-hidden="true" /> Pop out
									</button>
								)}
								{!pip && (
									<a href={photocullLinks.live} target="_blank" rel="noopener noreferrer">
										New tab <FiArrowUpRight aria-hidden="true" />
									</a>
								)}
							</span>
						</div>

						{embedded ? (
							<iframe
								ref={frameRef}
								src={photocullLinks.embed}
								title="PhotoCull interactive web demo"
								loading="lazy"
								referrerPolicy="strict-origin-when-cross-origin"
								allow="clipboard-write"
							/>
						) : (
							<div className="pc-demo-fallback">
								<p className="pc-demo-fallback-title">Interactive demo</p>
								<p>The demo runs best in its own tab on small screens.</p>
								<div className="fh-study-links">
									<a
										className="notice-link-btn"
										href={photocullLinks.live}
										target="_blank"
										rel="noopener noreferrer"
									>
										Open Interactive Demo <FiArrowUpRight aria-hidden="true" />
									</a>
									<button
										type="button"
										className="notice-link-btn notice-link-outline"
										onClick={() => setEmbedded(true)}
									>
										Load it here
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<p className="sr-only" aria-live="polite" aria-atomic="true">
				{walk.announcement}
			</p>

			<div className="pc-demo-foot">
				<p>
					<strong>Full Local Edition.</strong> The complete version scans local folders and persists
					analysis privately on the user&rsquo;s machine.
				</p>
				<p className="pc-demo-small">
					Hosted on Streamlit Community Cloud. An idle app may take a moment to wake.{' '}
					<a href={photocullLinks.live} target="_blank" rel="noopener noreferrer">
						Open the full demo in a new tab
					</a>
					.
				</p>
			</div>
		</section>
	);
}
