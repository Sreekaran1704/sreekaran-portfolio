import { useRef, useState } from 'react';
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
			'Standardized <strong>50K+ construction records</strong> using SQL and Pandas, improving reporting reliability by <strong>30%</strong>.',
			'Delivered bi-weekly Tableau dashboards to the CEO and client board, supporting a <strong>15% operational efficiency gain</strong>.',
			'Deployed the pricing model with the engineering team in an internal bidding-support tool, reducing bid analysis time by <strong>50%</strong>.',
			'Wrote SQL transformations with CTEs, window functions and CASE expressions to standardize cost, labor and sales calculations across project zones.',
			'Engineered <strong>20+ predictors</strong> from material costs, labor, location and project duration for bid-pricing models.',
			'Benchmarked Ridge and Lasso regression against a linear baseline on R², MSE and MAE to select the pricing model.',
			'Wrote functional specifications and user stories with acceptance criteria, organizing them into epics in a prioritized backlog.',
			'Screened, interviewed and onboarded <strong>8 engineers and 2 interns</strong>.',
			'Grew the company YouTube channel from roughly <strong>100 to 60K+ subscribers</strong>, driving 12 construction deals and 80+ client consultations.',
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
			'Designed and measured a two-channel A/B test of admission marketing, recording an <strong>18% rise</strong> in admissions.',
			'Launched the winning admission marketing strategy, contributing <strong>15 percentage points</strong> of a <strong>50% rise</strong> in school revenue.',
			'Trained XGBoost with leave-one-cohort-out cross-validation, beating mean and running-average baselines at <strong>0.8 MAE</strong> on a 10-point scale.',
			'Consolidated monthly fee and expense spreadsheets into reusable reporting tables using Python and SQL.',
			'Reconciled <strong>12K+ financial records</strong>, resolving duplicates, missing fields and inconsistent fee formats.',
			'Built recurring Tableau dashboards tracking fee collections and overdue balances for leadership financial reviews.',
			'Analyzed <strong>50K+</strong> dining, hostel and academic expense records in Tableau, identifying cost-saving opportunities of <strong>10–15%</strong>.',
			'Defined merit-based scholarship tiers with borderline-case review, reducing required reviewers from <strong>four to one</strong>.',
			'Fine-tuned GPT-2 to score OCR-extracted admission responses, validating outputs against teacher-assigned grades.',
			'Won approval for the new scholarship process by walking the correspondent and principal through user stories.',
		],
	},
];

// Long records open on their first few highlights; the rest are a click away.
const PREVIEW_POINTS = 3;
// A phone opens on one fewer; mobile.css hides the last preview point.
const PHONE_PREVIEW_POINTS = 1;
const moreHighlights = (count) => `${count} more highlight${count === 1 ? '' : 's'}`;

// Each role is set like a story on a newspaper's record page: a dateline
// column on the left, and on the right a kicker, the role as the headline,
// the company as the deck, a "by the numbers" strip and the highlights.
function RecordItem({ item }) {
	const [expanded, setExpanded] = useState(false);
	const rootRef = useRef(null);
	const hidden = item.points.length - PREVIEW_POINTS;
	const phoneHidden = item.points.length - PHONE_PREVIEW_POINTS;
	const points = expanded ? item.points : item.points.slice(0, PREVIEW_POINTS);
	const listId = `record-points-${item.id}`;
	const focus = item.type.split('•').map((tag) => tag.trim());

	const toggle = () => {
		setExpanded((open) => !open);
		// Collapsing removes the text above the button; keep the reader on this role.
		if (expanded && rootRef.current?.getBoundingClientRect().top < 0) {
			rootRef.current.scrollIntoView({ block: 'start' });
		}
	};

	return (
		<li ref={rootRef} className={`np-rec np-tone-${item.tone}`}>
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

					<ul id={listId} className={`np-rec-points ${phoneHidden > 0 && !expanded ? 'is-phone-collapsed' : ''}`}>
						{points.map((point, i) => (
							<li key={i} dangerouslySetInnerHTML={{ __html: point }} />
						))}
					</ul>

					{phoneHidden > 0 && (
						<button
							type="button"
							className={`np-rec-more ${hidden > 0 ? '' : 'is-phone-only'}`}
							aria-label={expanded
								? `That’s the full record. Show fewer highlights for ${item.company}`
								: `More from this role. Read more highlights for ${item.company}`}
							aria-expanded={expanded}
							aria-controls={listId}
							onClick={toggle}
						>
							<span className="np-rec-more-label">
								{expanded ? 'That’s the full record' : 'More from this role'}
							</span>
							<span className="np-rec-more-title">
								{expanded ? 'Show fewer highlights' : (
									<>
										Read <span className="np-wide-only">{moreHighlights(hidden)}</span>
										<span className="np-phone-only">{moreHighlights(phoneHidden)}</span>
									</>
								)}{' '}
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
				section="Section C · The Record"
				page="Page C1"
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
