// The resume, word for word from the LaTeX source. <strong> marks the
// figures the PDF sets in bold.

export const resumeName = 'Sreekaran Reddy Ramasahayam';

export const resumeContacts = [
	{ label: '(913) 299-7216', href: 'tel:+19132997216' },
	{ label: 'sreekaran.2021@gmail.com', href: 'mailto:sreekaran.2021@gmail.com' },
	{ label: 'linkedin.com/in/sree1704', href: 'https://www.linkedin.com/in/sree1704' },
	{ label: 'github.com/Sreekaran1704', href: 'https://github.com/Sreekaran1704' },
	{ label: 'sreekaran-portfolio.vercel.app', href: 'https://sreekaran-portfolio.vercel.app/' },
];

// The PDF recruiters were sent before this page existed.
export const resumePdfUrl =
	'https://drive.google.com/file/d/1F5lB8PRJcaCCIswuf6FhhQbmYPLueXmE/view?usp=sharing';

export const resumeSummary =
	'Data Scientist with an M.S. in Computer Science and experience applying predictive models to pricing and scholarship decisions. Uses Python and SQL for feature engineering, baseline comparisons, and model evaluation, with project work in causal inference and time-series forecasting. Deployed a bidding-support tool that reduced analysis time by <strong>50%</strong>.';

export const resumeSkills = [
	{
		title: 'Statistics and Experimentation',
		items: [
			'Causal Inference',
			'A/B Testing',
			'Experimental Design',
			'Propensity Score Matching',
			'Difference-in-Differences',
			'Hypothesis Testing',
			'Quantile Regression',
			'Time-Series Forecasting',
			'statsmodels',
		],
	},
	{
		title: 'Machine Learning',
		items: [
			'scikit-learn',
			'XGBoost',
			'CatBoost',
			'LightGBM',
			'Regression',
			'Classification',
			'Feature Engineering',
			'Cross-Validation',
			'Baseline Comparison',
			'Model Evaluation',
			'SHAP',
			'Optuna',
		],
	},
	{
		title: 'Data Analysis',
		items: [
			'SQL (CTEs, Window Functions, Joins, Aggregations)',
			'Python (Pandas, NumPy)',
			'Exploratory Data Analysis',
			'Data Cleaning',
			'Data Validation',
		],
	},
	{
		title: 'Visualization and Reporting',
		items: ['Tableau', 'Dashboard Development', 'KPI Reporting', 'Stakeholder Communication', 'Excel'],
	},
	{
		title: 'Applied AI and Platforms',
		items: [
			'Retrieval-Augmented Generation (RAG)',
			'FAISS',
			'Hugging Face',
			'PyTorch',
			'MLflow',
			'FastAPI',
			'Docker',
			'GitHub Actions',
			'PostgreSQL',
			'Git',
		],
	},
];

export const resumeExperience = [
	{
		org: 'Sree Nirman',
		role: 'Data Scientist',
		period: 'May 2023 – Jun 2024',
		points: [
			'Engineered features from construction costs, labor, location, and project duration for bid-pricing models using <strong>20+</strong> predictors.',
			'Benchmarked Ridge and Lasso against linear regression to evaluate held-out bid-pricing performance.',
			'Deployed pricing models in an internal bidding-support tool, reducing bid analysis time by <strong>50%</strong>.',
			'Standardized <strong>50K+</strong> construction records using SQL and Pandas, improving reporting reliability by <strong>30%</strong>.',
			'Presented Tableau reporting to the CEO and client board bi-weekly, supporting an operational efficiency gain of <strong>15%</strong>.',
		],
	},
	{
		org: 'Avanthi High School',
		role: 'Data Science Intern',
		period: 'Apr 2022 – Jan 2023',
		points: [
			'Transformed graduated-student histories into per-grade snapshots to align model inputs with partially observed academic records.',
			'Selected XGBoost over mean and running-average baselines under cohort-grouped cross-validation, achieving <strong>0.8 MAE on a 10-point scale</strong>.',
			'Fit quantile regression models to estimate lower and upper bounds for nominal <strong>95%</strong> prediction intervals.',
			'Defined scholarship tiers with borderline-case review, reducing the required reviewers from <strong>four to one</strong>.',
			'Analyzed departmental expenses to identify cost-saving opportunities of <strong>10–15%</strong>.',
		],
	},
	{
		org: 'University of Missouri–Kansas City',
		role: 'Information Services Lab Assistant',
		period: 'Aug 2025 – May 2026',
		points: [
			'Guided exploratory analysis, statistical validation, and assumption checks for <strong>20+</strong> student research projects.',
			'Resolved lab hardware, login, and workstation issues alongside Python and SQL support, closing <strong>75+</strong> tickets per semester.',
		],
	},
];

export const resumeProjects = [
	{
		name: 'FanHouse: Membership Impact Study (Simulated Data)',
		tools: 'Python, Causal Inference',
		links: [
			{ label: 'GitHub', href: 'https://github.com/Sreekaran1704/fanhouse-casestudy-membership-' },
			{ label: 'Live', href: '/projects/fanhouse-membership-analysis' },
		],
		points: [
			'Matched 12,153 of 40,000 synthetic customers using propensity scores, reducing standardized mean difference from <strong>0.396 to 0.001</strong>.',
			'Estimated purchase-value impact using matched difference-in-differences, finding a statistically significant lift of <strong>$0.14/customer/day</strong>.',
			'Found no statistically significant lift in net customer payments after discounts and rewards, distinguishing purchase value from cash paid.',
		],
	},
	{
		name: 'Loan Delinquency Forecasting',
		tools: 'ARIMA, XGBoost, LightGBM, SHAP',
		links: [
			{ label: 'GitHub', href: 'https://github.com/Sreekaran1704/Loan-Default' },
			{ label: 'Live', href: '/projects/loan-default-forecasting/technical' },
		],
		points: [
			'Compared ARIMA, XGBoost, and LightGBM under a common walk-forward backtest across <strong>five</strong> FRED loan-delinquency series.',
			'Corrected target-construction leakage and added a regression test to GitHub Actions to prevent recurrence.',
			'Evaluated forecast-error differences with Diebold-Mariano tests, finding results favoring ARIMA in <strong>27 of 40</strong> comparisons at the chosen significance threshold.',
			'Analyzed tree-model predictions with SHAP, attributing <strong>47–59%</strong> of feature importance to the most recent lag.',
		],
	},
	{
		name: 'MedPredict-X: Readmission Risk Modeling with RAG',
		tools: 'XGBoost, FAISS, Qwen-32B',
		links: [{ label: 'GitHub', href: 'https://github.com/Sreekaran1704/PDS_Final_Project' }],
		points: [
			'Benchmarked five model types on <strong>100K+</strong> patient encounters, selecting XGBoost with an ROC-AUC of <strong>0.93</strong>.',
			'Designed prototype outreach tiers using predicted risk: doctor follow-up at p ≥ 0.6, nurse calls at 0.3 ≤ p &lt; 0.6, and automated messages.',
			'Built a FAISS and Qwen-32B RAG layer to generate contextual explanations alongside predicted risk tiers.',
		],
	},
];

export const resumeEducation = {
	school: 'University of Missouri–Kansas City',
	degree: 'Master of Science in Computer Science, Data Science Track',
	period: 'Aug 2024 – May 2026',
	gpa: '3.97',
	coursework: [
		'Database Management Systems',
		'Statistical Learning',
		'Principles of Data Science',
		'Cloud Computing',
		'Generative AI',
	],
	certifications: ['Salesforce Certified AI Associate'],
};
