import { motion } from 'framer-motion';
import ArticlesGrid from '../components/articles/ArticlesGrid';
import PagesMetaHead from '../components/PagesMetaHead';

function articles() {
	return (
		<div>
			<PagesMetaHead title="Articles" />

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, delay: 1 }}
				exit={{ opacity: 0 }}
				className="container mx-auto"
			>
				<ArticlesGrid />
			</motion.div>
		</div>
	);
}

export default articles;