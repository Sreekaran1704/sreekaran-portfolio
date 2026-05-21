import { useRef } from 'react';
import { articlesData } from '../../data/articlesData';

function HomeArticlesCarousel() {
	const scrollRef = useRef(null);

	const scroll = (direction) => {
		if (!scrollRef.current) return;

		scrollRef.current.scrollBy({
			left: direction === 'left' ? -420 : 420,
			behavior: 'smooth',
		});
	};

	return (
		<section id="articles" className="py-10 sm:py-16">
			<div className="container mx-auto">
				<div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="font-general-semibold text-4xl sm:text-5xl text-primary-dark dark:text-primary-light tracking-tight">
							Articles
						</h2>

						<p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Narrative-style technical writing on data, machine learning, LLMs, and applied AI.
						</p>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => scroll('left')}
							className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/70 text-2xl text-primary-dark shadow-sm duration-300 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-primary-light"
							aria-label="Scroll articles left"
						>
							‹
						</button>

						<button
							type="button"
							onClick={() => scroll('right')}
							className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/70 text-2xl text-primary-dark shadow-sm duration-300 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-primary-light"
							aria-label="Scroll articles right"
						>
							›
						</button>
					</div>
				</div>

				<div
					ref={scrollRef}
					className="flex gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					{articlesData.map((article) => (
						<article
							key={article.id}
							className="glass-card group flex min-w-[330px] flex-col overflow-hidden rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:min-w-[390px] lg:min-w-[420px]"
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
									{article.year} <span className="mx-2">•</span> {article.readTime}
								</p>

								<h3 className="font-general-semibold text-2xl leading-snug text-primary-dark dark:text-primary-light">
									{article.title}
								</h3>

								<p className="mt-4 text-lg italic leading-relaxed text-gray-500 dark:text-gray-400">
									{article.subtitle}
								</p>

								<p className="mt-5 flex-1 text-base leading-relaxed text-gray-600 dark:text-gray-300">
									{article.description}
								</p>

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

export default HomeArticlesCarousel;