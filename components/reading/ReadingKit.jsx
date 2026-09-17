import { useEffect, useRef, useState } from 'react';

// Long write-ups set as newspaper features: every section is always open, and
// navigation does the work collapsing used to — an "In this story" box at the
// top, a contents rail that follows the reader on wide screens, and a thin
// reading-progress bar.

export function ReadingSection({ eyebrow, title, children }) {
	return (
		<section className="rd-section" tabIndex={-1}>
			<header className="rd-section-head">
				{eyebrow && <p className="rd-kicker">{eyebrow}</p>}
				<h2 className="rd-headline">{title}</h2>
			</header>
			<div className="rd-body">{children}</div>
			<ContinuedIn />
		</section>
	);
}

// A newspaper "continued on" jump line: at the end of each section, a teaser
// for the one that follows, so the reader always has a reason to keep going.
// It looks the next section up after mount, so pages don't have to pass titles
// around; the last section simply renders nothing.
function ContinuedIn() {
	const ref = useRef(null);
	const [next, setNext] = useState(null);

	useEffect(() => {
		const section = ref.current?.closest('section.rd-section');
		const target = section?.nextElementSibling;
		if (!target || !target.matches('section.rd-section')) return;
		setNext({
			element: target,
			kicker: target.querySelector('.rd-kicker')?.textContent.trim() || 'the next part',
			title: target.querySelector('.rd-headline')?.textContent.trim() || '',
		});
	}, []);

	return (
		<div ref={ref} className="rd-continued">
			{next && (
				<button
					type="button"
					onClick={() => {
						const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
						next.element.focus({ preventScroll: true });
						next.element.scrollIntoView({
							behavior: reduceMotion ? 'auto' : 'smooth',
							block: 'start',
						});
					}}
				>
					<span className="rd-continued-label">Continued in {next.kicker}</span>
					<span className="rd-continued-title">
						{next.title} <span aria-hidden="true">→</span>
					</span>
				</button>
			)}
		</div>
	);
}

const slugify = (text) =>
	text
		.toLowerCase()
		.replace(/[’']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 60);

export function StoryContents({ label = 'In this story' }) {
	const boxRef = useRef(null);
	const [items, setItems] = useState([]);
	const [active, setActive] = useState('');
	const [progress, setProgress] = useState(0);
	const [showRail, setShowRail] = useState(false);

	// Built from the rendered sections, so every page gets contents for free.
	useEffect(() => {
		const root = boxRef.current?.closest('.reader') || document;
		const sections = [...root.querySelectorAll('section.rd-section')];
		const seen = new Set();
		const list = sections.map((section, index) => {
			const title = section.querySelector('.rd-headline')?.textContent.trim() || `Part ${index + 1}`;
			if (!section.id) {
				let id = slugify(title) || `part-${index + 1}`;
				while (seen.has(id)) id = `${id}-${index + 1}`;
				section.id = id;
			}
			seen.add(section.id);
			return { id: section.id, title };
		});
		setItems(list);

		if (typeof IntersectionObserver === 'undefined' || !list.length) return undefined;

		// The section crossing the upper third of the screen is the one being read.
		const readObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) setActive(entry.target.id);
				});
			},
			{ rootMargin: '-25% 0px -65% 0px' }
		);
		sections.forEach((section) => readObserver.observe(section));

		return () => readObserver.disconnect();
	}, []);

	useEffect(() => {
		let frame;
		const update = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
			// The rail appears once the inline contents box has scrolled away.
			const box = boxRef.current;
			setShowRail(Boolean(box) && box.getBoundingClientRect().bottom < 0);
		};
		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, []);

	const links = (
		<ol>
			{items.map((item, index) => (
				<li key={item.id} className={active === item.id ? 'is-active' : ''}>
					<a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>
						<span className="rd-contents-no">{String(index + 1).padStart(2, '0')}</span>
						<span className="rd-contents-title">{item.title}</span>
					</a>
				</li>
			))}
		</ol>
	);

	return (
		<>
			<div
				className="rd-progress"
				style={{ transform: `scaleX(${progress})` }}
				aria-hidden="true"
			/>

			<nav ref={boxRef} className="rd-contents" aria-label={label}>
				<p className="rd-contents-label">
					{label}
					{items.length > 0 && <span> · {items.length} parts</span>}
				</p>
				{links}
			</nav>

			{/* Wide-screen navigation becomes keyboard-accessible when visible. */}
			<nav
				className={`rd-rail ${showRail ? 'is-visible' : ''}`}
				aria-label={`${label}: quick navigation`}
				aria-hidden={!showRail}
			>
				<p className="rd-contents-label">{label}</p>
				<ol>
					{items.map((item, index) => (
						<li key={item.id} className={active === item.id ? 'is-active' : ''}>
							<a
								href={`#${item.id}`}
								tabIndex={showRail ? undefined : -1}
								aria-current={active === item.id ? 'location' : undefined}
							>
								<span className="rd-contents-no">{String(index + 1).padStart(2, '0')}</span>
								<span className="rd-contents-title">{item.title}</span>
							</a>
						</li>
					))}
				</ol>
			</nav>
		</>
	);
}
