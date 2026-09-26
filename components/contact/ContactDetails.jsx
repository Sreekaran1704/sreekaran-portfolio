import { useEffect, useRef, useState } from 'react';
import { FiMail, FiGithub, FiLinkedin } from 'react-icons/fi';
import SectionHead from '../shared/SectionHead';
import Reveal from '../shared/Reveal';

const EMAIL = 'sreekaran.2021@gmail.com';

const contacts = [
	{
		id: 1,
		title: 'LinkedIn',
		headline: 'Talk about a role',
		summary: 'If you feel I’d be a good fit for your role or team, I’d love to hear about it.',
		detail: 'linkedin.com/in/sree1704',
		link: 'https://www.linkedin.com/in/sree1704',
		action: 'Connect on LinkedIn',
		icon: <FiLinkedin />,
	},
	{
		id: 2,
		title: 'GitHub',
		headline: 'Read the code',
		summary: 'Notebooks, pipelines, and the source behind every case study in this paper.',
		detail: 'github.com/Sreekaran1704',
		link: 'https://github.com/Sreekaran1704',
		action: 'Browse repositories',
		icon: <FiGithub />,
	},
	{
		id: 3,
		title: 'Email',
		headline: 'Write a letter',
		summary: 'For collaborations, project discussions, or anything that needs more than a message.',
		detail: EMAIL,
		link: `mailto:${EMAIL}`,
		action: 'Send an email',
		icon: <FiMail />,
		copyable: true,
	},
];

// Copies the address and flips the label to a confirmation for a moment.
function CopyButton({ text }) {
	const [copied, setCopied] = useState(false);
	const timer = useRef();

	useEffect(() => () => clearTimeout(timer.current), []);

	const copy = async () => {
		let ok = false;
		try {
			await navigator.clipboard.writeText(text);
			ok = true;
		} catch {
			// Some browsers refuse the async clipboard; fall back to a hidden field.
			const field = document.createElement('textarea');
			field.value = text;
			field.setAttribute('readonly', '');
			field.style.position = 'fixed';
			field.style.opacity = '0';
			document.body.appendChild(field);
			field.select();
			ok = document.execCommand('copy');
			field.remove();
		}
		if (!ok) return; // The mailto link beside it still works.
		setCopied(true);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button type="button" className="np-letter-copy" onClick={copy}>
			<span aria-live="polite">{copied ? 'Copied ✓' : 'Copy address'}</span>
		</button>
	);
}

// Each way to reach me is set like a short story: a kicker, a headline, a
// line of copy, the address, and the action as a jump link.
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
				{contacts.map((contact, index) => {
					const external = contact.link.startsWith('http');
					return (
						<Reveal as="article" key={contact.id} delay={index * 0.07} className="np-letter">
							<p className="np-kicker np-letter-kicker">
								<span className="np-letter-icon" aria-hidden="true">
									{contact.icon}
								</span>
								{contact.title}
							</p>

							<h3 className="np-story-headline np-letter-headline">{contact.headline}</h3>

							<p className="np-story-summary">{contact.summary}</p>

							<p className="np-filed np-letter-detail">
								<span>Find me at</span> {contact.detail}
							</p>

							<div className="np-story-links">
								<a
									href={contact.link}
									target={external ? '_blank' : undefined}
									rel={external ? 'noopener noreferrer' : undefined}
									aria-label={`${contact.action}: ${contact.detail}${external ? ' (opens in a new tab)' : ''}`}
								>
									{contact.action} →
								</a>
								{contact.copyable && <CopyButton text={contact.detail} />}
							</div>
						</Reveal>
					);
				})}
			</div>
		</div>
	);
}

export default ContactDetails;
