import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const experienceItems = [
	{
		id: 1,
		category: 'Assistantship',
		role: 'Information Services Lab Assistant',
		company: 'University of Missouri-Kansas City',
		period: 'Aug 2025 – May 2026',
		type: 'Technical Support • Lab Operations • Student Data Support',
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
		points: [
			'Owned data quality across a <strong>50K+ record</strong> construction portfolio spanning cost, labor, budget, and sales, standardizing fragmented schemas to lift reporting reliability by <strong>30%</strong>.',
			'Designed SQL logic using joins, CTEs, CASE expressions, and window functions to standardize cost, labor, and sales calculations enterprise-wide across variance, productivity, and progress-tracking metrics.',
			'Addressed a limited sample of <strong>150–200</strong> real project records by generating synthetic training records sampled from real feature distributions, scaling the dataset to a size viable for reliable model benchmarking.',
			'Engineered <strong>20+ predictive features</strong> across 7+ project dimensions, benchmarking Ridge and Lasso regression against a baseline linear model using R², MSE, and MAE to estimate tender pricing within <strong>10–20%</strong> of held-out results.',
			'Delivered Tableau dashboards, Excel scorecards, and executive reporting packs surfacing ranked cost drivers and variance signals, presenting bi-weekly to stakeholders and driving a <strong>15% gain</strong> in operational efficiency.',
			'Configured a scheduled Tableau Server extract refresh, automating weekly dashboard updates and eliminating manual republishing.',
			'Tracked and compared model experiments using MLflow, logging runs and metrics across candidate models and registering the best-performing version for reuse.',
			'Supported the co-founder\u2019s YouTube content strategy on construction education and pricing transparency, contributing to channel growth from roughly <strong>100 to 60,000</strong> subscribers, 12 house-construction deals, and 80+ consultation engagements.',
		],
	},
	{
		id: 3,
		category: 'Internship',
		role: 'Data Analyst Intern',
		company: 'Avanthi High School',
		period: 'Apr 2022 – Jan 2023',
		type: 'Financial Analytics • Education Data • ML Decision Support',
		points: [
			'Built the school\u2019s analytics foundation from scratch, structuring <strong>12K+ student financial records</strong> and <strong>50K+ expense records</strong> into validated, reporting-ready datasets in SQL, Python, and Tableau.',
			'Delivered recurring Tableau dashboards and reporting packs on fee collections and budget variance, giving leadership a consistent, standardized view of financial performance.',
			'Analyzed 50K+ expense transactions across dining, hostel, and academics, identifying <strong>10–15%</strong> in cost-saving opportunities that supported the institution\u2019s first break-even cycle within four months.',
			'Trained an XGBoost model on engineered academic features to predict 10th-grade performance from prior records, pairing it with a fine-tuned GPT-2 scorer for admission test answers to replace an inconsistent scholarship-allocation process.',
			'Validated model-driven scholarship outputs against <strong>1K+ principal-approved records</strong> before rollout, informing a merit-based scoring redesign that drove a <strong>50% rise</strong> in school revenue.',
			'Designed a two-channel A/B comparison isolating the admission test\u2019s marketing impact, driving an <strong>18% rise</strong> in admissions.',
		],
	},
];

function SprocketRail({ count }) {
	return (
		<div className="reel-sprockets" aria-hidden="true">
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className="reel-sprocket-hole"
					style={{ top: `${18 + i * 68}px` }}
				/>
			))}
		</div>
	);
}

function ReelFrame({ item, index, total }) {
	const isSingleColumn = item.points.length <= 3;

	return (
		<motion.article
			initial={{ opacity: 0, y: 22 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-80px' }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className="reel-frame"
		>
			<span className="reel-frame-number">
				Frame {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
			</span>

			<header className="reel-frame-header">
				<div>
					<h2 className="reel-frame-role">{item.role}</h2>
					<p className="reel-frame-company">{item.company}</p>
				</div>

				<div className="reel-frame-meta">
					<p className="reel-frame-period">{item.period}</p>
					<span className="reel-frame-category">{item.category}</span>
				</div>

				<p className="reel-frame-type">{item.type}</p>
			</header>

			<ul
				className={`reel-frame-points ${isSingleColumn ? 'reel-frame-points-single' : ''
					}`}
			>
				{item.points.map((point, i) => (
					<li key={i} className="reel-point">
						<span className="reel-point-bullet" aria-hidden="true">✦</span>
						<p dangerouslySetInnerHTML={{ __html: point }} />
					</li>
				))}
			</ul>
		</motion.article>
	);
}

function Experience() {
	const stripRef = useRef(null);
	const [holeCount, setHoleCount] = useState(20);

	useEffect(() => {
		const update = () => {
			if (stripRef.current) {
				const height = stripRef.current.offsetHeight;
				setHoleCount(Math.ceil(height / 68) + 1);
			}
		};
		update();
		window.addEventListener('resize', update);
		const timer = setTimeout(update, 400);
		return () => {
			window.removeEventListener('resize', update);
			clearTimeout(timer);
		};
	}, []);

	return (
		<section className="experience-reel-section px-6 py-16 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<div className="experience-reel-heading-wrap">
					<h1 className="experience-reel-heading">Experience</h1>
					<p className="experience-reel-intro">
						A journey through my professional experience so far.
					</p>
				</div>

				<div ref={stripRef} className="reel-strip">
					<SprocketRail count={holeCount} />

					{experienceItems.map((item, index) => (
						<ReelFrame
							key={item.id}
							item={item}
							index={index}
							total={experienceItems.length}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

export default Experience;