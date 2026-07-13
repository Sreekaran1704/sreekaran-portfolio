import PagesMetaHead from '../../components/PagesMetaHead';
import ProjectsGrid from '../../components/projects/ProjectsGrid';

function index() {
	return (
		<div className="projects-page">
			<PagesMetaHead title="Projects" />

			<ProjectsGrid />
		</div>
	);
}

export default index;