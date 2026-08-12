import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { useAskMe } from '../home/useAskMe';
import {
	AskBar,
	ErrorNotice,
	FollowUps,
	Suggestions,
	Thread,
} from '../home/AskMeParts';
import GardenRow from './GardenRow';


const birdConfigs = [
	{ y: 20, dur: 7.5, delay: 0, scale: 1, flip: false, color: '#6b6448' },
	{ y: 70, dur: 6.8, delay: 0.6, scale: 0.75, flip: true, color: '#5a6b5a' },
	{ y: 120, dur: 8.2, delay: 1.4, scale: 0.9, flip: false, color: '#6b5a48' },
];

function birdWingPath(flap) {
	const w = flap ? 6 : 4;
	return `M0,${w} Q4,-3 8,${w} Q4,0 0,${w} M8,${w} Q12,-3 16,${w} Q12,0 8,${w}`;
}

function smoothZigzagPoints(startX, endX, y, count) {
	const pts = [];
	for (let i = 0; i <= count; i++) {
		const t = i / count;
		const easedT = t < 0.12 ? (t / 0.12) * 0.12 * (t / 0.12) : t;
		const dampen = Math.min(1, t / 0.15) * Math.min(1, (1 - t) / 0.1 + 0.3);
		const jitter = (Math.random() - 0.5) * 34 * dampen;
		const wobble = Math.sin(t * Math.PI * 2.4) * 12 * dampen;
		pts.push({ x: startX + (endX - startX) * easedT, y: y + jitter + wobble });
	}
	return pts;
}

function Bird({ config, containerWidth }) {
	const [flapPath, setFlapPath] = useState(birdWingPath(false));

	useEffect(() => {
		let flap = false;
		const interval = setInterval(() => {
			flap = !flap;
			setFlapPath(birdWingPath(flap));
		}, 200 + Math.random() * 60);
		return () => clearInterval(interval);
	}, []);

	const startX = config.flip ? containerWidth + 20 : -20;
	const endX = config.flip ? -20 : containerWidth + 20;
	const points = smoothZigzagPoints(startX, endX, config.y, 16);
	const opacitySteps = points.map((_, i) => {
		if (i === 0 || i === points.length - 1) return 0;
		if (i === 1 || i === points.length - 2) return 0.3;
		return 0.5;
	});

	return (
		<motion.g
			initial={{
				x: points[0].x,
				y: points[0].y,
				opacity: 0,
				scaleX: config.flip ? -config.scale : config.scale,
				scaleY: config.scale,
			}}
			animate={{
				x: points.map((p) => p.x),
				y: points.map((p) => p.y),
				opacity: opacitySteps,
			}}
			transition={{
				duration: config.dur,
				delay: config.delay,
				ease: 'easeInOut',
				times: points.map((_, i) => i / (points.length - 1)),
				repeat: Infinity,
				repeatType: 'loop',
			}}
		>
			<path d={flapPath} stroke={config.color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
		</motion.g>
	);
}

function quadPoint(t, p0, p1, p2) {
	const mt = 1 - t;
	return {
		x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
		y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
	};
}

function quadTangent(t, p0, p1, p2) {
	const mt = 1 - t;
	return {
		x: 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
		y: 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y),
	};
}

// The clothesline stays a plain, clean sag (a real rope doesn't spiral);
// the vine is a separate, gentle wave draped along it — a wide, shallow
// wavelength reads as a relaxed climbing vine, where a tight one looks like
// a coiled wire instead of a plant.
const VINE_WAVELENGTH = 110; // px
const VINE_AMPLITUDE = 9; // px
// Leaves are sampled every quarter-wavelength along the vine (not just at
// its peaks), so twigs branch off between turns too, not only at the top
// and bottom of each wave.
const VINE_LEAF_SPACING = VINE_WAVELENGTH / 4; // px

// For this curve's control points (x = 0, width / 2, width) the x-component
// of the quadratic Bezier is exactly linear in t (x(t) = width * t), so the
// vine's wave can add a pure vertical offset — keeping x strictly increasing
// — and the existing arc-length note-pinning logic keeps working untouched.
function vineOffset(x, wavelength, amplitude) {
	// Rounded to avoid a hydration mismatch: Math.sin can differ in its last
	// floating-point digit between server and client JS engines.
	const raw = amplitude * Math.sin((2 * Math.PI * x) / wavelength);
	return Math.round(raw * 1000) / 1000;
}

function vinePoint(t, p0, p1, p2, wavelength, amplitude) {
	const base = quadPoint(t, p0, p1, p2);
	return { x: base.x, y: base.y + vineOffset(base.x, wavelength, amplitude) };
}

// Rounded to 2dp for the same reason as the angles above: this feeds a leaf
// count that must match between the server and client renders.
function quadArcLength(p0, p1, p2, steps = 48) {
	let len = 0;
	let prev = quadPoint(0, p0, p1, p2);
	for (let i = 1; i <= steps; i++) {
		const pt = quadPoint(i / steps, p0, p1, p2);
		len += Math.hypot(pt.x - prev.x, pt.y - prev.y);
		prev = pt;
	}
	return Math.round(len * 100) / 100;
}

function vinePathD(p0, p1, p2, width, wavelength, amplitude) {
	const steps = Math.max(140, Math.round(width / 3));
	let d = '';
	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const pt = vinePoint(t, p0, p1, p2, wavelength, amplitude);
		d += i === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`;
	}
	return d;
}

const LEAF_COLORS = ['#6f8161', '#7c8d6a', '#5f7355'];

// One small leaf sprig. Many of these, strung along the whole string, read
// as a single vine tangled on it from end to end. The outer <g> handles
// static positioning via the SVG transform attribute; framer-motion fully
// owns the transform on the inner <motion.g> once it's animating scale, so
// the two must not share one element.
function LeafSprig({ point, angle, side, colorIndex, delay }) {
	if (!point) return null;

	const sideAngle = side === 1 ? 30 : -30;
	const color = LEAF_COLORS[colorIndex % LEAF_COLORS.length];

	return (
		<g transform={`translate(${point.x}, ${point.y}) rotate(${angle + sideAngle})`}>
			<motion.g
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay, ease: 'easeOut' }}
			>
				<path d="M 0,0 L 0,6" stroke="#6b6448" strokeWidth={1} strokeLinecap="round" />
				<path d="M 0,0 Q -3.6,-7 0,-13 Q 3.6,-7 0,0 Z" fill={color} opacity={0.85} />
			</motion.g>
		</g>
	);
}

function ClotheslineDeck() {
	const containerRef = useRef(null);
	const [size, setSize] = useState({ width: 660, height: 620 });

	const askMe = useAskMe();
	const { hasThread, showRecommended, error } = askMe;

	// A ResizeObserver, not a window listener: the deck's own minHeight depends on
	// the width measured here, so switching to the narrow layout changes the
	// element's height without the window ever resizing. A listener would keep
	// serving the pre-switch height and every position derived from it.
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return undefined;

		const update = () => {
			setSize((prev) =>
				prev.width === el.offsetWidth && prev.height === el.offsetHeight
					? prev
					: { width: el.offsetWidth, height: el.offsetHeight }
			);
		};
		update();

		if (typeof ResizeObserver === 'undefined') {
			window.addEventListener('resize', update);
			return () => window.removeEventListener('resize', update);
		}

		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const { width, height } = size;

	// Stacked on one column, the deck is as wide as the phone and the bar eats
	// most of it, so the string has barely any sideways run. Starting it lower
	// and sitting the bar higher keeps the drop short enough to still read as a
	// slack line rather than two vertical cables.
	const isNarrow = width < 640;
	const topY = isNarrow ? 60 : 30;

	// The bar replaces the low point of the old single U-curve: the string now
	// runs from each top corner down to one end of the bar, so the bar reads as
	// the thing the line is tied to rather than something floating over it.
	const barWidth = Math.max(isNarrow ? 210 : 260, Math.min(width * 0.62, 430));
	const barHeight = 54;
	const barLeft = (width - barWidth) / 2;
	const barRight = barLeft + barWidth;
	const barY = isNarrow ? Math.max(120, height * 0.24) : Math.max(170, height * 0.38);

	const leftAnchor = { x: barLeft, y: barY };
	const rightAnchor = { x: barRight, y: barY };
	const leftStart = { x: 0, y: topY };
	const rightEnd = { x: width, y: topY };

	// Control x must be the midpoint of the segment's endpoints: the rest of the
	// maths (and the vine's wave) relies on x being linear in t, which only holds
	// for that choice. The extra y is what makes the line sag like rope.
	const SAG = isNarrow ? 30 : 46;
	const leftControl = { x: (leftStart.x + leftAnchor.x) / 2, y: barY + SAG };
	const rightControl = { x: (rightAnchor.x + rightEnd.x) / 2, y: barY + SAG };

	const leftPath = `M ${leftStart.x} ${leftStart.y} Q ${leftControl.x} ${leftControl.y} ${leftAnchor.x} ${leftAnchor.y}`;
	const rightPath = `M ${rightAnchor.x} ${rightAnchor.y} Q ${rightControl.x} ${rightControl.y} ${rightEnd.x} ${rightEnd.y}`;

	const leftSpan = Math.abs(leftAnchor.x - leftStart.x);
	const rightSpan = Math.abs(rightEnd.x - rightAnchor.x);

	const leftVine = vinePathD(leftStart, leftControl, leftAnchor, leftSpan, VINE_WAVELENGTH, VINE_AMPLITUDE);
	const rightVine = vinePathD(rightAnchor, rightControl, rightEnd, rightSpan, VINE_WAVELENGTH, VINE_AMPLITUDE);

	const ready = width > 0 && height > 0;

	// Leaf sprigs sampled along each segment, so the vine still reads as one
	// plant draped over the whole line rather than two disconnected pieces.
	// Count comes from the curve's own length, not its horizontal span: these
	// segments now fall much further than they travel sideways, and spacing by x
	// would scatter four lonely leaves down a long drop.
	const sprigsFor = (p0, p1, p2, indexOffset) => {
		const out = [];
		const total = Math.floor(quadArcLength(p0, p1, p2) / VINE_LEAF_SPACING);
		for (let i = 0; i < total; i++) {
			const t = (i + 0.5) / total;
			const point = vinePoint(t, p0, p1, p2, VINE_WAVELENGTH, VINE_AMPLITUDE);
			const tangent = quadTangent(t, p0, p1, p2);
			// Rounded to avoid a hydration mismatch: atan2 can differ in its last
			// floating-point digit between server and client JS engines.
			const angle = Math.round(((Math.atan2(tangent.y, tangent.x) * 180) / Math.PI) * 100) / 100;
			out.push({
				point,
				angle,
				side: (i + indexOffset) % 2,
				colorIndex: i + indexOffset,
				delay: 0.6 + t * 0.8,
			});
		}
		return out;
	};

	const sprigs = ready
		? [
				...sprigsFor(leftStart, leftControl, leftAnchor, 0),
				...sprigsFor(rightAnchor, rightControl, rightEnd, 7),
		  ]
		: [];

	// The garden fills the gap under the bar. It's anchored to the bottom of the
	// deck and the panel is painted over it, so a conversation covers the plants
	// instead of displacing them.
	const gardenHeight = Math.min(isNarrow ? 130 : 168, Math.max(0, height - barY - 70));

	// The panel hangs below the bar and takes over the space the cards occupied.
	const panelTop = barY + barHeight / 2 + 18;
	const panelWidth = Math.min(width - 32, Math.max(barWidth, 460));
	const panelLeft = (width - panelWidth) / 2;
	// box-sizing is border-box globally, so max-height has to cover the panel's
	// own padding too — without the extra allowance it spills past the hero's
	// background and onto the section below.
	const panelMaxHeight = Math.max(170, height - panelTop - 26);

	return (
		<div
			ref={containerRef}
			style={{
				position: 'relative',
				height: '100%',
				// The 620 was sized for four hanging cards. Without them a phone is
				// left staring at a tall empty panel, so it only needs enough room
				// for the bar plus the answer beneath it.
				minHeight: isNarrow ? 470 : 620,
				width: '100%',
			}}
		>
			<svg
				width="100%"
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				preserveAspectRatio="none"
				style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
			>
				{birdConfigs.map((cfg, i) => (
					<Bird key={i} config={cfg} containerWidth={width} />
				))}

				{[leftPath, rightPath].map((d, i) => (
					<motion.path
						key={`string-${i}`}
						d={d}
						stroke="#8a7a5a"
						strokeWidth={1.5}
						fill="none"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 1.1, ease: 'easeOut' }}
					/>
				))}

				{[leftVine, rightVine].map((d, i) => (
					<motion.path
						key={`vine-${i}`}
						d={d}
						stroke="#5f7355"
						strokeWidth={1.6}
						fill="none"
						opacity={0.85}
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
					/>
				))}

				{sprigs.map((sprig, i) => (
					<LeafSprig
						key={i}
						point={sprig.point}
						angle={sprig.angle}
						side={sprig.side}
						colorIndex={sprig.colorIndex}
						delay={sprig.delay}
					/>
				))}

				{/* Knots where the line is tied off to each end of the bar. */}
				{[leftAnchor, rightAnchor].map((a, i) => (
					<motion.circle
						key={`knot-${i}`}
						cx={a.x}
						cy={a.y}
						r={4}
						fill="#8a7a5a"
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.3, delay: 1, ease: 'easeOut' }}
					/>
				))}
			</svg>

			{ready && gardenHeight > 40 && (
				<div
					style={{
						position: 'absolute',
						left: 0,
						bottom: 0,
						width: '100%',
						height: gardenHeight,
						pointerEvents: 'none',
					}}
				>
					<GardenRow width={width} height={gardenHeight} />
				</div>
			)}

			<div
				className="hero-askme"
				onFocus={() => askMe.setFocused(true)}
				onBlur={askMe.handleWrapperBlur}
				style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
			>
				<div
					style={{
						position: 'absolute',
						left: barLeft,
						top: barY - barHeight / 2,
						width: barWidth,
						height: barHeight,
						pointerEvents: 'auto',
					}}
				>
					<AskBar
						inputRef={askMe.inputRef}
						input={askMe.input}
						setInput={askMe.setInput}
						setFocused={askMe.setFocused}
						hasThread={hasThread}
						loading={askMe.loading}
						onSubmit={() => askMe.ask(askMe.input)}
					/>
				</div>

				{(showRecommended || hasThread || error) && (
					<div
						className="hero-askme-panel"
						style={{
							position: 'absolute',
							left: panelLeft,
							top: panelTop,
							width: panelWidth,
							maxHeight: panelMaxHeight,
							pointerEvents: 'auto',
						}}
					>
						{showRecommended && (
							<Suggestions suggestions={askMe.suggestions} onPick={askMe.ask} />
						)}

						{hasThread && (
							<Thread
								messages={askMe.messages}
								loading={askMe.loading}
								threadEndRef={askMe.threadEndRef}
							/>
						)}

						{error && (
							<ErrorNotice
								error={error}
								onDismiss={() => {
									askMe.setError('');
									if (askMe.inputRef.current) askMe.inputRef.current.focus();
								}}
							/>
						)}

						{hasThread && askMe.followUps.length > 0 && !askMe.loading && (
							<FollowUps followUps={askMe.followUps} onPick={askMe.ask} />
						)}

						{hasThread && (
							<button type="button" className="hero-askme-reset" onClick={askMe.reset}>
								Clear conversation
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

function AppBanner() {
	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ ease: 'easeInOut', duration: 0.8 }}
			className="hero-notebook mt-0 min-h-screen w-full"
		>
			<div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
				{/* Left: text column, light tone */}
				<div className="hero-left-paper flex items-start border-r border-stone-500/40 px-6 pb-14 pt-16 sm:px-10 lg:px-16 lg:pt-20">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
						className="max-w-2xl"
					>
						<div className="scribble-badge mb-8 inline-flex items-center px-1 py-1">
							<span className="mr-3 h-2 w-2 rounded-full bg-stone-700" />
							<p className="hero-label text-[0.9rem] font-semibold text-stone-700">
								Open to Work · 2026
							</p>
						</div>

						<h1 className="hero-name mb-4 text-4xl font-semibold leading-none text-stone-900 sm:text-5xl lg:text-[3.4rem]">
							Sreekaran Reddy
						</h1>

						<h2 className="hero-subtitle mb-7 max-w-xl text-xl font-semibold leading-snug text-stone-700 sm:text-2xl lg:text-[1.7rem]">
							Data Analyst {'&'} Data Scientist . Causal Inference . LLM Fine-Tuning
						</h2>

						<div className="mb-8 max-w-xl border-l-4 border-[#b9b982] pl-5">
							<p className="hero-quote text-lg leading-relaxed text-stone-700 sm:text-xl">
								“Every data has a story it isn&apos;t telling yet. I enjoy the process of finding it.”
							</p>
						</div>

						<div className="mb-8 flex flex-wrap items-center gap-5">
							<a
								href="https://drive.google.com/file/d/1P0yQdLi8op0JPZ703_cfAMLTnhYCtTTW/view?usp=sharing"
								target="_blank"
								rel="noopener noreferrer"
								className="doodle-resume-btn inline-flex items-center gap-3 px-6 py-3 text-sm"
							>
								View Resume
								<FiArrowRight />
							</a>

							<div className="flex items-center gap-3">
								<a
									href="https://github.com/Sreekaran1704"
									target="_blank"
									rel="noreferrer"
									aria-label="GitHub"
									className="doodle-icon-btn rotate-[-4deg]"
								>
									<FiGithub />
								</a>

								<a
									href="https://www.linkedin.com/in/sree1704"
									target="_blank"
									rel="noreferrer"
									aria-label="LinkedIn"
									className="doodle-icon-btn rotate-[3deg]"
								>
									<FiLinkedin />
								</a>

								<a
									href="mailto:sreekaran.2021@gmail.com"
									aria-label="Email"
									className="doodle-icon-btn rotate-[-2deg]"
								>
									<FiMail />
								</a>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Right: string deck column, tan tone */}
				<div
					className="hero-right-paper relative pb-16"
					style={{ background: '#e8ddc8' }}
				>
					<ClotheslineDeck />
				</div>
			</div>
		</motion.section>
	);
}

export default AppBanner;