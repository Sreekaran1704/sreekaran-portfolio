import AppBanner from '../components/shared/AppBanner';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import ArticlesGrid from '../components/articles/ArticlesGrid';
import Skills from '../components/about/Skills';
import Experience from '../components/about/Experience';
import PagesMetaHead from '../components/PagesMetaHead';
import AboutMe from '../components/about/AboutMeBio';
import ContactDetails from '../components/contact/ContactDetails';

export default function Home() {
	return (
		<div>
			<PagesMetaHead title="Sreekaran Reddy Portfolio" />

			<section id="home">
				<AppBanner />
				<AboutMe />
			</section>

			<section id="projects">
				<ProjectsGrid />
			</section>

			<section id="articles">
				<ArticlesGrid />
			</section>

			<section id="experience">
				<Experience />
			</section>

			<section id="skills">
				<Skills />
			</section>

			<section id="contact">
				<ContactDetails />
			</section>
		</div>
	);
}