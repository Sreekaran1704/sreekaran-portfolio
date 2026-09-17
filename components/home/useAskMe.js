import { useCallback, useEffect, useRef, useState } from 'react';
import {
	defaultSuggestions,
	getFollowUps,
	pickSuggestions,
} from '../../data/askMeSuggestions';

// All the Ask Me state, kept separate from layout so the hero can position the
// bar, the suggestion panel and the thread independently — they sit in
// different places on the clothesline rather than stacking in one card.
export function useAskMe() {
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [focused, setFocused] = useState(false);
	const [suggestions, setSuggestions] = useState(defaultSuggestions);
	const [followUps, setFollowUps] = useState([]);

	const inputRef = useRef(null);
	const threadEndRef = useRef(null);
	// Guards against a stale in-flight response overwriting a newer one.
	const requestIdRef = useRef(0);
	const requestControllerRef = useRef(null);

	useEffect(() => () => {
		requestIdRef.current += 1;
		requestControllerRef.current?.abort();
	}, []);

	const hasThread = messages.length > 0;

	// Randomize on the client only — server and client must agree on first paint.
	useEffect(() => {
		setSuggestions(pickSuggestions());
	}, []);

	useEffect(() => {
		if (hasThread && threadEndRef.current) {
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			threadEndRef.current.scrollIntoView({
				behavior: reduceMotion ? 'auto' : 'smooth',
				block: 'nearest',
			});
		}
	}, [messages, loading, hasThread]);

	const ask = useCallback(
		async (rawQuestion) => {
			const question = rawQuestion.trim();
			if (!question || loading || requestControllerRef.current) return;

			const requestId = requestIdRef.current + 1;
			requestIdRef.current = requestId;
			const controller = new AbortController();
			requestControllerRef.current = controller;
			const timeoutId = setTimeout(() => controller.abort(), 30000);

			const history = messages.map((m) => ({ role: m.role, content: m.content }));

			setMessages((prev) => [...prev, { role: 'user', content: question }]);
			setInput('');
			setError('');
			setFollowUps([]);
			setFocused(false);
			setLoading(true);

			try {
				const res = await fetch('/api/ask', {
					signal: controller.signal,
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ question, history }),
				});

				const data = await res.json().catch(() => ({}));
				if (requestIdRef.current !== requestId) return;

				if (!res.ok || !data.answer) {
					setError(
						data.error ||
							"I couldn't get an answer just now. Please try again in a moment."
					);
					return;
				}

				setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
				setFollowUps(getFollowUps(question, data.answer));
			} catch (err) {
				if (requestIdRef.current !== requestId) return;
				setError(
					controller.signal.aborted
						? 'The assistant took too long to respond. Please try again.'
						: 'Something went wrong reaching the assistant. Please check your connection and try again.'
				);
			} finally {
				clearTimeout(timeoutId);
				if (requestIdRef.current === requestId) {
					requestControllerRef.current = null;
					setLoading(false);
				}
			}
		},
		[loading, messages]
	);

	const reset = useCallback(() => {
		requestIdRef.current += 1;
		requestControllerRef.current?.abort();
		requestControllerRef.current = null;
		setMessages([]);
		setFollowUps([]);
		setError('');
		setInput('');
		setLoading(false);
	}, []);

	// Focus is tracked on a wrapper holding both the bar and the panel, so tabbing
	// from the input to a suggestion doesn't count as leaving. relatedTarget is
	// where focus is going — null when it leaves the document entirely.
	const handleWrapperBlur = useCallback((event) => {
		if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
	}, []);

	return {
		input,
		setInput,
		messages,
		loading,
		error,
		setError,
		focused,
		setFocused,
		suggestions,
		followUps,
		hasThread,
		inputRef,
		threadEndRef,
		ask,
		reset,
		handleWrapperBlur,
		showRecommended: focused && !hasThread && !input.trim() && !loading,
	};
}
