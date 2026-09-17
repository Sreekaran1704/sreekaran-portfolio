import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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

	useEffect(() => {
		setEdition(document.documentElement.getAttribute('data-edition') === 'bw' ? 'bw' : 'colour');
	}, []);

	const choose = (value) => {
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

	return (
		<div className="np-edition" role="group" aria-label="Print edition">
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
