import SectionHead from '../shared/SectionHead';
import Reveal from '../shared/Reveal';

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

// One line per group, in the same order as skillGroups.
const capabilities = [
	'Turning numbers into decisions.',
	'Making messy data trustworthy.',
	'Finding patterns worth predicting.',
	'Checking what really caused the change.',
	'Giving models a useful voice.',
	'Taking experiments into production.',
	'Building products around the data.',
];

function Skills() {
	return (
		<div className="np-wrap np-section">
			<SectionHead
				section="Section E · Classifieds"
				page="Page E1"
				title="Skills"
				dek="Tools and the things I used."
			/>

			<div className="np-classifieds">
				{skillGroups.map((group, index) => (
					<Reveal as="article" key={group.id} delay={(index % 4) * 0.05} className="np-classified">
						<h3 className="np-classified-title">{group.title}</h3>
						<p className="np-classified-lede">{capabilities[index]}</p>
						<p className="np-classified-desc">{group.description}</p>
						<ul className="np-classified-list">
							{group.skills.map((skill) => (
								<li key={skill}>{skill}</li>
							))}
						</ul>
					</Reveal>
				))}

				<p className="np-classified np-classified-end">Always learning.</p>
			</div>
		</div>
	);
}

export default Skills;
