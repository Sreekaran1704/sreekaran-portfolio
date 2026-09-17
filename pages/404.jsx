import Link from 'next/link';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import PagesMetaHead from '../components/PagesMetaHead';

// A missing page, printed as a correction notice in the paper.
export default function NotFound() {
	return (
		<div className="np-wrap np-section np-404">
			<PagesMetaHead title="Page not found | Sreekaran Reddy" />

			<header className="np-section-head">
				<div className="np-section-slug">
					<span>Corrections</span>
					<span>Error 404</span>
				</div>
				<h1 className="np-section-title">This story has been pulled</h1>
				<p className="np-section-dek">
					The page you were looking for isn&apos;t in this edition. It may have
					moved, or the link may be mistyped.
				</p>
			</header>

			<div className="np-404-links">
				<Link href="/" className="np-cta np-cta-primary">
					<FiArrowLeft aria-hidden="true" /> Back to the front page
				</Link>
				<Link href="/#projects" className="np-cta">
					See all projects <FiArrowRight aria-hidden="true" />
				</Link>
			</div>
		</div>
	);
}
