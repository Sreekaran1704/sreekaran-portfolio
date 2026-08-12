import { motion } from 'framer-motion';
import { FiArrowRight, FiSearch } from 'react-icons/fi';

export function AskBar({
	inputRef,
	input,
	setInput,
	setFocused,
	hasThread,
	loading,
	onSubmit,
}) {
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit();
			}}
			className="askme-bar"
		>
			<FiSearch className="askme-bar-icon" aria-hidden="true" />

			<input
				ref={inputRef}
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onFocus={() => setFocused(true)}
				placeholder={
					hasThread ? 'Ask a follow-up…' : 'Ask me about my work…'
				}
				aria-label="Ask a question about Sreekaran's background"
				maxLength={500}
				disabled={loading}
				className="askme-input"
			/>

			<button
				type="submit"
				className="askme-send"
				disabled={loading || !input.trim()}
				aria-label="Send question"
			>
				<FiArrowRight />
			</button>
		</form>
	);
}

export function Suggestions({ suggestions, onPick }) {
	return (
		<div className="askme-recommended">
			<p className="askme-recommended-label">Try one of these</p>

			<div className="askme-recommended-grid">
				{suggestions.map((item) => (
					<button
						key={item.category}
						type="button"
						// Buttons don't take focus on click in every browser, so
						// suppressing mousedown's default keeps focus on the input and
						// the panel mounted long enough for onClick to fire.
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => onPick(item.question)}
						className="askme-suggestion"
					>
						<span className="askme-suggestion-category">{item.category}</span>
						<span className="askme-suggestion-text">{item.question}</span>
					</button>
				))}
			</div>
		</div>
	);
}

function ThreadMessage({ message }) {
	const isUser = message.role === 'user';

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, ease: 'easeOut' }}
			className={`askme-row ${isUser ? 'askme-row-user' : 'askme-row-bot'}`}
		>
			<span className="askme-speaker">{isUser ? 'You asked' : 'Sreekaran'}</span>
			<div className={`askme-bubble ${isUser ? 'askme-bubble-user' : 'askme-bubble-bot'}`}>
				{message.content
					.split('\n')
					.filter(Boolean)
					.map((line, i) => (
						<p key={i}>{line}</p>
					))}
			</div>
		</motion.div>
	);
}

function TypingIndicator() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className="askme-row askme-row-bot"
		>
			<span className="askme-speaker">Sreekaran</span>
			<div className="askme-bubble askme-bubble-bot askme-bubble-typing">
				<span className="askme-dot" />
				<span className="askme-dot" />
				<span className="askme-dot" />
				<span className="askme-typing-label">looking it up</span>
			</div>
		</motion.div>
	);
}

export function Thread({ messages, loading, threadEndRef }) {
	return (
		<div className="askme-thread">
			{messages.map((message, i) => (
				<ThreadMessage key={i} message={message} />
			))}

			{loading && <TypingIndicator />}

			<div ref={threadEndRef} />
		</div>
	);
}

export function FollowUps({ followUps, onPick }) {
	return (
		<div className="askme-followups">
			<span className="askme-followups-label">Next</span>

			{followUps.map((question) => (
				<button
					key={question}
					type="button"
					onMouseDown={(e) => e.preventDefault()}
					onClick={() => onPick(question)}
					className="askme-followup"
				>
					{question}
				</button>
			))}
		</div>
	);
}

export function ErrorNotice({ error, onDismiss }) {
	return (
		<div className="askme-error" role="alert">
			<p>{error}</p>
			<button type="button" onClick={onDismiss} className="askme-error-retry">
				Dismiss
			</button>
		</div>
	);
}
