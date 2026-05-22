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
					'At Sree Nirman, the project started with a familiar data problem: the data existed, but do not know what to do with it.',
					'I worked with 50K+ construction cost and operations records where missing values, schema mismatches, outliers, and inconsistent cost entries made reporting difficult to rely on. Before any dashboard or model could make sense, the foundation had to be fixed. I cleaned, normalized, validated, and structured the data using SQL, Python, Pandas, and NumPy, turning scattered construction records into datasets that were ready for analysis, reporting, and machine learning.',
					'Once the data became usable, I moved into the deeper question: why were project costs drifting? I analyzed material, labor, timeline, and cost data to uncover budget variance patterns, resource utilization gaps, productivity signals, and operational inefficiencies. The work was not just about finding numbers that looked unusual. It was about understanding what those numbers were trying to say about project planning, cost control, and execution.',
					'From there, I built regression-based construction cost estimation models using engineered features from historical project data. I compared model behavior using RMSE and R², tracked 10+ MLflow experiments, and studied which cost drivers actually helped prediction quality. This helped me move beyond “the model gives an answer” toward a more useful question: which inputs explain the answer, and can stakeholders trust it?',
					'To make the insights easier to use, I translated the analysis into Tableau dashboards and stakeholder-facing reports that showed cost trends, budget variance, productivity gaps, and operational risks. These dashboards improved reporting reliability by 30% and helped shift the work from raw numbers sitting in files to planning insights that engineering and operations teams could actually discuss.',
					'I also helped give the project an end-to-end shape by connecting the machine learning work to deployment. I packaged the trained model as a FastAPI inference service, containerized it with Docker, deployed it on AWS EC2, and supported CI/CD workflows with GitHub Actions. By the end, the work covered the full path: messy data, clean datasets, statistical analysis, feature engineering, model evaluation, dashboard reporting, and production-style model serving.',
				],

			},
			{
				id: 2,
				role: 'Data Analyst Intern',
				company: 'Avanthi High School',
				period: 'Apr 2022 - Jan 2023',
				type: 'Financial Analytics • Data Science • Applied AI',
				points: [
					'At Avanthi High School, the challenge was not that data was missing. The challenge was that the data was scattered across different parts of the institution and difficult to turn into decisions.',
					'Then I worked with 12K+ student records and 50K+ financial and operational records across hostel, academics, sports, and administrative departments. The records had inconsistent entries, missing values, fragmented formats, and reporting gaps that made it hard to clearly understand spending behavior. I cleaned, validated, and standardized the data using Python, Excel, and statistical analysis, improving data quality and consistency by 30%.',
					'After cleaning the data, I focused on the financial story behind it. I analyzed department-wise expenditure, budget variance, category-level spending, and recurring anomalies to understand where expenses were increasing and where money was quietly leaking. Using EDA, variance analysis, trend analysis, distribution analysis, regression analysis, and hypothesis testing, I identified over-budget areas and 10–15% potential cost-saving opportunities.',
					'Then I built monthly dashboards and Excel-based reports that tracked spending trends, department-level expenses, budget variance, and category-level financial behavior. These reports reduced reporting turnaround time by 20% and gave administrators a clearer view of institutional spending instead of depending on scattered manual summaries.',
					'The role also gave me room to apply machine learning to academic and evaluation workflows. I developed an XGBoost-based student performance prediction workflow using academic history and entrance-score data, mapping predictions to standardized concession brackets. This helped make concession planning more structured, consistent, and data-informed.',
					'And then I fine-tuned a GPT-2 model as an LLM-based evaluator using 5K+ historical student response samples and scoring labels. I documented preprocessing steps, evaluation logic, assumptions, and reporting workflows so the AI-assisted evaluation process could be reviewed, repeated, and explained clearly. The goal was not to replace judgment blindly, but to make evaluation more consistent, auditable, and less dependent on scattered manual review.',
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
					'Mentored undergraduate students on data analysis workflows, helping them think through statistics, EDA, data validation, reproducibility, and structured data handling. The work often involved helping students move from “my output does not make sense” to a cleaner workflow where data, assumptions, and analysis steps could be checked.',
					'Reviewed datasets and analytical outputs to identify inconsistencies, reproducibility gaps, unclear assumptions, and documentation issues. I helped students troubleshoot these problems so their work became easier to validate, repeat, and explain.',
					'Supported day-to-day university lab operations by assisting users with hardware/software issues, maintaining lab system documentation, and helping keep student-facing technical support workflows consistent. This gave me experience working at the intersection of technical troubleshooting, user support, and reliable system operations.',
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
					<h1 className="font-general-semibold text-4xl sm:text-5xl text-primary-dark dark:text-primary-light tracking-tight">
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
									<h2 className="font-general-semibold text-2xl sm:text-3xl text-primary-dark dark:text-primary-light tracking-tight">
										{group.category}
									</h2>

									<div className="h-px flex-1 bg-gradient-to-r from-indigo-400/60 to-transparent" />
								</div>

								<p className="max-w-3xl text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
									{group.description}
								</p>
							</div>

							<div className="grid grid-cols-1 gap-6">
								{group.items.map((experience) => (
									<div
										key={experience.id}
										className="glass-card rounded-3xl p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
									>
										<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
											<div>
												<p className="mb-3 inline-flex rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
													{experience.type}
												</p>

												<h3 className="font-general-semibold text-2xl sm:text-3xl text-primary-dark dark:text-primary-light">
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
													className="flex gap-3 text-base sm:text-lg leading-relaxed text-ternary-dark dark:text-ternary-light"
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