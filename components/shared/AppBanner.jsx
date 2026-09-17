import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
	FiArrowRight,
	FiArrowUpRight,
	FiGithub,
	FiLinkedin,
	FiMail,
	FiMessageSquare,
} from 'react-icons/fi';
import { useAskMe } from '../home/useAskMe';
import {
	AskBar,
	ErrorNotice,
	FollowUps,
	Suggestions,
	Thread,
} from '../home/AskMeParts';

// Every line here is taken from the About, Projects or Experience content.
const tickerItems = [
	'Open to work: Data Analyst, Business Analyst, BI Analyst, Analytics Engineer, Applied AI',
	'ARIMA beat XGBoost and LightGBM on 5 of 5 loan-delinquency series',
	'FanHouse study: 40,000 synthetic customers, 12,153 matched pairs',
	'50% rise in school revenue at Avanthi High School',
	'Market Pulse: a live job-market pipeline with its own MCP server',
	'M.S. Computer Science, 3.97 GPA',
];

// From "SQL and Python to make data trustworthy, Tableau to make it legible,
// and causal inference to make it actionable."
const promises = [
	{ word: 'trustworthy', how: 'with SQL & Python' },
	{ word: 'legible', how: 'with Tableau' },
	{ word: 'actionable', how: 'with causal inference' },
];

const topStories = [
	{
		figure: '5/5',
		tone: 'projects',
		kicker: 'Forecasting',
		headline: 'Classical ARIMA beat machine learning on every loan series',
		href: '/projects/loan-default-forecasting',
		cta: 'Read the story',
	},
	{
		figure: '40.6%',
		tone: 'about',
		kicker: 'Causal inference',
		headline: 'Members already spent more before the membership existed',
		href: '/projects/fanhouse-membership-analysis',
		cta: 'Read the case study',
	},
	{
		figure: 'Live',
		tone: 'writing',
		kicker: 'Data engineering',
		headline: 'Market Pulse turns daily job postings into market intelligence',
		href: '/projects/market-pulse-job-market-intelligence',
		cta: 'See how it works',
	},
];

function Ticker() {
	const row = tickerItems.map((item) => (
		<span key={item} className="np-ticker-item">
			{item}
		</span>
	));

	return (
		<div className="np-ticker" role="region" aria-label="Highlights">
			<span className="np-ticker-label">
				<i aria-hidden="true" />
				Breaking
			</span>
			<div className="np-ticker-window">
				<div className="np-ticker-track">
					<div className="np-ticker-run">{row}</div>
					{/* A second copy makes the scroll loop seamlessly. */}
					<div className="np-ticker-run" aria-hidden="true">
						{row}
					</div>
				</div>
			</div>
		</div>
	);
}

// Cycles the three things the About story says the tools are for.
function DataPromise() {
	const [index, setIndex] = useState(0);
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
		setAnimate(true);
		const timer = setInterval(() => setIndex((i) => (i + 1) % promises.length), 2600);
		return () => clearInterval(timer);
	}, []);

	const current = promises[index];

	return (
		<p className="np-promise">
			<span className="sr-only">
				I make data trustworthy with SQL and Python, legible with Tableau, and
				actionable with causal inference.
			</span>
			<span aria-hidden="true">
				I make data{' '}
				<span className="np-promise-slot">
					<span key={current.word} className={`np-promise-word ${animate ? 'is-animated' : ''}`}>
						{current.word}
					</span>
				</span>{' '}
				<span key={current.how} className={`np-promise-how ${animate ? 'is-animated' : ''}`}>
					{current.how}
				</span>
			</span>
		</p>
	);
}

// The chatbot, set as a reader-questions box beside the top stories.
function AskTheDesk() {
	const askMe = useAskMe();
	const { hasThread, error, loading } = askMe;

	return (
		<aside className="np-box np-ask" aria-labelledby="np-ask-title">
			<div className="np-ask-banner">
				<FiMessageSquare aria-hidden="true" />
				<span>Ask Me Anything</span>
			</div>
			<h3 id="np-ask-title" className="np-ask-title">
				Ask me about my work
			</h3>
			<p className="np-box-note">
				Type a question, or pick one below. Answers are drawn from my
				background, projects and experience.
			</p>

			<AskBar
				inputRef={askMe.inputRef}
				input={askMe.input}
				setInput={askMe.setInput}
				setFocused={askMe.setFocused}
				hasThread={hasThread}
				loading={loading}
				onSubmit={() => askMe.ask(askMe.input)}
			/>

			{!hasThread && !loading && (
				<Suggestions suggestions={askMe.suggestions} onPick={askMe.ask} />
			)}

			{hasThread && (
				<Thread messages={askMe.messages} loading={loading} threadEndRef={askMe.threadEndRef} />
			)}

			{error && (
				<ErrorNotice
					error={error}
					onDismiss={() => {
						askMe.setError('');
						if (askMe.inputRef.current) askMe.inputRef.current.focus();
					}}
				/>
			)}

			{hasThread && askMe.followUps.length > 0 && !loading && (
				<FollowUps followUps={askMe.followUps} onPick={askMe.ask} />
			)}

			{hasThread && (
				<button type="button" className="np-text-btn" onClick={askMe.reset}>
					Clear conversation
				</button>
			)}
		</aside>
	);
}

const rise = (delay) => ({
	initial: { opacity: 0, y: 24 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: 'easeOut', delay },
});

function AppBanner() {
	return (
		<div className="np-hero-page">
			<Ticker />

			<div className="np-wrap np-hero">
				<div className="np-hero-copy">
					<motion.h1 className="np-hero-name" {...rise(0)}>
						Sreekaran <span>Reddy</span>
					</motion.h1>

					<motion.p className="np-hero-role" {...rise(0.16)}>
						Data Analyst <b>&amp;</b> Data Scientist
					</motion.p>

					<motion.div {...rise(0.24)}>
						<DataPromise />
					</motion.div>

					<motion.ul className="np-hero-tags" aria-label="Focus areas" {...rise(0.3)}>
						<li>Causal Inference</li>
						<li>LLM Fine-Tuning</li>
						<li>SQL · Python · Tableau</li>
					</motion.ul>

					<motion.div className="np-hero-actions" {...rise(0.36)}>
						<a
							href="https://drive.google.com/file/d/1F5lB8PRJcaCCIswuf6FhhQbmYPLueXmE/view?usp=sharing"
							target="_blank"
							rel="noopener noreferrer"
							className="np-cta np-cta-primary"
						>
							View Resume <FiArrowUpRight aria-hidden="true" />
						</a>
						<Link href="#about" className="np-cta">
							Read my story <FiArrowRight aria-hidden="true" />
						</Link>
						<span className="np-hero-socials">
							<a href="https://github.com/Sreekaran1704" target="_blank" rel="noreferrer" aria-label="GitHub">
								<FiGithub />
							</a>
							<a href="https://www.linkedin.com/in/sree1704" target="_blank" rel="noreferrer" aria-label="LinkedIn">
								<FiLinkedin />
							</a>
							<a href="mailto:sreekaran.2021@gmail.com" aria-label="Email">
								<FiMail />
							</a>
						</span>
					</motion.div>
				</div>

				<motion.figure
					className="np-hero-photo"
					initial={{ opacity: 0, rotate: 4, scale: 0.94 }}
					animate={{ opacity: 1, rotate: -2, scale: 1 }}
					transition={{ duration: 0.7, ease: [0.34, 1.3, 0.64, 1], delay: 0.15 }}
				>
					<div className="np-hero-photo-frame">
						<img src="/images/sreekaran_profile.jpg" alt="Sreekaran Reddy" />
						<figcaption>
							&ldquo;Every data has a story it isn&apos;t telling yet. I enjoy the
							process of finding it.&rdquo;
						</figcaption>
					</div>


					<motion.span
						className="np-sticker np-sticker-open"
						initial={{ opacity: 0, scale: 0.4 }}
						animate={{ opacity: 1, scale: 1, rotate: -6 }}
						transition={{ duration: 0.5, ease: [0.34, 1.5, 0.64, 1], delay: 0.85 }}
					>
						Open to work
					</motion.span>
				</motion.figure>
			</div>

			<div className="np-wrap np-hero-lower">
				<AskTheDesk />

				<section className="np-top-stories" aria-labelledby="np-top-stories-title">
					<h2 id="np-top-stories-title" className="np-top-stories-title">
						Top stories
					</h2>
					{topStories.map((story) => (
						<Link
							key={story.href}
							href={story.href}
							className={`np-teaser np-teaser-${story.tone}`}
						>
							<span className="np-teaser-figure">{story.figure}</span>
							<span className="np-teaser-body">
								<span className="np-teaser-kicker">{story.kicker}</span>
								<span className="np-teaser-headline">{story.headline}</span>
								<span className="np-teaser-cta">
									{story.cta} <FiArrowRight aria-hidden="true" />
								</span>
							</span>
						</Link>
					))}
					<Link href="#projects" className="np-teaser-all">
						All 8 projects <FiArrowRight aria-hidden="true" />
					</Link>
				</section>
			</div>
		</div>
	);
}

export default AppBanner;
