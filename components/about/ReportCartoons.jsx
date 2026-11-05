// Editorial cartoons for the special reports, after the daily cartoons in
// Telugu papers like Sakshi: a tall panel, a soft pastel wash, loose hand-inked
// lines (an SVG wobble filter), big-headed figures with expressive faces, and
// props in the background that carry the joke. The recurring character is me,
// drawn true to the front-page photo (see Me below). The signature is "శ్రీ" (Sree) in Telugu, the way those cartoonists
// sign. Colours live in .ct-* classes in report.css.

function Defs({ id, wash }) {
	return (
		<defs>
			{/* Hand-inked lines: a little noise displaces every stroke. */}
			<filter id={`${id}-ink`} x="-5%" y="-5%" width="110%" height="110%">
				<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="noise" />
				<feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
			</filter>
			<linearGradient id={`${id}-wash`} x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={wash[0]} />
				<stop offset="0.65" stopColor={wash[1]} />
				<stop offset="1" stopColor={wash[2]} />
			</linearGradient>
			<radialGradient id={`${id}-skin`} cx="0.4" cy="0.35" r="0.75">
				<stop offset="0" stopColor="#f6d3ad" />
				<stop offset="1" stopColor="#e2a878" />
			</radialGradient>
			<radialGradient id={`${id}-me`} cx="0.42" cy="0.32" r="0.8">
				<stop offset="0" stopColor="#ecc29f" />
				<stop offset="1" stopColor="#d59f78" />
			</radialGradient>
			<linearGradient id={`${id}-kurta`} x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stopColor="#ffffff" />
				<stop offset="1" stopColor="#e4e7ea" />
			</linearGradient>
		</defs>
	);
}

// Me, drawn from the front-page photo and kept true to it: light, warm skin,
// full wavy hair with a fringe, rectangular grey frames, clean-shaven, a wide
// smile, and a beige overshirt over a white tee. Drawn on the cute side: a
// slightly bigger, tilted head and big bright eyes.
function Me({ x, y, s = 1, id, children }) {
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			{/* Overshirt open over a white tee, trousers, shoes. */}
			<path className="ct-trouser ct-line" d="M-20 118 L-18 158 L-6 158 L-2 126 L4 158 L16 158 L20 118Z" />
			<path className="ct-shoe ct-line" d="M-20 158 Q-28 162 -26 166 H-4 V158Z M4 158 V166 H24 Q26 161 16 158Z" />
			<path className="ct-overshirt ct-line" d="M-28 120 Q-32 60 0 54 Q32 60 28 120Z" />
			<path className="ct-tee ct-line" d="M-10 56 Q0 62 10 56 L8 120 H-8Z" />
			<path className="ct-overshirt ct-line" d="M-10 56 L-16 66 L-6 72 Z M10 56 L16 66 L6 72Z" />
			<path className="ct-line ct-thin" d="M-22 82 H-12 V94 H-22Z M12 82 H22 V94 H12Z" />
			{children}
			{/* Neck */}
			<path style={{ fill: `url(#${id}-me)` }} className="ct-line" d="M-8 46 V56 Q0 60 8 56 V46Z" />
			{/* The head, a little bigger and tilted, the cute end of a caricature. */}
			<g transform="translate(0 52) rotate(-6) scale(1.16) translate(0 -46)">
				{/* A soft, round face */}
				<path style={{ fill: `url(#${id}-me)` }} className="ct-line" d="M-24 2 Q-25 -30 0 -31 Q25 -30 24 2 Q24 30 13 40 Q0 48 -13 40 Q-24 30 -24 2Z" />
				{/* Ears */}
				<path style={{ fill: `url(#${id}-me)` }} className="ct-line" d="M-24 2 Q-31 2 -30 10 Q-29 16 -23 15" />
				<path style={{ fill: `url(#${id}-me)` }} className="ct-line" d="M24 2 Q31 2 30 10 Q29 16 23 15" />
				{/* Full wavy hair, with a bouncy fringe */}
				<path
					className="ct-hair ct-line"
					d="M-27 6 Q-34 -6 -28 -19 Q-32 -34 -17 -39 Q-11 -51 3 -46 Q17 -53 25 -41 Q37 -36 33 -22 Q37 -9 28 3 Q27 -8 21 -14 Q18 -6 10 -9 Q8 -16 2 -15 Q-2 -8 -9 -11 Q-12 -18 -17 -13 Q-22 -7 -27 6Z"
				/>
				<path className="ct-hair-light" d="M-16 -33 q6 -5 12 -1 M4 -39 q6 -4 12 1 M18 -31 q5 -2 8 3 M-24 -21 q3 -6 9 -6" />
				{/* Happy brows */}
				<path className="ct-line" d="M-16 -9 Q-11 -13 -5 -10 M5 -10 Q11 -13 16 -9" />
				{/* Big round eyes with two sparkles each */}
				<ellipse className="ct-ink" cx="-10.5" cy="0" rx="3.6" ry="4" />
				<ellipse className="ct-ink" cx="10.5" cy="0" rx="3.6" ry="4" />
				<circle className="ct-paper" cx="-9.2" cy="-1.6" r="1.3" />
				<circle className="ct-paper" cx="11.8" cy="-1.6" r="1.3" />
				<circle className="ct-paper" cx="-11.6" cy="1.6" r="0.6" />
				<circle className="ct-paper" cx="9.4" cy="1.6" r="0.6" />
				{/* Rectangular grey frames */}
				<rect className="ct-frames" x="-19.5" y="-7" width="17" height="13" rx="4" />
				<rect className="ct-frames" x="2.5" y="-7" width="17" height="13" rx="4" />
				<path className="ct-frames" d="M-2.5 -2 Q0 -4 2.5 -2 M-19.5 -3 L-24 -4 M19.5 -3 L24 -4" />
				{/* A small, light nose */}
				<path className="ct-line ct-thin" d="M0 7 Q-1.5 11 0.5 12.5" />
				{/* A big happy smile */}
				<path className="ct-mouth-open ct-line" d="M-11 19 Q0 35 11 19 Q0 23 -11 19Z" />
				<path className="ct-teeth" d="M-9.5 20 Q0 23.5 9.5 20 L8.5 23 Q0 26 -8.5 23Z" />
				<path className="ct-tongue" d="M-4 29 Q0 26 4 29 Q0 31.5 -4 29Z" />
			</g>
		</g>
	);
}

/* ---------- Sree Nirman: History, still quoting last year's prices ---------- */

export function PricingCartoon() {
	const id = 'ctp';
	return (
		<figure className="ct">
			<svg viewBox="0 0 300 420" role="img" aria-label="Editorial cartoon: in an office, a bald old man labelled History waves a 2019 price tag, while through the window cranes put up new buildings in the expanding city. I stand beside him with a tablet showing a price range, grinning at the reader.">
				<Defs id={id} wash={['#d9eef3', '#f4f1e4', '#f6dfe0']} />
				<rect width="300" height="420" fill={`url(#${id}-wash)`} />

				<g filter={`url(#${id}-ink)`}>
					{/* Window: the city outside is growing. */}
					<rect className="ct-window ct-line" x="150" y="34" width="128" height="120" />
					<path className="ct-city" d="M156 154 V112 H176 V96 H196 V124 H212 V84 H236 V118 H252 V102 H272 V154Z" />
					<path className="ct-line ct-thin" d="M176 112 H196 M212 100 H236 M212 112 H236" />
					{/* Two cranes */}
					<path className="ct-line" d="M190 96 V52 M180 56 H236 M230 56 V74 M188 56 L198 46 L206 56" />
					<rect className="ct-tone ct-line" x="224" y="74" width="12" height="8" />
					<path className="ct-line" d="M258 102 V64 M248 68 H282 M276 68 V82" />
					<path className="ct-line is-frame" d="M150 94 H278 M214 34 V154" />
					<rect className="ct-paper ct-line" x="164" y="12" width="100" height="16" />
					<text className="ct-label" x="214" y="24">CITY, EXPANDING</text>

					{/* Wall calendar stuck on 2019, with a cobweb. */}
					<rect className="ct-paper ct-line" x="22" y="40" width="70" height="78" />
					<rect className="ct-tone ct-line" x="22" y="40" width="70" height="18" />
					<text className="ct-label is-big" x="57" y="96">2019</text>
					<path className="ct-line ct-thin" d="M22 118 L44 96 M22 108 Q32 104 34 96 M22 100 Q28 98 28 92 M30 112 Q36 106 40 102" />

					{/* Floor */}
					<path className="ct-floor" d="M0 352 H300 V420 H0Z" />
					<path className="ct-line ct-thin" d="M0 352 H300" />

					{/* History: bald with white side tufts, big nose, specs, kurta and a yellow scarf. */}
					<g transform="translate(96 214)">
						<path style={{ fill: `url(#${id}-kurta)` }} className="ct-line" d="M-34 138 Q-40 60 -2 52 Q36 60 32 138Z" />
						<path className="ct-dhoti ct-line" d="M-30 138 L-28 176 L-8 176 L-2 146 L4 176 L24 176 L28 138Z" />
						<path className="ct-shoe ct-line" d="M-28 176 Q-38 180 -34 184 H-8 V176Z M4 176 V184 H28 Q30 179 22 176Z" />
						<path className="ct-scarf ct-line" d="M-22 56 Q-2 72 22 56 L18 120 L8 120 L6 70 Q-2 76 -10 70 L-14 128 L-24 128Z" />
						<g transform="rotate(-6 0 98)">
							<rect className="ct-paper ct-line" x="-30" y="88" width="62" height="18" />
							<text className="ct-label is-name" x="1" y="101">HISTORY</text>
						</g>
						{/* Arm up, shaking the old price tag. */}
						<path style={{ fill: `url(#${id}-kurta)` }} className="ct-line" d="M-28 70 Q-60 50 -56 4 L-44 2 Q-46 44 -18 62Z" />
						<circle style={{ fill: `url(#${id}-skin)` }} className="ct-line" cx="-50" cy="-2" r="8" />
						<path className="ct-line" d="M-66 -24 l-8 -6 M-36 -30 l6 -8 M-72 -6 l-10 0" />
						<g transform="rotate(-14 -50 -36)">
							<path className="ct-line" d="M-50 -4 L-50 -22" />
							<rect className="ct-tag ct-line" x="-88" y="-66" width="78" height="44" rx="4" />
							<circle className="ct-paper ct-line" cx="-79" cy="-44" r="3.5" />
							<text className="ct-label is-big" x="-46" y="-42">₹29L</text>
							<text className="ct-label" x="-46" y="-29">2019 RATE</text>
						</g>
						{/* Head */}
						<path style={{ fill: `url(#${id}-skin)` }} className="ct-line" d="M-24 10 Q-30 -30 4 -32 Q34 -30 30 8 Q30 40 2 46 Q-24 44 -24 10Z" />
						<path className="ct-white ct-line" d="M-26 0 Q-36 -6 -30 -16 Q-26 -8 -22 -10 M30 0 Q40 -6 34 -16 Q30 -8 26 -10" />
						<path className="ct-line ct-thin" d="M-6 -28 Q2 -32 10 -28" />
						{/* Angry brows, specs low on a bulbous nose, a thick white moustache */}
						<path className="ct-line is-bold" d="M-14 -12 L-2 -6 M14 -6 L26 -12" />
						<circle className="ct-glass ct-line" cx="-6" cy="2" r="7.5" />
						<circle className="ct-glass ct-line" cx="16" cy="2" r="7.5" />
						<path className="ct-line" d="M1.5 2 H8.5" />
						<circle className="ct-ink" cx="-4" cy="3" r="2" />
						<circle className="ct-ink" cx="14" cy="3" r="2" />
						<path className="ct-line ct-thin" d="M6 8 Q3 16 1 20 Q5 23 10 20" />
						<path className="ct-white ct-line" d="M-14 26 Q-2 20 6 28 Q14 20 24 26 Q16 34 6 30 Q-4 34 -14 26Z" />
						<path className="ct-mouth-open ct-line" d="M-2 34 Q6 44 14 34 Q6 37 -2 34Z" />
					</g>

					{/* Me, with the tablet: a range, not a single number. */}
					<Me x={222} y={240} s={0.82} id={id}>
						<path className="ct-overshirt ct-line" d="M-22 72 Q-44 86 -40 104 L-30 104 Q-30 90 -14 82Z" />
					</Me>
					<g transform="translate(150 300) rotate(-8)">
						<rect className="ct-device ct-line" x="0" y="0" width="68" height="48" rx="5" />
						<rect className="ct-paper" x="5" y="5" width="58" height="38" />
						<text className="ct-label" x="34" y="17">₹36–42L</text>
						<line className="ct-line ct-thin" x1="10" y1="31" x2="58" y2="31" />
						<rect className="ct-tone" x="22" y="25" width="24" height="6" />
						<text className="ct-label is-tiny" x="34" y="40">PRICE RANGE</text>
					</g>
				</g>

				{/* Speech, kept short the way those cartoons keep it. */}
				<path className="ct-paper ct-line" d="M136 160 H264 Q272 160 272 168 V188 Q272 196 264 196 H158 L130 226 L146 196 H136 Q128 196 128 188 V168 Q128 160 136 160Z" />
				<text className="ct-say" x="200" y="175">In my day this plot</text>
				<text className="ct-say" x="200" y="190">cost half!</text>

				<text className="ct-sign" x="286" y="410">శ్రీ</text>
			</svg>
			<figcaption className="ct-caption">History, still quoting last year’s prices.</figcaption>
		</figure>
	);
}

/* ---------- Avanthi: the panel, before and after ---------- */

function Reviewer({ x, y, id, look, hair, mood = 'cross', s = 1 }) {
	const mouth = {
		cross: 'M-6 30 Q2 24 10 30',
		shout: 'M-6 28 Q2 40 10 28 Q2 31 -6 28Z',
		calm: 'M-6 28 Q2 34 10 28',
	}[mood];
	return (
		<g transform={`translate(${x} ${y}) scale(${look === 'left' ? -s : s} ${s})`}>
			<path style={hair === 'bun' ? undefined : { fill: `url(#${id}-kurta)` }} className={`ct-line ${hair === 'bun' ? 'ct-saree' : ''}`} d="M-24 100 Q-28 52 2 46 Q30 52 26 100Z" />
			{hair === 'tie' && <path className="ct-tie ct-line" d="M0 50 L-4 58 L0 84 L4 58Z" />}
			<path style={{ fill: `url(#${id}-skin)` }} className="ct-line" d="M-20 8 Q-24 -24 2 -26 Q26 -24 24 6 Q24 34 2 38 Q-20 36 -20 8Z" />
			{hair === 'bun' && <path className="ct-hair ct-line" d="M-22 4 Q-24 -28 2 -28 Q26 -28 24 2 Q16 -14 0 -14 Q-14 -14 -22 4Z M-4 -28 Q2 -42 10 -28Z" />}
			{hair === 'tufts' && <path className="ct-white ct-line" d="M-22 -2 Q-30 -8 -24 -16 Q-20 -8 -18 -10 M24 -2 Q32 -8 26 -16 Q22 -8 20 -10" />}
			{hair === 'tie' && <path className="ct-hair ct-line" d="M-20 -6 Q-20 -28 2 -28 Q24 -28 24 -6 Q16 -18 2 -16 Q-10 -18 -20 -6Z" />}
			{hair === 'cap' && <path className="ct-cap ct-line" d="M-22 -8 Q-20 -32 2 -32 Q24 -32 24 -8Z M-26 -8 H28" />}
			<circle className="ct-ink" cx="-3" cy="2" r="2" />
			<circle className="ct-ink" cx="12" cy="2" r="2" />
			<path className="ct-line is-bold" d={mood === 'calm' ? 'M-8 -8 Q-3 -11 2 -8 M8 -8 Q13 -11 18 -8' : 'M-9 -10 L2 -5 M8 -5 L19 -10'} />
			<path className="ct-line ct-thin" d="M6 6 Q4 13 2 16 Q5 19 9 16" />
			{hair !== 'bun' && <path className="ct-hair ct-line" d="M-6 24 Q2 20 6 25 Q10 20 16 24 Q10 28 6 26 Q0 28 -6 24Z" />}
			<path className={mood === 'shout' ? 'ct-mouth-open ct-line' : 'ct-line'} d={mouth} />
		</g>
	);
}

export function PanelCartoon() {
	const id = 'cta';
	return (
		<figure className="ct">
			<svg viewBox="0 0 300 420" role="img" aria-label="Editorial cartoon in two stacked panels. Before: four reviewers squeezed behind one table shout four different tiers over a single scholarship file. After: one calm reviewer sips tea over a small tray of close calls while I sit at a laptop of prediction intervals; a sign on the door says the other three are out to lunch.">
				<Defs id={id} wash={['#e3f1e6', '#f5f2e5', '#fae4dc']} />
				<rect width="300" height="420" fill={`url(#${id}-wash)`} />

				<g filter={`url(#${id}-ink)`}>
					{/* ---- Before ---- */}
					<rect className="ct-line is-frame" x="8" y="8" width="284" height="196" fill="none" />
					<text className="ct-label is-panel" x="18" y="26">BEFORE</text>
					{/* Papers flying */}
					<path className="ct-paper ct-line" d="M210 22 l22 -6 l4 16 l-22 6Z M246 40 l18 4 l-3 16 l-18 -4Z" />
					<path className="ct-line ct-thin" d="M200 30 l-8 -4 M268 34 l8 -6 M60 40 l-8 -6" />
					<Reviewer x={54} y={96} id={id} hair="tufts" mood="shout" />
					<Reviewer x={112} y={92} id={id} hair="bun" mood="cross" />
					<Reviewer x={172} y={96} id={id} hair="tie" mood="shout" look="left" />
					<Reviewer x={234} y={92} id={id} hair="cap" mood="cross" look="left" />
					{/* Each holds up a different tier. */}
					{[
						[40, 'A'],
						[100, 'B'],
						[160, 'A?'],
						[220, 'C'],
					].map(([x, m]) => (
						<g key={x} transform={`translate(${x} 34) rotate(${x % 120 === 40 ? -8 : 7})`}>
							<rect className="ct-paper ct-line" x="0" y="0" width="28" height="24" />
							<text className="ct-label is-big" x="14" y="17">{m}</text>
						</g>
					))}
					<path className="ct-table ct-line" d="M18 172 H282 V188 H18Z" />
					<g transform="translate(132 156) rotate(-6)">
						<rect className="ct-tone ct-line" x="0" y="0" width="38" height="20" />
						<text className="ct-label is-light" x="19" y="13">FILE</text>
					</g>

					{/* ---- After ---- */}
					<rect className="ct-line is-frame" x="8" y="214" width="284" height="196" fill="none" />
					<text className="ct-label is-panel" x="18" y="232">AFTER</text>
					{/* The door: three are out. */}
					<rect className="ct-door ct-line" x="226" y="226" width="56" height="120" />
					<circle className="ct-ink" cx="236" cy="290" r="2.5" />
					<g transform="translate(232 252) rotate(4)">
						<rect className="ct-paper ct-line" x="0" y="0" width="46" height="30" />
						<text className="ct-label is-tiny" x="23" y="12">3 OUT TO</text>
						<text className="ct-label is-tiny" x="23" y="22">LUNCH</text>
					</g>
					<Reviewer x={184} y={300} id={id} hair="bun" mood="calm" look="left" s={0.9} />
					{/* Tea, steaming */}
					<path className="ct-paper ct-line" d="M150 352 h12 v10 q-6 4 -12 0Z M162 354 q5 0 4 5 q-1 3 -4 2" />
					<path className="ct-line ct-thin" d="M154 346 q-3 -4 0 -8 M158 346 q-3 -4 0 -8" />
					<Me x={56} y={314} s={0.56} id={id} />
					{/* Laptop of intervals */}
					<g transform="translate(76 320)">
						<path className="ct-device ct-line" d="M0 32 L8 0 H58 L52 32Z" />
						<path className="ct-line ct-thin" d="M18 10 H36 M26 18 H46 M14 26 H30" />
						<path className="ct-tone-line" d="M32 18 H42" />
						<rect className="ct-device ct-line" x="-6" y="32" width="66" height="5" />
					</g>
					<path className="ct-table ct-line" d="M18 358 H282 V372 H18Z" />
					<g transform="translate(196 340)">
						<rect className="ct-paper ct-line" x="-26" y="0" width="52" height="16" />
						<rect className="ct-tone ct-line" x="-14" y="-6" width="20" height="7" />
						<text className="ct-label is-tiny" x="0" y="11">CLOSE CALLS</text>
					</g>
				</g>

				{/* Before: four voices at once, no balloon needed. */}
				<text className="ct-shout" x="86" y="70">!!</text>
				<text className="ct-shout" x="204" y="70">!?</text>
				{/* After: one quiet line. */}
				<path className="ct-paper ct-line" d="M24 238 H150 Q158 238 158 246 V270 Q158 278 150 278 H70 L60 292 L58 278 H24 Q16 278 16 270 V246 Q16 238 24 238Z" />
				<text className="ct-say" x="87" y="254">Clear ones are done.</text>
				<text className="ct-say" x="87" y="269">Here are the close calls.</text>

				<text className="ct-sign" x="286" y="404">శ్రీ</text>
			</svg>
			<figcaption className="ct-caption">The scholarship panel, before and after the model learned to say “I’m not sure.”</figcaption>
		</figure>
	);
}
