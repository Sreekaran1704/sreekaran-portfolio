import { useEffect, useRef, useState } from 'react';
import PrototypeWindow from './PrototypeWindow';
import LookBackApp from './lookback/App';
import { PAPERS } from './lookback/theme';
import { loadStored, saveStored } from './lookback/lib';

// A working copy of the LookBack Android app (version 1.3, the leather diary), ported screen by screen from its React
// Native source (src/app, src/components, src/theme, src/lib) into components/projects/lookback/. The memories are the
// app's own built-in sample set (src/dev/seed.ts) with its painted photos and hummed voice notes; whatever a visitor
// writes, photographs or records stays in their own browser.

const PLAY_TEST = 'https://groups.google.com/g/lookback-testers';
/** The phone's screen in dp (the 20:9 Android phone it was built on) and its bezel. */
const SCREEN = { w: 363, h: 800 };
const BEZEL = 6;
const DEVICE = { w: SCREEN.w + BEZEL * 2, h: SCREEN.h + BEZEL * 2 };
const LOOK_KEY = 'lb-demo-look';

/** Scales the phone as a whole to fit its window (and the pop-out / full screen). */
function PhoneFit({ children }) {
	const ref = useRef(null);
	const [scale, setScale] = useState(1);
	useEffect(() => {
		const el = ref.current;
		const box = el?.parentElement;
		if (!el || !box || typeof ResizeObserver === 'undefined') return undefined;
		const fit = () => {
			const contained = el.closest('.is-pip') || document.fullscreenElement?.contains(el);
			const style = getComputedStyle(box);
			const width = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
			const height = contained ? box.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) : window.innerHeight * 0.9;
			const next = Math.min(1, width / DEVICE.w, height / DEVICE.h);
			setScale(next > 0 ? next : 1);
		};
		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(box);
		window.addEventListener('resize', fit);
		document.addEventListener('fullscreenchange', fit);
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', fit);
			document.removeEventListener('fullscreenchange', fit);
		};
	}, []);
	return (
		<div ref={ref} className="lbd-fit" style={{ width: DEVICE.w * scale, height: DEVICE.h * scale }}>
			<div className="lbd-device" style={{ width: DEVICE.w, height: DEVICE.h, transform: `scale(${scale})` }}>
				{children}
			</div>
		</div>
	);
}

export default function LookBackDemo() {
	const [look, setLookState] = useState({ paper: 'navy', tone: 'dark' });
	useEffect(() => {
		setLookState(loadStored(LOOK_KEY, { paper: 'navy', tone: 'dark' }));
	}, []);
	const setLook = (next) => {
		setLookState(next);
		saveStored(LOOK_KEY, next);
	};

	return (
		<div className="chd-wrap lbd-wrap" id="live-prototype">
			<section className="chd-stage lbd-stage lbd-stage-app" aria-label="Live prototype · Android app">
				<p className="chd-stage-tag">
					<span className="chd-stage-pulse" aria-hidden="true" /> Live prototype · Android app
				</p>
				<div className="chd-bar">
					<p className="chd-bar-note">
						Version 1.3: open a letter from last year and write back, play its tape, pull a year off the shelf, write and seal today&apos;s page (with your own photo or voice), make your portrait, swipe between pages.
					</p>
					<div className="chd-theme" role="group" aria-label="Lamplight">
						{[
							['light', 'Day'],
							['dark', 'Night'],
						].map(([tone, label]) => (
							<button key={tone} type="button" className={look.tone === tone ? 'is-on' : ''} aria-pressed={look.tone === tone} onClick={() => setLook({ ...look, tone })}>
								{label}
							</button>
						))}
					</div>
					<div className="lbd-looks" role="group" aria-label="Paper">
						{PAPERS.map((p) => (
							<button
								key={p.name}
								type="button"
								className={`lbd-swatch${look.paper === p.name ? ' is-on' : ''}`}
								aria-label={`${p.label} paper`}
								aria-pressed={look.paper === p.name}
								onClick={() => setLook({ ...look, paper: p.name })}
								style={{ background: look.tone === 'dark' ? p.dark : p.light, boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.25)` }}
							/>
						))}
					</div>
				</div>
				<PrototypeWindow
					className="lbd-window"
					label="Android app"
					title="LookBack · Android"
					storageKey="lbd-pip-android"
					download={{ label: 'Join the Play test', href: PLAY_TEST }}
					size={{ width: DEVICE.w, height: DEVICE.h }}
					scale={0.52}
				>
					<PhoneFit>
						<LookBackApp look={look} onLook={setLook} />
					</PhoneFit>
				</PrototypeWindow>
			</section>

			<p className="chd-caption">
				A working copy of the app as of version 1.3, ported screen by screen from its React Native source: the same paper colours, type, pages, envelopes, tape deck and bookshelf. The memories are the app&apos;s own sample set; the sample tapes hum a tune. Anything you write, photograph or record here stays in your browser (your microphone is only used if you allow it, and nothing is uploaded). On a wide screen, pop it out to keep it beside you while you read.
			</p>
		</div>
	);
}
