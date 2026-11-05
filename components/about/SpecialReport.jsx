import { useEffect, useRef, useState } from 'react';
import { reports } from '../../data/reportsData';
import { PricingCartoon, ScholarshipCartoon } from './ReportCartoons';

// A special report in the manner of a newspaper's scroll-through features: the
// beats of one real case run down the left, and the exhibit on the right is
// pinned while it redraws for the beat being read. On a phone each beat
// carries its own copy of the exhibit, drawn at that beat, so nothing has to
// stay pinned on a small screen.

/* ---------- Sree Nirman: bid pricing ---------- */

const BIDS = [
	['B-041', 'Zone A', '240', '9 mo', '₹38.6L'],
	['B-057', 'Zone C', '180', '7 mo', '₹29.1L'],
	['B-063', 'Zone B', '300', '11 mo', '₹47.9L'],
	['B-078', 'Zone A', '150', '6 mo', '₹24.3L'],
	['B-092', 'Zone D', '220', '8 mo', '₹35.0L'],
];

const SYNTHETIC = [
	['S-001', 'Zone B', '210', '8 mo', '₹33.4L'],
	['S-002', 'Zone D', '260', '10 mo', '₹41.7L'],
	['S-003', 'Zone A', '170', '7 mo', '₹27.8L'],
];

function Ledger({ withSynthetic }) {
	const rows = withSynthetic ? [...BIDS.slice(0, 3), ...SYNTHETIC] : BIDS;
	return (
		<table className="sr-ledger">
			<thead>
				<tr>
					<th>Bid</th>
					<th>Zone</th>
					<th>Plot, sq yd</th>
					<th>Build</th>
					<th>Quoted</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row[0]} className={row[0].startsWith('S') ? 'is-synthetic' : ''}>
						{row.map((cell, i) => (
							<td key={i}>{cell}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

function TerrainChart() {
	// Two lines that cross: what last year's bids imply, and what the ground costs now.
	const past = 'M20,40 L90,52 L160,66 L230,80 L300,92';
	const now = 'M20,104 L90,92 L160,74 L230,52 L300,30';
	return (
		<svg className="sr-chart" viewBox="0 0 320 130" role="img" aria-label="Illustrative chart: prices implied by past bids fall while today's terrain cost rises, and the lines cross.">
			{[30, 65, 100].map((y) => (
				<line key={y} x1="20" x2="300" y1={y} y2={y} className="sr-grid" />
			))}
			<path d={past} className="sr-line is-past" />
			<path d={now} className="sr-line is-now" />
			<circle cx="176" cy="69" r="5" className="sr-cross" />
			<text x="24" y="32" className="sr-label">Past bids imply</text>
			<text x="300" y="22" className="sr-label is-end is-now">Terrain cost today</text>
			<text x="176" y="122" className="sr-label is-middle">The lines cross: history now misprices</text>
		</svg>
	);
}

function ModelBoard() {
	const models = ['Linear baseline', 'Ridge', 'Lasso'];
	return (
		<div className="sr-board">
			<div className="sr-board-row is-head">
				<span>Model</span>
				<span>R²</span>
				<span>MSE</span>
				<span>MAE</span>
			</div>
			{models.map((m) => (
				<div key={m} className="sr-board-row">
					<span>{m}</span>
					<i aria-label="scored" />
					<i aria-label="scored" />
					<i aria-label="scored" />
				</div>
			))}
			<p className="sr-board-foot">
				<b>MLflow</b> Every run logged; the selected version registered for reuse.
			</p>
		</div>
	);
}

function PriceBand() {
	const drivers = [
		['Material cost', 92],
		['Labor', 71],
		['Location', 54],
		['Project duration', 33],
	];
	return (
		<div className="sr-band">
			<p className="sr-band-title">Bid B-104 · estimated price</p>
			<div className="sr-band-scale" aria-label="Illustrative estimate: a price range with a lower and an upper bound">
				<span className="sr-band-range">
					<b>₹36.2L</b>
					<b>₹42.4L</b>
				</span>
			</div>
			<p className="sr-band-caption">A 10 to 20% range, not a single number</p>
			<ol className="sr-drivers">
				{drivers.map(([name, w], i) => (
					<li key={name}>
						<span>
							{i + 1}. {name}
						</span>
						<i style={{ width: `${w}%` }} />
					</li>
				))}
			</ol>
			<p className="sr-stamp">50% less time per bid</p>
		</div>
	);
}

function BidExhibit({ step }) {
	const titles = ['The record', 'Why history failed', 'Real bids, plus synthetic ones', 'The benchmark', 'What the tool returns'];
	return (
		<figure className="sr-exhibit-card">
			<figcaption className="sr-exhibit-head">
				<span>Exhibit A</span> {titles[step]}
			</figcaption>
			<div className="sr-exhibit-body" key={step}>
				{step === 0 && (
					<>
						<Ledger />
						<p className="sr-count">150–200 real bids on record</p>
					</>
				)}
				{step === 1 && <TerrainChart />}
				{step === 2 && (
					<>
						<Ledger withSynthetic />
						<ul className="sr-chips" aria-label="Feature groups">
							<li>Material cost</li>
							<li>Labor</li>
							<li>Location</li>
							<li>Duration</li>
							<li className="is-more">20+ features</li>
						</ul>
						<p className="sr-count">Checked against market rates, supplier pricing and procurement costs</p>
					</>
				)}
				{step === 3 && <ModelBoard />}
				{step === 4 && <PriceBand />}
			</div>
		</figure>
	);
}

/* ---------- Avanthi: scholarships ---------- */

// Illustrative predictions on a 10-point scale, with tier lines at 6 and 8.
const STUDENTS = [
	['S-07', 8.9, 0.5],
	['S-12', 7.8, 0.6],
	['S-19', 6.4, 0.7],
	['S-23', 5.2, 0.6],
	['S-31', 8.2, 0.7],
	['S-38', 6.9, 0.5],
];
const TIERS = [6, 8];

function IntervalChart({ flag }) {
	const x = (v) => 30 + ((v - 4) / 6) * 270;
	return (
		<svg className="sr-chart" viewBox="0 0 320 170" role="img" aria-label="Illustrative chart: predicted marks with 95% intervals; intervals crossing a tier line are flagged.">
			{TIERS.map((t) => (
				<g key={t}>
					<line x1={x(t)} x2={x(t)} y1="8" y2="150" className="sr-tier" />
					<text x={x(t)} y="164" className="sr-label is-middle">
						Tier line {t}
					</text>
				</g>
			))}
			{STUDENTS.map(([id, mark, half], i) => {
				const y = 20 + i * 22;
				const crosses = TIERS.some((t) => mark - half < t && mark + half > t);
				const hot = flag && crosses;
				return (
					<g key={id} className={hot ? 'is-flagged' : ''}>
						<text x="2" y={y + 4} className="sr-label">
							{id}
						</text>
						<line x1={x(mark - half)} x2={x(mark + half)} y1={y} y2={y} className="sr-interval" />
						<circle cx={x(mark)} cy={y} r="3.5" className="sr-point" />
					</g>
				);
			})}
		</svg>
	);
}

function Panel() {
	return (
		<div className="sr-panel">
			<div className="sr-file">
				<b>Scholarship file</b>
				<span>Student S-19</span>
			</div>
			<div className="sr-reviewers">
				{[1, 2, 3, 4].map((n) => (
					<span key={n} className="sr-reviewer">
						<i aria-hidden="true" />
						Reviewer {n}
					</span>
				))}
			</div>
			<p className="sr-mystery">
				Scholarship: <b>?%</b>
			</p>
			<p className="sr-count">Four people for every decision, and no reason given</p>
		</div>
	);
}

function Ladder() {
	const rungs = ['Global mean', 'Running average', 'Linear regression'];
	return (
		<div className="sr-ladder">
			{rungs.map((r) => (
				<span key={r} className="sr-rung">
					{r} <em>beaten</em>
				</span>
			))}
			<span className="sr-rung is-top">
				XGBoost <b>0.8 MAE</b>
			</span>
		</div>
	);
}

// Predicted marks out of 10 decide the tier, and the tier the percentage.
const TIER_TABLE = [
	['S-07', '8.9', 'Tier 1', '75%'],
	['S-12', '7.8', 'Tier 2', '50%'],
	['S-38', '6.9', 'Tier 2', '50%'],
	['S-23', '5.2', 'Tier 3', '25%'],
];

function MarksToPercent() {
	return (
		<table className="sr-ledger">
			<thead>
				<tr>
					<th>Student</th>
					<th>Predicted /10</th>
					<th>Tier</th>
					<th>Scholarship</th>
				</tr>
			</thead>
			<tbody>
				{TIER_TABLE.map((row) => (
					<tr key={row[0]}>
						{row.map((cell, i) => (
							<td key={i}>{i === 3 ? <b className="sr-pct">{cell}</b> : cell}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

function StudentCard() {
	return (
		<div className="sr-student">
			<div className="sr-student-head">
				<b>Student S-12</b>
				<span>Grade 9</span>
			</div>
			<dl className="sr-student-facts">
				<div>
					<dt>Predicted marks</dt>
					<dd>7.8 / 10</dd>
				</div>
				<div>
					<dt>Scholarship</dt>
					<dd className="sr-pct">50%</dd>
				</div>
			</dl>
			<p className="sr-student-next">Next tier at 8.0</p>
			<div className="sr-student-bar" aria-label="Illustrative: close to the next tier">
				<i style={{ width: '78%' }} />
				<span style={{ left: '80%' }} />
			</div>
			<p className="sr-count">A percentage that follows your own marks, and a clear next step.</p>
		</div>
	);
}

function WordOfMouth() {
	const ring = [
		[160, 46, 'Parent'],
		[262, 86, 'Neighbour'],
		[262, 178, 'Cousin'],
		[160, 222, 'Parent'],
		[58, 178, 'Relative'],
		[58, 86, 'Friend'],
	];
	return (
		<svg className="sr-chart" viewBox="0 0 320 260" role="img" aria-label="Illustrative: the school at the centre, with families passing the word on to neighbours, cousins, relatives and friends.">
			{ring.map(([x, y], i) => {
				// From the school's edge to the circle's edge, clear of the labels.
				const dx = x - 160;
				const dy = y - 124;
				const len = Math.hypot(dx, dy);
				const at = (d) => [160 + (dx / len) * d, 124 + (dy / len) * d];
				const [x1, y1] = at(46);
				const [x2, y2] = at(len - 19);
				return <line key={i} x1={Math.round(x1)} y1={Math.round(y1)} x2={Math.round(x2)} y2={Math.round(y2)} className="sr-word-line" style={{ animationDelay: `${i * 0.15}s` }} />;
			})}
			<g className="sr-school">
				<path d="M128 150 V118 L160 98 L192 118 V150Z" />
				<path d="M150 150 V132 H170 V150" className="sr-school-door" />
				<text x="160" y="168" className="sr-label is-middle">AVANTHI</text>
			</g>
			{ring.map(([x, y, who], i) => (
				<g key={i} className="sr-word-node" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
					<circle cx={x} cy={y} r="15" />
					<path d={`M${x - 6} ${y - 4} h12 v7 h-7 l-4 4 v-4 h-1Z`} className="sr-word-bubble" />
					<text x={x} y={y < 60 ? y - 21 : y + 28} className="sr-label is-middle">
						{who}
					</text>
				</g>
			))}
		</svg>
	);
}

function ScholarshipExhibit({ step }) {
	const titles = ['The old way', 'Marks to a percentage', 'Who still needs a person', 'What a student could see', 'Word of mouth'];
	return (
		<figure className="sr-exhibit-card">
			<figcaption className="sr-exhibit-head">
				<span>Exhibit B</span> {titles[step]}
			</figcaption>
			<div className="sr-exhibit-body" key={step}>
				{step === 0 && <Panel />}
				{step === 1 && (
					<>
						<Ladder />
						<MarksToPercent />
						<p className="sr-count">Predicted marks set the tier; the tier sets the percentage.</p>
					</>
				)}
				{step === 2 && (
					<>
						<IntervalChart flag />
						<p className="sr-stamp">Reviewers: 4 → 1</p>
					</>
				)}
				{step === 3 && <StudentCard />}
				{step === 4 && (
					<>
						<WordOfMouth />
						<p className="sr-count">Families told families.</p>
					</>
				)}
			</div>
		</figure>
	);
}

/* ---------- The report ---------- */

const EXHIBITS = { 'sree-nirman': BidExhibit, avanthi: ScholarshipExhibit };
const CARTOONS = { 'sree-nirman': PricingCartoon, avanthi: ScholarshipCartoon };

function Report({ report }) {
	const [step, setStep] = useState(0);
	const beatRefs = useRef([]);
	const Exhibit = EXHIBITS[report.id];
	const Cartoon = CARTOONS[report.id];

	// The beat crossing the middle of the screen is the one being read.
	useEffect(() => {
		if (typeof IntersectionObserver === 'undefined') return undefined;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) setStep(Number(entry.target.dataset.step));
				});
			},
			{ rootMargin: '-45% 0px -45% 0px' }
		);
		beatRefs.current.forEach((el) => el && observer.observe(el));
		return () => observer.disconnect();
	}, [report.id]);

	return (
		<article className={`sr-report np-tone-${report.tone}`} aria-labelledby={`sr-${report.id}-title`}>
			{/* The headline with the day's cartoon beside it, as on an editorial page. */}
			<div className="sr-top">
				<header className="sr-head">
					<p className="sr-kicker">{report.kicker}</p>
					<h3 id={`sr-${report.id}-title`} className="sr-headline">
						{report.headline}
					</h3>
					<p className="sr-dek">{report.dek}</p>
					<p className="sr-byline">
						By Sreekaran Reddy · {report.role} · <span>Scroll to follow the case</span>
					</p>
				</header>
				<Cartoon />
			</div>

			<div className="sr-body">
				<ol className="sr-beats">
					{report.beats.map((beat, i) => (
						<li
							key={beat.label}
							ref={(el) => {
								beatRefs.current[i] = el;
							}}
							data-step={i}
							className={`sr-beat ${step === i ? 'is-active' : ''}`}
						>
							<p className="sr-beat-no">{String(i + 1).padStart(2, '0')}</p>
							<h4 className="sr-beat-title">{beat.label}</h4>
							<p className="sr-beat-text">{beat.text}</p>
							{/* Phones: the exhibit as it stands at this beat. */}
							<div className="sr-inline-exhibit">
								<Exhibit step={i} />
							</div>
						</li>
					))}
				</ol>

				<div className="sr-exhibit" aria-live="polite">
					<div className="sr-exhibit-pin">
						<Exhibit step={step} />
						<ol className="sr-progress" aria-hidden="true">
							{report.beats.map((beat, i) => (
								<li key={beat.label} className={i <= step ? 'is-done' : ''} />
							))}
						</ol>
					</div>
				</div>
			</div>

			<p className="sr-note">{report.note}</p>
		</article>
	);
}

// Both reports, one at a time: a switch picks the role. A role card can open
// its report by dispatching 'sr-open' with the report's id.
function SpecialReport() {
	const [active, setActive] = useState(reports[0].id);
	const rootRef = useRef(null);

	useEffect(() => {
		const open = (event) => {
			setActive(event.detail);
			requestAnimationFrame(() => rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
		};
		window.addEventListener('sr-open', open);
		return () => window.removeEventListener('sr-open', open);
	}, []);

	const report = reports.find((r) => r.id === active);

	return (
		<section ref={rootRef} id="special-reports" className="sr" aria-label="Special reports">
			<div className="sr-banner">
				<p className="sr-banner-title">Special reports</p>
				<p className="sr-banner-dek">One case from each role, told the way it happened.</p>
				<div className="sr-tabs" role="tablist" aria-label="Choose a report">
					{reports.map((r) => (
						<button
							key={r.id}
							type="button"
							role="tab"
							aria-selected={active === r.id}
							className={active === r.id ? 'is-on' : ''}
							onClick={() => setActive(r.id)}
						>
							{r.tab}
						</button>
					))}
				</div>
			</div>
			<Report key={report.id} report={report} />
		</section>
	);
}

export default SpecialReport;
