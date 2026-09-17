import Link from 'next/link';
import PagesMetaHead from '../../../components/PagesMetaHead';
import { Cast, Say, Strip } from '../../../components/reading/StoryParts';
import { ReadingSection, StoryContents } from '../../../components/reading/ReadingKit';

const cast = [
	{ name: 'ARIMA', role: 'The Veteran', bio: 'A classical model. Thirty-five years on the desk.' },
	{ name: 'Xander', role: 'XGBoost', bio: 'The rookie who builds thousands of trees.' },
	{ name: 'Gigi', role: 'LightGBM', bio: 'The other rookie. Says little, builds fast.' },
	{ name: 'Surya', role: 'Runs the desk', bio: 'Gives everyone the same fair test.' },
];

function LoanForecastingStory() {
	return (
		<div className="reader fh-page project-detail-page px-6 py-8 sm:px-10 lg:px-16">
			<PagesMetaHead
				title="The Forecast That Was Too Good To Be True: Loan Delinquency Case Study"
				description="A veteran ARIMA model, two eager ML rookies, a leak that almost fooled everyone, and the honest scoreboard that came after."
				keywords="time series forecasting, ARIMA, XGBoost, LightGBM, walk-forward backtesting, portfolio project"
			/>

			<div className="mx-auto max-w-4xl">
				<Link href="/#projects" className="project-detail-back-btn mt-8">
					← Back to Projects
				</Link>

				<nav className="fh-version-switch mt-6" aria-label="Versions of this write-up">
					<span className="fh-version-switch-label">Two ways to read this</span>
					<span className="fh-version-switch-options">
						<span className="fh-version-pill fh-version-pill-current" aria-current="page">
							The story
						</span>
						<Link href="/projects/loan-default-forecasting/technical" className="fh-version-pill">
							Technical
						</Link>
					</span>
				</nav>

				<header className="fh-hero mt-6">
					<span className="fh-eyebrow">Time-Series Forecasting Case Study</span>
					<h1 className="fh-hero-title">The Forecast That Was Too Good To Be True</h1>
					<p className="fh-hero-lede">
						A thirty-five-year-old forecasting method, two eager machine-learning
						rookies, a leak that almost fooled everyone, and the honest scoreboard
						that came after.
					</p>
					<p className="fh-hero-byline">By Sreekaran · Time-Series Forecasting &amp; Applied ML Project</p>
				</header>

				<aside className="rd-tldr" aria-label="The short version">
					<h2>The short version</h2>
					<ul>
						<li>
							A data-leakage bug in the first ML implementation was caught (via a
							suspiciously good tuning result) and fixed before any result was trusted.
						</li>
						<li>
							Post-fix, ARIMA beat both ML models on every one of the five series,
							with reported p&lt;0.05 in 27 of 40 Diebold-Mariano comparisons. No adjustment across the 40 tests is documented here.
						</li>
						<li>
							SHAP attributed the largest share of importance to the most recent lag in both tree models; it does not establish why ARIMA performed better.
						</li>
					</ul>
				</aside>

				<StoryContents label="In this story" />


				<section className="fh-section">
					<p>
						There&rsquo;s a desk at every bank that nobody throws a party for.
					</p>
					<p>
						The person who sits there doesn&rsquo;t launch products. Doesn&rsquo;t
						demo anything flashy in front of the board. Every quarter, they answer
						one question and go home: <em>how many of these loans are going to go
						bad next quarter?</em>
					</p>
					<p>For years, that desk had one occupant. Everyone just called it ARIMA.</p>
				</section>

				<Cast members={cast} />

				<ReadingSection eyebrow={<>Chapter 1</>} title={<>The Veteran</>}>
					<p>
						ARIMA was old. Not &ldquo;outdated&rdquo; old. <em>Reliable</em> old.
						The kind of old that makes younger models nervous, because
						it&rsquo;s still right more often than they&rsquo;d like.
					</p>
					<p>
						ARIMA starts with three order choices.{' '}
						<code>p</code>, <code>d</code>, <code>q</code>: autoregressive order,
						differencing order, and moving-average order. These define the model
						structure; its coefficients still have to be fitted to the data.
					</p>
					<Strip>
						<Say who="A first-timer">
							That&rsquo;s <em>it</em>?
						</Say>
						<Say who="ARIMA">
							That sets my structure. I use past values and forecast errors,
							difference the series when needed, and fit the coefficients.
						</Say>
					</Strip>
					<p>ARIMA watched five accounts, quarter after quarter, for thirty-five years:</p>
					<ul className="fh-plain-list">
						<li><strong>All Loans</strong></li>
						<li><strong>Credit Card</strong></li>
						<li><strong>Business</strong></li>
						<li><strong>Mortgage</strong></li>
						<li><strong>CRE</strong></li>
					</ul>
					<p>
						Every quarter, the drill was the same. Look at everything known so far.
						Guess the next four quarters. Wait. Get graded. Do it again, a
						little more history each time, sliding forward one quarter at a time.
						Fifty-nine times per account, for thirty-five years of quarterly data.
						That&rsquo;s called a <em>walk-forward backtest</em>, and it&rsquo;s a
						brutal, honest way to be graded: no peeking at the future, ever, at any
						point.
					</p>
					<p>
						Nobody expected ARIMA to be a genius. It was graded against two lazy
						alternatives: <em>just guess it&rsquo;s the same as last
						quarter</em> (simple-naive), and <em>just guess it&rsquo;s the same as
						this time last year</em> (seasonal-naive). Beating a lazy guess
						isn&rsquo;t supposed to be hard.
					</p>
					<p>The reported seasonal-naive-scaled scores were below 1 for all five series. The simple-naive comparison was mixed: only Business and CRE had scores below 1. ARIMA did not lead both benchmark comparisons across every series.</p>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead>
								<tr><th>Account</th><th>Reported seasonal-naive-scaled error</th></tr>
							</thead>
							<tbody>
								<tr><td>CRE</td><td><strong>0.135</strong></td></tr>
								<tr><td>Business</td><td><strong>0.236</strong></td></tr>
								<tr><td>All Loans</td><td><strong>0.269</strong></td></tr>
								<tr><td>Credit Card</td><td><strong>0.325</strong></td></tr>
								<tr><td>Mortgage</td><td><strong>0.348</strong></td></tr>
							</tbody>
						</table>
					</div>

					<p>
						These are aggregate backtest scores for each loan category. All five
						were below 1.0 on the reported seasonal-naive scale; that does not
						mean ARIMA beat the benchmark in every individual quarter.
					</p>
					<p>Nobody clapped. That&rsquo;s just what the job looked like, every quarter, for years.</p>
					<p>Then, one Tuesday, two new hires arrived.</p>
				</ReadingSection>

				<ReadingSection eyebrow={<>Chapter 2</>} title={<>The Rookies</>}>
					<p>
						Their names were <strong>Xander</strong> and <strong>Gigi</strong>.
						Everyone had heard of them. Xander went by his full name when he
						wanted to sound serious: <em>XGBoost</em>. Gigi&rsquo;s was{' '}
						<em>LightGBM</em>, but nobody called her that unless something had
						gone wrong.
					</p>
					<p>
						They didn&rsquo;t work like ARIMA. ARIMA looked at a few numbers and
						wrote an equation. Xander and Gigi built <em>trees</em>:
						thousands of tiny yes/no questions, stacked on top of each other,
						voting on an answer.
					</p>
					<p>
						&ldquo;Was last quarter above 4%? If yes, was the quarter before that
						also rising? If yes&hellip;&rdquo; and so on, hundreds of times,
						hundreds of trees.
					</p>
					<p>
						They&rsquo;d read about themselves winning competitions. Real ones.
						Big ones. They were, by reputation, the future.
					</p>
					<p>
						Surya, who ran the desk now, decided to give them a fair shot:
						the exact same walk-forward drill ARIMA had been doing for years. No
						shortcuts, no head start. Same five accounts. Same fifty-nine graded
						quarters each.
					</p>
					<p>
						There was one immediate problem: Xander and Gigi couldn&rsquo;t read
						a raw number the way ARIMA could. So Surya gave them a study guide
						instead: what the account looked like 1, 2, 3, and 4 quarters
						ago, what it looked like 8 quarters ago (two years, worth
						checking for slower patterns too), and how choppy the last year had
						been.
					</p>
					<Strip>
						<Say who="Surya">
							That&rsquo;s all you get. No looking anywhere else. Same information
							ARIMA has, just handed to you differently.
						</Say>
					</Strip>
					<p>Xander cracked his knuckles. Gigi didn&rsquo;t say anything. She just started building trees.</p>
					<p>The first results came back.</p>
					<p>They were <em>stunning</em>. Numbers so good Surya actually sat back in the chair.</p>
					<p>They were also, it would turn out, a lie.</p>
				</ReadingSection>

				<ReadingSection eyebrow={<>Chapter 3</>} title={<>Too Good to Be True</>}>
					<p>
						The tell came from somewhere small: a routine experiment to
						see if Xander and Gigi could get <em>even better</em> with some
						tuning. Just twenty tries each at adjusting their own settings,
						evaluated fairly, on data they&rsquo;d never touched.
					</p>
					<p>
						One run came back with a number so low it didn&rsquo;t look like a
						forecast error anymore. It looked like a typo.
					</p>
					<p>Surya stared at it for a long moment.</p>
					<p>
						<em>Nobody</em> predicts loan delinquency rates that well. Not from
						five numbers and a rolling average. Not in five tuning attempts. Not
						ever, really.
					</p>
					<div className="fh-insight">
						<span className="fh-insight-tag">The rule</span>
						<p>
							When a result looks too good to be true, it&rsquo;s not a
							discovery. It&rsquo;s a leak.
						</p>
					</div>
					<p>So Surya went looking. And found it.</p>
					<p>
						Here&rsquo;s what had happened. Xander and Gigi weren&rsquo;t just
						handed <em>&ldquo;what happened 1, 2, 3, 4, 8 quarters ago.&rdquo;</em>{' '}
						They were handed a study guide with the answer key stapled in by
						accident, right at the edge, where nobody had checked.
					</p>
					<p>
						Every training example was supposed to teach them: <em>given the
						past, guess four quarters ahead.</em> But near the very end of each
						training window, a few examples&rsquo; &ldquo;four quarters
						ahead&rdquo; landed <em>inside the quarters they were about to be
						tested on that same round.</em> A handful of times, for a handful of
						quarters, they weren&rsquo;t predicting the test. They were copying
						it: their own upcoming answer, quietly sitting in their own
						homework.
					</p>
					<p>
						Nobody had done this on purpose. It was one line of logic, quietly
						wrong, in exactly the kind of place these things always hide: a
						boundary condition, off by a few rows, at the edge of a sliding
						window.
					</p>
					<p>
						Surya fixed it. Rebuilt the study guide so it stopped at exactly the
						right line, every time. Not one row of the future allowed to
						leak backward, ever. Then ran everything again, from scratch.
					</p>
					<p>The stunning numbers disappeared. What was left was the truth.</p>
				</ReadingSection>

				<ReadingSection eyebrow={<>Chapter 4</>} title={<>The Honest Scoreboard</>}>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead>
								<tr><th>Account</th><th>ARIMA</th><th>Xander (XGBoost)</th><th>Gigi (LightGBM)</th></tr>
							</thead>
							<tbody>
								<tr><td>All Loans</td><td><strong>0.269</strong></td><td>0.601</td><td>0.510</td></tr>
								<tr><td>Credit Card</td><td><strong>0.325</strong></td><td>0.770</td><td>0.833</td></tr>
								<tr><td>Business</td><td><strong>0.236</strong></td><td>0.660</td><td>0.643</td></tr>
								<tr><td>Mortgage</td><td><strong>0.348</strong></td><td>1.663</td><td>1.490</td></tr>
								<tr><td>CRE</td><td><strong>0.135</strong></td><td>0.537</td><td>0.515</td></tr>
							</tbody>
						</table>
					</div>

					<p>ARIMA won. Every account. Not close.</p>
					<p>Xander didn&rsquo;t say anything for a while.</p>
					<Strip>
						<Say who="Xander">
							Maybe it&rsquo;s just how the coin landed. Maybe on a different week,
							we&rsquo;d have taken one.
						</Say>
					</Strip>
					<p>
						So Surya brought in a referee whose entire job is answering exactly
						that question: the <strong>Diebold-Mariano test</strong>,
						which looks at fifty-nine graded quarters and asks:{' '}
						<em>is this gap real, or did ARIMA just get lucky?</em>
					</p>
					<p>
						Across the series, models, and horizons, <strong>27 of 40 comparisons had reported p&lt;0.05</strong>, including all ten one-quarter-ahead comparisons. Fewer crossed that threshold at longer horizons. These are individual test results; an adjustment across the 40 tests is not documented here, so the count should not be read as proof that chance has been ruled out.
					</p>
					<p>
						But there wasn&rsquo;t a single one of the forty match-ups where the
						numbers leaned toward Xander or Gigi. Not once. Just some where the
						lead wasn&rsquo;t big enough yet to call it, officially, beyond doubt.
					</p>
				</ReadingSection>

				<ReadingSection eyebrow={<>Chapter 5</>} title={<>Two Things the Rookies Tried</>}>
					<p>Xander and Gigi didn&rsquo;t quit. They tried two things.</p>
					<p>
						<strong>First, they stopped competing separately and pooled what
						they knew.</strong> Instead of Xander learning Mortgage alone from
						its own 142 quarters, he learned from all five accounts at once,
						roughly 700 examples, telling them apart with a simple tag on
						each one: <em>this one&rsquo;s Mortgage, this one&rsquo;s
						CRE.</em> More to learn from. Shared patterns across accounts that
						move together.
					</p>
					<p>
						It helped. Genuinely. On four of the five accounts, the pooled
						version beat the solo version by a wide margin.
					</p>
					<p>It still didn&rsquo;t beat ARIMA. Not once.</p>
					<p>
						<strong>Second, they asked for a tutor.</strong> Twenty rounds of
						careful, honest tuning, searched for on the <em>early</em>{' '}
						three-quarters of their training history, tested only on the{' '}
						<em>untouched</em> final quarter of it, so the tutor couldn&rsquo;t
						quietly cheat either.
					</p>
					<p>
						The tutor helped Xander and Gigi in four of ten tries. In the other
						six, tutoring actually made things <em>worse</em>.
					</p>
					<Strip>
						<Say who="Gigi">
							That&rsquo;s&hellip; not encouraging.
						</Say>
						<Say who="Surya">
							It&rsquo;s honest, though. You don&rsquo;t have enough homework for a
							tutor to matter much. You&rsquo;d need a lot more of it before
							fine-tuning starts paying off reliably. That&rsquo;s not a flaw in
							you. It&rsquo;s arithmetic.
						</Say>
					</Strip>
				</ReadingSection>

				<ReadingSection eyebrow={<>Chapter 6</>} title={<>Asking Them What They Were Actually Looking At</>}>
					<p>
						There was one more thing Surya wanted to know. Not <em>how well</em>{' '}
						Xander and Gigi were guessing: <em>what they were even looking
						at</em> when they guessed.
					</p>
					<p>
						Surya used <strong>SHAP</strong> to attribute the tree models&rsquo; predictions to input features relative to a reference. This describes model behavior, not human-like reasoning or causal effects.
					</p>
					<p>
						The answer came back the same way, ten times out of ten, every
						account, both Xander and Gigi:
					</p>
					<div className="fh-insight">
						<span className="fh-insight-tag">What they were looking at</span>
						<p>
							<strong>Last quarter&rsquo;s number.</strong> It accounted for
							47–59% of the reported aggregate SHAP importance across the ten
							model/series combinations, not that share of every individual prediction.
						</p>
					</div>
					<p>Xander looked almost embarrassed.</p>
					<Strip>
						<Say who="Xander">
							That&rsquo;s&hellip; barely a model. That&rsquo;s just looking at
							yesterday.
						</Say>
						<Say who="Surya">
							It&rsquo;s not <em>just</em> that. You also glanced at the quarter
							before, and the one before that, and a two-year-back check, and the
							recent choppiness. But yes. Mostly, you were looking at yesterday.
						</Say>
					</Strip>
					<p>
						ARIMA also uses past observations, but these SHAP results describe Xander and Gigi. They do not measure ARIMA&rsquo;s feature contributions or prove that all three models learned the same relationship.
					</p>
					<p>
						The attribution gave Surya a useful clue about the tree models: the most recent quarter mattered most in this summary. Explaining the accuracy gap would require additional controlled comparisons.
					</p>
				</ReadingSection>

				<ReadingSection eyebrow={<>Chapter 7</>} title={<>The Verdict</>}>
					<p>
						One last thing needed checking: not who guessed{' '}
						<em>closer</em>, but who was honest about <em>how sure</em> they
						were.
					</p>
					<p>
						ARIMA said &ldquo;I&rsquo;m 95% confident the real number lands in
						this range,&rdquo; quarter after quarter. Checked against fifty-nine
						real outcomes, it was right <strong>98% to 100%</strong> of the time.
						If anything, a little <em>too</em> modest, a bit wider than it
						needed to be.
					</p>
					<p>
						Xander and Gigi tried to build their own version of that confidence,
						from their own track record of past misses. Checked the same way,
						their &ldquo;95% confident&rdquo; was actually right only{' '}
						<strong>75% to 83%</strong> of the time.
					</p>
					<p>
						That&rsquo;s not a small gap. That&rsquo;s a prediction interval that
						lies about itself, and it lies <em>hardest</em> exactly when a bank
						can least afford it. The two-decade run of data made clear
						that both the mess and the model&rsquo;s uncertainty about it get
						bigger right when a downturn is already happening. That&rsquo;s the
						one moment a &ldquo;95% confident&rdquo; range needs to actually mean
						it. Xander and Gigi&rsquo;s didn&rsquo;t, not yet.
					</p>
				</ReadingSection>

				<section className="fh-section">
					<p className="fh-lede">
						So here&rsquo;s the honest version of the story, the one that
						doesn&rsquo;t flatter anybody on purpose.
					</p>
					<p>
						ARIMA outperformed the two tree models in the reported comparison. A small dataset may favor a simpler model, but that is a possible explanation, not something the SHAP analysis proves. Feature attribution cannot rule out training, tuning, or feature-design limitations.
					</p>
					<div className="fh-insight fh-insight-final">
						<span className="fh-insight-tag">Bottom line</span>
						<p>
						The takeaway is to judge a model by its backtest, then treat explanations for its performance as hypotheses. New macroeconomic inputs, different features, or different model choices are candidates for further tests, not guaranteed improvements.
					</p>
					</div>
				</section>

				<p className="fh-synthetic-note mb-10">
					A full walk-forward backtest, complete with a caught-and-fixed data
					leakage bug, Diebold-Mariano significance testing, conformal prediction
					intervals, and SHAP interpretability. Full methodology, code, and
					results in the technical write-up and on{' '}
					<a href="https://github.com/Sreekaran1704/Loan-Default" target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
					.
				</p>
			</div>
		</div>
	);
}

export default LoanForecastingStory;
