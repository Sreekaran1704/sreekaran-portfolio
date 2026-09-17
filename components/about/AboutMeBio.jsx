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

// The About story, one chapter per card. Text is unchanged from the original.
const chapters = [
	{
		title: "Where it started",
		text: "I started out doing data analysis in places that had no data analyst. At Sree Nirman, 50,000+ construction records lived across scattered files and inconsistent formats. Pricing decisions were made on gut feel because nobody trusted the numbers enough to use them. At Avanthi High School, it was the same problem in a different shape: 12,000+ financial records and 50,000+ expense records with no standardized schema, and a scholarship process nobody could fully explain. In both places, my first job was earning the right to be trusted with the data at all, building the SQL and Python pipelines, validation checks, and Tableau dashboards before I could say anything interesting about what the numbers meant.",
	},
	{
		title: "Building on the foundation",
		text: "Once that foundation existed, the real work started. At Sree Nirman, I built a tender estimation model to flag pricing risk before bids went out. At Avanthi, I replaced the scholarship process with a system combining regression and a fine-tuned language model, then ran a two-channel A/B test to confirm a new admissions initiative was actually working. It was.",
	},
	{
		title: "The project that changed my thinking",
		text: "The project that changed how I think about analysis was FanHouse, a study I built with synthetic retail data. Members spent 22.3% more after launch, but eventual members already spent 40.6% more before it. I used matching followed by difference-in-differences to make the comparison more useful. Estimated product value increased before discounts, while higher net payments were not established. I kept the pretrend warning and sensitivity results visible. That was when I started asking not just whether a number looked convincing, but what evidence would let me defend it.",
	},
	{
		title: "What I do now",
		text: "That's the thread through everything I do now: SQL and Python to make data trustworthy, Tableau to make it legible, and causal inference to make it actionable. I'm currently looking for my next place to do that, as a Data Analyst, Business Analyst, BI Analyst, Analytics Engineer, or in Applied AI.",
	},
];

const CHAPTER_TONES = ['about', 'front', 'projects', 'experience'];

function Chapter({ chapter, index }) {
	return (
		<Reveal
			as="article"
			delay={index * 0.05}
			className={`np-ab-chapter np-ab-c${index + 1} np-tone-${CHAPTER_TONES[index]}`}
		>
			<header className="np-ab-chapter-head">
				<span className="np-ab-chapter-no" aria-hidden="true">
					{String(index + 1).padStart(2, '0')}
				</span>
				<h4>{chapter.title}</h4>
			</header>
			<p>{chapter.text}</p>
		</Reveal>
	);
}

function AboutMe() {
	return (
		<div className="np-wrap np-section">
			<SectionHead section="Section A · Profile" page="Page A2" title="About" dek="A short intro of me" />

			<Reveal as="dl" className="np-ab-stats" aria-label="By the numbers">
				{stats.map((stat) => (
					<div key={stat.value} className={`np-ab-stat np-tone-${stat.tone}`}>
						<dt>{stat.label}</dt>
						<dd>{stat.value}</dd>
					</div>
				))}
			</Reveal>

			<h3 className="np-ab-headline">
				Earning the right to be <span>trusted</span> with the data
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
