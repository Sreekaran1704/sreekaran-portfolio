// Short board summaries; full methodology stays in each project's case study.
export const projectNotes = {
  'loan-default-forecasting': {
    displayTitle: 'Loan delinquency forecasting',
    featured: true, label: '01 / Question the forecast',
    summary: 'Can modern machine learning beat a classical forecast on five U.S. loan-delinquency series?',
    metric: '5 of 5', finding: 'ARIMA beat both ML models after data leakage was fixed.',
    annotation: 'A simpler model. A more honest answer.', visual: 'forecast',
  },
  'fanhouse-membership-analysis': {
    displayTitle: 'FanHouse membership analysis',
    featured: true, label: '02 / Look beyond the obvious',
    summary: 'Does a membership program actually increase spending, or do bigger spenders simply join?',
    metric: '+$0.1367/day', finding: 'Higher estimated pre-discount product value; no demonstrated increase in net payments.',
    annotation: 'More product value. What did the business keep?', visual: 'causal',
  },
  'market-pulse-job-market-intelligence': {
    displayTitle: 'Market Pulse',
    summary: 'Turn scattered daily job postings into searchable, explainable market intelligence.',
    metric: 'Daily', finding: 'An automated pipeline connects live postings to grounded AI summaries.',
    annotation: 'From job listings to a clearer picture.', stages: ['Job feeds', 'Clean + store', 'Ask + explore'],
  },
  'genre-controlled-story-generation-qlora': {
    displayTitle: 'Genre-controlled story generation',
    summary: 'Adapt a small language model to write fantasy, romance, and science-fiction stories.',
    metric: '39.8%', finding: 'Lower held-out perplexity after QLoRA adaptation.',
    annotation: 'A small model, finding its voice.', visual: 'language',
  },
  'medpredicts-hospital-readmission-forecasting': {
    displayTitle: 'MedPredicts',
    summary: 'Combine clinical records and environmental context to forecast 30-day hospital readmission.',
    metric: 'XGBoost + RAG', finding: 'Risk predictions paired with contextual explanations and follow-up actions.',
    annotation: 'Prediction, with a little more context.', stages: ['Patient + context', 'Predict risk', 'Explain'],
  },
  'vehicle-insurance-eligibility-mlops-pipeline': {
    displayTitle: 'Vehicle insurance MLOps',
    summary: 'Take an insurance eligibility model from an experiment to a reproducible prediction service.',
    metric: 'MLOps', finding: 'Versioned data, validation, and CI/CD support the deployed API.',
    annotation: 'Beyond the notebook.', stages: ['Validate', 'Train + version', 'Deploy API'],
  },
  'recommenderx-cloud-movie-recommendation-saas': {
    displayTitle: 'RecommenderX',
    summary: 'Help movie lovers discover their next watch through personalized recommendations.',
    metric: 'Cloud SaaS', finding: 'Recommendations, watchlists, ratings, and AI review summaries in one app.',
    annotation: 'Your next good movie starts here.', stages: ['Your ratings', 'Find patterns', 'Next watch'],
  },
  'student-success-prediction': {
    displayTitle: 'Student success prediction',
    summary: 'Use academic and enrollment data to classify dropout, enrolled, and graduate outcomes.',
    metric: 'Logistic regression', finding: 'The strongest tested model on accuracy and F1-score.',
    annotation: 'Find the signal. Support the student.', stages: ['Student data', 'Compare models', 'Classify outcome'],
  },
};
