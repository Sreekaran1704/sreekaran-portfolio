import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { articlesData } from '../../data/articlesData';

function ArticlesGrid() {
	const scrollRef = useRef(null);

	function scrollArticles(direction) {
		if (!scrollRef.current) return;

		const scrollAmount = 380;

		scrollRef.current.scrollBy({
			left: direction === 'left' ? -scrollAmount : scrollAmount,
			behavior: 'smooth',
		});
	}

	return (
		<section className="hanging-articles-section px-6 py-16 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<div className="hanging-articles-top">
					<div className="hanging-articles-heading-wrap">
						<h1 className="hanging-articles-heading">A few things I wrote</h1>

						<p className="hanging-articles-intro">
							Narrative-style technical writing on data, machine learning, LLMs,
							and applied AI.
						</p>
					</div>

					<div className="hanging-articles-controls">
						<button
							type="button"
							className="hanging-scroll-btn"
							onClick={() => scrollArticles('left')}
							aria-label="Scroll articles left"
						>
							<FiChevronLeft />
						</button>

						<button
							type="button"
							className="hanging-scroll-btn"
							onClick={() => scrollArticles('right')}
							aria-label="Scroll articles right"
						>
							<FiChevronRight />
						</button>
					</div>
				</div>

				<div className="hanging-articles-scroll" ref={scrollRef}>
					<div className="hanging-articles-track">
						{articlesData.map((article, index) => (
							<div
								key={article.id}
								className={`hanging-article hanging-article-${(index % 5) + 1}`}
							>
								<div className="hanger-clip">
									<span />
									<span />
								</div>

								<div className="hanger-connector" />

								<article className="hanging-article-card">
									<div className="hanging-article-meta">
										<span>{article.year}</span>
										<span>{article.readTime}</span>
									</div>

									<h2 className="hanging-article-title">{article.title}</h2>

									<p className="hanging-article-subtitle">
										{article.subtitle}
									</p>

									<p className="hanging-article-description">
										{article.description}
									</p>

									<div className="hanging-article-tags">
										{article.tags.slice(0, 5).map((tag) => (
											<span key={tag}>{tag}</span>
										))}
									</div>

									<a
										href={article.url}
										target={article.url !== '#' ? '_blank' : undefined}
										rel={article.url !== '#' ? 'noopener noreferrer' : undefined}
										className="hanging-article-read-link"
									>
										Read on LinkedIn →
									</a>
								</article>
							</div>
						))}
					</div>
				</div>

				<p className="hanging-scroll-hint">Drag sideways or use the buttons →</p>
			</div>
		</section>
	);
}

export default ArticlesGrid;