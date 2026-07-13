import ProjectSingle from './ProjectSingle';
import { projectsData } from '../../data/projectsData';

function ProjectsGrid() {
	return (
		<section className="projects-notice-section px-6 py-16 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<div className="projects-heading-wrap">
					<h1 className="projects-heading">A few projects I did</h1>

					<p className="projects-intro">
						A small collection of analytics, applied AI, cloud, and machine learning work.
					</p>
				</div>

				<div className="notice-board">
					<div className="notice-board-inner">
						{projectsData.map((project, index) => (
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