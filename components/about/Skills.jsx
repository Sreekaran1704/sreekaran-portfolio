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
		<section className="skills-wall-section px-6 py-16 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<div className="skills-wall-heading-wrap">
					<h1 className="skills-wall-heading">Skills</h1>

					<p className="skills-wall-intro">
						A practical toolkit across analytics, machine learning, applied AI,
						cloud deployment, and data product development.
					</p>
				</div>

				<div className="skills-wall-board">
					<div className="skills-wall-grid">
						{skillGroups.map((group, index) => (
							<article
								key={group.id}
								className={`sticky-skill-note sticky-skill-note-${(index % 6) + 1}`}
							>
								<div className="sticky-note-pin" aria-hidden="true" />

								<div className="sticky-note-content">
									<p className="sticky-note-mini">
										{group.description}
									</p>

									<h2 className="sticky-note-title">
										{group.title}
									</h2>

									<div className="sticky-note-skills">
										{group.skills.map((skill) => (
											<span
												key={skill}
												className="sticky-skill-chip"
											>
												{skill}
											</span>
										))}
									</div>
								</div>
							</article>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default Skills;