const skillGroups = [
	{
		id: 1,
		title: 'Analytics & BI',
		description: 'Tools I use to turn messy business data into decision-ready reporting.',
		skills: [
			'SQL',
			'Python',
			'Excel',
			'Tableau',
			'Tableau Stories',
			'KPI Reporting',
			'Dashboard Design',
			'Stakeholder Reporting',
		],
	},
	{
		id: 2,
		title: 'Data Engineering & Quality',
		description: 'Cleaning, validating, reconciling, and preparing reliable datasets.',
		skills: [
			'Pandas',
			'NumPy',
			'Data Cleaning',
			'Data Validation',
			'Source-to-Report QA',
			'ETL Workflows',
			'dbt Core',
			'BigQuery',
			'DuckDB',
		],
	},
	{
		id: 3,
		title: 'Machine Learning',
		description: 'Building predictive models for risk, pricing, operations, and outcomes.',
		skills: [
			'Scikit-learn',
			'XGBoost',
			'CatBoost',
			'Regression',
			'Classification',
			'Feature Engineering',
			'Model Evaluation',
			'Computer Vision',
			'Error Analysis',
		],
	},
	{
		id: 4,
		title: 'Experimentation & Causal Inference',
		description: 'Testing whether an observed effect is real before trusting it.',
		skills: [
			'Causal Inference',
			'A/B Testing',
			'Hypothesis Testing',
			'Propensity Score Matching',
			'Difference-in-Differences',
			'OEC & Guardrail Metrics',
		],
	},
	{
		id: 5,
		title: 'Applied AI & LLMs',
		description: 'Fine-tuning, evaluating, and building AI-assisted decision systems.',
		skills: [
			'Hugging Face',
			'PyTorch',
			'LoRA',
			'QLoRA',
			'RAG',
			'FAISS',
			'LLM-as-Judge',
			'Prompt Engineering',
			'Model Context Protocol (MCP)',
		],
	},
	{
		id: 6,
		title: 'MLOps & Deployment',
		description: 'Moving models from notebooks into reproducible and deployable systems.',
		skills: [
			'MLflow',
			'DVC',
			'FastAPI',
			'Docker',
			'Kubernetes',
			'AWS EKS',
			'AWS EC2',
			'AWS S3',
			'GitHub Actions',
			'Prometheus / Grafana',
		],
	},
	{
		id: 7,
		title: 'Cloud & Data Products',
		description: 'Building full-stack data products, apps, and cloud-backed ML systems.',
		skills: [
			'Django',
			'PostgreSQL',
			'MongoDB',
			'Streamlit',
			'Google Cloud SQL',
			'Google Cloud Storage',
			'Clerk Authentication',
			'Groq API',
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
						A practical toolkit across analytics, BI reporting, causal inference,
						machine learning, applied AI, MLOps, cloud deployment, and data
						product development.
					</p>
				</div>

				<div className="skills-wall-board">
					<div className="skills-wall-grid">
						{skillGroups.map((group, index) => (
							<article
								key={group.id}
								className={`sticky-skill-note sticky-skill-note-${(index % 7) + 1}`}
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