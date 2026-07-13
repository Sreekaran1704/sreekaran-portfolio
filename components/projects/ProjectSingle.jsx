import Link from 'next/link';

function getProjectMetric(title, category) {
	if (title.includes('Story')) {
		return {
			metric: 'QLoRA',
			note: 'genre-controlled story generation',
		};
	}

	if (title.includes('Readmission')) {
		return {
			metric: '100K+',
			note: 'hospital records studied',
		};
	}

	if (title.includes('Vehicle')) {
		return {
			metric: 'MLOps',
			note: 'DVC, FastAPI, AWS pipeline',
		};
	}

	if (title.includes('RecommenderX')) {
		return {
			metric: 'Cloud',
			note: 'movie SaaS with AI support',
		};
	}

	if (title.includes('Student')) {
		return {
			metric: 'EDA',
			note: 'student performance insights',
		};
	}

	return {
		metric: category,
		note: 'applied analytics project',
	};
}

function ProjectSingle({ title, url, githubUrl, category, ProjectInfo, cardIndex = 0 }) {
	const techs = ProjectInfo?.Technologies?.[0]?.techs || [];

	const shortDescription =
		ProjectInfo?.ObjectivesDetails ||
		'A selected project focused on data, machine learning, applied AI, or cloud systems.';

	const { metric, note } = getProjectMetric(title, category);

	return (
		<article className={`notice-project-card notice-project-card-${(cardIndex % 5) + 1}`}>
			<div className="notice-pin" />

			<div className="notice-category-tag">{category}</div>

			<h3 className="notice-project-title">{title}</h3>

			<p className="notice-project-description">{shortDescription}</p>

			<div className="notice-project-impact">
				<strong>{metric}</strong>
				<span>{note}</span>
			</div>

			<div className="notice-tech-list">
				{techs.slice(0, 5).map((tech) => (
					<span key={tech}>{tech}</span>
				))}
			</div>

			<div className="notice-project-actions">
				<Link
					href={`/projects/${url}`}
					className="notice-link-btn"
					aria-label={`View details for ${title}`}
				>
					View Details →
				</Link>

				{githubUrl && githubUrl !== '#' && (
					<a
						href={githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="notice-link-btn notice-link-outline"
						aria-label={`View GitHub repository for ${title}`}
					>
						GitHub →
					</a>
				)}
			</div>
		</article>
	);
}

export default ProjectSingle;