export default function ProjectPreview({ note }) {
  return (
    <figure className={`projects-preview projects-preview-${note.visual || 'workflow'}`}>
      {note.visual === 'causal' ? (
        <div className="preview-bars" role="img" aria-label="Eventual members spent 40.6% more before launch; members spent 22.3% more after launch. These descriptive gaps are not causal effects.">
          <div><span>Before launch</span><i style={{width:'81.2%'}} /><strong>+40.6%</strong></div>
          <div><span>After launch</span><i style={{width:'44.6%'}} /><strong>+22.3%</strong></div>
          <small>Member spending gaps · Synthetic data · Not causal effects</small>
        </div>
      ) : note.visual === 'forecast' ? (
        <div className="preview-forecast" role="img" aria-label="ARIMA outperformed XGBoost and LightGBM in all five loan categories: All loans, Credit card, Business, Mortgage, and Commercial real estate.">
          <span className="preview-mini-label">After fixing the leakage</span>
          <div className="preview-forecast-categories">{['All loans', 'Card', 'Business', 'Mortgage', 'CRE'].map(label => <div key={label}><span className="preview-check">✓</span><small>{label}</small></div>)}</div>
          <span className="preview-verdict">ARIMA wins across all five series</span>
        </div>
      ) : note.visual === 'language' ? (
        <div className="preview-story" aria-label="Genre-controlled story generation">
          <div className="preview-story-genres"><span>Fantasy</span><span>Romance</span><span>Sci-fi</span></div>
          <svg viewBox="0 0 280 52" aria-hidden="true"><path d="M24 14 Q105 11 247 14 M24 27 Q160 25 230 28 M24 41 Q82 38 182 41" /></svg>
          <span className="preview-mini-label">One model. Three kinds of story.</span>
        </div>
      ) : (
        <div className="preview-flow" aria-label={`Workflow: ${note.stages?.join(' to ')}`}>
          {(note.stages || ['Question', 'Explore', 'Discover']).map((stage, index) => <div key={stage}><span className="preview-flow-number">0{index + 1}</span><span>{stage}</span>{index < 2 && <b aria-hidden="true">⤳</b>}</div>)}
        </div>
      )}
    </figure>
  );
}
