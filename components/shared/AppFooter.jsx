import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import AppFooterCopyright from './AppFooterCopyright';

const socialLinks = [
	{
		id: 1,
		name: 'GitHub',
		icon: <FiGithub />,
		url: 'https://github.com/Sreekaran1704',
	},
	{
		id: 2,
		name: 'LinkedIn',
		icon: <FiLinkedin />,
		url: 'https://www.linkedin.com/in/sreekaranreddy1704',
	},
	{
		id: 3,
		name: 'Email',
		icon: <FiMail />,
		url: 'mailto:sreekaran.2021@gmail.com',
	},
];

function AppFooter() {
	return (
		<div className="container mx-auto">
			<div className="pt-20 sm:pt-30 pb-8 mt-20 border-t-2 border-primary-light dark:border-secondary-dark">
				<div className="font-general-regular flex flex-col justify-center items-center mb-12 sm:mb-20">
					<p className="text-3xl sm:text-4xl text-primary-dark dark:text-primary-light mb-5">
						Connect with me
					</p>

					<ul className="flex gap-4 sm:gap-8">
						{socialLinks.map((link) => (
							<a
								href={link.url}
								target={link.url.startsWith('http') ? '_blank' : undefined}
								rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
								key={link.id}
								aria-label={link.name}
								className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer rounded-lg bg-gray-50 dark:bg-ternary-dark hover:bg-gray-100 shadow-sm p-4 duration-300"
							>
								<i className="text-xl sm:text-2xl md:text-3xl">
									{link.icon}
								</i>
							</a>
						))}
					</ul>
				</div>

				<AppFooterCopyright />
			</div>
		</div>
	);
}

export default AppFooter;