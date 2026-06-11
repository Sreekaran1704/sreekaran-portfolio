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
	return (
		<section className="py-10 sm:py-16">
			<div className="container mx-auto">
				<div className="mb-10 max-w-3xl">
					<h1 className="font-general-semibold text-4xl tracking-tight text-primary-dark dark:text-primary-light sm:text-5xl">
						Experience
					</h1>

					<p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
						A combined view of my analytics, data science, machine learning,
						applied AI, MLOps, reporting, and technical support experience.
					</p>
				</div>

				<div className="space-y-12">
					{experienceGroups.map((group) => (
						<div key={group.id}>
							<div className="mb-6">
								<div className="mb-4 flex items-center gap-4">
									<h2 className="font-general-semibold text-2xl tracking-tight text-primary-dark dark:text-primary-light sm:text-3xl">
										{group.category}
									</h2>

									<div className="h-px flex-1 bg-gradient-to-r from-indigo-400/60 to-transparent" />
								</div>

								<p className="max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
									{group.description}
								</p>
							</div>

							<div className="grid grid-cols-1 gap-6">
								{group.items.map((experience) => (
									<div
										key={experience.id}
										className="glass-card rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8"
									>
										<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
											<div>
												<p className="mb-3 inline-flex rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
													{experience.type}
												</p>

												<h3 className="font-general-semibold text-2xl text-primary-dark dark:text-primary-light sm:text-3xl">
													{experience.role}
												</h3>

												<p className="font-general-medium mt-2 text-lg text-indigo-500">
													{experience.company}
												</p>
											</div>

											<p className="w-fit rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm text-gray-500 dark:border-white/10 dark:bg-white/10 dark:text-gray-300">
												{experience.period}
											</p>
										</div>

										<ul className="mt-6 space-y-4">
											{experience.points.map((point) => (
												<li
													key={point}
													className="flex gap-3 text-base leading-relaxed text-ternary-dark dark:text-ternary-light sm:text-lg"
												>
													<span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
													<span>{point}</span>
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Experience;