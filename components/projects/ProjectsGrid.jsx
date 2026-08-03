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
					<h1 className="projects-heading">A few projects I did</h1>

					<p className="projects-intro">
						A small collection of analytics, applied AI, cloud, and machine learning work.
					</p>
				</div>

				<div className="projects-filter-row">
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

				<div className="notice-board">
					<div className="notice-board-inner">
						{filteredProjects.map((project, index) => (
							<ProjectSingle
								key={project.id}
								{...project}
								cardIndex={index}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default ProjectsGrid;