import AppMasthead from '../shared/AppMasthead';
import AppFooter from '../shared/AppFooter';
import PagesMetaHead from '../PagesMetaHead';

const DefaultLayout = ({ children }) => {
	return (
		<>
			<PagesMetaHead />
			<a className="np-skip-link" href="#main-content">Skip to content</a>
			<AppMasthead />
			<main id="main-content" tabIndex={-1} className="site-body">{children}</main>
			<AppFooter />
		</>
	);
};

export default DefaultLayout;
