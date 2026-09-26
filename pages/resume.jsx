import Link from 'next/link';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import PagesMetaHead from '../components/PagesMetaHead';
import Reveal from '../components/shared/Reveal';
import {
	resumeContacts,
	resumeEducation,
	resumeExperience,
	resumeName,
	resumePdfUrl,
	resumeProjects,
	resumeSkills,
	resumeSummary,
} from '../data/resumeData';

// A section of the resume opens like a story: a black rule with a short bar
// of the desk colour, and the section name as a kicker.
function ResumeHead({ tone, children }) {
	return <h2 className={`np-resume-head np-tone-${tone}`}>{children}</h2>;
}

function Points({ points }) {
	return (
		<ul className="np-rec-points np-resume-points">
			{points.map((point, i) => (
				<li key={i} dangerouslySetInnerHTML={{ __html: point }} />
			))}
		</ul>
	);
}

function ResumeLink({ href, children, ...rest }) {
	if (href.startsWith('/')) {
		return (
			<Link href={href} {...rest}>
				{children}
			</Link>
		);
	}
	const external = href.startsWith('http');
	return (
		<a
			href={href}
			target={external ? '_blank' : undefined}
			rel={external ? 'noopener noreferrer' : undefined}
			{...rest}
		>
			{children}
		</a>
	);
}

// The resume set as a special edition of the paper. It prints to a clean
// PDF: the masthead, footer and buttons drop out on paper.
export default function Resume() {
	return (
		<article className="np-wrap np-section np-resume">
			<PagesMetaHead title="Resume | Sreekaran Reddy" />

			<Reveal as="header" className="np-section-head np-resume-top">
				<h1 className="np-section-title">{resumeName}</h1>
				<ul className="np-resume-contacts" aria-label="Contact details">
					{resumeContacts.map((contact) => (
						<li key={contact.href}>
							<ResumeLink href={contact.href}>{contact.label}</ResumeLink>
						</li>
					))}
				</ul>
				<div className="np-resume-actions">
					<a
						href={resumePdfUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="np-cta np-cta-primary"
						aria-label="Original PDF on Google Drive (opens in a new tab)"
					>
						Original PDF <FiArrowUpRight aria-hidden="true" />
					</a>
					<Link href="/" className="np-cta">
						<FiArrowLeft aria-hidden="true" /> Portfolio
					</Link>
				</div>
			</Reveal>

			<Reveal as="section" id="summary" className="np-resume-summary" aria-labelledby="resume-summary">
				<ResumeHead tone="front">
					<span id="resume-summary">Professional Summary</span>
				</ResumeHead>
				<p className="np-resume-lede" dangerouslySetInnerHTML={{ __html: resumeSummary }} />
			</Reveal>

			<div className="np-resume-body">
				<div className="np-resume-main">
					<section id="experience" aria-labelledby="resume-experience">
						<ResumeHead tone="experience">
							<span id="resume-experience">Professional Experience</span>
						</ResumeHead>
						{resumeExperience.map((job) => (
							<Reveal as="article" key={job.org} className="np-resume-entry np-tone-experience">
								<p className="np-resume-meta">
									<span>{job.org}</span>
									<span>{job.period}</span>
								</p>
								<h3 className="np-resume-title">{job.role}</h3>
								<Points points={job.points} />
							</Reveal>
						))}
					</section>

					<section id="projects" aria-labelledby="resume-projects">
						<ResumeHead tone="projects">
							<span id="resume-projects">Projects</span>
						</ResumeHead>
						{resumeProjects.map((project) => (
							<Reveal as="article" key={project.name} className="np-resume-entry np-tone-projects">
								<p className="np-resume-meta">
									<span>{project.tools}</span>
									<span className="np-resume-links">
										{project.links.map((link) => (
											<ResumeLink key={link.label} href={link.href}>
												{link.label} →
											</ResumeLink>
										))}
									</span>
								</p>
								<h3 className="np-resume-title">{project.name}</h3>
								<Points points={project.points} />
							</Reveal>
						))}
					</section>
				</div>

				<aside className="np-resume-side">
					<section id="education" aria-labelledby="resume-education">
						<ResumeHead tone="about">
							<span id="resume-education">Education</span>
						</ResumeHead>
						<Reveal as="article" className="np-resume-entry np-tone-about">
							<p className="np-resume-meta">
								<span>{resumeEducation.school}</span>
							</p>
							<h3 className="np-resume-title">{resumeEducation.degree}</h3>
							<p className="np-resume-period">{resumeEducation.period}</p>
							<p className="np-resume-gpa">
								<strong>{resumeEducation.gpa}</strong>
								<span>GPA</span>
							</p>
							<div className="np-resume-group">
								<p className="np-resume-label">Relevant Coursework</p>
								<ul className="np-classified-list">
									{resumeEducation.coursework.map((course) => (
										<li key={course}>{course}</li>
									))}
								</ul>
							</div>
							<div className="np-resume-group">
								<p className="np-resume-label">Certifications</p>
								<ul className="np-classified-list">
									{resumeEducation.certifications.map((cert) => (
										<li key={cert}>{cert}</li>
									))}
								</ul>
							</div>
						</Reveal>
					</section>

					<section id="skills" aria-labelledby="resume-skills">
						<ResumeHead tone="skills">
							<span id="resume-skills">Technical Skills</span>
						</ResumeHead>
						{resumeSkills.map((group) => (
							<Reveal as="div" key={group.title} className="np-resume-group np-tone-skills">
								<h3 className="np-resume-label">{group.title}</h3>
								<ul className="np-classified-list">
									{group.items.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</Reveal>
						))}
					</section>
				</aside>
			</div>
		</article>
	);
}
