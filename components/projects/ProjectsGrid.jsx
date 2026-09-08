import { useState } from 'react';
import ProjectSingle from './ProjectSingle';
import { projectsData } from '../../data/projectsData';

const FILTERS = [
	{ value: 'All', label: 'All' },
	{ value: 'Project', label: 'Projects' },
	{ value: 'Case Study', label: 'Case Studies' },
];

function ProjectsGrid() {
	const [activeFilter, setActiveFilter] = useState('All');

	const filteredProjects =
		activeFilter === 'All'
			? projectsData
			: projectsData.filter((project) => project.type === activeFilter);

	return (
		<section className="projects-notice-section px-6 py-16 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<div className="projects-heading-wrap">
					<h2 className="projects-heading">A few projects I did</h2>

					<p className="projects-intro">
						Questions I explored, things I built, and what the evidence taught me.
					</p>
				</div>

				<div
					className="projects-filter-row"
					role="group"
					aria-label="Filter projects"
				>
					{FILTERS.map(({ value, label }) => (
						<button
							key={value}
							type="button"
							onClick={() => setActiveFilter(value)}
							className={`projects-filter-btn${activeFilter === value ? ' projects-filter-btn-active' : ''}`}
							aria-pressed={activeFilter === value}
						>
							{label}
						</button>
					))}
				</div>

				<div className="projects-grid">
					{filteredProjects.map((project) => (
						<ProjectSingle key={project.id} {...project} />
					))}
				</div>
			</div>
		</section>
	);
}

export default ProjectsGrid;
