import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
	...nextVitals,
	{
		rules: {
			// Several components read browser-only state (saved edition, reduced
			// motion, localStorage) in an effect after hydration, on purpose, so
			// the server render and the first client render match.
			'react-hooks/set-state-in-effect': 'warn',
		},
	},
	{ ignores: ['.next/**', '.next-dev/**', 'node_modules/**'] },
];

export default config;
