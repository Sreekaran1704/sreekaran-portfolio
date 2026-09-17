// Dialogue for the story version of a write-up, printed like the comic strip
// in a newspaper's funnies page: each exchange is a panel, every speaker has a
// small drawn portrait, and lines sit in speech balloons whose tails point back
// at whoever is talking.

const TONES = {
	ARIMA: 'blue',
	Xander: 'red',
	Gigi: 'purple',
	Surya: 'green',
};

// Simple drawn portraits, one per character. Shapes are coloured in CSS
// (.face-*), so both print editions restyle them without touching this file.
const FACES = {
	ARIMA: (
		<>
			{/* The veteran: grey hair, round glasses, a moustache. */}
			<path className="face-hair-grey" d="M15 34 Q16 15 32 15 Q48 15 49 34 Q45 24 32 24 Q19 24 15 34Z" />
			<circle className="face-line" cx="26" cy="35" r="4.6" />
			<circle className="face-line" cx="38" cy="35" r="4.6" />
			<path className="face-line" d="M30.6 35 H33.4" />
			<circle className="face-ink" cx="26" cy="35" r="1.5" />
			<circle className="face-ink" cx="38" cy="35" r="1.5" />
			<path className="face-stroke-grey" d="M26 44 Q32 41 38 44" />
		</>
	),
	Xander: (
		<>
			{/* The eager rookie: spiky hair and a big grin. */}
			<path className="face-hair" d="M15 33 L17 19 L22 25 L26 13 L31 22 L36 12 L40 22 L45 15 L49 33 Q44 22 32 22 Q20 22 15 33Z" />
			<path className="face-line" d="M22 30 L29 31.5 M35 31.5 L42 30" />
			<circle className="face-ink" cx="26" cy="36" r="1.9" />
			<circle className="face-ink" cx="38" cy="36" r="1.9" />
			<path className="face-mouth" d="M24 42 Q32 51 40 42Z" />
		</>
	),
	Gigi: (
		<>
			{/* The quiet rookie: a bob haircut and a small smile. */}
			<path className="face-hair" d="M13 42 Q11 15 32 14 Q53 15 51 42 L51 48 Q46 46 46 36 Q42 23 32 23 Q22 23 18 36 Q18 46 13 48Z" />
			<circle className="face-ink" cx="26" cy="36" r="1.9" />
			<circle className="face-ink" cx="38" cy="36" r="1.9" />
			<path className="face-line" d="M27 44 Q32 47.5 37 44" />
		</>
	),
	Surya: (
		<>
			{/* Runs the desk: short hair and a beard. */}
			<path className="face-hair" d="M16 33 Q17 16 32 16 Q47 16 48 33 Q43 23 32 23 Q21 23 16 33Z" />
			<path className="face-hair" d="M17 38 Q19 55 32 55 Q45 55 47 38 Q45 48 32 49 Q19 48 17 38Z" />
			<path className="face-line" d="M22 31 H29 M35 31 H42" />
			<circle className="face-ink" cx="26" cy="35.5" r="1.9" />
			<circle className="face-ink" cx="38" cy="35.5" r="1.9" />
			<path className="face-line" d="M28 44 H36" />
		</>
	),
};

const DEFAULT_FACE = (
	<>
		{/* A first-timer: raised eyebrows and a surprised "o". */}
		<path className="face-hair" d="M16 32 Q17 16 33 16 Q47 17 48 31 Q40 21 26 25 Q20 27 16 32Z" />
		<path className="face-line" d="M22 28 Q25.5 25.5 29 28 M35 28 Q38.5 25.5 42 28" />
		<circle className="face-ink" cx="26" cy="35" r="1.9" />
		<circle className="face-ink" cx="38" cy="35" r="1.9" />
		<circle className="face-line" cx="32" cy="44.5" r="2.6" />
	</>
);

export function Face({ who, className = '' }) {
	return (
		<svg className={`rd-face ${className}`} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
			<rect className="face-bg" width="64" height="64" />
			<path className="face-body" d="M8 66 Q10 52 32 51 Q54 52 56 66Z" />
			<circle className="face-skin" cx="32" cy="35" r="15.5" />
			{FACES[who] || DEFAULT_FACE}
		</svg>
	);
}

// Wraps one exchange of dialogue as a single comic panel.
export function Strip({ children }) {
	return <div className="rd-strip">{children}</div>;
}

export function Say({ who, children }) {
	return (
		<figure className="rd-say" data-tone={TONES[who] || 'gray'}>
			<figcaption className="rd-say-speaker">
				<Face who={who} />
				<span className="rd-say-who">{who}</span>
			</figcaption>
			<blockquote className="rd-balloon">
				<p>{children}</p>
			</blockquote>
		</figure>
	);
}

export function Cast({ title = 'Who’s who', members }) {
	return (
		<section className="rd-cast" aria-label={title}>
			<h2 className="rd-cast-title">{title}</h2>
			<ul>
				{members.map((member) => (
					<li key={member.name} data-tone={TONES[member.name] || 'gray'}>
						<Face who={member.name} className="rd-cast-face" />
						<span>
							<strong>{member.name}</strong> <em>{member.role}</em>
							<span className="rd-cast-bio">{member.bio}</span>
						</span>
					</li>
				))}
			</ul>
		</section>
	);
}
