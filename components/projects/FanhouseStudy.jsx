import Link from 'next/link';
import { SelectionChart, OutcomeChart, SensitivityChart } from './FanhouseCharts';
import PagesMetaHead from '../PagesMetaHead';
import { fanhouseLinks, fanhouseViews } from '../../data/fanhouseStudy';

export default function FanhouseStudy({ view }) {
  const story = fanhouseViews[view];
  return <div className="fh-page project-detail-page px-6 py-8 sm:px-10 lg:px-16">
    <PagesMetaHead title={`${story.title} | FanHouse`} description={story.lede} keywords="synthetic data, causal inference, matching, difference-in-differences" />
    <div className="mx-auto max-w-4xl">
      <Link href="/#projects" className="project-detail-back-btn mt-8">← Back to projects</Link>
      <nav className="fh-version-switch mt-6" aria-label="Versions of this write-up">
        <span className="fh-version-switch-label">Three ways to read this</span>
        <span className="fh-version-switch-options">{fanhouseViews.map((item, index) => index === view
          ? <span key={item.label} className="fh-version-pill fh-version-pill-current" aria-current="page">{item.label}</span>
          : <Link key={item.label} className="fh-version-pill" href={`/projects/fanhouse-membership-analysis${item.slug ? '/' + item.slug : ''}`}>{item.label}</Link>)}</span>
      </nav>
      <header className="fh-hero mt-6">
        <span className="fh-eyebrow">Independent portfolio study · Synthetic retail data</span>
        <h1 className="fh-hero-title">{story.title}</h1>
        <p className="fh-hero-lede">{story.lede}</p>
        <p className="fh-hero-byline">By Sreekaran · September 2026 · {story.label}</p>
        <div className="fh-study-links">
          <a href={fanhouseLinks.dashboard}>Explore live dashboard ↗</a>
          <a href={fanhouseLinks.caseStudy}>Full case study ↗</a>
          <a href={fanhouseLinks.github}>Code &amp; validation ↗</a>
        </div>
      </header>
      <aside className="fh-study-snapshot" aria-label="Study results at a glance">
        <div><span>Pre-discount product value</span><strong>+$0.1367/day</strong><small>95% CI: +$0.1226 to +$0.1509</small></div>
        <div><span>Net product payments</span><strong>−$0.0103/day</strong><small>95% CI: −$0.0232 to +$0.0027</small></div>
        <p>Matched estimates per customer. Synthetic data. Fees tracked separately; profit not estimated.</p>
      </aside>
      {story.sections.map(([title, paragraphs], index) => <section className="fh-section" key={title}>
        <span className="fh-eyebrow">{String(index + 1).padStart(2, '0')} / {story.label}</span>
        <h2>{title}</h2>
        {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {((view === 0 && index === 1) || (view === 1 && index === 1)) && <SelectionChart />}
        {((view === 0 && index === 3) || (view === 1 && index === 3) || (view === 2 && index === 2)) && <OutcomeChart />}
        {((view === 0 && index === 4) || (view === 1 && index === 4) || (view === 2 && index === 4)) && <SensitivityChart />}
      </section>)}
      <footer className="fh-section"><h2>Follow the evidence</h2><p>The dashboard, complete case study, and reproducible analysis are available together.</p>
        <div className="fh-study-links"><a href={fanhouseLinks.dashboard}>Open dashboard ↗</a><a href={fanhouseLinks.caseStudy}>Read complete study ↗</a><a href={fanhouseLinks.github}>Inspect source ↗</a></div>
      </footer>
    </div>
  </div>;
}
