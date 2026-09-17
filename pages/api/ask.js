import { buildSystemPrompt } from '../../data/askMeContext';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Keep the answer grounded in the current project context.
// Override the configured model with GROQ_MODEL when needed. Groq retired its
// Llama chat models (llama-3.3-70b-versatile now returns model_not_found), so
// the default is OpenAI's open-weight gpt-oss-120b served on Groq.
const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

// gpt-oss is a reasoning model: its hidden reasoning counts against the output
// limit, so it needs more room than the ~90-word answer itself, and the
// reasoning text must not be returned to visitors.
const IS_REASONING_MODEL = /gpt-oss/.test(MODEL);

// Follow-ups only need enough thread to resolve "that project" / "how long
// there?" — past this, older turns just spend tokens.
const MAX_HISTORY_TURNS = 8;
const MAX_QUESTION_LENGTH = 500;

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const apiKey = process.env.GROQ_API_KEY;
	if (!apiKey) {
		console.error('[api/ask] GROQ_API_KEY is not set');
		return res.status(500).json({
			error: "The chat isn't configured right now. Please email sreekaran.2021@gmail.com.",
		});
	}

	const { question, history } = req.body || {};

	if (typeof question !== 'string' || !question.trim()) {
		return res.status(400).json({ error: 'A question is required.' });
	}
	if (question.length > MAX_QUESTION_LENGTH) {
		return res
			.status(400)
			.json({ error: 'That question is a bit long — could you shorten it?' });
	}

	// Only role/content pairs from our own two roles are forwarded, so a crafted
	// client payload can't smuggle in an extra system message.
	const priorTurns = Array.isArray(history)
		? history
				.filter(
					(m) =>
						m &&
						(m.role === 'user' || m.role === 'assistant') &&
						typeof m.content === 'string' &&
						m.content.trim()
				)
				.slice(-MAX_HISTORY_TURNS)
				.map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
		: [];

	try {
		const groqRes = await fetch(GROQ_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: MODEL,
				temperature: 0.2,
				...(IS_REASONING_MODEL
					? {
							reasoning_effort: 'low',
							include_reasoning: false,
							max_completion_tokens: 900,
						}
					: {
							// ~90 words of answer. A hard ceiling here does real work:
							// the longer a non-reasoning model runs, the more it invents
							// connective claims the context never stated.
							max_tokens: 260,
						}),
				messages: [
					{
						role: 'system',
						content: buildSystemPrompt(question.trim(), priorTurns),
					},
					...priorTurns,
					{ role: 'user', content: question.trim() },
				],
			}),
		});

		if (!groqRes.ok) {
			const detail = await groqRes.text();
			console.error('[api/ask] Groq error', groqRes.status, detail);

			// Groq's free tier caps tokens per minute, so a burst of visitors
			// hits 429 well before anything is actually broken. Say that plainly
			// instead of implying the site is down.
			if (groqRes.status === 429) {
				return res.status(429).json({
					error: "I'm getting a lot of questions right now. Give it about a minute and ask again.",
				});
			}

			return res.status(502).json({
				error: "I couldn't get an answer just now. Please try again in a moment.",
			});
		}

		const data = await groqRes.json();
		const answer = data?.choices?.[0]?.message?.content?.trim();

		if (!answer) {
			return res.status(502).json({
				error: "I couldn't get an answer just now. Please try again in a moment.",
			});
		}

		return res.status(200).json({ answer });
	} catch (err) {
		console.error('[api/ask] request failed', err);
		return res.status(500).json({
			error: 'Something went wrong reaching the assistant. Please try again.',
		});
	}
}
