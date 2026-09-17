import Head from 'next/head';

function PagesMetaHead({ title, keywords, description }) {
	return (
		<Head>
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1"
			/>
			<meta name="keywords" content={keywords} />
			<meta name="description" content={description} />
			<meta charSet="utf-8" />
			<link rel="icon" href="/favicon.ico" />
			<title>{title}</title>
		</Head>
	);
}

PagesMetaHead.defaultProps = {
	title: 'Sreekaran Reddy — Data Analyst & Data Scientist',
	keywords: 'data analyst, data scientist, SQL, Python, Tableau, causal inference, forecasting, machine learning, portfolio',
	description: 'Sreekaran Reddy — Data Analyst and Data Scientist. Explore SQL, Python, and Tableau work, plus case studies in causal inference, forecasting, and machine learning.',
};

export default PagesMetaHead;
