import { FiClock, FiTag } from 'react-icons/fi';
import PagesMetaHead from '../../components/PagesMetaHead';
import { projectsData } from '../../data/projectsData';
import Link from 'next/link';

function ProjectSingle(props) {
	return (
		<div className="container mx-auto">
			<PagesMetaHead title={props.project.title} />

			<Link
				href="/projects"
			className="font-general-medium mt-8 inline-flex rounded-full border border-gray-200 bg-white/70 px-5 py-3 text-base text-primary-dark transition-all duration-300 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-primary-light dark:hover:text-indigo-300"
			>
			← Back to Projects
			</Link>

			{/* Header */}
			<div className="glass-card mt-14 sm:mt-20 rounded-3xl p-8 sm:p-10">
				<p className="font-general-semibold text-left text-3xl sm:text-5xl text-primary-dark dark:text-primary-light mb-7 tracking-tight leading-tight">
					{props.project.ProjectHeader.title}
				</p>

				<div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
					<div className="flex items-center">
						<FiClock className="text-xl text-gray-500 dark:text-gray-300" />
						<span className="font-general-regular ml-2 leading-none text-gray-600 dark:text-gray-300">
							{props.project.ProjectHeader.publishDate}
						</span>
					</div>

					<div className="flex items-center">
						<FiTag className="w-4 h-4 text-gray-500 dark:text-gray-300" />
						<span className="font-general-regular ml-2 leading-none text-gray-600 dark:text-gray-300">
							{props.project.ProjectHeader.tags}
						</span>
					</div>
				</div>

				{props.project.githubUrl && props.project.githubUrl !== '#' && (
					<a
						href={props.project.githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="font-general-medium mt-8 inline-flex w-fit items-center rounded-full bg-indigo-500 px-5 py-3 text-base text-white transition-all duration-300 hover:bg-indigo-600"
						aria-label={`View GitHub repository for ${props.project.title}`}
					>
						View GitHub →
					</a>
				)}
			</div>

			{/* Info */}
			<div className="block sm:flex gap-0 sm:gap-10 mt-14">
				<div className="w-full sm:w-1/3 text-left">
					{/* Project overview details */}
					<div className="glass-card mb-7 rounded-3xl p-6">
						<p className="font-general-semibold text-2xl text-secondary-dark dark:text-secondary-light mb-4">
							{props.project.ProjectInfo.ClientHeading}
						</p>

						<ul className="leading-loose">
							{props.project.ProjectInfo.CompanyInfo.map((info) => (
								<li
									className="font-general-regular text-ternary-dark dark:text-ternary-light"
									key={info.id}
								>
									<span className="font-semibold">{info.title}: </span>
									<span>{info.details}</span>
								</li>
							))}
						</ul>
					</div>

					{/* Project objective */}
					<div className="glass-card mb-7 rounded-3xl p-6">
						<p className="font-general-semibold text-2xl text-ternary-dark dark:text-ternary-light mb-4">
							{props.project.ProjectInfo.ObjectivesHeading}
						</p>

						<p className="font-general-regular text-primary-dark dark:text-ternary-light leading-relaxed">
							{props.project.ProjectInfo.ObjectivesDetails}
						</p>
					</div>

					{/* Technologies */}
					<div className="glass-card mb-7 rounded-3xl p-6">
						<p className="font-general-semibold text-2xl text-ternary-dark dark:text-ternary-light mb-4">
							{props.project.ProjectInfo.Technologies[0].title}
						</p>

						<div className="flex flex-wrap gap-2">
							{props.project.ProjectInfo.Technologies[0].techs.map((tech) => (
								<span
									key={tech}
									className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 dark:bg-white/10 dark:text-gray-300"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* Project details */}
				<div className="w-full sm:w-2/3 text-left mt-10 sm:mt-0">
					<div className="glass-card rounded-3xl p-8">
						<p className="font-general-semibold text-primary-dark dark:text-primary-light text-2xl sm:text-3xl mb-7">
							{props.project.ProjectInfo.ProjectDetailsHeading}
						</p>

						<div className="space-y-5">
							{props.project.ProjectInfo.ProjectDetails.map((details) => (
								<p
									key={details.id}
									className="font-general-regular text-lg leading-relaxed text-ternary-dark dark:text-ternary-light"
								>
									{details.details}
								</p>
							))}
						</div>
					</div>
				</div>
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