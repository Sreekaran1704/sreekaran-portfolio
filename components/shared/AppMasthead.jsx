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
	FiMoreHorizontal,
	FiUser,
} from 'react-icons/fi';
import EditionToggle from './EditionToggle';

// On a phone, `primary` links sit in the tab bar and the rest open from More.
const navLinks = [
	{ name: 'Front Page', href: '/#home', tone: 'front', Icon: FiHome, primary: true },
	{ name: 'Projects', href: '/#projects', tone: 'projects', Icon: FiFolder, primary: true },
	{ name: 'Experience', href: '/#experience', tone: 'experience', Icon: FiBriefcase, primary: true },
	{ name: 'About', href: '/#about', tone: 'about', Icon: FiUser },
	{ name: 'Writing', href: '/#articles', tone: 'writing', Icon: FiEdit3, primary: true },
	{ name: 'Skills', href: '/#skills', tone: 'skills', Icon: FiCpu },
	{ name: 'Contact', href: '/#contact', tone: 'contact', Icon: FiMail },
];

// The resume is its own edition of the paper, with its own sections. Each
// link keeps the desk colour its section uses on the page.
const resumeLinks = [
	{ name: 'Summary', href: '/resume#summary', tone: 'front', Icon: FiFileText, primary: true },
	{ name: 'Experience', href: '/resume#experience', tone: 'experience', Icon: FiBriefcase, primary: true },
	{ name: 'Projects', href: '/resume#projects', tone: 'projects', Icon: FiFolder, primary: true },
	{ name: 'Education', href: '/resume#education', tone: 'about', Icon: FiBookOpen, primary: true },
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
	const moreRef = useRef(null);
	const [activeSection, setActiveSection] = useState('');
	const [stuck, setStuck] = useState(false);
	const [moreOpen, setMoreOpen] = useState(false);
	const closeMore = () => setMoreOpen(false);
	const moreLinks = links.filter((link) => !link.primary);
	const activeMoreLink = moreLinks.find((link) => sectionId(link.href) === activeSection);
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

	// Where the section bar runs out of room (a small tablet), keep the current
	// section's tab in view as the reader moves down.
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

	// The More grid closes on a browser back or forward as well as on a tap.
	useEffect(() => {
		const close = () => setMoreOpen(false);
		router.events.on('routeChangeStart', close);
		router.events.on('hashChangeStart', close);
		return () => {
			router.events.off('routeChangeStart', close);
			router.events.off('hashChangeStart', close);
		};
	}, [router.events]);

	useEffect(() => {
		if (!moreOpen) return undefined;
		const onKeyDown = (event) => {
			if (event.key !== 'Escape') return;
			setMoreOpen(false);
			moreRef.current?.focus();
		};
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [moreOpen]);

	// Tabbing out of the bar closes the grid too.
	const onNavBlur = (event) => {
		if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) closeMore();
	};

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

			<nav className={`np-sections ${stuck ? 'is-stuck' : ''}`} aria-label="Sections" onBlur={onNavBlur}>
				<div className="np-wrap np-sections-inner">
					<Link href={edition.home} className="np-sections-mark" aria-hidden={!stuck} tabIndex={stuck ? 0 : -1} onClick={goHome}>
						{edition.mark}
					</Link>
					<ul ref={tabsRef}>
						{links.map((link) => {
							const id = sectionId(link.href);
							const isActive = Boolean(id) && activeSection === id;
							return (
								<li
									key={link.name}
									className={link.primary ? undefined : 'np-tab-extra'}
									style={{ '--c': `var(--c-${link.tone})` }}
								>
									<Link
										href={link.href}
										className={isActive ? 'is-active' : ''}
										aria-current={isActive ? 'location' : undefined}
										onClick={closeMore}
									>
										{/* On a phone this bar is a bottom tab bar (see mobile.css). */}
										<span className="np-tab-icon" aria-hidden="true"><link.Icon /></span>
										<span className="np-wide-only">{link.name}</span>
										<span className="np-phone-only">{link.tabName || link.name}</span>
									</Link>
								</li>
							);
						})}
						<li
							className="np-tab-more"
							style={activeMoreLink ? { '--c': `var(--c-${activeMoreLink.tone})` } : undefined}
						>
							<button
								ref={moreRef}
								type="button"
								className={`np-tab-more-btn ${activeMoreLink ? 'is-active' : ''} ${moreOpen ? 'is-open' : ''}`}
								aria-expanded={moreOpen}
								aria-controls="np-more-panel"
								onClick={() => setMoreOpen((open) => !open)}
							>
								<span className="np-tab-icon" aria-hidden="true"><FiMoreHorizontal /></span>
								<span>More</span>
							</button>
						</li>
					</ul>
				</div>

				{moreOpen && (
					<>
						<div className="np-more-scrim" aria-hidden="true" onClick={closeMore} />
						<div id="np-more-panel" className="np-more-panel" role="group" aria-label="More sections">
							{moreLinks.map((link) => {
								const isActive = link === activeMoreLink;
								return (
									<Link
										key={link.name}
										href={link.href}
										className={`np-more-item ${isActive ? 'is-active' : ''}`}
										style={{ '--c': `var(--c-${link.tone})` }}
										aria-current={isActive ? 'location' : undefined}
										onClick={closeMore}
									>
										<span className="np-more-icon" aria-hidden="true"><link.Icon /></span>
										{link.tabName || link.name}
									</Link>
								);
							})}
						</div>
					</>
				)}
			</nav>
		</>
	);
}

export default AppMasthead;
