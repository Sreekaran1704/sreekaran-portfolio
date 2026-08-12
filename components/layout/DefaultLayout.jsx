import AppNavRail from '../shared/AppNavRail';
import AppFooter from '../shared/AppFooter';
import PagesMetaHead from '../PagesMetaHead';

const DefaultLayout = ({ children }) => {
	return (
		<>
			<PagesMetaHead />
			<AppNavRail />
			{/* The rail is fixed, so everything else is inset by its width. */}
			<div className="site-body">
				<div>{children}</div>
				<AppFooter />
			</div>
		</>
	);
};

export default DefaultLayout;
