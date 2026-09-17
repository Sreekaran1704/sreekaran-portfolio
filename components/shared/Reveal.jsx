import { motion } from 'framer-motion';

// Fades a block up into place the first time it scrolls into view. Reduced
// motion is honoured in CSS ([data-reveal]) rather than with a hook, so the
// server render and the first client render always match.
function Reveal({ as = 'div', delay = 0, children, ...rest }) {
	const Tag = motion[as];

	return (
		<Tag
			data-reveal=""
			initial={{ opacity: 0, y: 18 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '0px 0px -60px 0px' }}
			transition={{ duration: 0.55, ease: 'easeOut', delay }}
			{...rest}
		>
			{children}
		</Tag>
	);
}

export default Reveal;
