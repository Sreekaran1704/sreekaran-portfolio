import Link from 'next/link';
import PagesMetaHead from '../../../components/PagesMetaHead';

function FanHouseNonTechnical() {
	return (
		<div className="fh-page project-detail-page px-6 py-8 sm:px-10 lg:px-16">
			<PagesMetaHead
				title="Does Membership Pay for Itself? — FanHouse Case Study"
				description="A plain-language walk through a membership program analysis: the first answer, the catch, and what we actually know."
				keywords="A/B testing, causal inference, membership program, portfolio project"
			/>

			<div className="mx-auto max-w-4xl">
				<Link href="/projects" className="project-detail-back-btn mt-8">
					← Back to Projects
				</Link>

				<nav className="fh-version-switch mt-6" aria-label="Versions of this write-up">
					<span className="fh-version-switch-label">Three ways to read this</span>
					<span className="fh-version-switch-options">
						<span className="fh-version-pill fh-version-pill-current" aria-current="page">
							Plain language
						</span>
						<Link href="/projects/fanhouse-membership-analysis/data-story" className="fh-version-pill">
							Data story
						</Link>
						<Link href="/projects/fanhouse-membership-analysis/technical" className="fh-version-pill">
							Technical
						</Link>
					</span>
				</nav>

				<header className="fh-hero mt-6">
					<span className="fh-eyebrow">Hypothetical Case Study On A Membership Program</span>
					<h1 className="fh-hero-title">I asked a simple question. The answer got is complicated.</h1>
					<p className="fh-hero-lede">
						FanHouse, a fan-apparel retailer, wanted to know if a paid membership program
						would actually make it more money. The first answer looked spectacular. It was
						also almost entirely wrong but then this figuring out why turned into the real story.
					</p>
					<p className="fh-hero-byline">By Sreekaran · A/B Testing &amp; Causal Inference Project</p>
				</header>

				<section className="fh-section">
					<span className="fh-eyebrow">The Setup</span>
					<h2>A membership, like most retailers now have one</h2>
					<p>
						FanHouse sells jerseys, hats, and game-day gear online and across 325 stores.
						The idea on the table: a $99-a-year (or $9.99-a-month) membership that gives
						shoppers a discount, some cashback-style credit toward future purchases, and
						early access to new drops.
					</p>
					<p>
						Simple enough. But the question underneath it wasn&rsquo;t &ldquo;will people
						like it&rdquo; , it was <strong>&ldquo;will it make the company more
							money, once you count what it actually costs to run?&rdquo;</strong> Discounts
						and credits aren&rsquo;t free. The membership fee is real revenue, but it has to
						outweigh what gets given back at checkout, or the program is a net loss dressed
						up as a win.
					</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">The First Answer</span>
					<h2>Members spend nearly three times as much</h2>
					<p>
						The obvious thing to check first: how do people who joined actually compare to
						people who didn&rsquo;t? Line up their revenue side by side, and it&rsquo;s not
						close.
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
						A $42 gap. Triple the revenue. If that number were the real story, this would be
						an easy memo to write: launch it everywhere, as fast as possible.
					</p>
					<p>But It isn&rsquo;t the real story.</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">The Catch</span>
					<h2>Who joins isn&rsquo;t a coin flip</h2>
					<p>
						Here&rsquo;s the problem with that comparison: nobody assigned customers to be
						members or not. People <em>chose</em>. And the people who choose to pay $99 for
						a shopping discount tend to already be the store&rsquo;s biggest fans, these are the ones
						who were going to spend more <em>anyway</em>, membership or not.
					</p>
					<p>
						So some unknown slice of that $42 gap isn&rsquo;t the program working. It&rsquo;s
						just... who shows up. To find out how much of the $42 was real, I needed a
						cleaner test, one where joining wasn&rsquo;t a choice being made by the exact
						kind of person likely to spend more regardless.
					</p>
					<div className="fh-insight fh-insight-final">
						<span className="fh-insight-tag">Why this matters</span>
						<p>
							Comparing people who opted in against people who didn&rsquo;t is one of the
							most common ways a real business result gets overstated. It looks like data.
							It&rsquo;s actually a mirror of who already loved you.
						</p>
					</div>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">The Clean Test</span>
					<h2>Flip a coin first, ask questions later</h2>
					<p>
						So I ran it the way you&rsquo;re supposed to: instead of letting people choose,
						FanHouse randomly decided <em>who even got the offer</em> i.e., half of online
						shoppers saw it, half didn&rsquo;t, before anyone had a chance to self-select. In
						stores, since a cashier can&rsquo;t hide an offer from one shopper and not the
						next, whole stores were randomly assigned to either push membership at checkout
						or not.
					</p>
					<p>
						Now every difference between the two groups can only be explained by one thing:
						whether they got the offer. That&rsquo;s what makes the next number trustworthy.
					</p>

					<div className="fh-verdict-grid">
						<div className="fh-verdict-card">
							<span className="fh-verdict-card-label">Online, per customer</span>
							<span className="fh-verdict-card-value">$3.73–$5.00</span>
							<span className="fh-verdict-card-sub">real lift, higher revenue per quarter</span>
						</div>
						<div className="fh-verdict-card">
							<span className="fh-verdict-card-label">In stores, per customer</span>
							<span className="fh-verdict-card-value">$3.40–$5.94</span>
							<span className="fh-verdict-card-sub">real lift, higher revenue per quarter</span>
						</div>
					</div>

					<p>
						Roughly <strong>$5</strong>, not $42. Genuinely real, statistically about as
						certain as these things get i.e., just an order of magnitude smaller than the first
						look suggested.
					</p>
					<div className="fh-insight">
						<span className="fh-insight-tag">The turn</span>
						<p>
							Eight-tenths of that original $42 gap was never about membership at all. It was
							about who joins. That&rsquo;s not a footnote, But it&rsquo;s the whole story, if
							you&rsquo;d stopped at the first number.
						</p>
					</div>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">Checking It A Different Way</span>
					<h2>Two more paths to the same place</h2>
					<p>
						A randomized test is the gold standard, but it isn&rsquo;t always available, Because a
						lot of real business situations only have the messy, self-selected kind of data.
						So as a second exercise, I asked myself: What if all we had was that messy data, could
						statistical technique alone recover something close to the truth?
					</p>
					<p>
						Two different methods: One that pairs up similar customers who did and
						didn&rsquo;t join, another that tracks each person&rsquo;s own change over time.
						Both landed in the same place as each other: around <strong>$32 to $33</strong>.
						Not the $5 from the clean test, but not the wild $42 either.
					</p>
					<p>
						That agreement between two independent techniques is itself meaningful. It means
						the $32 isn&rsquo;t a fluke of one method and, as it turns out, it&rsquo;s
						answering a slightly different question than the $5 does.
					</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">Making Sense Of Two &ldquo;Right&rdquo; Numbers</span>
					<h2>$5 and $32 aren&rsquo;t in conflict</h2>
					<p>
						The $5 number describes what happens if FanHouse rolls the offer out broadly,
						it already includes all the people who see it and shrug. The $32 number describes
						something narrower: for someone who actually joins and uses it, how much more do
						they spend, compared to a similar person who didn&rsquo;t join.
					</p>
					<p>
						A finance team planning next year&rsquo;s revenue should use the $5, that&rsquo;s
						the honest, diluted, company-wide number. A product team asking &ldquo;does this
						program genuinely change behavior for the people it reaches&rdquo; should use the
						$32. Neither is the &ldquo;real&rdquo; one at the other&rsquo;s expense, they&rsquo;re
						answers to two different questions that happen to share a headline.
					</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">The Verdict</span>
					<h2>Boon, not bane: With one loose thread</h2>
					<p className="fh-lede">
						Scaled up to FanHouse&rsquo;s real size, every store, every online customer, a
						full year, the honest, diluted number is worth somewhere between{' '}
						<strong>$11.6 million and $19.9 million a year</strong>, already net of every
						discount and dollar of credit given away.
					</p>
					<p>
						That range is wide on purpose: it&rsquo;s a projection built from a smaller test,
						not a repeat of the test itself, and stores contribute far more of the total simply
						because there are so many more store customers than the online test covered.
					</p>
					<p>
						The one thing that isn&rsquo;t a clean win: the <strong>monthly</strong> plan.
						Almost 9 in 10 people who choose it cancel after their first month, behaving less
						like a subscriber and more like someone who bought a one-time coupon and left. The{' '}
						<strong>annual</strong> plan does the opposite, the people who choose it stay
						meaningfully more engaged than average, months later. If anything about this
						program deserves a redesign, it&rsquo;s not whether to launch, it&rsquo;s what to
						do about the monthly tier.
					</p>
					<div className="fh-insight fh-insight-final">
						<span className="fh-insight-tag">Bottom line</span>
						<p>
							Launch it. The revenue case is real and the risk that it&rsquo;s a fluke is
							close to zero. Just don&rsquo;t stop watching the monthly plan, it&rsquo;s the
							one part of this story that isn&rsquo;t finished yet.
						</p>
					</div>
				</section>

				<p className="fh-synthetic-note mb-10">
					A synthetic-data causal inference project. Full methodology, formulas, and code in
					the{' '}
					<Link href="/projects/fanhouse-membership-analysis/technical" style={{ color: '#312e81' }}>
						technical write-up
					</Link>
					.
				</p>
			</div>
		</div>
	);
}

export default FanHouseNonTechnical;
