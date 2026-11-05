import { createPortal } from 'react-dom';

// The way into the black & white edition (RainShower brings the colour back): a filthy old truck rattles across the
// bottom of the screen, its smoke fills the page, and EditionToggle drains the
// colour while nothing can be seen. When the smoke clears, the colour is gone.
// Timings live in smog.css; SMOG_SWAP_AT and SMOG_END_AT must match them.
export const SMOG_SWAP_AT = 1900;
export const SMOG_END_AT = 3900;

const OUTLINE = '#2a2533';
const DRIVE_SECONDS = 2.9;

// Fixed patterns rather than random numbers, so every run looks as good as the
// one that was checked.
const PUFFS = Array.from({ length: 30 }, (_, i) => {
	const delay = (i / 30) * 2.5;
	return {
		delay,
		along: delay / DRIVE_SECONDS,
		drift: ((i * 37) % 60) - 30,
		rise: 45 + ((i * 53) % 60),
		grow: 5 + ((i * 29) % 5),
		last: 1.6 + ((i * 17) % 9) / 10,
	};
});

const CLOUDS = [
	{ left: -8, top: 62, size: 95, delay: 0 },
	{ left: 42, top: 70, size: 110, delay: 0.15 },
	{ left: 14, top: 34, size: 100, delay: 0.3 },
	{ left: 62, top: 30, size: 90, delay: 0.1 },
	{ left: -12, top: 2, size: 95, delay: 0.45 },
	{ left: 40, top: -6, size: 105, delay: 0.25 },
];

function SmogTruck() {
	return createPortal(
		<div className="np-smog-stage" aria-hidden="true">
			<div className="np-smog-haze" />

			{CLOUDS.map((cloud) => (
				<span
					key={`${cloud.left}-${cloud.top}`}
					className="np-smog-cloud"
					style={{
						left: `${cloud.left}%`,
						top: `${cloud.top}%`,
						width: `${cloud.size}vmax`,
						height: `${cloud.size}vmax`,
						'--clear-delay': `${cloud.delay}s`,
					}}
				/>
			))}

			{PUFFS.map((puff) => (
				<span
					key={puff.delay}
					className="np-smog-puff"
					style={{
						'--along': puff.along,
						'--drift': `${puff.drift}vw`,
						'--rise': `${puff.rise}vh`,
						'--grow': puff.grow,
						animationDelay: `${puff.delay}s`,
						animationDuration: `${puff.last}s`,
					}}
				/>
			))}

			<div className="np-smog-truck">
				<svg viewBox="0 0 220 120" overflow="visible" focusable="false">
					<ellipse cx="110" cy="115" rx="104" ry="5" fill="rgba(0, 0, 0, 0.3)" />

					<g className="np-smog-rattle">
						{/* Exhaust stack, with a spit of fire now and then */}
						<path className="np-smog-flame" d="M113 3 C108 -7 112 -13 117 -18 C118 -11 125 -9 122 3 Z" fill="#ff9d2e" stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round" />
						<rect x="110" y="3" width="14" height="36" rx="2" fill="#3b3a40" stroke={OUTLINE} strokeWidth="2.5" />
						<rect x="107" y="1" width="20" height="6" rx="2" fill="#17161a" stroke={OUTLINE} strokeWidth="2" />

						{/* Rusty cargo box */}
						<path d="M8 34 L126 34 L126 90 L8 90 Z" fill="#a9552f" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
						<path d="M29 34 V90 M50 34 V90 M71 34 V90 M92 34 V90 M113 34 V90" stroke="#8a4324" strokeWidth="2" />
						<path d="M14 60 C22 54 32 66 40 58 C44 72 26 76 14 70 Z" fill="#7d3b20" />
						<path d="M78 40 C90 37 98 46 106 42 C104 56 88 56 78 50 Z" fill="#c9733f" />
						<path d="M8 34 C30 42 48 30 66 37 C86 44 106 32 126 36 L126 34 L8 34 Z" fill="#2b2a2d" />
						<circle cx="18" cy="44" r="1.8" fill="#4d2615" />
						<circle cx="58" cy="80" r="1.8" fill="#4d2615" />
						<circle cx="100" cy="72" r="1.8" fill="#4d2615" />

						{/* Grumpy cab */}
						<path d="M128 44 L170 44 L190 66 L208 70 C212 71 214 74 214 78 L214 92 L128 92 Z" fill="#d9a441" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
						<path d="M138 51 L167 51 L182 67 L138 67 Z" fill="#e8f2f2" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
						<path d="M144 56 L155 60" stroke={OUTLINE} strokeWidth="2.6" strokeLinecap="round" />
						<path d="M172 60 L161 60" stroke={OUTLINE} strokeWidth="2.6" strokeLinecap="round" />
						<circle cx="150" cy="63" r="2.4" fill={OUTLINE} />
						<circle cx="166" cy="63" r="2.4" fill={OUTLINE} />
						<path d="M196 78 H214 M196 84 H214" stroke={OUTLINE} strokeWidth="2.2" />
						<circle cx="207" cy="72" r="3.4" fill="#fff6c9" stroke={OUTLINE} strokeWidth="1.8" />
						<path d="M138 74 C148 71 160 79 170 74" fill="none" stroke="#a97c2a" strokeWidth="2" strokeLinecap="round" />
						<rect x="4" y="88" width="212" height="8" rx="2" fill="#3b3a40" stroke={OUTLINE} strokeWidth="2.5" />
					</g>

					<g className="np-smog-wheel">
						<circle cx="48" cy="98" r="16" fill="#26252a" stroke={OUTLINE} strokeWidth="2.5" />
						<circle cx="48" cy="98" r="6.5" fill="#a8a59d" stroke={OUTLINE} strokeWidth="2" />
						<path d="M48 91.5 V104.5 M41.5 98 H54.5" stroke={OUTLINE} strokeWidth="1.8" />
					</g>
					<g className="np-smog-wheel">
						<circle cx="170" cy="98" r="16" fill="#26252a" stroke={OUTLINE} strokeWidth="2.5" />
						<circle cx="170" cy="98" r="6.5" fill="#a8a59d" stroke={OUTLINE} strokeWidth="2" />
						<path d="M170 91.5 V104.5 M163.5 98 H176.5" stroke={OUTLINE} strokeWidth="1.8" />
					</g>
				</svg>
			</div>
		</div>,
		document.body,
	);
}

export default SmogTruck;
