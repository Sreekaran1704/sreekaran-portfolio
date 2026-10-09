import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import PagesMetaHead from '../../../components/PagesMetaHead';
import PhotoCullDemo from '../../../components/projects/PhotoCullDemo';
import { ReadingSection, StoryContents } from '../../../components/reading/ReadingKit';
import {
	photocullBadges,
	photocullCapabilities,
	photocullEditions,
	photocullHeadline,
	photocullIdeas,
	photocullLinks,
	photocullNever,
	photocullPipeline,
	photocullRuntime,
} from '../../../data/photocullStudy';

export default function PhotoCullProject() {
	return (
		<div className="reader fh-page project-detail-page px-6 py-8 sm:px-10 lg:px-16">
			<PagesMetaHead
				title="PhotoCull: Privacy-First Camera Roll Intelligence"
				description="A local-first computer-vision system for detecting redundant photos, organizing events, and building explainable photo shortlists without paid inference APIs."
				keywords="computer vision, perceptual hashing, near-duplicate detection, clustering, ranking, local ML, privacy, Streamlit, portfolio project"
				image="/og/photocull.png"
				imageAlt="PhotoCull case study: near-duplicate F1 of 82.76% with 98.36% precision and 71.43% recall."
			/>

			<div className="mx-auto max-w-4xl">
				<Link href="/#projects" className="project-detail-back-btn mt-8">
					← Back to Projects
				</Link>

				<header className="fh-hero mt-6">
					<span className="fh-eyebrow">Computer Vision Project</span>
					<h1 className="fh-hero-title">PhotoCull</h1>
					<p className="pc-subtitle">Privacy-First Camera Roll Intelligence</p>
					<p className="fh-hero-lede">
						A local-first computer-vision system for detecting redundant photos, organizing events,
						and building explainable photo shortlists without paid inference APIs.
					</p>
					<div className="fh-study-links">
						<a className="notice-link-btn" href={photocullLinks.live} target="_blank" rel="noopener noreferrer">
							Live Demo <FiArrowUpRight aria-hidden="true" />
						</a>
						<a
							className="notice-link-btn notice-link-outline"
							href={photocullLinks.github}
							target="_blank"
							rel="noopener noreferrer"
						>
							GitHub <FiArrowUpRight aria-hidden="true" />
						</a>
					</div>
					<ul className="rd-tools" aria-label="Topics">
						{photocullBadges.map((badge) => (
							<li key={badge}>{badge}</li>
						))}
					</ul>
				</header>

				<PhotoCullDemo />

				<aside className="rd-tldr" aria-label="What PhotoCull does">
					<h2>What it does</h2>
					<ul>
						{photocullCapabilities.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</aside>

				<StoryContents label="On this page" />

				<ReadingSection eyebrow="Pipeline" title="From camera roll to shortlist">
					<p>
						Each stage is cheap, local, and explainable on its own. Optional embedding models add
						signal when they are installed; when they are not, the pipeline degrades gracefully to
						the hash-based path.
					</p>
					<ol className="pc-pipeline">
						{photocullPipeline.map(({ step, detail, optional }, index) => (
							<li key={step} className={optional ? 'is-optional' : undefined}>
								<span className="pc-pipeline-no" aria-hidden="true">
									{String(index + 1).padStart(2, '0')}
								</span>
								<span className="pc-pipeline-step">
									{step}
									{optional && <span className="pc-pipeline-tag">Optional</span>}
								</span>
								<span className="pc-pipeline-detail">{detail}</span>
							</li>
						))}
					</ol>
				</ReadingSection>

				<ReadingSection eyebrow="Evaluation" title="Measured before it was trusted">
					<p className="pc-qualifier">Synthetic held-out benchmark</p>
					<div className="fh-study-snapshot" role="group" aria-label="Benchmark and validation results">
						{photocullHeadline.map(({ value, unit, label }) => (
							<div key={label} className="fh-hero-stat">
								<strong className="fh-hero-stat-value">
									{value}
									{unit && <span className="fh-hero-stat-unit">{unit}</span>}
								</strong>
								<span className="fh-hero-stat-label">{label}</span>
							</div>
						))}
						<p>
							Duplicate metrics come from a synthetic held-out benchmark, not real camera rolls. They
							are not a real-world accuracy claim, and preferences have not been validated with people.
						</p>
					</div>

					<div className="fh-table-wrap">
						<table className="fh-table pc-runtime">
							<caption className="sr-only">Runtime and validation results</caption>
							<thead>
								<tr>
									<th scope="col">Check</th>
									<th scope="col">Result</th>
								</tr>
							</thead>
							<tbody>
								{photocullRuntime.map(([check, result]) => (
									<tr key={check}>
										<td>{check}</td>
										<td>{result}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<blockquote className="fh-insight">
						<span className="fh-insight-tag">Engineering takeaway</span>
						<p>
							Embedding hybrids improved recall on standard pairs but introduced more hard-negative
							false positives, so the conservative hash-based system remained the production default.
						</p>
					</blockquote>
				</ReadingSection>

				<ReadingSection eyebrow="Engineering" title="What makes it technically interesting">
					<ul className="pc-ideas">
						{photocullIdeas.map(([name, line]) => (
							<li key={name}>
								<h3>{name}</h3>
								<p>{line}</p>
							</li>
						))}
					</ul>
				</ReadingSection>

				<ReadingSection eyebrow="Privacy" title="Two editions, two privacy models">
					<div className="pc-editions">
						{photocullEditions.map(({ name, tag, points }) => (
							<article key={name} className="pc-edition">
								<h3>{name}</h3>
								<p className="pc-edition-tag">{tag}</p>
								<ul>
									{points.map((point) => (
										<li key={point}>{point}</li>
									))}
								</ul>
							</article>
						))}
					</div>
					<h3 className="pc-never-title">What PhotoCull never does automatically</h3>
					<ul className="fh-plain-list pc-never">
						{photocullNever.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<p className="pc-demo-small">
						It is a decision-support tool: you decide what stays and what goes. Web Demo uploads are processed temporarily for the session and are not intentionally
						persisted; only the Local Edition keeps photos on the device. No paid inference API is
						used in either edition.
					</p>
				</ReadingSection>

				<footer className="fh-section">
					<h2>Explore PhotoCull</h2>
					<div className="fh-study-links">
						<a className="notice-link-btn" href={photocullLinks.live} target="_blank" rel="noopener noreferrer">
							Open Live Demo <FiArrowUpRight aria-hidden="true" />
						</a>
						<a
							className="notice-link-btn notice-link-outline"
							href={photocullLinks.github}
							target="_blank"
							rel="noopener noreferrer"
						>
							Read the code <FiArrowUpRight aria-hidden="true" />
						</a>
					</div>
				</footer>
			</div>
		</div>
	);
}
