import Link from 'next/link';
import PagesMetaHead from '../../../components/PagesMetaHead';

function LoanForecastingTechnical() {
	return (
		<div className="fh-page project-detail-page px-6 py-8 sm:px-10 lg:px-16">
			<PagesMetaHead
				title="ARIMA vs. XGBoost vs. LightGBM: Technical Write-Up"
				description="Full methodology: ARIMA order search, walk-forward backtesting, a caught-and-fixed data leakage bug, Diebold-Mariano significance testing, conformal prediction intervals, and SHAP interpretability."
				keywords="time series forecasting, ARIMA, XGBoost, LightGBM, walk-forward backtesting, Diebold-Mariano, SHAP, portfolio project"
			/>

			<div className="mx-auto max-w-4xl">
				<Link href="/projects" className="project-detail-back-btn mt-8">
					← Back to Projects
				</Link>

				<nav className="fh-version-switch mt-6" aria-label="Versions of this write-up">
					<span className="fh-version-switch-label">Two ways to read this</span>
					<span className="fh-version-switch-options">
						<Link href="/projects/loan-default-forecasting" className="fh-version-pill">
							The story
						</Link>
						<span className="fh-version-pill fh-version-pill-current" aria-current="page">
							Technical
						</span>
					</span>
				</nav>

				<header className="fh-hero mt-6">
					<span className="fh-eyebrow">Time-Series Forecasting Case Study · Technical</span>
					<h1 className="fh-hero-title">ARIMA vs. XGBoost vs. LightGBM: A Full Walk-Forward Comparison</h1>
					<p className="fh-hero-lede">
						Five FRED loan-delinquency series, an identical walk-forward backtest
						for every model, a data-leakage bug caught before any result was
						trusted, and a formal significance test on what&rsquo;s left after
						the leak is fixed.
					</p>

					<div className="fh-hero-stats">
						<div className="fh-hero-stat">
							<span className="fh-hero-stat-value">5<span className="fh-hero-stat-unit">/5</span></span>
							<span className="fh-hero-stat-label">accounts where ARIMA beat both ML models</span>
						</div>
						<div className="fh-hero-stat">
							<span className="fh-hero-stat-value">27<span className="fh-hero-stat-unit">/40</span></span>
							<span className="fh-hero-stat-label">statistically significant (Diebold-Mariano, p&lt;0.05)</span>
						</div>
						<div className="fh-hero-stat">
							<span className="fh-hero-stat-value">142</span>
							<span className="fh-hero-stat-label">quarterly observations per account, 1991–2026</span>
						</div>
					</div>

					<p className="fh-hero-byline">By Sreekaran · Time-Series Forecasting &amp; Applied ML Project</p>
				</header>

				{/* Executive summary */}
				<section className="fh-section">
					<span className="fh-eyebrow">Where This Is Going</span>
					<p className="fh-lede">
						A classical ARIMA baseline was tested, honestly, against XGBoost and
						LightGBM on real quarterly loan-delinquency data: same walk-forward
						evaluation for every model, real significance testing, and no result
						trusted until it survived scrutiny. A leakage bug in the first ML
						implementation produced an implausibly good early result; once fixed,
						ARIMA won every comparison, and SHAP explains why.
					</p>

					<ol className="fh-finding-list">
						<li>
							<strong>ARIMA beat XGBoost and LightGBM on all five FRED
								loan-delinquency series</strong>, walk-forward backtested with
							an identical evaluation protocol for every model.
						</li>
						<li>
							<strong>A real data-leakage bug was caught before any ML result
								was trusted</strong>: a boundary condition in the direct-horizon
							target construction let a handful of training rows see their own
							test-window answer. Fixed and covered by a regression test.
						</li>
						<li>
							<strong>ARIMA&rsquo;s advantage is statistically significant in 27
								of 40 series/model/horizon comparisons</strong> (Diebold-Mariano,
							Harvey-Leybourne-Newbold corrected), universal at the 1-quarter
							horizon and fading at longer horizons.
						</li>
						<li>
							<strong>SHAP interpretability shows why</strong>: in all 10 of 10
							series/model combinations, the single most recent lag carries
							47–59% of total feature importance: both approaches lean on
							essentially the same signal, and ARIMA simply expresses it more
							efficiently on ~140 rows than a tree ensemble can.
						</li>
					</ol>
				</section>

				{/* Data & method */}
				<section className="fh-section">
					<span className="fh-eyebrow">Data &amp; Evaluation Protocol</span>
					<h2>Five accounts, one evaluation rule for every model</h2>
					<p>
						Data: FRED, quarterly, 1991-01-01 through 2026-04-01 (142
						observations per series), truncated to that range at pull time.
					</p>

					<dl className="fh-spec-list">
						<div className="fh-spec-row">
							<dt>Series</dt>
							<dd>DRALACBS (All Loans), DRCCLACBS (Credit Card), DRBLACBS (Business), DRSFRMACBS (Mortgage), DRCRELEXFACBS (CRE)</dd>
						</div>
						<div className="fh-spec-row">
							<dt>Backtest window</dt>
							<dd><code>min_train_size = 80</code>, <code>h = 4</code> quarters ahead, expanding window, refit every fold: 59 graded folds per series</dd>
						</div>
						<div className="fh-spec-row">
							<dt>Benchmarks</dt>
							<dd>Seasonal-naive (lag-4) and simple-naive (lag-1)</dd>
						</div>
						<div className="fh-spec-row">
							<dt>Scoring metric</dt>
							<dd>MASE: mean absolute error of the model, divided by mean absolute error of the naive benchmark, averaged per fold</dd>
						</div>
					</dl>

					<div className="fh-formula-block">
						<span className="fh-formula-label">MASE (per fold, vs. a given naive benchmark)</span>
						<p className="fh-formula">
							MASE <span className="fh-formula-op">=</span> mean(|actual <span className="fh-formula-op">−</span> predicted|) <span className="fh-formula-op">/</span> mean(|naive benchmark error|)
						</p>
					</div>

					<p>
						Below 1.0 means the model beats the naive benchmark. Every model in
						this study (ARIMA, XGBoost, and LightGBM) is scored on the exact
						same 59 folds per series, so every number that follows is directly
						comparable across models.
					</p>

					<figure className="fh-image-figure">
						<img src="/images/loan-forecast-1.jpg" alt="Loan delinquency rate by category, 1991 to 2026, with NBER recession bands" />
						<figcaption>All five series, 1991–2026, with NBER recession windows shaded. Trend dominates over seasonality in every series; variance visibly expands during the 2008–2010 and 2020 windows.</figcaption>
					</figure>
				</section>

				{/* Phase 1 */}
				<section className="fh-section">
					<span className="fh-eyebrow">Phase 1 · Exploratory Analysis</span>
					<h2>Stationarity, autocorrelation, decomposition</h2>
					<p>
						ADF (H<sub>0</sub>: unit root) and KPSS (H<sub>0</sub>: stationary)
						were run on each raw series, at the conventional α = 0.05:
					</p>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead>
								<tr><th>Series</th><th>ADF p</th><th>KPSS p</th><th>Verdict</th></tr>
							</thead>
							<tbody>
								<tr><td>All Loans</td><td className="fh-num">0.256</td><td className="fh-num">0.100</td><td>Conflicting</td></tr>
								<tr><td>Credit Card</td><td className="fh-num">0.690</td><td className="fh-num">0.010</td><td>Both: non-stationary</td></tr>
								<tr><td>Business</td><td className="fh-num">0.007</td><td className="fh-num">0.010</td><td>Conflicting</td></tr>
								<tr><td>Mortgage</td><td className="fh-num">0.390</td><td className="fh-num">0.100</td><td>Conflicting</td></tr>
								<tr><td>CRE</td><td className="fh-num">0.003</td><td className="fh-num">0.004</td><td>Conflicting</td></tr>
							</tbody>
						</table>
					</div>

					<p>
						A conflicting ADF/KPSS verdict typically indicates trend-stationary
						behavior rather than test failure: real short-run mean reversion
						riding on top of longer, crisis-driven trend moves. ACF/PACF showed
						the classic AR signature (sharp PACF cutoff after lag 1–2, gradually
						decaying ACF) in every series, motivating AR(2) as the initial order
						guess for All Loans/Business/Credit Card/Mortgage and AR(1) for CRE.
						STL decomposition (period=4) confirmed trend dominates seasonality by
						an order of magnitude in every series, with both seasonal amplitude
						and residual variance expanding specifically during crisis windows,
						evidence of heteroscedasticity that motivated using conformal,
						error-history-based prediction intervals for the ML models rather than
						a fixed-variance assumption (see Prediction Intervals, below).
					</p>
					<p className="fh-synthetic-note">
						Full EDA write-up, all five ACF/PACF and STL plots: <code>docs/phase1_eda.md</code> in the project repository.
					</p>
				</section>

				{/* Phase 2 */}
				<section className="fh-section">
					<span className="fh-eyebrow">Phase 2 · Classical ARIMA Baseline</span>
					<h2>Per-series order search, diagnostics, backtest</h2>
					<p>
						Per series: a 5-candidate order grid built around the AR guess:{' '}
						<code>(p,0,0)</code>, <code>(p,1,0)</code>, <code>(p,0,1)</code>,{' '}
						<code>(p,1,1)</code>, <code>(p+1,1,0)</code>, fit by maximum
						likelihood, lowest-AIC order selected, then walk-forward backtested.
					</p>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead>
								<tr><th>Series</th><th>Best order</th><th>Ljung-Box p (lag 4/8/12)</th><th className="fh-num">MASE vs. seasonal-naive</th><th className="fh-num">MASE vs. simple-naive</th></tr>
							</thead>
							<tbody>
								<tr><td>All Loans</td><td>(2,0,0)</td><td>0.978 / 0.996 / 0.999</td><td className="fh-num">0.269</td><td className="fh-num">1.022</td></tr>
								<tr><td>Credit Card</td><td>(2,1,0)</td><td>0.975 / 0.999 / 0.999</td><td className="fh-num">0.325</td><td className="fh-num">1.001</td></tr>
								<tr><td>Business</td><td>(2,1,0)</td><td>0.989 / 0.999 / 1.000</td><td className="fh-num">0.236</td><td className="fh-num">0.866</td></tr>
								<tr><td>Mortgage</td><td>(2,1,0)</td><td>0.986 / 0.977 / 0.991</td><td className="fh-num">0.348</td><td className="fh-num">1.148</td></tr>
								<tr><td>CRE</td><td>(1,1,0)</td><td>0.994 / 1.000 / 1.000</td><td className="fh-num">0.135</td><td className="fh-num">0.524</td></tr>
							</tbody>
						</table>
					</div>

					<p>
						All five pass Ljung-Box comfortably at every lag, no significant
						residual autocorrelation left unmodeled. One caveat worth stating
						plainly: by the conventional Burnham &amp; Anderson rule of thumb
						(ΔAIC &lt; 2 implies no decisive separation), four of the five
						winning orders are <em>not</em> decisively separated from their
						runner-up. CRE is the exception, and not on the top-two orders:
						it&rsquo;s <code>d=1</code> vs. <code>d=0</code>. ΔAIC of over 220,
						an unambiguous signal despite CRE&rsquo;s formally ambiguous
						ADF/KPSS verdict above.
					</p>

					<div className="fh-result-line">
						ARIMA&rsquo;s native 95% confidence intervals, walk-forward backtested: 97.9%–100% empirical coverage across the five series.
					</div>
				</section>

				{/* Phase 3: features + leakage bug */}
				<section className="fh-section">
					<span className="fh-eyebrow">Phase 3 · ML Pipeline</span>
					<h2>Feature construction and direct-horizon models</h2>
					<p>
						Univariate only: lags and rolling statistics of each target series
						itself, no exogenous variables, for the cleanest possible
						apples-to-apples comparison against ARIMA:
					</p>

					<dl className="fh-spec-list">
						<div className="fh-spec-row">
							<dt>Lags</dt>
							<dd><code>[1, 2, 3, 4, 8]</code> quarters: 1–4 covers the AR order Phase 2 already selected as best; 8 gives a 2-year lookback</dd>
						</div>
						<div className="fh-spec-row">
							<dt>Rolling features</dt>
							<dd>4-quarter trailing mean and standard deviation</dd>
						</div>
						<div className="fh-spec-row">
							<dt>Forecast strategy</dt>
							<dd>Direct, per-horizon: one model trained per forecast step (h=1..4), not recursive; no error compounding across the horizon</dd>
						</div>
						<div className="fh-spec-row">
							<dt>Model scope</dt>
							<dd>Per-series (5 independent models) and one global model pooling all 5 series with a one-hot <code>series_id</code> feature</dd>
						</div>
						<div className="fh-spec-row">
							<dt>Hyperparameters</dt>
							<dd><code>max_depth=3</code>, <code>learning_rate=0.05</code>, subsampling, L2 regularization: shallow and regularized by design, given ~80–140 rows per fold</dd>
						</div>
					</dl>

					<h3>The bug: direct-horizon target leakage</h3>
					<p>
						<code>target_h{'{h}'} = value.shift(-h)</code> only produces{' '}
						<code>NaN</code> at the tail of the entire series, never at a fold
						boundary. The first implementation trained on every row in a fold&rsquo;s
						training window, including the last <code>h</code> rows, whose targets
						land at positions <code>i, i+1, &hellip;, i+h-1</code>, inside that
						same fold&rsquo;s own test window.
					</p>

					<div className="fh-formula-block">
						<span className="fh-formula-label">The fix</span>
						<p className="fh-formula">
							usable_train_idx <span className="fh-formula-op">=</span> train_idx[train_idx <span className="fh-formula-op">+</span> step_ahead <span className="fh-formula-op">&le;</span> train_idx[-1]]
						</p>
					</div>

					<p>
						Caught because an early Optuna tuning run produced an implausible
						result: one series&rsquo; outer-fold MASE dropped from a plausible
						0.18 to 0.025 after only 5 trials. Verified directly (a fold&rsquo;s
						last training row&rsquo;s target position exceeded the fold&rsquo;s
						own cutoff), fixed with the guard above, and pinned down with a
						dedicated regression test so it can&rsquo;t silently reappear.
					</p>
					<div className="fh-result-line fh-result-line-warn">
						Every result below is post-fix. Nothing leakage-affected is reported anywhere in this write-up.
					</div>
				</section>

				{/* Results */}
				<section className="fh-section">
					<span className="fh-eyebrow">Results</span>
					<h2>MASE vs. seasonal-naive, all five series</h2>

					<figure className="fh-chart-figure">
						<svg viewBox="0 0 720 400" className="fh-chart" role="img" aria-labelledby="chartA-title chartA-desc">
							<title id="chartA-title">MASE vs. seasonal-naive: ARIMA, XGBoost, and LightGBM by account</title>
							<desc id="chartA-desc">ARIMA scores lowest (best) on all five accounts: All Loans 0.269 vs. 0.601/0.510; Credit Card 0.325 vs. 0.770/0.833; Business 0.236 vs. 0.660/0.643; Mortgage 0.348 vs. 1.663/1.490; CRE 0.135 vs. 0.537/0.515.</desc>

							<line x1="60" y1="60" x2="60" y2="340" className="fh-chart-axis" />
							<line x1="60" y1="340" x2="700" y2="340" className="fh-chart-axis" />
							<line x1="60" y1="340.0" x2="700" y2="340.0" className="fh-chart-grid" />
							<text x="52" y="344.0" className="fh-chart-tick" textAnchor="end">0</text>
							<line x1="60" y1="262.2" x2="700" y2="262.2" className="fh-chart-grid" />
							<text x="52" y="266.2" className="fh-chart-tick" textAnchor="end">0.5</text>
							<line x1="60" y1="184.4" x2="700" y2="184.4" className="fh-chart-grid" />
							<text x="52" y="188.4" className="fh-chart-tick" textAnchor="end">1.0</text>
							<line x1="60" y1="106.7" x2="700" y2="106.7" className="fh-chart-grid" />
							<text x="52" y="110.7" className="fh-chart-tick" textAnchor="end">1.5</text>
							<rect x="60" y="22" width="12" height="12" className="fh-bar-good" />
							<text x="78" y="32" className="fh-chart-group-label">ARIMA</text>
							<rect x="190" y="22" width="12" height="12" className="fh-bar-control" />
							<text x="208" y="32" className="fh-chart-group-label">XGBoost</text>
							<rect x="320" y="22" width="12" height="12" className="fh-bar-treatment" />
							<text x="338" y="32" className="fh-chart-group-label">LightGBM</text>
							<rect x="82.0" y="298.2" width="24" height="41.8" className="fh-bar-good" />
							<text x="94.0" y="292.2" className="fh-chart-value" textAnchor="middle">0.269</text>
							<rect x="112.0" y="246.5" width="24" height="93.5" className="fh-bar-control" />
							<text x="124.0" y="240.5" className="fh-chart-value" textAnchor="middle">0.601</text>
							<rect x="142.0" y="260.7" width="24" height="79.3" className="fh-bar-treatment" />
							<text x="154.0" y="254.7" className="fh-chart-value" textAnchor="middle">0.510</text>
							<text x="124.0" y="362" className="fh-chart-tick" textAnchor="middle">All Loans</text>
							<rect x="210.0" y="289.4" width="24" height="50.6" className="fh-bar-good" />
							<text x="222.0" y="283.4" className="fh-chart-value" textAnchor="middle">0.325</text>
							<rect x="240.0" y="220.2" width="24" height="119.8" className="fh-bar-control" />
							<text x="252.0" y="214.2" className="fh-chart-value" textAnchor="middle">0.770</text>
							<rect x="270.0" y="210.4" width="24" height="129.6" className="fh-bar-treatment" />
							<text x="282.0" y="204.4" className="fh-chart-value" textAnchor="middle">0.833</text>
							<text x="252.0" y="362" className="fh-chart-tick" textAnchor="middle">Credit Card</text>
							<rect x="338.0" y="303.3" width="24" height="36.7" className="fh-bar-good" />
							<text x="350.0" y="297.3" className="fh-chart-value" textAnchor="middle">0.236</text>
							<rect x="368.0" y="237.3" width="24" height="102.7" className="fh-bar-control" />
							<text x="380.0" y="231.3" className="fh-chart-value" textAnchor="middle">0.660</text>
							<rect x="398.0" y="240.0" width="24" height="100.0" className="fh-bar-treatment" />
							<text x="410.0" y="234.0" className="fh-chart-value" textAnchor="middle">0.643</text>
							<text x="380.0" y="362" className="fh-chart-tick" textAnchor="middle">Business</text>
							<rect x="466.0" y="285.9" width="24" height="54.1" className="fh-bar-good" />
							<text x="478.0" y="279.9" className="fh-chart-value" textAnchor="middle">0.348</text>
							<rect x="496.0" y="81.3" width="24" height="258.7" className="fh-bar-control" />
							<text x="508.0" y="75.3" className="fh-chart-value" textAnchor="middle">1.663</text>
							<rect x="526.0" y="108.2" width="24" height="231.8" className="fh-bar-treatment" />
							<text x="538.0" y="102.2" className="fh-chart-value" textAnchor="middle">1.490</text>
							<text x="508.0" y="362" className="fh-chart-tick" textAnchor="middle">Mortgage</text>
							<rect x="594.0" y="319.0" width="24" height="21.0" className="fh-bar-good" />
							<text x="606.0" y="313.0" className="fh-chart-value" textAnchor="middle">0.135</text>
							<rect x="624.0" y="256.5" width="24" height="83.5" className="fh-bar-control" />
							<text x="636.0" y="250.5" className="fh-chart-value" textAnchor="middle">0.537</text>
							<rect x="654.0" y="259.9" width="24" height="80.1" className="fh-bar-treatment" />
							<text x="666.0" y="253.9" className="fh-chart-value" textAnchor="middle">0.515</text>
							<text x="636.0" y="362" className="fh-chart-tick" textAnchor="middle">CRE</text>
						</svg>
						<figcaption>MASE vs. seasonal-naive (lower is better). ARIMA (olive) is lowest on every account.</figcaption>
					</figure>

					<p>
						Pooling all five series into one global model (one-hot{' '}
						<code>series_id</code>) helped both ML models on 4 of 5 accounts
						over their own per-series version (more effective training rows),
						but did not close the gap to ARIMA on any account:
					</p>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead>
								<tr><th>Account</th><th className="fh-num">XGBoost (per-series)</th><th className="fh-num">XGBoost (global)</th><th className="fh-num">LightGBM (per-series)</th><th className="fh-num">LightGBM (global)</th></tr>
							</thead>
							<tbody>
								<tr><td>All Loans</td><td className="fh-num">0.601</td><td className="fh-num">0.405</td><td className="fh-num">0.510</td><td className="fh-num">0.410</td></tr>
								<tr><td>Credit Card</td><td className="fh-num">0.770</td><td className="fh-num">0.677</td><td className="fh-num">0.833</td><td className="fh-num">0.705</td></tr>
								<tr><td>Business</td><td className="fh-num">0.660</td><td className="fh-num">0.646</td><td className="fh-num">0.643</td><td className="fh-num">0.651</td></tr>
								<tr><td>Mortgage</td><td className="fh-num">1.663</td><td className="fh-num">0.935</td><td className="fh-num">1.490</td><td className="fh-num">1.081</td></tr>
								<tr><td>CRE</td><td className="fh-num">0.537</td><td className="fh-num">0.377</td><td className="fh-num">0.515</td><td className="fh-num">0.394</td></tr>
							</tbody>
						</table>
					</div>
				</section>

				{/* Significance testing */}
				<section className="fh-section">
					<span className="fh-eyebrow">Statistical Significance</span>
					<h2>Diebold-Mariano test: is ARIMA&rsquo;s edge real?</h2>
					<p>
						The Diebold-Mariano test compares two models&rsquo; forecast-loss
						series and asks whether the difference is real or within sampling
						noise. With only ~59 folds per series (not thousands), the
						Harvey-Leybourne-Newbold small-sample correction was applied, using
						a Newey-West-style long-run variance with <code>h-1</code> lags to
						account for the serial correlation h-step-ahead forecast errors
						carry.
					</p>

					<div className="fh-formula-block">
						<span className="fh-formula-label">DM statistic (HLN-corrected)</span>
						<p className="fh-formula">
							DM <span className="fh-formula-op">=</span> mean(d) <span className="fh-formula-op">/</span> √(long-run-var(d) <span className="fh-formula-op">/</span> T)<span className="fh-formula-sep">,&nbsp;&nbsp;</span> d<span className="fh-formula-sub">t</span> <span className="fh-formula-op">=</span> loss(e<span className="fh-formula-sub">1,t</span>) <span className="fh-formula-op">−</span> loss(e<span className="fh-formula-sub">2,t</span>)
						</p>
					</div>

					<p>
						Run per series × model × horizon (40 comparisons, 59 folds each).
						<strong> ARIMA is significantly more accurate (p&lt;0.05) in 27 of 40
							comparisons</strong>, and directionally favored in all 40 of 40:
						the non-significant cells are &ldquo;not proven at 5%,&rdquo; never
						reversed.
					</p>

					<figure className="fh-chart-figure">
						<svg viewBox="0 0 720 360" className="fh-chart" role="img" aria-labelledby="chartC-title chartC-desc">
							<title id="chartC-title">Diebold-Mariano significance count by forecast horizon</title>
							<desc id="chartC-desc">Significant comparisons out of 10 per horizon: h=1, 10; h=2, 8; h=3, 5; h=4, 4. Significance fades monotonically with horizon.</desc>

							<line x1="60" y1="60" x2="60" y2="310" className="fh-chart-axis" />
							<line x1="60" y1="310" x2="700" y2="310" className="fh-chart-axis" />
							<line x1="60" y1="310.0" x2="700" y2="310.0" className="fh-chart-grid" />
							<text x="52" y="314.0" className="fh-chart-tick" textAnchor="end">0</text>
							<line x1="60" y1="196.4" x2="700" y2="196.4" className="fh-chart-grid" />
							<text x="52" y="200.4" className="fh-chart-tick" textAnchor="end">5</text>
							<line x1="60" y1="82.7" x2="700" y2="82.7" className="fh-chart-grid" />
							<text x="52" y="86.7" className="fh-chart-tick" textAnchor="end">10</text>
							<rect x="60" y="22" width="12" height="12" className="fh-bar-good" />
							<text x="78" y="32" className="fh-chart-group-label">Significant (p&lt;0.05)</text>
							<rect x="190" y="22" width="12" height="12" className="fh-bar-control" />
							<text x="208" y="32" className="fh-chart-group-label">Not significant</text>
							<rect x="113.0" y="82.7" width="24" height="227.3" className="fh-bar-good" />
							<text x="125.0" y="76.7" className="fh-chart-value" textAnchor="middle">10</text>
							<rect x="143.0" y="310.0" width="24" height="0.0" className="fh-bar-control" />
							<text x="155.0" y="304.0" className="fh-chart-value" textAnchor="middle">0</text>
							<text x="140.0" y="332" className="fh-chart-tick" textAnchor="middle">h=1</text>
							<rect x="273.0" y="128.2" width="24" height="181.8" className="fh-bar-good" />
							<text x="285.0" y="122.2" className="fh-chart-value" textAnchor="middle">8</text>
							<rect x="303.0" y="264.5" width="24" height="45.5" className="fh-bar-control" />
							<text x="315.0" y="258.5" className="fh-chart-value" textAnchor="middle">2</text>
							<text x="300.0" y="332" className="fh-chart-tick" textAnchor="middle">h=2</text>
							<rect x="433.0" y="196.4" width="24" height="113.6" className="fh-bar-good" />
							<text x="445.0" y="190.4" className="fh-chart-value" textAnchor="middle">5</text>
							<rect x="463.0" y="196.4" width="24" height="113.6" className="fh-bar-control" />
							<text x="475.0" y="190.4" className="fh-chart-value" textAnchor="middle">5</text>
							<text x="460.0" y="332" className="fh-chart-tick" textAnchor="middle">h=3</text>
							<rect x="593.0" y="219.1" width="24" height="90.9" className="fh-bar-good" />
							<text x="605.0" y="213.1" className="fh-chart-value" textAnchor="middle">4</text>
							<rect x="623.0" y="173.6" width="24" height="136.4" className="fh-bar-control" />
							<text x="635.0" y="167.6" className="fh-chart-value" textAnchor="middle">6</text>
							<text x="620.0" y="332" className="fh-chart-tick" textAnchor="middle">h=4</text>
						</svg>
						<figcaption>Significant comparisons out of 10, per forecast horizon. Every fold count is identical (59); this is the forecasting problem getting genuinely harder to call at longer horizons, not a shrinking-sample artifact.</figcaption>
					</figure>

					<p>
						Series-level pattern: Business (LightGBM) and Mortgage (XGBoost) go
						4-for-4 significant; Credit Card loses significance cleanly at h=3/h=4
						on both models; All Loans is the weakest of the five, with LightGBM
						losing significance starting at h=2.
					</p>
				</section>

				{/* Intervals */}
				<section className="fh-section">
					<span className="fh-eyebrow">Prediction Intervals</span>
					<h2>Native ARIMA intervals vs. walk-forward conformal</h2>
					<p>
						ARIMA gets calibrated intervals almost for free via{' '}
						<code>get_forecast().conf_int()</code>. Tree models don&rsquo;t: a
						walk-forward-safe split-conformal method was used instead: the
						interval half-width for horizon h is the (1&minus;α)-quantile of{' '}
						<em>that horizon&rsquo;s past absolute errors only</em> (folds
						strictly before the current one), so there&rsquo;s no leakage into
						the interval itself, on top of the point-forecast leakage guard
						above.
					</p>

					<figure className="fh-image-figure">
						<img src="/images/loan-forecast-3.jpg" alt="All Loans one-quarter-ahead backtest with 95 percent prediction interval, ARIMA versus XGBoost conformal" />
						<figcaption>All Loans, 1-quarter-ahead backtest. ARIMA&rsquo;s native interval (left) visibly brackets the actual series more consistently than XGBoost&rsquo;s conformal interval (right).</figcaption>
					</figure>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead>
								<tr><th></th><th className="fh-num">ARIMA (native)</th><th className="fh-num">XGBoost (conformal)</th><th className="fh-num">LightGBM (conformal)</th></tr>
							</thead>
							<tbody>
								<tr><td>Coverage of nominal 95%</td><td className="fh-num">0.979–1.000</td><td className="fh-num">0.750–0.826</td><td className="fh-num">0.775–0.826</td></tr>
							</tbody>
						</table>
					</div>

					<div className="fh-result-line fh-result-line-warn">
						An honest limitation, not a bug: the ML conformal intervals under-cover meaningfully against their 95% target, roughly 1-in-4 to 1-in-5 quarters land outside the stated band instead of 1-in-20. For a use case like loan-loss provisioning, that gap between stated and actual confidence is a real problem, independent of the point-forecast result above.
					</div>
				</section>

				{/* SHAP */}
				<section className="fh-section">
					<span className="fh-eyebrow">Interpretability</span>
					<h2>SHAP: what are the models actually looking at?</h2>
					<p>
						One final model per horizon, fit on all available history (there&rsquo;s
						no future fold left to hold out for a model meant for actual
						deployment), explained with <code>shap.TreeExplainer</code>.
					</p>

					<figure className="fh-chart-figure">
						<svg viewBox="0 0 720 380" className="fh-chart" role="img" aria-labelledby="chartB-title chartB-desc">
							<title id="chartB-title">Share of total SHAP importance held by the single most recent lag</title>
							<desc id="chartB-desc">value_lag1 share of total importance, by account and model: All Loans 49%/47%, Credit Card 55%/57%, Business 53%/55%, Mortgage 58%/59%, CRE 54%/57% (XGBoost/LightGBM).</desc>

							<line x1="60" y1="60" x2="60" y2="330" className="fh-chart-axis" />
							<line x1="60" y1="330" x2="700" y2="330" className="fh-chart-axis" />
							<line x1="60" y1="330.0" x2="700" y2="330.0" className="fh-chart-grid" />
							<text x="52" y="334.0" className="fh-chart-tick" textAnchor="end">0</text>
							<line x1="60" y1="233.6" x2="700" y2="233.6" className="fh-chart-grid" />
							<text x="52" y="237.6" className="fh-chart-tick" textAnchor="end">25</text>
							<line x1="60" y1="137.1" x2="700" y2="137.1" className="fh-chart-grid" />
							<text x="52" y="141.1" className="fh-chart-tick" textAnchor="end">50</text>
							<rect x="60" y="22" width="12" height="12" className="fh-bar-control" />
							<text x="78" y="32" className="fh-chart-group-label">XGBoost</text>
							<rect x="190" y="22" width="12" height="12" className="fh-bar-treatment" />
							<text x="208" y="32" className="fh-chart-group-label">LightGBM</text>
							<rect x="97.0" y="140.6" width="24" height="189.4" className="fh-bar-control" />
							<text x="109.0" y="134.6" className="fh-chart-value" textAnchor="middle">49%</text>
							<rect x="127.0" y="149.9" width="24" height="180.1" className="fh-bar-treatment" />
							<text x="139.0" y="143.9" className="fh-chart-value" textAnchor="middle">47%</text>
							<text x="124.0" y="352" className="fh-chart-tick" textAnchor="middle">All Loans</text>
							<rect x="225.0" y="119.0" width="24" height="211.0" className="fh-bar-control" />
							<text x="237.0" y="113.0" className="fh-chart-value" textAnchor="middle">55%</text>
							<rect x="255.0" y="111.7" width="24" height="218.3" className="fh-bar-treatment" />
							<text x="267.0" y="105.7" className="fh-chart-value" textAnchor="middle">57%</text>
							<text x="252.0" y="352" className="fh-chart-tick" textAnchor="middle">Credit Card</text>
							<rect x="353.0" y="127.1" width="24" height="202.9" className="fh-bar-control" />
							<text x="365.0" y="121.1" className="fh-chart-value" textAnchor="middle">53%</text>
							<rect x="383.0" y="118.6" width="24" height="211.4" className="fh-bar-treatment" />
							<text x="395.0" y="112.6" className="fh-chart-value" textAnchor="middle">55%</text>
							<text x="380.0" y="352" className="fh-chart-tick" textAnchor="middle">Business</text>
							<rect x="481.0" y="106.3" width="24" height="223.7" className="fh-bar-control" />
							<text x="493.0" y="100.3" className="fh-chart-value" textAnchor="middle">58%</text>
							<rect x="511.0" y="104.0" width="24" height="226.0" className="fh-bar-treatment" />
							<text x="523.0" y="98.0" className="fh-chart-value" textAnchor="middle">59%</text>
							<text x="508.0" y="352" className="fh-chart-tick" textAnchor="middle">Mortgage</text>
							<rect x="609.0" y="121.7" width="24" height="208.3" className="fh-bar-control" />
							<text x="621.0" y="115.7" className="fh-chart-value" textAnchor="middle">54%</text>
							<rect x="639.0" y="110.1" width="24" height="219.9" className="fh-bar-treatment" />
							<text x="651.0" y="104.1" className="fh-chart-value" textAnchor="middle">57%</text>
							<text x="636.0" y="352" className="fh-chart-tick" textAnchor="middle">CRE</text>
						</svg>
						<figcaption><code>value_lag1</code>&rsquo;s share of total SHAP importance: the single most recent quarter, nothing else, at 47–59% of the entire decision, in all 10 of 10 series/model combinations.</figcaption>
					</figure>

					<p>
						This is the mechanism behind the significance results above: ARIMA
						and the ML models converge on the same signal, but ARIMA writes it
						down directly in its coefficients while the tree ensembles spend a
						few hundred splits and ~80–140 training rows rediscovering roughly
						the same relationship.
					</p>
				</section>

				{/* Tuning */}
				<section className="fh-section">
					<span className="fh-eyebrow">Hyperparameter Tuning</span>
					<h2>Nested Optuna search: does tuning actually help here?</h2>
					<p>
						The fold sequence for each series was split by time order (not
						randomly) into the earliest ~70% (<strong>inner</strong>, 41 folds:
						Optuna searched here, 20 trials, minimizing mean backtest MAE) and
						the latest ~30% (<strong>outer</strong>, 18 folds, never touched by
						the search). Both fixed-default and tuned numbers below are
						evaluated on the same untouched outer folds.
					</p>

					<div className="fh-table-wrap">
						<table className="fh-table">
							<thead>
								<tr><th>Account</th><th>Model</th><th className="fh-num">Fixed-default</th><th className="fh-num">Tuned</th><th>Helped?</th></tr>
							</thead>
							<tbody>
								<tr><td>All Loans</td><td>XGBoost</td><td className="fh-num">0.623</td><td className="fh-num">0.622</td><td>marginal</td></tr>
								<tr><td>All Loans</td><td>LightGBM</td><td className="fh-num">0.558</td><td className="fh-num">0.542</td><td>yes</td></tr>
								<tr><td>Credit Card</td><td>XGBoost</td><td className="fh-num">0.719</td><td className="fh-num">0.757</td><td>no</td></tr>
								<tr><td>Credit Card</td><td>LightGBM</td><td className="fh-num">0.843</td><td className="fh-num">0.764</td><td>yes</td></tr>
								<tr><td>Business</td><td>XGBoost</td><td className="fh-num">0.311</td><td className="fh-num">0.382</td><td>no</td></tr>
								<tr><td>Business</td><td>LightGBM</td><td className="fh-num">0.307</td><td className="fh-num">0.358</td><td>no</td></tr>
								<tr><td>Mortgage</td><td>XGBoost</td><td className="fh-num">0.270</td><td className="fh-num">0.309</td><td>no</td></tr>
								<tr><td>Mortgage</td><td>LightGBM</td><td className="fh-num">0.290</td><td className="fh-num">0.277</td><td>yes</td></tr>
								<tr><td>CRE</td><td>XGBoost</td><td className="fh-num">0.390</td><td className="fh-num">0.412</td><td>no</td></tr>
								<tr><td>CRE</td><td>LightGBM</td><td className="fh-num">0.398</td><td className="fh-num">0.450</td><td>no</td></tr>
							</tbody>
						</table>
					</div>

					<p>
						Tuning helped in only 4 of 10 combinations, and made the outer-fold
						result worse in 6 of 10, consistent with the small-N overfitting
						risk that motivated trying fixed defaults first.
					</p>
				</section>

				{/* Final verdict */}
				<section className="fh-section">
					<span className="fh-eyebrow">Conclusion</span>
					<h2>Model complexity has to match data size</h2>
					<p className="fh-lede">
						For this problem (univariate, ~140-quarter macro series,
						direct-horizon forecasting), classical ARIMA is the stronger model,
						significantly so on the majority of series/horizon combinations.
						Global pooling and hyperparameter tuning both help the ML side
						somewhat but don&rsquo;t close the gap.
					</p>
					<p>
						With only ~140 observations per account, a 3-parameter model can be
						estimated reliably; a model built from hundreds of tree splits needs
						more data than that to find structure ARIMA doesn&rsquo;t already
						capture. SHAP confirms it isn&rsquo;t a training or tuning problem:
						both approaches are extracting the same signal, one just does it more
						efficiently at this sample size. The one lever that could plausibly
						change this result is genuinely new information (an exogenous macro
						regressor ARIMA never had access to either), not further feature
						engineering on the same short series.
					</p>
				</section>

				<p className="fh-synthetic-note mb-10">
					Full code, tests (23 passing), and reproducible pipeline scripts in
					the linked repository, including the golden-snapshot regression
					suite, the leakage-guard regression test, and every script used to
					produce the numbers above.{' '}
					<a href="https://github.com/Sreekaran1704/Loan-Default" target="_blank" rel="noopener noreferrer" style={{ color: '#312e81' }}>
						View on GitHub
					</a>
					.
				</p>
			</div>
		</div>
	);
}

export default LoanForecastingTechnical;
