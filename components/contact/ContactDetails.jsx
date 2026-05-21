import { FiMail, FiGithub, FiLinkedin} from 'react-icons/fi';

const contacts = [
	{
		id: 1,
		title: 'Email Me',
		description: "For roles, collaborations, or project conversations, this is the fastest way to reach me.",
		label: 'sreekaran.2021@gmail.com',
		link: 'mailto:sreekaran.2021@gmail.com',
		icon: <FiMail />,
	},
	{
		id: 2,
		title: 'Connect on LinkedIn',
		description: 'Let’s connect and talk about data, applied AI, analytics, and opportunities.',
		label: 'LinkedIn Profile',
		link: 'https://www.linkedin.com/in/sreekaranreddy1704',
		icon: <FiLinkedin />,
	},
	{
		id: 3,
		title: 'Explore My GitHub',
		description: 'See my applied AI, machine learning, analytics, and cloud project repositories.',
		label: 'github.com/Sreekaran1704',
		link: 'https://github.com/Sreekaran1704',
		icon: <FiGithub />,
	},
];

function ContactDetails() {
	return (
		<section className="py-10 sm:py-16">
			<div className="container mx-auto">
				<div className="glass-card rounded-[2rem] px-6 py-16 text-center sm:px-10 sm:py-20">
					<h1 className="font-general-semibold text-5xl tracking-tight text-primary-dark dark:text-primary-light sm:text-6xl lg:text-7xl">
						Connect with me :)
					</h1>

					<p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl">
						I&apos;m here for data roles, applied AI conversations, collaborations,
						and job opportunities. Let&apos;s build something useful from the noise. ✨
					</p>
				</div>

				<div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
					{contacts.map((contact) => (
						<div
							key={contact.id}
							className="glass-card flex min-h-[280px] flex-col items-center justify-between rounded-[2rem] p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
						>
							<div>
								<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/70 text-2xl text-indigo-500 shadow-sm dark:bg-white/10 dark:text-indigo-300">
									{contact.icon}
								</div>

								<h2 className="font-general-semibold text-2xl text-primary-dark dark:text-primary-light">
									{contact.title}
								</h2>

								<p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
									{contact.description}
								</p>
							</div>

							<a
								href={contact.link}
								target={contact.link.startsWith('http') ? '_blank' : undefined}
								rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
								className="mt-8 inline-flex rounded-full border border-gray-200 bg-white/80 px-6 py-3 text-base font-medium text-primary-dark shadow-sm duration-300 hover:border-indigo-400 hover:text-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-primary-light dark:hover:text-indigo-300"
							>
								{contact.label}
							</a>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default ContactDetails;