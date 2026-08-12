import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { CrayonDefs, CrayonIcon } from './CrayonArt';

// Skills is intentionally absent — it still exists as a page and as a section on
// the home page, it just isn't one of the five rail destinations.
const navLinks = [
	{ name: 'About Me', href: '/about', icon: 'about', color: '#f2d99a' },
	{ name: 'Projects', href: '/projects', icon: 'projects', color: '#a8cbb8' },
	{ name: 'Experience', href: '/experience', icon: 'experience', color: '#b9c8e4' },
	{ name: 'Articles', href: '/articles', icon: 'articles', color: '#f0b9b9' },
	{ name: 'Contact', href: '/contact', icon: 'contact', color: '#c9b8dd' },
];

const FILTER_ID = 'crayon-nav';

function AppNavRail() {
	const router = useRouter();

	return (
		<motion.nav
			initial={{ opacity: 0, x: -12 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.45, ease: 'easeOut' }}
			id="nav"
			className="nav-rail"
			aria-label="Primary"
		>
			{/* One hidden SVG holds the filters the icons reference by id. */}
			<svg className="crayon-defs-host" aria-hidden="true" focusable="false">
				<CrayonDefs id={FILTER_ID} />
			</svg>

			<Link href="/" aria-label="Home" className="nav-rail-logo">
				S<span>.</span>
			</Link>

			<ul className="nav-rail-list">
				{navLinks.map((link) => {
					const isActive =
						router.pathname === link.href ||
						router.pathname.startsWith(`${link.href}/`);

					return (
						<li key={link.name}>
							<Link
								href={link.href}
								className={`nav-rail-item ${isActive ? 'is-active' : ''}`}
								aria-current={isActive ? 'page' : undefined}
							>
								<CrayonIcon
									name={link.icon}
									color={link.color}
									filterId={FILTER_ID}
								/>
								{/* Shown on hover and on keyboard focus, so the rail is still
								    navigable without a pointer. */}
								<span className="nav-rail-label">{link.name}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</motion.nav>
	);
}

export default AppNavRail;
