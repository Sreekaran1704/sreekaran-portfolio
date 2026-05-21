import { motion } from 'framer-motion';
import Experience from '../components/about/Experience';
import PagesMetaHead from '../components/PagesMetaHead';

function experience() {
	return (
		<div>
			<PagesMetaHead title="Experience" />

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, delay: 1 }}
				exit={{ opacity: 0 }}
				className="container mx-auto"
			>
				<Experience />
			</motion.div>
		</div>
	);
}

export default experience;