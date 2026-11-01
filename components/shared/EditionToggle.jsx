import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useRouter } from 'next/router';
import SmogTruck, { SMOG_END_AT, SMOG_SWAP_AT } from './SmogTruck';
import TorchGuy, { TORCH_END_AT, TORCH_REVEAL_AT } from './TorchGuy';

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
	// Which little show is playing: 'torch' into colour, 'smog' into black & white.
	const [show, setShow] = useState(null);
	const showTimers = useRef([]);
	const torchTip = useRef(null);
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

	// Opens the colour edition in a circle of light from the torch's tip.
	const revealFromTorch = () => {
		const root = document.documentElement;
		const tip = torchTip.current?.getBoundingClientRect();
		if (!document.startViewTransition || !tip) {
			apply('colour');
			return;
		}
		const { x, y } = tip;
		const reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
		root.style.setProperty('--np-torch-x', `${x}px`);
		root.style.setProperty('--np-torch-y', `${y}px`);
		root.style.setProperty('--np-torch-end', `${reach * 1.3}px`);
		root.setAttribute('data-torch-reveal', '');
		document
			.startViewTransition(() => flushSync(() => apply('colour')))
			.finished.finally(() => root.removeAttribute('data-torch-reveal'));
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
		setShow(toColour ? 'torch' : 'smog');
		showTimers.current = [
			setTimeout(toColour ? revealFromTorch : () => apply('bw'), toColour ? TORCH_REVEAL_AT : SMOG_SWAP_AT),
			setTimeout(() => setShow(null), toColour ? TORCH_END_AT : SMOG_END_AT),
		];
	};

	return (
		<div ref={group} className="np-edition" role="group" aria-label="Print edition">
			{show === 'torch' && <TorchGuy tipRef={torchTip} />}
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
