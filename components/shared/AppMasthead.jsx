import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import EditionToggle from './EditionToggle';

const navLinks = [
	{ name: 'Front Page', href: '/#home' },
	{ name: 'Projects', href: '/#projects' },
	{ name: 'Experience', href: '/#experience' },
	{ name: 'About', href: '/#about' },
	{ name: 'Writing', href: '/#articles' },
	{ name: 'Skills', href: '/#skills' },
	{ name: 'Contact', href: '/#contact' },
];

const sectionId = (href) => href.split('#')[1];

function AppMasthead() {
	const router = useRouter();
	const mastRef = useRef(null);
	const [activeSection, setActiveSection] = useState('');
	const [stuck, setStuck] = useState(false);
	// Once the nameplate scrolls away, the section bar carries a small one.
	useEffect(() => {
		const el = mastRef.current;
		if (!el || typeof IntersectionObserver === 'undefined') return undefined;
		const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting));
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (router.pathname !== '/') return undefined;

		let frame;
		const updateActiveSection = () => {
			const sections = navLinks
				.map((link) => document.getElementById(sectionId(link.href)))
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
		<>
			<header ref={mastRef} className="np-masthead">
				<div className="np-wrap">
					{/* One strip above the nameplate: ear, edition switch, ear. */}
					<div className="np-earline">
						<div className="np-edition-bar">
							<EditionToggle />
						</div>
						<span className="np-ear np-ear-right">
							<strong>Late Edition</strong>
							M.S. Computer Science · 3.97 GPA
						</span>
					</div>

					<Link href="/#home" className="np-nameplate">
						The Sreekaran Reddy Portfolio
					</Link>

					<div className="np-mast-rule" aria-hidden="true" />
				</div>
			</header>

			<nav className={`np-sections ${stuck ? 'is-stuck' : ''}`} aria-label="Sections">
				<div className="np-wrap np-sections-inner">
					<Link href="/#home" className="np-sections-mark" aria-hidden={!stuck} tabIndex={stuck ? 0 : -1}>
						The S.R. Portfolio
					</Link>
					<ul>
						{navLinks.map((link) => {
							const id = sectionId(link.href);
							const isActive = router.pathname === '/' && activeSection === id;
							return (
								<li key={link.name}>
									<Link
										href={link.href}
										className={isActive ? 'is-active' : ''}
										aria-current={isActive ? 'location' : undefined}
									>
										{link.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</nav>
		</>
	);
}

export default AppMasthead;
