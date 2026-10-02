import { useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiMaximize2, FiMinimize2, FiX } from 'react-icons/fi';
import { photocullGuide, photocullLinks } from '../../data/photocullStudy';

// The Streamlit app is heavy, so the iframe only exists on the client: it
// loads by itself on tablet and desktop widths, and on phones (where an
// embedded Streamlit page is cramped) it waits behind a button. Server render
// and no-JS visitors get the open-in-new-tab card instead.
//
// Picture-in-picture is a CSS state on the same element, never a DOM move:
// moving an iframe reloads it, and that would throw away the visitor's
// Streamlit session.
const WIDE = '(min-width: 768px)';

function StepGuide({ step, onStep }) {
	const total = photocullGuide.length;
	const current = photocullGuide[step];
	const bodyRef = useRef(null);

	useEffect(() => {
		if (bodyRef.current) bodyRef.current.scrollTop = 0;
	}, [step]);

	return (
		<div className="pc-guide">
			<div className="pc-guide-head">
				<span className="pc-guide-count">
					How to use · Step {step + 1} of {total}
				</span>
				<label className="sr-only" htmlFor="pc-guide-jump">
					Jump to step
				</label>
				<select id="pc-guide-jump" value={step} onChange={(event) => onStep(Number(event.target.value))}>
					{photocullGuide.map((item, index) => (
						<option key={item.title} value={index}>
							{index + 1}. {item.title}
						</option>
					))}
				</select>
			</div>

			<div className="pc-guide-progress" aria-hidden="true">
				<i style={{ transform: `scaleX(${(step + 1) / total})` }} />
			</div>

			<div ref={bodyRef} className="pc-guide-body" aria-live="polite" aria-atomic="true">
				{current.where && <span className="pc-guide-tag">{current.where} only</span>}
				<h3>{current.title}</h3>
				{current.body.map((paragraph) => (
					<p key={paragraph}>{paragraph}</p>
				))}
				{current.list && (
					<ul>
						{current.list.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				)}
				{current.tip && <p className="pc-guide-tip">{current.tip}</p>}
			</div>

			<div className="pc-guide-nav">
				<button type="button" onClick={() => onStep(step - 1)} disabled={step === 0}>
					← Prev
				</button>
				<button type="button" onClick={() => onStep(step + 1)} disabled={step === total - 1}>
					Next →
				</button>
			</div>
		</div>
	);
}

export default function PhotoCullDemo() {
	const [embedded, setEmbedded] = useState(false);
	const [wide, setWide] = useState(false);
	const [step, setStep] = useState(0);

	// PiP state: `pip` is what's on screen; `pinned` means the visitor popped
	// it out by hand (so scrolling back doesn't dock it); `engaged` means they
	// have actually used the demo or guide, which is what earns an automatic
	// pop-out; `dismissed` means they closed it and want it left alone.
	const [pip, setPip] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [engaged, setEngaged] = useState(false);
	const [dismissed, setDismissed] = useState(false);
	const [slotHeight, setSlotHeight] = useState(null);

	const slotRef = useRef(null);
	const stageRef = useRef(null);
	const frameRef = useRef(null);
	// Set while "Back to page" scrolls up, so the demo isn't floated again
	// before it arrives.
	const returningRef = useRef(false);

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
			if (event.key === 'Escape') {
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

	const goToStep = (index) => {
		setStep(Math.max(0, Math.min(photocullGuide.length - 1, index)));
		setEngaged(true);
	};

	const popOut = () => {
		setPinned(true);
		setDismissed(false);
		setEngaged(true);
		enterPip();
	};

	const close = () => {
		setPip(false);
		setPinned(false);
		setDismissed(true);
	};

	const backToPage = () => {
		returningRef.current = true;
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
					Upload a small set of images for temporary session analysis, or use the bundled demo. Follow
					the steps alongside it{wide ? ', and pop the demo out to keep it in the corner while you read on' : ''}.
				</p>
			</div>

			<div
				ref={slotRef}
				className={`pc-stage-slot ${pip ? 'is-holding' : ''}`}
				style={pip && slotHeight ? { minHeight: slotHeight } : undefined}
			>
				{pip && (
					<div className="pc-stage-placeholder">
						<p>The demo is open in the corner.</p>
						<button type="button" className="notice-link-btn notice-link-outline" onClick={backToPage}>
							Bring it back here
						</button>
					</div>
				)}

				<div
					ref={stageRef}
					className={`pc-stage ${embedded ? 'is-embedded' : ''} ${pip ? 'is-pip' : ''}`}
					role={pip ? 'region' : undefined}
					aria-label={pip ? 'PhotoCull demo, picture-in-picture' : undefined}
				>
					<StepGuide step={step} onStep={goToStep} />

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
								{pip && (
									<button type="button" onClick={backToPage}>
										<FiMaximize2 aria-hidden="true" /> Back to page
									</button>
								)}
								{!pip && (
									<a href={photocullLinks.live} target="_blank" rel="noopener noreferrer">
										New tab <FiArrowUpRight aria-hidden="true" />
									</a>
								)}
								{pip && (
									<button type="button" onClick={close} aria-label="Close picture-in-picture demo">
										<FiX aria-hidden="true" />
									</button>
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
