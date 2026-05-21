import ProjectSingle from './ProjectSingle';
import { projectsData } from '../../data/projectsData';

function ProjectsGrid() {
	return (
		<section className="py-8 sm:py-14 mt-6 sm:mt-10">
			<div className="text-center max-w-3xl mx-auto">
				<p className="font-general-semibold text-3xl sm:text-5xl mb-4 text-primary-dark dark:text-primary-light tracking-tight">
					Featured Work
				</p>

				<p className="font-general-regular text-base sm:text-xl leading-relaxed text-gray-600 dark:text-gray-300">
					A selected collection of applied AI, data science, cloud, and MLOps projects.
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 sm:mt-14 gap-6">
				{projectsData.map((project) => (
					<ProjectSingle key={project.id} {...project} />
				))}
			</div>
		</section>
	);
}

export default ProjectsGrid;