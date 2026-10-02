import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { applyChoice, firstBlockedIndex, pathFor, walkthroughSteps } from '../../data/photocullWalkthrough';

// The walkthrough is pure portfolio-side state. It never talks to the
// embedded demo (a cross-origin iframe): completion buttons record what the
// visitor says they did, and Restart only resets this guide.

const START = { at: walkthroughSteps[0].id, choices: {}, status: {}, finished: false, notice: '' };

const STATUS_LABEL = { done: 'Done', skipped: 'Skipped', unavailable: 'Not available' };
const STATUS_MARK = { done: '✓', skipped: '↷', unavailable: '–' };

// "**Control**" in step copy marks an on-screen label in the demo.
function Rich({ text }) {
	if (!text) return null;
	return text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
		index % 2 ? (
			<b key={index} className="pc-ctl">
				{part}
			</b>
		) : (
			<Fragment key={index}>{part}</Fragment>
		)
	);
}

export function useWalkthrough({ onInteract } = {}) {
	const [state, setState] = useState(START);
	const [announcement, setAnnouncement] = useState('');
	const headingRef = useRef(null);
	const moved = useRef(false);

	const path = useMemo(() => pathFor(state.choices), [state.choices]);
	const index = Math.max(0, path.findIndex((step) => step.id === state.at));
	const step = path[index];
	const content = step.content(state.choices);
	const choiceValue = step.choice ? state.choices[step.choice.key] : undefined;
	const blocked = firstBlockedIndex(path, state.choices);

	// Announce every step change, and after a button press move focus to the
	// new step so keyboard and screen-reader users land on it.
	useEffect(() => {
		const label = state.finished
			? 'Walkthrough complete.'
			: `Step ${index + 1} of ${path.length}: ${step.title}.`;
		setAnnouncement(state.notice ? `${label} ${state.notice}` : label);
		if (moved.current) headingRef.current?.focus({ preventScroll: true });
		moved.current = false;
	}, [state.at, state.finished, state.notice, index, path.length, step.title]);

	const go = useCallback(
		(update) => {
			moved.current = true;
			onInteract?.();
			setState(update);
		},
		[onInteract]
	);

	const actions = {
		choose: (value) => {
			onInteract?.();
			const option = step.choice.options.find((item) => item.value === value);
			// The instructions below the choice change in place; say so. A reset
			// notice, if any, is announced by the effect above.
			setAnnouncement(`Instructions updated for ${option.label}.`);
			setState((prev) => applyChoice(prev, step.choice.key, value));
		},
		complete: (action) =>
			go((prev) => {
				const status = { ...prev.status, [step.id]: action.status };
				action.also?.forEach((id) => {
					status[id] = action.status;
				});
				const nextPath = pathFor(prev.choices);
				const here = nextPath.findIndex((item) => item.id === step.id);
				const target = action.goTo
					? nextPath.find((item) => item.id === action.goTo)
					: nextPath[here + 1];
				return target
					? { ...prev, status, at: target.id, notice: '' }
					: { ...prev, status, finished: true, notice: '' };
			}),
		back: () =>
			go((prev) =>
				prev.finished
					? { ...prev, finished: false, notice: '' }
					: { ...prev, at: path[Math.max(0, index - 1)].id, notice: '' }
			),
		jump: (id) => go((prev) => ({ ...prev, at: id, finished: false, notice: '' })),
		restart: () => go(() => START),
	};

	return { state, path, index, step, content, choiceValue, blocked, actions, headingRef, announcement };
}

function Progress({ walk }) {
	const { path, index, state } = walk;
	const counts = Object.values(state.status).reduce((acc, value) => ({ ...acc, [value]: (acc[value] || 0) + 1 }), {});
	return (
		<div className="pc-walk-progress">
			<ol aria-hidden="true">
				{path.map((item, i) => (
					<li
						key={item.id}
						className={[
							state.status[item.id] && `is-${state.status[item.id]}`,
							!state.finished && i === index && 'is-current',
							item.optional && 'is-optional',
						]
							.filter(Boolean)
							.join(' ')}
					/>
				))}
			</ol>
			<span className="pc-walk-tally">
				{counts.done || 0} done
				{counts.skipped ? ` · ${counts.skipped} skipped` : ''}
				{counts.unavailable ? ` · ${counts.unavailable} not available` : ''}
			</span>
		</div>
	);
}

export function WalkthroughBar({ walk, compact = false, detailsToggle = null }) {
	const { state, path, index, step, content, choiceValue, blocked, actions, headingRef } = walk;
	const stepActions = step.actions(state.choices);
	const needsChoice = Boolean(step.choice) && choiceValue == null;
	const status = state.status[step.id];
	const note = content.note ?? step.note;

	return (
		<div className="pc-walk-bar">
			<div className="pc-walk-top">
				<p className="pc-walk-kicker">
					{state.finished ? (
						'Walkthrough complete'
					) : (
						<>
							Step {index + 1} of {path.length} · {step.section}
							{step.optional && <span className="pc-walk-flag">Optional</span>}
							{status && <span className={`pc-walk-flag is-${status}`}>{STATUS_LABEL[status]}</span>}
						</>
					)}
				</p>

				<div className="pc-walk-tools">
					<button type="button" onClick={actions.back} disabled={!state.finished && index === 0}>
						← Back
					</button>
					{!compact && (
						<>
							<label className="sr-only" htmlFor="pc-walk-jump">
								Jump to step
							</label>
							<select
								id="pc-walk-jump"
								value={state.finished ? '' : step.id}
								onChange={(event) => actions.jump(event.target.value)}
							>
								{state.finished && <option value="">Jump to step…</option>}
								{path.map((item, i) => (
									<option key={item.id} value={item.id} disabled={i > blocked}>
										{state.status[item.id] ? `${STATUS_MARK[state.status[item.id]]} ` : ''}
										{i + 1}. {item.title}
										{item.optional ? ' (optional)' : ''}
										{i > blocked ? ' (choose above first)' : ''}
									</option>
								))}
							</select>
						</>
					)}
					<button type="button" onClick={actions.restart}>
						Restart
					</button>
				</div>
			</div>

			<Progress walk={walk} />

			{state.finished ? (
				<div className="pc-walk-main">
					<h3 ref={headingRef} tabIndex={-1} className="pc-walk-title">
						You have seen the whole Web Demo
					</h3>
					<p className="pc-walk-do">
						Restart to try the other route, or use <b className="pc-ctl">← Back</b> and{' '}
						<b className="pc-ctl">Jump to step</b> to revisit anything. Restarting this guide does not clear
						the demo.
					</p>
					<div className="pc-walk-actions">
						<button type="button" className="pc-walk-primary" onClick={actions.restart}>
							Restart walkthrough
						</button>
					</div>
				</div>
			) : (
				<div className="pc-walk-main">
					<div className="pc-walk-lead">
						<h3 ref={headingRef} tabIndex={-1} className="pc-walk-title">
							{step.title}
						</h3>

						{step.choice && (
							<fieldset className="pc-walk-choice">
								<legend>{step.choice.legend}</legend>
								<div className="pc-walk-options">
									{step.choice.options.map((option) => (
										<label key={option.value} className={choiceValue === option.value ? 'is-chosen' : ''}>
											<input
												type="radio"
												name={`pc-walk-${step.choice.key}`}
												value={option.value}
												checked={choiceValue === option.value}
												onChange={() => actions.choose(option.value)}
											/>
											<span className="pc-walk-option-label">{option.label}</span>
											{option.hint && <span className="pc-walk-option-hint">{option.hint}</span>}
										</label>
									))}
								</div>
							</fieldset>
						)}

						<div className="pc-walk-do">
							<span className="pc-walk-label">What to do</span>
							<p>
								<Rich text={content.do} />
							</p>
						</div>

						{state.notice && <p className="pc-walk-notice">{state.notice}</p>}
					</div>

					<div className="pc-walk-side">
						<div className="pc-walk-actions">
							{needsChoice && (
								<button type="button" className="pc-walk-primary" disabled>
									Choose an option first
								</button>
							)}
							{!needsChoice && stepActions.map((action) => (
								<button
									key={action.label}
									type="button"
									className={action.kind === 'alt' ? 'pc-walk-alt' : 'pc-walk-primary'}
									onClick={() => actions.complete(action)}
								>
									{action.label}
									{action.kind !== 'alt' && <span aria-hidden="true"> →</span>}
								</button>
							))}
							{!step.choice && !stepActions.some((action) => action.status === 'skipped') && (
								<button
									type="button"
									className="pc-walk-skip"
									onClick={() => actions.complete({ status: 'skipped' })}
								>
									Skip this step
								</button>
							)}
							{detailsToggle}
						</div>
						{note && (
							<p className="pc-walk-hint">
								<Rich text={note} />
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export function WalkthroughDetails({ walk, id }) {
	const { state, content } = walk;
	if (state.finished) {
		return (
			<div className="pc-walk-details" id={id}>
				<section>
					<h4>Full Local Edition</h4>
					<p>
						The complete version scans folders on your own machine, keeps a private SQLite cache, and saves
						decisions, event edits and preferences between sessions. Photos never leave the device.
					</p>
				</section>
			</div>
		);
	}
	return (
		<div className="pc-walk-details" id={id}>
			<section>
				<h4>What to expect</h4>
				<p>
					<Rich text={content.expect} />
				</p>
			</section>
			<section>
				<h4>How it works</h4>
				<p>
					<Rich text={content.how} />
				</p>
				{content.list && (
					<ul>
						{content.list.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				)}
			</section>
			<section>
				<h4>What comes next</h4>
				<p>
					<Rich text={content.next} />
				</p>
			</section>
		</div>
	);
}
