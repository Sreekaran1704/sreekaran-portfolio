import { articlesData } from '../../data/articlesData';

function ArticlesGrid() {
	return (
		<section className="py-10 sm:py-16">
			<div className="container mx-auto">
				<div className="mb-12 max-w-3xl">
					<h1 className="font-general-semibold text-4xl sm:text-5xl text-primary-dark dark:text-primary-light tracking-tight">
						Articles
					</h1>

					<p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
						Narrative-style technical writing on data, machine learning, LLMs,
						and applied AI. Small stories for big systems.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{articlesData.map((article) => (
						<article
							key={article.id}
							className="glass-card group flex h-full flex-col overflow-hidden rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
						>
							<div className="h-56 w-full overflow-hidden">
								<img
									src={article.image}
									alt={article.title}
									className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>

							<div className="flex flex-1 flex-col p-7">
								<p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
									{article.year} <span className="mx-2">•</span>{' '}
									{article.readTime}
								</p>

								<h2 className="font-general-semibold text-2xl leading-snug text-primary-dark dark:text-primary-light">
									{article.title}
								</h2>

								<p className="mt-4 text-lg italic leading-relaxed text-gray-500 dark:text-gray-400">
									{article.subtitle}
								</p>

								<p className="mt-5 flex-1 text-base leading-relaxed text-gray-600 dark:text-gray-300">
									{article.description}
								</p>

								<div className="mt-6 flex flex-wrap gap-2">
									{article.tags.map((tag) => (
										<span
											key={tag}
											className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 dark:bg-white/10 dark:text-gray-300"
										>
											{tag}
										</span>
									))}
								</div>

								<a
									href={article.url}
									target={article.url !== '#' ? '_blank' : undefined}
									rel={article.url !== '#' ? 'noopener noreferrer' : undefined}
									className="mt-8 inline-flex w-fit text-base font-semibold text-indigo-500 duration-300 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200"
								>
									Read on LinkedIn →
								</a>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export default ArticlesGrid;