import { createPortal } from 'react-dom';

// The little guy who brings the colour back: he walks in, pulls a torch from
// his pocket, clicks it on, and EditionToggle opens the colour edition from its beam.
// Timings live in torch.css; TORCH_REVEAL_AT and TORCH_END_AT must match them.
export const TORCH_REVEAL_AT = 1950;
export const TORCH_END_AT = 4400;

const OUTLINE = '#2a2533';

function Torch() {
	return (
		<>
			<rect x="97" y="90.5" width="20" height="11" rx="2" fill="#5b6472" stroke={OUTLINE} strokeWidth="2" />
			<rect x="104" y="88.5" width="5" height="3" rx="1" fill="#e5484d" stroke={OUTLINE} strokeWidth="1.2" />
			<path d="M117 90 L125 86.5 L125 105.5 L117 102 Z" fill="#f5c542" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
		</>
	);
}

function TorchGuy({ tipRef }) {
	return createPortal(
		<div className="np-torch-stage" aria-hidden="true">
			<div className="np-torch-guy">
				<svg viewBox="0 0 120 170" overflow="visible" focusable="false">
					<defs>
						<linearGradient id="np-beam-fill" gradientUnits="userSpaceOnUse" x1="125" y1="96" x2="1000" y2="96">
							<stop offset="0" stopColor="#ffe27a" stopOpacity="0.85" />
							<stop offset="0.45" stopColor="#ffe27a" stopOpacity="0.35" />
							<stop offset="1" stopColor="#ffe27a" stopOpacity="0" />
						</linearGradient>
					</defs>

					<ellipse className="np-guy-shadow" cx="60" cy="166" rx="30" ry="4" />

					<g className="np-guy-hop">
						<g className="np-guy-bob">
							<g className="np-guy-leg np-guy-leg-back">
								<rect x="42" y="124" width="14" height="30" rx="6" fill="#39456b" stroke={OUTLINE} strokeWidth="2.5" />
								<rect x="40" y="151" width="21" height="11" rx="5" fill="#f4f1ea" stroke={OUTLINE} strokeWidth="2.5" />
							</g>
							<g className="np-guy-leg np-guy-leg-front">
								<rect x="62" y="124" width="14" height="30" rx="6" fill="#465380" stroke={OUTLINE} strokeWidth="2.5" />
								<rect x="60" y="151" width="21" height="11" rx="5" fill="#ffffff" stroke={OUTLINE} strokeWidth="2.5" />
							</g>

							<g className="np-guy-upper">
								{/* Hoodie */}
								<path d="M38 96 C38 86 48 82 60 82 C72 82 82 86 82 96 L84 130 C84 133 82 134 80 134 L40 134 C38 134 36 133 36 130 Z" fill="#e8663d" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
								<path d="M46 84 C50 94 70 94 74 84 C70 80 50 80 46 84 Z" fill="#d2542d" stroke={OUTLINE} strokeWidth="2" />
								<path d="M55 92 L54 104 M65 92 L66 104" stroke="#fff4e6" strokeWidth="2" strokeLinecap="round" />

								{/* Head */}
								<path d="M24 52 C24 28 40 16 60 16 C80 16 96 28 96 52 C96 72 80 86 60 86 C40 86 24 72 24 52 Z" fill="#ffe3cf" stroke={OUTLINE} strokeWidth="2.5" />
								<ellipse cx="40" cy="67" rx="7" ry="4" fill="#ff9aa8" opacity="0.6" />
								<ellipse cx="88" cy="67" rx="6" ry="4" fill="#ff9aa8" opacity="0.6" />

								<g className="np-guy-eyes">
									<ellipse cx="50" cy="55" rx="8" ry="11" fill={OUTLINE} />
									<ellipse cx="50" cy="59" rx="6" ry="6.5" fill="#3f8cff" />
									<circle cx="47" cy="50" r="3.2" fill="#fff" />
									<circle cx="53" cy="61" r="1.6" fill="#fff" />
									<ellipse cx="78" cy="55" rx="8" ry="11" fill={OUTLINE} />
									<ellipse cx="78" cy="59" rx="6" ry="6.5" fill="#3f8cff" />
									<circle cx="75" cy="50" r="3.2" fill="#fff" />
									<circle cx="81" cy="61" r="1.6" fill="#fff" />
								</g>
								<g className="np-guy-eyes-happy" fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round">
									<path d="M42 58 Q50 46 58 58" />
									<path d="M70 58 Q78 46 86 58" />
								</g>

								<path className="np-guy-mouth" d="M60 71 Q64 74 68 71" fill="none" stroke={OUTLINE} strokeWidth="2.2" strokeLinecap="round" />
								<path className="np-guy-mouth-open" d="M57 69 H71 Q70 79 64 79 Q58 79 57 69 Z" fill="#c8384a" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />

								{/* Spiky hair */}
								<path d="M21 56 C17 48 18 38 22 31 L15 27 L27 23 L23 11 L37 16 L41 3 L52 12 L63 0 L70 12 L84 5 L84 18 L99 16 L93 28 L104 34 L97 40 C101 46 101 52 99 57 L92 44 L88 50 L82 35 L74 45 L66 30 L55 44 L47 33 L38 47 L33 39 L27 48 Z" fill="#2f3050" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
								<path d="M44 14 L52 22 L60 11" fill="none" stroke="#5f62a0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

								<text className="np-guy-notice" x="96" y="20" fontSize="24" fontWeight="800" fill="#e5484d" stroke={OUTLINE} strokeWidth="0.8">!</text>

								{/* The arm swings from the shoulder, carrying torch and beam together. */}
								<g className="np-guy-arm">
									<polygon className="np-guy-beam" points="125,90 1250,-400 1250,592 125,102" fill="url(#np-beam-fill)" />
									<g className="np-guy-held-torch">
										<Torch />
										<circle ref={tipRef} cx="126" cy="96" r="0.5" fill="none" />
									</g>
									<line x1="72" y1="96" x2="97" y2="96" stroke={OUTLINE} strokeWidth="14" strokeLinecap="round" />
									<line x1="72" y1="96" x2="97" y2="96" stroke="#e8663d" strokeWidth="9.5" strokeLinecap="round" />
									<circle cx="101" cy="96" r="6.5" fill="#ffe3cf" stroke={OUTLINE} strokeWidth="2.2" />
								</g>

								{/* The pocket's front, so his hand and the torch go in behind it. */}
								<path d="M46 113 H74 L77 129 H43 Z" fill="#d2542d" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
							</g>
						</g>
					</g>

					<g className="np-guy-sparkles">
						<path d="M12 40 L15 49 L24 52 L15 55 L12 64 L9 55 L0 52 L9 49 Z" fill="#f5c542" stroke={OUTLINE} strokeWidth="1.5" />
						<path d="M112 110 L114 116 L120 118 L114 120 L112 126 L110 120 L104 118 L110 116 Z" fill="#ff7aa2" stroke={OUTLINE} strokeWidth="1.5" />
						<path d="M26 104 L28 110 L34 112 L28 114 L26 120 L24 114 L18 112 L24 110 Z" fill="#4fc3f7" stroke={OUTLINE} strokeWidth="1.5" />
					</g>
				</svg>
			</div>
		</div>,
		document.body,
	);
}

export default TorchGuy;
