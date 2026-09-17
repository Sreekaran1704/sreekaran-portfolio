import SectionHead from '../shared/SectionHead';
import Reveal from '../shared/Reveal';
import { articlesData } from '../../data/articlesData';

function ArticlesGrid() {
	return (
		<div className="np-wrap np-section">
			<SectionHead
				section="Section C · Opinion & Essays"
				page="Page C1"
				title="A few things I wrote"
				dek="Narrative-style technical writing on data, machine learning, LLMs, and applied AI."
			/>

			<div className="np-essays">
				{articlesData.map((article, index) => {
					const external = article.url !== '#';
					return (
						<Reveal as="article" key={article.id} delay={(index % 3) * 0.07} className="np-essay">
							<p className="np-kicker">
								{article.category} · {article.year} · {article.readTime}
							</p>

							<h3 className="np-story-headline">{article.title}</h3>

							<p className="np-essay-sub">{article.subtitle}</p>

							<p className="np-story-summary">{article.description}</p>

							<p className="np-filed">
								<span>Filed under</span> {article.tags.slice(0, 5).join(' · ')}
							</p>

							<div className="np-story-links">
								<a
									href={article.url}
									target={external ? '_blank' : undefined}
									rel={external ? 'noopener noreferrer' : undefined}
								>
									Read on LinkedIn →
								</a>
							</div>
						</Reveal>
					);
				})}
			</div>
		</div>
	);
}

export default ArticlesGrid;
