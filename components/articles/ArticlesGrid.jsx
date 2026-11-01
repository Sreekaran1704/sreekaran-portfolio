import { useRef, useState } from 'react';
import PhoneShowAll from '../shared/PhoneShowAll';
import SectionHead from '../shared/SectionHead';
import Reveal from '../shared/Reveal';
import { articlesData } from '../../data/articlesData';

// How many essays a phone shows first; mobile.css hides the rest until expanded.
const PHONE_PREVIEW = 3;

function ArticlesGrid() {
	const [expanded, setExpanded] = useState(false);
	const listRef = useRef(null);

	return (
		<div className="np-wrap np-section">
			<SectionHead
				section="Section C · Opinion & Essays"
				page="Page C1"
				title="A few things I wrote"
				dek="Narrative-style technical writing on data, machine learning, LLMs, and applied AI."
			/>

			<div ref={listRef} className={`np-essays ${expanded ? '' : 'is-phone-collapsed'}`}>
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
									aria-label={`Read on LinkedIn: ${article.title}${external ? ' (opens in a new tab)' : ''}`}
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

			{!expanded && (
				<PhoneShowAll
					total={articlesData.length}
					preview={PHONE_PREVIEW}
					label={`Show all ${articlesData.length} essays`}
					listRef={listRef}
					onExpand={() => setExpanded(true)}
				/>
			)}
		</div>
	);
}

export default ArticlesGrid;
