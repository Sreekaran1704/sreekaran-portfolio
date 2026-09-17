import Link from 'next/link';
import { SelectionChart, OutcomeChart, SensitivityChart } from './FanhouseCharts';
import PagesMetaHead from '../PagesMetaHead';
import { fanhouseLinks, fanhouseViews } from '../../data/fanhouseStudy';
import { ReadingSection, StoryContents } from '../reading/ReadingKit';

export default function FanhouseStudy({ view }) {
  const story = fanhouseViews[view];
  return <div className="reader fh-page project-detail-page px-6 py-8 sm:px-10 lg:px-16">
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
          <a className="notice-link-btn" href={fanhouseLinks.dashboard} target="_blank" rel="noopener noreferrer">Explore live dashboard →</a>
          <a className="notice-link-btn notice-link-outline" href={fanhouseLinks.caseStudy} target="_blank" rel="noopener noreferrer">Full case study →</a>
          <a className="notice-link-btn notice-link-outline" href={fanhouseLinks.github} target="_blank" rel="noopener noreferrer">Code &amp; validation →</a>
        </div>
      </header>
      <aside className="fh-study-snapshot" aria-label="Study results at a glance">
        <div className="fh-hero-stat">
          <strong className="fh-hero-stat-value">+$0.1367<span className="fh-hero-stat-unit">/day</span></strong>
          <span className="fh-hero-stat-label">Pre-discount product value</span>
          <small>95% CI: +$0.1226 to +$0.1509</small>
        </div>
        <div className="fh-hero-stat">
          <strong className="fh-hero-stat-value">−$0.0103<span className="fh-hero-stat-unit">/day</span></strong>
          <span className="fh-hero-stat-label">Net product payments</span>
          <small>95% CI: −$0.0232 to +$0.0027</small>
        </div>
        <p>Matched estimates per customer. Synthetic data. Fees tracked separately; profit not estimated.</p>
      </aside>
      <StoryContents label="In this story" />
      {story.sections.map(([title, paragraphs], index) => <ReadingSection key={title} eyebrow={`Part ${index + 1}`} title={title}>
        {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {((view === 0 && index === 1) || (view === 1 && index === 1)) && <SelectionChart />}
        {((view === 0 && index === 3) || (view === 1 && index === 3) || (view === 2 && index === 2)) && <OutcomeChart />}
        {((view === 0 && index === 4) || (view === 1 && index === 4) || (view === 2 && index === 4)) && <SensitivityChart />}
      </ReadingSection>)}
      <footer className="fh-section"><h2>Follow the evidence</h2><p>The dashboard, complete case study, and reproducible analysis are available together.</p>
        <div className="fh-study-links">
          <a className="notice-link-btn" href={fanhouseLinks.dashboard} target="_blank" rel="noopener noreferrer">Open dashboard →</a>
          <a className="notice-link-btn notice-link-outline" href={fanhouseLinks.caseStudy} target="_blank" rel="noopener noreferrer">Read complete study →</a>
          <a className="notice-link-btn notice-link-outline" href={fanhouseLinks.github} target="_blank" rel="noopener noreferrer">Inspect source →</a>
        </div>
      </footer>
    </div>
  </div>;
}
