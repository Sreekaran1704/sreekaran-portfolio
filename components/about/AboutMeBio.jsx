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
									“The real value of data is not in the dashboard or the number, it is in the decision it improves.”
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
								<span className="about-dropcap">I’m</span> a Data Analyst and Applied AI practitioner with a strong foundation in business analytics, data visualization, and machine learning. My work focuses on turning fragmented operational data into validated datasets, Tableau dashboards, predictive models, and decision-support tools using SQL, Python, Tableau, and Excel.
							</p>

							<p>
								At Sree Nirman, I worked with 50,000+ construction, cost, labor, material, budget, and project-progress records. I built SQL and Python workflows to improve data quality and reporting reliability, developed Tableau dashboards for cost variance, resource utilization, timeline risk, and project performance, and created an ML-supported tender estimation workflow to identify cost drivers and pricing risks. At Avanthi High School, I analyzed student financial and institutional expense data, built reconciliation workflows and Tableau reporting, and developed decision-support logic for fee concessions, collection gaps, and budget monitoring.
							</p>

							<p>
								Alongside analytics, I have hands-on experience with regression, classification, feature engineering, model evaluation, MLOps, and LLM fine-tuning using LoRA and QLoRA. I am currently pursuing opportunities as a Data Analyst, Business Analyst, BI Analyst, Analytics Engineer, or in Applied AI, where I can leverage robust data workflows, Tableau reporting, machine learning, and effective stakeholder communication to enable informed, data-driven decision-making.
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

export default AboutMe;