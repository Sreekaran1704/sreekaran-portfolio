import { FiClock, FiTag } from 'react-icons/fi';
import PagesMetaHead from '../../components/PagesMetaHead';
import { projectsData } from '../../data/projectsData';
import Link from 'next/link';

function ProjectSingle(props) {
	return (
		<div className="project-detail-page px-6 py-8 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<PagesMetaHead title={props.project.title} />

				<Link
					href="/projects"
					className="project-detail-back-btn mt-8"
				>
					← Back to Projects
				</Link>

				{/* Header */}
				<div className="project-detail-header mt-14 sm:mt-20 p-8 sm:p-10">
					<p className="project-detail-title text-3xl sm:text-5xl mb-7 tracking-tight leading-tight">
						{props.project.ProjectHeader.title}
					</p>

					<div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
						<div className="flex items-center">
							<FiClock className="text-xl project-detail-meta-icon" />
							<span className="project-detail-meta-text ml-2 leading-none">
								{props.project.ProjectHeader.publishDate}
							</span>
						</div>

						<div className="flex items-center">
							<FiTag className="w-4 h-4 project-detail-meta-icon" />
							<span className="project-detail-meta-text ml-2 leading-none">
								{props.project.ProjectHeader.tags}
							</span>
						</div>
					</div>

					<div className="flex flex-wrap gap-4 mt-8">
						{props.project.liveUrl && props.project.liveUrl !== '#' && (

							href = { props.project.liveUrl }
								target="_blank"
						rel="noopener noreferrer"
						className="notice-link-btn inline-flex w-fit items-center"
						aria-label={`View live site for ${props.project.title}`}
							>
						View Live Site →
					</a>
						)}

					{props.project.githubUrl && props.project.githubUrl !== '#' && (

						href = { props.project.githubUrl }
								target="_blank"
					rel="noopener noreferrer"
					className="notice-link-btn inline-flex w-fit items-center"
					aria-label={`View GitHub repository for ${props.project.title}`}
							>
					View GitHub →
				</a>
						)}
			</div>
		</div>

				{/* Info */ }
	<div className="block sm:flex gap-0 sm:gap-10 mt-14">
		<div className="w-full sm:w-1/3 text-left">
			{/* Project overview details */}
			<div className="project-detail-card mb-7 p-6">
				<p className="project-detail-card-heading text-2xl mb-4">
					{props.project.ProjectInfo.ClientHeading}
				</p>

				<ul className="leading-loose">
					{props.project.ProjectInfo.CompanyInfo.map((info) => (
						<li
							className="project-detail-info-item"
							key={info.id}
						>
							<span className="font-semibold">{info.title}: </span>
							<span>{info.details}</span>
						</li>
					))}
				</ul>
			</div>

			{/* Project objective */}
			<div className="project-detail-card mb-7 p-6">
				<p className="project-detail-card-heading text-2xl mb-4">
					{props.project.ProjectInfo.ObjectivesHeading}
				</p>

				<p className="project-detail-body leading-relaxed">
					{props.project.ProjectInfo.ObjectivesDetails}
				</p>
			</div>

			{/* Technologies */}
			<div className="project-detail-card mb-7 p-6">
				<p className="project-detail-card-heading text-2xl mb-4">
					{props.project.ProjectInfo.Technologies[0].title}
				</p>

				<div className="flex flex-wrap gap-2">
					{props.project.ProjectInfo.Technologies[0].techs.map((tech) => (
						<span
							key={tech}
							className="sticky-skill-chip"
						>
							{tech}
						</span>
					))}
				</div>
			</div>
		</div>

		{/* Project details */}
		<div className="w-full sm:w-2/3 text-left mt-10 sm:mt-0">
			<div className="project-detail-card p-8">
				<p className="project-detail-title text-2xl sm:text-3xl mb-7">
					{props.project.ProjectInfo.ProjectDetailsHeading}
				</p>

				<div className="space-y-5">
					{props.project.ProjectInfo.ProjectDetails.map((details) => (
						<p
							key={details.id}
							className="project-detail-body text-lg leading-relaxed"
						>
							{details.details}
						</p>
					))}
				</div>
			</div>
		</div>
	</div>
			</div >
		</div >
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