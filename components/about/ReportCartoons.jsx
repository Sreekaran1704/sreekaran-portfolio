import { Children } from 'react';

// Editorial cartoons for the special reports, after the daily cartoons in
// Telugu papers like Sakshi: one tall panel, one gag, figures that act it out,
// and small details in the background that carry the joke.
//
// The hand-drawn look comes from drawing each object in the scene five times,
// back to front, so a figure's wash covers whatever is drawn behind it:
//   1. a watercolour pass: fills only, edges roughened and granulated by a
//      noise filter, and set a little off the lines, the way a wash never
//      quite meets the ink;
//   2. a pencil underdrawing: thin grey lines, shifted and wobbled further, so
//      the sketch shows through as it does on a real page;
//   3. a faint second ink line with its own wobble;
//   4. the ink: lines wobbled by noise, and thickened in patches by a second
//      noise mask, so the pen's pressure seems to change along each stroke;
//   5. the lettering, hand-wobbled but not thickened, so it stays readable;
// then a paper grain over the lot. Which parts each pass keeps is decided in
// report.css (.cs-paint, .cs-pencil, .cs-ghost, .cs-ink).
//
// The recurring character is me, true to the front-page photo: light warm
// skin, full wavy hair with a fringe, rectangular grey frames, clean-shaven, a
// wide smile, and a beige overshirt over a white tee.

const W = 300;
const H = 440;

const r1 = (n) => Math.round(n * 10) / 10;

// A filled limb along a few points, `w` wide: the outline of a sleeve or arm,
// so it can be washed and inked like any other shape.
function limb(pts, w) {
	const left = [];
	const right = [];
	pts.forEach((p, i) => {
		const a = pts[Math.max(i - 1, 0)];
		const b = pts[Math.min(i + 1, pts.length - 1)];
		const dx = b[0] - a[0];
		const dy = b[1] - a[1];
		const len = Math.sqrt(dx * dx + dy * dy) || 1;
		const nx = (-dy / len) * (w / 2);
		const ny = (dx / len) * (w / 2);
		left.push([p[0] + nx, p[1] + ny]);
		right.push([p[0] - nx, p[1] - ny]);
	});
	const pt = (q) => `${r1(q[0])} ${r1(q[1])}`;
	const back = right.reverse();
	return `M${pt(left[0])} ${left
		.slice(1)
		.map((q) => `L${pt(q)}`)
		.join(' ')} ${back.map((q) => `L${pt(q)}`).join(' ')}Z`;
}

function Arm({ pts, w = 11, sleeve, skin, hand = 6 }) {
	const end = pts[pts.length - 1];
	return (
		<g>
			<path className={`${sleeve} cs-line`} d={limb(pts, w)} />
			<circle className={`${skin} cs-line`} cx={end[0]} cy={end[1]} r={hand} />
		</g>
	);
}

/* ---------- The panel: passes, paper, border, signature ---------- */

function Panel({ id, label, caption, children }) {
	return (
		<figure className="cs-panel">
			<svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
				<defs>
					{/* Pen: wobble, then thicken the line in noisy patches. */}
					<filter id={`${id}-ink`} x="-5%" y="-5%" width="110%" height="110%">
						<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" result="wobble" />
						<feDisplacementMap in="SourceGraphic" in2="wobble" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="line" />
						<feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="1" seed="21" result="press" />
						<feColorMatrix in="press" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4 0 0 0 -1.7" result="pressMask" />
						<feMorphology in="line" operator="dilate" radius="0.75" result="thick" />
						<feComposite in="thick" in2="pressMask" operator="in" result="pressed" />
						<feMerge>
							<feMergeNode in="line" />
							<feMergeNode in="pressed" />
						</feMerge>
					</filter>
					<filter id={`${id}-ghost`} x="-5%" y="-5%" width="110%" height="110%">
						<feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="11" result="n" />
						<feDisplacementMap in="SourceGraphic" in2="n" scale="3.6" xChannelSelector="G" yChannelSelector="R" />
					</filter>
					<filter id={`${id}-letter`} x="-5%" y="-5%" width="110%" height="110%">
						<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" seed="9" result="n" />
						<feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
					</filter>
					<filter id={`${id}-pencil`} x="-5%" y="-5%" width="110%" height="110%">
						<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="29" result="n" />
						<feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="B" yChannelSelector="R" />
					</filter>
					<filter id={`${id}-wash`} x="-8%" y="-8%" width="116%" height="116%">
						<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="17" result="blot" />
						<feDisplacementMap in="SourceGraphic" in2="blot" scale="7" xChannelSelector="R" yChannelSelector="B" result="moved" />
						<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="2" result="grain" />
						<feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.35 1.4" result="grainAlpha" />
						<feComposite in="moved" in2="grainAlpha" operator="in" result="granulated" />
						<feGaussianBlur in="granulated" stdDeviation="0.35" />
					</filter>
					<filter id={`${id}-paper`}>
						<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="40" />
						<feColorMatrix type="saturate" values="0" />
					</filter>
				</defs>

				<rect className="cs-ground" width={W} height={H} />
				{Children.toArray(children).map((child, i) => (
					<g key={i}>
						<g className="cs-paint" filter={`url(#${id}-wash)`} transform="translate(2.2 1.8)">
							{child}
						</g>
						<g className="cs-pencil" filter={`url(#${id}-pencil)`} transform="translate(-1.6 1.2)">
							{child}
						</g>
						<g className="cs-ink cs-ghost" filter={`url(#${id}-ghost)`} transform="translate(-0.7 0.6)">
							{child}
						</g>
						<g className="cs-ink" filter={`url(#${id}-ink)`}>
							{child}
						</g>
						<g className="cs-letters" filter={`url(#${id}-letter)`}>
							{child}
						</g>
					</g>
				))}
				<rect className="cs-grain" width={W} height={H} filter={`url(#${id}-paper)`} />
				<path className="cs-border" filter={`url(#${id}-ink)`} d={`M3 4 L${W - 3} 2.5 L${W - 2} ${H - 3} L2.5 ${H - 2}Z`} />
				<text className="cs-sign" x={W - 14} y={H - 14}>
					శ్రీ
				</text>
			</svg>
			<figcaption className="cs-caption">{caption}</figcaption>
		</figure>
	);
}

// A hand-drawn speech balloon: an ellipse with a tail that leaves from the
// edge nearest the speaker, drawn as one outline so there is no seam.
function Say({ x, y, w, h, tx, ty, lines, small }) {
	const rx = w / 2;
	const ry = h / 2;
	const up = ty < y;
	const bx = Math.min(Math.max(tx, x - rx * 0.55), x + rx * 0.55);
	const edge = (px) => ry * Math.sqrt(1 - ((px - x) / rx) ** 2);
	const l = bx - 7;
	const r = bx + 7;
	const d = up
		? `M${r} ${r1(y - edge(r))} A${rx} ${ry} 0 1 1 ${l} ${r1(y - edge(l))} L${tx} ${ty}Z`
		: `M${l} ${r1(y + edge(l))} A${rx} ${ry} 0 1 1 ${r} ${r1(y + edge(r))} L${tx} ${ty}Z`;
	const step = small ? 11 : 13;
	return (
		<g>
			<path className="cs-balloon cs-line" d={d} />
			{lines.map((line, i) => (
				<text key={i} className={`cs-say ${small ? 'is-small' : ''}`} x={x} y={y - ((lines.length - 1) * step) / 2 + i * step + 4}>
					{line}
				</text>
			))}
		</g>
	);
}

// A soft shadow on the floor under a figure.
function Shadow({ x, y, w }) {
	return <ellipse className="cs-shadow" cx={x} cy={y} rx={w / 2} ry={w / 9} />;
}

/* ---------- Characters ---------- */

// Me. Faces right; `flip` faces left. `pose` sets the arms, `look` the eyes.
const ME_ARMS = {
	present: [
		[[-22, 66], [-28, 92], [-24, 114]],
		[[22, 66], [36, 90], [56, 84]],
	],
	pin: [
		[[-22, 66], [-28, 92], [-24, 114]],
		[[22, 64], [38, 20], [34, -66]],
	],
	raise: [
		[[-22, 66], [-28, 92], [-24, 114]],
		[[22, 66], [42, 40], [46, 8]],
	],
};

function Me({ x, y, s = 1, flip, pose = 'present', look = 0 }) {
	const [left, right] = ME_ARMS[pose];
	return (
		<g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
			<path className="ct-trouser cs-line" d="M-20 118 L-18 158 L-6 158 L-2 126 L4 158 L16 158 L20 118Z" />
			<path className="ct-shoe cs-line" d="M-20 158 Q-28 162 -26 166 H-4 V158Z M4 158 V166 H24 Q26 161 16 158Z" />
			<Arm pts={left} sleeve="ct-overshirt" skin="cs-skin-me" />
			<path className="ct-overshirt cs-line" d="M-28 120 Q-32 60 0 54 Q32 60 28 120Z" />
			<path className="ct-tee cs-line" d="M-10 56 Q0 62 10 56 L8 120 H-8Z" />
			<path className="ct-overshirt cs-line" d="M-10 56 L-16 66 L-6 72 Z M10 56 L16 66 L6 72Z" />
			<path className="cs-line cs-thin" d="M-22 82 H-12 V94 H-22Z M12 82 H22 V94 H12Z" />
			<path className="cs-hatch" d="M14 100 l8 -8 M14 108 l10 -10 M16 114 l9 -9" />
			<Arm pts={right} sleeve="ct-overshirt" skin="cs-skin-me" />
			{pose === 'pin' && (
				<g transform="translate(34 -78) rotate(-8)">
					<path className="cs-paper cs-line" d="M-10 -12 H10 V12 H-10Z" />
					<path className="cs-line cs-thin" d="M-6 -4 H6 M-6 2 H4" />
				</g>
			)}
			<path className="cs-skin-me cs-line" d="M-8 46 V56 Q0 60 8 56 V46Z" />
			<g transform="translate(0 52) rotate(-6) scale(1.16) translate(0 -46)">
				<path className="cs-skin-me cs-line" d="M-24 2 Q-25 -30 0 -31 Q25 -30 24 2 Q24 30 13 40 Q0 48 -13 40 Q-24 30 -24 2Z" />
				<path className="cs-skin-me cs-line" d="M-24 2 Q-31 2 -30 10 Q-29 16 -23 15 M24 2 Q31 2 30 10 Q29 16 23 15" />
				<path
					className="ct-hair cs-line"
					d="M-27 6 Q-34 -6 -28 -19 Q-32 -34 -17 -39 Q-11 -51 3 -46 Q17 -53 25 -41 Q37 -36 33 -22 Q37 -9 28 3 Q27 -8 21 -14 Q18 -6 10 -9 Q8 -16 2 -15 Q-2 -8 -9 -11 Q-12 -18 -17 -13 Q-22 -7 -27 6Z"
				/>
				<path className="cs-line cs-thin" d="M-16 -33 q6 -5 12 -1 M4 -39 q6 -4 12 1 M18 -31 q5 -2 8 3" />
				<path className="cs-line" d="M-16 -10 Q-11 -14 -5 -11 M5 -11 Q11 -14 16 -10" />
				<ellipse className="ct-ink" cx={-10.5 + look} cy="0" rx="3.4" ry="3.8" />
				<ellipse className="ct-ink" cx={10.5 + look} cy="0" rx="3.4" ry="3.8" />
				<circle className="cs-spark" cx={-9.3 + look} cy="-1.5" r="1.2" />
				<circle className="cs-spark" cx={11.7 + look} cy="-1.5" r="1.2" />
				<rect className="cs-frames" x="-19.5" y="-7" width="17" height="13" rx="4" />
				<rect className="cs-frames" x="2.5" y="-7" width="17" height="13" rx="4" />
				<path className="cs-frames" d="M-2.5 -2 Q0 -4 2.5 -2 M-19.5 -3 L-24 -4 M19.5 -3 L24 -4" />
				<path className="cs-line cs-thin" d="M0 7 Q-1.5 11 0.5 12.5" />
				<path className="ct-mouth-open cs-line" d="M-11 19 Q0 35 11 19 Q0 23 -11 19Z" />
				<path className="ct-teeth" d="M-9.5 20 Q0 23.5 9.5 20 L8.5 23 Q0 26 -8.5 23Z" />
			</g>
		</g>
	);
}

// A grown-up: a parent. `hair` picks the look; `pose` the gesture.
function Parent({ x, y, s = 1, flip, hair, pose }) {
	const sleeve = hair === 'bun' ? 'cs-saree' : 'cs-kurta';
	return (
		<g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
			<path className={`${sleeve} cs-line`} d="M-26 112 Q-30 52 0 46 Q30 52 26 112Z" />
			{hair === 'bun' && <path className="cs-saree-edge cs-line" d="M-18 50 Q4 70 22 100 L26 112 L18 112 Q4 80 -16 58Z" />}
			<path className="cs-hatch" d="M-24 90 l8 -8 M-24 100 l10 -10 M-22 108 l9 -9" />
			<Arm pts={[[-20, 58], [-30, 90], [-22, 108]]} sleeve={sleeve} skin="cs-skin" />
			<path className="cs-skin cs-line" d="M-20 6 Q-22 -24 0 -26 Q22 -24 20 6 Q20 32 0 38 Q-20 32 -20 6Z" />
			{hair === 'bun' && (
				<>
					<path className="ct-hair cs-line" d="M-21 4 Q-23 -28 0 -28 Q23 -28 21 4 Q14 -14 0 -14 Q-14 -14 -21 4Z" />
					<circle className="ct-hair cs-line" cx="-20" cy="-18" r="8" />
					<circle className="cs-flower" cx="-26" cy="-22" r="3" />
					<circle className="cs-bindi" cx="0" cy="-8" r="1.8" />
				</>
			)}
			{hair === 'cap' && <path className="cs-cap cs-line" d="M-21 -8 Q-19 -32 0 -32 Q19 -32 21 -8Z M-25 -8 H25" />}
			{pose === 'whisper' ? (
				<>
					<path className="cs-line" d="M-12 -4 Q-7 -7 -2 -4 M2 -4 Q7 -7 12 -4" />
					<circle className="ct-ink" cx="-5" cy="3" r="2.1" />
					<circle className="ct-ink" cx="9" cy="3" r="2.1" />
					<path className="cs-line cs-thin" d="M2 7 Q0 13 3 15" />
					<path className="ct-mouth-open cs-line" d="M2 24 Q8 30 13 23Z" />
				</>
			) : (
				<>
					<path className="cs-line" d="M-12 -12 Q-7 -16 -2 -12 M2 -12 Q7 -16 12 -12" />
					<circle className="cs-eye-white cs-line" cx="-7" cy="1" r="4.5" />
					<circle className="cs-eye-white cs-line" cx="7" cy="1" r="4.5" />
					<circle className="ct-ink" cx="-5" cy="2" r="2" />
					<circle className="ct-ink" cx="9" cy="2" r="2" />
					<path className="cs-line cs-thin" d="M0 6 Q-2 12 1 14" />
					<path className="ct-hair cs-line" d="M-9 18 Q0 14 9 18 Q4 21 0 19 Q-4 21 -9 18Z" />
					<ellipse className="ct-mouth-open cs-line" cx="1" cy="27" rx="4" ry="5" />
				</>
			)}
			{pose === 'whisper' && <Arm pts={[[20, 58], [34, 44], [22, 24]]} sleeve={sleeve} skin="cs-skin" />}
			{pose === 'gasp' && <Arm pts={[[20, 58], [34, 40], [18, 12]]} sleeve={sleeve} skin="cs-skin" />}
		</g>
	);
}

// A schoolkid, cheering with both arms up.
function Kid({ x, y, s = 1, flip, hair = 'short' }) {
	return (
		<g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
			<Arm pts={[[-12, 42], [-24, 20], [-22, -6]]} w={9} sleeve="cs-uniform" skin="cs-skin" hand={5} />
			<Arm pts={[[12, 42], [24, 20], [22, -6]]} w={9} sleeve="cs-uniform" skin="cs-skin" hand={5} />
			<path className="cs-uniform cs-line" d="M-16 74 Q-18 38 0 34 Q18 38 16 74Z" />
			<path className="cs-skin cs-line" d="M-15 4 Q-16 -18 0 -19 Q16 -18 15 4 Q15 24 0 28 Q-15 24 -15 4Z" />
			{hair === 'short' && <path className="ct-hair cs-line" d="M-15 2 Q-17 -22 0 -21 Q17 -22 15 2 Q10 -10 0 -10 Q-10 -10 -15 2Z" />}
			{hair === 'plaits' && <path className="ct-hair cs-line" d="M-15 4 Q-17 -22 0 -21 Q17 -22 15 4 Q10 -10 0 -10 Q-10 -10 -15 4Z M-15 4 Q-20 16 -16 24 M15 4 Q20 16 16 24" />}
			<path className="cs-line" d="M-8 2 Q-5 -1 -2 2 M2 2 Q5 -1 8 2" />
			<path className="ct-mouth-open cs-line" d="M-6 12 Q0 22 6 12Z" />
		</g>
	);
}

/* ---------- Props ---------- */

// History, as a grumpy grandpa: cardigan, walking stick, round specs and a
// sash with his name, one arm up waving last year's price tag.
function History({ x, y, s = 1 }) {
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<path className="ct-trouser cs-line" d="M-20 118 L-18 160 L-6 160 L-2 128 L4 160 L16 160 L20 118Z" />
			<path className="ct-shoe cs-line" d="M-18 160 Q-28 164 -26 168 H-4 V160Z M4 160 V168 H24 Q26 163 16 160Z" />
			{/* Walking stick */}
			<path className="cs-cane cs-line" d="M40 70 Q50 62 54 72 L46 168 L42 168 L48 76 Q46 70 42 74Z" />
			<path className="cs-cardigan cs-line" d="M-30 122 Q-34 58 0 52 Q34 58 30 122Z" />
			<path className="cs-line cs-thin" d="M0 56 V122 M-4 74 h0 M-4 90 h0" />
			<circle className="ct-ink" cx="4" cy="76" r="1.6" />
			<circle className="ct-ink" cx="4" cy="92" r="1.6" />
			<circle className="ct-ink" cx="4" cy="108" r="1.6" />
			<path className="cs-hatch" d="M16 100 l10 -10 M16 110 l12 -12 M18 118 l10 -10" />
			{/* The sash with his name */}
			<path className="cs-sash cs-line" d="M-30 70 L30 94 L28 108 L-32 84Z" />
			<text className="cs-prop is-sash" x="-1" y="93" transform="rotate(21 -1 89)">
				HISTORY
			</text>
			{/* Hand on the stick */}
			<Arm pts={[[26, 64], [40, 76], [46, 74]]} w={11} sleeve="cs-cardigan" skin="cs-skin" hand={6} />
			<path className="cs-skin cs-line" d="M-7 44 V54 Q0 58 7 54 V44Z" />
			{/* Head: bald on top, white hair round the sides */}
			<path className="cs-skin cs-line" d="M-22 4 Q-24 -28 0 -30 Q24 -28 22 4 Q22 34 0 42 Q-22 34 -22 4Z" />
			<path className="cs-whitehair cs-line" d="M-23 6 Q-30 -6 -24 -16 Q-20 -6 -18 -8 Q-20 2 -23 6Z M23 6 Q30 -6 24 -16 Q20 -6 18 -8 Q20 2 23 6Z" />
			<path className="cs-line cs-thin" d="M-8 -24 Q0 -27 8 -24" />
			{/* Bushy white brows, frowning */}
			<path className="cs-whitehair cs-line" d="M-17 -12 Q-10 -18 -3 -10 L-4 -7 Q-10 -12 -16 -9Z M17 -12 Q10 -18 3 -10 L4 -7 Q10 -12 16 -9Z" />
			<circle className="cs-specs cs-line" cx="-9" cy="0" r="7" />
			<circle className="cs-specs cs-line" cx="9" cy="0" r="7" />
			<path className="cs-line cs-thin" d="M-2 0 H2" />
			<circle className="ct-ink" cx="-7" cy="1" r="2" />
			<circle className="ct-ink" cx="7" cy="1" r="2" />
			<path className="cs-line cs-thin" d="M0 6 Q-2 12 1 14" />
			<path className="cs-whitehair cs-line" d="M-12 18 Q0 12 12 18 Q6 23 0 20 Q-6 23 -12 18Z" />
			<path className="ct-mouth-open cs-line" d="M-6 25 Q0 35 6 25Z" />
			{/* Arm up, waving the tag */}
			<Arm pts={[[-26, 64], [-46, 36], [-48, -6]]} w={11} sleeve="cs-cardigan" skin="cs-skin" hand={6} />
			<path className="cs-line cs-thin" d="M-62 -8 l-8 -2 M-60 6 l-8 4 M-36 -14 l6 -6" />
		</g>
	);
}

/* ---------- Sree Nirman: History, still quoting last year's prices ---------- */

export function PricingCartoon() {
	return (
		<Panel
			id="cps"
			label="Editorial cartoon: in the site office, an old man wearing a sash that says History waves a price tag reading 29 lakh, 2019 rate, and grumbles: in my day this plot cost 29 lakh! On the wall a calendar is stuck on 2019, with a cobweb. Through the window, cranes put up a new city. I stand beside him holding up a tablet showing 36 to 42 lakh with its cost drivers and say: let’s price the ground we’re standing on."
			caption="History, still quoting last year’s prices."
		>
			<path className="cs-wall" d="M0 0 H300 V330 H0Z" />
			<path className="cs-floor" d="M0 330 H300 V440 H0Z" />
			<path className="cs-line cs-thin" d="M0 330 H300" />
			<path className="cs-hatch" d="M0 330 l12 -12 M14 330 l12 -12 M268 330 l12 -12 M282 330 l12 -12" />

			{/* The calendar, stuck on 2019, with a cobweb */}
			<path className="cs-paper cs-line" d="M22 30 H92 V108 H22Z" />
			<path className="cs-calendar-top cs-line" d="M22 30 H92 V48 H22Z" />
			<path className="cs-line" d="M38 24 V34 M76 24 V34" />
			<text className="cs-prop is-huge" x="57" y="86">
				2019
			</text>
			<path className="cs-line cs-thin" d="M22 108 L44 86 M22 98 Q32 94 34 86 M22 90 Q28 88 28 82 M30 102 Q36 96 40 92" />

			{/* The window: the city is growing */}
			<path className="cs-window cs-line" d="M150 26 H284 V146 H150Z" />
			<path className="cs-city" d="M154 146 V110 H172 V94 H192 V120 H206 V82 H228 V114 H244 V100 H280 V146Z" />
			<path className="cs-line" d="M186 94 V46 M176 50 H234 M228 50 V66 M262 100 V60 M254 62 H284" />
			<path className="cs-crane-box cs-line" d="M222 66 H234 V74 H222Z" />
			<path className="cs-line" d="M150 86 H284 M217 26 V146" />
			<path className="cs-paper cs-line" d="M186 152 H248 V168 H186Z" />
			<text className="cs-prop" x="217" y="164">
				NEW CITY
			</text>

			<Shadow x={98} y={422} w={80} />
			<History x={98} y={256} s={0.95} />
			{/* Last year's price tag, waved overhead */}
			<g transform="translate(14 196) rotate(-12)">
				<path className="cs-line cs-thin" d="M40 34 L40 50" />
				<path className="cs-tag cs-line" d="M0 0 H74 V36 H0Z" />
				<circle className="cs-paper cs-line" cx="9" cy="18" r="3.5" />
				<text className="cs-prop is-big" x="42" y="18">
					₹29L
				</text>
				<text className="cs-prop" x="42" y="30">
					2019 RATE
				</text>
			</g>

			<Shadow x={238} y={426} w={56} />
			<Me x={238} y={290} s={0.82} flip pose="raise" look={-2} />
			<g transform="translate(200 280) rotate(-6)">
				<path className="cs-device cs-line" d="M-24 -18 H24 V18 H-24Z" />
				<path className="cs-screen" d="M-20 -14 H20 V14 H-20Z" />
				<text className="cs-screen-text is-mid" x="0" y="-2">
					₹36–42L
				</text>
				<text className="cs-screen-text is-tiny" x="0" y="8">
					+ cost drivers
				</text>
			</g>

			<Say x={82} y={152} w={150} h={40} tx={100} ty={226} small lines={['In my day this plot', 'cost ₹29L!']} />
			<Say x={222} y={204} w={146} h={40} tx={240} ty={234} small lines={['Let’s price the ground', 'we’re standing on.']} />
		</Panel>
	);
}

/* ---------- Avanthi: the word at the school gate ---------- */

export function ScholarshipCartoon() {
	return (
		<Panel
			id="cpa"
			label="Editorial cartoon: at the gate of Avanthi High School, a mother leans in and whispers to a father: scholarships by marks, not by lottery! He gasps, hand to his cheek: telling my sister tonight! Behind them, students cheer at a classroom window, I pin a list of predicted marks and scholarship percentages to the notice board, the old pot of percentage chits sits in the dustbin, and a crow on the gate listens in."
			caption="At the school gate, the word travelled faster than any poster."
		>
			<path className="cs-sky" d="M0 0 H300 V330 H0Z" />
			<path className="cs-floor" d="M0 330 H300 V440 H0Z" />
			<path className="cs-line cs-thin" d="M0 330 H300" />
			<path className="cs-line cs-thin" d="M30 30 q8 -6 16 0 q8 -6 16 0 M72 52 q6 -4 12 0 q6 -4 12 0" />

			{/* The school, with a window of cheering students */}
			<path className="cs-school cs-line" d="M150 180 V64 L222 26 L294 64 V180Z" />
			<path className="cs-hatch" d="M152 178 l10 -10 M266 178 l10 -10 M280 178 l10 -10" />
			<path className="cs-paper cs-line" d="M166 70 H278 V88 H166Z" />
			<text className="cs-prop" x="222" y="83">
				AVANTHI HIGH SCHOOL
			</text>
			<path className="cs-window cs-line" d="M170 96 H274 V150 H170Z" />
			<Kid x={192} y={118} s={0.4} />
			<Kid x={222} y={116} s={0.4} hair="plaits" />
			<Kid x={252} y={118} s={0.4} flip />
			<path className="cs-sill cs-line" d="M166 150 H278 V156 H166Z" />
			<text className="cs-shout is-small" x="222" y="171">
				Tier 1, here we come!
			</text>

			{/* The gate, and a crow listening in */}
			<path className="cs-gate cs-line" d="M144 250 H300 M144 270 H300 M156 240 V330 M180 240 V330 M204 240 V330 M228 240 V330 M252 240 V330 M276 240 V330" />
			<g transform="translate(282 240)">
				<path className="cs-crow cs-line" d="M-12 0 Q-12 -14 0 -14 Q8 -14 10 -8 L16 -6 L10 -4 Q8 4 -2 6 L-10 10 L-8 4 Q-12 4 -12 0Z" />
				<circle className="cs-spark" cx="4" cy="-9" r="1.4" />
				<path className="cs-line cs-thin" d="M-2 6 V10 M2 5 V10" />
			</g>
			<text className="cs-mutter" x="256" y="236">
				caw?
			</text>

			{/* The notice board */}
			<path className="cs-line" d="M40 330 V236 M120 330 V236" />
			<path className="cs-board-cork cs-line" d="M24 120 H136 V240 H24Z" />
			<path className="cs-paper cs-line" d="M34 130 H126 V230 H34Z" />
			<text className="cs-prop" x="80" y="146">
				SCHOLARSHIPS
			</text>
			<text className="cs-prop is-tiny" x="80" y="157">
				by predicted marks
			</text>
			{[
				['S-07 · 8.9', '75%'],
				['S-12 · 7.8', '50%'],
				['S-23 · 5.2', '25%'],
			].map(([who, pct], i) => (
				<g key={who}>
					<text className="cs-notice" x="40" y={178 + i * 18}>
						{who}
					</text>
					<text className="cs-notice is-pct" x="120" y={178 + i * 18}>
						{pct}
					</text>
				</g>
			))}
			<circle className="cs-pin" cx="80" cy="128" r="3" />

			<Shadow x={92} y={362} w={40} />
			<Me x={92} y={278} s={0.5} flip pose="pin" look={-2} />

			{/* The old pot of percentages, binned, with a fly for company */}
			<path className="cs-paper cs-line" d="M18 270 H42 V282 H18Z" />
			<text className="cs-prop is-tiny" x="30" y="279">
				50%?
			</text>
			<path className="cs-pot cs-line" d="M14 302 Q12 284 30 282 H34 Q52 284 48 302Z" />
			<text className="cs-prop" x="31" y="298">
				%
			</text>
			<path className="cs-bin cs-line" d="M8 300 H54 L50 360 H12Z" />
			<path className="cs-line cs-thin" d="M18 314 V350 M31 314 V350 M44 314 V350" />
			<path className="cs-line cs-thin" d="M50 262 q4 -6 8 0 q4 6 8 0" />
			<circle className="ct-ink" cx="66" cy="262" r="1.6" />

			{/* Two parents at the gate */}
			<Shadow x={184} y={392} w={60} />
			<Shadow x={256} y={398} w={60} />
			<Parent x={184} y={294} s={0.86} hair="bun" pose="whisper" />
			<Parent x={256} y={300} s={0.86} hair="cap" pose="gasp" flip />
			<path className="cs-line cs-thin" d="M206 300 q4 -3 8 0 M206 308 q5 -3 10 0" />

			<Say x={204} y={202} w={164} h={40} tx={196} ty={262} lines={['Scholarships by marks,', 'not by lottery!']} />
			<Say x={194} y={416} w={140} h={32} tx={244} ty={392} small lines={['Telling my sister', 'tonight!']} />
		</Panel>
	);
}
