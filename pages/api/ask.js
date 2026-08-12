import { buildSystemPrompt } from '../../data/askMeContext';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// llama-3.1-8b-instant was the first choice, but it broke the grounding rules in
// testing: asked about FanHouse it claimed the observational estimate "was
// significantly lower" than the randomized one (it is higher — $32–33 vs
// $3.73–$5.94), and it ran past the word limit, which is where inventions like
// that get room to appear. The 70b model holds the limit and the rules, and on
// Groq's free tier it also gets 12,000 TPM against the 8b's 6,000. Override with
// GROQ_MODEL if you want to swap back.
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

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
				// ~90 words of answer. A hard ceiling here does real work: the
				// longer this model runs, the more it invents connective claims
				// (which estimate was larger, why) that the context never stated.
				max_tokens: 260,
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
