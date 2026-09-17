import Reveal from './Reveal';

// The banner every section of the paper opens with: a heavy rule, the section
// slug and page number, the section title, and a one-line standfirst.
function SectionHead({ section, page, title, dek, as: Tag = 'h2' }) {
	return (
		<Reveal as="header" className="np-section-head">
			<div className="np-section-slug">
				<span>{section}</span>
				<span>{page}</span>
			</div>
			<Tag className="np-section-title">{title}</Tag>
			{dek && <p className="np-section-dek">{dek}</p>}
		</Reveal>
	);
}

export default SectionHead;
