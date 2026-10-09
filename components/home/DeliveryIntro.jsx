import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { playDeliveryIntro } from './deliveryIntroScene';

// Set by the script in _document before first paint, so a first-time reader
// sees the paper street, never a flash of the page underneath. That script
// only sets it on the home page, without a #section, on a first visit, and
// not for readers who prefer reduced motion.
export const INTRO_KEY = 'np-intro-seen';
const INTRO_ATTR = 'data-intro';

// React's strict mode mounts twice in development; only a real unmount ends it.
let mounted = 0;

function DeliveryIntro() {
	const rootRef = useRef(null);
	const dateRef = useRef(null);

	useEffect(() => {
		const html = document.documentElement;
		if (html.getAttribute(INTRO_ATTR) !== 'play') return undefined;

		mounted += 1;
		try {
			window.localStorage.setItem(INTRO_KEY, '1');
		} catch (err) {
			// Storage can be blocked; it then plays on each visit.
		}
		// Today's date, filled in on the reader's machine (never server-rendered).
		dateRef.current.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
		window.scrollTo(0, 0);
		html.style.overflow = 'hidden';

		const end = () => {
			html.removeAttribute(INTRO_ATTR);
			html.style.overflow = '';
		};
		const stop = playDeliveryIntro(rootRef.current, end);

		return () => {
			mounted -= 1;
			stop();
			setTimeout(() => {
				if (mounted === 0) end();
			}, 0);
		};
	}, []);

	return (
		<div ref={rootRef} className="np-intro">
			<div className="np-intro-stage">
				<svg className="np-intro-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" />
				<div className="np-intro-sheet" aria-hidden="true">
					<div className="np-intro-sheet-inner">
						<div className="np-intro-ear np-intro-fade">
							<span><b>Late Edition</b><span className="np-intro-vol"> · Vol. I, No. 1</span></span>
							<span ref={dateRef} />
						</div>
						<div className="np-intro-plate">The Sreekaran Reddy Portfolio</div>
						<div className="np-intro-fade">
							<div className="np-intro-rainbow" />
							<div className="np-intro-dateline">
								<span>Special delivery</span>
								<span>Fresh off the press</span>
								<span>Price: one click</span>
							</div>
							<div className="np-intro-head">
								<p className="np-intro-headline">Sreekaran Reddy</p>
								<p className="np-intro-deck">Data Analyst &amp; Data Scientist. Your copy has arrived.</p>
							</div>
							<div className="np-intro-cols">
								<div className="np-intro-col" />
								<div className="np-intro-col np-intro-col-mid">
									<figure className="np-intro-photo">
										<Image
											src="/images/sreekaran_profile.jpg"
											alt=""
											width={2251}
											height={2503}
											sizes="(max-width: 700px) 90vw, 420px"
										/>
										<figcaption>Every dataset has a story it isn&rsquo;t telling yet.</figcaption>
									</figure>
								</div>
								<div className="np-intro-col" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<button type="button" className="np-intro-skip">
				Skip intro ›
			</button>
		</div>
	);
}

export default DeliveryIntro;
