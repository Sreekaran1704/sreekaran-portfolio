import { motion } from 'framer-motion';
import useThemeSwitcher from '../../hooks/useThemeSwitcher';

function AppBanner() {
	const [activeTheme] = useThemeSwitcher();

	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ ease: 'easeInOut', duration: 0.9, delay: 0.2 }}
			className="glass-card mt-24 flex flex-col-reverse items-center justify-between gap-12 rounded-[2rem] px-6 py-12 sm:px-10 lg:flex-row lg:px-16 lg:py-16"
		>
			{/* Left text */}
			<div className="w-full text-center lg:w-1/2 lg:text-left">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						ease: 'easeInOut',
						duration: 0.9,
						delay: 0.1,
					}}
					className="leading-tight tracking-tight text-primary-dark dark:text-primary-light"
				>
					<span className="block text-3xl font-bold sm:text-4xl lg:text-6xl">
						Hello, Sreekaran here! 👋
					</span>

					<span className="mt-5 block max-w-3xl text-2xl font-normal leading-snug text-gray-700 dark:text-gray-300 sm:text-xl lg:text-2xl">
						I try to investigate the the footprints businesses leave in their data.
					</span>
				</motion.h1>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						ease: 'easeInOut',
						duration: 0.9,
						delay: 0.2,
					}}
					className="mx-auto mt-7 max-w-2xl space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base lg:mx-0"
				>
					<p>
						From school fee records to construction costs, every dataset I’ve
						worked with carried a trail: overspending, missed revenue,
						inconsistent decisions, delayed progress, or hidden risk. I follow
						those trails with SQL, Python, Tableau, Machine Learning, and
						Applied AI, while continuously learning new tools that help me work
						sharper, faster, and closer to the real problem. My goal is to turn
						scattered records into dashboards, prediction models, and insights
						that help teams see what their data has been trying to say.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						ease: 'easeInOut',
						duration: 0.9,
						delay: 0.3,
					}}
					className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
				>
					<a
						href="https://drive.google.com/file/d/1pFrw6AF9ftb5T-YWQIMjhhTpZ8tL-rpg/view?usp=sharing"
						target="_blank"
						rel="noopener noreferrer"
						className="glass-button font-general-medium rounded-full px-8 py-4 text-base text-white duration-300"
					>
						View Resume
					</a>

					<a
						href="mailto:sreekaran.2021@gmail.com"
						className="font-general-medium rounded-full border border-gray-200 bg-white/70 px-8 py-4 text-base text-primary-dark shadow-sm duration-300 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-primary-light dark:hover:text-indigo-300"
					>
						Contact Me
					</a>
				</motion.div>
			</div>

			{/* Right photo */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ ease: 'easeInOut', duration: 0.9, delay: 0.2 }}
				className="flex w-full justify-center lg:w-1/2 lg:translate-y-8 lg:justify-center"
			>
				<div className="glass-card rounded-[2.25rem] p-4">
					<img
						className="h-[520px] w-[390px] rounded-[1.75rem] object-cover object-[center_45%] shadow-2xl"
						src="/images/sreekaran3.jpg"
						alt="Sreekaran Reddy"
					/>
				</div>
			</motion.div>
		</motion.section>
	);
}

export default AppBanner;