import Link from 'next/link';
import PagesMetaHead from '../../../components/PagesMetaHead';

function FanHouseTechnical() {
	return (
		<div className="fh-page project-detail-page px-6 py-8 sm:px-10 lg:px-16">
			<PagesMetaHead
				title="Does Membership Pay for Itself? — Technical Write-Up"
				description="Full methodology: randomized experiment design, propensity score matching, difference-in-differences, and the statistics behind a membership program's true effect."
				keywords="A/B testing, causal inference, propensity score matching, difference-in-differences, portfolio project"
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
						<Link href="/projects/fanhouse-membership-analysis/data-story" className="fh-version-pill">
							Data story
						</Link>
						<span className="fh-version-pill fh-version-pill-current" aria-current="page">
							Technical
						</span>
					</span>
				</nav>

				<header className="fh-hero mt-6">
					<span className="fh-eyebrow">Causal Inference Case Study · Technical</span>
					<h1 className="fh-hero-title">A $42 gap, a $5 truth, and two independent ways of proving it</h1>
					<p className="fh-hero-lede">
						The full methodology behind a membership program analysis: a randomized
						controlled experiment across 50,000 online customers and 325 stores, an
						observational analysis that recovers the same self-selection bias on purpose,
						and the reconciliation between two estimates that both turn out to be correct.
					</p>

					<div className="fh-hero-stats">
						<div className="fh-hero-stat">
							<span className="fh-hero-stat-value">$5<span className="fh-hero-stat-unit">/qtr</span></span>
							<span className="fh-hero-stat-label">true causal lift, randomized</span>
						</div>
						<div className="fh-hero-stat">
							<span className="fh-hero-stat-value">8×</span>
							<span className="fh-hero-stat-label">inflation from self-selection bias</span>
						</div>
						<div className="fh-hero-stat">
							<span className="fh-hero-stat-value">50,000</span>
							<span className="fh-hero-stat-label">customers · 325 stores</span>
						</div>
					</div>

					<p className="fh-hero-byline">By Sreekaran · A/B Testing &amp; Causal Inference Project</p>
				</header>

				{/* Executive summary */}
				<section className="fh-section">
					<span className="fh-eyebrow">Where This Is Going</span>
					<p className="fh-lede">
						A naive member-vs-non-member comparison shows an enormous effect. A randomized
						experiment shows a real but much smaller one. Two independent observational
						methods, run deliberately on confounded data, land somewhere in between, and
						turn out to be answering a different, equally legitimate question. This write-up
						walks through all three results, why they diverge, and what to trust for which
						decision.
					</p>
					<p>
						FanHouse, a fictional fan-apparel retailer like that of Rally House, was
						considering a paid membership program with a flat item-level discount,
						cashback-style &ldquo;supercoins,&rdquo; and early access to drops, for $99/year
						or $9.99/month. Two independent methods were used on fully synthetic data with a
						known ground truth: a randomized controlled experiment (50,000 online customers,
						325 stores) and an observational analysis using propensity score matching and
						difference-in-differences.
					</p>

					<ol className="fh-finding-list">
						<li>
							<strong>Randomly offering membership causes a real, statistically significant
								increase in net revenue</strong>: $3.73–$5.00 per customer per quarter online
							(p &lt; 0.0001), consistent with a similar effect offline.
						</li>
						<li>
							<strong>A naive comparison of members against non-members overstates this by
								roughly 8×</strong>: spendier customers are simply more likely to join, not
							made that way by membership.
						</li>
						<li>
							<strong>Two independent observational methods converge on a much larger
								~$32–33 effect</strong> concentrated among people who actually adopt: a
							different, equally valid question from the diluted rollout number.
						</li>
						<li>
							<strong>A design tension hides inside the aggregate numbers:</strong> annual
							members show meaningfully stronger long-term engagement than average, while
							monthly members behave like a one-time discount pass, with 88% cancel after one
							month.
						</li>
					</ol>
				</section>

				{/* Business context */}
				<section className="fh-section">
					<span className="fh-eyebrow">Business Context</span>
					<h2>What FanHouse was proposing</h2>
					<p>
						FanHouse operates 325 stores across the US plus an online storefront, selling
						licensed fan apparel; jerseys, hats, and game-day gear. The proposed membership
						program:
					</p>

					<dl className="fh-spec-list">
						<div className="fh-spec-row">
							<dt>Price</dt>
							<dd>$99/year or $9.99/month</dd>
						</div>
						<div className="fh-spec-row">
							<dt>Discount</dt>
							<dd>10% per item, or $10, whichever is lower</dd>
						</div>
						<div className="fh-spec-row">
							<dt>Supercoins</dt>
							<dd>
								Earned at 10% of the discounted basket; redeemable up to 10% of a future
								basket; expire after 6 months, or immediately if a monthly plan lapses
							</dd>
						</div>
						<div className="fh-spec-row">
							<dt>Access</dt>
							<dd>Early entry to new drops and deals</dd>
						</div>
					</dl>

					<h3>Why &ldquo;sales went up&rdquo; isn&rsquo;t an answer</h3>
					<p>
						The program has real costs, discounts given, supercoin liabilities owed, and
						real revenue in the membership fee itself. A naive pre/post or member/non-member
						comparison is vulnerable to two classic failure modes: customers self-selecting
						into membership because they were already going to spend more, and vanity metrics
						like gross revenue or purchase count that don&rsquo;t reflect the company&rsquo;s
						actual financial position. Both show up later in this study, and both change the
						answer.
					</p>
				</section>

				{/* Metric design */}
				<section className="fh-section">
					<span className="fh-eyebrow">Metric Design</span>
					<h2>One number to decide the outcome</h2>
					<p>
						The temptation is to watch gross sales or purchase frequency, both are easy to
						game. A member who splits one basket into three smaller ones to chase the
						discount cap will move those numbers without the company being any better off.
						The metric that actually answers &ldquo;did this help the business&rdquo; has to
						be net of what the program costs to run.
					</p>

					<div className="fh-formula-block">
						<span className="fh-formula-label">Overall Evaluation Criterion</span>
						<p className="fh-formula">
							Net Revenue <span className="fh-formula-op">=</span> Gross Purchase Revenue{' '}
							<span className="fh-formula-op">−</span> Discount Given{' '}
							<span className="fh-formula-op">−</span> Supercoins Issued{' '}
							<span className="fh-formula-op">−</span> Returned Value{' '}
							<span className="fh-formula-op">+</span> Prorated Membership Fee
						</p>
					</div>

					<p>
						Supercoins are booked as a liability the moment they&rsquo;re issued, not when
						redeemed. It means the metric never looks better than the company&rsquo;s
						true position, even before a coin is ever spent.
					</p>

					<div className="fh-metric-columns">
						<div>
							<h3 className="fh-metric-col-title">Guardrails</h3>
							<ul className="fh-plain-list">
								<li><strong>Cost of returns</strong>: catches over-purchasing chased for
									the discount, later reversed</li>
								<li><strong>Late-window purchase activity</strong>: an early warning for
									disengagement, since true renewal falls outside most test windows</li>
							</ul>
						</div>
						<div>
							<h3 className="fh-metric-col-title">Diagnostics</h3>
							<ul className="fh-plain-list">
								<li><strong>Purchase frequency</strong>: explains why the OEC moved,
									without being the pass/fail number itself</li>
								<li><strong>Coins redeemed vs. issued</strong>: shows how much of the
									booked liability becomes real cost</li>
							</ul>
						</div>
					</div>

					<p>
						The test window itself needed a decision: research into fan-apparel purchase
						behavior showed spending is seasonal and event-driven tied to drops and season
						openers, rather than a weekly habit. An 8-week window risked being too short to
						see a second purchase from the average customer, so the test runs a full 13-week
						quarter.
					</p>
				</section>

				{/* Experiment design */}
				<section className="fh-section">
					<span className="fh-eyebrow">Experiment Design</span>
					<h2>Two channels, two randomization units</h2>
					<p>
						Online, FanHouse controls checkout directly, so individual customers can be
						randomized. In a physical store, a cashier can&rsquo;t withhold a public offer
						from one shopper and not the next, so the store itself becomes the unit of
						randomization instead.
					</p>

					<h3>Online: Individual-level</h3>
					<p>
						50% of the active online customer base was randomly assigned to be{' '}
						<strong>offered</strong> membership; the other 50% was <strong>not offered</strong>.
						Within the offered group, 15% converted. And also a small 2.5% organic adoption rate was modeled in the not-offered
						group, for word-of-mouth leakage.
					</p>

					<h3>Offline: Store-level, Stratified</h3>
					<p>
						Of 325 stores, half were randomly assigned to <strong>treatment</strong> (an
						active cashier pitch at checkout) and half to <strong>control</strong>. Stores
						were first split into three AOV tiers which are, High, Medium, Low and randomized{' '}
						<em>within</em> each tier, so an unlucky split couldn&rsquo;t cluster the
						best-performing stores into one arm. Store-level randomization means store-level
						analysis: 325 observations, not the ~800,000 individual offline customers, since
						customers inside one store aren&rsquo;t independent of each other.
					</p>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead>
								<tr>
									<th>Channel</th>
									<th>Unit</th>
									<th>Offered / Treatment</th>
									<th>Not offered / Control</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Online</td>
									<td>Customer</td>
									<td className="fh-num">~25,000 customers (15% adopted) </td>
									<td className="fh-num">~25,100 customers (2.5% adopted) </td>
								</tr>
								<tr>
									<td>Offline</td>
									<td>Store</td>
									<td className="fh-num">162 stores (15% adopted)</td>
									<td className="fh-num">163 stores (2.5% adopted)</td>
								</tr>
							</tbody>
						</table>
					</div>

					<p className="fh-synthetic-note">
						All data in this study is synthetic, built with a known ground-truth effect.
						Which is what makes it possible to check every statistical method below against
						a number that&rsquo;s actually correct, rather than trusting the method on faith.
					</p>
				</section>

				{/* Phase 1 results */}
				<section className="fh-section">
					<span className="fh-eyebrow">Phase 1 · Randomized Results</span>
					<h2>What the experiment actually found</h2>

					<p>
						Every comparison below uses the same underlying test — the two-sample t-test,
						the ratio of an observed gap to how much that gap could plausibly wobble by
						chance:
					</p>

					<div className="fh-formula-block">
						<span className="fh-formula-label">Standard error of the difference</span>
						<p className="fh-formula">
							SE <span className="fh-formula-op">=</span> √( σ<span className="fh-formula-sub">1</span><sup>2</sup>/n<span className="fh-formula-sub">1</span> <span className="fh-formula-op">+</span> σ<span className="fh-formula-sub">2</span><sup>2</sup>/n<span className="fh-formula-sub">2</span> )
						</p>
					</div>
					<div className="fh-formula-block">
						<span className="fh-formula-label">t-statistic &amp; 95% confidence interval</span>
						<p className="fh-formula">
							t <span className="fh-formula-op">=</span> (x̄<span className="fh-formula-sub">1</span> − x̄<span className="fh-formula-sub">2</span>) / SE
							<span className="fh-formula-sep">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
							CI <span className="fh-formula-op">=</span> (x̄<span className="fh-formula-sub">1</span> − x̄<span className="fh-formula-sub">2</span>) ± 1.96 × SE
						</p>
					</div>

					<figure className="fh-chart-figure">
						<svg viewBox="0 0 640 280" className="fh-chart" role="img" aria-labelledby="chart1-title chart1-desc">
							<title id="chart1-title">Net revenue per customer, online and offline</title>
							<desc id="chart1-desc">Online: not offered $22.84, offered $27.20. Offline: control $22.80, treatment $27.47. Both gaps are statistically significant, with wider uncertainty offline.</desc>

							<line x1="60" y1="40" x2="60" y2="220" className="fh-chart-axis" />
							<line x1="60" y1="220" x2="600" y2="220" className="fh-chart-axis" />
							<text x="52" y="45" className="fh-chart-tick" textAnchor="end">$30</text>
							<line x1="60" y1="45" x2="600" y2="45" className="fh-chart-grid" />
							<text x="52" y="132" className="fh-chart-tick" textAnchor="end">$15</text>
							<line x1="60" y1="132" x2="600" y2="132" className="fh-chart-grid" />
							<text x="52" y="220" className="fh-chart-tick" textAnchor="end">$0</text>

							<g>
								<rect x="130" y="87" width="56" height="133" className="fh-bar-control" />
								<line x1="158" y1="80" x2="158" y2="94" className="fh-chart-errorbar" />
								<text x="158" y="70" className="fh-chart-value" textAnchor="middle">$22.84</text>
								<text x="158" y="240" className="fh-chart-label" textAnchor="middle">Not offered</text>

								<rect x="196" y="41" width="56" height="179" className="fh-bar-treatment" />
								<line x1="224" y1="32" x2="224" y2="50" className="fh-chart-errorbar" />
								<text x="224" y="24" className="fh-chart-value" textAnchor="middle">$27.20</text>
								<text x="224" y="240" className="fh-chart-label" textAnchor="middle">Offered</text>

								<text x="191" y="262" className="fh-chart-group-label" textAnchor="middle">Online · n ≈ 50,000</text>
							</g>

							<g>
								<rect x="382" y="88" width="56" height="132" className="fh-bar-control" />
								<line x1="410" y1="72" x2="410" y2="104" className="fh-chart-errorbar" />
								<text x="410" y="62" className="fh-chart-value" textAnchor="middle">$22.80</text>
								<text x="410" y="240" className="fh-chart-label" textAnchor="middle">Control</text>

								<rect x="448" y="43" width="56" height="177" className="fh-bar-treatment" />
								<line x1="476" y1="20" x2="476" y2="66" className="fh-chart-errorbar" />
								<text x="476" y="12" className="fh-chart-value" textAnchor="middle">$27.47</text>
								<text x="476" y="240" className="fh-chart-label" textAnchor="middle">Treatment</text>

								<text x="443" y="262" className="fh-chart-group-label" textAnchor="middle">Offline · n = 325 stores</text>
							</g>
						</svg>
						<figcaption>
							Error bars show the 95% confidence interval. Both gaps are significant; the
							offline interval is visibly wider, reflecting far less statistical power from
							325 stores versus ~50,000 customers.
						</figcaption>
					</figure>

					<h3>Online: net revenue</h3>
					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead><tr><th></th><th>Not offered</th><th>Offered</th></tr></thead>
							<tbody>
								<tr><td>Mean net revenue</td><td className="fh-num">$22.84</td><td className="fh-num">$27.20</td></tr>
								<tr><td>n</td><td className="fh-num">24,994</td><td className="fh-num">25,006</td></tr>
							</tbody>
						</table>
					</div>
					<p className="fh-result-line">
						t = 13.52, p ≈ 1.5×10<sup>−41</sup> · 95% CI = [$3.73, $5.00]
					</p>

					<h3>Offline: net revenue</h3>
					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead><tr><th></th><th>Control</th><th>Treatment</th></tr></thead>
							<tbody>
								<tr><td>Mean net revenue / store</td><td className="fh-num">$22.80</td><td className="fh-num">$27.47</td></tr>
								<tr><td>n (stores)</td><td className="fh-num">163</td><td className="fh-num">162</td></tr>
							</tbody>
						</table>
					</div>
					<p className="fh-result-line">
						t = 7.23, p ≈ 3.6×10<sup>−12</sup> · 95% CI = [$3.40, $5.94]
					</p>
					<p>
						The offline interval is noticeably wider, as 325 stores carries far less
						statistical power than ~50,000 customers, so the effect is equally certain to
						exist but less precisely pinned down in size.
					</p>

					<div className="fh-insight">
						<span className="fh-insight-tag">Insight</span>
						<p>
							Randomization worked in both channels, the lift is real and consistent
							across two independent samples. Trust the online number for precision, trust
							the offline number only for direction.
						</p>
					</div>

					<h3>Guardrail: returns</h3>
					<p>
						Members return more, 10.2% of gross revenue online vs. 8.0% for non-members
						(t = 13.52, p ≈ 1.5×10<sup>−41</sup>). Because returns are already subtracted
						directly in the net revenue formula, this doesn&rsquo;t reveal a hidden problem,
						it explains part of the composition of a number the OEC already accounts for.
					</p>

					<div className="fh-insight">
						<span className="fh-insight-tag">Insight</span>
						<p>
							A guardrail moving doesn&rsquo;t automatically mean something&rsquo;s broken.
							Check whether it&rsquo;s already priced into the headline metric before
							treating it as an independent red flag.
						</p>
					</div>

					<h3>Guardrail: late-window activity</h3>
					<figure className="fh-chart-figure">
						<svg viewBox="0 0 640 260" className="fh-chart" role="img" aria-labelledby="chart2-title chart2-desc">
							<title id="chart2-title">Late-window purchase activity by member type</title>
							<desc id="chart2-desc">Annual members 20.1%, non-members 12.9%, monthly members 9.0%. Annual is significantly above the non-member baseline; monthly is significantly below it.</desc>

							<line x1="60" y1="30" x2="60" y2="200" className="fh-chart-axis" />
							<line x1="60" y1="200" x2="600" y2="200" className="fh-chart-axis" />
							<text x="52" y="35" className="fh-chart-tick" textAnchor="end">25%</text>
							<line x1="60" y1="35" x2="600" y2="35" className="fh-chart-grid" />
							<text x="52" y="118" className="fh-chart-tick" textAnchor="end">12.5%</text>
							<line x1="60" y1="118" x2="600" y2="118" className="fh-chart-baseline-dash" strokeDasharray="3 4" />
							<text x="52" y="200" className="fh-chart-tick" textAnchor="end">0%</text>

							<rect x="130" y="65" width="90" height="135" className="fh-bar-good" />
							<text x="175" y="55" className="fh-chart-value" textAnchor="middle">20.1%</text>
							<text x="175" y="220" className="fh-chart-label" textAnchor="middle">Annual</text>

							<rect x="275" y="113" width="90" height="87" className="fh-bar-control" />
							<text x="320" y="103" className="fh-chart-value" textAnchor="middle">12.9%</text>
							<text x="320" y="220" className="fh-chart-label" textAnchor="middle">Non-member</text>
							<text x="320" y="236" className="fh-chart-group-label" textAnchor="middle">(baseline)</text>

							<rect x="420" y="140" width="90" height="60" className="fh-bar-warn" />
							<text x="465" y="130" className="fh-chart-value" textAnchor="middle">9.0%</text>
							<text x="465" y="220" className="fh-chart-label" textAnchor="middle">Monthly</text>
						</svg>
						<figcaption>
							The dashed line marks the non-member baseline. Annual members sit
							significantly above it, monthly members significantly below, and pooled
							together, those two effects roughly cancel out.
						</figcaption>
					</figure>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead><tr><th>Member type</th><th>Late-window activity</th></tr></thead>
							<tbody>
								<tr><td>Annual</td><td className="fh-num">20.1%</td></tr>
								<tr><td>Non-member</td><td className="fh-num">12.9%</td></tr>
								<tr><td>Monthly</td><td className="fh-num">9.0%</td></tr>
							</tbody>
						</table>
					</div>
					<p>
						Decomposed by plan, both effects are highly significant; annual vs. none
						(t = 8.61, p ≈ 7.8×10<sup>−18</sup>) and monthly vs. none (t = −5.88,
						p ≈ 4.2×10<sup>−9</sup>). But pooled together, the aggregate offered-vs-not-offered
						test is <strong>not significant</strong> (t = 0.61, p = 0.54) — the two effects
						roughly cancel. Pooling can mask two real, opposite-signed subgroup effects; the
						correct read isn&rsquo;t &ldquo;no engagement effect,&rdquo; it&rsquo;s two
						offsetting ones that only appear once decomposed.
					</p>

					<div className="fh-insight">
						<span className="fh-insight-tag">Insight</span>
						<p>
							The monthly plan functions as a one-time discount pass, not a subscription,
							it&rsquo;s actively pulling down engagement that the annual plan is building.
							A pooled test would have hidden this entirely.
						</p>
					</div>

					<h3>Novelty effects</h3>
					<p>
						An early week-by-week look showed a sharp step-down between weeks 1–4 and 5–13.
						That pattern turned out to be mechanical, not psychological, the guaranteed,
						boosted month-1 purchase plus an 88% cancellation rate produces exactly this
						shape whether or not real novelty fatigue exists underneath it.
					</p>

					<div className="fh-insight">
						<span className="fh-insight-tag">Insight</span>
						<p>
							A striking pattern in the data isn&rsquo;t automatically a behavioral
							phenomenon, check whether your own program&rsquo;s mechanics could produce
							the same shape before reaching for a psychological explanation.
						</p>
					</div>

					<h3>Multiple testing</h3>
					<p>
						Six tests were run in this phase. The chance that at least one shows a false
						positive by pure luck isn&rsquo;t 5%; it compounds.
					</p>
					<div className="fh-formula-block">
						<span className="fh-formula-label">Family-wise false-positive risk</span>
						<p className="fh-formula">
							1 <span className="fh-formula-op">−</span> (1 <span className="fh-formula-op">−</span> 0.05)<sup>5</sup> <span className="fh-formula-op">≈</span> 22.6%
						</p>
					</div>
					<p>
						Every significant result here clears even a conservative Bonferroni-adjusted
						threshold (≈ 0.0083) by many orders of magnitude, so the correction changes
						nothing, including the one non-significant result, which stays non-significant
						either way.
					</p>

					<div className="fh-insight">
						<span className="fh-insight-tag">Insight</span>
						<p>
							Worth checking, rarely worth panicking about, the correction only matters
							when a result is borderline. Every result here was either overwhelmingly
							significant or clearly not, so multiple testing changed no conclusions.
						</p>
					</div>
				</section>

				{/* Phase 2 results */}
				<section className="fh-section">
					<span className="fh-eyebrow">Phase 2 · Observational Causal Inference</span>
					<h2>What if you couldn&rsquo;t randomize?</h2>
					<p>
						Phase 1 worked because FanHouse controlled who got offered membership. Most
						real-world situations aren&rsquo;t that clean, a program is often already live,
						and adoption is purely a customer&rsquo;s choice. This phase builds that harder
						case on purpose: a fresh population where a hidden trait, call it{' '}
						<em>historical purchase rate</em>, each customer&rsquo;s typical pre-membership
						buying frequency, drives both how much someone naturally spends <em>and</em>,
						through a logistic function, how likely they are to join.
					</p>

					<div className="fh-formula-block">
						<span className="fh-formula-label">Self-selected adoption</span>
						<p className="fh-formula">
							P(member) <span className="fh-formula-op">=</span> 1 / (1 <span className="fh-formula-op">+</span> e<sup>−(a + b·rate)</sup>)
							<span className="fh-formula-sep">, </span> a <span className="fh-formula-op">=</span> −2.6<span className="fh-formula-sep">, </span> b <span className="fh-formula-op">=</span> 1.2
						</p>
					</div>

					<p>
						That single mechanism creates real, mechanism-driven confounding, not random
						noise dressed up as bias. A customer with a low rate (0.2/quarter) has roughly
						an 8.6% chance of joining; a superfan (1.5/quarter) has closer to 31%.
					</p>

					<h3>The trap: a naive comparison</h3>
					<p>
						Members&rsquo; historical purchase rate (0.82) is already well above
						non-members&rsquo; (0.56), before membership even existed. Compare raw averages
						anyway, and the gap is enormous:
					</p>
					<p className="fh-result-line fh-result-line-warn">
						Members $63.08 vs. non-members $20.67 · naive gap = $42.41
					</p>
					<p>
						Compared to Phase 1&rsquo;s true randomized effect of about $5, this naive number
						is inflated by roughly <strong>8×</strong>. It&rsquo;s not membership working
						miracles, it&rsquo;s who chooses to join.
					</p>

					<div className="fh-insight">
						<span className="fh-insight-tag">Insight</span>
						<p>
							Whenever treatment isn&rsquo;t randomly assigned, ask who self-selects into it
							before trusting a raw comparison, the gap can be almost entirely the
							audience, not the effect.
						</p>
					</div>

					<h3>Propensity score matching</h3>
					<p>
						A logistic regression, trained only on pre-treatment traits, estimates each
						customer&rsquo;s probability of joining. Every member is then paired with the
						non-member whose estimated propensity is closest, matched one at a time,
						without replacement, so no one gets reused as a stand-in for multiple members.
					</p>

					<div className="fh-formula-block">
						<span className="fh-formula-label">Estimated propensity (fit on realistic data only)</span>
						<p className="fh-formula">
							â <span className="fh-formula-op">=</span> −2.59 <span className="fh-formula-sep">(true: −2.60)</span> &nbsp;&nbsp; b̂ <span className="fh-formula-op">=</span> 1.199 <span className="fh-formula-sep">(true: 1.20)</span>
						</p>
					</div>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead><tr><th>Check</th><th>Result</th></tr></thead>
							<tbody>
								<tr><td>Covariate balance, purchase rate</td><td className="fh-num">0.26 → 0.0053 gap (~98% reduction)</td></tr>
								<tr><td>Match quality</td><td className="fh-num">0.0015 avg. propensity distance</td></tr>
								<tr><td>Matched net revenue gap</td><td className="fh-num">$33.51</td></tr>
							</tbody>
						</table>
					</div>
					<p className="fh-result-line">Paired t-test: t = 48.95, p ≈ 0</p>

					<div className="fh-insight">
						<span className="fh-insight-tag">Insight</span>
						<p>
							Matching only controls for confounders you actually measured. It cut the raw
							gap by about a quarter here, not down to $5, a sign there&rsquo;s more going
							on than selection bias alone.
						</p>
					</div>

					<h3>Difference-in-differences</h3>
					<p>
						A second, independent check: instead of comparing similar <em>people</em>,
						compare each group&rsquo;s own change over time. A simulated pre-period revenue
						figure, before the membership program existed for anyone, gives every customer
						a genuine before/after.
					</p>

					<div className="fh-formula-block">
						<span className="fh-formula-label">Difference-in-differences estimator</span>
						<p className="fh-formula">
							δ<span className="fh-formula-sub">DiD</span> <span className="fh-formula-op">=</span>{' '}
							(Ȳ<span className="fh-formula-sub">member,after</span> <span className="fh-formula-op">−</span> Ȳ<span className="fh-formula-sub">member,before</span>){' '}
							<span className="fh-formula-op">−</span>{' '}
							(Ȳ<span className="fh-formula-sub">non,after</span> <span className="fh-formula-op">−</span> Ȳ<span className="fh-formula-sub">non,before</span>)
						</p>
					</div>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead><tr><th>Group</th><th>Before</th><th>After</th><th>Change</th></tr></thead>
							<tbody>
								<tr><td>Members</td><td className="fh-num">$32.40</td><td className="fh-num">$63.08</td><td className="fh-num">+$30.68</td></tr>
								<tr><td>Non-members</td><td className="fh-num">$22.46</td><td className="fh-num">$20.67</td><td className="fh-num">−$1.79</td></tr>
							</tbody>
						</table>
					</div>
					<p className="fh-result-line">δ<span className="fh-formula-sub">DiD</span> = $32.47</p>

					<figure className="fh-chart-figure">
						<svg viewBox="0 0 640 300" className="fh-chart" role="img" aria-labelledby="chart3-title chart3-desc">
							<title id="chart3-title">Four estimates of the membership effect, compared</title>
							<desc id="chart3-desc">Naive comparison $42.41, propensity matching $33.51, difference-in-differences $32.47, true randomized ITT effect approximately $5. Matching and DiD converge closely to each other but far from the true randomized effect, because they answer a different question.</desc>

							<line x1="140" y1="20" x2="140" y2="240" className="fh-chart-axis" />
							<line x1="140" y1="240" x2="600" y2="240" className="fh-chart-axis" />

							<text x="132" y="80" className="fh-chart-label" textAnchor="end">Naive</text>
							<rect x="150" y="66" width="304" height="28" className="fh-bar-warn" />
							<text x="462" y="86" className="fh-chart-value" textAnchor="start">$42.41</text>

							<text x="132" y="128" className="fh-chart-label" textAnchor="end">Matching</text>
							<rect x="150" y="114" width="240" height="28" className="fh-bar-treatment" />
							<text x="398" y="134" className="fh-chart-value" textAnchor="start">$33.51</text>

							<text x="132" y="176" className="fh-chart-label" textAnchor="end">Diff-in-diff</text>
							<rect x="150" y="162" width="233" height="28" className="fh-bar-treatment" />
							<text x="391" y="182" className="fh-chart-value" textAnchor="start">$32.47</text>

							<text x="132" y="224" className="fh-chart-label" textAnchor="end">True (ITT)</text>
							<rect x="150" y="210" width="36" height="28" className="fh-bar-good" />
							<text x="194" y="230" className="fh-chart-value" textAnchor="start">~$5</text>
						</svg>
						<figcaption>
							Matching and diff-in-differences land within a dollar of each other, strong
							cross-validation that both methods are measuring the same real thing, just
							not the same real <em>question</em> as the randomized ITT estimate. See the
							synthesis below.
						</figcaption>
					</figure>

					<div className="fh-insight">
						<span className="fh-insight-tag">Insight</span>
						<p>
							Two independent methods that agree with each other, but disagree with the
							randomized number, aren&rsquo;t necessarily both wrong, they may be answering
							a genuinely different question. That&rsquo;s the subject of the next section.
						</p>
					</div>
				</section>

				{/* Synthesis */}
				<section className="fh-section">
					<span className="fh-eyebrow">Every Insight, In One Place</span>
					<h2>Complete Recap :</h2>
					<p>
						Eight separate moments across both phases, each one changing what to actually
						believe about the data:
					</p>

					<ol className="fh-finding-list">
						<li>Randomization worked in both channels, the lift is real and consistent
							across two independent samples. Trust the online number for precision, trust
							the offline number only for direction.</li>
						<li>A guardrail moving doesn&rsquo;t automatically mean something&rsquo;s broken,
							check whether it&rsquo;s already priced into the headline metric first.</li>
						<li>The monthly plan functions as a one-time discount pass, not a subscription,
							and a pooled test would have hidden this completely.</li>
						<li>A striking pattern in the data isn&rsquo;t automatically a behavioral
							phenomenon, rule out your own program&rsquo;s mechanics before reaching for a
							psychological explanation.</li>
						<li>Multiple-testing correction is worth checking, rarely worth panicking about,
							it only flips conclusions when a result is borderline.</li>
						<li>Whenever treatment isn&rsquo;t randomly assigned, ask who self-selects into it
							before trusting a raw comparison, the gap can be almost entirely the
							audience, not the effect.</li>
						<li>Matching only controls for confounders you actually measured, a partial
							reduction in bias is a clue there&rsquo;s more happening than selection
							alone.</li>
						<li>Two independent methods that agree with each other but disagree with a
							randomized benchmark aren&rsquo;t necessarily wrong, they may be answering a
							different question, which is exactly what happened here.</li>
					</ol>

					<h2 style={{ marginTop: '2rem' }}>Why $5 and $32 are both right</h2>
					<p className="fh-lede">
						The single most important reconciliation in this study: the randomized estimate
						and the observational estimate are not competing answers to the same question.
					</p>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead><tr><th>Estimate</th><th>Value</th><th>Question answered</th></tr></thead>
							<tbody>
								<tr>
									<td>Phase 1 · ITT</td>
									<td className="fh-num">~$5</td>
									<td>If FanHouse offers membership broadly, how much does average
										revenue move, accounting for the fact that most people decline?</td>
								</tr>
								<tr>
									<td>Phase 2 · matching / DiD</td>
									<td className="fh-num">~$32–33</td>
									<td>For a customer who actually becomes a member and uses the program,
										how much higher is their revenue than a similar non-member?</td>
								</tr>
							</tbody>
						</table>
					</div>

					<p>
						A finance team modeling company-wide rollout revenue should use the ITT figure,
						scaled by expected adoption. A product team asking whether membership
						meaningfully changes behavior for the people who join should use the
						treatment-on-the-treated figure. Neither number is more &ldquo;correct&rdquo; in
						isolation, the right one depends entirely on the decision being made, and
						conflating them is the single easiest way to mislead a room.
					</p>
				</section>

				{/* Limitations */}
				<section className="fh-section">
					<span className="fh-eyebrow">Honest Caveats</span>
					<h2>Where this could still be wrong</h2>
					<p>
						Every number above survived a second look, but a second look isn&rsquo;t the
						same as a guarantee. Worth stating plainly what would need to hold for these
						conclusions to transfer beyond this dataset:
					</p>
					<ul className="fh-plain-list">
						<li><strong>All data is synthetic.</strong> Distributional choices were grounded
							in public retail research where possible, but they aren&rsquo;t any real
							company&rsquo;s actual transactions, a live rollout should re-derive every
							parameter from real history before trusting the dollar figures here.</li>
						<li><strong>The offline analysis is store-level (n = 325), not
							customer-level</strong>, correct given how randomization was assigned, but it
							trades away most of the statistical power a customer-level test would have,
							which is why that confidence interval is wider.</li>
						<li><strong>Propensity matching can only correct for confounders you actually
							measured.</strong> Two traits were used here; a real customer base has many
							more, some of them unobservable, which is exactly why the matched estimate
							didn&rsquo;t collapse all the way to the randomized one, and why randomization
							remains the gold standard whenever it&rsquo;s feasible.</li>
						<li><strong>Diff-in-differences relies on a separately simulated
							pre-period,</strong> not genuine historical panel data, since the original
							design didn&rsquo;t include multi-quarter transaction history.</li>
						<li><strong>The pooled late-window guardrail test is not significant,</strong> a
							reminder that this dataset specifically rewards decomposing by member type
							before concluding a metric shows no effect.</li>
					</ul>
				</section>

				{/* Verdict */}
				<section className="fh-section">
					<span className="fh-eyebrow">The Verdict</span>
					<h2>Boon or bane for FanHouse?</h2>
					<p className="fh-lede">
						Boon: The effect is small per customer, but real, positive, and statistically
						unambiguous in both channels. At FanHouse&rsquo;s actual scale, that small number
						adds up.
					</p>

					<p>
						Scaling the randomized (ITT) estimate, the right one for a company-wide rollout,
						since it already reflects realistic decline rates, across FanHouse&rsquo;s full
						customer base:
					</p>

					<div className="fh-verdict-grid">
						<div className="fh-verdict-card">
							<span className="fh-verdict-card-label">Online, annualized</span>
							<span className="fh-verdict-card-value">$0.75M–$1.0M</span>
							<span className="fh-verdict-card-sub">50,000 active customers × 4 quarters</span>
						</div>
						<div className="fh-verdict-card">
							<span className="fh-verdict-card-label">Offline, annualized</span>
							<span className="fh-verdict-card-value">$10.8M–$18.9M</span>
							<span className="fh-verdict-card-sub">325 stores × ~2,450 customers × 4 quarters</span>
						</div>
						<div className="fh-verdict-card fh-verdict-card-total">
							<span className="fh-verdict-card-label">Combined projected uplift</span>
							<span className="fh-verdict-card-value">~$11.6M–$19.9M / yr</span>
							<span className="fh-verdict-card-sub">already net of discounts, coins, and returns</span>
						</div>
					</div>

					<p>
						That range is wide on purpose. It&rsquo;s a projection, not a re-statement of
						what was tested. The offline experiment ran on 325 stores for one quarter, not a
						full year of company-wide adoption, so this scales a validated per-customer
						effect up to FanHouse&rsquo;s real footprint rather than reporting a new measured
						result. The width mostly comes from the offline confidence interval, which is
						genuinely wider due to the smaller store-level sample.
					</p>

					<p>
						What would make this a <strong>bane</strong> instead: if real-world adoption came
						in far below the 15% tested here, if the monthly plan&rsquo;s 88% one-month churn
						meant most fee revenue never repeats past month one, or if the elevated return
						rate among members reflected a genuine product-fit problem rather than the
						discount-chasing this study attributes it to. None of those showed up in this
						data, but they&rsquo;re the specific things worth watching in a live rollout, not
						the program&rsquo;s net revenue line, which is already answered.
					</p>

					<div className="fh-insight fh-insight-final">
						<span className="fh-insight-tag">Bottom line</span>
						<p>
							The membership program pays for itself and then some. The open question
							isn&rsquo;t whether to launch it, it&rsquo;s whether the monthly plan, as
							currently designed, is worth keeping in its current form.
						</p>
					</div>
				</section>

				{/* Recommendations */}
				<section className="fh-section">
					<span className="fh-eyebrow">Recommendations</span>
					<h2>What to actually do with this</h2>
					<ul className="fh-plain-list">
						<li><strong>Proceed with the program.</strong> The randomized, causally valid
							estimate is a statistically robust positive effect in both channels, this isn&rsquo;t a borderline call.</li>
						<li><strong>Reconsider the monthly plan&rsquo;s design.</strong> An 88% one-month
							cancellation rate and below-baseline late-window engagement means it currently
							functions as a one-time discount pass. A mid-quarter re-engagement nudge, or a
							restructured incentive, could change that.</li>
						<li><strong>Monitor the return rate going forward</strong> as an operational and
							customer-experience signal, even though it isn&rsquo;t currently threatening
							the headline metric.</li>
						<li><strong>Keep ITT and TOT numbers separate in every downstream
							conversation.</strong> Whichever one gets used for a financial projection, name
							it explicitly. Conflating the two is the single easiest way this analysis
							gets misrepresented.</li>
					</ul>
				</section>

				<p className="fh-synthetic-note mb-10">
					A synthetic-data causal inference project. Prefer a plain-language walkthrough? Read
					the{' '}
					<Link href="/projects/fanhouse-membership-analysis" style={{ color: '#312e81' }}>
						non-technical version
					</Link>
					.
				</p>
			</div>
		</div>
	);
}

export default FanHouseTechnical;
