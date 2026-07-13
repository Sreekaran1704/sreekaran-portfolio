import { motion } from 'framer-motion';

function AboutMe() {
	return (
		<section className="about-paper-section px-6 py-20 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.55, ease: 'easeOut' }}
					className="mb-12"
				>
					<h2 className="about-heading">A short intro of me</h2>
				</motion.div>

				<div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_1fr]">
					{/* Left scrapbook column */}
					<motion.div
						initial={{ opacity: 0, x: -24 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease: 'easeOut' }}
						className="about-left-column"
					>
						<div className="photo-board">
							<div className="photo-sticky-note">
								<div className="note-pin" />
								<p>
									“The hard part is not just finding the number — it is knowing
									what decision the number should support.”
								</p>
							</div>

							<div className="scrap-photo-cutout">
								<div className="plaster plaster-left" />
								<div className="plaster plaster-bottom" />

								<img
									src="/images/sreekaran_profile.jpg"
									alt="Sreekaran Reddy"
									className="scrap-photo"
								/>
							</div>
						</div>

						<div className="about-contact-card">
							<div className="contact-pin" />
							<span className="contact-sticky-label">Contact Me</span>

							<div className="info-row">
								<p>Email</p>
								<strong>sreekaran.2021@gmail.com</strong>
							</div>

							<div className="info-row">
								<p>Focus</p>
								<strong>Analytics · BI · Applied AI</strong>
							</div>

							<div className="info-row">
								<p>Degree</p>
								<strong>M.S. Computer Science · 3.97 GPA</strong>
							</div>
						</div>
					</motion.div>

					{/* Main about text */}
					<motion.div
						initial={{ opacity: 0, x: 24 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
						className="about-main-column"
					>
						<div className="about-story">
							<p>
								<span className="about-dropcap">I’m</span> a Data Analyst and
								Applied AI builder focused on SQL, Python, Tableau, machine
								learning, and decision-support analytics. My work usually starts
								with messy real-world records: construction costs, school fee
								collections, budgets, expenses, project progress, pricing, and
								operational risk.
							</p>

							<p>
								At Sree Nirman, I worked across 50K+ construction, cost, labor,
								material, and progress records, converting fragmented files into
								validated reporting datasets, Tableau dashboards, variance
								analysis, and pricing recommendations.
							</p>

							<p>
								At Avanthi High School, I analyzed student financial records, fee
								collections, expenses, and budget variance. I built quality
								checks, recurring reports, dashboards, and concession-support
								logic that helped the school make clearer financial decisions.
							</p>

							<p>
								Right now, I am focused on data analyst, business analyst, BI
								analyst, analytics engineering, and applied AI roles where I can
								combine clean data workflows, dashboards, validation, and
								practical machine learning.
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

export default AboutMe;