import { FiMail, FiGithub, FiLinkedin } from 'react-icons/fi';
import SectionHead from '../shared/SectionHead';

const contacts = [
	{
		id: 1,
		title: 'LinkedIn',
		detail: 'linkedin.com/in/sree1704',
		link: 'https://www.linkedin.com/in/sree1704',
		icon: <FiLinkedin />,
	},
	{
		id: 2,
		title: 'GitHub',
		detail: 'github.com/Sreekaran1704',
		link: 'https://github.com/Sreekaran1704',
		icon: <FiGithub />,
	},
	{
		id: 3,
		title: 'Email',
		detail: 'sreekaran.2021@gmail.com',
		link: 'mailto:sreekaran.2021@gmail.com',
		icon: <FiMail />,
	},
];

function ContactDetails() {
	return (
		<div className="np-wrap np-section">
			<SectionHead
				section="Section F · Letters"
				page="Page F1"
				title="Connect with me"
				dek="For data roles, applied AI conversations, collaborations, referrals, or project discussions, these are the easiest ways to reach me."
			/>

			<div className="np-letters">
				{contacts.map((contact) => {
					const external = contact.link.startsWith('http');
					return (
						<a
							key={contact.id}
							href={contact.link}
							target={external ? '_blank' : undefined}
							rel={external ? 'noopener noreferrer' : undefined}
							className="np-letter"
							aria-label={external ? `${contact.title}: ${contact.detail} (opens in a new tab)` : undefined}
						>
							<span className="np-letter-icon" aria-hidden="true">
								{contact.icon}
							</span>
							<span className="np-kicker">{contact.title}</span>
							<span className="np-letter-detail">{contact.detail}</span>
						</a>
					);
				})}
			</div>
		</div>
	);
}

export default ContactDetails;
