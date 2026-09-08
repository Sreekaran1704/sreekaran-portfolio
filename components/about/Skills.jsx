import { motion } from 'framer-motion';

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

const notebookEntries = [
	{ capability: 'Turning numbers into decisions.', icon: 'M7 26V17M17 26V10M27 26V4M3 30H32' },
	{ capability: 'Making messy data trustworthy.', icon: 'M5 8C5 1 29 1 29 8C29 15 5 15 5 8ZM5 8V25C5 32 29 32 29 25V8M5 17C5 24 29 24 29 17' },
	{ capability: 'Finding patterns worth predicting.', icon: 'M17 3V12M6 28V20H28V28M17 12V28M5 3H29M3 30H9M14 30H20M25 30H31' },
	{ capability: 'Checking what really caused the change.', icon: 'M7 3H14M10 3V14L3 27Q2 31 6 31H17Q21 31 19 27L13 14V3M21 6H28M24 6V17L20 25M27 6V17L32 29H24M6 23H17' },
	{ capability: 'Giving models a useful voice.', icon: 'M4 5H30V24H15L7 31V24H4ZM10 11H24M10 17H20' },
	{ capability: 'Taking experiments into production.', icon: 'M4 7H13V16H4ZM22 7H31V16H22ZM13 11H22M8 16V26H26V16M14 23H21V31H14Z' },
	{ capability: 'Building products around the data.', icon: 'M6 18C-2 16 2 6 10 9C11-1 28 0 27 10C36 9 37 21 28 21H7M17 21V27M7 32V27H28V32' },
];

function Skills() {
	return (
		<section className="skills-wall-section px-6 py-16 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<div className="skills-wall-heading-wrap">
					<h2 className="skills-wall-heading">Skills</h2>
					<p className="skills-wall-intro">Tools and the things I used.</p>
				</div>
				<div className="tool-notebook">
					<div className="notebook-pages">
						{skillGroups.map((group, index) => {
							const entry = notebookEntries[index];
							return (
								<motion.article key={group.id} className={`tool-page tool-page-${index % 4}`}
									initial={false} whileInView={{ opacity: 1 }}
									viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.4 }}>
									<div className="tool-page-top"><span className="tool-tab">{group.title}</span><span className="tool-page-number">0{index + 1}</span></div>
									<div className="tool-capability">
										<svg viewBox="0 0 36 36" aria-hidden="true"><path d={entry.icon} /></svg>
										<h3>{entry.capability}</h3>
									</div>
									<p className="tool-description">{group.description}</p>
									<ul className="tool-list">{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
								</motion.article>
							);
						})}
					</div>
					<p className="notebook-endnote">Always learning.</p>
				</div>
			</div>
		</section>
	);
}

export default Skills;
