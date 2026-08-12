// Shared crayon/coloured-pencil rendering used by the nav rail and the hero
// garden. The hand-drawn look is done with SVG filters rather than image assets:
// feTurbulence + feDisplacementMap roughens every edge, so a plain circle comes
// out waxy and uneven the way a crayon line does.
//
// Filter ids are global to the document, so each mount takes a unique prefix.

export function CrayonDefs({ id }) {
	return (
		<defs>
			{/* Ragged, waxy edge for outlines. */}
			<filter id={`${id}-edge`} x="-25%" y="-25%" width="150%" height="150%">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.62"
					numOctaves="3"
					seed="4"
					result="n"
				/>
				<feDisplacementMap
					in="SourceGraphic"
					in2="n"
					scale="1.9"
					xChannelSelector="R"
					yChannelSelector="G"
				/>
			</filter>

			{/* Coarser displacement for fills, so the colour looks laid down in
			    uneven passes instead of flooded flat. */}
			<filter id={`${id}-fill`} x="-30%" y="-30%" width="160%" height="160%">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.5 0.72"
					numOctaves="4"
					seed="11"
					result="n"
				/>
				<feDisplacementMap
					in="SourceGraphic"
					in2="n"
					scale="2.6"
					xChannelSelector="R"
					yChannelSelector="G"
				/>
			</filter>
		</defs>
	);
}

const OUTLINE = '#4b4f38';

// Each icon is a closed shape for the pencil fill plus the strokes drawn over
// it. The fill is nudged off-register on purpose — colouring slightly outside
// the lines is most of what makes it read as hand-done.
export const CRAYON_ICONS = {
	about: {
		fill: 'M12,4.9 C14.1,4.9 15.7,6.5 15.7,8.5 C15.7,10.6 14.1,12.2 12,12.2 C9.9,12.2 8.3,10.6 8.3,8.5 C8.3,6.5 9.9,4.9 12,4.9 Z M5.6,19.7 C6.0,15.8 8.7,13.8 12,13.8 C15.3,13.8 18.0,15.8 18.4,19.7 Z',
		strokes: [
			'M12,4.9 C14.1,4.9 15.7,6.5 15.7,8.5 C15.7,10.6 14.1,12.2 12,12.2 C9.9,12.2 8.3,10.6 8.3,8.5 C8.3,6.5 9.9,4.9 12,4.9 Z',
			'M5.6,19.7 C6.0,15.8 8.7,13.8 12,13.8 C15.3,13.8 18.0,15.8 18.4,19.7',
		],
	},
	projects: {
		fill: 'M3.4,7.3 L9.5,7.2 L11.3,9.5 L20.7,9.4 L20.5,18.9 L3.6,19.0 Z',
		strokes: [
			'M3.4,7.3 L9.5,7.2 L11.3,9.5 L20.7,9.4 L20.5,18.9 L3.6,19.0 Z',
			'M3.5,11.4 L20.6,11.2',
		],
	},
	experience: {
		fill: 'M3.4,9.3 L20.6,9.1 L20.4,18.9 L3.6,19.0 Z',
		strokes: [
			'M3.4,9.3 L20.6,9.1 L20.4,18.9 L3.6,19.0 Z',
			'M9.1,9.2 L9.2,6.5 L14.9,6.4 L15.0,9.1',
			'M3.5,13.2 L20.5,13.0',
		],
	},
	articles: {
		fill: 'M6.3,3.5 L17.6,3.3 L17.9,20.5 L6.1,20.7 Z',
		strokes: [
			'M6.3,3.5 L17.6,3.3 L17.9,20.5 L6.1,20.7 Z',
			'M8.7,8.1 L15.2,7.9',
			'M8.7,11.7 L15.2,11.5',
			'M8.7,15.3 L13.1,15.2',
		],
	},
	contact: {
		fill: 'M3.3,6.5 L20.7,6.3 L20.8,17.7 L3.4,17.9 Z',
		strokes: [
			'M3.3,6.5 L20.7,6.3 L20.8,17.7 L3.4,17.9 Z',
			'M3.5,6.7 L12.1,13.1 L20.6,6.4',
		],
	},
};

export function CrayonIcon({ name, color, filterId }) {
	const icon = CRAYON_ICONS[name];
	if (!icon) return null;

	return (
		<svg viewBox="0 0 24 24" className="crayon-icon" aria-hidden="true">
			<g filter={`url(#${filterId}-fill)`} transform="translate(1.1 1.3)">
				<path d={icon.fill} fill={color} opacity="0.82" />
			</g>

			<g
				filter={`url(#${filterId}-edge)`}
				fill="none"
				stroke={OUTLINE}
				strokeWidth="1.7"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				{icon.strokes.map((d, i) => (
					<path key={i} d={d} />
				))}
			</g>
		</svg>
	);
}
