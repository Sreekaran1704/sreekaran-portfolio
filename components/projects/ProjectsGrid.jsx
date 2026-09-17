import { useState } from 'react';
import ProjectSingle from './ProjectSingle';
import SectionHead from '../shared/SectionHead';
import { projectsData } from '../../data/projectsData';
import { projectNotes } from '../../data/projectNotes';

const FILTERS = [
	{ value: 'All', label: 'All' },
	{ value: 'Project', label: 'Projects' },
	{ value: 'Case Study', label: 'Case Studies' },
];

const isFeatured = (project) => Boolean(projectNotes[project.url]?.featured);

// Write-ups lead the section; the rest follow in data order. Numbers are fixed
// to this order, so a story keeps its number whichever filter is on.
const ordered = [
	...projectsData.filter(isFeatured),
	...projectsData.filter((project) => !isFeatured(project)),
].map((project, index) => ({ ...project, number: String(index + 1).padStart(2, '0') }));

const countFor = (value) =>
	value === 'All' ? ordered.length : ordered.filter((p) => p.type === value).length;

// Where each card sits in the wide layout: write-ups run two to a row, the
// rest three to a row, all in one grid. A row of briefs is told it starts a
// row, so it never tucks in beside a lone write-up.
function layoutFor(projects) {
	let featured = 0;
	let brief = 0;

	return projects.map((project) => {
		if (isFeatured(project)) {
			const col = featured % 2;
			featured += 1;
			return { project, col, rowStart: col === 0 };
		}
		const col = brief % 3;
		brief += 1;
		return { project, col, rowStart: col === 0 };
	});
}

function ProjectsGrid() {
	const [activeFilter, setActiveFilter] = useState('All');

	const visible =
		activeFilter === 'All'
			? ordered
			: ordered.filter((project) => project.type === activeFilter);

	return (
		<div className="np-wrap np-section">
			<SectionHead
				section="Section B · Investigations"
				page="Page B1"
				title="Projects & Case Studies"
				dek="Questions I explored, things I built, and what the evidence taught me."
			/>

			<div className="np-projects-bar">
				<p className="np-projects-count" aria-live="polite">
					Showing {visible.length} of {ordered.length}
				</p>

				<div className="np-filter" role="group" aria-label="Filter projects">
					{FILTERS.map(({ value, label }) => (
						<button
							key={value}
							type="button"
							onClick={() => setActiveFilter(value)}
							className={activeFilter === value ? 'is-active' : ''}
							aria-pressed={activeFilter === value}
						>
							{label}
							<span className="np-filter-count">{countFor(value)}</span>
						</button>
					))}
				</div>
			</div>

			<div className="np-story-grid">
				{layoutFor(visible).map(({ project, col, rowStart }) => (
					<ProjectSingle
						key={project.id}
						index={col}
						rowStart={rowStart}
						{...project}
					/>
				))}
			</div>
		</div>
	);
}

export default ProjectsGrid;
