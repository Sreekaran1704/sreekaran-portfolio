import { motion } from 'framer-motion';
import Skills from '../components/about/Skills';
import PagesMetaHead from '../components/PagesMetaHead';

function skills() {
	return (
		<div>
			<PagesMetaHead title="Skills" />

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<Skills />
			</motion.div>
		</div>
	);
}

export default skills;