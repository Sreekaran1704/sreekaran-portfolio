export default function ProjectPreview({ note }) {
  return (
    <figure className={`projects-preview projects-preview-${note.visual || 'workflow'}`}>
      {note.visual === 'causal' ? (
        <div className="preview-bars" role="img" aria-label="Naive comparison: $42.41 per customer per quarter. Randomized causal lift: $3.73 to $5.94.">
          <div><span>Naive comparison</span><i style={{width:'88%'}} /><strong>$42.41</strong></div>
          <div><span>Randomized estimate</span><i style={{width:'10%'}} /><strong>$3.73–$5.94</strong></div>
          <small>Revenue lift / customer / quarter</small>
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
