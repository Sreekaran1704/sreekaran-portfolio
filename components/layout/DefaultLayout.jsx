import AppMasthead from '../shared/AppMasthead';
import AppFooter from '../shared/AppFooter';
import PagesMetaHead from '../PagesMetaHead';

const DefaultLayout = ({ children }) => {
	return (
		<>
			<PagesMetaHead />
			<AppMasthead />
			<main className="site-body">{children}</main>
			<AppFooter />
		</>
	);
};

export default DefaultLayout;
