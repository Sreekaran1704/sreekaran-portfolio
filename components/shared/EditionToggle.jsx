import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useRouter } from 'next/router';
import SmogTruck, { SMOG_END_AT, SMOG_SWAP_AT } from './SmogTruck';
import RainShower, { RAIN_END_AT, RAIN_REVEAL_AT } from './RainShower';

// Switches the whole paper between the colour edition and a black & white
// print edition. The choice lives on <html data-edition>, set before first
// paint by the script in _document so a returning reader never sees a flash.
export const EDITION_KEY = 'np-edition';

const EDITIONS = [
	{ value: 'colour', label: 'Colour' },
	{ value: 'bw', label: 'Black & White' },
];

function EditionToggle() {
	const router = useRouter();
	const [edition, setEdition] = useState('colour');
	// Which little show is playing: 'rain' into colour, 'smog' into black & white.
	const [show, setShow] = useState(null);
	const showTimers = useRef([]);
	const group = useRef(null);
	const keepFocus = useRef(false);

	useEffect(() => {
		setEdition(document.documentElement.getAttribute('data-edition') === 'bw' ? 'bw' : 'colour');
		return () => showTimers.current.forEach(clearTimeout);
	}, []);

	// On a phone the button just pressed hides once its edition is on, which
	// would drop keyboard focus; hand it to the button that takes its place.
	useEffect(() => {
		if (!keepFocus.current) return;
		keepFocus.current = false;
		const focused = document.activeElement;
		if (focused !== document.body && !group.current.contains(focused)) return;
		[...group.current.querySelectorAll('button')]
			.find((button) => button.offsetParent !== null)
			?.focus({ preventScroll: true });
	}, [edition]);

	const apply = (value) => {
		setEdition(value);
		if (value === 'bw') {
			document.documentElement.setAttribute('data-edition', 'bw');
		} else {
			document.documentElement.removeAttribute('data-edition');
		}
		try {
			window.localStorage.setItem(EDITION_KEY, value);
		} catch (err) {
			// Storage can be blocked; the switch still works for this visit.
		}
		// Keep shared edition links in sync so a reload preserves this choice.
		const url = new URL(window.location.href);
		if (url.searchParams.has('edition')) {
			url.searchParams.set('edition', value);
			router.replace(`${url.pathname}${url.search}${url.hash}`, undefined, {
				shallow: true,
				scroll: false,
			});
		}
	};

	const stopShow = () => {
		showTimers.current.forEach(clearTimeout);
		showTimers.current = [];
		setShow(null);
	};

	// The rain washes the colour edition down the page from the top.
	const washInColour = () => {
		const root = document.documentElement;
		if (!document.startViewTransition) {
			apply('colour');
			return;
		}
		root.setAttribute('data-rain-reveal', '');
		document
			.startViewTransition(() => flushSync(() => apply('colour')))
			.finished.finally(() => root.removeAttribute('data-rain-reveal'));
	};

	const choose = (value) => {
		keepFocus.current = true;
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		// Any tap during a show ends it on the edition just chosen: the same button
		// skips ahead, the other one calls it off.
		if (show || value === edition || reducedMotion) {
			stopShow();
			apply(value);
			return;
		}
		const toColour = value === 'colour';
		setShow(toColour ? 'rain' : 'smog');
		showTimers.current = [
			setTimeout(toColour ? washInColour : () => apply('bw'), toColour ? RAIN_REVEAL_AT : SMOG_SWAP_AT),
			setTimeout(() => setShow(null), toColour ? RAIN_END_AT : SMOG_END_AT),
		];
	};

	return (
		<div ref={group} className="np-edition" role="group" aria-label="Print edition">
			{show === 'rain' && <RainShower />}
			{show === 'smog' && <SmogTruck />}
			<span className="np-edition-label">Edition</span>
			{EDITIONS.map((item) => (
				<button
					key={item.value}
					type="button"
					className={`np-edition-btn np-edition-${item.value} ${edition === item.value ? 'is-active' : ''}`}
					aria-pressed={edition === item.value}
					onClick={() => choose(item.value)}
				>
					<span className="np-edition-swatch" aria-hidden="true" />
					{item.label}
				</button>
			))}
		</div>
	);
}

export default EditionToggle;
