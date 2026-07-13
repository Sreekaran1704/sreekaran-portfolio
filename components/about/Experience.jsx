const experienceGroups = [
	{
		id: 1,
		category: 'Internships',
		description:
			'Industry experience where I worked across analytics, machine learning, reporting, deployment, and documentation, turning messy real-world data into usable systems and decision-ready insights.',
		items: [
			{
				id: 1,
				role: 'Analyst Tech Intern',
				company: 'Sree Nirman',
				period: 'May 2023 - Apr 2024',
				type: 'Data Analytics • Machine Learning • MLOps',
				points: [
					'At Sree Nirman, the problem was not a lack of data. The problem was that construction cost, labor, material, and project records were scattered, inconsistent, and difficult to trust for planning decisions.',
					'I started by working with 50K+ construction cost and operations records, cleaning missing values, schema mismatches, outliers, duplicate entries, and inconsistent cost fields using SQL, Python, Pandas, and NumPy. Before building dashboards or models, I focused on making the data usable, structured, and analysis-ready.',
					'Once the data foundation was stronger, I analyzed material costs, labor utilization, timeline delays, budget variance, and project-level performance patterns to understand why costs were drifting and where operational inefficiencies were showing up.',
					'I built regression-based construction cost estimation models using historical project, labor, material, location, budget, and progress data. I engineered features, compared model performance using RMSE and R², and tracked 10+ MLflow experiments to evaluate which cost drivers actually improved prediction quality.',
					'To make the analysis useful beyond the model, I developed Tableau dashboards and reporting views that translated raw construction records into cost trends, budget variance insights, productivity gaps, and operational risk indicators, improving reporting reliability by 30%.',
					'I also helped connect the analytics work to deployment by packaging the trained model as a FastAPI inference service, containerizing it with Docker, deploying it on AWS EC2, and supporting CI/CD workflows with GitHub Actions. The project gave me end-to-end exposure across data cleaning, analysis, modeling, reporting, and production-style model serving.',
				],
			},
			{
				id: 2,
				role: 'Data Analyst Intern',
				company: 'Avanthi High School',
				period: 'Apr 2022 - Jan 2023',
				type: 'Financial Analytics • Data Science • Applied AI',
				points: [
					'At Avanthi High School, I inherited a familiar institutional data problem: the school had years of financial, academic, and operational records, but no clean structure to turn those records into reliable decisions.',
					'I worked with 12K+ fragmented student financial records and 50K+ institutional expense records across fee collections, scholarships, hostel, dining, academics, activities, and administration. The data had duplicate entries, inconsistent fee formats, missing values, subjective scholarship records, and no standardized schema.',
					'I built the school’s analytics foundation from scratch using SQL, Python, Excel, and Tableau, cleaning, normalizing, deduplicating, reconciling, and validating fee, scholarship, and expense records. This improved financial reporting accuracy and consistency by 30%.',
					'Once the data became reliable, I analyzed fee collections, department spending, budget variance, category-level costs, collection gaps, scholarship patterns, and monthly financial performance to understand where money was leaking and where spending was drifting beyond plan.',
					'I performed variance analysis, anomaly detection, spend-pattern analysis, trend analysis, and distribution checks across 50K+ expense records, identifying over-budget categories, abnormal spending behavior, collection gaps, and 10–15% cost-saving opportunities for leadership review.',
					'I built recurring Excel reports, Tableau dashboards, and leadership summaries that gave administrators a clearer view of fee collections, department expenses, budget variance, and category-level financial performance, helping move the school from operating loss to break-even within four months.',
					'I also worked on the school’s scholarship decision problem, where manual fee scholarships were inconsistent and sometimes influenced by counter-level bias. I validated historical concession labels with principal-approved records before using them for downstream modeling.',
					'I engineered academic and financial features from admission test scores, prior-grade performance, fee category, and a 70/30 academic weighting structure, then built a regression-based scholarship estimation workflow to support more consistent and data-informed scholarship decisions.',
					'To strengthen the AI-assisted decision workflow, I fine-tuned a GPT-2 model on historical admission and student-response samples with scoring labels, combining model outputs with structured scholarship logic to create a more stable recommendation signal for leadership review.',
					'I documented preprocessing steps, label validation logic, model assumptions, dashboard definitions, and reporting workflows so the school could review, repeat, and explain the analytics process instead of depending on scattered manual judgment.',
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
				type: 'Technical Support • Data Workflows • Student Mentoring',
				points: [
					'At UMKC, my work starts when something does not behave the way a student expected: a dataset looks wrong, an output does not make sense, or a workflow is hard to reproduce.',
					'I mentored undergraduate students on statistics, EDA, data validation, reproducibility, and structured data handling, helping them move from unclear outputs to cleaner workflows where assumptions, data quality, and analysis steps could be checked.',
					'I reviewed datasets, assignments, and analytical outputs to identify inconsistencies, missing assumptions, reproducibility gaps, unclear documentation, and validation issues, helping students make their work easier to explain and repeat.',
					'I also supported daily university lab operations by assisting users with hardware and software issues, maintaining lab system documentation, and helping keep student-facing technical support workflows consistent, reliable, and easy to follow.',
				],
			},
		],
	},
];

function Experience() {
	const displayOrder = [3, 1, 2];

	const allExperienceItems = displayOrder
		.map((id) => {
			for (const group of experienceGroups) {
				const foundItem = group.items.find((item) => item.id === id);

				if (foundItem) {
					return {
						...foundItem,
						category: group.category,
					};
				}
			}

			return null;
		})
		.filter(Boolean);

	return (
		<section className="experience-tower-section px-6 py-16 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<div className="experience-tower-heading-wrap">
					<h1 className="experience-tower-heading">Experience</h1>

					<p className="experience-tower-intro">
						A combined view of my analytics, data science, machine learning,
						applied AI, MLOps, reporting, and technical support experience.
					</p>
				</div>

				<div className="experience-tower-stage">
					<div className="experience-tower-building" aria-hidden="true">
						<div className="experience-tower-roof" />

						<div className="experience-tower-core">
							<div className="experience-tower-window-grid">
								{Array.from({ length: 14 }).map((_, index) => (
									<span
										key={index}
										className="experience-tower-window"
									/>
								))}
							</div>
						</div>

						<div className="tower-landing tower-landing-1">
							<span />
							<span />
							<span />
							<span />
						</div>

						<div className="tower-landing tower-landing-2">
							<span />
							<span />
							<span />
							<span />
						</div>

						<div className="tower-landing tower-landing-3">
							<span />
							<span />
							<span />
							<span />
						</div>
					</div>

					{allExperienceItems.map((experience, index) => (
						<div
							key={experience.id}
							className={`experience-tower-card-wrap experience-tower-card-wrap-${index + 1}`}
						>
							<article className="experience-tower-card">
								<div className="experience-card-top">
									<span className="experience-card-category">
										{experience.category}
									</span>

									<span className="experience-card-period">
										{experience.period}
									</span>
								</div>

								<p className="experience-card-type">
									{experience.type}
								</p>

								<h3 className="experience-card-role">
									{experience.role}
								</h3>

								<p className="experience-card-company">
									{experience.company}
								</p>

								<ul className="experience-card-points">
									{experience.points.map((point) => (
										<li key={point}>
											<span className="experience-card-bullet">
												✦
											</span>
											<p>{point}</p>
										</li>
									))}
								</ul>
							</article>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Experience;