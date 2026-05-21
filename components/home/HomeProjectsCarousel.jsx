import { useRef } from 'react';
import ProjectSingle from '../projects/ProjectSingle';
import { projectsData } from '../../data/projectsData';

function HomeProjectsCarousel() {
	const scrollRef = useRef(null);

	const scroll = (direction) => {
		if (!scrollRef.current) return;

		scrollRef.current.scrollBy({
			left: direction === 'left' ? -420 : 420,
			behavior: 'smooth',
		});
	};

	return (
		<section id="projects" className="py-10 sm:py-16">
			<div className="container mx-auto">
				<div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="font-general-semibold text-4xl sm:text-5xl text-primary-dark dark:text-primary-light tracking-tight">
							Featured Work
						</h2>

						<p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							A selected collection of applied AI, data science, cloud, and MLOps projects.
						</p>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => scroll('left')}
							className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/70 text-2xl text-primary-dark shadow-sm duration-300 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-primary-light"
							aria-label="Scroll projects left"
						>
							‹
						</button>

						<button
							type="button"
							onClick={() => scroll('right')}
							className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/70 text-2xl text-primary-dark shadow-sm duration-300 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-primary-light"
							aria-label="Scroll projects right"
						>
							›
						</button>
					</div>
				</div>

				<div
					ref={scrollRef}
					className="flex gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					{projectsData.map((project) => (
						<div key={project.id} className="min-w-[330px] sm:min-w-[390px] lg:min-w-[420px]">
							<ProjectSingle {...project} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default HomeProjectsCarousel;