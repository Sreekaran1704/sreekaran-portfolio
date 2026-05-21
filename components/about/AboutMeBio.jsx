import Image from 'next/image';
import { aboutMeData } from '../../data/aboutMeData';

function AboutMeBio() {
	return (
		<section className="py-10 sm:py-16">
			<div className="container mx-auto">
				<div className="glass-card rounded-[2rem] p-7 sm:p-10">
					<div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-3">
						<div className="flex justify-center lg:justify-start">
							<div className="rounded-[2rem] bg-white/50 p-3 shadow-xl dark:bg-white/10">
								<Image
									src="/images/profile.jpeg"
									width={280}
									height={280}
									className="rounded-[1.5rem] object-cover"
									alt="Sreekaran Reddy profile"
								/>
							</div>
						</div>

						<div className="lg:col-span-2">
							<p className="mb-4 inline-flex rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
								About Me
							</p>

							<h1 className="font-general-semibold text-4xl sm:text-5xl text-primary-dark dark:text-primary-light tracking-tight mb-6">
								Data, ML, and applied AI with a storytelling edge.
							</h1>

							<div className="space-y-5">
								{aboutMeData.map((bio) => (
									<p
										className="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
										key={bio.id}
									>
										{bio.bio}
									</p>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default AboutMeBio;