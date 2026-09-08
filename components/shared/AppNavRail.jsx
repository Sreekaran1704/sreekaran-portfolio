import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { CrayonDefs, CrayonIcon } from './CrayonArt';

const navLinks = [
	{ name: 'About Me', href: '/#about', icon: 'about', color: '#f2d99a' },
	{ name: 'Projects', href: '/#projects', icon: 'projects', color: '#a8cbb8' },
	{ name: 'Experience', href: '/#experience', icon: 'experience', color: '#b9c8e4' },
	{ name: 'Articles', href: '/#articles', icon: 'articles', color: '#f0b9b9' },
	{ name: 'Skills', href: '/#skills', icon: 'skills', color: '#e5c49d' },
	{ name: 'Contact', href: '/#contact', icon: 'contact', color: '#c9b8dd' },
];

const FILTER_ID = 'crayon-nav';

function AppNavRail() {
	const router = useRouter();
	const [activeSection, setActiveSection] = useState('');

	useEffect(() => {
		if (router.pathname !== '/') return undefined;

		let frame;
		const updateActiveSection = () => {
			const sections = navLinks
				.map((link) => document.getElementById(link.href.split('#')[1]))
				.filter(Boolean)
				.sort((a, b) => a.offsetTop - b.offsetTop);
			const marker = window.innerHeight * 0.3;
			let current = '';
			for (const section of sections) {
				if (section.getBoundingClientRect().top <= marker) current = section.id;
			}
			if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
				current = sections[sections.length - 1]?.id || current;
			}
			setActiveSection(current);
		};
		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(updateActiveSection);
		};
		updateActiveSection();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, [router.pathname]);

	return (
		<motion.nav
			initial={false}
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

			<Link href="/#home" aria-label="Home" className="nav-rail-logo">
				S<span>.</span>
			</Link>

			<ul className="nav-rail-list">
				{navLinks.map((link) => {
					const isActive =
						router.pathname === '/'
							? activeSection === link.href.split('#')[1]
							: router.pathname.startsWith(`/${link.href.split('#')[1]}/`);

					return (
						<li key={link.name}>
							<Link
								href={link.href}
								className={`nav-rail-item ${isActive ? 'is-active' : ''}`}
								aria-current={isActive ? 'location' : undefined}
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
