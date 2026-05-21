import { motion } from 'framer-motion';
import { useState } from 'react';
import useThemeSwitcher from '../../hooks/useThemeSwitcher';

function AppBanner() {
	const [activeTheme] = useThemeSwitcher();
	const [showResumeOptions, setShowResumeOptions] = useState(false);

	return (
		<motion.section
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ ease: 'easeInOut', duration: 0.9, delay: 0.2 }}
	className="glass-card mt-24 flex flex-col-reverse items-center justify-between gap-12 rounded-[2rem] px-6 py-12 sm:px-10 lg:flex-row lg:px-16 lg:py-16"
>
	{/* Left text */}
	<div className="w-full lg:w-1/2 text-center lg:text-left">
		<motion.h1
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				ease: 'easeInOut',
				duration: 0.9,
				delay: 0.1,
			}}
			className="font-general-semibold text-medium leading-tight tracking-tight text-primary-dark dark:text-primary-light sm:text-5xl lg:text-5xl"
		>
			Hello,
			<br />
			Sreekaran here!👋
		</motion.h1>

		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				ease: 'easeInOut',
				duration: 0.9,
				delay: 0.2,
			}}
			className="mt-7 max-w-2xl space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base lg:mx-0 mx-auto"
		>
<p>
	I&apos;m a data + applied AI builder with an MS in Computer Science from the
	University of Missouri-Kansas City. I work where messy datasets enter like
	tangled wires and leave as dashboards, models, and systems people can
	actually use.
</p>

<p>
	All things data: cleaning, analysis, visualization, model building,
	fine-tuning, deployment, and storytelling. Yep, I like the full pipeline,
	from broken rows to business-ready insights.
</p>

<p>
	I&apos;ve built projects across hospital readmission forecasting,
	genre-controlled story generation, movie recommendation systems, MLOps
	pipelines, and financial analytics.
</p>

<p>
	Let&apos;s build work that does more than run. Work that explains, guides,
	and makes decisions easier. Data with a pulse. ⚡
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
			<button
				type="button"
				onClick={() => setShowResumeOptions(!showResumeOptions)}
				className="glass-button font-general-medium rounded-full px-8 py-4 text-base text-white duration-300"
				aria-expanded={showResumeOptions}
				aria-controls="resume-options"
			>
				Download Resume
			</button>

			<a
				href="mailto:sreekaran.2021@gmail.com"
				className="font-general-medium rounded-full border border-gray-200 bg-white/70 px-8 py-4 text-base text-primary-dark shadow-sm duration-300 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-primary-light dark:hover:text-indigo-300"
			>
				Contact Me
			</a>
		</motion.div>

		{showResumeOptions && (
			<div
				id="resume-options"
				className="glass-card mt-6 max-w-2xl rounded-3xl p-5 text-left"
			>
				<p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
					Resume note: All three versions reflect the same core experience,
					but each one is tailored to highlight the projects, tools, and
					responsibilities most relevant to Data Analyst, Data Science, or ML
					Engineering roles.
				</p>

				<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
					<a
						href="/files/Analyst.pdf"
						download="Analyst.pdf"
						className="rounded-full bg-white/80 px-5 py-3 text-center text-sm font-medium text-indigo-600 shadow-sm duration-300 hover:bg-white dark:bg-white/10 dark:text-indigo-200 dark:hover:bg-white/20"
					>
						Data Analyst
					</a>

					<a
						href="/files/Data_Science.pdf"
						download="Data_Science.pdf"
						className="rounded-full bg-white/80 px-5 py-3 text-center text-sm font-medium text-indigo-600 shadow-sm duration-300 hover:bg-white dark:bg-white/10 dark:text-indigo-200 dark:hover:bg-white/20"
					>
						Data Science
					</a>

					<a
						href="/files/ML_Engineer.pdf"
						download="ML_Engineer.pdf"
						className="rounded-full bg-white/80 px-5 py-3 text-center text-sm font-medium text-indigo-600 shadow-sm duration-300 hover:bg-white dark:bg-white/10 dark:text-indigo-200 dark:hover:bg-white/20"
					>
						ML Engineer
					</a>
				</div>
			</div>
		)}
	</div>

	{/* Right photo */}
<motion.div
	initial={{ opacity: 0, scale: 0.95 }}
	animate={{ opacity: 1, scale: 1 }}
	transition={{ ease: 'easeInOut', duration: 0.9, delay: 0.2 }}
	className="flex w-full justify-center lg:w-1/2 lg:justify-center lg:translate-y-8"
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