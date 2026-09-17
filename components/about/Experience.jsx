import { useState } from 'react';
import Reveal from '../shared/Reveal';
import SectionHead from '../shared/SectionHead';

// Newest first, the way a record of service reads.
const experienceItems = [
	{
		id: 1,
		category: 'Assistantship',
		role: 'Information Services Lab Assistant',
		company: 'University of Missouri-Kansas City',
		period: 'Aug 2025 – May 2026',
		type: 'Technical Support • Lab Operations • Student Data Support',
		tone: 'front',
		metrics: [
			{ value: '75+', label: 'tickets resolved per semester' },
			{ value: '20+', label: 'student projects coached' },
		],
		points: [
			'Owned technical support for student-facing computer labs, resolving <strong>75+ tickets</strong> per semester across hardware, printer, login, and workstation issues, alongside Python, SQL, R, and notebook-based coding support.',
			'Drove analytics coaching across <strong>20+ student</strong> academic and research projects in Python and R, strengthening EDA rigor, statistical validation, and assumption-checking in peer analysis.',
		],
	},
	{
		id: 2,
		category: 'Internship → Full Time',
		role: 'Data Analyst and ML Intern → Data Scientist',
		company: 'Sree Nirman, Hyderabad, India',
		period: 'May 2023 – Jun 2024',
		type: 'Construction Analytics • Machine Learning • Growth Analytics',
		tone: 'experience',
		metrics: [
			{ value: '50K+', label: 'records standardized' },
			{ value: '30%', label: 'lift in reporting reliability' },
			{ value: '15%', label: 'gain in operational efficiency' },
		],
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
		role: 'Data Science Intern',
		company: 'Avanthi High School',
		period: 'Apr 2022 – Jan 2023',
		type: 'Financial Analytics • Education Data • ML Decision Support',
		tone: 'projects',
		metrics: [
			{ value: '50%', label: 'rise in school revenue' },
			{ value: '18%', label: 'rise in admissions' },
			{ value: '0.8', label: 'MAE predicting final marks' },
		],
		points: [
			'Built the school’s analytics foundation from scratch, structuring <strong>12K+ student financial records</strong> and <strong>50K+ expense records</strong> into validated, reporting-ready datasets in SQL, Python, and Tableau.',
			'Delivered recurring Tableau dashboards and reporting packs on fee collections and budget variance, giving leadership a consistent, standardized view of financial performance.',
			'Analyzed 50K+ expense transactions across dining, hostel, and academics, identifying <strong>10–15%</strong> in cost-saving opportunities that supported the institution’s first break-even cycle within four months.',
			'Replaced an inconsistent scholarship-allocation process with an XGBoost model predicting final marks at <strong>0.8 MAE</strong>, engineering per-grade snapshot features for partial-history students.',
			'Fit quantile models attaching a <strong>95% confidence interval</strong> to each prediction, consolidating a four-person review panel into a single reviewer.',
			'Scored admission-test responses through an OCR-to-GPT-2 pipeline, measuring agreement against teacher grading before rollout.',
			'Paired the redesigned allocation formula with a new admission-test fee stream, together driving a <strong>50% rise</strong> in school revenue.',
			'Designed a two-channel A/B comparison isolating the admission test’s marketing impact specifically, accounting for <strong>15 of those 50</strong> percentage points and driving an <strong>18% rise</strong> in admissions.',
		],
	},
];

// Long records open on their first few highlights; the rest are a click away.
const PREVIEW_POINTS = 3;

// Each role is set like a story on a newspaper's record page: a dateline
// column on the left, and on the right a kicker, the role as the headline,
// the company as the deck, a "by the numbers" strip and the highlights.
function RecordItem({ item }) {
	const [expanded, setExpanded] = useState(false);
	const hidden = item.points.length - PREVIEW_POINTS;
	const points = expanded ? item.points : item.points.slice(0, PREVIEW_POINTS);
	const listId = `record-points-${item.id}`;
	const focus = item.type.split('•').map((tag) => tag.trim());

	return (
		<li className={`np-rec np-tone-${item.tone}`}>
			<Reveal as="article" className="np-rec-grid">
				<aside className="np-rec-dateline">
					<p className="np-rec-period">{item.period}</p>
					<p className="np-rec-type">{item.category}</p>
				</aside>

				<div className="np-rec-story">
					<p className="np-rec-kicker">{focus.join(' · ')}</p>
					<h3 className="np-rec-role">{item.role}</h3>
					<p className="np-rec-company">{item.company}</p>

					<dl className="np-rec-numbers" aria-label="By the numbers">
						{item.metrics.map((metric) => (
							<div key={metric.label}>
								<dt>{metric.label}</dt>
								<dd>{metric.value}</dd>
							</div>
						))}
					</dl>

					<ul id={listId} className="np-rec-points">
						{points.map((point, i) => (
							<li key={i} dangerouslySetInnerHTML={{ __html: point }} />
						))}
					</ul>

					{hidden > 0 && (
						<button
							type="button"
							className="np-rec-more"
							aria-expanded={expanded}
							aria-controls={listId}
							onClick={() => setExpanded((open) => !open)}
						>
							<span className="np-rec-more-label">
								{expanded ? 'That’s the full record' : 'More from this role'}
							</span>
							<span className="np-rec-more-title">
								{expanded ? 'Show fewer highlights' : `Read ${hidden} more highlights`}{' '}
								<span className="np-rec-more-arrow" aria-hidden="true">{expanded ? '↑' : '↓'}</span>
							</span>
						</button>
					)}
				</div>
			</Reveal>
		</li>
	);
}

function Experience() {
	return (
		<div className="np-wrap np-section">
			<SectionHead
				section="Section D · The Record"
				page="Page D1"
				title="Experience"
				dek="Roles, responsibilities, and results, most recent first."
			/>

			<ol className="np-record-list">
				{experienceItems.map((item) => (
					<RecordItem key={item.id} item={item} />
				))}
			</ol>
		</div>
	);
}

export default Experience;
