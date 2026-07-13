import { motion } from 'framer-motion';
import ContactDetails from '../components/contact/ContactDetails';
import PagesMetaHead from '../components/PagesMetaHead';

function contact() {
	return (
		<div className="contact-page">
			<PagesMetaHead title="Contact" />

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<ContactDetails />
			</motion.div>
		</div>
	);
}

export default contact;