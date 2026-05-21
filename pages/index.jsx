import AppBanner from '../components/shared/AppBanner';
import HomeProjectsCarousel from '../components/home/HomeProjectsCarousel';
import Skills from '../components/about/Skills';
import HomeArticlesCarousel from '../components/home/HomeArticlesCarousel';
import Experience from '../components/about/Experience';
import PagesMetaHead from '../components/PagesMetaHead';

export default function Home() {
	return (
		<div>
			<PagesMetaHead title="Sreekaran Reddy Portfolio" />

			<section id="home">
				<AppBanner />
			</section>

			<HomeProjectsCarousel />

			<HomeArticlesCarousel />

			<section id="experience">
				<Experience />
			</section>

			<section id="skills">
				<Skills />
			</section>

		</div>
	);
}