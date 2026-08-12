// Question suggestions for the "Ask Me" widget.
//
// Four categories, one shown per category. Which specific question appears is
// picked on the client after mount, so repeat visitors don't always see the
// same four — and so server and client markup never disagree on first paint.

export const suggestionCategories = [
	{
		id: 'about',
		label: 'About',
		questions: [
			'Who are you and what do you do?',
			'What kind of role are you looking for?',
			'What got you into data analysis?',
			'What are you studying right now?',
		],
	},
	{
		id: 'experience',
		label: 'Experience',
		questions: [
			'Walk me through your work experience.',
			'What did you do at Sree Nirman?',
			'What was your impact at Avanthi High School?',
			'Have you worked with stakeholders directly?',
		],
	},
	{
		id: 'projects',
		label: 'Projects',
		questions: [
			'Tell me about the FanHouse case study.',
			'What is Market Pulse?',
			'How did the QLoRA fine-tuning project go?',
			'What did you build for hospital readmission prediction?',
		],
	},
	{
		id: 'skills',
		label: 'Skills',
		questions: [
			'What does your technical stack look like?',
			'How strong is your SQL?',
			'What experience do you have with LLMs?',
			'Have you deployed models to production?',
		],
	},
];

// Follow-ups offered after an answer. The first matching topic wins; `general`
// is the fallback when nothing matches.
const followUpTopics = [
	{
		// Ahead of the project topics on purpose: an answer about a job routinely
		// mentions a tool or metric a project also uses, and the employer names
		// here are the stronger signal of what the visitor is actually asking about.
		id: 'experience',
		match: /sree nirman|avanthi|internship|intern\b|lab assistant|assistantship|stakeholder|construction|high school|work history|employer/i,
		questions: [
			'What was the hardest part of that role?',
			'What did you build at the other company?',
			'How much of that work was SQL?',
		],
	},
	{
		id: 'fanhouse',
		match: /fanhouse|causal|propensity|difference-in-differences|diff-in-diff|a\/b|experiment|membership/i,
		questions: [
			'Why was the naive estimate off by 8x?',
			'How do the ITT and TOT numbers differ?',
			'Was that real company data?',
		],
	},
	{
		id: 'health',
		// No bare "xgboost": it appears in the Avanthi work and in any stack
		// answer, neither of which is a question about the healthcare project.
		match: /medpredict|readmission|hospital|clinical|patient|smote|qwen|risk tier/i,
		questions: [
			'How did you decide on the risk tiers?',
			'Why XGBoost over the other models?',
			'How does the RAG explanation layer work?',
		],
	},
	{
		id: 'llm',
		match: /qlora|lora|gemma|fine-tun|llm|perplexity|story generation|rag|faiss|prompt/i,
		questions: [
			'Did QLoRA actually improve the output quality?',
			'What hyperparameters did you train with?',
			'Where else have you used RAG?',
		],
	},
	{
		id: 'marketpulse',
		// Deliberately narrow: bare "pipeline" shows up in answers about almost
		// every role, and would drag Market Pulse follow-ups onto unrelated turns.
		match: /market pulse|fastmcp|\bmcp\b|adzuna|remoteok|render/i,
		questions: [
			'How is Market Pulse deployed?',
			'What does the MCP server expose?',
			'What other data pipelines have you built?',
		],
	},
	{
		id: 'skills',
		match: /skill|stack|tool|python|sql|aws|docker|deploy|mlops|cloud|kubernetes|dbt|bigquery/i,
		questions: [
			'Which of those have you shipped to production?',
			'What are you still learning?',
			'How comfortable are you with cloud infrastructure?',
		],
	},
	{
		id: 'hiring',
		match: /hire|hiring|role|job|available|open to|contact|reach|email|relocat|visa|graduate/i,
		questions: [
			'What kind of team are you looking to join?',
			'What is the best way to reach you?',
			'When do you graduate?',
		],
	},
	{
		id: 'general',
		match: /.*/,
		questions: [
			'What project are you most proud of?',
			'Walk me through your work experience.',
			'What does your technical stack look like?',
		],
	},
];

export function getFollowUps(question = '', answer = '') {
	const haystack = `${question} ${answer}`;
	const topic =
		followUpTopics.find((t) => t.id !== 'general' && t.match.test(haystack)) ||
		followUpTopics[followUpTopics.length - 1];
	return topic.questions;
}

export function pickSuggestions() {
	return suggestionCategories.map((category) => ({
		category: category.label,
		question:
			category.questions[Math.floor(Math.random() * category.questions.length)],
	}));
}

// Deterministic first render; the client swaps in a random set after mount.
export const defaultSuggestions = suggestionCategories.map((category) => ({
	category: category.label,
	question: category.questions[0],
}));
