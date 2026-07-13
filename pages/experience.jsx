import { motion } from 'framer-motion';
import Experience from '../components/about/Experience';
import PagesMetaHead from '../components/PagesMetaHead';

function experience() {
	return (
		<div className="experience-page">
			<PagesMetaHead title="Experience" />

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<Experience />
			</motion.div>
		</div>
	);
}

export default experience;