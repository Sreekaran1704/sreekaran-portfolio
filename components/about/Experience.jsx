import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CrayonDefs } from '../shared/CrayonArt';

// Newest first in the array, which puts the earliest role at the bottom of the
// page — the vine grows upward from where the story started.
const experienceItems = [
	{
		id: 1,
		category: 'Assistantship',
		role: 'Information Services Lab Assistant',
		company: 'University of Missouri-Kansas City',
		period: 'Aug 2025 – May 2026',
		type: 'Technical Support • Lab Operations • Student Data Support',
		bloom: '#b9c8e4',
		points: [
			'Owned technical support for student-facing computer labs, resolving <strong>75+ tickets</strong> per semester across hardware, printer, login, and workstation issues, alongside Python, SQL, R, and notebook-based coding support.',
			'Drove analytics coaching across <strong>20+ student</strong> academic and research projects in Python and R, strengthening EDA rigor, statistical validation, and assumption-checking in peer analysis.',
		],
	},
	{
		id: 2,
		category: 'Internship → Full Time',
		role: 'Data Analyst and ML Intern → Data Analyst',
		company: 'Sree Nirman, Hyderabad, India',
		period: 'May 2023 – Jun 2024',
		type: 'Construction Analytics • Machine Learning • Growth Analytics',
		bloom: '#f2d99a',
		points: [
			'Owned data quality across a <strong>50K+ record</strong> construction portfolio spanning cost, labor, budget, and sales, standardizing fragmented schemas to lift reporting reliability by <strong>30%</strong>.',
			'Designed SQL logic using joins, CTEs, CASE expressions, and window functions to standardize cost, labor, and sales calculations enterprise-wide across variance, productivity, and progress-tracking metrics.',
			'Addressed a limited sample of <strong>150–200</strong> real project records by generating synthetic training records sampled from real feature distributions, scaling the dataset to a size viable for reliable model benchmarking.',
			'Engineered <strong>20+ predictive features</strong> across 7+ project dimensions, benchmarking Ridge and Lasso regression against a baseline linear model using R², MSE, and MAE to estimate tender pricing within <strong>10–20%</strong> of held-out results.',
			'Delivered Tableau dashboards, Excel scorecards, and executive reporting packs surfacing ranked cost drivers and variance signals, presenting bi-weekly to stakeholders and driving a <strong>15% gain</strong> in operational efficiency.',
			'Configured a scheduled Tableau Server extract refresh, automating weekly dashboard updates and eliminating manual republishing.',
			'Tracked and compared model experiments using MLflow, logging runs and metrics across candidate models and registering the best-performing version for reuse.',
			'Supported the co-founder’s YouTube content strategy on construction education and pricing transparency, contributing to channel growth from roughly <strong>100 to 60,000</strong> subscribers, 12 house-construction deals, and 80+ consultation engagements.',
		],
	},
	{
		id: 3,
		category: 'Internship',
		role: 'Data Analyst Intern',
		company: 'Avanthi High School',
		period: 'Apr 2022 – Jan 2023',
		type: 'Financial Analytics • Education Data • ML Decision Support',
		bloom: '#f0b9b9',
		points: [
			'Built the school’s analytics foundation from scratch, structuring <strong>12K+ student financial records</strong> and <strong>50K+ expense records</strong> into validated, reporting-ready datasets in SQL, Python, and Tableau.',
			'Delivered recurring Tableau dashboards and reporting packs on fee collections and budget variance, giving leadership a consistent, standardized view of financial performance.',
			'Analyzed 50K+ expense transactions across dining, hostel, and academics, identifying <strong>10–15%</strong> in cost-saving opportunities that supported the institution’s first break-even cycle within four months.',
			'Trained an XGBoost model on engineered academic features to predict 10th-grade performance from prior records, pairing it with a fine-tuned GPT-2 scorer for admission test answers to replace an inconsistent scholarship-allocation process.',
			'Validated model-driven scholarship outputs against <strong>1K+ principal-approved records</strong> before rollout, informing a merit-based scoring redesign that drove a <strong>50% rise</strong> in school revenue.',
			'Designed a two-channel A/B comparison isolating the admission test’s marketing impact, driving an <strong>18% rise</strong> in admissions.',
		],
	},
];

const FILTER_ID = 'crayon-trellis';

// The stem is a gentle wave rather than a ruled line. Both the vine path and the
// blooms are derived from this one function, so a bloom always sits exactly on
// the stem instead of floating a few pixels off it.
const WAVE_LENGTH = 210;
const WAVE_AMPLITUDE = 9;

function stemX(centerX, y) {
	const raw = centerX + WAVE_AMPLITUDE * Math.sin((2 * Math.PI * y) / WAVE_LENGTH);
	// Rounded so server and client agree to the last floating-point digit.
	return Math.round(raw * 100) / 100;
}

function stemPath(centerX, top, bottom) {
	let d = '';
	for (let y = top; y <= bottom; y += 6) {
		d += `${d ? ' L' : 'M'} ${stemX(centerX, y)} ${y}`;
	}
	return d;
}

function Leaf({ x, y, side, tone }) {
	const colors = ['#6f8161', '#7c8d6a', '#5f7355'];
	const dir = side ? 1 : -1;

	return (
		<g transform={`translate(${x}, ${y}) rotate(${dir * 34})`}>
			<path d={`M 0,0 L ${dir * 7},0`} stroke="#6b7a55" strokeWidth="1.3" strokeLinecap="round" fill="none" />
			<path
				d={`M ${dir * 7},0 q ${dir * 8},-6 ${dir * 17},-1 q ${dir * -8},7 ${dir * -17},1 Z`}
				fill={colors[tone % colors.length]}
				opacity="0.85"
			/>
		</g>
	);
}

function Bloom({ x, y, color, delay }) {
	return (
		// Mount-based, not whileInView: these sit inside a filtered <g> whose
		// bounding box spans the whole vine, so the intersection test fires
		// unpredictably and blooms were being left stuck at opacity 0.
		<motion.g
			initial={{ opacity: 0, scale: 0.3 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, delay, ease: [0.34, 1.3, 0.64, 1] }}
			style={{ transformOrigin: `${x}px ${y}px` }}
		>
			{[0, 1, 2, 3, 4].map((p) => {
				const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
				return (
					<ellipse
						key={p}
						cx={x + Math.cos(a) * 8.5}
						cy={y + Math.sin(a) * 8.5}
						rx="7.5"
						ry="6"
						fill={color}
						opacity="0.92"
						transform={`rotate(${(a * 180) / Math.PI + 90} ${x + Math.cos(a) * 8.5} ${y + Math.sin(a) * 8.5})`}
					/>
				);
			})}
			<circle cx={x} cy={y} r="5" fill="#e0b356" />
			<circle cx={x} cy={y} r="5" fill="none" stroke="#a9803a" strokeWidth="1" opacity="0.6" />
		</motion.g>
	);
}

function Experience() {
	const wrapRef = useRef(null);
	const itemRefs = useRef([]);
	// Nothing is drawn until the real geometry is known, so the server and the
	// first client paint agree (both render an empty stage).
	const [stage, setStage] = useState({ width: 0, height: 0, nodes: [] });

	useEffect(() => {
		const wrap = wrapRef.current;
		if (!wrap) return undefined;

		const measure = () => {
			const nodes = itemRefs.current
				.filter(Boolean)
				.map((el) => el.offsetTop + el.offsetHeight / 2);
			setStage((prev) => {
				const next = { width: wrap.offsetWidth, height: wrap.offsetHeight, nodes };
				const same =
					prev.width === next.width &&
					prev.height === next.height &&
					prev.nodes.length === nodes.length &&
					prev.nodes.every((v, i) => v === nodes[i]);
				return same ? prev : next;
			});
		};
		measure();

		if (typeof ResizeObserver === 'undefined') {
			window.addEventListener('resize', measure);
			return () => window.removeEventListener('resize', measure);
		}

		// Observing the wrapper catches text reflow at any width, which is what
		// actually moves the blooms — the window may never resize.
		const observer = new ResizeObserver(measure);
		observer.observe(wrap);
		itemRefs.current.filter(Boolean).forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, []);

	const { width, height, nodes } = stage;
	const isNarrow = width > 0 && width < 900;
	// Kept tight on narrow screens — every pixel the stem column takes comes
	// straight out of the card's text width.
	const centerX = isNarrow ? 23 : width / 2;
	const top = 6;
	const bottom = Math.max(top, height - 6);
	const ready = width > 0 && height > 0;

	// Leaves every 68px, skipped near a bloom so the flowers stay uncluttered.
	const leaves = [];
	if (ready) {
		let n = 0;
		for (let y = top + 40; y < bottom - 30; y += 68) {
			n += 1;
			if (nodes.some((ny) => Math.abs(ny - y) < 46)) continue;
			leaves.push({ x: stemX(centerX, y), y, side: n % 2, tone: n });
		}
	}

	return (
		<section className="trellis-section px-6 py-16 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-6xl">
				<div className="trellis-heading-wrap">
					<h1 className="trellis-heading">Experience</h1>
					<p className="trellis-intro">
						Where it started is at the bottom. Everything since has grown up from
						there.
					</p>
				</div>

				<div ref={wrapRef} className={`trellis-wrap ${isNarrow ? 'is-narrow' : ''}`}>
					{ready && (
						<svg
							className="trellis-vine"
							width={width}
							height={height}
							viewBox={`0 0 ${width} ${height}`}
							aria-hidden="true"
						>
							<CrayonDefs id={FILTER_ID} />

							<g filter={`url(#${FILTER_ID}-edge)`}>
								<motion.path
									d={stemPath(centerX, top, bottom)}
									fill="none"
									stroke="#6b7a55"
									strokeWidth="2.6"
									strokeLinecap="round"
									initial={{ pathLength: 0 }}
									whileInView={{ pathLength: 1 }}
									viewport={{ once: true, margin: '-80px' }}
									transition={{ duration: 1.6, ease: 'easeOut' }}
								/>

								{leaves.map((l, i) => (
									<Leaf key={i} x={l.x} y={l.y} side={l.side} tone={l.tone} />
								))}
							</g>

							{/* A bud at the top: the next role hasn't opened yet. */}
							<g filter={`url(#${FILTER_ID}-edge)`}>
								<path
									d={`M ${stemX(centerX, top + 16)} ${top + 16} q -6 -10 0 -15 q 6 5 0 15 Z`}
									fill="#a8cbb8"
									opacity="0.9"
								/>
							</g>

							<g filter={`url(#${FILTER_ID}-fill)`}>
								{nodes.map((y, i) => (
									<Bloom
										key={i}
										x={stemX(centerX, y)}
										y={y}
										color={experienceItems[i]?.bloom || '#f2d99a'}
										delay={0.1 * i}
									/>
								))}
							</g>

							{/* Soil mound the vine grows out of. */}
							<g filter={`url(#${FILTER_ID}-fill)`}>
								<ellipse
									cx={centerX}
									cy={bottom}
									rx="46"
									ry="11"
									fill="#a08a63"
									opacity="0.5"
								/>
							</g>
						</svg>
					)}

					<ol className="trellis-list">
						{experienceItems.map((item, index) => (
							<li
								key={item.id}
								ref={(el) => {
									itemRefs.current[index] = el;
								}}
								className={`trellis-item ${index % 2 === 0 ? 'side-left' : 'side-right'}`}
							>
								<motion.article
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: '-70px' }}
									transition={{ duration: 0.5, ease: 'easeOut' }}
									className="trellis-card"
								>
									<header className="trellis-card-header">
										<p className="trellis-period">{item.period}</p>
										<h2 className="trellis-role">{item.role}</h2>
										<p className="trellis-company">{item.company}</p>
										<span className="trellis-category">{item.category}</span>
										<p className="trellis-type">{item.type}</p>
									</header>

									<ul className="trellis-points">
										{item.points.map((point, i) => (
											<li key={i} className="trellis-point">
												<span className="trellis-point-leaf" aria-hidden="true" />
												<p dangerouslySetInnerHTML={{ __html: point }} />
											</li>
										))}
									</ul>
								</motion.article>
							</li>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}

export default Experience;
