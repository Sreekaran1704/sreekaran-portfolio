import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { articlesData } from '../../data/articlesData';

const LEAF_COLORS = ['#6f8161', '#7c8d6a', '#5f7355'];
const VINE_STROKE = '#5f7355';

// One small leaf sprig branching off the winding vine stem.
function LeafSprig({ x, y, side, colorIndex }) {
	const sideAngle = side === 1 ? 30 : -30;
	const color = LEAF_COLORS[colorIndex % LEAF_COLORS.length];

	return (
		<svg
			className="hanging-twig"
			width="24"
			height="24"
			viewBox="-12 -19 24 24"
			style={{
				left: `${x}px`,
				top: `calc(0.95rem + 8px + ${y}px)`,
				transform: `translateY(-50%) rotate(${sideAngle}deg)`,
			}}
			aria-hidden="true"
		>
			<path d="M 0,0 L 0,6" stroke="#6b6448" strokeWidth="1" strokeLinecap="round" />
			<path d="M 0,0 Q -3.6,-7 0,-13 Q 3.6,-7 0,0 Z" fill={color} opacity="0.85" />
		</svg>
	);
}

// The climbing vine itself: a single, gentle wave draped along the string
// (not a tight coil, which reads as busy/mechanical rather than plant-like).
function VineStem({ d }) {
	const pad = VINE_AMPLITUDE + 4;
	const width = stringEnd - stringStart;

	return (
		<svg
			className="hanging-vine-stem"
			width={width}
			height={pad * 2}
			viewBox={`${stringStart} ${-pad} ${width} ${pad * 2}`}
			style={{ left: stringStart }}
			aria-hidden="true"
		>
			<path d={d} fill="none" stroke={VINE_STROKE} strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
		</svg>
	);
}

// String spans from -4rem to (track width + 4rem).
const ARTICLE_WIDTH = 340;
const ARTICLE_GAP = 32;
const TRACK_PADDING_X = 3.2;
const STRING_OVERHANG = 64;

// A wide, shallow wave reads as a relaxed vine draped along the string;
// tight/small wavelengths look like a coiled wire instead of a plant.
const VINE_WAVELENGTH = 100;
const VINE_AMPLITUDE = 10;
const VINE_SAMPLE_STEP = 6;
// One leaf per coil turn (peaks land ~50px apart at this wavelength).
const LEAF_PEAK_STEP = 1;

const trackWidth =
	TRACK_PADDING_X * 2 + articlesData.length * ARTICLE_WIDTH + (articlesData.length - 1) * ARTICLE_GAP;
const stringStart = -STRING_OVERHANG;
const stringEnd = trackWidth + STRING_OVERHANG;

function vineOffset(x) {
	// Rounded to avoid a hydration mismatch: Math.sin can differ in its last
	// floating-point digit between server and client JS engines.
	const raw = VINE_AMPLITUDE * Math.sin((2 * Math.PI * (x - stringStart)) / VINE_WAVELENGTH);
	return Math.round(raw * 1000) / 1000;
}

function buildVinePath() {
	const steps = Math.round((stringEnd - stringStart) / VINE_SAMPLE_STEP);
	let d = '';
	for (let i = 0; i <= steps; i++) {
		const x = stringStart + i * VINE_SAMPLE_STEP;
		d += i === 0 ? `M ${x} ${vineOffset(x)}` : ` L ${x} ${vineOffset(x)}`;
	}
	return d;
}

const vinePathD = buildVinePath();

const vinePeakSpacing = VINE_WAVELENGTH / 2;
const totalVinePeaks = Math.floor((stringEnd - stringStart) / vinePeakSpacing);
const leafSprigs = [];
for (let peak = 0, i = 0; peak <= totalVinePeaks; peak += LEAF_PEAK_STEP, i++) {
	leafSprigs.push({
		x: stringStart + vinePeakSpacing * (peak + 0.5),
		y: peak % 2 === 0 ? VINE_AMPLITUDE : -VINE_AMPLITUDE,
		side: i % 2,
		colorIndex: i,
	});
}

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
						<VineStem d={vinePathD} />

						{leafSprigs.map((sprig, i) => (
							<LeafSprig key={i} x={sprig.x} y={sprig.y} side={sprig.side} colorIndex={sprig.colorIndex} />
						))}

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