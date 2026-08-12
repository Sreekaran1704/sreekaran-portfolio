import { motion } from 'framer-motion';
import { CrayonDefs } from './CrayonArt';

const FILTER_ID = 'crayon-garden';

const BUSH_GREENS = ['#7c8d6a', '#6f8161', '#5f7355', '#8a9a72'];
const BLOOMS = ['#f0b9b9', '#f2d99a', '#c9b8dd', '#fdf6e4', '#e8b7c4'];

// Fixed, not random: this renders on the server too, and Math.random would give
// the client a different garden and a hydration mismatch.
const PLANTS = [
	{ type: 'bush', w: 92, h: 58, tone: 0, lift: 0 },
	{ type: 'flowers', w: 54, h: 76, tone: 1, lift: 2 },
	{ type: 'bush', w: 68, h: 44, tone: 2, lift: 1 },
	{ type: 'flowers', w: 46, h: 62, tone: 3, lift: 0 },
	{ type: 'bush', w: 80, h: 52, tone: 1, lift: 3 },
	{ type: 'flowers', w: 50, h: 70, tone: 2, lift: 1 },
	{ type: 'bush', w: 60, h: 40, tone: 3, lift: 0 },
	{ type: 'flowers', w: 44, h: 58, tone: 0, lift: 2 },
];

function Bush({ x, base, w, h, tone }) {
	const c = BUSH_GREENS[tone % BUSH_GREENS.length];
	const c2 = BUSH_GREENS[(tone + 2) % BUSH_GREENS.length];
	const half = w / 2;

	// A bush is a few overlapping lobes rather than one dome — the notches
	// between them are what stop it reading as a green blob.
	const lobes = [
		{ cx: x - half * 0.58, cy: base - h * 0.32, rx: half * 0.5, ry: h * 0.34, fill: c2 },
		{ cx: x + half * 0.56, cy: base - h * 0.3, rx: half * 0.48, ry: h * 0.32, fill: c2 },
		{ cx: x - half * 0.2, cy: base - h * 0.6, rx: half * 0.46, ry: h * 0.42, fill: c },
		{ cx: x + half * 0.24, cy: base - h * 0.62, rx: half * 0.44, ry: h * 0.4, fill: c },
		{ cx: x, cy: base - h * 0.34, rx: half * 0.72, ry: h * 0.36, fill: c },
	];

	return (
		<g>
			<g filter={`url(#${FILTER_ID}-fill)`}>
				{lobes.map((l, i) => (
					<ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} fill={l.fill} opacity="0.88" />
				))}
			</g>

			<g
				filter={`url(#${FILTER_ID}-edge)`}
				fill="none"
				stroke="#4f5c40"
				strokeWidth="1.4"
				strokeLinecap="round"
				opacity="0.75"
			>
				{lobes.slice(2).map((l, i) => (
					<path
						key={i}
						d={`M ${l.cx - l.rx} ${l.cy + l.ry * 0.5} Q ${l.cx} ${l.cy - l.ry} ${l.cx + l.rx} ${l.cy + l.ry * 0.5}`}
					/>
				))}
			</g>
		</g>
	);
}

function FlowerPlant({ x, base, w, h, tone }) {
	const stem = '#6b7a55';
	const half = w / 2;

	// Stems fan out from a single root so the plant has a growing point.
	const stems = [
		{ dx: -half * 0.62, top: h * 0.66, bloom: BLOOMS[tone % BLOOMS.length], r: 6.5 },
		{ dx: 0, top: h, bloom: BLOOMS[(tone + 1) % BLOOMS.length], r: 7.5 },
		{ dx: half * 0.58, top: h * 0.72, bloom: BLOOMS[(tone + 2) % BLOOMS.length], r: 6 },
		{ dx: -half * 0.24, top: h * 0.44, bloom: BLOOMS[(tone + 3) % BLOOMS.length], r: 5 },
		{ dx: half * 0.26, top: h * 0.5, bloom: BLOOMS[(tone + 4) % BLOOMS.length], r: 5.5 },
	];

	return (
		<g>
			<g
				filter={`url(#${FILTER_ID}-edge)`}
				fill="none"
				stroke={stem}
				strokeWidth="1.5"
				strokeLinecap="round"
			>
				{stems.map((s, i) => (
					<path
						key={i}
						d={`M ${x} ${base} Q ${x + s.dx * 0.4} ${base - s.top * 0.55} ${x + s.dx} ${base - s.top}`}
					/>
				))}
				{stems.slice(0, 3).map((s, i) => (
					<path
						key={`leaf-${i}`}
						d={`M ${x + s.dx * 0.42} ${base - s.top * 0.5} q ${s.dx > 0 ? 9 : -9} -3 ${s.dx > 0 ? 12 : -12} 4`}
					/>
				))}
			</g>

			<g filter={`url(#${FILTER_ID}-fill)`}>
				{stems.map((s, i) => (
					<g key={i}>
						{/* Five petals around a centre, drawn as small overlapping discs. */}
						{[0, 1, 2, 3, 4].map((p) => {
							const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
							return (
								<circle
									key={p}
									cx={x + s.dx + Math.cos(a) * s.r * 0.62}
									cy={base - s.top + Math.sin(a) * s.r * 0.62}
									r={s.r * 0.52}
									fill={s.bloom}
									opacity="0.9"
								/>
							);
						})}
						<circle cx={x + s.dx} cy={base - s.top} r={s.r * 0.32} fill="#e0b356" opacity="0.9" />
					</g>
				))}
			</g>
		</g>
	);
}

// A row of bushes and flowering plants filling the space under the search bar.
// The chat panel sits above it in the stacking order, so a conversation simply
// covers the garden rather than pushing it around.
function GardenRow({ width, height }) {
	if (!width || !height) return null;

	const base = height - 10;

	// Tile the fixed plant list across the available width, repeating as needed.
	const placed = [];
	let cursor = 6;
	let i = 0;
	while (cursor < width + 40 && placed.length < 40) {
		const plant = PLANTS[i % PLANTS.length];
		placed.push({ ...plant, x: cursor + plant.w / 2, key: `${i}` });
		// Slight negative gap so neighbouring plants tuck into each other.
		cursor += plant.w * 0.78;
		i += 1;
	}

	return (
		<motion.svg
			className="garden-row"
			width="100%"
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			preserveAspectRatio="none"
			aria-hidden="true"
			initial={{ opacity: 0, y: 14 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
		>
			<CrayonDefs id={FILTER_ID} />

			{/* Ground line */}
			<g filter={`url(#${FILTER_ID}-edge)`}>
				<path
					d={`M 0 ${base + 3} Q ${width * 0.3} ${base} ${width * 0.55} ${base + 2} T ${width} ${base + 1}`}
					fill="none"
					stroke="#8a7a5a"
					strokeWidth="1.6"
					strokeLinecap="round"
					opacity="0.6"
				/>
			</g>

			{placed.map((p) =>
				p.type === 'bush' ? (
					<Bush key={p.key} x={p.x} base={base - p.lift} w={p.w} h={p.h} tone={p.tone} />
				) : (
					<FlowerPlant key={p.key} x={p.x} base={base - p.lift} w={p.w} h={p.h} tone={p.tone} />
				)
			)}
		</motion.svg>
	);
}

export default GardenRow;
