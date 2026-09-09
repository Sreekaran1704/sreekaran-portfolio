import { motion } from 'framer-motion';

function AboutMe() {
	return (
		<section className="about-paper-section px-6 py-20 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<motion.div
					initial={false}
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
						initial={false}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease: 'easeOut' }}
						className="about-left-column"
					>
						<div className="photo-board">
							<div className="photo-sticky-note">
								<div className="note-pin" />
								<p>
									&ldquo;The real value of data is not in the dashboard or the number, it is in the decision it improves.&rdquo;
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
								<strong>Data Analyst · Causal Inference · LLMs</strong>
							</div>

							<div className="info-row">
								<p>Degree</p>
								<strong>M.S. Computer Science · 3.97 GPA</strong>
							</div>
						</div>
					</motion.div>

					{/* Main about text */}
					<motion.div
						initial={false}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
						className="about-main-column"
					>
						<div className="about-story">
							<p>
								I started out doing data analysis in places that had no data analyst. At Sree Nirman, 50,000+ construction records lived across scattered files and inconsistent formats. Pricing decisions were made on gut feel because nobody trusted the numbers enough to use them. At Avanthi High School, it was the same problem in a different shape: 12,000+ financial records and 50,000+ expense records with no standardized schema, and a scholarship process nobody could fully explain. In both places, my first job was earning the right to be trusted with the data at all, building the SQL and Python pipelines, validation checks, and Tableau dashboards before I could say anything interesting about what the numbers meant.
							</p>

							<p>
								Once that foundation existed, the real work started. At Sree Nirman, I built a tender estimation model to flag pricing risk before bids went out. At Avanthi, I replaced the scholarship process with a system combining regression and a fine-tuned language model, then ran a two-channel A/B test to confirm a new admissions initiative was actually working. It was.
							</p>

							<p>
								The project that changed how I think about analysis was FanHouse, a study I built with synthetic retail data. Members spent 22.3% more after launch, but eventual members already spent 40.6% more before it. I used matching followed by difference-in-differences to make the comparison more useful. Estimated product value increased before discounts, while higher net payments were not established. I kept the pretrend warning and sensitivity results visible. That was when I started asking not just whether a number looked convincing, but what evidence would let me defend it.
							</p>

							<p>
								That&apos;s the thread through everything I do now: SQL and Python to make data trustworthy, Tableau to make it legible, and causal inference to make it actionable. I&apos;m currently looking for my next place to do that, as a Data Analyst, Business Analyst, BI Analyst, Analytics Engineer, or in Applied AI.
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

export default AboutMe;