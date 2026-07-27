export const projectsData = [
	{
		id: 6,
		title: 'Market Pulse: Live Job Market Intelligence Platform',
		url: 'market-pulse-job-market-intelligence',
		githubUrl: 'https://github.com/Sreekaran1704/market-pulse',
		liveUrl: 'https://market-pulse-tp0p.onrender.com/',
		category: 'Data Analytics',
		ProjectHeader: {
			title: 'Market Pulse: Live Job Market Intelligence Platform',
			publishDate: '2026 - Present',
			tags: 'Data Pipelines / MCP Server / SQL / Market Analytics / Live Deployment',
		},
		ProjectImages: [
			{
				id: 601,
				title: 'Market Pulse Dashboard',
				img: '/images/web-project-1.jpg',
			},
			{
				id: 602,
				title: 'Salary and Skill Demand Trends',
				img: '/images/web-project-2.jpg',
			},
			{
				id: 603,
				title: 'Automated Ingestion Pipeline',
				img: '/images/ui-project-1.jpg',
			},
		],
		ProjectInfo: {
			ClientHeading: 'Project Type',
			CompanyInfo: [
				{
					id: 611,
					title: 'Association',
					details: 'Independent portfolio project',
				},
				{
					id: 612,
					title: 'Role',
					details: 'Data Analyst / Data Engineer',
				},
				{
					id: 613,
					title: 'Focus',
					details:
						'Tracking real-time hiring trends for Data Analyst, BI Developer, Analytics Engineer, and Applied AI roles',
				},
				{
					id: 614,
					title: 'Data Sources',
					details: 'Adzuna and RemoteOK job listing APIs, refreshed daily',
				},
				{
					id: 615,
					title: 'Status',
					details: 'Fully built and live-deployed, running on a daily automated schedule',
				},
			],
			ObjectivesHeading: 'Objective',
			ObjectivesDetails:
				'Built and deployed a live job market intelligence platform that combines a real-time data pipeline with a dual-transport MCP server layer. The pipeline classifies daily job postings from the Adzuna and RemoteOK APIs by role, seniority, and skills into a PostgreSQL and SQLAlchemy schema, running unattended via GitHub Actions and Docker on Render. On top of that foundation, a FastMCP-based MCP server exposes five job-market analytics tools over local stdio and remote streamable HTTP, secured with bearer-token authentication and per-IP rate limiting, with a Groq-powered LLM layered on top to translate the computed statistics into a plain-English market summary grounded strictly in the underlying data.',
			Technologies: [
				{
					title: 'Tools & Technologies',
					techs: [
						'Python',
						'FastAPI',
						'PostgreSQL',
						'Docker',
						'FastMCP',
						'Groq API',
					],
				},
			],
			ProjectDetailsHeading: 'Project Details',
			ProjectDetails: [
				{
					title: 'Data Pipeline & Schema Design',
					details:
						'Engineered a PostgreSQL and SQLAlchemy schema to classify daily job postings from the Adzuna and RemoteOK APIs by role, seniority, and skills, turning scattered real hiring data into a structured, queryable foundation.',
				},
				{
					title: 'Automation & Deployment',
					details:
						'Automated the ingestion-to-aggregation cycle with GitHub Actions and containerized the service with Docker, deploying it on Render to run continuously without manual intervention.',
				},
				{
					title: 'Dual-Transport MCP Server',
					details:
						'Refactored shared query logic into a standalone module and built a dual-transport MCP server on top of it using FastMCP, exposing five job-market analytics tools over local stdio and remote streamable HTTP mounted on the existing FastAPI app.',
				},
				{
					title: 'Security & AI-Powered Summaries',
					details:
						'Secured the remote HTTP transport with bearer-token authentication and a per-IP rate limiter, and layered a Groq-powered LLM summary on top of the computed statistics to translate raw hiring trends into a plain-English narrative grounded strictly in the underlying data.',
				},
			],
			SocialSharingHeading: '',
		},
	},

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
					details: 'Applied AI Developer focused on LLM fine-tuning and controlled generation',
				},
				{
					id: 113,
					title: 'Focus',
					details: 'Reducing generic LLM storytelling by improving genre alignment, tone consistency, and narrative control',
				},
				{
					id: 114,
					title: 'Interface',
					details: 'Interactive Streamlit app for selecting story genres and generating genre-aligned narratives',
				},
			],
			ObjectivesHeading: 'Objective',
			ObjectivesDetails:
				'Built an end-to-end genre-controlled short story generation system using google/gemma-3-1b-it and QLoRA adaptation. I created a manually annotated fantasy, romance, and science-fiction subset from the WritingPrompts dataset, cleaned and preprocessed 709 prompt-story examples, fine-tuned the pretrained model with 4-bit QLoRA, compared the adapted model against the base model using validation loss, perplexity, and LLM-as-judge evaluation, and deployed the workflow through a Streamlit demo for interactive story generation.',
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
					title: 'Problem and Project Goal',
					details:
						'Problem: General-purpose pretrained LLMs can generate fluent short stories, but they often struggle with controlled creative generation. When a user asks for a fantasy, romance, or science-fiction story, the model may produce readable text while still drifting away from the requested genre, losing tone consistency, repeating ideas, or failing to preserve a clean narrative ending.\n\nGoal: This project tests whether QLoRA-based parameter-efficient fine-tuning can improve genre-conditioned short story generation under limited compute resources.',
				},
				{
					title: 'Dataset Collection and Genre Annotation',
					details:
						'Source: I used a processed subset of the WritingPrompts dataset, originally collected from a Reddit creative writing community and accessed through Kaggle. The full dataset contains approximately 272K prompt-story pairs.\n\nGenre Scope: For this project, I focused only on fantasy, romance, and science fiction because these genres have distinct narrative patterns, tone, vocabulary, and structure.\n\nManual Annotation: Since the raw dataset was not directly structured for this task, I manually annotated and organized examples into the target genres. Each final example contained a genre label, a story prompt, and a target story.\n\nFinal Dataset Size: The final processed dataset contained 709 examples: 567 training examples, 70 validation examples, and 72 test examples.',
				},
				{
					title: 'Data Preprocessing Pipeline',
					details:
						'Text Cleaning: I normalized Unicode text using NFKC, replaced <newline> markers with real line breaks, standardized carriage returns, cleaned whitespace, and preserved paragraph structure where needed.\n\nQuality Filtering: I removed deleted, removed, empty, noisy, or incomplete stories. I also removed prompt artifacts and meta-writing language that could weaken the story-generation task.\n\nLength Filtering: I filtered stories shorter than 180 words or longer than 450 words so the model could focus on short-story generation rather than extremely short fragments or long-form stories.\n\nNarrative Quality Checks: I checked that stories ended with a clean final sentence and removed examples with repeated full sentences to reduce repetition issues during fine-tuning.',
				},
				{
					title: 'Training Format and Task Design',
					details:
						'Instruction Format: Each cleaned example was converted into a supervised fine-tuning format with an explicit genre, prompt, and story structure.\n\nInput Structure: The formatted examples followed this pattern: <GENRE>, followed by the selected genre, then <PROMPT>, followed by the story prompt, and finally <STORY>, followed by the target story.\n\nWhy This Format: This structure helped the model learn that story generation should be conditioned on both the user prompt and the selected genre, instead of only continuing generic text.',
				},
				{
					title: 'Base Model and Tokenization',
					details:
						'Base Model: I used google/gemma-3-1b-it as the pretrained base model.\n\nTokenizer: I loaded the tokenizer using AutoTokenizer from the same google/gemma-3-1b-it checkpoint to keep tokenization consistent between the base and adapted systems.\n\nTask Setup: The project was framed as causal language modeling for genre-controlled short story generation.\n\nSequence Length: I used a maximum sequence length of 1024 tokens for supervised fine-tuning and generated outputs with approximately 300 new tokens.',
				},
				{
					title: 'QLoRA Fine-Tuning Approach',
					details:
						'Adaptation Method: I used QLoRA to adapt the pretrained model efficiently instead of training the full model from scratch.\n\nWhy QLoRA: QLoRA makes fine-tuning more practical under limited compute by using 4-bit quantization and training lightweight LoRA adapter parameters while keeping the original base model weights frozen.\n\nTrainable Parameters: Only the LoRA adapter weights were updated during training. The base Gemma model weights remained frozen.\n\nTarget Modules: I applied LoRA to self_attn.q_proj and self_attn.v_proj so the model could adapt attention behavior for genre-conditioned generation.',
				},
				{
					title: 'Training Configuration',
					details:
						'Quantization Setup: The adapted model used 4-bit NF4 quantization with double quantization and bfloat16 compute.\n\nLoRA Setup: The LoRA rank was 16, LoRA alpha was 16, and LoRA dropout was 0.10.\n\nOptimization Setup: I used paged_adamw_32bit as the optimizer, a learning rate of 5e-5, batch size 1, and gradient accumulation steps of 4.\n\nTraining Constraint: This setup allowed the model to adapt to fantasy, romance, and science-fiction writing patterns while keeping memory usage manageable.',
				},
				{
					title: 'Baseline Comparison Design',
					details:
						'Systems Compared: I compared two systems: the original pretrained google/gemma-3-1b-it model without adaptation and the same model after QLoRA fine-tuning.\n\nFair Comparison Setup: Both systems used the same task definition, same held-out evaluation set, same prompt format, same tokenizer, same generation settings, same quantitative metrics, and same qualitative review process.\n\nPurpose: The comparison was designed to test whether QLoRA adaptation improved genre-conditioned story generation compared with the base pretrained model.',
				},
				{
					title: 'Quantitative Evaluation Results',
					details:
						'Metrics Used: I evaluated both systems using validation loss and perplexity on the same held-out evaluation set.\n\nBase Model Result: The base Gemma-3-1B-it model achieved a validation loss of 3.8268 and perplexity of 45.9134.\n\nQLoRA Model Result: The QLoRA-adapted model achieved a validation loss of 3.3188 and perplexity of 27.6261.\n\nImprovement: QLoRA adaptation reduced perplexity by approximately 39.8%, showing stronger token-level modeling performance on the genre-controlled evaluation set.',
				},
				{
					title: 'Qualitative Evaluation and LLM-as-Judge',
					details:
						'Review Criteria: I evaluated generated stories using genre fidelity, prompt relevance, coherence, ending quality, repetition, style quality, format following, and overall quality.\n\nJudge Model: I used llama-3.1-8b-instant through the Groq API as an LLM-as-judge evaluator for sample outputs.\n\nImportant Limitation: I treated the LLM judge as a supporting evaluation tool, not as the only source of judgment, because creative writing quality is subjective and sample-level judging can vary.',
				},
				{
					title: 'LLM-as-Judge Findings',
					details:
						'Base Model Score: On the small judged sample, the base model achieved an overall score of 3.767.\n\nQLoRA Model Score: The QLoRA-adapted model achieved an overall score of 3.000 on the same judged sample.\n\nInterpretation: These results showed that although QLoRA improved validation loss and perplexity, it did not consistently improve perceived creative-writing quality in the small qualitative sample. This highlighted an important lesson: lower token-level error does not automatically guarantee better narrative quality, style, or reader preference.',
				},
				{
					title: 'Streamlit Demo Application',
					details:
						'Interface Goal: I built a Streamlit application to make the model workflow usable and interactive instead of leaving it only as a notebook experiment.\n\nUser Flow: The app allows users to select a genre, enter a story prompt, generate a short story, inspect model outputs, and view the end-to-end workflow interactively.\n\nDemo Value: This turned the fine-tuned model into a practical prototype for controlled creative text generation.',
				},
				{
					title: 'Final Outcome and Learning',
					details:
						'Outcome: The project produced an end-to-end genre-controlled short story generation system using Gemma-3-1B-it, QLoRA adaptation, structured preprocessing, quantitative evaluation, qualitative review, and Streamlit deployment.\n\nMain Result: QLoRA improved validation loss from 3.8268 to 3.3188 and reduced perplexity from 45.9134 to 27.6261.\n\nKey Learning: The project showed that parameter-efficient fine-tuning can improve token-level performance under limited compute, but creative generation still requires careful qualitative evaluation because better perplexity does not always mean better perceived story quality.',
				},
			],
			SocialSharingHeading: '',
		},
	},
	{
		id: 2,
		title: 'MedPredicts: Context-Aware Hospital Readmission Forecasting',
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
					details: 'Data Scientist / Healthcare ML Developer',
				},
				{
					id: 213,
					title: 'Dataset',
					details: '100K+ diabetic hospital encounter records enriched with weather, PM2.5 air quality, and holiday context',
				},
				{
					id: 214,
					title: 'Problem Focus',
					details: 'Predicting 30-day readmission risk and translating risk scores into actionable follow-up plans',
				},
				{
					title: 'System Layer',
					details: 'XGBoost risk prediction with RAG-powered clinical reasoning using SentenceTransformer, FAISS, and Qwen-32B',
				},
			],
			ObjectivesHeading: 'Objective',
			ObjectivesDetails:
				'Built a context-aware clinical decision-support system for 30-day hospital readmission forecasting. The system enriches 100K+ diabetic hospital encounter records with weather, PM2.5 air quality, and holiday context, predicts patient readmission risk using XGBoost, assigns follow-up actions by risk tier, and uses a RAG-powered LLM reasoning layer to explain why each patient may be at risk. The project focuses on making readmission prediction more actionable, interpretable, and useful for care coordination and operational planning.',
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
					title: 'Problem and Project Goal',
					details:
						'Problem: Hospital readmission prediction is not only a classification problem. A patient may be flagged as high risk, but hospitals still need to understand why the patient is at risk and what type of follow-up action should happen next. Traditional predictive systems can identify risk, but they often miss the surrounding context that affects recovery, such as poor air quality, severe weather, holidays, delayed follow-ups, or care-access barriers.\n\nGoal: This project built a context-aware clinical decision-support system that predicts 30-day hospital readmission risk, explains the risk drivers behind each prediction, and converts model outputs into actionable follow-up recommendations for care teams.',
				},
				{
					title: 'Dataset and Contextual Enrichment',
					details:
						'Clinical Dataset: I used the Diabetes 130-US Hospitals dataset, which contains 100K+ diabetic patient hospital encounter records with demographic, admission, diagnosis, medication, lab, and utilization-related fields.\n\nContextual Data: To make the system more realistic, I enriched the clinical dataset with external context such as weather, PM2.5 air quality, and holiday indicators. These features were added because recovery and follow-up access can be affected by real-world conditions outside the hospital.\n\nPurpose: This enrichment helped the project move beyond purely clinical prediction and include environmental and operational signals that may influence readmission risk.',
				},
				{
					title: 'Data Cleaning and Filtering',
					details:
						'Clinical Filtering: I removed unrealistic or misleading cases, including expired or hospice-related patients marked as readmitted, because those records do not represent normal post-discharge readmission behavior.\n\nMissing and Unknown Values: I reviewed missing, unknown, and inconsistent categorical values across medical specialty, admission details, diagnosis information, and medication-related fields.\n\nInterpretability Focus: Categorical fields were encoded in a clinically interpretable way so the downstream model and explanation layer could support meaningful reasoning rather than only numerical prediction.',
				},
				{
					title: 'Feature Engineering',
					details:
						'Clinical Features: I used patient encounter information, medical specialty, admission details, discharge indicators, diagnosis-related fields, and medication variables to capture clinical risk patterns.\n\nUtilization Features: I included prior healthcare utilization signals such as emergency, outpatient, and inpatient visit history because these features can indicate patients with recurring care needs.\n\nDiabetes Stability Features: I numerically encoded max_glu_serum and A1Cresult and combined them into a stronger indicator of diabetic instability and readmission risk.\n\nContext Features: I added weather, PM2.5 air quality, holiday, and week-based signals to capture external conditions that may affect recovery, follow-up timing, and readmission probability.',
				},
				{
					title: 'Class Imbalance Handling',
					details:
						'Imbalance Problem: The dataset showed imbalance between readmitted and non-readmitted patients, which could make a model over-focus on the majority class.\n\nSMOTE Strategy: I applied SMOTE only on the training data to generate realistic minority-class samples and improve the model’s ability to learn readmission-risk patterns.\n\nEvaluation Integrity: The test set was kept separate from the oversampling process so model performance would be evaluated on untouched data rather than synthetic test examples.',
				},
				{
					title: 'Model Selection and Testing',
					details:
						'Models Compared: I tested multiple supervised classification models, including LDA, Logistic Regression, Decision Trees, Random Forest-style tree models, CatBoost, and XGBoost.\n\nSelection Criteria: I compared the models based on their ability to balance predictive performance, precision, recall, and practical usefulness for readmission-risk forecasting.\n\nFinal Model: XGBoost was selected because it provided the best practical balance between precision and recall, helping the system identify high-risk patients while controlling unnecessary false positives.',
				},
				{
					title: 'Risk Scoring and Patient Tiering',
					details:
						'Risk Probability: After training, the XGBoost model generated a readmission probability for each patient encounter.\n\nRisk Tiers: I converted model probabilities into actionable risk categories. Patients with probability greater than or equal to 0.6 were classified as High Risk, patients with probability greater than or equal to 0.3 were classified as Moderate Risk, and patients below 0.3 were classified as Low Risk.\n\nOperational Value: This made the model output easier for care teams to use because each risk score was translated into a clear intervention level instead of remaining as a raw probability.',
				},
				{
					title: 'Follow-Up Recommendation Logic',
					details:
						'High-Risk Patients: High-risk patients were assigned faster follow-up, typically within 2–5 days, with Doctor call or Home visit recommendations.\n\nModerate-Risk Patients: Moderate-risk patients were assigned Nurse call follow-up so care teams could check recovery status and reduce potential readmission triggers.\n\nLow-Risk Patients: Low-risk patients were assigned automated SMS or email follow-up within a longer window, allowing staff effort to be prioritized toward patients with greater risk.\n\nPurpose: This connected machine learning prediction with staffing and care coordination decisions.',
				},
				{
					title: 'RAG-Powered Reasoning Layer',
					details:
						'Why RAG: A readmission-risk score alone does not explain why a patient may be at risk. To make predictions more interpretable, I added a RAG-powered explanation layer.\n\nRetrieval System: The system used SentenceTransformer embeddings and FAISS to retrieve relevant clinical and contextual knowledge from a curated knowledge base, including clinical rules and environmental risk factors.\n\nLLM Reasoning: Retrieved context was passed to Qwen-32B, which generated a short human-readable explanation describing why the patient may be at risk.\n\nOutcome: This transformed the system from a black-box predictor into a more explainable clinical reasoning workflow.',
				},
				{
					title: 'System Architecture',
					details:
						'Pipeline Flow: The system starts with clinical and contextual feature preparation, passes the processed data into the XGBoost readmission-risk model, converts predicted probabilities into risk tiers, assigns follow-up methods, retrieves relevant evidence using RAG, and generates an explanation using an LLM.\n\nMain Components: The architecture combines structured clinical ML, contextual feature enrichment, risk-tier logic, FAISS-based retrieval, SentenceTransformer embeddings, and Qwen-32B reasoning.\n\nDesign Goal: The goal was to create a pipeline that supports prediction, explanation, and action rather than only returning a binary readmission label.',
				},
				{
					title: 'Evaluation and Model Interpretation',
					details:
						'Predictive Evaluation: The model was evaluated by comparing multiple classifiers and selecting the model that balanced prediction accuracy with precision and recall.\n\nOperational Evaluation: I also evaluated whether the outputs could be translated into useful follow-up actions, such as doctor calls, nurse calls, home visits, or automated messages.\n\nExplainability Evaluation: The RAG layer was assessed based on whether it could produce concise, understandable explanations connected to clinical and contextual risk factors.',
				},
				{
					title: 'Final Outcome',
					details:
						'Outcome: The final system predicts 30-day hospital readmission risk, classifies patients into high, moderate, and low risk tiers, recommends follow-up actions, and explains the reasoning behind each prediction.\n\nImpact: The project demonstrates how healthcare ML can become more useful when predictive modeling is combined with contextual intelligence, operational planning, and human-readable reasoning.\n\nKey Learning: A strong healthcare AI system should not stop at prediction. It should help users understand the risk, prioritize action, and make the output transparent enough for real decision-support workflows.',
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
					title: 'Problem Focus',
					details: 'Predicting vehicle insurance eligibility using customer, vehicle, and claim-history data',
				},
				{
					id: 313,
					title: 'Deployment',
					details: 'FastAPI prediction service deployed on AWS EC2',
				},
				{
					id: 314,
					title: 'Workflow',
					details: 'End-to-end ML pipeline with DVC, model versioning, experiment tracking, and CI/CD automation',
				},
			],
			ObjectivesHeading: 'Objective',
			ObjectivesDetails:
				'Built an end-to-end MLOps pipeline to predict whether a client should be offered vehicle insurance based on personal details, vehicle attributes, and historical claim data. The project focused on turning a machine learning model into a reproducible production-style system by building data validation, preprocessing, model training, version control, API deployment, and CI/CD workflows. The final pipeline uses FastAPI for real-time predictions, DVC for data and model versioning, and AWS EC2 for cloud deployment.',
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
					title: 'Problem and Project Goal',
					details:
						'Problem: Insurance eligibility decisions depend on multiple customer and vehicle risk signals, including demographic details, vehicle attributes, prior insurance behavior, and historical claim patterns. If these inputs are handled manually or inconsistently, eligibility decisions can become slow, difficult to reproduce, and hard to deploy as a reliable prediction service.\n\nGoal: This project built an end-to-end MLOps pipeline that predicts whether a client should be offered vehicle insurance and packages the model into a reproducible, deployable, and version-controlled machine learning system.',
				},
				{
					title: 'Dataset and Business Context',
					details:
						'Data Scope: The project used structured insurance-related data containing customer attributes, vehicle details, and historical claim information.\n\nBusiness Use Case: The model was designed to support insurance eligibility screening by estimating whether a client is likely to be eligible for a vehicle insurance offer.\n\nDecision Context: Instead of only building a notebook model, the project focused on creating a repeatable ML workflow that could support real-time prediction through an API.',
				},
				{
					title: 'Data Validation and Cleaning',
					details:
						'Validation: I added checks to verify input data quality before model training and prediction. This included reviewing missing values, incorrect data types, invalid categories, and inconsistent records.\n\nCleaning: I cleaned and standardized customer, vehicle, and claim-related fields so the downstream model could learn from consistent structured inputs.\n\nPurpose: This step ensured the pipeline was not dependent on manually cleaned files and could support a more reliable production-style workflow.',
				},
				{
					title: 'Feature Engineering and Preprocessing',
					details:
						'Feature Preparation: I transformed raw customer, vehicle, and claim-history fields into model-ready features.\n\nCategorical Handling: Categorical variables were encoded so the model could process fields such as vehicle type, customer category, or insurance-related attributes.\n\nNumerical Processing: Numerical fields were cleaned and prepared for training, including handling missing values and scaling or transformation where required.\n\nPipeline Design: The preprocessing logic was structured as part of the ML pipeline so the same transformations could be reused during both training and inference.',
				},
				{
					title: 'Model Training',
					details:
						'Training Task: The project was framed as a supervised classification problem where the model predicts whether a client should be offered vehicle insurance.\n\nModeling Workflow: I trained machine learning models using the prepared feature set and evaluated their performance on held-out data.\n\nSelection Focus: The goal was not only to build a model with strong predictive performance, but also to create a model artifact that could be versioned, loaded, and served through an API.',
				},
				{
					title: 'DVC and Model Versioning',
					details:
						'Why DVC: I used DVC to bring version control discipline to the machine learning workflow. This helped track data files, model artifacts, and pipeline outputs separately from regular source code.\n\nReproducibility: DVC made the workflow easier to reproduce by maintaining links between datasets, preprocessing outputs, trained models, and pipeline stages.\n\nMLOps Value: This ensured that model development was not just experimental, but organized in a way that supports repeatable training and controlled model updates.',
				},
				{
					title: 'API Development with FastAPI',
					details:
						'Prediction Service: I built a FastAPI application to serve the trained model as a real-time prediction API.\n\nInference Flow: The API accepts client and vehicle information, applies the required preprocessing steps, loads the trained model, and returns an insurance eligibility prediction.\n\nProduction Focus: This converted the project from a local ML experiment into a service-oriented application that can receive requests and return predictions programmatically.',
				},
				{
					title: 'Deployment on AWS EC2',
					details:
						'Cloud Deployment: I deployed the FastAPI application on an AWS EC2 instance so the model could be accessed as a running service.\n\nServer Setup: The deployment involved preparing the cloud environment, moving the application code and model artifacts, configuring runtime dependencies, and running the API service on the instance.\n\nOutcome: This demonstrated the end-to-end path from training a model locally to serving predictions through a cloud-hosted API.',
				},
				{
					title: 'CI/CD Workflow',
					details:
						'Automation Goal: I added CI/CD workflow practices to make the project easier to update, test, and redeploy.\n\nPipeline Focus: The workflow supported version-controlled code changes, model pipeline updates, and deployment automation steps.\n\nEngineering Value: This made the project closer to a real MLOps system where code, data, models, and deployment artifacts can be managed in a controlled lifecycle.',
				},
				{
					title: 'Final Outcome',
					details:
						'Outcome: The final project delivered a complete MLOps workflow for vehicle insurance eligibility prediction, including data preprocessing, model training, DVC-based versioning, FastAPI inference, and AWS EC2 deployment.\n\nKey Learning: The project demonstrated how machine learning work becomes more valuable when it is reproducible, deployable, and maintainable rather than limited to notebook-based experimentation.\n\nPractical Value: The system shows how insurance eligibility screening can be supported through a production-style ML pipeline that connects model development with real-time prediction infrastructure.',
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
					details: 'Full-Stack Data Product Developer / Cloud Application Developer',
				},
				{
					id: 413,
					title: 'Problem Focus',
					details: 'Personalized movie discovery using user ratings, watchlists, reviews, and AI-generated summaries',
				},
				{
					id: 414,
					title: 'Platform',
					details: 'Cloud-based SaaS movie recommendation system built with Django, PostgreSQL, Google Cloud, Railway, and Groq LLaMA',
				},
				{
					id: 415,
					title: 'Core Workflow',
					details: 'User authentication, movie browsing, ratings, reviews, watchlists, collaborative filtering recommendations, and AI-powered review summaries',
				},
			],
			ObjectivesHeading: 'Objective',
			ObjectivesDetails:
				'Built RecommenderX, a cloud-based movie recommendation SaaS that helps users discover relevant movies through personalized recommendations, watchlists, ratings, reviews, and AI-generated review summaries. The project combines Django, PostgreSQL, Google Cloud SQL, Google Cloud Storage, Clerk authentication, collaborative filtering, and Groq-hosted LLaMA 3 to deliver an end-to-end recommendation platform with user interaction, cloud persistence, and AI-assisted movie insights.',
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
					title: 'Problem and Project Goal',
					details:
						'Problem: Movie platforms often contain large catalogs, but users still struggle to quickly find movies that match their interests. Browsing by title or genre alone does not fully capture user preferences, prior ratings, watchlist behavior, or review context.\n\nGoal: This project built a cloud-based movie recommendation SaaS that helps users browse movies, save watchlists, rate and review titles, receive personalized recommendations, and view concise AI-generated review summaries.',
				},
				{
					title: 'Platform Overview',
					details:
						'Application: RecommenderX is a Django-based SaaS platform for movie discovery and recommendation.\n\nPublic Access: Users can browse available movies without logging in, view posters, titles, genres, cast details, and movie metadata.\n\nAuthenticated Access: Logged-in users can rate movies, write reviews, manage personal watchlists, and receive personalized recommendations based on rating behavior.',
				},
				{
					title: 'Frontend and User Experience',
					details:
						'UI Layer: I built the interface using Django templates with a modern movie-platform style layout.\n\nMovie Browsing: The public-facing pages allow users to explore movie posters, titles, genres, and cast information.\n\nUser Interaction: Authenticated users can submit 1–5 star ratings, write text reviews, and add or remove movies from a personal watchlist.',
				},
				{
					title: 'Backend Architecture',
					details:
						'Framework: The backend was built with Django and Django REST Framework to support movie data management, user interaction workflows, recommendation logic, and API-style backend operations.\n\nCore Entities: The application manages movies, ratings, reviews, watchlist entries, users, and recommendation outputs.\n\nPurpose: The backend connects movie metadata, user behavior, and recommendation logic into a single reusable application workflow.',
				},
				{
					title: 'Authentication and User Management',
					details:
						'Authentication: I integrated Clerk.dev for user authentication so the application could support secure logged-in user workflows.\n\nAccess Control: Public users can browse movies, while authenticated users can perform personalized actions such as ratings, reviews, watchlist management, and recommendation viewing.\n\nUser Personalization: Authentication allowed user-specific activity to be stored and reused for personalized movie recommendations.',
				},
				{
					title: 'Database and Cloud Storage',
					details:
						'Database: I used Google Cloud SQL with PostgreSQL to store movie data, user ratings, reviews, watchlists, and application records.\n\nPoster Storage: I used Google Cloud Storage to store and serve movie poster assets.\n\nCloud Value: This separated structured application data from media assets and made the platform closer to a real cloud-hosted SaaS architecture.',
				},
				{
					title: 'Data Loading and Movie Catalog Setup',
					details:
						'Movie Data Pipeline: I created a workflow to load movie data from CSV into the PostgreSQL database using a Django management command.\n\nSetup Flow: After environment configuration and database migration, the movie catalog can be populated through the load_movies_csv command.\n\nReproducibility: This made the project easier to set up, rerun, and deploy across local and hosted environments.',
				},
				{
					title: 'Recommendation Logic',
					details:
						'Collaborative Filtering: I implemented personalized recommendations using a user-item rating matrix derived from user rating behavior.\n\nRecommendation Goal: The system recommends movies based on patterns in user ratings rather than only static genre filters.\n\nPersonalization: As users rate more movies, the recommendation layer can better reflect user preferences and improve the discovery experience.',
				},
				{
					title: 'AI-Powered Review Summaries',
					details:
						'AI Integration: I integrated Groq Cloud API with Meta LLaMA 3 to generate concise AI-powered review summaries for movie detail pages.\n\nInput Context: The AI review workflow uses movie metadata and available review context to produce a short, readable summary.\n\nUser Value: This gives users a faster way to understand the overall impression of a movie without reading multiple long reviews manually.',
				},
				{
					title: 'Deployment and Hosting',
					details:
						'Hosting: I deployed the application using Railway.\n\nEnvironment Management: The deployment uses environment variables for Clerk authentication keys, database connection settings, and Groq API access.\n\nCloud Architecture: The deployed system connects Django, Cloud SQL PostgreSQL, Google Cloud Storage, Clerk authentication, and Groq AI services into a working cloud application.',
				},
				{
					title: 'Reproducible Project Setup',
					details:
						'Local Setup: The project can be run locally by cloning the repository, creating a Python virtual environment, installing dependencies, applying Django migrations, loading the movie CSV data, and starting the Django development server.\n\nEnvironment Variables: The project uses environment variables such as CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, DATABASE_URL, and GROQ_API_KEY.\n\nPurpose: This setup makes the application reproducible across local development and cloud deployment environments.',
				},
				{
					title: 'Final Outcome',
					details:
						'Outcome: RecommenderX delivered an end-to-end cloud-based movie recommendation platform with public browsing, authenticated user interactions, watchlists, ratings, reviews, personalized recommendations, and AI-generated review summaries.\n\nPractical Value: The project demonstrates how recommendation systems become more useful when combined with user interaction data, cloud persistence, authentication, and AI-assisted content summarization.\n\nFuture Scope: Future improvements include trailer integration, OTT platform links, hybrid recommendation models, deep learning-based recommendations, and sentiment-aware feedback signals.',
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
					details: 'Data Analyst / Machine Learning Developer',
				},
				{
					id: 513,
					title: 'Problem Focus',
					details: 'Predicting whether a student is likely to drop out, remain enrolled, or graduate',
				},
				{
					id: 514,
					title: 'Dataset',
					details: '4,424 student records reduced to 3,501 cleaned samples after preprocessing, feature engineering, and outlier handling',
				},
				{
					id: 515,
					title: 'Modeling Task',
					details: 'Multiclass classification using student demographic, academic, financial, and enrollment-related features',
				},
			],
			ObjectivesHeading: 'Objective',
			ObjectivesDetails:
				'Built a supervised machine learning project to predict student academic outcomes across dropout, enrolled, and graduate categories. The project focused on transforming raw student records into a clean modeling dataset by handling missing values, removing outliers, engineering categorical features, analyzing academic and financial risk patterns, and comparing multiple classification models. Logistic Regression was selected as the best-performing model based on testing accuracy and F1-score, while LDA and pruned Decision Tree models were also analyzed for interpretability and comparison.',
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
					title: 'Problem and Project Goal',
					details:
						'Problem: Educational institutions need to identify students who may be at risk of dropping out before the outcome becomes final. Student success is influenced by academic background, course selection, tuition status, debt, scholarship status, demographic factors, parental background, and semester-level performance.\n\nGoal: This project built a supervised learning workflow to predict whether a student would drop out, remain enrolled, or graduate, helping demonstrate how academic and administrative data can support early student-risk identification.',
				},
				{
					title: 'Dataset Overview',
					details:
						'Initial Dataset: The original dataset contained 4,424 student records with 37 features.\n\nFinal Modeling Dataset: After data cleaning, feature engineering, null handling, and outlier treatment, the final dataset used for model building contained 3,501 samples and 26 features.\n\nTarget Variable: The classification target was the student outcome category: dropout, enrolled, or graduate.',
				},
				{
					title: 'Missing Value Handling',
					details:
						'Null Value Review: I identified missing values across columns such as Application order, Course, Day_class, Previous qualification, Previous qualification grade, Nationality, parental qualification, parental occupation, Admission grade, Displaced, Educational special needs, Debtor, Tuition fees up to date, Gender, Scholarship holder, and Target.\n\nHandling Strategy: Since the total number of missing values was small compared with the overall dataset size, I dropped rows with null values. For continuous variables such as Previous qualification grade and Admission grade, I reviewed their importance before final cleaning because they could contribute to student outcome prediction.',
				},
				{
					title: 'Outlier Detection and Treatment',
					details:
						'Outlier Analysis: I used box plots and value-count analysis to inspect unusual distributions and detect outliers across selected numerical and categorical features.\n\nIQR Method: I removed outliers using the Interquartile Range method where appropriate, reducing noise and improving the quality of the modeling dataset.\n\nResult: This preprocessing helped reduce the dataset from 4,424 records to 3,501 cleaner modeling samples.',
				},
				{
					title: 'Exploratory Data Analysis',
					details:
						'Course Patterns: I observed that many students were enrolled in Health and Social courses such as nursing-related programs, while students in Basic Education-related courses showed a higher tendency to drop out.\n\nFinancial Indicators: Students without debt and students with tuition fees up to date were more likely to complete and graduate. Scholarship-holder patterns were also reviewed because scholarship status showed differences in dropout behavior compared with other groups.\n\nGender and Outcome Patterns: I analyzed dropout and graduation distributions across gender to understand whether outcome rates differed between male and female students.',
				},
				{
					title: 'Correlation and Relationship Analysis',
					details:
						'Academic Progress Signals: There was a strong positive correlation between credited and approved curricular units in both semesters. The first-semester correlation was approximately 0.76, while the second-semester correlation increased to approximately 0.85, indicating that students credited for course units were highly likely to receive approval for those units.\n\nDemographic Patterns: Age showed a negative relationship with day-class enrollment, suggesting that older students were more likely to take evening classes and may also have different displacement patterns.\n\nFamily Background: Parental education levels showed a positive correlation of approximately 0.57, and parental occupations showed a positive correlation around 0.49, suggesting partial alignment in family education and occupational background.',
				},
				{
					title: 'Feature Engineering and Encoding',
					details:
						'Categorical Transformation: I converted categorical features such as Nationality, Application mode, Course, and other grouped variables into model-ready encoded features.\n\nOne-Hot Encoding: One-hot encoding was used to improve model compatibility and help categorical variables contribute more effectively to classification.\n\nFeature Reduction: After cleaning, grouping, encoding, and feature restructuring, the dataset was reduced from 37 original features to 26 final modeling features.',
				},
				{
					title: 'Model Development',
					details:
						'Models Tested: I trained and compared Linear Discriminant Analysis, Logistic Regression, K-Nearest Neighbors, Decision Tree, and pruned Decision Tree models.\n\nLDA Setup: I used the LSQR solver for LDA because it is numerically stable and suitable for high-dimensional data created through one-hot encoding.\n\nLogistic Regression Setup: I set max_iter to 1000 to give the model enough iterations to converge on the transformed dataset.\n\nKNN Setup: I selected the K value based on the value that produced the highest testing accuracy during model tuning.\n\nDecision Tree Setup: I used the Gini criterion because it is computationally efficient and suitable for larger structured datasets.',
				},
				{
					title: 'Performance Evaluation',
					details:
						'Training Accuracy: The Decision Tree model achieved the highest training accuracy, followed by Logistic Regression and the pruned Decision Tree model.\n\nTesting Accuracy: Logistic Regression achieved the highest testing accuracy, followed by LDA.\n\nF1-Score: Logistic Regression also achieved the highest F1-score, showing the best balance between precision and recall across the student outcome classes.',
				},
				{
					title: 'Model Interpretation',
					details:
						'Best Model Selection: Logistic Regression was selected as the best model because it achieved the highest testing accuracy, strongest F1-score, and relatively strong training performance.\n\nLDA Insights: LDA also performed well, and confusion matrix analysis showed that it produced a high number of correct predictions compared with other interpretable models such as the pruned Decision Tree.\n\nImportant Features: One-hot encoded features from Nationality, Application mode, and Course contributed strongly to LDA performance, showing that categorical restructuring helped improve class separability.',
				},
				{
					title: 'Final Outcome',
					details:
						'Outcome: The project successfully developed a supervised learning workflow to classify students into dropout, enrolled, or graduate categories.\n\nModel Result: Logistic Regression was selected as the best-performing model based on test accuracy and F1-score.\n\nPractical Value: The project shows how student demographic, academic, financial, and enrollment data can be transformed into a predictive workflow that supports early identification of students who may need additional academic or financial support.',
				},
			],
			SocialSharingHeading: '',
		},
	},
];