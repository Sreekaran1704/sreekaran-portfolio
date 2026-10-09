import Head from 'next/head';
import { useRouter } from 'next/router';

// Link previews (LinkedIn, WhatsApp, iMessage, X…) need absolute URLs.
const SITE_URL = 'https://sreekaran-portfolio.vercel.app';
const SITE_NAME = 'The Sreekaran Reddy Portfolio';

const DEFAULTS = {
	title: 'Sreekaran Reddy — Data Analyst & Data Scientist',
	keywords: 'data analyst, data scientist, SQL, Python, Tableau, causal inference, forecasting, machine learning, portfolio',
	description: 'Sreekaran Reddy — Data Analyst and Data Scientist. Explore SQL, Python, and Tableau work, plus case studies in causal inference, forecasting, and machine learning.',
	image: '/og-image.png',
	imageAlt: 'The Sreekaran Reddy Portfolio: Data Analyst & Data Scientist, set as a newspaper front page.',
};

// The layout renders this with the defaults and each page renders it again
// with its own values; the keys make the page's tags replace the layout's.
function PagesMetaHead({
	title = DEFAULTS.title,
	keywords = DEFAULTS.keywords,
	description = DEFAULTS.description,
	image = DEFAULTS.image,
	imageAlt = DEFAULTS.imageAlt,
}) {
	const { asPath } = useRouter();
	const path = asPath.split(/[?#]/)[0];
	const url = `${SITE_URL}${path === '/' ? '' : path}`;
	const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

	return (
		<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta charSet="utf-8" />
			<title>{title}</title>
			<meta key="description" name="description" content={description} />
			<meta key="keywords" name="keywords" content={keywords} />
			<link key="canonical" rel="canonical" href={url} />

			<meta key="og:type" property="og:type" content="website" />
			<meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
			<meta key="og:url" property="og:url" content={url} />
			<meta key="og:title" property="og:title" content={title} />
			<meta key="og:description" property="og:description" content={description} />
			<meta key="og:image" property="og:image" content={imageUrl} />
			<meta key="og:image:width" property="og:image:width" content="1200" />
			<meta key="og:image:height" property="og:image:height" content="630" />
			<meta key="og:image:alt" property="og:image:alt" content={imageAlt} />

			<meta key="twitter:card" name="twitter:card" content="summary_large_image" />
			<meta key="twitter:title" name="twitter:title" content={title} />
			<meta key="twitter:description" name="twitter:description" content={description} />
			<meta key="twitter:image" name="twitter:image" content={imageUrl} />
			<meta key="twitter:image:alt" name="twitter:image:alt" content={imageAlt} />

			<link key="icon" rel="icon" href="/icon-32.png" type="image/png" sizes="32x32" />
			<link key="apple-touch-icon" rel="apple-touch-icon" href="/apple-touch-icon.png" />
			<link key="manifest" rel="manifest" href="/site.webmanifest" />
			<meta key="theme-color" name="theme-color" content="#f7f3ea" />
		</Head>
	);
}

export default PagesMetaHead;
