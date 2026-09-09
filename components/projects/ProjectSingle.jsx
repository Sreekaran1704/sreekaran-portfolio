import Link from 'next/link';
import { motion } from 'framer-motion';
import { projectNotes } from '../../data/projectNotes';
import ProjectPreview from './ProjectPreview';

function ProjectSingle({ title, url, githubUrl, liveUrl, category, ProjectInfo }) {
	const techs = ProjectInfo?.Technologies?.[0]?.techs || [];

	const note = projectNotes[url] || { summary: ProjectInfo?.ObjectivesDetails, metric: category, finding: 'Explore the project for methods and results.', annotation: 'Notes from the process.' };

	return (
		<motion.article
			initial={false}
			whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.08 }}
			transition={{ duration: 0.4 }}
			className={[
				'projects-card',
				note.featured ? 'projects-card-featured' : 'projects-card-brief',
			].join(' ')}>
			<div className="projects-card-tag">{category}</div>

			<h3 className="projects-card-title">{note.displayTitle || title}</h3>

			<p className="projects-card-summary">{note.summary}</p>

			{note.featured && <ProjectPreview note={note} />}

			{note.finding && (
				<p className="projects-card-finding">
					<span className="projects-finding-leaf" aria-hidden="true" />
					<span>{note.finding}</span>
				</p>
			)}

			<div className="projects-card-tech">
				{techs.slice(0, 5).map((tech) => (
					<span key={tech}>{tech}</span>
				))}
			</div>

			<div className="projects-card-actions">
				<Link
					href={`/projects/${url}`}
					className="notice-link-btn"
					aria-label={`View details for ${title}`}
				>
					{note.detailsLabel || 'View Details'} →
				</Link>

				{liveUrl && liveUrl !== '#' && (
					<a
						href={liveUrl}
						target='_blank'
						rel="noopener noreferrer"
						className="notice-link-btn notice-link-outline"
						aria-label={`View live site for ${title}`}
					>
						{note.liveLabel || 'Live Site'} →
					</a>

				)
				}

				{githubUrl && githubUrl !== '#' && (
					<a
						href={githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="notice-link-btn notice-link-outline"
						aria-label={`View GitHub repository for ${title}`}
					>
						GitHub →
					</a>
				)}
			</div>
		</motion.article>
	);
}

export default ProjectSingle;
