import { FiMail, FiGithub, FiLinkedin } from 'react-icons/fi';

const contacts = [
	{
		id: 1,
		title: 'LinkedIn',
		link: 'https://www.linkedin.com/in/sree1704',
		icon: <FiLinkedin />,
	},
	{
		id: 2,
		title: 'GitHub',
		link: 'https://github.com/Sreekaran1704',
		icon: <FiGithub />,
	},
	{
		id: 3,
		title: 'Email',
		link: 'mailto:sreekaran.2021@gmail.com',
		icon: <FiMail />,
	},
];

function ContactDetails() {
	return (
		<section className="hero-style-contact-section px-6 py-20 sm:px-10 lg:px-16">
			<div className="mx-auto max-w-7xl">
				<div className="hero-style-contact-card">
					<h1 className="hero-style-contact-heading">Connect with me</h1>

					<p className="hero-style-contact-intro">
						For data roles, applied AI conversations, collaborations, referrals,
						or project discussions, these are the easiest ways to reach me.
					</p>

					{/* <a
						href="mailto:sreekaran.2021@gmail.com"
						className="hero-style-contact-email"
					>
						sreekaran.2021@gmail.com
					</a> */}

					<div className="hero-style-contact-icons">
						{contacts.map((contact) => (
							<a
								key={contact.id}
								href={contact.link}
								target={
									contact.link.startsWith('http')
										? '_blank'
										: undefined
								}
								rel={
									contact.link.startsWith('http')
										? 'noopener noreferrer'
										: undefined
								}
								className="doodle-icon-btn hero-contact-icon"
								aria-label={contact.title}
								title={contact.title}
							>
								{contact.icon}
							</a>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default ContactDetails;