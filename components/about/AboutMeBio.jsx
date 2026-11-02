import { useState } from 'react';
import SectionHead from '../shared/SectionHead';
import Reveal from '../shared/Reveal';

// Pulled from the story below and the experience record, so a skimming reader
// still leaves with the headline results.
const stats = [
	{ value: '50K+', label: 'construction records made trustworthy at Sree Nirman', tone: 'about' },
	{ value: '50%', label: 'rise in school revenue at Avanthi High School', tone: 'projects' },
	{ value: '18%', label: 'rise in admissions, checked with an A/B comparison', tone: 'experience' },
	{ value: '3.97', label: 'GPA, M.S. Computer Science', tone: 'writing' },
];

// The About story, one chapter per card: a lead, then the rest of the chapter.
const chapters = [
	{
		title: 'The first script',
		lead: 'As a kid, my friends and I had a contest: whoever texted “Happy Birthday” first at midnight won two chocolates. Everyone else got one.',
		more: [
			'I didn’t want to win by staring at a clock, so I wrote a script that sent the message at exactly 12:00 AM. It was my first real code, and it taught me something I still believe: the best work makes the right thing happen reliably, every time, without anyone having to remember. Years later, that is still how I think about data. A number only helps if it shows up correct, on time, every time.',
		],
	},
	{
		title: 'Small teams, real stakes',
		lead: 'My first two jobs were on small teams where I was the person who owned the data, from the raw spreadsheets to the decision in the room.',
		more: [
			'At Avanthi High School, I consolidated 12K+ fee records and 50K+ expense records into reporting tables in Python and SQL, then used them to find 10–15% in cost savings. I designed an A/B test of two admission-marketing channels that lifted admissions by 18%. I built a scholarship system with XGBoost and a fine-tuned GPT-2, and walked the principal and correspondent through it, one user story at a time, until they backed the change.',
			'At Sree Nirman, a construction startup in Hyderabad, I joined as the second employee. I standardized 50K+ project records, which made reporting 30% more reliable. I built a bid-pricing model from fewer than 200 real records, owned the bidding tool from specs to user testing, and cut bid analysis time in half. Along the way I helped hire 8 engineers and 2 interns, and grew the company YouTube channel to 60K+ subscribers, which brought in 12 construction deals.',
		],
	},
	{
		title: 'The project that changed my thinking',
		lead: 'In my FanHouse case study, members spent 22.3% more after a membership launched. It looked like a clear win. It wasn’t that simple.',
		more: [
			'The customers who later joined already spent 40.6% more before the program existed. So I matched 12,153 member and non-member pairs on their history, then compared how each pair changed. Product value rose by about $0.14 per customer per day, but higher net payments were not established once discounts and rewards came out. I kept the pretrend warning and sensitivity checks on the page instead of hiding them. Since then, I ask a harder question of every result: not “does this look convincing?” but “what evidence would let me defend it?”',
		],
	},
	{
		title: 'What I’m looking for',
		lead: 'I finished my M.S. in Computer Science, Data Science track, at UMKC in May 2026 with a 3.97 GPA, and I’m looking for my next team.',
		more: [
			'I’m applying for Data Analyst, Business Analyst, Data Scientist, Analytics Engineer and Applied AI roles. I’m based in Dallas and open to relocating anywhere in the US. Between applications, I write about causal inference and how language models work, and I keep building: a live job-market pipeline with its own MCP server, a forecasting backtest, and a photo-curation tool that runs on your own machine.',
		],
	},
];

const CHAPTER_TONES = ['about', 'front', 'projects', 'experience'];

// On a phone each chapter opens on its lead (see mobile.css); wider screens
// never show the button and always show the whole chapter.
function Chapter({ chapter, index }) {
	const [open, setOpen] = useState(false);

	return (
		<Reveal
			as="article"
			delay={index * 0.05}
			className={`np-ab-chapter np-ab-c${index + 1} np-tone-${CHAPTER_TONES[index]} ${open ? 'is-open' : ''}`}
		>
			<header className="np-ab-chapter-head">
				<span className="np-ab-chapter-no" aria-hidden="true">
					{String(index + 1).padStart(2, '0')}
				</span>
				<h4>{chapter.title}</h4>
			</header>
			<p>{chapter.lead}</p>
			<div className="np-ab-rest">
				{chapter.more.map((paragraph) => (
					<p key={paragraph.slice(0, 24)}>{paragraph}</p>
				))}
			</div>
			<button
				type="button"
				className="np-ab-more"
				aria-expanded={open}
				onClick={() => setOpen((value) => !value)}
			>
				{open ? 'Show less' : 'Read more'} <span aria-hidden="true">{open ? '↑' : '↓'}</span>
			</button>
		</Reveal>
	);
}

function AboutMe() {
	return (
		<div className="np-wrap np-section">
			<SectionHead section="Section D · Profile" page="Page D1" title="About" dek="My background and approach to working with data." />

			<Reveal as="dl" className="np-ab-stats" aria-label="By the numbers">
				{stats.map((stat) => (
					<div key={stat.value} className={`np-ab-stat np-tone-${stat.tone}`}>
						<dt>{stat.label}</dt>
						<dd>{stat.value}</dd>
					</div>
				))}
			</Reveal>

			<h3 className="np-ab-headline">
				It started with two <span>chocolates</span>
			</h3>

			<div className="np-ab-grid">
				{chapters.map((chapter, index) => (
					<Chapter key={chapter.title} chapter={chapter} index={index} />
				))}

				<Reveal as="blockquote" className="np-ab-quote">
					<p>
						The real value of data is not in the dashboard or the number, it is in
						the decision it improves.
					</p>
				</Reveal>

				<Reveal as="aside" className="np-ab-glance np-tone-front" aria-label="At a glance">
					<h4>At a glance</h4>
					<dl>
						<div>
							<dt>Email</dt>
							<dd>
								<a href="mailto:sreekaran.2021@gmail.com">sreekaran.2021@gmail.com</a>
							</dd>
						</div>
						<div>
							<dt>Focus</dt>
							<dd>Data Analyst · Causal Inference · LLMs</dd>
						</div>
						<div>
							<dt>Degree</dt>
							<dd>M.S. Computer Science · 3.97 GPA</dd>
						</div>
					</dl>
				</Reveal>
			</div>
		</div>
	);
}

export default AboutMe;
