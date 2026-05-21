import Link from 'next/link';

function ProjectSingle({ title, url, githubUrl, category, ProjectInfo }) {
	const techs = ProjectInfo?.Technologies?.[0]?.techs || [];
	const shortDescription =
		ProjectInfo?.ObjectivesDetails ||
		'A selected project focused on data, machine learning, applied AI, or cloud systems.';

	return (
		<div className="glass-card group flex h-full flex-col justify-between rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
			<div>
				<p className="mb-4 inline-flex rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
					{category}
				</p>

				<h3 className="font-general-semibold mb-5 text-2xl leading-snug text-primary-dark dark:text-primary-light">
					{title}
				</h3>

				<p className="font-general-regular mb-6 text-base leading-relaxed text-gray-600 dark:text-gray-300">
					{shortDescription}
				</p>

				<div className="mb-7 flex flex-wrap gap-2">
					{techs.slice(0, 6).map((tech) => (
						<span
							key={tech}
							className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 dark:bg-white/10 dark:text-gray-300"
						>
							{tech}
						</span>
					))}
				</div>
			</div>

			<div className="flex flex-wrap gap-3">
				<Link
					href={`/projects/${url}`}
					className="font-general-medium inline-flex w-fit items-center rounded-full border border-gray-200 bg-white/70 px-5 py-3 text-base text-primary-dark transition-all duration-300 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-primary-light dark:hover:text-indigo-300"
					aria-label={`View details for ${title}`}
				>
					View Details →
				</Link>

				{githubUrl && githubUrl !== '#' && (
					<a
						href={githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="font-general-medium inline-flex w-fit items-center rounded-full bg-indigo-500 px-5 py-3 text-base text-white transition-all duration-300 hover:bg-indigo-600"
						aria-label={`View GitHub repository for ${title}`}
					>
						GitHub →
					</a>
				)}
			</div>
		</div>
	);
}

export default ProjectSingle;