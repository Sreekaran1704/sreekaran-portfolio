import Link from 'next/link';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { projectNotes } from '../../data/projectNotes';
import ProjectPreview from './ProjectPreview';
import Reveal from '../shared/Reveal';

// Cards cycle through the paper's desk colours by story number.
const TONES = ['projects', 'about', 'front', 'writing', 'experience', 'skills', 'contact'];

// Every card renders the same run of rows — even an empty one — so the grid
// can line them up across a row: header, title, summary, (evidence), finding,
// tools, links.
function ProjectSingle({ index = 0, rowStart = false, number, title, url, githubUrl, liveUrl, category, ProjectInfo }) {
	const techs = ProjectInfo?.Technologies?.[0]?.techs || [];

	const note = projectNotes[url] || { summary: ProjectInfo?.ObjectivesDetails, metric: category, finding: 'Explore the project for methods and results.', annotation: 'Notes from the process.' };

	const tone = TONES[(Number(number) - 1) % TONES.length] || TONES[0];

	const external = [
		liveUrl && liveUrl !== '#' && { href: liveUrl, label: note.liveLabel || 'Live site', aria: 'live site' },
		githubUrl && githubUrl !== '#' && { href: githubUrl, label: 'GitHub', aria: 'GitHub repository' },
	].filter(Boolean);

	return (
		<Reveal
			as="article"
			delay={(index % 3) * 0.07}
			className={[
				'np-story',
				'np-card',
				`np-tone-${tone}`,
				note.featured ? 'np-card-featured' : 'np-card-brief',
				rowStart && 'is-row-start',
			]
				.filter(Boolean)
				.join(' ')}
		>
			<header className="np-card-head">
				<span className="np-card-label">
					{number && <span className="np-card-no">No. {number}</span>}
					<span className="np-card-cat">{category}</span>
				</span>
				{note.metric && <span className="np-card-metric">{note.metric}</span>}
			</header>

			<h3 className="np-card-title">
				<Link href={`/projects/${url}`}>{note.displayTitle || title}</Link>
			</h3>

			<p className="np-card-summary">{note.summary}</p>

			{note.featured && (
				<div className="np-card-evidence">
					<ProjectPreview note={note} />
				</div>
			)}

			<div className="np-card-finding">
				{note.finding && (
					<>
						<span className="np-card-finding-label">Key finding</span>
						<p>{note.finding}</p>
					</>
				)}
			</div>

			<ul className="np-card-tools" aria-label="Tools">
				{techs.slice(0, 4).map((tech) => (
					<li key={tech}>{tech}</li>
				))}
			</ul>

			<div className="np-card-links">
				<Link
					href={`/projects/${url}`}
					className="np-card-primary"
					aria-label={`View details for ${title}`}
				>
					{note.detailsLabel || 'View details'}
					<FiArrowRight aria-hidden="true" />
				</Link>

				{external.map((link) => (
					<a
						key={link.href}
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`View ${link.aria} for ${title}`}
					>
						{link.label}
						<FiArrowUpRight aria-hidden="true" />
					</a>
				))}
			</div>
		</Reveal>
	);
}

export default ProjectSingle;
