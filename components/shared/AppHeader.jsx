import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiX, FiMenu } from 'react-icons/fi';

function AppHeader() {
	const [showMenu, setShowMenu] = useState(false);

	function toggleMenu() {
		setShowMenu(!showMenu);
	}

	function closeMenu() {
		setShowMenu(false);
	}

	const navLinks = [
		{ name: 'About Me', href: '/about' },
		{ name: 'Projects', href: '/projects' },
		{ name: 'Experience', href: '/experience' },
		{ name: 'Skills', href: '/skills' },
		{ name: 'Articles', href: '/articles' },
		{ name: 'Contact', href: '/contact' },
	];

	return (
		<motion.nav
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: 'easeOut' }}
			id="nav"
			className="sticky top-0 z-50 w-full"
		>
			<div className="paper-nav w-full block sm:flex sm:justify-between sm:items-center px-6 sm:px-10 lg:px-20 py-3 rounded-none">
				{/* Logo and mobile menu */}
				<div className="flex justify-between items-center">
					<Link href="/" aria-label="Home" onClick={closeMenu}>
						<span className="handwriting-logo cursor-pointer text-xl lg:text-2xl font-normal tracking-wide text-stone-900 hover:text-indigo-700 transition duration-300">
							Sreekaran
							<span className="text-indigo-600">.</span>
						</span>
					</Link>

					{/* Mobile hamburger */}
					<div className="sm:hidden">
						<button
							onClick={toggleMenu}
							type="button"
							className="focus:outline-none"
							aria-label="Hamburger Menu"
						>
							{showMenu ? (
								<FiX className="text-3xl text-stone-800" />
							) : (
								<FiMenu className="text-3xl text-stone-800" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile links */}
				<div
					className={
						showMenu
							? 'block sm:hidden px-1 pt-4 pb-2'
							: 'hidden'
					}
				>
					{navLinks.map((link) => (
						<div
							key={link.name}
							className="handwriting-nav block text-left text-xl font-semibold italic text-stone-800 hover:text-indigo-700 mb-3 pt-3 border-t border-stone-300 duration-300"
						>
							<Link href={link.href} aria-label={link.name} onClick={closeMenu}>
								{link.name}
							</Link>
						</div>
					))}
				</div>

				{/* Desktop links */}
				<div className="hidden sm:flex justify-center items-center">
					{navLinks.map((link) => (
						<div
							key={link.name}
							className="handwriting-nav relative block text-left text-lg lg:text-xl font-semibold italic text-stone-800 hover:text-indigo-700 sm:mx-3 lg:mx-4 py-2 duration-300 after:absolute after:left-0 after:bottom-1 after:h-[1.5px] after:w-0 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full"
						>
							<Link href={link.href} aria-label={link.name}>
								{link.name}
							</Link>
						</div>
					))}
				</div>
			</div>
		</motion.nav>
	);
}

export default AppHeader;