import { motion } from 'framer-motion';
import ArticlesGrid from '../components/articles/ArticlesGrid';
import PagesMetaHead from '../components/PagesMetaHead';

function articles() {
	return (
		<div className="articles-page">
			<PagesMetaHead title="Articles" />

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<ArticlesGrid />
			</motion.div>
		</div>
	);
}

export default articles;