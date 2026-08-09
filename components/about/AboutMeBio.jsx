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
								I started out doing data analysis in places that had no data analyst. At Sree Nirman, 50,000+ construction records lived across scattered files and inconsistent formats. Pricing decisions were made on gut feel because nobody trusted the numbers enough to use them. At Avanthi High School, it was the same problem in a different shape: 12,000+ financial records and 50,000+ expense records with no standardized schema, and a scholarship process nobody could fully explain. In both places, my first job was earning the right to be trusted with the data at all, building the SQL and Python pipelines, validation checks, and Tableau dashboards before I could say anything interesting about what the numbers meant.
							</p>

							<p>
								Once that foundation existed, the real work started. At Sree Nirman, I built a tender estimation model to flag pricing risk before bids went out. At Avanthi, I replaced the scholarship process with a system combining regression and a fine-tuned language model, then ran a two-channel A/B test to confirm a new admissions initiative was actually working. It was.
							</p>

							<p>
								The project that changed how I think about analysis was FanHouse. I ran a randomized experiment across 50,000 customers to measure a membership program&apos;s real impact on revenue. The naive comparison, people who joined versus people who didn&apos;t, said the effect was huge. It was wrong, by a factor of 8, because people who join loyalty programs are already a company&apos;s best customers. I caught that with a placebo test, then rebuilt the estimate using propensity score matching and difference-in-differences, two independent methods that converged on the same number once the bias was gone. That was when I stopped reporting what the data says and started checking whether the data is saying what it looks like it&apos;s saying.
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