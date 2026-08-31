import Link from 'next/link';
import PagesMetaHead from '../../../components/PagesMetaHead';

function LoanForecastingStory() {
	return (
		<div className="fh-page project-detail-page px-6 py-8 sm:px-10 lg:px-16">
			<PagesMetaHead
				title="The Forecast That Was Too Good To Be True: Loan Delinquency Case Study"
				description="A veteran ARIMA model, two eager ML rookies, a leak that almost fooled everyone, and the honest scoreboard that came after."
				keywords="time series forecasting, ARIMA, XGBoost, LightGBM, walk-forward backtesting, portfolio project"
			/>

			<div className="mx-auto max-w-4xl">
				<Link href="/projects" className="project-detail-back-btn mt-8">
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

				<section className="fh-section">
					<span className="fh-eyebrow">Chapter 1</span>
					<h2>The Veteran</h2>
					<p>
						ARIMA was old. Not &ldquo;outdated&rdquo; old. <em>Reliable</em> old.
						The kind of old that makes younger models nervous, because
						it&rsquo;s still right more often than they&rsquo;d like.
					</p>
					<p>
						ARIMA didn&rsquo;t need much. Three numbers, actually.{' '}
						<code>p</code>, <code>d</code>, <code>q</code>. That&rsquo;s it.
						That&rsquo;s the whole personality.
					</p>
					<p>&ldquo;That&rsquo;s <em>it</em>?&rdquo; someone always asked, the first time they saw it.</p>
					<p>
						&ldquo;That&rsquo;s it,&rdquo; ARIMA said. &ldquo;I look back a couple
						of quarters. I check if the trend needs smoothing out. And I write
						down what I see.&rdquo;
					</p>
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
					<p>ARIMA didn&rsquo;t just beat them. It embarrassed them.</p>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead>
								<tr><th>Account</th><th>ARIMA&rsquo;s error, as a fraction of the lazy guess&rsquo;s error</th></tr>
							</thead>
							<tbody>
								<tr><td>CRE</td><td><strong>0.135</strong> (errors 87% smaller)</td></tr>
								<tr><td>Business</td><td><strong>0.236</strong></td></tr>
								<tr><td>All Loans</td><td><strong>0.269</strong></td></tr>
								<tr><td>Credit Card</td><td><strong>0.325</strong></td></tr>
								<tr><td>Mortgage</td><td><strong>0.348</strong></td></tr>
							</tbody>
						</table>
					</div>

					<p>
						A number below 1.0 means &ldquo;better than the lazy guess.&rdquo;
						Every single account, every single quarter for thirty-five years, ARIMA
						was comfortably below 1.0.
					</p>
					<p>Nobody clapped. That&rsquo;s just what the job looked like, every quarter, for years.</p>
					<p>Then, one Tuesday, two new hires arrived.</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">Chapter 2</span>
					<h2>The Rookies</h2>
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
					<p>
						&ldquo;That&rsquo;s all you get,&rdquo; Surya said. &ldquo;No looking
						anywhere else. Same information ARIMA has, just handed to you
						differently.&rdquo;
					</p>
					<p>Xander cracked his knuckles. Gigi didn&rsquo;t say anything. She just started building trees.</p>
					<p>The first results came back.</p>
					<p>They were <em>stunning</em>. Numbers so good Surya actually sat back in the chair.</p>
					<p>They were also, it would turn out, a lie.</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">Chapter 3</span>
					<h2>Too Good to Be True</h2>
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
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">Chapter 4</span>
					<h2>The Honest Scoreboard</h2>

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
					<p>
						&ldquo;Maybe it&rsquo;s just how the coin landed,&rdquo; he finally
						said. &ldquo;Maybe on a different week, we&rsquo;d have taken one.&rdquo;
					</p>
					<p>
						So Surya brought in a referee whose entire job is answering exactly
						that question: the <strong>Diebold-Mariano test</strong>,
						which looks at fifty-nine graded quarters and asks:{' '}
						<em>is this gap real, or did ARIMA just get lucky?</em>
					</p>
					<p>
						The referee&rsquo;s verdict, across every account, every forecast
						horizon, both rookies: <strong>27 out of 40 times, not a
						coincidence.</strong> Real. Statistically real, at the strictest
						quarter-ahead call, every single time: ten out of ten. The
						verdict got a little less certain the further out they were asked to
						guess, which made sense; further out, everyone&rsquo;s guesses get
						noisier, ARIMA&rsquo;s included.
					</p>
					<p>
						But there wasn&rsquo;t a single one of the forty match-ups where the
						numbers leaned toward Xander or Gigi. Not once. Just some where the
						lead wasn&rsquo;t big enough yet to call it, officially, beyond doubt.
					</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">Chapter 5</span>
					<h2>Two Things the Rookies Tried</h2>
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
					<p>&ldquo;That&rsquo;s&hellip; not encouraging,&rdquo; Gigi said.</p>
					<p>
						&ldquo;It&rsquo;s honest, though,&rdquo; Surya said. &ldquo;You
						don&rsquo;t have enough homework for a tutor to matter much.
						You&rsquo;d need a lot more of it before fine-tuning starts paying
						off reliably. That&rsquo;s not a flaw in you. It&rsquo;s
						arithmetic.&rdquo;
					</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">Chapter 6</span>
					<h2>Asking Them What They Were Actually Looking At</h2>
					<p>
						There was one more thing Surya wanted to know. Not <em>how well</em>{' '}
						Xander and Gigi were guessing: <em>what they were even looking
						at</em> when they guessed.
					</p>
					<p>
						There&rsquo;s a technique for this. You don&rsquo;t ask the model. You
						watch it, very carefully, across every decision it makes, and add up
						which piece of information it leaned on the hardest. It&rsquo;s
						called <strong>SHAP</strong>, and it doesn&rsquo;t let a model lie
						about its own reasoning.
					</p>
					<p>
						The answer came back the same way, ten times out of ten, every
						account, both Xander and Gigi:
					</p>
					<div className="fh-insight">
						<span className="fh-insight-tag">What they were looking at</span>
						<p>
							<strong>Last quarter&rsquo;s number.</strong> Just that. Somewhere
							between 47% and 59% of their entire decision, every single time,
							was just: <em>what was it last quarter.</em>
						</p>
					</div>
					<p>
						Xander looked almost embarrassed. &ldquo;That&rsquo;s&hellip; barely a
						model. That&rsquo;s just looking at yesterday.&rdquo;
					</p>
					<p>
						&ldquo;It&rsquo;s not <em>just</em> that,&rdquo; Surya said. &ldquo;You
						also glanced at the quarter before, and the one before that, and a
						two-year-back check, and the recent choppiness. But yes. Mostly, you
						were looking at yesterday.&rdquo;
					</p>
					<p>
						Here&rsquo;s the quiet part nobody had said out loud yet:{' '}
						<strong>that&rsquo;s what ARIMA does too.</strong> ARIMA&rsquo;s whole
						equation <em>is</em> mostly &ldquo;yesterday, weighted
						correctly.&rdquo; It just writes that down directly, in three
						numbers, instead of discovering it the hard way across a few hundred
						trees and eighty training rows.
					</p>
					<p>
						Xander and Gigi hadn&rsquo;t been wrong. They&rsquo;d just spent a lot
						of machinery re-deriving something the veteran already had built into
						its bones on day one.
					</p>
				</section>

				<section className="fh-section">
					<span className="fh-eyebrow">Chapter 7</span>
					<h2>The Verdict</h2>
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
						That&rsquo;s not a small gap. That&rsquo;s a confidence interval that
						lies about itself, and it lies <em>hardest</em> exactly when a bank
						can least afford it. The two-decade run of data made clear
						that both the mess and the model&rsquo;s uncertainty about it get
						bigger right when a downturn is already happening. That&rsquo;s the
						one moment a &ldquo;95% confident&rdquo; range needs to actually mean
						it. Xander and Gigi&rsquo;s didn&rsquo;t, not yet.
					</p>
				</section>

				<section className="fh-section">
					<p className="fh-lede">
						So here&rsquo;s the honest version of the story, the one that
						doesn&rsquo;t flatter anybody on purpose.
					</p>
					<p>
						Classical ARIMA beat machine learning on this project, and it
						wasn&rsquo;t close. Significantly so on most accounts. Not
						because Xander and Gigi were bad at their jobs. Because with only
						about 140 quarters of history per account, a three-number model can
						be estimated reliably, while a model built from hundreds of
						tree-splits needs more life experience than that to find anything
						ARIMA hadn&rsquo;t already found. SHAP just made it official: both of
						them, veteran and rookies alike, were leaning on the same one thing.
					</p>
					<div className="fh-insight fh-insight-final">
						<span className="fh-insight-tag">Bottom line</span>
						<p>
							The honest takeaway isn&rsquo;t &ldquo;machine learning is
							bad.&rdquo; It&rsquo;s &ldquo;the tool has to match the size of the
							job.&rdquo; Xander and Gigi didn&rsquo;t need a better trick. They
							needed more to learn from, not more clever ways to slice the
							same 140 quarters. Real, new information. A regressor ARIMA never
							had access to either. Unemployment, maybe. A rate curve. Something
							the veteran couldn&rsquo;t see coming from three numbers alone.
						</p>
					</div>
				</section>

				<p className="fh-synthetic-note mb-10">
					A full walk-forward backtest, complete with a caught-and-fixed data
					leakage bug, Diebold-Mariano significance testing, conformal prediction
					intervals, and SHAP interpretability. Full methodology, code, and
					results in the technical write-up and on{' '}
					<a href="https://github.com/Sreekaran1704/Loan-Default" target="_blank" rel="noopener noreferrer" style={{ color: '#312e81' }}>
						GitHub
					</a>
					.
				</p>
			</div>
		</div>
	);
}

export default LoanForecastingStory;
