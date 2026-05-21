export const projectsData = [
	{
		id: 1,
		title: 'Genre-Controlled Story Generation using QLoRA',
		url: 'genre-controlled-story-generation-qlora',
		githubUrl:
			'https://github.com/Sreekaran1704/Genre-Controlled-Story-Generation-using-LoRA-Gemma-Fine-Tuning-',
		category: 'Applied AI',
		ProjectHeader: {
			title: 'Genre-Controlled Story Generation using QLoRA',
			publishDate: 'Feb 2026 - May 2026',
			tags: 'LLM Fine-Tuning / QLoRA / Streamlit',
		},
		ProjectImages: [
			{
				id: 101,
				title: 'Genre-Controlled Story Generation',
				img: '/images/web-project-1.jpg',
			},
			{
				id: 102,
				title: 'Gemma Fine-Tuning Pipeline',
				img: '/images/web-project-2.jpg',
			},
			{
				id: 103,
				title: 'Interactive Story Generation App',
				img: '/images/ui-project-1.jpg',
			},
		],
		ProjectInfo: {
			ClientHeading: 'Project Type',
			CompanyInfo: [
				{
					id: 111,
					title: 'Association',
					details: 'University of Missouri-Kansas City',
				},
				{
					id: 112,
					title: 'Role',
					details: 'Applied AI / LLM Fine-Tuning',
				},
				{
					id: 113,
					title: 'Focus',
					details: 'Controlled text generation across fantasy, romance, and sci-fi',
				},
				{
					id: 114,
					title: 'Interface',
					details: 'Streamlit application',
				},
			],
			ObjectivesHeading: 'Objective',
			ObjectivesDetails:
				'Built a reproducible instruction-tuning pipeline for genre-controlled short story generation using Gemma 3-1B, QLoRA, and PEFT, then evaluated whether fine-tuning improved controllability and output quality.',
			Technologies: [
				{
					title: 'Tools & Technologies',
					techs: [
						'Python',
						'PyTorch',
						'Hugging Face',
						'PEFT',
						'QLoRA',
						'Gemma 3-1B',
						'LLM-as-Judge',
						'Streamlit',
					],
				},
			],
			ProjectDetailsHeading: 'Project Details',
			ProjectDetails: [
				{
					id: 121,
					details:
						'Fine-tuned Gemma 3-1B with QLoRA and PEFT for controlled text generation using structured prompt formatting, dataset curation, and held-out evaluation.',
				},
				{
					id: 122,
					details:
						'Evaluated base vs. adapted models using validation loss, perplexity, genre fidelity, coherence, and LLM-as-Judge scoring.',
				},
				{
					id: 123,
					details:
						'Experimented with decoding parameters such as temperature and top-k to improve generation quality while tracking failure cases including repetition, weak endings, and genre drift.',
				},
				{
					id: 124,
					details:
						'Built an interactive Streamlit app so users could test genre, prompt, and generation settings in a simple interface.',
				},
			],
			SocialSharingHeading: '',
		},
	},
	{
		id: 2,
		title: 'MedPredicts: Hospital Readmission Forecasting',
		url: 'medpredicts-hospital-readmission-forecasting',
		githubUrl: 'https://github.com/Sreekaran1704/PDS_Final_Project',
		category: 'Data Science',
		ProjectHeader: {
			title: 'MedPredicts: Hospital Readmission Forecasting',
			publishDate: 'Oct 2025 - Nov 2025',
			tags: 'Healthcare Analytics / Forecasting / RAG',
		},
		ProjectImages: [
			{
				id: 201,
				title: 'Hospital Readmission Analytics',
				img: '/images/web-project-2.jpg',
			},
			{
				id: 202,
				title: 'Clinical Reasoning Workflow',
				img: '/images/ui-project-2.jpg',
			},
			{
				id: 203,
				title: 'Healthcare Forecasting Dashboard',
				img: '/images/mobile-project-2.jpg',
			},
		],
		ProjectInfo: {
			ClientHeading: 'Project Type',
			CompanyInfo: [
				{
					id: 211,
					title: 'Association',
					details: 'University of Missouri-Kansas City',
				},
				{
					id: 212,
					title: 'Role',
					details: 'Data Science / Clinical Analytics',
				},
				{
					id: 213,
					title: 'Dataset',
					details: '100K+ hospital encounter records',
				},
				{
					id: 214,
					title: 'Focus',
					details: '30-day readmission risk and operational planning',
				},
			],
			ObjectivesHeading: 'Objective',
			ObjectivesDetails:
				'Built an analytics-driven clinical decision support system to understand hospital readmissions, explain risk drivers, and support proactive staffing and follow-up planning.',
			Technologies: [
				{
					title: 'Tools & Technologies',
					techs: [
						'Python',
						'Pandas',
						'XGBoost',
						'Data Cleaning',
						'Exploratory Analysis',
						'RAG',
						'Forecasting',
						'Clinical Reasoning',
					],
				},
			],
			ProjectDetailsHeading: 'Project Details',
			ProjectDetails: [
				{
					id: 221,
					details:
						'Analyzed 100K+ hospital encounter records to identify trends influencing 30-day readmissions across diagnoses, length of stay, discharge type, and patient history.',
				},
				{
					id: 222,
					details:
						'Performed data cleaning, cohort analysis, and exploratory analysis to surface drivers of readmission risk and follow-up demand.',
				},
				{
					id: 223,
					details:
						'Developed a risk scoring and forecasting workflow to help prioritize high-risk patients instead of treating predictions as black-box outputs.',
				},
				{
					id: 224,
					details:
						'Designed a RAG-based clinical reasoning layer to generate human-readable explanations for model outputs and built a weekly staffing and follow-up planning module.',
				},
			],
			SocialSharingHeading: '',
		},
	},
	{
		id: 3,
		title: 'Vehicle Insurance Eligibility Prediction & MLOps Pipeline',
		url: 'vehicle-insurance-eligibility-mlops-pipeline',
		githubUrl: '#',
		category: 'MLOps',
		ProjectHeader: {
			title: 'Vehicle Insurance Eligibility Prediction & MLOps Pipeline',
			publishDate: 'May 2025 - Jul 2025',
			tags: 'MLOps / FastAPI / AWS',
		},
		ProjectImages: [
			{
				id: 301,
				title: 'Vehicle Insurance Prediction',
				img: '/images/mobile-project-1.jpg',
			},
			{
				id: 302,
				title: 'MLOps Pipeline',
				img: '/images/web-project-1.jpg',
			},
			{
				id: 303,
				title: 'FastAPI Deployment',
				img: '/images/ui-project-1.jpg',
			},
		],
		ProjectInfo: {
			ClientHeading: 'Project Type',
			CompanyInfo: [
				{
					id: 311,
					title: 'Role',
					details: 'MLOps / Machine Learning Engineering',
				},
				{
					id: 312,
					title: 'Problem',
					details: 'Vehicle insurance eligibility prediction',
				},
				{
					id: 313,
					title: 'Deployment',
					details: 'FastAPI on AWS EC2',
				},
				{
					id: 314,
					title: 'Workflow',
					details: 'DVC, model versioning, and CI/CD',
				},
			],
			ObjectivesHeading: 'Objective',
			ObjectivesDetails:
				'Built an end-to-end MLOps pipeline to predict whether a client should be offered vehicle insurance based on personal details, vehicle attributes, and historical claim data.',
			Technologies: [
				{
					title: 'Tools & Technologies',
					techs: [
						'Python',
						'Pandas',
						'NumPy',
						'MongoDB',
						'DVC',
						'FastAPI',
						'AWS EC2',
						'AWS S3',
						'GitHub Actions',
					],
				},
			],
			ProjectDetailsHeading: 'Project Details',
			ProjectDetails: [
				{
					id: 321,
					details:
						'Ingested and transformed raw client and insurance data using MongoDB, Python, and Pandas to create clean, structured datasets for model training and analysis.',
				},
				{
					id: 322,
					details:
						'Built a classification workflow to predict vehicle insurance eligibility from customer, vehicle, and claim-related features.',
				},
				{
					id: 323,
					details:
						'Managed datasets, model versioning, and experiment tracking with DVC to support reproducible machine learning workflows.',
				},
				{
					id: 324,
					details:
						'Deployed the trained model as a FastAPI service on AWS EC2, stored artifacts in AWS S3, and automated deployment using GitHub Actions.',
				},
			],
			SocialSharingHeading: '',
		},
	},
	{
		id: 4,
		title: 'RecommenderX: Cloud-Based Movie Rating and Recommendation SaaS',
		url: 'recommenderx-cloud-movie-recommendation-saas',
		githubUrl: 'https://github.com/Sreekaran1704/recommenderx',
		category: 'Cloud Application',
		ProjectHeader: {
			title: 'RecommenderX: Cloud-Based Movie Rating and Recommendation SaaS',
			publishDate: 'Mar 2025 - May 2025',
			tags: 'Django / Cloud / AI Recommendations',
		},
		ProjectImages: [
			{
				id: 401,
				title: 'RecommenderX Movie Platform',
				img: '/images/ui-project-2.jpg',
			},
			{
				id: 402,
				title: 'Movie Reviews and Ratings',
				img: '/images/web-project-2.jpg',
			},
			{
				id: 403,
				title: 'Cloud Movie SaaS',
				img: '/images/mobile-project-2.jpg',
			},
		],
		ProjectInfo: {
			ClientHeading: 'Project Type',
			CompanyInfo: [
				{
					id: 411,
					title: 'Association',
					details: 'University of Missouri-Kansas City',
				},
				{
					id: 412,
					title: 'Role',
					details: 'Cloud Application Development',
				},
				{
					id: 413,
					title: 'Backend',
					details: 'Django and PostgreSQL',
				},
				{
					id: 414,
					title: 'AI Feature',
					details: 'LLaMA-powered review generation',
				},
			],
			ObjectivesHeading: 'Objective',
			ObjectivesDetails:
				'Designed a scalable, production-style movie rating and review SaaS where users can rate movies, write reviews, manage watchlists, and receive AI-powered review support.',
			Technologies: [
				{
					title: 'Tools & Technologies',
					techs: [
						'Python',
						'Django',
						'PostgreSQL',
						'Cloud Deployment',
						'Authentication',
						'Google Cloud Storage',
						'Groq API',
						'LLaMA',
					],
				},
			],
			ProjectDetailsHeading: 'Project Details',
			ProjectDetails: [
				{
					id: 421,
					details:
						'Designed and deployed a full-stack cloud application that allows users to rate movies, write reviews, manage watchlists, and view aggregated ratings.',
				},
				{
					id: 422,
					details:
						'Built a cloud-native backend using Django and PostgreSQL with persistent storage and user authentication for real-world usage patterns.',
				},
				{
					id: 423,
					details:
						'Integrated an AI-powered review generation feature by connecting a LLaMA-based language model to generate human-like movie reviews.',
				},
				{
					id: 424,
					details:
						'Implemented recommendation logic to surface personalized movie suggestions alongside user-generated and AI-generated reviews.',
				},
			],
			SocialSharingHeading: '',
		},
	},
	{
		id: 5,
		title: 'Student Success Prediction',
		url: 'student-success-prediction',
		githubUrl: 'https://github.com/Sreekaran1704/Student_Success_prediction',
		category: 'Data Analytics',
		ProjectHeader: {
			title: 'Student Success Prediction',
			publishDate: 'Nov 2024 - Dec 2024',
			tags: 'Predictive Analytics / Feature Engineering',
		},
		ProjectImages: [
			{
				id: 501,
				title: 'Student Success Prediction',
				img: '/images/mobile-project-2.jpg',
			},
			{
				id: 502,
				title: 'Academic Performance Analysis',
				img: '/images/web-project-1.jpg',
			},
			{
				id: 503,
				title: 'Student Outcome Modeling',
				img: '/images/ui-project-1.jpg',
			},
		],
		ProjectInfo: {
			ClientHeading: 'Project Type',
			CompanyInfo: [
				{
					id: 511,
					title: 'Association',
					details: 'University of Missouri-Kansas City',
				},
				{
					id: 512,
					title: 'Role',
					details: 'Data Analytics / Predictive Modeling',
				},
				{
					id: 513,
					title: 'Focus',
					details: 'Student performance and success drivers',
				},
				{
					id: 514,
					title: 'Approach',
					details: 'Interpretable modeling and exploratory analysis',
				},
			],
			ObjectivesHeading: 'Objective',
			ObjectivesDetails:
				'Identified factors influencing student success using exploratory analysis, feature engineering, and interpretable predictive modeling.',
			Technologies: [
				{
					title: 'Tools & Technologies',
					techs: [
						'Python',
						'Data Analysis',
						'Feature Engineering',
						'Exploratory Data Analysis',
						'Predictive Modeling',
						'Model Evaluation',
					],
				},
			],
			ProjectDetailsHeading: 'Project Details',
			ProjectDetails: [
				{
					id: 521,
					details:
						'Analyzed academic backgrounds of parents and students along with assessment data to identify patterns associated with student performance outcomes.',
				},
				{
					id: 522,
					details:
						'Performed data preprocessing, feature engineering, and exploratory analysis to understand correlations between engagement, coursework, and student outcomes.',
				},
				{
					id: 523,
					details:
						'Built and evaluated predictive models to assess performance drivers and trade-offs, focusing on interpretability rather than only raw accuracy.',
				},
				{
					id: 524,
					details:
						'Translated analytical findings into clear insights that could support early intervention and academic planning decisions.',
				},
			],
			SocialSharingHeading: '',
		},
	},
];