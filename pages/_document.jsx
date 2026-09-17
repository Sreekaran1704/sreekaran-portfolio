import { Html, Head, Main, NextScript } from 'next/document';

// Newspaper type, tuned for screens: a blackletter nameplate, a display serif
// for headlines, a screen-optimised text serif for reading, and a plain sans
// for labels and navigation. Comic Neue letters the speech balloons in the
// story write-ups; Space Mono sets labels in the black & white edition.
const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..700&family=Inter:wght@400;500;600;700&family=Comic+Neue:wght@700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="stylesheet" href={FONTS_URL} />
				{/* Applies the saved print edition before first paint (see EditionToggle).
				    A ?edition=bw or ?edition=colour link sets it, so an edition can be shared. */}
				<script
					dangerouslySetInnerHTML={{
						__html:
							"(function(){try{var q=new URLSearchParams(location.search).get('edition');if(q==='bw'||q==='colour'){localStorage.setItem('np-edition',q);}if(localStorage.getItem('np-edition')==='bw'){document.documentElement.setAttribute('data-edition','bw');}}catch(e){}})();",
					}}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
