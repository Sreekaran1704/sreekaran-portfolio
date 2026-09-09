import { useId, useState } from 'react';
import data from '../../data/fanhouseCharts.json';

const money = value => `${value < 0 ? '−' : '+'}$${Math.abs(value).toFixed(4)}`;
const source = 'https://github.com/Sreekaran1704/fanhouse-casestudy-membership-/blob/main/output/assumption_audit.json';
function Frame({ title, children, note }) {
  return <figure className="fh-interactive"><figcaption><strong>{title}</strong><span>Explore the evidence · Synthetic data</span></figcaption>{children}<p className="fh-chart-note">{note}</p><a className="fh-chart-source" href={source}>Source and assumptions ↗</a></figure>;
}
function Interval({ rows, min, max, unit }) {
  const x = value => 150 + (value - min) / (max - min) * 490;
  const h = 80 + rows.length * 65;
  return <><div className="fh-chart-scroll"><svg viewBox={`0 0 700 ${h}`} role="img" aria-label={`Point estimates and 95% confidence intervals in ${unit}. Exact values follow in the table.`}>
    <line x1={x(0)} x2={x(0)} y1="15" y2={h-40} stroke="#787666" strokeDasharray="4 4" />
    {rows.map((row,i) => <g key={row.label}><text x="8" y={42+i*65} fill="#414431" fontSize="15">{row.label}</text><line x1={x(row.ci_low)} x2={x(row.ci_high)} y1={38+i*65} y2={38+i*65} stroke="#536b62" strokeWidth="5" strokeLinecap="round"/><circle cx={x(row.estimate)} cy={38+i*65} r="7" fill="#312e81"/><title>{row.label}: {money(row.estimate)}, interval {money(row.ci_low)} to {money(row.ci_high)}</title></g>)}
    {[min,0,max].map(value => <text key={value} x={x(value)} y={h-15} textAnchor="middle" fill="#414431" fontSize="14">{money(value)}</text>)}
  </svg></div><div className="fh-chart-scroll"><table className="fh-chart-table"><caption>Exact estimates ({unit})</caption><thead><tr><th scope="col">Outcome</th><th scope="col">Estimate</th><th scope="col">95% interval</th></tr></thead><tbody>{rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{money(row.estimate)}</td><td>{money(row.ci_low)} to {money(row.ci_high)}</td></tr>)}</tbody></table></div></>;
}
export function SelectionChart() {
  const [period,setPeriod] = useState('before');
  const id=useId();
  const current=data.selection[period];
  return <Frame title="The gap predates the program" note="Unmatched group averages. Switching periods does not estimate a causal effect: the groups already differ before launch.">
    <label htmlFor={id}>View spending period </label><select id={id} value={period} onChange={event=>setPeriod(event.target.value)}><option value="before">Before launch</option><option value="after">After launch</option></select>
    <div className="fh-comparison" aria-live="polite">{[['Eventual members',current.members],['Nonmembers',current.controls]].map(([label,value])=><div key={label}><span>{period==='after' && label==='Eventual members' ? 'Members' : label}</span><div className="fh-bar-track"><div style={{width:`${value*100}%`}} /></div><strong>${value.toFixed(4)}/day</strong></div>)}<p><strong>{current.gap.toFixed(1)}% higher</strong> spending among {period==='before'?'eventual members':'members'}.</p></div>
  </Frame>;
}
export function OutcomeChart() {
  const [channel,setChannel]=useState('all'); const [days,setDays]=useState(1); const id=useId();
  const rows=[['Product value','product_subtotal'],['Net payments','amount_paid']].map(([label,key])=>{const r=data.outcomes[`${channel}:${key}`];return {label,estimate:r.estimate*days,ci_low:r.ci_low*days,ci_high:r.ci_high*days};});
  return <Frame title="What changes when we count payments?" note="Dots are matched DiD estimates; lines are 95% intervals. The 457-day view only rescales the same estimate, not a new forecast. Product value uses pre-discount prices; payments exclude membership fees. Neither measures profit.">
    <div className="fh-chart-controls"><label htmlFor={id}>Channel <select id={id} value={channel} onChange={e=>setChannel(e.target.value)}><option value="all">All channels</option><option value="in_store">In store</option><option value="online">Online</option></select></label><label htmlFor={`${id}-units`}>Units <select id={`${id}-units`} value={days} onChange={e=>setDays(Number(e.target.value))}><option value={1}>Per customer per day</option><option value={457}>Per customer / 457 days</option></select></label></div>
    <Interval rows={rows} min={-0.04*days} max={0.17*days} unit={days===1?'dollars/customer/day':'dollars/customer over 457 days'}/>
  </Frame>;
}
export function SensitivityChart() {
  const [bias,setBias]=useState(0); const [caliper,setCaliper]=useState('0.03'); const id=useId();
  const row=data.calipers.find(r=>String(r.caliper)===caliper);
  const adjusted={label:'Trend-adjusted',estimate:row.estimate-bias,ci_low:row.ci_low-bias,ci_high:row.ci_high-bias};
  return <Frame title="How much does the conclusion depend on the design?" note="Trend adjustment subtracts an assumed untreated difference in pre-to-post daily spending changes from the estimate and both interval endpoints, holding the standard error fixed. This is a sensitivity scenario, not an estimated correction. Calipers use matching seed 42; each may retain different customers.">
    <label htmlFor={`${id}-caliper`}>Matching caliper <select id={`${id}-caliper`} value={caliper} onChange={e=>setCaliper(e.target.value)}>{data.calipers.map(r=><option key={r.caliper} value={r.caliper}>{r.caliper}{r.caliper===0.03?' (default)':''}</option>)}</select></label>
    <label className="fh-slider-label" htmlFor={id}>Assumed untreated difference: {money(bias)}/day</label>
    <input id={id} type="range" min="-0.02" max="0.02" step="0.001" value={bias} onChange={e=>setBias(Number(e.target.value))} aria-valuetext={`${money(bias)} per customer per day`}/>
    <button type="button" onClick={()=>{setBias(0);setCaliper('0.03');}}>Reset assumptions</button>
    <p aria-live="polite">{row.n_pairs.toLocaleString('en-US')} matched pairs. Unadjusted nominal p = {row.p_value.toFixed(4)}. {adjusted.ci_low<=0 && adjusted.ci_high>=0 ? 'The adjusted interval includes zero.' : 'The adjusted interval excludes zero under this assumption.'}</p>
    <Interval rows={[{...row,label:'Unadjusted'},adjusted]} min={-0.05} max={0.03} unit="dollars/customer/day"/>
  </Frame>;
}
