const skillGroups = [
	{
		id: 1,
		title: 'Languages & Analytics',
		description: 'Core tools I use to query, analyze, and structure data.',
		skills: ['Python', 'SQL', 'R', 'Excel'],
	},
	{
		id: 2,
		title: 'Data & Visualization',
		description: 'Turning raw datasets into dashboards, KPIs, and insights.',
		skills: [
			'Pandas',
			'NumPy',
			'Power BI',
			'Tableau',
			'Data Cleaning',
			'EDA',
			'KPI Reporting',
		],
	},
	{
		id: 3,
		title: 'Machine Learning',
		description: 'Building, evaluating, and explaining predictive models.',
		skills: [
			'scikit-learn',
			'PyTorch',
			'XGBoost',
			'Hugging Face',
			'Feature Engineering',
			'Model Evaluation',
		],
	},
	{
		id: 4,
		title: 'Applied AI & LLMs',
		description: 'Fine-tuning, evaluating, and building around language models.',
		skills: [
			'PEFT',
			'LoRA',
			'QLoRA',
			'BitsAndBytes',
			'Groq API',
			'RAG',
			'LLM-as-Judge',
			'Prompt Engineering',
		],
	},
	{
		id: 5,
		title: 'Cloud & MLOps',
		description: 'Deploying models, tracking experiments, and automating workflows.',
		skills: [
			'MLflow',
			'DVC',
			'FastAPI',
			'Docker',
			'AWS EC2',
			'AWS S3',
			'AWS ECR',
			'GitHub Actions',
			'Google Cloud Storage',
		],
	},
	{
		id: 6,
		title: 'Web & Apps',
		description: 'Building usable interfaces and backend systems for data products.',
		skills: [
			'Django',
			'PostgreSQL',
			'MongoDB',
			'Streamlit',
			'Clerk Authentication',
		],
	},
];

function Skills() {
	return (
		<section className="py-10 sm:py-16">
			<div className="container mx-auto">
				<div className="mb-10 max-w-3xl">
					<h1 className="font-general-semibold text-4xl sm:text-5xl text-primary-dark dark:text-primary-light tracking-tight">
						Skills
					</h1>

					<p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
						A practical toolkit across analytics, machine learning, applied AI,
						cloud deployment, and data product development.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{skillGroups.map((group) => (
						<div
							key={group.id}
							className="glass-card rounded-3xl p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
						>
							<div className="mb-5">
								<h2 className="font-general-semibold text-2xl text-primary-dark dark:text-primary-light">
									{group.title}
								</h2>

								<p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-300">
									{group.description}
								</p>
							</div>

							<div className="flex flex-wrap gap-2.5">
								{group.skills.map((skill) => (
									<span
										key={skill}
										className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300"
									>
										{skill}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Skills;