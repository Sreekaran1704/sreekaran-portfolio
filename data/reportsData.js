// The two special reports in the Experience section: one real case from each
// role, told in five beats beside an exhibit that changes as you read. Every
// sentence here comes from the role's own record (see data/askMeContext.js);
// the figures drawn in the exhibits are illustrative, and each report says so.
export const reports = [
	{
		id: 'sree-nirman',
		tab: 'Sree Nirman',
		role: 'Sree Nirman, Hyderabad · 2023–2024',
		kicker: 'Special report · Construction pricing',
		headline: 'The price that history got wrong',
		dek: 'A construction startup with fewer than 200 past bids, a pricing tool it could trust, and the obvious approach we threw out first.',
		tone: 'experience',
		note: 'Bids, zones, prices and driver weights in the exhibit are illustrative. Client details stay private.',
		beats: [
			{
				label: 'Fewer than 200 bids to learn from',
				text: 'I joined Sree Nirman as the second employee and its first technical person. Pricing decisions were made on gut feel, because nobody trusted the numbers enough to use them. The company had 150 to 200 real bids on record: enough to see a pattern, far too few to train a model on their own.',
			},
			{
				label: 'Last year’s price pointed the wrong way',
				text: 'The obvious plan was to price new bids from old ones. In meetings with the co-founders we found the flaw: in the expanding parts of the city, terrain costs had reversed. History would have priced today’s bids against yesterday’s ground, so we ruled it out and built on current data instead.',
			},
			{
				label: 'Today’s costs, checked against the market',
				text: 'I expanded the real bids with synthetic samples drawn from their own feature distributions, and engineered 20+ features from material costs, labor, location and project duration. Every price was checked against market rates, supplier pricing and material procurement costs.',
			},
			{
				label: 'A plain line, then Ridge and Lasso',
				text: 'I benchmarked Ridge and Lasso regression against a plain linear baseline on R², MSE and MAE, and tracked every experiment and model version in MLflow, so the choice could be traced and the selected model reused.',
			},
			{
				label: 'A range, not a guess',
				text: 'The model went live as an internal web tool built with FastAPI, Docker and AWS. For each bid it returns a price range of 10 to 20%, with the cost drivers ranked, so the team can see what moves the price. Bid analysis now takes half the time.',
			},
		],
	},
	{
		id: 'avanthi',
		tab: 'Avanthi High School',
		role: 'Avanthi High School, Warangal · 2022–2023',
		kicker: 'Special report · Scholarships',
		headline: 'Four reviewers, one decision',
		dek: 'How a school’s scholarship panel became a model that knows when to hand a decision back to a person.',
		tone: 'projects',
		note: 'Students, cohorts and marks in the exhibit are illustrative. Student records stay private.',
		beats: [
			{
				label: 'A process nobody could fully explain',
				text: 'At Avanthi High School, scholarships were decided by a panel of four reviewers, through a process nobody could fully explain. My job was to put the decision on evidence: predict each student’s final marks, and place them in a tier.',
			},
			{
				label: 'One student, many snapshots',
				text: 'I expanded each graduated student’s history into per-grade snapshots, each one knowing how far it was from graduation and which grade the student joined in. That let the model score students who had only part of a history.',
			},
			{
				label: 'Keeping one year out of another',
				text: 'A random split would let a cohort’s own results leak into its test. So I split the data by graduating cohort, and tuned the models with leave-one-cohort-out cross-validation across 500 to 1,000 students.',
			},
			{
				label: 'A mark is a range',
				text: 'XGBoost beat a ladder of baselines, from the global mean to a running average to linear regression, at 0.8 MAE on a 10-point scale. Quantile regression then gave every prediction a 95% interval, not just a single number.',
			},
			{
				label: 'The close calls go to a person',
				text: 'Students whose interval crossed a tier boundary were flagged for human review; the rest were placed by the model. That cut the reviewers needed from four to one. When the principal and correspondent hesitated, I walked them through the tool one user story at a time until they approved it.',
			},
		],
	},
];
