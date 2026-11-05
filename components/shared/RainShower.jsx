import { createPortal } from 'react-dom';

// The way back into colour, the other half of the smog truck's story: rain
// clouds roll in over the grey page, a flash of lightning, and the rain washes
// the pollution away. EditionToggle opens the colour edition from the top of
// the screen down, like a wash running down the page, and a rainbow shows as
// the clouds leave. Timings live in rain.css; RAIN_REVEAL_AT and RAIN_END_AT
// must match them.
export const RAIN_REVEAL_AT = 1100;
export const RAIN_END_AT = 3900;

// Fixed patterns rather than random numbers, so every run looks as good as the
// one that was checked.
const DROPS = Array.from({ length: 130 }, (_, i) => ({
	left: (i * 37) % 100 + ((i * 13) % 10) / 10,
	delay: ((i * 23) % 100) / 100,
	fall: 0.55 + ((i * 17) % 30) / 100,
	length: 56 + ((i * 29) % 50),
	faint: i % 3 === 0,
}));

const SPLASHES = Array.from({ length: 14 }, (_, i) => ({
	left: 3 + ((i * 41) % 94),
	delay: 0.7 + ((i * 19) % 50) / 50,
}));

const CLOUDS = [
	{ left: -10, size: 46, top: -18, delay: 0 },
	{ left: 18, size: 54, top: -24, delay: 0.08 },
	{ left: 48, size: 50, top: -20, delay: 0.04 },
	{ left: 76, size: 48, top: -22, delay: 0.12 },
	{ left: 4, size: 36, top: -8, delay: 0.16 },
	{ left: 62, size: 40, top: -10, delay: 0.2 },
];

function RainShower() {
	return createPortal(
		<div className="np-rain-stage" aria-hidden="true">
			{/* The pollution over the page, washed off by the rain */}
			<div className="np-rain-smog" />
			<div className="np-rain-flash" />

			{CLOUDS.map((cloud) => (
				<span
					key={cloud.left}
					className="np-rain-cloud"
					style={{
						left: `${cloud.left}%`,
						top: `${cloud.top}vmax`,
						width: `${cloud.size}vmax`,
						height: `${cloud.size * 0.62}vmax`,
						'--cloud-delay': `${cloud.delay}s`,
					}}
				/>
			))}

			{DROPS.map((drop, i) => (
				<span
					key={i}
					className={`np-rain-drop${drop.faint ? ' is-faint' : ''}`}
					style={{
						left: `${drop.left}%`,
						height: `${drop.length}px`,
						animationDelay: `${0.35 + drop.delay}s`,
						animationDuration: `${drop.fall}s`,
					}}
				/>
			))}

			{SPLASHES.map((splash) => (
				<span key={splash.left} className="np-rain-splash" style={{ left: `${splash.left}%`, animationDelay: `${splash.delay}s` }} />
			))}

			<svg className="np-rain-bow" viewBox="0 0 200 100" focusable="false">
				{['#e5484d', '#f59e0b', '#f5d142', '#3fa66b', '#2f80c9', '#7b5ea7'].map((colour, i) => (
					<path key={colour} d={`M${10 + i * 6} 100 A${90 - i * 6} ${90 - i * 6} 0 0 1 ${190 - i * 6} 100`} fill="none" stroke={colour} strokeWidth="6" />
				))}
			</svg>
		</div>,
		document.body,
	);
}

export default RainShower;
