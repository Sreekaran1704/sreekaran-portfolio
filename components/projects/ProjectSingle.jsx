import Link from 'next/link';

function getProjectMetric(title, category) {
	if (title.includes('FanHouse')) {
		return {
			metric: '$5 vs $42',
			note: 'True causal lift vs. naive comparison',
		};
	}

	if (title.includes('Story')) {
		return {
			metric: '39.8%',
			note: 'Perplexity Reduction with QLoRA',
		};
	}

	if (title.includes('Readmission')) {
		return {
			metric: 'XGBoost + RAG',
			note: 'Explainable readmission forecasting',
		};
	}

	if (title.includes('Vehicle')) {
		return {
			metric: 'MLOps',
			note: 'Vehicle Insurance Prediction API',
		};
	}

	if (title.includes('RecommenderX')) {
		return {
			metric: 'Cloud SaaS',
			note: 'Personalized Movie Recommendation App',
		};
	}

	if (title.includes('Student')) {
		return {
			metric: 'EDA',
			note: 'student performance insights',
		};
	}

	if (title.includes('Market Pulse')) {
		return {
			metric: 'Daily',
			note: 'Automated live job market pipeline',
		};
	};

	return {
		metric: 'LogReg',
		note: 'Best Student Outcome Classifier',
	}
}

function ProjectSingle({ title, url, githubUrl, liveUrl, category, ProjectInfo, cardIndex = 0 }) {
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

				{liveUrl && liveUrl !== '#' && (
					<a
						href={liveUrl}
						target='_blank'
						rel="noopener noreferrer"
						className="notice-link-btn notice-link-outline"
						aria-label={`View live site for ${title}`}
					>
						Live Site →
					</a>

				)
				}

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