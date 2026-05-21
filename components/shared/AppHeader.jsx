import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiX, FiMenu } from 'react-icons/fi';
import useThemeSwitcher from '../../hooks/useThemeSwitcher';

function AppHeader() {
	const [showMenu, setShowMenu] = useState(false);
	const [activeTheme, setTheme] = useThemeSwitcher();

	function toggleMenu() {
		setShowMenu(!showMenu);
	}

	return (
		<motion.nav
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			id="nav"
			className="sticky top-4 z-50 sm:container sm:mx-auto"
		>
			{/* Header */}
			<div className="glass-card z-10 mx-4 sm:mx-auto max-w-screen-lg xl:max-w-screen-xl block sm:flex sm:justify-between sm:items-center px-5 sm:px-8 py-2.5 rounded-2xl">
				{/* Header menu links and small screen hamburger menu */}
				<div className="flex justify-between items-center px-4 sm:px-0">
					<div>
						<Link href="/">
						<span className="font-general-semibold cursor-pointer text-xl sm:text-2xl tracking-tight text-primary-dark dark:text-primary-light">
							Sreekaran<span className="text-indigo-500">.</span>
						</span>
						</Link>
					</div>

					{/* Theme switcher small screen */}
					<div
						onClick={() => setTheme(activeTheme)}
						aria-label="Theme Switcher"
						className="block sm:hidden ml-0 bg-white/60 dark:bg-white/10 p-3 shadow-sm rounded-full cursor-pointer border border-white/40 dark:border-white/10 backdrop-blur-md hover:scale-105 duration-300"
					>
						{activeTheme === 'dark' ? (
							<FiMoon className="text-ternary-dark hover:text-gray-400 dark:text-ternary-light dark:hover:text-primary-light text-xl" />
						) : (
							<FiSun className="text-gray-200 hover:text-gray-50 text-xl" />
						)}
					</div>

					{/* Small screen hamburger menu */}
					<div className="sm:hidden">
						<button
							onClick={toggleMenu}
							type="button"
							className="focus:outline-none"
							aria-label="Hamburger Menu"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								className="h-7 w-7 fill-current text-secondary-dark dark:text-ternary-light"
							>
								{showMenu ? (
									<FiX className="text-3xl" />
								) : (
									<FiMenu className="text-3xl" />
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Header links small screen */}
				<div
					className={
						showMenu
							? 'block m-0 sm:ml-4 sm:mt-3 md:flex px-5 py-3 sm:p-0 justify-between items-center shadow-lg sm:shadow-none'
							: 'hidden'
					}
				>
					<div className="block text-left text-lg text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 sm:mx-4 mb-2 sm:py-2 border-t border-white/30 dark:border-white/10 pt-3 sm:pt-2 sm:border-t-0 duration-300">
						<Link href="/projects" aria-label="Projects">
							Projects
						</Link>
					</div>

					<div className="block text-left text-lg text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 sm:mx-4 mb-2 sm:py-2 border-t border-white/30 dark:border-white/10 pt-3 sm:pt-2 sm:border-t-0 duration-300">
						<Link href="/experience" aria-label="Experience">
							Experience
						</Link>
					</div>

					<div className="block text-left text-lg text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 sm:mx-4 mb-2 sm:py-2 border-t border-white/30 dark:border-white/10 pt-3 sm:pt-2 sm:border-t-0 duration-300">
						<Link href="/skills" aria-label="Skills">
							Skills
						</Link>
					</div>

					<div className="block text-left text-lg text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 sm:mx-4 mb-2 sm:py-2 border-t border-white/30 dark:border-white/10 pt-3 sm:pt-2 sm:border-t-0 duration-300">
						<Link href="/articles" aria-label="Articles">
							Articles
						</Link>
					</div>

					<div className="block text-left text-lg text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 sm:mx-4 mb-2 sm:py-2 border-t border-white/30 dark:border-white/10 pt-3 sm:pt-2 sm:border-t-0 duration-300">
						<Link href="/contact" aria-label="Contact">
							Contact
						</Link>
					</div>
				</div>

				{/* Header links large screen */}
				<div className="font-general-medium hidden m-0 sm:ml-4 mt-5 sm:mt-3 sm:flex p-5 sm:p-0 justify-center items-center shadow-lg sm:shadow-none">
					<div
						className="block text-left text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 sm:mx-3 mb-2 sm:py-2 duration-300"
						aria-label="Projects"
					>
						<Link href="/projects">Projects</Link>
					</div>

					<div
						className="block text-left text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 sm:mx-4 mb-2 sm:py-2"
						aria-label="Experience"
					>
						<Link href="/experience">Experience</Link>
					</div>

					<div
						className="block text-left text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 sm:mx-4 mb-2 sm:py-2"
						aria-label="Skills"
					>
						<Link href="/skills">Skills</Link>
					</div>

					<div
						className="block text-left text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 sm:mx-3 mb-2 sm:py-2 duration-300"
						aria-label="Articles"
					>
						<Link href="/articles">Articles</Link>
				</div>

					<div
						className="block text-left text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 sm:mx-4 mb-2 sm:py-2"
						aria-label="Contact"
					>
						<Link href="/contact">Contact</Link>
					</div>
				</div>

				{/* Theme switcher large screen */}
				<div className="hidden sm:flex justify-between items-center flex-col md:flex-row">
					<div
						onClick={() => setTheme(activeTheme)}
						aria-label="Theme Switcher"
						className="ml-6 bg-white/60 dark:bg-white/10 p-3 shadow-sm rounded-full cursor-pointer border border-white/40 dark:border-white/10 backdrop-blur-md hover:scale-105 duration-300"
					>
						{activeTheme === 'dark' ? (
							<FiMoon className="text-ternary-dark hover:text-gray-400 dark:text-ternary-light dark:hover:text-primary-light text-xl" />
						) : (
							<FiSun className="text-gray-200 hover:text-gray-50 text-xl" />
						)}
					</div>
				</div>
			</div>
		</motion.nav>
	);
}

export default AppHeader;