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
		headline: 'The right percentage, for every student',
		dek: 'How predicting each student’s scholarship fairly lifted morale in the classroom, and got families talking about the school.',
		tone: 'projects',
		note: 'Students, marks, tiers and percentages in the exhibit are illustrative. Student records stay private.',
		beats: [
			{
				label: 'A percentage nobody could explain',
				text: 'At Avanthi High School, each student’s scholarship percentage was decided by a panel of four reviewers, through a process nobody could fully explain. When a scholarship can’t be explained, it is hard for a student to trust it, or to know what to work towards.',
			},
			{
				label: 'Predict the marks, then the percentage',
				text: 'I built a model to predict each student’s final marks from per-grade snapshots of their history, split by graduating cohort so no year could leak into another. XGBoost beat every baseline at 0.8 MAE on a 10-point scale, and the predicted marks placed each student in a scholarship tier and its percentage.',
			},
			{
				label: 'The close calls go to a person',
				text: 'Quantile regression gave every prediction a 95% interval. Students whose interval crossed a tier boundary were flagged for a person to decide; the rest were placed by the model. That cut the reviewers needed from four to one, and the principal and correspondent approved it after I walked them through it one user story at a time.',
			},
			{
				label: 'Students who knew where they stood',
				text: 'Getting the percentage right changed the mood in the classroom. A scholarship that followed a student’s own marks felt earned, not handed out, and it improved students’ morale: they could see what their work was worth.',
			},
			{
				label: 'Then the parents started talking',
				text: 'Fair scholarships travelled further than any poster. Families told other families, and the scholarships brought the school word of mouth.',
			},
		],
	},
];
