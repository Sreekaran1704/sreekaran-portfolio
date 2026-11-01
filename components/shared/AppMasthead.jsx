import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
	FiArrowLeft,
	FiBookOpen,
	FiBriefcase,
	FiCpu,
	FiEdit3,
	FiFileText,
	FiFolder,
	FiHome,
	FiMail,
	FiUser,
} from 'react-icons/fi';
import EditionToggle from './EditionToggle';

const navLinks = [
	{ name: 'Front Page', href: '/#home', Icon: FiHome },
	{ name: 'Projects', href: '/#projects', Icon: FiFolder },
	{ name: 'Experience', href: '/#experience', Icon: FiBriefcase },
	{ name: 'About', href: '/#about', Icon: FiUser },
	{ name: 'Writing', href: '/#articles', Icon: FiEdit3 },
	{ name: 'Skills', href: '/#skills', Icon: FiCpu },
	{ name: 'Contact', href: '/#contact', Icon: FiMail },
];

// The resume is its own edition of the paper, with its own sections. Each
// link keeps the desk colour its section uses on the page.
const resumeLinks = [
	{ name: 'Summary', href: '/resume#summary', tone: 'front', Icon: FiFileText },
	{ name: 'Experience', href: '/resume#experience', tone: 'experience', Icon: FiBriefcase },
	{ name: 'Projects', href: '/resume#projects', tone: 'projects', Icon: FiFolder },
	{ name: 'Education', href: '/resume#education', tone: 'about', Icon: FiBookOpen },
	{ name: 'Skills', href: '/resume#skills', tone: 'skills', Icon: FiCpu },
	{ name: '← Portfolio', tabName: 'Portfolio', href: '/', tone: 'contact', Icon: FiArrowLeft },
];

const editions = {
	portfolio: {
		links: navLinks,
		home: '/',
		nameplate: 'The Sreekaran Reddy Portfolio',
		mark: 'The S.R. Portfolio',
		ear: 'Late Edition',
		earNote: 'M.S. Computer Science · 3.97 GPA',
	},
	resume: {
		links: resumeLinks,
		home: '/resume',
		nameplate: 'The Sreekaran Résumé',
		mark: 'The S.R. Résumé',
		ear: 'Special Edition',
		earNote: 'Data Scientist · 3.97 GPA',
	},
};

const sectionId = (href) => href.split('#')[1];

function AppMasthead() {
	const router = useRouter();
	const edition = router.pathname === '/resume' ? editions.resume : editions.portfolio;
	const { links } = edition;

	// The nameplate goes to the edition's clean URL. Already there, it just
	// scrolls back to the top and drops any #section from the address bar.
	const goHome = (event) => {
		if (router.pathname !== edition.home) return;
		event.preventDefault();
		window.history.replaceState(window.history.state, '', edition.home);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
	const mastRef = useRef(null);
	const tabsRef = useRef(null);
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
		if (router.pathname !== '/' && router.pathname !== '/resume') return undefined;

		let frame;
		const updateActiveSection = () => {
			const sections = links
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
	}, [router.pathname, links]);

	// Where the section bar scrolls sideways, fade whichever edge has more tabs.
	useEffect(() => {
		const tabs = tabsRef.current;
		if (!tabs) return undefined;
		const updateEdges = () => {
			tabs.classList.toggle('has-more-left', tabs.scrollLeft > 2);
			tabs.classList.toggle('has-more-right', tabs.scrollLeft + tabs.clientWidth < tabs.scrollWidth - 2);
		};
		updateEdges();
		tabs.addEventListener('scroll', updateEdges, { passive: true });
		window.addEventListener('resize', updateEdges);
		return () => {
			tabs.removeEventListener('scroll', updateEdges);
			window.removeEventListener('resize', updateEdges);
		};
	}, []);

	// ...and keep the current section's tab in view as the reader moves down.
	useEffect(() => {
		const tabs = tabsRef.current;
		const active = tabs?.querySelector('a.is-active');
		if (!active || tabs.scrollWidth <= tabs.clientWidth) return;
		const tabBox = active.getBoundingClientRect();
		const barBox = tabs.getBoundingClientRect();
		tabs.scrollBy({
			left: tabBox.left - barBox.left - (barBox.width - tabBox.width) / 2,
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
		});
	}, [activeSection]);

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
							<strong>{edition.ear}</strong>
							{edition.earNote}
						</span>
					</div>

					<Link href={edition.home} className="np-nameplate" onClick={goHome}>
						{edition.nameplate}
					</Link>

					<div className="np-mast-rule" aria-hidden="true" />
				</div>
			</header>

			<nav className={`np-sections ${stuck ? 'is-stuck' : ''}`} aria-label="Sections">
				<div className="np-wrap np-sections-inner">
					<Link href={edition.home} className="np-sections-mark" aria-hidden={!stuck} tabIndex={stuck ? 0 : -1} onClick={goHome}>
						{edition.mark}
					</Link>
					<ul ref={tabsRef}>
						{links.map((link) => {
							const id = sectionId(link.href);
							const isActive = Boolean(id) && activeSection === id;
							return (
								<li key={link.name} style={link.tone ? { '--c': `var(--c-${link.tone})` } : undefined}>
									<Link
										href={link.href}
										className={isActive ? 'is-active' : ''}
										aria-current={isActive ? 'location' : undefined}
									>
										{/* On a phone this bar is a bottom tab bar (see mobile.css). */}
										<span className="np-tab-icon" aria-hidden="true"><link.Icon /></span>
										<span className="np-wide-only">{link.name}</span>
										<span className="np-phone-only">{link.tabName || link.name}</span>
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
