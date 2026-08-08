import { motion } from 'framer-motion';
import { FiArrowRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const workCards = [
	{
		id: 'sree-dashboard',
		label: 'Dashboard',
		title: 'Sree Nirman',
		art: 'dashboard1',
		metric: '50K+',
		note: 'construction records standardized',
	},
	{
		id: 'avanthi-dashboard',
		label: 'Dashboard',
		title: 'Avanthi High School',
		art: 'dashboard2',
		metric: '30%',
		note: 'reporting accuracy improved',
	},
	{
		id: 'sree-ml',
		label: 'ML Pipeline',
		title: 'Sree Nirman Pricing',
		art: 'ml',
		metric: '±10–20%',
		note: 'tender cost-estimation range',
	},
	{
		id: 'umkc',
		label: 'Academics',
		title: 'UMKC',
		art: 'umkc',
		metric: '3.97',
		note: 'M.S. Computer Science GPA',
	},
	{
		id: 'lora-story',
		label: 'System Design',
		title: 'LoRA Story Generator',
		art: 'lora',
		metric: '4-step',
		note: 'genre-controlled story pipeline',
	},
];

function renderDoodleArt(type) {
	switch (type) {
		case 'dashboard1':
			return (
				<div className="doodle-art">
					<div className="doodle-grid">
						<div className="kpi-box">
							<span className="tiny-note">Records</span>
							<strong>50K+</strong>
						</div>

						<div className="chart-box wide">
							<span className="tiny-note">Project Trend</span>
							<div className="mini-bar-chart">
								<span style={{ height: '32%' }} />
								<span style={{ height: '48%' }} />
								<span style={{ height: '56%' }} />
								<span style={{ height: '78%' }} />
								<span style={{ height: '68%' }} />
							</div>
						</div>

						<div className="kpi-box">
							<span className="tiny-note">Efficiency</span>
							<strong>15%</strong>
						</div>
					</div>
				</div>
			);

		case 'dashboard2':
			return (
				<div className="doodle-art">
					<div className="doodle-grid">
						<div className="kpi-box">
							<span className="tiny-note">Students</span>
							<strong>12K+</strong>
						</div>

						<div className="kpi-box">
							<span className="tiny-note">Expenses</span>
							<strong>50K+</strong>
						</div>

						<div className="chart-box wide">
							<span className="tiny-note">Collections / Spend</span>
							<div className="mini-area-chart" />
						</div>
					</div>
				</div>
			);

		case 'ml':
			return (
				<div className="doodle-art">
					<div className="pipeline-stack">
						<div className="pipeline-row">
							<div className="pipeline-node">Cost Data</div>
							<div className="pipeline-arrow">→</div>
							<div className="pipeline-node">Cleaning</div>
						</div>

						<div className="pipeline-row">
							<div className="pipeline-node">Features</div>
							<div className="pipeline-arrow">→</div>
							<div className="pipeline-node">Model</div>
						</div>

						<div className="pipeline-row">
							<div className="pipeline-node">Forecast</div>
							<div className="pipeline-arrow">→</div>
							<div className="pipeline-node">Bid Range</div>
						</div>
					</div>
				</div>
			);

		case 'umkc':
			return (
				<div className="doodle-art">
					<div className="umkc-doodle">
						<img
							src="/images/umkc.png"
							alt="UMKC doodle logo"
							className="umkc-doodle-logo"
						/>
						<div className="gpa-badge">3.97 GPA</div>
					</div>
				</div>
			);

		case 'lora':
			return (
				<div className="doodle-art">
					<div className="lora-flow">
						<div className="lora-box">Prompt</div>
						<div className="lora-arrow">↓</div>
						<div className="lora-box">Genre Control</div>
						<div className="lora-arrow">↓</div>
						<div className="lora-box">LoRA Model</div>
						<div className="lora-arrow">↓</div>
						<div className="lora-box">Story Output</div>
					</div>
				</div>
			);

		default:
			return null;
	}
}

function AppBanner() {
	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ ease: 'easeInOut', duration: 0.8 }}
			className="hero-notebook mt-0 min-h-[calc(100vh-72px)] w-full"
		>
			<div className="grid min-h-[calc(100vh-72px)] grid-cols-1 lg:grid-cols-2">
				{/* Left ruled notebook side */}
				<div className="hero-left-paper flex items-start border-r border-stone-500/40 px-6 pb-14 pt-24 sm:px-10 lg:px-16 lg:pt-28">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
						className="max-w-2xl"
					>
						<div className="scribble-badge mb-8 inline-flex items-center px-1 py-1">
							<span className="mr-3 h-2 w-2 rounded-full bg-stone-700" />
							<p className="hero-label text-[0.9rem] font-semibold text-stone-700">
								Open to Work · 2026
							</p>
						</div>

						<h1 className="hero-name mb-4 text-4xl font-semibold leading-none text-stone-900 sm:text-5xl lg:text-[3.4rem]">
							Sreekaran Reddy
						</h1>

						<h2 className="hero-subtitle mb-7 max-w-xl text-xl font-semibold leading-snug text-stone-700 sm:text-2xl lg:text-[1.7rem]">
							Data Analyst . Business Analytics & Decision Support . Applied AI, LLM Fine-Tuning
						</h2>

						<div className="mb-8 border-l-4 border-[#b9b982] pl-5">
							<p className="hero-quote max-w-xl text-lg leading-relaxed text-stone-700 sm:text-xl">
								“I investigate the footprints businesses leave in their data and turn scattered records into decisions people can trust.”
							</p>
						</div>

						<div className="mb-8 flex flex-wrap items-center gap-5">
							<a
								href="https://drive.google.com/file/d/1P0yQdLi8op0JPZ703_cfAMLTnhYCtTTW/view?usp=sharing"
								target="_blank"
								rel="noopener noreferrer"
								className="doodle-resume-btn inline-flex items-center gap-3 px-6 py-3 text-sm"
							>
								View Resume
								<FiArrowRight />
							</a>

							<div className="flex items-center gap-3">
								<a
									href="https://github.com/Sreekaran1704"
									target="_blank"
									rel="noreferrer"
									aria-label="GitHub"
									className="doodle-icon-btn rotate-[-4deg]"
								>
									<FiGithub />
								</a>

								<a
									href="https://www.linkedin.com/in/sree1704"
									target="_blank"
									rel="noreferrer"
									aria-label="LinkedIn"
									className="doodle-icon-btn rotate-[3deg]"
								>
									<FiLinkedin />
								</a>

								<a
									href="mailto:sreekaran.2021@gmail.com"
									aria-label="Email"
									className="doodle-icon-btn rotate-[-2deg]"
								>
									<FiMail />
								</a>
							</div>
						</div>

						{/* <p className="max-w-xl font-general-regular text-sm leading-7 text-stone-600 sm:text-[0.95rem]">
							From school fee records to construction costs, every dataset I have worked with carried a trail:
							overspending, missed revenue, inconsistent decisions, delayed progress, or hidden risk. I follow those
							trails with SQL, Python, Tableau, machine learning, and applied AI to build dashboards, validation
							workflows, pricing logic, and decision-support systems.
						</p> */}
					</motion.div>
				</div>

				{/* Right side card deck */}
				{/* Right side card deck */}
				<div className="hero-right-paper relative overflow-hidden px-6 pb-16 pt-20 sm:px-10 lg:px-12 lg:pt-24">
					<motion.div
						initial={{ opacity: 0, x: 28 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7, ease: 'easeOut', delay: 0.18 }}
						className="deck-spread"
					>
						{workCards.map((card, index) => (
							<motion.div
								key={card.id}
								whileHover={{ y: -12, rotate: 0, scale: 1.03 }}
								transition={{ duration: 0.24 }}
								className={`deck-card deck-card-${index + 1}`}
								tabIndex={0}
							>
								<div className="deck-card-pin" />

								<div className="deck-card-content">
									<p className="deck-card-label">{card.label}</p>
									<h4 className="deck-card-title">{card.title}</h4>

									<div className="deck-card-art">
										{renderDoodleArt(card.art)}
									</div>
								</div>

								<div className="deck-hover-overlay">
									<div className="deck-hover-art">
										{renderDoodleArt(card.art)}
									</div>

									<div className="deck-hover-stat">
										<span className="deck-hover-metric">{card.metric}</span>
										<p className="deck-hover-note">{card.note}</p>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
		</motion.section>
	);
}

export default AppBanner;