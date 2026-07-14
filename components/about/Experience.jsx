import { useState } from 'react';
import { motion } from 'framer-motion';

const experienceGroups = [
	{
		id: 1,
		category: 'Internships',
		description:
			'Industry experience where I worked across analytics, machine learning, reporting, deployment, and documentation, turning messy real-world data into usable systems and decision-ready insights.',
		items: [
			{
				id: 1,
				role: 'Data Analyst and ML Intern',
				company: 'Sree Nirman',
				period: 'May 2023 - Apr 2024',
				type: 'Construction Analytics • Machine Learning • Growth Analytics • MLOps Decision Support',
				points: [
					'Inherited a 50K+ record construction operations portfolio across cost, labor, material, budget, sales, outreach, and project-progress data, where scattered files, inconsistent schemas, duplicate records, and unreliable KPI logic made tender pricing, budget tracking, outreach planning, and execution decisions difficult to trust.',

					'Built a reusable analytics foundation using SQL, Python, Pandas, NumPy, Excel, and Tableau by standardizing schemas, cleaning missing values, reconciling cost fields, resolving duplicate entries, and converting fragmented construction, sales, outreach, and progress records into validated reporting-ready and model-ready datasets.',

					'Improved recurring reporting reliability by 30% by creating source-to-report validation checks, standardized KPI definitions, reusable ETL workflows, and documented business logic for cost variance, budget drift, labor productivity, resource utilization, zone-wise progress, sales outreach, and progress-vs-target tracking.',

					'Engineered 20+ predictive and operational features across 7+ project dimensions, including material cost, labor usage, budget variance, progress velocity, location, duration, plot size, work type, and project stage, to connect execution patterns with tender pricing, cost-risk analysis, and project planning decisions.',

					'Trained and benchmarked regression models, using RMSE, MAE, residual analysis, cross-validation, hyperparameter tuning, and error slicing across cost-range segments to estimate tender pricing ranges within roughly 10–20% variation on held-out bids.',

					'Created Tableau dashboards, Excel scorecards, and executive reporting packs that surfaced ranked cost drivers, budget variance, timeline risk, workforce allocation gaps, material usage patterns, zone-wise completion, pricing-risk signals, and high-risk estimation cases for leadership review.',

					'Partnered with stakeholders in bi-weekly reviews to translate dashboard trends, model outputs, variance drivers, and pricing-risk signals into recommendations for cost control, workforce planning, bid pricing, resource allocation, sales prioritization, and project execution, improving operational efficiency by 15%.',

					'Extended the analytics work into growth strategy by helping the co-founder structure YouTube content around construction education, pricing transparency, and consultation-led trust building, supporting channel growth from roughly 100 to 60K subscribers and contributing to 12 house-construction deals and 80+ consultation engagements.',
				],
			},
			{
				id: 2,
				role: 'Data Analyst Intern',
				company: 'Avanthi High School',
				period: 'Apr 2022 - Jan 2023',
				type: 'Financial Analytics • Education Data • ML Decision Support',
				points: [
					'Inherited 12K+ fragmented student financial records and 50K+ institutional expense records with duplicate entries, inconsistent fee formats, missing fields, subjective concession decisions, and no standardized reporting schema, making leadership decisions difficult to trust.',

					'Built the school’s analytics foundation from scratch using SQL, Python, Excel, and Tableau to clean, normalize, deduplicate, reconcile, and validate fee, scholarship, concession, and expense records into repeatable reporting-ready datasets.',

					'Improved recurring financial reporting accuracy by 30% by implementing reusable ETL workflows, source-to-report validation checks, KPI definitions, reconciliation logic, Excel variance models, Tableau dashboards, and monthly leadership reporting packs.',

					'Analyzed 50K+ expense transactions across dining, hostel, administration, academics, activities, and student-service operations to identify over-budget categories, abnormal spending behavior, cost drift, collection gaps, and delayed fee recovery patterns.',

					'Built Tableau dashboards and Tableau stories to communicate fee collections, department-level expenses, budget variance, concession impact, scholarship distribution, collection gaps, and monthly financial performance in a format administrators could review and act on.',

					'Presented dashboard findings, variance drivers, spending anomalies, and collection-gap insights to stakeholders with the reasoning behind each recommendation, helping convert analysis into action across budget control, procurement planning, dining-cost monitoring, staffing review, and fee-collection follow-up.',

					'Identified 10–15% cost-saving opportunities and supported financial turnaround decisions that helped the institution reach its first break-even cycle within four months of joining the organization.',

					'Built an AI-assisted scholarship decision-support workflow by validating concession labels against principal-approved records, engineering academic and financial features using a 70/30 weighting structure, and combining regression outputs with GPT-2 signals from 1K+ admission samples through a median decision rule.',
				],
			},
		],
	},
	{
		id: 2,
		category: 'Assistantships',
		description:
			'University technical support experience where I supported students, lab operations, reproducibility, documentation, and structured analytical workflows.',
		items: [
			{
				id: 3,
				role: 'Information Services Lab Assistant',
				company: 'University of Missouri-Kansas City',
				period: 'Aug 2025 - May 2026',
				type: 'Technical Support • Lab Operations • Student Data Support',
				points: [
					'Supported day-to-day Information Services lab operations for student-facing computer labs, troubleshooting hardware, software, login, access, printing, workstation, and application issues so students could continue coursework, assignments, and project work with minimal disruption.',

					'Diagnosed and resolved recurring technical support requests by identifying user problems, testing fixes, documenting solutions, and escalating unresolved issues when needed, helping make common lab-support workflows faster, clearer, and more consistent.',

					'Maintained lab documentation, troubleshooting notes, support procedures, and system-use guidance for recurring issues, reducing repeated confusion around common technical problems and improving consistency across student support interactions.',

					'Assisted students across 20+ active academic and technical projects by helping them reproduce errors, organize files, validate outputs, review workflows, and understand why a tool, dataset, notebook, or analysis step was not behaving as expected.',

					'Provided secondary data and analytics support by guiding students through EDA, statistics, data validation, assumptions, documentation, and reproducibility checks, helping them move from unclear outputs to cleaner and more explainable analytical workflows.',

					'Reviewed student datasets, notebooks, assignments, and analytical outputs to identify missing assumptions, inconsistent data handling, unclear documentation, validation gaps, and reproducibility issues before final review or submission.',
				],
			},
		],
	},
];

function chunkPoints(points, size = 4) {
	const chunks = [];
	for (let i = 0; i < points.length; i += size) {
		chunks.push(points.slice(i, i + size));
	}
	return chunks;
}

function Experience() {
	const allExperienceItems = experienceGroups
		.flatMap((group) =>
			group.items.map((item) => ({
				...item,
				category: group.category,
			}))
		)
		.sort((a, b) => {
			const order = {
				3: 1,
				1: 2,
				2: 3,
			};
			return order[a.id] - order[b.id];
		});

	const [activeIndex, setActiveIndex] = useState(0);
	const activeExperience = allExperienceItems[activeIndex];
	const pointPages = chunkPoints(activeExperience.points, 4);
	const leftPagePoints = pointPages[0] || [];
	const rightPagePoints = pointPages[1] || [];

	const goPrev = () => {
		setActiveIndex((prev) =>
			prev === 0 ? allExperienceItems.length - 1 : prev - 1
		);
	};

	const goNext = () => {
		setActiveIndex((prev) =>
			prev === allExperienceItems.length - 1 ? 0 : prev + 1
		);
	};

	return (
		<section className="experience-book-section px-6 py-16 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<div className="experience-book-heading-wrap">
					<h1 className="experience-book-heading">Experience</h1>
					<p className="experience-book-intro">
						A journey through my technical, analytical, operational, and
						decision-support experience.
					</p>
				</div>

				<div className="experience-book-tabs">
					{allExperienceItems.map((item, index) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setActiveIndex(index)}
							className={`experience-tab ${activeIndex === index ? 'experience-tab-active' : ''
								}`}
						>
							<span className="experience-tab-company">{item.company}</span>
							<span className="experience-tab-role">{item.role}</span>
						</button>
					))}
				</div>

				<motion.div
					key={activeExperience.id}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.25, ease: 'easeOut' }}
					className="open-book-shell"
				>
					<div className="open-book-topbar">
						<div>
							<p className="open-book-category">{activeExperience.category}</p>
							<h2 className="open-book-role">{activeExperience.role}</h2>
							<p className="open-book-company">{activeExperience.company}</p>
						</div>

						<div className="open-book-meta">
							<p className="open-book-period">{activeExperience.period}</p>
							<p className="open-book-type">{activeExperience.type}</p>
						</div>
					</div>

					<div className="open-book">
						<div className="book-page book-page-left">
							<div className="book-page-header">
								<span>Page 1</span>
							</div>

							<ul className="book-points">
								{leftPagePoints.map((point, index) => (
									<li key={index} className="book-point-item">
										<span className="book-point-bullet">✦</span>
										<p>{point}</p>
									</li>
								))}
							</ul>
						</div>

						<div className="book-center-crease" />

						<div className="book-page book-page-right">
							<div className="book-page-header">
								<span>Page 2</span>
							</div>

							<ul className="book-points">
								{rightPagePoints.length > 0 ? (
									rightPagePoints.map((point, index) => (
										<li key={index} className="book-point-item">
											<span className="book-point-bullet">✦</span>
											<p>{point}</p>
										</li>
									))
								) : (
									<li className="book-point-empty">
										<p>End of notes for this role.</p>
									</li>
								)}
							</ul>
						</div>
					</div>

					<div className="experience-book-controls">
						<button type="button" onClick={goPrev} className="book-nav-btn">
							← Previous
						</button>

						<p className="book-nav-status">
							{activeIndex + 1} / {allExperienceItems.length}
						</p>

						<button type="button" onClick={goNext} className="book-nav-btn">
							Next →
						</button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

export default Experience;