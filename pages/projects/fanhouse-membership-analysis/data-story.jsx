import Link from 'next/link';
import PagesMetaHead from '../../../components/PagesMetaHead';

function FanHouseDataStory() {
	return (
		<div className="fh-page project-detail-page px-6 py-8 sm:px-10 lg:px-16">
			<PagesMetaHead
				title="The $42 Illusion: A FanHouse Data Story"
				description="A data story about a number that was almost entirely wrong, and what it took to find that out."
				keywords="data story, causal inference, A/B testing, self-selection bias, membership program, portfolio project"
			/>

			<div className="mx-auto max-w-4xl">
				<Link href="/projects" className="project-detail-back-btn mt-8">
					← Back to Projects
				</Link>

				<nav className="fh-version-switch mt-6" aria-label="Versions of this write-up">
					<span className="fh-version-switch-label">Three ways to read this</span>
					<span className="fh-version-switch-options">
						<Link href="/projects/fanhouse-membership-analysis" className="fh-version-pill">
							Plain language
						</Link>
						<span className="fh-version-pill fh-version-pill-current" aria-current="page">
							Data story
						</span>
						<Link href="/projects/fanhouse-membership-analysis/technical" className="fh-version-pill">
							Technical
						</Link>
					</span>
				</nav>

				<header className="fh-hero mt-6">
					<span className="fh-eyebrow">Data Story</span>
					<h1 className="fh-hero-title">The $42 Illusion</h1>
					<p className="fh-hero-lede">
						A data story about a number that was almost entirely wrong, and what it took
						to find that out.
					</p>

					<div className="fh-hero-stats">
						<div className="fh-hero-stat">
							<span className="fh-hero-stat-value">$42</span>
							<span className="fh-hero-stat-label">the gap that looked like the answer</span>
						</div>
						<div className="fh-hero-stat">
							<span className="fh-hero-stat-value">$5<span className="fh-hero-stat-unit">/qtr</span></span>
							<span className="fh-hero-stat-label">what randomization actually showed</span>
						</div>
						<div className="fh-hero-stat">
							<span className="fh-hero-stat-value">80%</span>
							<span className="fh-hero-stat-label">of that gap was never membership at all</span>
						</div>
					</div>

					<p className="fh-hero-byline">By Sreekaran Reddy Ramasahayam</p>
				</header>

				<section className="fh-section">
					<span className="fh-eyebrow">The Question</span>
					<p className="fh-lede">I asked a simple question. The answer got complicated.</p>
					<p>
						The question was: does a membership program actually make a retailer more money,
						once you count what it costs to run?
					</p>
					<p>
						The retailer in this story is FanHouse, a fan-apparel chain: jerseys and
						hats and game-day gear, 325 stores plus an online storefront. (FanHouse is
						fictional, and I&rsquo;ll say plainly up front that everything downstream ran on
						synthetic data built for this project, not a real company&rsquo;s books. But the
						pattern in this story is one I&rsquo;ve since learned to recognize everywhere,
						and that&rsquo;s the actual point of writing it down.)
					</p>
					<p>
						The proposal on the table: a $99-a-year or $9.99-a-month membership. A modest
						discount, some cashback-style credit, early access to new drops. Nothing exotic.
						The kind of program half the retailers you shop at already run.
					</p>
					<p>
						The question underneath it wasn&rsquo;t &ldquo;will people like it.&rdquo; It was
						narrower and more honest than that: will the extra revenue outweigh what gets
						given back at checkout? A discount is a real cost. Credit issued is a real
						liability the moment it&rsquo;s promised, whether or not anyone ever redeems it. A
						membership program can look like a hit and still be a loss dressed up in good PR.
					</p>
					<p>So I went looking for the number that would settle it.</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">The First Answer</span>
					<h2>The first number I found was spectacular.</h2>
					<p>
						Line up members against non-members, and it wasn&rsquo;t close. Non-members spent
						$20.67 a quarter on average. Members spent $63.08. A $42 gap. Members were
						spending nearly three times as much.
					</p>

					<div className="fh-verdict-grid">
						<div className="fh-verdict-card">
							<span className="fh-verdict-card-label">Non-members</span>
							<span className="fh-verdict-card-value">$20.67</span>
							<span className="fh-verdict-card-sub">average quarterly revenue</span>
						</div>
						<div className="fh-verdict-card">
							<span className="fh-verdict-card-label">Members</span>
							<span className="fh-verdict-card-value">$63.08</span>
							<span className="fh-verdict-card-sub">average quarterly revenue</span>
						</div>
					</div>

					<p>
						If that number were real, this would&rsquo;ve been a short story. Launch the
						program everywhere, as fast as the rollout would allow, write the memo, done.
					</p>
					<p>
						It wasn&rsquo;t real. Or rather, it was real, but it wasn&rsquo;t{' '}
						<em>membership</em>.
					</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">The Catch</span>
					<h2>
						Here&rsquo;s the problem with comparing members to non-members: nobody assigned
						people to be members.
					</h2>
					<p>
						People chose. And the people who choose to pay $99 upfront for a shopping discount
						are, disproportionately, people who were already the store&rsquo;s biggest
						fans: the ones who were going to spend more <em>anyway</em>, program or not.
					</p>
					<p>
						So some unknown share of that $42 gap wasn&rsquo;t the program working. It was
						just who showed up to the sign-up page.
					</p>

					<div className="fh-insight">
						<span className="fh-insight-tag">Why this matters</span>
						<p>
							This is one of the oldest traps in measuring anything: comparing people who
							opted in against people who didn&rsquo;t isn&rsquo;t a measurement of your
							program. It&rsquo;s a mirror reflecting who already loved you.
						</p>
					</div>

					<p>
						To find the real number, I needed a test where joining wasn&rsquo;t a decision
						being made by exactly the kind of person likely to spend more regardless of what
						was on offer.
					</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">The Clean Test</span>
					<h2>So I ran it the way you&rsquo;re supposed to.</h2>
					<p>
						Online, instead of letting people choose whether to see the offer, FanHouse
						randomly decided who even saw it. Half of shoppers got shown the membership
						pitch, half didn&rsquo;t, before anyone had a chance to self-select into anything.
						In physical stores, a cashier can&rsquo;t hide an offer from one customer and show
						it to the next, so the randomization moved up a level: whole stores were randomly
						assigned to either push membership at checkout or not.
					</p>
					<p>
						Once you&rsquo;ve done that, every remaining difference between the two groups can
						only be explained by one thing: whether they got the offer. That&rsquo;s
						what makes the next number trustworthy in a way the first one wasn&rsquo;t.
					</p>

					<div className="fh-verdict-grid">
						<div className="fh-verdict-card">
							<span className="fh-verdict-card-label">Online, per customer</span>
							<span className="fh-verdict-card-value">$3.73&ndash;$5.00</span>
							<span className="fh-verdict-card-sub">real lift per quarter</span>
						</div>
						<div className="fh-verdict-card">
							<span className="fh-verdict-card-label">In stores, per customer</span>
							<span className="fh-verdict-card-value">$3.40&ndash;$5.94</span>
							<span className="fh-verdict-card-sub">real lift per quarter</span>
						</div>
					</div>

					<p className="fh-lede">Call it roughly five dollars. Not forty-two. Five.</p>

					<div className="fh-insight">
						<span className="fh-insight-tag">The turn</span>
						<p>
							Eight-tenths of that original gap was never about membership at all. It was
							about who joins. That&rsquo;s not a footnote you mention on the way to the
							real finding. It <em>is</em> the finding, if you&rsquo;d stopped at the first
							number and never checked it.
						</p>
					</div>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">A Second Route</span>
					<h2>What if the clean test had never been an option?</h2>
					<p>
						I wanted to know if that first, misleading path was recoverable without a
						randomized test, because most real situations don&rsquo;t come with the
						luxury of one. A program is often already live by the time anyone thinks to
						measure it properly. So as a second exercise, I tried two independent statistical
						techniques on the messy, self-selected version of the data: one that pairs up
						similar customers who did and didn&rsquo;t join, another that tracks each
						person&rsquo;s own change over time, before and after.
					</p>
					<p>
						Neither knew about the other&rsquo;s answer. They landed in the same place
						anyway: around $32 to $33.
					</p>
					<p>
						Not the panicked $42. Not the modest $5 either. Something in between, and stable
						across two methods that had no reason to agree with each other unless they were
						onto something real.
					</p>

					<figure className="fh-chart-figure">
						<svg viewBox="0 0 640 268" className="fh-chart" role="img" aria-labelledby="fh-ds-chart-title fh-ds-chart-desc">
							<title id="fh-ds-chart-title">Three estimates of the same program</title>
							<desc id="fh-ds-chart-desc">
								The naive member-versus-non-member gap is $42.41. The randomized lift is
								$3.73 to $5.00 per customer per quarter. The two observational methods land
								at roughly $32 to $33.
							</desc>

							<line x1="190" y1="26" x2="190" y2="228" className="fh-chart-axis" />
							<line x1="190" y1="228" x2="600" y2="228" className="fh-chart-axis" />

							<line x1="326" y1="26" x2="326" y2="228" className="fh-chart-grid" />
							<line x1="463" y1="26" x2="463" y2="228" className="fh-chart-grid" />
							<line x1="600" y1="26" x2="600" y2="228" className="fh-chart-grid" />
							<text x="190" y="248" className="fh-chart-tick" textAnchor="middle">$0</text>
							<text x="326" y="248" className="fh-chart-tick" textAnchor="middle">$15</text>
							<text x="463" y="248" className="fh-chart-tick" textAnchor="middle">$30</text>
							<text x="600" y="248" className="fh-chart-tick" textAnchor="middle">$45</text>

							<g>
								<rect x="190" y="40" width="387" height="34" className="fh-bar-warn" />
								<text x="182" y="54" className="fh-chart-label" textAnchor="end">The naive gap</text>
								<text x="182" y="69" className="fh-chart-group-label" textAnchor="end">members vs. non-members</text>
								<text x="587" y="62" className="fh-chart-value" textAnchor="start">$42.41</text>
							</g>

							<g>
								<rect x="190" y="110" width="40" height="34" className="fh-bar-good" />
								<text x="182" y="124" className="fh-chart-label" textAnchor="end">The randomized lift</text>
								<text x="182" y="139" className="fh-chart-group-label" textAnchor="end">everyone who saw the offer</text>
								<text x="240" y="132" className="fh-chart-value" textAnchor="start">$3.73&ndash;$5.00</text>
							</g>

							<g>
								<rect x="190" y="180" width="301" height="34" className="fh-bar-treatment" />
								<text x="182" y="194" className="fh-chart-label" textAnchor="end">Matching &amp; before/after</text>
								<text x="182" y="209" className="fh-chart-group-label" textAnchor="end">people who actually joined</text>
								<text x="501" y="202" className="fh-chart-value" textAnchor="start">$32&ndash;$33</text>
							</g>
						</svg>
						<figcaption>
							Three numbers, one program. Only the middle bar comes from an experiment
							where nobody chose their own group, and it is the smallest of the three by
							an order of magnitude.
						</figcaption>
					</figure>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">Two Right Numbers</span>
					<h2>At first that felt like a contradiction. It isn&rsquo;t one.</h2>
					<p>
						The five-dollar number describes what happens if FanHouse rolls the program out
						broadly. It already includes everyone who sees the pitch and shrugs and moves
						on. The thirty-two-dollar number describes something narrower: for someone
						who actually joins and uses the program, how much more do they spend compared to a
						similar person who didn&rsquo;t.
					</p>
					<p>
						A finance team modeling next year&rsquo;s revenue should use the five, because
						it&rsquo;s the honest, diluted, company-wide number. A product team asking
						&ldquo;does this program genuinely change behavior for the people it reaches&rdquo;
						should use the thirty-two. Neither number is wrong. They&rsquo;re answers to two
						different questions that happen to share a headline.
					</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">The Verdict</span>
					<h2>Scaled up to FanHouse&rsquo;s actual footprint</h2>
					<p className="fh-lede">
						Every store, every online customer, a full year: the honest number is
						somewhere between <strong>$11.6 million and $19.9 million annually</strong>,
						already net of every discount and dollar of credit given away. Real money, hiding
						behind a badly-asked first question.
					</p>
					<p>
						There was one loose thread the headline number doesn&rsquo;t tell you. The monthly
						plan ($9.99, cancel anytime) has an 88% one-month cancellation rate.
						People aren&rsquo;t behaving like subscribers. They&rsquo;re behaving like someone
						who bought a one-time coupon and left. The annual plan does the opposite: people
						who choose it stay measurably more engaged, months later. If anything about this
						program deserves a redesign, it isn&rsquo;t whether to launch it. It&rsquo;s what
						to do about the plan nobody&rsquo;s actually subscribing to.
					</p>

					<div className="fh-insight fh-insight-final">
						<span className="fh-insight-tag">Bottom line</span>
						<p>
							Launch it. The revenue case is real, and the odds it&rsquo;s a fluke are close
							to zero. Just don&rsquo;t stop watching the monthly plan. It&rsquo;s the one
							part of this story that isn&rsquo;t finished.
						</p>
					</div>
				</section>

				<p className="fh-synthetic-note mb-10">
					This is a synthetic-data causal inference project built to practice the discipline of
					checking a headline number before believing it. The randomized experiment design,
					the propensity score matching, the difference-in-differences check, and every
					statistical test behind these numbers are written up in the{' '}
					<Link href="/projects/fanhouse-membership-analysis/technical" style={{ color: '#312e81' }}>
						technical write-up
					</Link>
					.
				</p>
			</div>
		</div>
	);
}

export default FanHouseDataStory;
