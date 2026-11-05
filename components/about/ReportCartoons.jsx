// Editorial cartoons for the special reports: ink line drawings with labelled
// props, a speech balloon and a caption, the way a paper sums up a story in
// one panel. The recurring character is me, drawn from the front-page photo:
// curly hair, round glasses, a beard and a wide smile. Colours come from
// classes (.ct-*) in report.css, so the black & white edition restyles them.

function Me({ x, y, s = 1, flip = false, children }) {
	return (
		<g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
			{/* Body: shirt in the report's colour, arms drawn by the caller. */}
			<path className="ct-tone ct-line" d="M-22 78 Q-24 44 0 40 Q24 44 22 78Z" />
			<path className="ct-line" d="M0 40 L0 52" />
			{children}
			{/* Head: an oversized caricature head. */}
			<ellipse className="ct-skin ct-line" cx="0" cy="8" rx="23" ry="26" />
			{/* Curly hair: a row of bumps over the top. */}
			<path
				className="ct-hair ct-line"
				d="M-24 6 Q-30 -6 -21 -12 Q-22 -24 -10 -24 Q-6 -34 4 -28 Q14 -34 19 -23 Q30 -22 26 -9 Q32 0 25 8 Q22 -4 14 -8 Q6 -14 -4 -10 Q-14 -12 -18 -2 Q-22 2 -24 6Z"
			/>
			{/* Ears */}
			<path className="ct-skin ct-line" d="M-23 10 Q-30 10 -28 17 Q-26 21 -22 19" />
			<path className="ct-skin ct-line" d="M23 10 Q30 10 28 17 Q26 21 22 19" />
			{/* Glasses */}
			<circle className="ct-glass ct-line" cx="-9" cy="7" r="7" />
			<circle className="ct-glass ct-line" cx="9" cy="7" r="7" />
			<path className="ct-line" d="M-2 7 H2 M-16 6 L-22 4 M16 6 L22 4" />
			<circle className="ct-ink" cx="-8" cy="8" r="2" />
			<circle className="ct-ink" cx="10" cy="8" r="2" />
			{/* Beard along the jaw, with the grin cut into it. */}
			<path className="ct-hair" d="M-21 18 Q-20 36 0 35 Q20 36 21 18 Q16 30 0 29 Q-16 30 -21 18Z" />
			<path className="ct-mouth ct-line" d="M-10 19 Q0 29 10 19Z" />
			<path className="ct-line" d="M-1 11 Q-3 15 1 16" />
		</g>
	);
}

function Balloon({ x, y, w, h, tailX, tailY, children, lines }) {
	return (
		<g>
			<path
				className="ct-paper ct-line"
				d={`M${x + 10} ${y} H${x + w - 10} Q${x + w} ${y} ${x + w} ${y + 10} V${y + h - 10} Q${x + w} ${y + h} ${x + w - 10} ${y + h} H${tailX + 10} L${tailX} ${tailY} L${tailX - 2} ${y + h} H${x + 10} Q${x} ${y + h} ${x} ${y + h - 10} V${y + 10} Q${x} ${y} ${x + 10} ${y}Z`}
			/>
			{(lines || [children]).map((line, i) => (
				<text key={i} className="ct-say" x={x + w / 2} y={y + 17 + i * 14}>
					{line}
				</text>
			))}
		</g>
	);
}

function Defs({ id }) {
	return (
		<defs>
			<pattern id={`${id}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
				<line x1="0" y1="0" x2="0" y2="5" className="ct-hatch" />
			</pattern>
		</defs>
	);
}

/* ---------- Sree Nirman: history quoting last year's prices ---------- */

export function PricingCartoon() {
	return (
		<figure className="ct">
			<svg viewBox="0 0 440 300" role="img" aria-label="Editorial cartoon: an old man labelled History stands on low ground holding last year's price tag, while I stand on the raised ground of today's terrain holding a tablet showing a price range.">
				<Defs id="ctp" />
				<rect className="ct-paper" width="440" height="300" />

				{/* Ground: low and old on the left, a raised cliff of today's terrain on the right. */}
				<path className="ct-paper ct-line" d="M0 252 H190 L204 196 H440 V300 H0Z" />
				<path fill="url(#ctp-hatch)" d="M204 196 H440 V300 H190 Z" />
				<path className="ct-line" d="M190 252 L204 196" />
				<rect className="ct-paper ct-line" x="300" y="246" width="118" height="22" />
				<text className="ct-label" x="359" y="261">TODAY’S TERRAIN</text>
				<path className="ct-line" d="M160 252 V226" />
				<rect className="ct-paper ct-line" x="126" y="208" width="70" height="20" />
				<text className="ct-label" x="161" y="222">LAST YEAR</text>

				{/* History: bald, long white beard, a cane, and an old price tag. */}
				<g transform="translate(96 168)">
					<path className="ct-paper ct-line" d="M-26 84 Q-28 40 0 36 Q28 40 26 84Z" />
					<path fill="url(#ctp-hatch)" d="M-26 84 Q-28 40 0 36 Q28 40 26 84Z" opacity="0.6" />
					<path className="ct-line" d="M24 50 L44 76 M44 76 L44 86" />
					<ellipse className="ct-skin ct-line" cx="0" cy="6" rx="21" ry="24" />
					<path className="ct-white ct-line" d="M-17 14 Q-20 44 0 52 Q20 44 17 14 Q10 24 0 22 Q-10 24 -17 14Z" />
					<path className="ct-line" d="M-12 0 Q-8 -3 -4 0 M4 0 Q8 -3 12 0" />
					<path className="ct-line" d="M-6 12 Q0 9 6 12" />
					<path className="ct-white ct-line" d="M-21 -2 Q-26 -8 -20 -12 M21 -2 Q26 -8 20 -12" />
					{/* Arm raised with the price tag. */}
					<path className="ct-line" d="M-22 46 Q-46 30 -50 6" />
					<g transform="rotate(-12 -56 -6)">
						<rect className="ct-tag ct-line" x="-92" y="-26" width="74" height="34" rx="3" />
						<circle className="ct-paper ct-line" cx="-84" cy="-9" r="3" />
						<text className="ct-label is-big" x="-52" y="-11">₹29L</text>
						<text className="ct-label" x="-52" y="1">2019 RATE</text>
					</g>
					<path className="ct-tag ct-line" d="M-33 63 L33 53 L34 68 L-32 78Z" />
					<text className="ct-label is-name" x="0" y="69" transform="rotate(-9 0 66)">HISTORY</text>
				</g>

				<Balloon x={14} y={22} w={170} h={44} tailX={86} tailY={150} lines={['In my day, this plot', 'cost half that!']} />

				{/* Me, on today's ground, holding a tablet with the price range. */}
				<path className="ct-line" d="M310 190 V196 M326 190 V196" />
				<Me x={318} y={112} s={1}>
					<path className="ct-line" d="M-20 50 Q-34 64 -26 74" />
					<path className="ct-line" d="M20 50 Q36 58 44 50" />
				</Me>
				<g transform="translate(350 126) rotate(8)">
					<rect className="ct-paper ct-line" x="0" y="0" width="80" height="46" rx="4" />
					<line className="ct-line ct-thin" x1="8" y1="31" x2="72" y2="31" />
					<rect className="ct-tone" x="26" y="23" width="26" height="8" />
					<text className="ct-label" x="40" y="16">₹36–42L</text>
					<text className="ct-label is-tiny" x="40" y="41">RANGE + DRIVERS</text>
				</g>

				<Balloon x={250} y={14} w={180} h={44} tailX={300} tailY={84} lines={['Let’s price the ground', 'we’re standing on.']} />

				<text className="ct-sign" x="430" y="292">S.R.</text>
			</svg>
			<figcaption className="ct-caption">History, still quoting last year’s prices.</figcaption>
		</figure>
	);
}

/* ---------- Avanthi: the panel, before and after ---------- */

function Reviewer({ x, hair, mark, sleepy, content }) {
	return (
		<g transform={`translate(${x} 0)`}>
			<path className="ct-paper ct-line" d="M-18 150 Q-20 120 0 116 Q20 120 18 150Z" />
			<ellipse className="ct-skin ct-line" cx="0" cy="98" rx="16" ry="18" />
			{hair === 'bun' && <path className="ct-hair ct-line" d="M-16 96 Q-16 78 0 78 Q16 78 16 96 Q10 86 0 86 Q-10 86 -16 96Z M-6 78 Q0 66 6 78Z" />}
			{hair === 'bald' && <path className="ct-hair ct-line" d="M-16 100 Q-18 90 -14 88 M16 100 Q18 90 14 88" />}
			{hair === 'flat' && <path className="ct-hair ct-line" d="M-16 94 Q-14 78 0 79 Q14 78 16 94 Q8 88 -2 89 Q-10 88 -16 94Z" />}
			{hair === 'tall' && <path className="ct-hair ct-line" d="M-15 92 Q-18 68 0 70 Q18 68 15 92 Q6 84 0 86 Q-6 84 -15 92Z" />}
			{sleepy ? (
				<path className="ct-line" d="M-9 98 Q-6 100 -3 98 M3 98 Q6 100 9 98" />
			) : (
				<>
					<circle className="ct-ink" cx="-6" cy="97" r="1.8" />
					<circle className="ct-ink" cx="6" cy="97" r="1.8" />
				</>
			)}
			<path className="ct-line" d={sleepy ? 'M-4 107 H4' : content ? 'M-5 105 Q0 110 5 105' : 'M-5 108 Q0 104 5 108'} />
			{mark && (
				<g transform="translate(0 52)">
					<rect className="ct-paper ct-line" x="-13" y="-12" width="26" height="22" />
					<text className="ct-label is-big" x="0" y="5">{mark}</text>
				</g>
			)}
			{sleepy && <text className="ct-label" x="18" y="80">z z</text>}
		</g>
	);
}

export function PanelCartoon() {
	return (
		<figure className="ct">
			<svg viewBox="0 0 440 300" role="img" aria-label="Editorial cartoon in two panels. Before: four reviewers at a long table hold up different tiers for one scholarship file. After: I sit at a laptop showing prediction intervals and hand one reviewer a small tray of close calls; the other three are out to lunch.">
				<Defs id="cta" />
				<rect className="ct-paper" width="440" height="300" />

				{/* Panel frames */}
				<rect className="ct-paper ct-line is-frame" x="6" y="6" width="210" height="258" />
				<rect className="ct-paper ct-line is-frame" x="224" y="6" width="210" height="258" />
				<text className="ct-label is-panel" x="16" y="24">BEFORE</text>
				<text className="ct-label is-panel" x="234" y="24">AFTER</text>

				{/* Before: four reviewers, four different answers, one file. */}
				<g transform="translate(0 24)">
					<Reviewer x={40} hair="bald" mark="A" />
					<Reviewer x={86} hair="bun" mark="B" />
					<Reviewer x={132} hair="flat" mark="A?" />
					<Reviewer x={178} hair="tall" mark="C" />
					<rect className="ct-paper ct-line" x="12" y="172" width="198" height="14" />
					<path fill="url(#cta-hatch)" d="M12 186 H210 V196 H12Z" />
					<g transform="translate(96 158) rotate(-6)">
						<rect className="ct-tone ct-line" x="0" y="0" width="34" height="22" />
						<text className="ct-label" x="17" y="14">FILE</text>
					</g>
				</g>
				<rect className="ct-tag ct-line" x="18" y="228" width="186" height="26" />
				<text className="ct-say" x="111" y="245">Same file. Four opinions.</text>

				{/* After: me at a laptop of intervals; one reviewer with the close calls. */}
				<g>
					<g transform="translate(240 24)">
						<Reviewer x={150} hair="bun" content />
					</g>
					<g transform="translate(390 192)">
						<rect className="ct-paper ct-line" x="-24" y="-10" width="48" height="12" />
						<rect className="ct-tone ct-line" x="-14" y="-17" width="20" height="7" />
						<text className="ct-label is-tiny" x="0" y="-1.5">CLOSE CALLS</text>
					</g>

					<Me x={262} y={150} s={0.62}>
						<path className="ct-line" d="M20 50 Q34 56 40 64" />
					</Me>
					<g transform="translate(282 190)">
						<path className="ct-paper ct-line" d="M0 0 H58 L52 -38 H6Z" />
						<path className="ct-line ct-thin" d="M14 -28 H34 M22 -19 H44 M10 -10 H28" />
						<path className="ct-tone-line" d="M30 -19 H42" />
						<rect className="ct-paper ct-line" x="-6" y="0" width="70" height="5" />
					</g>
					<rect className="ct-paper ct-line" x="230" y="196" width="198" height="10" />
					<rect className="ct-tag ct-line" x="236" y="228" width="186" height="26" />
					<text className="ct-say" x="329" y="245">One reviewer. Three out to lunch.</text>
				</g>
				<Balloon x={234} y={34} w={190} h={44} tailX={262} tailY={118} lines={['Clear cases are done.', 'Here are the close calls.']} />

				<text className="ct-sign" x="430" y="292">S.R.</text>
			</svg>
			<figcaption className="ct-caption">The scholarship panel, before and after the model learned to say “I’m not sure.”</figcaption>
		</figure>
	);
}
