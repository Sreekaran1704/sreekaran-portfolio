import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import PagesMetaHead from '../../components/PagesMetaHead';
import { ReadingSection, StoryContents } from '../../components/reading/ReadingKit';
import { projectsData } from '../../data/projectsData';
import { projectNotes } from '../../data/projectNotes';
import Link from 'next/link';

// Some data strings carry a literal "&amp;".
const decode = (text = '') => text.replace(/&amp;/g, '&');

// Details are written as "Label: text" blocks separated by blank lines. Each
// block becomes its own paragraph with the label set in bold.
function DetailText({ text }) {
	return decode(text)
		.split(/\n\s*\n/)
		.filter(Boolean)
		.map((block, i) => {
			const match = block.match(/^([^:.\n]{2,48}):\s+([\s\S]+)$/);
			return match ? (
				<p key={i}>
					<strong>{match[1]}:</strong> {match[2]}
				</p>
			) : (
				<p key={i}>{block}</p>
			);
		});
}

function ProjectSingle({ project }) {
	const info = project.ProjectInfo;
	const tech = info.Technologies[0];
	const note = projectNotes[project.url];
	const links = [
		project.liveUrl && project.liveUrl !== '#' && { href: project.liveUrl, label: 'Live site' },
		project.githubUrl && project.githubUrl !== '#' && { href: project.githubUrl, label: 'GitHub' },
	].filter(Boolean);

	return (
		<div className="reader project-detail-page px-6 py-8 sm:px-10 lg:px-16">
			<PagesMetaHead title={project.title} />

			<div className="mx-auto max-w-4xl">
				<Link href="/#projects" className="project-detail-back-btn mt-8">
					<FiArrowLeft aria-hidden="true" /> Back to Projects
				</Link>

				<header className="fh-hero">
					<span className="fh-eyebrow">{project.category}</span>
					<h1 className="fh-hero-title">{decode(project.ProjectHeader.title)}</h1>
					<p className="fh-hero-byline">
						{project.ProjectHeader.publishDate} · {decode(project.ProjectHeader.tags)}
					</p>

					{links.length > 0 && (
						<div className="fh-study-links">
							{links.map((link, i) => (
								<a
									key={link.href}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className={`notice-link-btn ${i > 0 ? 'notice-link-outline' : ''}`}
									aria-label={`${link.label} for ${project.title}`}
								>
									{link.label} <FiArrowUpRight aria-hidden="true" />
								</a>
							))}
						</div>
					)}
				</header>

				{/* Everything a skimming reader needs, before any section is opened. */}
				<section className="rd-glance" aria-label="At a glance">
					{note?.finding && (
						<div className="rd-tldr">
							<h2>Key finding</h2>
							<p>{note.finding}</p>
						</div>
					)}

					<div className="rd-glance-grid">
						<div>
							<h2 className="rd-glance-heading">{info.ObjectivesHeading}</h2>
							<p className="rd-objective">{decode(info.ObjectivesDetails)}</p>
						</div>

						<dl className="rd-facts">
							{info.CompanyInfo.map((item) => (
								<div key={item.id}>
									<dt>{item.title}</dt>
									<dd>{decode(item.details)}</dd>
								</div>
							))}
						</dl>
					</div>

					<ul className="rd-tools" aria-label={tech.title}>
						{tech.techs.map((name) => (
							<li key={name}>{name}</li>
						))}
					</ul>
				</section>

				<StoryContents label={info.ProjectDetailsHeading || 'In this story'} />

				{info.ProjectDetails.map((detail, index) => (
					<ReadingSection
						key={detail.title || index}
						eyebrow={`Part ${index + 1}`}
						title={decode(detail.title || `Part ${index + 1}`)}
					>
						<DetailText text={detail.details} />
					</ReadingSection>
				))}
			</div>
		</div>
	);
}

export async function getServerSideProps({ query }) {
	const { id } = query;
	const project = projectsData.find(
		(project) => project.url === id || project.id === parseInt(id)
	);

	if (!project) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			project,
		},
	};
}

export default ProjectSingle;
