import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const workCards = [
	{
		id: 'sree-dashboard',
		label: 'Dashboard',
		title: 'Sree Nirman',
		metric: '50K+',
		note: 'construction records standardized',
		bg: '#f7e9b8',
	},
	{
		id: 'avanthi-dashboard',
		label: 'Dashboard',
		title: 'Avanthi High School',
		metric: '30%',
		note: 'reporting accuracy improved',
		bg: '#c9e3d8',
	},
	{
		id: 'umkc',
		label: 'Academics',
		title: 'UMKC',
		metric: '3.97',
		note: 'M.S. Computer Science GPA',
		bg: '#d3ddf0',
	},
	{
		id: 'fanhouse',
		label: 'Causal Inference',
		title: 'FanHouse',
		metric: '8x',
		note: 'naive overstatement caught and corrected',
		bg: '#f7c9c9',
	},
];

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

function ClotheslineNote({ card, index, point }) {
	const tilt = index % 2 === 0 ? -4 : 4;
	const pinGripOffset = 4; // distance from the note's top anchor to where the pin visually grips the string (centers the crossbar, which is 8 tall, on the curve)
	const cardWidth = 148;

	if (!point) return null;

	const noteX = point.x;
	const targetY = point.y - pinGripOffset;

	return (
		<motion.div
			initial={{ opacity: 0, left: noteX, top: targetY - 30 }}
			animate={{ opacity: 1, left: noteX, top: targetY }}
			transition={{ duration: 0.5, delay: 0.3 + index * 0.14, ease: [0.34, 1.2, 0.64, 1] }}
			style={{
				position: 'absolute',
				width: cardWidth,
				transform: 'translateX(-50%)',
			}}
		>
			{/* Pin sits directly above the card, both moving together */}
			<div style={{ width: 28, margin: '0 auto', position: 'relative' }}>
				<div style={{ width: 28, height: 16, margin: '0 auto', position: 'relative', zIndex: 2 }}>
					<div style={{ width: 3, height: 16, background: '#8a5a3a', margin: '0 auto' }} />
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 4,
							width: 20,
							height: 8,
							background: '#c99a6a',
							borderRadius: 2,
							transform: 'rotate(-2deg)',
						}}
					/>
				</div>
			</div>

			<motion.div
				whileHover={{ scale: 1.05, rotate: 0 }}
				animate={{ rotate: [tilt - 1, tilt + 1, tilt - 1] }}
				transition={{ duration: 4, delay: index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
				tabIndex={0}
				style={{
					width: cardWidth,
				}}
			>
				<div
					style={{
						background: card.bg,
						width: 148,
						minHeight: 156,
						padding: 14,
						boxShadow: '1px 3px 8px rgba(0,0,0,0.15)',
					}}
				>
					<p style={{ fontSize: 12, color: '#5a5238', margin: '0 0 5px' }}>{card.label}</p>
					<h4 style={{ fontSize: 15, fontWeight: 500, color: '#2e2a1c', margin: '0 0 12px' }}>
						{card.title}
					</h4>
					<div style={{ fontSize: 23, fontWeight: 600, color: '#2e2a1c', marginBottom: 8 }}>
						{card.metric}
					</div>
					<p style={{ fontSize: 10.5, color: '#5a5238', margin: 0, lineHeight: 1.4 }}>{card.note}</p>
				</div>
			</motion.div>
		</motion.div>
	);
}

// Notes are inset from the true edges so their pins stay on-panel; this must
// match the pin's actual displayed x exactly, since the curve is steep near
// the corners and even a small x error there produces a large y error.
const EDGE_INSET = 70;

function useCurvePoints(pathD, width, ready) {
	const [points, setPoints] = useState(null);

	useEffect(() => {
		if (!ready) return;
		const ns = 'http://www.w3.org/2000/svg';
		const svg = document.createElementNS(ns, 'svg');
		const path = document.createElementNS(ns, 'path');
		path.setAttribute('d', pathD);
		svg.appendChild(path);
		svg.style.position = 'absolute';
		svg.style.width = '0';
		svg.style.height = '0';
		svg.style.overflow = 'hidden';
		document.body.appendChild(svg);

		const len = path.getTotalLength();
		const n = workCards.length;
		const targetXs =
			n === 1
				? [width / 2]
				: Array.from({ length: n }, (_, i) => EDGE_INSET + (i / (n - 1)) * (width - 2 * EDGE_INSET));

		// Binary-search along arc-length to find the point whose x matches each note's actual displayed x.
		const pts = targetXs.map((targetX) => {
			let lo = 0;
			let hi = len;
			for (let i = 0; i < 25; i++) {
				const mid = (lo + hi) / 2;
				const p = path.getPointAtLength(mid);
				if (p.x < targetX) {
					lo = mid;
				} else {
					hi = mid;
				}
			}
			return path.getPointAtLength((lo + hi) / 2);
		});

		document.body.removeChild(svg);
		setPoints(pts);
	}, [pathD, width, ready]);

	return points;
}

function ClotheslineDeck() {
	const containerRef = useRef(null);
	const [size, setSize] = useState({ width: 660, height: 620 });

	useEffect(() => {
		const update = () => {
			if (containerRef.current) {
				setSize({
					width: containerRef.current.offsetWidth,
					height: containerRef.current.offsetHeight,
				});
			}
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	const { width, height } = size;
	const topY = 30;
	const bottomY = height - 20;

	// Simple U-shaped parabola: top-left corner down to a single smooth dip, back up to top-right corner.
	const stringStart = { x: 0, y: topY };
	const stringControl = { x: width / 2, y: bottomY };
	const stringEnd = { x: width, y: topY };
	const stringPath = `M ${stringStart.x} ${stringStart.y} Q ${stringControl.x} ${stringControl.y} ${stringEnd.x} ${stringEnd.y}`;
	const vinePath = vinePathD(stringStart, stringControl, stringEnd, width, VINE_WAVELENGTH, VINE_AMPLITUDE);

	const points = useCurvePoints(stringPath, width, width > 0 && height > 0);

	// Leaf sprigs are sampled densely along the vine's wave, so the whole
	// thing reads as a leafy vine draped along the string rather than a
	// scatter of separate leaves.
	const totalLeaves = width > 0 ? Math.floor(width / VINE_LEAF_SPACING) : 0;
	const sprigs = [];
	for (let i = 0; i <= totalLeaves; i++) {
		const x = VINE_LEAF_SPACING * (i + 0.5);
		if (x > width) break;
		const t = x / width; // exact, since x(t) = width * t for this curve
		const point = vinePoint(t, stringStart, stringControl, stringEnd, VINE_WAVELENGTH, VINE_AMPLITUDE);
		const tangent = quadTangent(t, stringStart, stringControl, stringEnd);
		// Rounded to avoid a hydration mismatch: atan2 can differ in its last
		// floating-point digit between server and client JS engines.
		const angle = Math.round(((Math.atan2(tangent.y, tangent.x) * 180) / Math.PI) * 100) / 100;
		sprigs.push({
			point,
			angle,
			side: i % 2,
			colorIndex: i,
			delay: 0.6 + t * 0.8,
		});
	}

	return (
		<div ref={containerRef} style={{ position: 'relative', height: '100%', minHeight: 620, width: '100%' }}>
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

				<motion.path
					d={stringPath}
					stroke="#8a7a5a"
					strokeWidth={1.5}
					fill="none"
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 1.1, ease: 'easeOut' }}
				/>

				<motion.path
					d={vinePath}
					stroke="#5f7355"
					strokeWidth={1.6}
					fill="none"
					opacity={0.85}
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
				/>

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
			</svg>

			{points &&
				workCards.map((card, i) => (
					<ClotheslineNote key={card.id} card={card} index={i} point={points[i]} />
				))}
		</div>
	);
}

function AppBanner() {
	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ ease: 'easeInOut', duration: 0.8 }}
			className="hero-notebook mt-0 min-h-[calc(100vh-72px)] w-full"
		>
			<div className="grid min-h-[calc(100vh-72px)] grid-cols-1 lg:grid-cols-2">
				{/* Left: text column, light tone */}
				<div className="hero-left-paper flex items-start border-r border-stone-500/40 px-6 pb-14 pt-24 sm:px-10 lg:px-16 lg:pt-28">
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