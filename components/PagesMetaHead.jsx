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
	title: 'Sreekaran Reddy — Data Analyst & Applied AI Builder',
	keywords: 'data analyst, applied AI, machine learning, SQL, Python, Tableau, portfolio',
	description: 'Portfolio of Sreekaran Reddy — Data Analyst, Applied AI Builder, and MS Computer Science graduate at UMKC.',
};

export default PagesMetaHead;
