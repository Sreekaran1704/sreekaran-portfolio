// The diary's physical pieces, ported from src/components/scrapbook: the cassette, a memory as a diary page (photo in
// photo corners, a tape in a page pocket, blue-black handwriting, a reply in sepia), the photograph that turns over,
// letters from your past self in airmail envelopes, the volumes on the walnut bookshelf, and the tape recorder.

import { useEffect, useId, useRef, useState } from 'react';
import { type, useTheme, withAlpha, mixHex } from './theme';
import { diaryDate, displayDate, formatVoiceMs, mulberry32, planWords, replyLabel, seededRng, shortDay, useFrame, yearsAgoLabel, yearsBetween, parseDate } from './lib';
import { ActionRow, Icon, PillButton, Texture } from './ui';

/* ---------- Photos ---------- */

const SKIES = [
	['#FF9A8B', '#FFD3A5', '#5B3A6E'],
	['#5EC8E5', '#C9F0FF', '#2E6B4F'],
	['#2B1B4F', '#F08A5D', '#1E2A3A'],
	['#A1C4FD', '#FDE2E4', '#4F7C5A'],
	['#FFB75E', '#FFF1C1', '#7A4B2A'],
];

/** The app's painted sample photo (src/dev/seedPhotos.ts): sky, sun and two rows of hills. */
function SeedPhoto({ seed }) {
	const id = `sky${useId().replace(/:/g, '')}`;
	const S = 480;
	const rnd = mulberry32(seed);
	const [top, bottom, land] = SKIES[seed % SKIES.length];
	const sun = { cx: S * (0.25 + rnd() * 0.5), cy: S * (0.3 + rnd() * 0.2), r: S * (0.08 + rnd() * 0.06) };
	const hills = [0, 1].map((layer) => {
		const base = S * (0.62 + layer * 0.12);
		let d = `M0 ${S} L0 ${base}`;
		const bumps = 3 + Math.floor(rnd() * 3);
		for (let i = 1; i <= bumps; i++) {
			const x = (S / bumps) * i;
			d += ` Q${x - S / bumps / 2} ${base - S * (0.06 + rnd() * 0.12)} ${x} ${base}`;
		}
		return { d: `${d} L${S} ${S} Z`, opacity: layer === 0 ? 0.6 : 1 };
	});
	return (
		<svg viewBox={`0 0 ${S} ${S}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
			<defs>
				<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={top} />
					<stop offset="1" stopColor={bottom} />
				</linearGradient>
			</defs>
			<rect width={S} height={S} fill={`url(#${id})`} />
			<circle cx={sun.cx} cy={sun.cy} r={sun.r} fill="#FFF6D8" opacity={0.9} />
			{hills.map((h) => (
				<path key={h.d} d={h.d} fill={land} opacity={h.opacity} />
			))}
		</svg>
	);
}

/** A photograph printed like an old print (vintageFilm): a sample painting, or the visitor's own picture. */
export function Photo({ photo }) {
	return (
		<span className="lb-photo">
			{photo.url ? <img src={photo.url} alt="" draggable="false" /> : <SeedPhoto seed={photo.seed} />}
			<span className="lb-photo-film" aria-hidden="true" />
		</span>
	);
}

/* ---------- The cassette (Cassette.tsx) ---------- */

const CASS = { label: '#F4F1EA', band: '#E9DFC4', stripe: '#C8372B', tape: '#4A2E1F', tapeEdge: '#2E1C12', hub: '#F2F2F0', window: '#2A211C', ink: '#23304A' };

/** A 90s compact cassette (100 × 63 units): screws, a paper label with "A" and the title, the window, hubs, band. */
export function Cassette({ width, title, detail, played = 0.15, spinning = false }) {
	const u = width / 100;
	const h = width * 0.63;
	const hubR = 7.5 * u;
	const hubs = [29 * u, 71 * u];
	const packMin = 9 * u;
	const packMax = 17 * u;
	const packs = [packMin + (packMax - packMin) * (1 - played), packMin + (packMax - packMin) * played];
	const WL = 14 * u;
	const WT = 21.5 * u;
	const screws = [
		[1.5 * u, 1.5 * u],
		[width - 5.5 * u, 1.5 * u],
		[1.5 * u, h - 5.5 * u],
		[width - 5.5 * u, h - 5.5 * u],
		[width / 2 - 1.8 * u, h - 13.5 * u],
	];
	return (
		<span className="lb-cass" style={{ width, height: h, borderRadius: 3 * u, borderWidth: Math.max(1, 0.6 * u), boxShadow: `0 ${2 * u}px ${4 * u}px rgba(0,0,0,0.35)` }}>
			<span className="lb-abs" style={{ left: WL, top: WT, width: 72 * u, height: 19.5 * u, borderRadius: 2.2 * u, overflow: 'hidden', background: CASS.window, border: `${0.6 * u}px solid #55555A` }}>
				{hubs.map((x, i) => (
					<span key={`p${i}`} className="lb-abs" style={{ left: x - WL - packs[i], top: 31 * u - WT - packs[i], width: packs[i] * 2, height: packs[i] * 2, borderRadius: '50%', background: `radial-gradient(circle, ${CASS.tape} 40%, ${CASS.tapeEdge} 100%)` }} />
				))}
				<span className="lb-abs" style={{ left: 0, right: 0, bottom: 1.5 * u, height: 0.9 * u, background: CASS.tape }} />
				{hubs.map((x, i) => (
					<span key={`h${i}`} className={`lb-abs lb-hub${spinning ? ' is-spinning' : ''}`} style={{ left: x - WL - hubR, top: 31 * u - WT - hubR, width: hubR * 2, height: hubR * 2, boxShadow: `inset 0 0 0 ${0.6 * u}px #BDBDBB` }}>
						<span style={{ width: hubR * 0.95, height: hubR * 0.95, borderRadius: '50%', background: '#1A1A1A' }} />
						{[0, 60, 120].map((a) => (
							<span key={a} className="lb-abs" style={{ width: 1.3 * u, height: hubR * 1.3, background: CASS.hub, transform: `rotate(${a}deg)` }} />
						))}
					</span>
				))}
				<span className="lb-abs" style={{ inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 35%, rgba(0,0,0,0.25) 100%)' }} />
			</span>
			<span className="lb-abs" style={{ left: 6 * u, right: 6 * u, top: 17.6 * u, height: 1.6 * u, background: CASS.stripe }} />
			<span className="lb-abs lb-row" style={{ left: 6 * u, right: 6 * u, top: 4 * u, height: 13.6 * u, borderRadius: 1.2 * u, background: CASS.label, padding: `0 ${2 * u}px`, gap: 2 * u }}>
				<span style={{ width: 7 * u, height: 7 * u, background: '#4A2A3A', color: CASS.label, fontSize: 5 * u, lineHeight: `${7 * u}px`, fontWeight: 700, textAlign: 'center', fontFamily: 'Georgia, serif', flexShrink: 0 }}>A</span>
				<span style={{ flex: 1, minWidth: 0, height: 10 * u, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
					<span style={{ ...type.hand, color: CASS.ink, fontSize: 8 * u, lineHeight: `${9.5 * u}px`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
					<span style={{ height: Math.max(0.5, 0.4 * u), background: '#9A9A9A' }} />
				</span>
			</span>
			<span className="lb-abs lb-row" style={{ left: 6 * u, right: 6 * u, top: 44 * u, height: 7 * u, borderRadius: 0.8 * u, background: CASS.band, justifyContent: 'space-between', padding: `0 ${2 * u}px`, overflow: 'hidden' }}>
				<span style={{ ...type.stamp, color: '#2A2118', fontSize: 4 * u, lineHeight: `${5 * u}px`, letterSpacing: 0.4 * u, position: 'relative' }}>LOOKBACK</span>
				<span className="lb-abs" style={{ left: 40 * u, top: 0, bottom: 0, width: 12 * u, background: CASS.stripe, opacity: 0.85 }} />
				<span style={{ ...type.stamp, color: '#2A2118', fontSize: 4 * u, lineHeight: `${5 * u}px`, letterSpacing: 0.2 * u, position: 'relative' }}>{detail ?? 'C·60'}</span>
			</span>
			<span className="lb-abs lb-row" style={{ left: 20 * u, right: 20 * u, bottom: 0, height: 9 * u, borderRadius: `${2 * u}px ${2 * u}px 0 0`, background: '#141416', border: `${0.4 * u}px solid #3A3A3D`, justifyContent: 'space-evenly' }}>
				{[3.5, 2.5, 2.5, 3.5].map((s, i) => (
					<span key={i} style={{ width: s * u, height: s * u, borderRadius: '50%', background: '#050505' }} />
				))}
			</span>
			{screws.map(([l, t]) => (
				<span key={`${l}-${t}`} className="lb-abs lb-screw" style={{ left: l, top: t, width: 3.6 * u, height: 3.6 * u }}>
					<span style={{ width: 2.4 * u, height: Math.max(0.5, 0.5 * u), background: '#555', transform: 'rotate(45deg)' }} />
				</span>
			))}
		</span>
	);
}

/* ---------- A memory as a page of the diary (DiaryPage.tsx) ---------- */

const BASE_WIDTH = 320;

/** A cassette tucked into a paper pocket glued to the page; tap it to listen, its reels turn while it plays. */
function TapePocket({ width, k, voice, player }) {
	const { colors } = useTheme();
	const h = width * 0.42;
	const tapeW = width * 0.86;
	const tapeH = h * 0.92;
	const reel = tapeH * 0.3;
	const playing = player?.playing ?? false;
	const tape = (
		<span style={{ height: h + tapeH * 0.15, display: 'flex', justifyContent: 'center', position: 'relative' }}>
			<span style={{ width: tapeW, height: tapeH, borderRadius: 5 * k, background: '#2A2118', padding: 6 * k, transform: 'rotate(-2.5deg)', boxShadow: '0 3px 6px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column' }}>
				<span className="lb-row" style={{ height: tapeH * 0.34, borderRadius: 3 * k, background: colors.paper, justifyContent: 'space-between', padding: `0 ${8 * k}px` }}>
					<span style={{ ...type.hand, color: colors.inkBlue, fontSize: 17 * k, lineHeight: `${20 * k}px`, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{voice.title || 'a voice note'}</span>
					<span style={{ ...type.stamp, color: colors.sepia, fontSize: 11 * k, lineHeight: `${14 * k}px` }}>{formatVoiceMs(voice.ms)}</span>
				</span>
				<span className="lb-row" style={{ flex: 1, justifyContent: 'space-between', padding: `0 ${tapeW * 0.12}px` }}>
					{[0, 1].map((i) => (
						<span
							key={i}
							className={`lb-reel${playing ? ' is-spinning' : ''}`}
							style={{ width: reel, height: reel, backgroundImage: `radial-gradient(circle, ${colors.gilt} 0%, ${colors.gilt} 18%, #1A140E 22%, #1A140E 34%, ${colors.gilt} 38%, ${colors.gilt} 46%, #3A2A1A 52%)` }}
						>
							{[0, 60, 120].map((a) => (
								<span key={a} className="lb-abs" style={{ left: reel / 2 - 1, top: reel * 0.12, width: 2, height: reel * 0.76, background: '#1A140E', transform: `rotate(${a}deg)` }} />
							))}
						</span>
					))}
				</span>
			</span>
			<span
				className="lb-abs"
				style={{ left: 0, right: 0, bottom: 0, height: h * 0.4, background: colors.kraft, borderRadius: '0 0 3px 3px', borderTop: '1px solid rgba(90,60,30,0.35)', boxShadow: 'inset 0 6px 8px -6px rgba(90,60,30,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 6 * k }}
			>
				<span style={{ ...type.handSmall, color: colors.ink, fontSize: 13 * Math.max(0.85, k), lineHeight: `${17 * Math.max(0.85, k)}px`, opacity: 0.75 }}>
					{player ? (playing ? 'playing…' : 'tap the tape to listen') : 'a tape, tucked into the page'}
				</span>
			</span>
		</span>
	);
	if (!player) return tape;
	return (
		<button type="button" className="lb-plain" onClick={player.toggle} aria-label={playing ? 'Pause the voice note' : 'Play the voice note'}>
			{tape}
		</button>
	);
}

/** A photo slipped into four dark paper photo corners, printed like an old photograph. */
function TuckedPhoto({ photo, width, k }) {
	const { colors } = useTheme();
	const c = 16 * k;
	return (
		<span className="lb-tucked" style={{ width, height: width * 0.75, padding: 4 * k, background: colors.paperWhite }}>
			<Photo photo={photo} />
			<span className="lb-corner" style={{ left: -2, top: -2, borderTop: `${c}px solid ${colors.ink}`, borderRight: `${c}px solid transparent` }} />
			<span className="lb-corner" style={{ right: -2, top: -2, borderTop: `${c}px solid ${colors.ink}`, borderLeft: `${c}px solid transparent` }} />
			<span className="lb-corner" style={{ left: -2, bottom: -2, borderBottom: `${c}px solid ${colors.ink}`, borderRight: `${c}px solid transparent` }} />
			<span className="lb-corner" style={{ right: -2, bottom: -2, borderBottom: `${c}px solid ${colors.ink}`, borderLeft: `${c}px solid transparent` }} />
		</span>
	);
}

/**
 * A memory as a page of the diary: aged cream paper bound on the left (a red margin), the date in sepia print, a
 * photo in photo corners, a tape in a pocket, the words in blue-black ink on ruled lines, a reply in sepia.
 */
export function DiaryPage({ entry, width, lines, lift = 1, player, editor, replyEditor }) {
	const theme = useTheme();
	const { colors } = theme;
	const k = width / BASE_WIDTH;
	const hand = Math.max(17, 23 * k);
	const lineH = Math.round(hand * (28 / 23));
	const inner = width - 48 * k;
	const text = editor ? editor.value : entry.text;
	const hasWords = text.trim().length > 0 || !!editor;
	const dateSize = 16 * Math.max(0.8, k);
	const reply = replyEditor ? { text: replyEditor.value, label: 'a year on' } : entry.reply ? { text: entry.reply, label: replyLabel(entry.localDate, entry.repliedOn || entry.localDate) } : null;
	const ruled = { backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent ${lineH - 2}px, ${colors.ruleLine} ${lineH - 2}px, ${colors.ruleLine} ${lineH - 0.6}px, transparent ${lineH - 0.6}px, transparent ${lineH}px)` };
	return (
		<div className="lb-dpage" style={{ width }}>
			<span className="lb-dpage-under" style={{ background: colors.paper, borderRadius: `2px ${7 * k}px ${7 * k}px 2px` }} aria-hidden="true" />
			<div
				className="lb-dpage-sheet"
				style={{
					backgroundColor: colors.paper,
					borderRadius: `2px ${7 * k}px ${7 * k}px 2px`,
					padding: `${16 * k}px ${18 * k}px ${18 * k}px ${30 * k}px`,
					gap: 10 * k,
					boxShadow: theme.shadow(lift),
					backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(150,110,50,0.16) 0%, rgba(150,110,50,0) 45%), radial-gradient(circle at 0% 100%, rgba(150,110,50,0.12) 0%, rgba(150,110,50,0) 40%)',
				}}
			>
				<span className="lb-margin" style={{ left: 18 * k, background: colors.marginLine }} aria-hidden="true" />
				<span style={{ ...type.caption, color: colors.sepia, fontSize: dateSize, lineHeight: `${dateSize * 1.3}px`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{diaryDate(entry.localDate)}</span>
				{entry.photo ? <TuckedPhoto photo={entry.photo} width={inner} k={k} /> : null}
				{entry.voice ? <TapePocket width={inner} k={k} voice={entry.voice} player={player} /> : null}
				{hasWords ? (
					editor ? (
						<textarea
							className="lb-write"
							value={editor.value}
							onChange={(e) => editor.onChange(e.target.value)}
							placeholder={editor.placeholder}
							aria-label={editor.label}
							autoFocus={editor.autoFocus}
							rows={Math.max(2, Math.ceil(editor.value.length / 26) + 1)}
							style={{ ...type.hand, color: colors.inkBlue, fontSize: hand, lineHeight: `${lineH}px`, ...ruled }}
						/>
					) : (
						<p className="lb-hand" style={{ ...type.hand, color: colors.inkBlue, fontSize: hand, lineHeight: `${lineH}px`, WebkitLineClamp: lines, ...ruled }}>
							{text}
						</p>
					)
				) : null}
				{reply ? (
					<div style={{ marginTop: 6 * k, paddingLeft: 12 * k, borderLeft: `1px solid ${colors.marginLine}`, display: 'grid', gap: 2 * k }}>
						<span style={{ ...type.caption, color: colors.sepia, fontSize: dateSize * 0.9, lineHeight: `${dateSize * 1.2}px` }}>{reply.label}:</span>
						{replyEditor ? (
							<textarea
								className="lb-write"
								value={replyEditor.value}
								onChange={(e) => replyEditor.onChange(e.target.value)}
								placeholder={replyEditor.placeholder}
								aria-label={replyEditor.label}
								autoFocus
								rows={3}
								style={{ ...type.hand, color: colors.sepia, fontSize: hand, lineHeight: `${lineH}px` }}
							/>
						) : (
							<p className="lb-hand" style={{ ...type.hand, color: colors.sepia, fontSize: hand, lineHeight: `${lineH}px`, WebkitLineClamp: lines }}>
								{reply.text}
							</p>
						)}
					</div>
				) : null}
			</div>
		</div>
	);
}

/** An entry as a page lying a little crooked, lifting under the finger when it can be opened (ScrapObject). */
export function ScrapObject({ entry, width, lines, lift, onPress, player }) {
	const tilt = seededRng(entry.id).range(-4, 4) * 0.3;
	const page = (
		<div className="lb-scrap" style={{ width, transform: `rotate(${tilt}deg)` }}>
			<DiaryPage entry={entry} width={width} lines={lines} lift={lift} player={player} />
		</div>
	);
	if (!onPress) return page;
	return (
		<button type="button" className="lb-plain lb-lift" onClick={onPress} aria-label={`Memory from ${displayDate(entry.localDate)}`}>
			{page}
		</button>
	);
}

/* ---------- The photograph that turns over (MemoryCard.tsx) ---------- */

/** The memory on its own page: a photograph (or a page of words) you can turn over to read the back. */
export function MemoryCard({ entry, width, back, onTurn }) {
	const { colors } = useTheme();
	const words = planWords(entry.text, 28, entry.photo ? 2 : 9);
	const height = width * (entry.photo ? (words.back ? 1.34 : entry.text.trim() ? 1.27 : 1.18) : 1.2);
	const drag = useRef(null);
	const [dx, setDx] = useState(0);
	const angle = (back ? 180 : 0) + Math.max(-180, Math.min(180, (dx / (width * 0.85)) * 180));
	const paper = { width, height, padding: 14, borderRadius: 2, boxShadow: '0 12px 18px -8px rgba(35,25,15,0.45), 1px 2px 1px rgba(35,25,15,0.2)' };
	const onDown = (e) => {
		drag.current = { x: e.clientX, y: e.clientY, moved: false };
	};
	const onMove = (e) => {
		const d = drag.current;
		if (!d) return;
		const mx = e.clientX - d.x;
		if (!d.moved && Math.abs(mx) > 10 && Math.abs(mx) > Math.abs(e.clientY - d.y)) {
			d.moved = true;
			e.currentTarget.setPointerCapture?.(e.pointerId);
		}
		if (d.moved) setDx(mx);
	};
	const onUp = () => {
		const d = drag.current;
		drag.current = null;
		if (d?.moved) {
			const turn = Math.abs(dx) > width * 0.25;
			setDx(0);
			if (turn) onTurn();
		}
	};
	return (
		<div className="lb-card3d" style={{ width, height }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
			<div className={`lb-card-face${dx ? ' is-dragging' : ''}`} style={{ ...paper, background: colors.paperWhite, transform: `perspective(1100px) rotateY(${angle}deg)` }} aria-hidden={back}>
				<Texture kind="paper" opacity={0.7} radius={2} />
				{entry.photo ? (
					<span style={{ width: width - 28, height: width - 28, display: 'block', position: 'relative', background: colors.kraft }}>
						<Photo photo={entry.photo} />
					</span>
				) : (
					<span style={{ ...type.caption, color: colors.sepia, marginBottom: 16, display: 'block', position: 'relative' }}>{displayDate(entry.localDate)}</span>
				)}
				<p className="lb-hand" style={{ ...type.hand, color: colors.inkBlue, fontSize: 24, lineHeight: '28px', marginTop: entry.photo ? 10 : 0, flex: 1, position: 'relative', WebkitLineClamp: entry.photo ? 2 : 9 }}>
					{words.front ?? words.teaser ?? ''}
					{words.back ? '…' : ''}
				</p>
				{words.back ? (
					<button type="button" className="lb-plain" onClick={onTurn} style={{ minHeight: 44, alignSelf: 'flex-end', position: 'relative' }} aria-label="P.T.O. Turn over to read all your words">
						<span style={{ ...type.caption, color: colors.sepia }}>P.T.O. ↪</span>
					</button>
				) : (
					<span style={{ ...type.caption, color: colors.sepia, fontSize: 13, textAlign: 'right', position: 'relative' }}>{entry.photo ? displayDate(entry.localDate) : 'kept for your future self'}</span>
				)}
			</div>
			<div className={`lb-card-face${dx ? ' is-dragging' : ''}`} style={{ ...paper, background: colors.paper, transform: `perspective(1100px) rotateY(${angle + 180}deg)` }} aria-hidden={!back}>
				<Texture kind="paper" opacity={0.75} radius={2} />
				<span style={{ ...type.caption, color: colors.sepia, marginBottom: 12, position: 'relative' }}>{displayDate(entry.localDate)} · on the back</span>
				<div className="lb-card-back-words">
					<p style={{ ...type.hand, color: colors.inkBlue, fontSize: 25, lineHeight: '32px', whiteSpace: 'pre-wrap' }}>{entry.text.trim() || 'No words that day. Just a moment, kept.'}</p>
				</div>
				<span style={{ ...type.caption, color: colors.sepia, fontSize: 13, textAlign: 'right', marginTop: 8, position: 'relative' }}>from the person you were then</span>
			</div>
		</div>
	);
}

/* ---------- Letters from your past self (MemoryLetters.tsx) ---------- */

const AIR_RED = '#C8302B';
const AIR_BLUE = '#1F4EA0';
const AIR_STRIPES = `repeating-linear-gradient(135deg, ${AIR_RED} 0px, ${AIR_RED} 8px, transparent 8px, transparent 14px, ${AIR_BLUE} 14px, ${AIR_BLUE} 22px, transparent 22px, transparent 28px)`;
const STAMP = 46;
const POSTMARK = 44;

/**
 * One airmail envelope from an earlier year: PAR AVION, your name in blue ink "to open on" today, FROM ME · year, a
 * stamp with the year and today's postmark. Tap: the flap opens and the page slides out; tap the page to read it.
 */
export function Letter({ entry, today, width, name, onOpen, perch = true, first = true, closeKey }) {
	const theme = useTheme();
	const { colors } = theme;
	const [open, setOpen] = useState(false);
	const [seen, setSeen] = useState(closeKey);
	if (closeKey !== seen) {
		setSeen(closeKey);
		setOpen(false);
	}
	const year = parseDate(entry.localDate).year;
	const rng = seededRng(`letter-${entry.id}`);
	const tilt = rng.range(-1.5, 1.5);
	const stampTilt = rng.range(-6, 6);
	const postmarkTilt = rng.range(-18, 4);
	const paper = colors.paperWhite;
	const inside = mixHex(colors.paper, '#000000', 0.16);
	const line = withAlpha(colors.ink, 0.28);
	const height = width * 0.64;
	const rise = height * 0.62;
	const flapH = height * 0.56;
	const letterW = width * 0.84;
	const flap = `M 0 0 L ${width} 0 L ${width / 2 + 6} ${flapH - 6} Q ${width / 2} ${flapH} ${width / 2 - 6} ${flapH - 6} Z`;
	const day = shortDay(today);
	return (
		<div className={`lb-letter${open ? ' is-open' : ''}`} style={{ width, height: rise + height, transform: `rotate(${tilt}deg)` }}>
			<div className="lb-letter-perch" style={{ height: rise }} aria-hidden={open}>
				{perch ? <span style={{ ...type.caption, color: colors.onDeskMuted, textAlign: 'center', flex: 1, paddingBottom: 16 }}>{first ? `A letter came back, from ${year}. Tap to open it.` : `…and one from ${year}`}</span> : null}
			</div>
			<div className="lb-env" style={{ top: rise, width, height, boxShadow: theme.shadow(1.2) }}>
				<span className="lb-abs" style={{ inset: 0, background: inside, borderRadius: 4 }} />
				<svg className="lb-env-flap-open" width={width} height={flapH} style={{ top: -flapH }} aria-hidden="true">
					<g transform={`translate(0 ${flapH}) scale(1 -1)`}>
						<path d={flap} fill={paper} stroke={line} strokeWidth="1" strokeLinejoin="round" />
					</g>
				</svg>
				<div className="lb-env-pocket" style={{ top: -rise, height: rise + height - 4 }}>
					<div className="lb-env-page" style={{ top: 14, left: (width - letterW) / 2, '--rise': `${rise}px` }}>
						<ScrapObject entry={entry} width={letterW} lines={4} onPress={open ? () => onOpen(entry.id) : undefined} />
					</div>
				</div>
				<div className="lb-env-front" style={{ top: height * 0.42, background: paper }}>
					<svg width={width} height={height * 0.58} className="lb-abs" style={{ left: 0, top: 0 }} aria-hidden="true">
						<path d={`M 0 ${height * 0.58} L ${width / 2} ${height * 0.1} L ${width} ${height * 0.58}`} stroke={colors.ink} strokeWidth="1" fill="none" opacity="0.35" />
					</svg>
					<span className="lb-abs" style={{ left: 16, top: 8, border: `1.2px solid ${AIR_BLUE}`, padding: '1px 5px', background: '#F4F6FB', ...type.stamp, color: AIR_BLUE, fontSize: 7, lineHeight: '10px', letterSpacing: 1.2 }}>PAR AVION</span>
					<span className="lb-abs" style={{ left: 28, right: STAMP + 24, bottom: 10, display: 'grid', gap: 1 }}>
						<span style={{ ...type.hand, color: colors.inkBlue, fontSize: 22, lineHeight: '24px', whiteSpace: 'nowrap' }}>{name || 'Me'},</span>
						<span style={{ height: 1.4, background: withAlpha(colors.ink, 0.3) }} />
						<span style={{ ...type.hand, color: colors.inkBlue, fontSize: 15, lineHeight: '18px', whiteSpace: 'nowrap' }}>to open on {day}</span>
						<span style={{ height: 1.4, background: withAlpha(colors.ink, 0.3) }} />
						<span style={{ ...type.stamp, color: colors.sepia, fontSize: 7, lineHeight: '11px', letterSpacing: 1.4, marginTop: 2 }}>FROM ME · {year}</span>
					</span>
					<span className="lb-abs lb-stamp" style={{ right: 12, bottom: 12, width: STAMP, height: STAMP * 1.15, background: colors.paperWhite, borderColor: colors.sepia, transform: `rotate(${stampTilt}deg)` }}>
						<span style={{ ...type.stampLarge, color: colors.sepia, letterSpacing: 0, fontSize: 15 }}>{year}</span>
					</span>
					<svg className="lb-abs" width={STAMP * 1.9} height={STAMP * 0.7} style={{ right: 12 - STAMP * 0.2, bottom: 12 + STAMP * 0.3 }} aria-hidden="true">
						{[0.2, 0.45, 0.7].map((y) => (
							<path key={y} d={`M 0 ${STAMP * 0.7 * y} q ${STAMP * 0.24} -5 ${STAMP * 0.48} 0 t ${STAMP * 0.48} 0 t ${STAMP * 0.48} 0 t ${STAMP * 0.48} 0`} stroke={withAlpha(colors.inkBlue, 0.5)} strokeWidth="1.2" fill="none" />
						))}
					</svg>
					<span className="lb-abs lb-postmark" style={{ right: 12 + STAMP * 0.82, bottom: 12 + STAMP * 0.32, width: POSTMARK, height: POSTMARK, borderColor: withAlpha(colors.inkBlue, 0.55), transform: `rotate(${postmarkTilt}deg)` }}>
						<span style={{ ...type.stamp, color: withAlpha(colors.inkBlue, 0.6), fontSize: 8, lineHeight: '10px', letterSpacing: 0.6, whiteSpace: 'nowrap' }}>{day.toUpperCase()}</span>
					</span>
					<span className="lb-abs" style={{ left: 0, right: 0, bottom: 0, height: 6, backgroundImage: AIR_STRIPES }} />
					<span className="lb-abs" style={{ top: 0, bottom: 0, left: 0, width: 6, backgroundImage: AIR_STRIPES }} />
					<span className="lb-abs" style={{ top: 0, bottom: 0, right: 0, width: 6, backgroundImage: AIR_STRIPES }} />
				</div>
				<div className="lb-env-top" style={{ height: height * 0.42 + 1, background: paper }}>
					<span className="lb-abs" style={{ left: 0, right: 0, top: 0, height: 6, backgroundImage: AIR_STRIPES }} />
					<span className="lb-abs" style={{ top: 0, bottom: 0, left: 0, width: 6, backgroundImage: AIR_STRIPES }} />
					<span className="lb-abs" style={{ top: 0, bottom: 0, right: 0, width: 6, backgroundImage: AIR_STRIPES }} />
				</div>
				<svg className="lb-env-flap" width={width} height={flapH} aria-hidden="true">
					<path d={flap} fill={paper} stroke={line} strokeWidth="1" strokeLinejoin="round" />
					<path d={flap} fill="none" stroke={AIR_RED} strokeWidth="4" strokeDasharray="8 8" strokeLinejoin="round" opacity="0.9" />
					<path d={flap} fill="none" stroke={AIR_BLUE} strokeWidth="4" strokeDasharray="8 8" strokeDashoffset="8" strokeLinejoin="round" opacity="0.9" />
				</svg>
				<button
					type="button"
					className="lb-env-hit"
					onClick={() => setOpen((o) => !o)}
					aria-label={open ? `Put the ${year} letter away` : `Open the letter from ${year}`}
					style={{ top: open ? height * 0.42 : 0 }}
				/>
			</div>
		</div>
	);
}

/** Several years make a deck: swipe the top letter away (it tucks in at the back) or tap a year's stamp (LetterDeck). */
export function LetterDeck({ entries, today, width, name, onOpen }) {
	const theme = useTheme();
	const { colors } = theme;
	const [order, setOrder] = useState(() => entries.map((_, i) => i));
	const [drag, setDrag] = useState(0);
	const [back, setBack] = useState(null);
	const start = useRef(null);
	const front = order[0];
	const height = width * 0.64;
	const rise = height * 0.62;
	const cycle = (x) => {
		setBack({ index: front, x, n: (back?.n ?? 0) + 1 });
		setOrder((o) => [...o.slice(1), o[0]]);
		setDrag(0);
	};
	const bring = (index) => setOrder((o) => [...o.slice(o.indexOf(index)), ...o.slice(0, o.indexOf(index))]);
	const onDown = (e) => {
		start.current = { x: e.clientX, y: e.clientY, live: false, t: performance.now() };
	};
	const onMove = (e) => {
		const s = start.current;
		if (!s) return;
		const dx = e.clientX - s.x;
		if (!s.live && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
			s.live = true;
			e.currentTarget.setPointerCapture?.(e.pointerId);
		}
		if (s.live) setDrag(dx);
	};
	const onUp = (e) => {
		const s = start.current;
		start.current = null;
		if (!s?.live) return;
		const v = (e.clientX - s.x) / Math.max(1, performance.now() - s.t);
		if (Math.abs(drag) > width * 0.26 || Math.abs(v) > 0.85) cycle((drag >= 0 ? 1 : -1) * width * 1.15);
		else setDrag(0);
	};
	const frontEntry = entries[front];
	return (
		<div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
			<div style={{ width, height: rise + height + 24, position: 'relative' }}>
				<div className="lb-letter-perch" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: rise }}>
					<span style={{ ...type.caption, color: colors.onDeskMuted, textAlign: 'center', flex: 1, paddingBottom: 16 }}>{`${entries.length} letters came back from your past self. Swipe to shuffle, tap one to open it.`}</span>
				</div>
				<div className="lb-deck" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
					{entries.map((entry, index) => {
						const pos = order.indexOf(index);
						const side = pos % 2 === 0 ? 1 : -1;
						const isFront = pos === 0;
						const d = isFront ? drag : 0;
						const returning = back?.index === index;
						return (
							<div
								key={`${entry.id}-${returning ? back.n : 0}`}
								className={`lb-deck-card${d ? ' is-dragging' : ''}${returning ? ' is-returning' : ''}`}
								style={{
									zIndex: entries.length - pos,
									opacity: pos > 2.5 ? 0 : 1,
									pointerEvents: isFront ? 'auto' : 'none',
									'--from-x': returning ? `${back.x}px` : '0px',
									transform: `translateX(${d + pos * 9 * side}px) translateY(${pos * 12}px) rotate(${d / 16 + pos * 3.5 * side}deg) scale(${1 - pos * 0.045})`,
								}}
							>
								<Letter entry={entry} today={today} width={width} name={name} onOpen={onOpen} perch={false} closeKey={order.join()} />
							</div>
						);
					})}
				</div>
			</div>
			{frontEntry ? <p style={{ ...type.headline, color: colors.giltBright, textAlign: 'center' }}>{yearsAgoLabel(yearsBetween(frontEntry.localDate, today))}</p> : null}
			<div className="lb-row" style={{ gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
				{entries.map((entry, index) => {
					const year = parseDate(entry.localDate).year;
					const on = index === front;
					return (
						<button
							key={entry.id}
							type="button"
							className="lb-yearstamp"
							onClick={() => bring(index)}
							aria-pressed={on}
							aria-label={`Letter from ${year}`}
							style={{
								background: on ? colors.primary : colors.paperWhite,
								borderColor: on ? colors.paperWhite : colors.sepia,
								boxShadow: theme.shadow(on ? 1.2 : 0.5),
								transform: on ? 'rotate(-6deg) translateY(-4px) scale(1.1)' : 'none',
							}}
						>
							<span style={{ ...type.stamp, color: on ? colors.onPrimary : colors.sepia, letterSpacing: 0 }}>{year}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}

/* ---------- The bookshelf (BookSpine.tsx, Cupboard.tsx) ---------- */

const SPINE_GILT = '#D4B26A';
const DOODLES = [
	'M0 -6 L1.8 -1.8 L6 -1.8 L2.6 1 L3.8 5.4 L0 2.8 L-3.8 5.4 L-2.6 1 L-6 -1.8 L-1.8 -1.8 Z',
	'M0 4 C-6 -1 -4 -6 0 -2.5 C4 -6 6 -1 0 4 Z',
	'M0 0 C2 -2 4 0 2 2 C0 4 -4 2 -3 -2 C-2 -6 4 -6 5 -1',
	'M-6 0 L-3 -3 L0 0 L3 -3 L6 0',
	'M-5 -5 L5 5 M5 -5 L-5 5',
];
export function spineSize(year, maxHeight) {
	const rng = seededRng(`spine-${year}`);
	return { width: Math.round(rng.range(52, 62)), height: Math.round(maxHeight * rng.range(0.84, 1)) };
}

/** A year's volume standing spine out: leather in a deep shade of the year's color, gilt bands, the year reading up. */
export function BookSpine({ year, count, age, maxHeight = 190, fill = 1, onPress, hidden }) {
	const theme = useTheme();
	const { colors } = theme;
	const palette = theme.year(year);
	const gid = `round${useId().replace(/:/g, '')}`;
	const { width: w, height: h } = spineSize(year, maxHeight);
	const STICK = 14;
	const wear = Math.min(Math.max(age, 0), 6);
	const rng = seededRng(`spine-wear-${year}`);
	const scuffs = Array.from({ length: wear >= 2 ? wear + 1 : 0 }, () => ({ x: rng.range(6, w - 10), y: rng.range(10, h - 12), len: rng.range(4, 10) }));
	const leather = mixHex(palette.primary, '#000000', 0.62);
	const full = Math.max(0, Math.min(1, fill));
	const life = seededRng(`spine-life-${year}`);
	const slips = Array.from({ length: Math.round(full * 4) }, (_, i) => ({
		kind: ['paper', 'photo', 'tape', 'envelope'][(i + Math.floor(life.range(0, 4))) % 4],
		x: life.range(2, w - 22),
		lift: life.range(4, STICK - 1),
		tilt: life.range(-14, 14),
	}));
	const doodles = Array.from({ length: Math.round(full * 3) }, (_, i) => ({ d: DOODLES[(i + year) % DOODLES.length], x: life.range(10, w - 10), y: life.range(h * 0.3, h * 0.75), r: life.range(-30, 30) }));
	const bands = [h * 0.08, h * 0.2, h * 0.8, h * 0.92];
	const ref = useRef(null);
	return (
		<button
			type="button"
			ref={ref}
			className="lb-spine"
			onClick={() => onPress?.(ref.current?.getBoundingClientRect())}
			disabled={!onPress}
			aria-label={`${year} volume, ${count} ${count === 1 ? 'page' : 'pages'}`}
			style={{ width: w, height: h, opacity: hidden ? 0 : 1 }}
		>
			{slips.map((s, i) => (
				<span
					key={i}
					className="lb-abs"
					style={{
						left: s.x,
						top: STICK - s.lift,
						width: s.kind === 'tape' ? 22 : s.kind === 'photo' ? 16 : 20,
						height: 18,
						background: { paper: '#F1E8D4', photo: '#FBFAF6', tape: '#1C1C1E', envelope: '#F6F4EE' }[s.kind],
						borderRadius: s.kind === 'tape' ? 2 : 1,
						transform: `rotate(${s.tilt}deg)`,
						boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
						overflow: 'hidden',
					}}
				>
					{s.kind === 'photo' ? <span style={{ display: 'block', margin: 2, height: 9, background: palette.primary, opacity: 0.8 }} /> : null}
					{s.kind === 'tape' ? <span style={{ display: 'block', margin: '2px 3px 0', height: 5, background: '#F1E8D4' }} /> : null}
					{s.kind === 'envelope' ? <span style={{ display: 'block', height: 3, backgroundImage: `repeating-linear-gradient(90deg, ${AIR_RED} 0px, ${AIR_RED} 4px, ${AIR_BLUE} 4px, ${AIR_BLUE} 8px)` }} /> : null}
					{s.kind === 'paper' ? <span style={{ display: 'block', margin: '5px 3px 0', height: 1, background: 'rgba(0,0,0,0.2)' }} /> : null}
				</span>
			))}
			{age <= 0 ? <span className="lb-abs" style={{ left: w * 0.62, top: STICK - 10, width: 7, height: 18, background: colors.wax, borderRadius: '2px 2px 0 0' }} /> : null}
			<span className="lb-abs lb-spine-body" style={{ top: STICK, width: w, height: h - STICK, background: leather }}>
				<svg width={w} height={h} className="lb-abs" style={{ left: -1, top: -1 }} aria-hidden="true">
					<defs>
						<linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
							<stop offset="0" stopColor="#000" stopOpacity="0.45" />
							<stop offset="0.32" stopColor="#fff" stopOpacity="0.14" />
							<stop offset="0.52" stopColor="#fff" stopOpacity="0.04" />
							<stop offset="1" stopColor="#000" stopOpacity="0.5" />
						</linearGradient>
					</defs>
					<rect x="0" y="0" width={w} height={h} fill="#fff" opacity={wear * 0.035} />
					{scuffs.map((s, i) => (
						<path key={i} d={`M ${s.x} ${s.y} l ${s.len} ${s.len * 0.3}`} stroke="#fff" strokeWidth="1" opacity="0.25" strokeLinecap="round" />
					))}
					{bands.map((y) => (
						<g key={y}>
							<rect x="0" y={y - 3.5} width={w} height="7" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" />
							<rect x="0" y={y - 4.5} width={w} height="1" fill={SPINE_GILT} opacity="0.85" />
							<rect x="0" y={y + 3.5} width={w} height="1" fill={SPINE_GILT} opacity="0.85" />
						</g>
					))}
					{doodles.map((d, i) => (
						<path key={`d${i}`} d={d.d} transform={`translate(${d.x} ${d.y}) rotate(${d.r})`} stroke="rgba(255,245,225,0.55)" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
					))}
					{full > 0.45 ? <path d={`M ${w} ${h * 0.38} l -6 4 l 4 3 l -7 5 l 9 4 Z`} fill="#000" opacity="0.55" /> : null}
					<rect x="0" y="0" width={w} height={h} fill={`url(#${gid})`} />
				</svg>
				{full > 0.6 ? <span className="lb-abs" style={{ right: -4, top: h * 0.36, width: 22, height: 14, background: 'rgba(240, 232, 210, 0.7)', transform: 'rotate(-12deg)' }} /> : null}
				<span className="lb-abs lb-spine-year" style={{ top: h * 0.26, height: h * 0.48, width: w }}>
					<span style={{ ...type.stampLarge, color: SPINE_GILT, letterSpacing: 2, transform: 'rotate(-90deg)', whiteSpace: 'nowrap', textShadow: '0 1px 0 rgba(0,0,0,0.6)' }}>{year}</span>
				</span>
				<span className="lb-abs" style={{ ...type.stamp, left: 0, right: 0, top: (h - STICK) * 0.83, color: SPINE_GILT, textAlign: 'center', letterSpacing: 0.5 }}>{count}</span>
			</span>
		</button>
	);
}

/** A walnut bookcase: crown, sides, shelves with lit edges, a planked back panel, feet (Cupboard.tsx). */
export function Cupboard({ shelves }) {
	const { colors } = useTheme();
	return (
		<div className="lb-cupboard" style={{ background: colors.wood, '--wood-dark': colors.woodDark, '--wood-light': colors.woodLight, '--wood-deep': colors.woodDeep }}>
			<Texture kind="wood" opacity={0.9} radius={6} />
			<span className="lb-cup-crown" style={{ background: colors.woodLight }} />
			{shelves.map((shelf, i) => (
				<div key={i} className="lb-cup-shelf">
					<div className="lb-cup-back" style={{ background: colors.woodDark }}>
						<Texture kind="wood" opacity={0.55} />
						<span className="lb-cup-shade" />
					</div>
					<div className="lb-cup-books">{shelf}</div>
					<span className="lb-cup-board" style={{ background: colors.woodLight }} />
				</div>
			))}
			<span className="lb-cup-foot" style={{ left: 18, background: colors.woodDeep }} />
			<span className="lb-cup-foot" style={{ right: 18, background: colors.woodDeep }} />
		</div>
	);
}

/** Every year as a volume on the shelf: oldest left, newest right, a shelf filling before the next. */
export function YearsCupboard({ groups, today, onOpenYear, flying, perShelf = 3 }) {
	const thisYear = parseDate(today).year;
	const asc = [...groups].sort((a, b) => a.year - b.year);
	const shelves = [];
	for (let i = 0; i < Math.max(1, asc.length); i += perShelf) shelves.push(asc.slice(i, i + perShelf));
	if (shelves.length < 2) shelves.push([]);
	return (
		<Cupboard
			shelves={shelves.map((shelf) =>
				shelf.map((g) => {
					const age = thisYear - g.year;
					const fill = age <= 0 ? Math.min(1, (parseDate(today).month - 1) / 12 + 0.1) : 1;
					return <BookSpine key={g.year} year={g.year} count={g.entries.length} age={age} fill={fill} hidden={flying === g.year} onPress={(rect) => onOpenYear(g.year, rect)} />;
				}),
			)}
		/>
	);
}

/* ---------- The tape recorder (TapeRecorder.tsx) ---------- */

/**
 * The voice on the memory page: a stitched row with the memory's own little cassette, then Rewind · Play · Stop. Play,
 * Rewind or the cassette lifts it up into the middle of the screen over the dimmed page (LiftedCassette).
 */
export function TapeRecorder({ player, label, onLift, held }) {
	const [, force] = useState(0);
	useFrame(player.playing, () => force((n) => (n + 1) % 1000));
	const lift = (then) => {
		onLift();
		then?.();
	};
	return (
		<ActionRow
			lead={
				<button type="button" className="lb-plain" onClick={() => lift()} aria-label="Pick up the cassette" style={{ padding: '0 4px', opacity: held ? 0 : 1, position: 'relative' }}>
					<Cassette width={92} title={label} detail={formatVoiceMs(player.dur)} played={player.progress()} />
				</button>
			}
			actions={[
				{ key: 'rewind', icon: 'rewind', label: 'Rewind', onPress: () => lift(player.rewind) },
				{ key: 'play', icon: player.playing ? 'pause' : 'play', label: player.playing ? 'Pause' : 'Play', active: player.playing, onPress: () => lift(player.toggle) },
				{ key: 'stop', icon: 'stop', label: 'Stop', onPress: player.stop },
			]}
		/>
	);
}

/** The cassette held up over the dimmed page, its reels turning, the time under it and the deck's keys below. */
export function LiftedCassette({ player, label, onPutDown }) {
	const { colors } = useTheme();
	const [, force] = useState(0);
	useFrame(player.playing, () => force((n) => (n + 1) % 1000));
	return (
		<div className="lb-lifted" role="dialog" aria-label="The cassette, held up">
			<button type="button" className="lb-lifted-dim" aria-label="Put the cassette down" onClick={onPutDown} />
			<div className="lb-lifted-tape">
				<button type="button" className="lb-plain" onClick={player.toggle} aria-label={player.playing ? 'Pause' : 'Play'}>
					<Cassette width={300} title={label} detail={formatVoiceMs(player.dur)} spinning={player.playing} played={player.progress()} />
				</button>
			</div>
			<div className="lb-lifted-keys">
				<p style={{ ...type.caption, color: colors.paperWhite, textAlign: 'center' }}>
					{player.playing ? 'your past self, speaking' : 'press play to listen'} · {formatVoiceMs(player.position())} / {formatVoiceMs(player.dur)}
				</p>
				<ActionRow
					actions={[
						{ key: 'rewind', icon: 'rewind', label: 'Rewind', onPress: player.rewind },
						{ key: 'play', icon: player.playing ? 'pause' : 'play', label: player.playing ? 'Pause' : 'Play', active: player.playing, onPress: player.toggle },
						{ key: 'stop', icon: 'stop', label: 'Stop', onPress: player.stop },
					]}
				/>
				<PillButton label="Put it down" icon="down" large onClick={onPutDown} />
			</div>
		</div>
	);
}

export { Icon };
