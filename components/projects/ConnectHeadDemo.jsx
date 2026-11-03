import { useEffect, useMemo, useRef, useState } from 'react';
import PrototypeWindow from './PrototypeWindow';

// Working copies of the Connect Head apps, built from the Mac app's SwiftUI
// pages (mac/Sources/SonyControl/UI/Window) and the Android app's tab layout,
// so visitors can try the interface without the headphones. Nothing here talks
// to Bluetooth: the state is sample data.

const PAGES = ['Overview', 'Sound', 'Equalizer', 'Listening', 'Devices', 'Settings'];
// The phone's tab bar shows these four; the rest sit under More.
const PRIMARY = ['Overview', 'Sound', 'Equalizer', 'Listening'];

const MODES = [
	{ id: 'nc', name: 'Noise Cancelling', sub: 'Block out the world' },
	{ id: 'amb', name: 'Ambient Sound', sub: 'Hear your surroundings' },
	{ id: 'off', name: 'Off', sub: 'Plain playback' },
];

const BAND_LABELS = ['400', '1k', '2.5k', '6.3k', '16k'];

const DOWNLOADS = {
	mac: 'https://github.com/Sreekaran1704/Connect-Head/releases/download/v1.0.0/ConnectHead-1.0.0-mac.zip',
	android: 'https://github.com/Sreekaran1704/Connect-Head/releases/download/v1.0.0/ConnectHead-1.0.0-android.apk',
};

// The headphones report each preset's curve; these stand in for them.
const PRESETS = [
	{ name: 'Off', bands: [0, 0, 0, 0, 0] },
	{ name: 'Bright', bands: [0, 1, 2, 4, 5] },
	{ name: 'Excited', bands: [3, 1, -1, 2, 4] },
	{ name: 'Mellow', bands: [2, 1, 0, -2, -4] },
	{ name: 'Relaxed', bands: [1, 0, -1, -2, -3] },
	{ name: 'Vocal', bands: [-2, 0, 4, 3, 0] },
	{ name: 'Treble Boost', bands: [0, 0, 1, 4, 7] },
	{ name: 'Bass Boost', bands: [6, 3, 0, 0, 0] },
	{ name: 'Speech', bands: [-3, 1, 4, 3, -1] },
	{ name: 'Manual', bands: null },
	{ name: 'Custom 1', bands: [2, 0, -1, 1, 3] },
	{ name: 'Custom 2', bands: [-1, 2, 3, 1, 0] },
];

const TRACKS = [
	{ title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We’re Dreaming', source: 'Spotify', duration: 244 },
	{ title: 'Everlong', artist: 'Foo Fighters', album: 'The Colour and the Shape', source: 'Apple Music', duration: 250 },
	{ title: 'Mr. Brightside', artist: 'The Killers', album: 'Hot Fuss', source: 'YouTube · Safari', duration: 222 },
	{ title: 'Seven Nation Army', artist: 'The White Stripes', album: 'Elephant', source: 'Spotify', duration: 232 },
];

const NC_BUTTON = ['NC → Ambient → Off', 'NC ↔ Ambient', 'NC ↔ Off', 'Ambient ↔ Off'];
const AUTO_OFF = ['Never', 'After 5 minutes', 'After 30 minutes', 'After 1 hour', 'After 3 hours', 'When taken off'];
const ASSISTANTS = ['Off', 'Mac / phone assistant', 'Google Assistant', 'Amazon Alexa'];

const START_DEVICES = [
	{ id: 'mac', name: 'MacBook Air', kind: 'laptop', connected: true, thisMac: true },
	{ id: 'phone', name: 'Android phone', kind: 'phone', connected: true },
	{ id: 'pc', name: 'Windows PC', kind: 'laptop', connected: false },
];

/* ---------- Sample listening history ---------- */

// Thirty days of sessions from a seeded generator, so every visitor sees the
// same numbers and the server render matches the browser's.
function makeHistory() {
	let seed = 20261102;
	const rand = () => {
		seed = (seed * 1103515245 + 12345) % 2147483648;
		return seed / 2147483648;
	};
	const weights = [0.46, 0.2, 0.18, 0.16];
	const pick = () => {
		let r = rand();
		for (let i = 0; i < weights.length; i++) {
			if ((r -= weights[i]) <= 0) return TRACKS[i];
		}
		return TRACKS[0];
	};
	const hours = [8, 9, 9, 13, 17, 19, 20, 21, 21, 22, 22, 23];
	const sessions = [];
	const volume = [];
	for (let day = 0; day < 30; day++) {
		const count = 2 + Math.floor(rand() * 4);
		for (let s = 0; s < count; s++) {
			const track = pick();
			sessions.push({
				day,
				hour: hours[Math.floor(rand() * hours.length)],
				artist: track.artist,
				title: track.title,
				service: track.source.split(' · ')[0],
				seconds: 900 + Math.floor(rand() * 2400),
			});
		}
		volume.push({ day, level: 0.56 + rand() * 0.18, loud: 0.12 + rand() * 0.18 });
	}
	return { sessions, volume };
}

const HISTORY = makeHistory();
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function duration(seconds) {
	const m = Math.round(seconds / 60);
	if (m < 1) return seconds > 0 ? '<1m' : '0m';
	if (m < 60) return `${m}m`;
	return m % 60 === 0 ? `${m / 60}h` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

function hourLabel(h) {
	if (h === 0) return '12a';
	if (h < 12) return `${h}a`;
	return h === 12 ? '12p' : `${h - 12}p`;
}

// Day 29 is today, a Monday.
function statsFor(days, history) {
	const first = 30 - days;
	const recent = history.sessions.filter((s) => s.day >= first);
	const total = recent.reduce((sum, s) => sum + s.seconds, 0);
	const perDay = Array.from({ length: days }, (_, i) => {
		const day = first + i;
		const weekday = (day + 2) % 7;
		return {
			label: days <= 7 ? WEEKDAYS[weekday] : String(((day + 4) % 31) + 1),
			long: WEEKDAY_NAMES[weekday],
			seconds: recent.filter((s) => s.day === day).reduce((sum, s) => sum + s.seconds, 0),
		};
	});
	const perHour = Array.from({ length: 24 }, (_, h) =>
		recent.filter((s) => s.hour === h).reduce((sum, s) => sum + s.seconds, 0)
	);
	const ranked = (key, detail) => {
		const groups = {};
		recent.forEach((s) => {
			(groups[key(s)] = groups[key(s)] || []).push(s);
		});
		return Object.entries(groups)
			.map(([name, group]) => ({ name, detail: detail(group), seconds: group.reduce((sum, s) => sum + s.seconds, 0) }))
			.sort((a, b) => b.seconds - a.seconds);
	};
	const vol = history.volume.filter((v) => v.day >= first);
	const daySeconds = (day) => recent.filter((s) => s.day === day).reduce((sum, s) => sum + s.seconds, 0);
	const volSeconds = vol.reduce((sum, v) => sum + daySeconds(v.day), 0);
	return {
		total,
		perDay,
		perHour,
		topArtists: ranked((s) => s.artist, (g) => {
			const n = new Set(g.map((s) => s.title)).size;
			return n === 1 ? '1 track' : `${n} tracks`;
		}),
		topTracks: ranked((s) => s.title, (g) => g[0].artist),
		services: ranked((s) => s.service, () => ''),
		perDayVolume: vol.map((v) => v.level),
		averageVolume: volSeconds ? vol.reduce((sum, v) => sum + v.level * daySeconds(v.day), 0) / volSeconds : null,
		loudSeconds: vol.reduce((sum, v) => sum + v.loud * daySeconds(v.day), 0),
	};
}

/* ---------- Small pieces ---------- */

function Icon({ name, size = 18 }) {
	const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
	switch (name) {
		case 'nc':
			return <svg {...common}><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></svg>;
		case 'amb':
			return <svg {...common}><circle cx="12" cy="12" r="2" /><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8" /></svg>;
		case 'off':
			return <svg {...common}><path d="M4 10h3l5-4v12l-5-4H4z" /><path d="M16 9.5a4 4 0 0 1 0 5" /></svg>;
		case 'laptop':
			return <svg {...common}><rect x="5" y="5" width="14" height="10" rx="1" /><path d="M2.5 18.5h19" /></svg>;
		case 'phone':
			return <svg {...common}><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M11 18.5h2" /></svg>;
		case 'note':
			return <svg {...common}><path d="M10 17V5l9-2v12" /><circle cx="7.5" cy="17" r="2.5" /><circle cx="16.5" cy="15" r="2.5" /></svg>;
		case 'power':
			return <svg {...common}><path d="M12 3v8" /><path d="M6.3 6.8a8 8 0 1 0 11.4 0" /></svg>;
		case 'prev':
			return <svg {...common} fill="currentColor" stroke="none"><path d="M11 6v12L3 12zM20 6v12l-8-6z" /></svg>;
		case 'next':
			return <svg {...common} fill="currentColor" stroke="none"><path d="M13 6v12l8-6zM4 6v12l8-6z" /></svg>;
		case 'play':
			return <svg {...common} fill="currentColor" stroke="none"><path d="M7 4.5v15l12-7.5z" /></svg>;
		case 'pause':
			return <svg {...common} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>;
		case 'home':
			return <svg {...common}><rect x="4" y="4" width="6.5" height="6.5" /><rect x="13.5" y="4" width="6.5" height="6.5" /><rect x="4" y="13.5" width="6.5" height="6.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" /></svg>;
		case 'sound':
			return <svg {...common}><path d="M7 15a5 5 0 1 1 9-3c0 2-2 2.5-2 4.5A2.5 2.5 0 0 1 9.5 18" /><path d="M18.5 8.5c1 1 1.5 2.2 1.5 3.5M20.5 6c1.5 1.7 2 3.7 2 6" /></svg>;
		case 'sliders':
			return <svg {...common}><path d="M6 4v16M12 4v16M18 4v16" /><rect x="4" y="13" width="4" height="3" /><rect x="10" y="7" width="4" height="3" /><rect x="16" y="11" width="4" height="3" /></svg>;
		case 'chart':
			return <svg {...common}><path d="M4 20h16" /><rect x="6" y="11" width="3" height="7" /><rect x="11" y="6" width="3" height="12" /><rect x="16" y="13" width="3" height="5" /></svg>;
		case 'devices':
			return <svg {...common}><rect x="2.5" y="5" width="13" height="9" rx="1" /><path d="M1 17h16" /><rect x="17" y="8" width="5.5" height="11" rx="1.2" /></svg>;
		case 'gear':
			return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M4.2 6l2.6 1.5M17.2 16.5l2.6 1.5M4.2 18l2.6-1.5M17.2 7.5 19.8 6" /></svg>;
		case 'more':
			return <svg {...common} fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>;
		default:
			return null;
	}
}

const PAGE_ICONS = { Overview: 'home', Sound: 'sound', Equalizer: 'sliders', Listening: 'chart', Devices: 'devices', Settings: 'gear' };

function Card({ title, children, className = '' }) {
	return (
		<section className={`chd-card ${className}`}>
			{title && <h4 className="chd-kicker">{title}</h4>}
			{children}
		</section>
	);
}

function PageHeader({ title, subtitle, children }) {
	return (
		<header className="chd-page-head">
			<div>
				<h3>{title}</h3>
				<p>{subtitle}</p>
			</div>
			{children}
		</header>
	);
}

function Toggle({ on, onChange, label }) {
	return (
		<button type="button" role="switch" aria-checked={on} aria-label={label} className={`chd-switch ${on ? 'is-on' : ''}`} onClick={() => onChange(!on)}>
			<span />
		</button>
	);
}

function Row({ title, detail, children }) {
	return (
		<div className="chd-row">
			<div>
				<p className="chd-row-title">{title}</p>
				{detail && <p className="chd-row-detail">{detail}</p>}
			</div>
			{children}
		</div>
	);
}

function Select({ value, options, onChange, label }) {
	return (
		<select className="chd-select" value={value} aria-label={label} onChange={(e) => onChange(e.target.value)}>
			{options.map((o) => (
				<option key={o}>{o}</option>
			))}
		</select>
	);
}

function Wordmark() {
	return <span className="chd-wordmark">CONNECT HEAD</span>;
}

/* ---------- Battery ---------- */

// Server and browser can differ in the last digit of a sine; two decimals agree.
const round = (n) => Math.round(n * 100) / 100;

function TickDial({ level, low }) {
	const [shown, setShown] = useState(0);
	useEffect(() => {
		const id = setTimeout(() => setShown(level), 120);
		return () => clearTimeout(id);
	}, [level]);
	const lit = Math.round((shown / 100) * 60);
	return (
		<svg className="chd-dial" viewBox="0 0 164 164" aria-hidden="true">
			{Array.from({ length: 60 }, (_, i) => {
				const a = (i / 60) * 2 * Math.PI - Math.PI / 2;
				const major = i % 5 === 0;
				const outer = 81;
				const inner = 82 - (major ? 14 : 8);
				return (
					<line
						key={i}
						x1={round(82 + Math.cos(a) * inner)}
						y1={round(82 + Math.sin(a) * inner)}
						x2={round(82 + Math.cos(a) * outer)}
						y2={round(82 + Math.sin(a) * outer)}
						className={i < lit ? (low ? 'is-low' : 'is-lit') : ''}
						strokeWidth={major ? 2.4 : 1.6}
						style={{ transitionDelay: `${i * 12}ms` }}
					/>
				);
			})}
			<circle cx="82" cy="82" r="62" className="chd-dial-ring" />
		</svg>
	);
}

function BatteryHero({ state, onPowerOff }) {
	const low = state.battery <= 20;
	const mode = MODES.find((m) => m.id === state.mode).name;
	return (
		<section className="chd-card chd-battery">
			<div className="chd-battery-art">
				<TickDial level={state.battery} low={low} />
				<img src="/images/connect-head/headphones.png" alt="" width="92" height="96" />
			</div>
			<div className="chd-battery-copy">
				<h4 className="chd-kicker chd-kicker-bare">Battery</h4>
				<p className={`chd-battery-level ${low ? 'is-low' : ''}`}>{state.battery}%</p>
				<hr />
				<p className="chd-battery-name">ULT WEAR</p>
				<p className="chd-dateline">AAC · Firmware 2.0.5 · {mode}</p>
			</div>
			<button type="button" className="chd-power" onClick={onPowerOff}>
				<Icon name="power" size={12} /> Power off
			</button>
		</section>
	);
}

/* ---------- Now playing ---------- */

function NowPlaying({ player, setPlayer }) {
	const track = TRACKS[player.index];
	const fraction = Math.min(player.position / track.duration, 1);
	const time = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
	const skip = (step) => setPlayer((p) => ({ ...p, index: (p.index + step + TRACKS.length) % TRACKS.length, position: 0 }));
	return (
		<Card title="Now playing">
			<div className="chd-np">
				<span className="chd-art"><Icon name="note" size={20} /></span>
				<div className="chd-np-copy">
					<p className="chd-np-title">{track.title}</p>
					<p className="chd-np-artist">{track.artist} — {track.album}</p>
					<p className="chd-np-source">{track.source} · This Mac</p>
				</div>
				<div className="chd-np-controls">
					<button type="button" aria-label="Previous" onClick={() => skip(-1)}><Icon name="prev" size={12} /></button>
					<button type="button" className="is-main" aria-label={player.playing ? 'Pause' : 'Play'} onClick={() => setPlayer((p) => ({ ...p, playing: !p.playing }))}>
						<Icon name={player.playing ? 'pause' : 'play'} size={14} />
					</button>
					<button type="button" aria-label="Next" onClick={() => skip(1)}><Icon name="next" size={12} /></button>
				</div>
			</div>
			<div className="chd-progress">
				<span>{time(player.position)}</span>
				<div><i style={{ width: `${fraction * 100}%` }} /></div>
				<span>{time(track.duration)}</span>
			</div>
		</Card>
	);
}

/* ---------- Sound modes ---------- */

function ModeCards({ mode, setMode, compact }) {
	return (
		<div className={`chd-modes ${compact ? 'is-compact' : ''}`} role="radiogroup" aria-label="Sound mode">
			{MODES.map((m) => (
				<button key={m.id} type="button" role="radio" aria-checked={mode === m.id} className={mode === m.id ? 'is-on' : ''} onClick={() => setMode(m.id)}>
					<Icon name={m.id} size={compact ? 18 : 24} />
					<span className="chd-mode-name">{m.name}</span>
					{!compact && <span className="chd-mode-sub">{m.sub}</span>}
				</button>
			))}
		</div>
	);
}

/* ---------- Equalizer ---------- */

function curvePath(points, w) {
	const all = [{ x: 0, y: points[0].y }, ...points, { x: w, y: points[points.length - 1].y }];
	let d = `M${all[0].x},${all[0].y}`;
	for (let i = 0; i < all.length - 1; i++) {
		const p0 = all[Math.max(i - 1, 0)], p1 = all[i], p2 = all[i + 1], p3 = all[Math.min(i + 2, all.length - 1)];
		const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
		const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
		d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
	}
	return d;
}

// The response curve; with `onChange`, each band's point drags up and down.
function EqCurve({ bands, height = 110, onChange, labels = false }) {
	const W = 500;
	const H = height;
	const svgRef = useRef(null);
	const [active, setActive] = useState(null);
	const points = bands.map((v, i) => ({ x: (W * (i + 0.5)) / bands.length, y: H / 2 - (v / 10) * (H / 2 - 6) }));
	const line = curvePath(points, W);

	const valueAt = (e) => {
		const box = svgRef.current.getBoundingClientRect();
		const y = ((e.clientY - box.top) / box.height) * H;
		return Math.round(Math.min(Math.max(((H / 2 - y) / (H / 2 - 6)) * 10, -10), 10));
	};
	const start = (i) => (e) => {
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		setActive(i);
		onChange(i, valueAt(e));
	};
	const move = (i) => (e) => {
		if (active === i) onChange(i, valueAt(e));
	};
	const end = () => setActive(null);

	return (
		<div className="chd-curve">
			<svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height }} role="img" aria-label={`Equalizer curve: ${bands.join(', ')}`}>
				{[0, 0.5, 1].map((f) => (
					<line key={f} x1="0" x2={W} y1={H * f} y2={H * f} className="chd-curve-grid" />
				))}
				<path d={`${line} L${W},${H} L0,${H} Z`} className="chd-curve-fill" />
				<path d={line} className="chd-curve-line" vectorEffect="non-scaling-stroke" />
			</svg>
			{/* Points sit in HTML over the stretched SVG, so they stay round. */}
			{points.map((p, i) => (
				<span key={i} className={`chd-curve-point ${active === i ? 'is-active' : ''}`} style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}>
					{onChange && (
						<button
							type="button"
							aria-label={`${BAND_LABELS[i]} Hz band, ${bands[i]}`}
							onPointerDown={start(i)}
							onPointerMove={move(i)}
							onPointerUp={end}
							onPointerCancel={end}
							onKeyDown={(e) => {
								if (e.key === 'ArrowUp') onChange(i, Math.min(bands[i] + 1, 10));
								if (e.key === 'ArrowDown') onChange(i, Math.max(bands[i] - 1, -10));
							}}
						/>
					)}
					{active === i && <em>{bands[i] > 0 ? `+${bands[i]}` : bands[i]}</em>}
				</span>
			))}
			{labels && (
				<div className="chd-curve-labels">
					{BAND_LABELS.map((l) => (
						<span key={l}>{l}</span>
					))}
				</div>
			)}
		</div>
	);
}

function Fader({ value, label, onChange }) {
	const ref = useRef(null);
	const [drag, setDrag] = useState(false);
	const pos = (v) => ((10 - v) / 20) * 100;
	// The knob's travel stops 8px short of each end.
	const along = (percent) => `calc(8px + (100% - 16px) * ${percent / 100})`;
	const set = (e) => {
		const box = ref.current.getBoundingClientRect();
		const f = (e.clientY - box.top - 8) / (box.height - 16);
		onChange(Math.round(Math.min(Math.max(10 - f * 20, -10), 10)));
	};
	const top = Math.min(pos(value), 50);
	const bottom = Math.max(pos(value), 50);
	return (
		<div className="chd-fader-col">
			<span className="chd-fader-value">{value > 0 ? `+${value}` : value}</span>
			<div
				ref={ref}
				className="chd-fader"
				role="slider"
				tabIndex={0}
				aria-label={label}
				aria-valuemin={-10}
				aria-valuemax={10}
				aria-valuenow={value}
				onPointerDown={(e) => {
					e.currentTarget.setPointerCapture(e.pointerId);
					setDrag(true);
					set(e);
				}}
				onPointerMove={(e) => drag && set(e)}
				onPointerUp={() => setDrag(false)}
				onPointerCancel={() => setDrag(false)}
				onKeyDown={(e) => {
					if (e.key === 'ArrowUp') onChange(Math.min(value + 1, 10));
					if (e.key === 'ArrowDown') onChange(Math.max(value - 1, -10));
				}}
			>
				{Array.from({ length: 11 }, (_, i) => (
					<i key={i} className={i === 0 || i === 5 || i === 10 ? 'is-major' : ''} style={{ top: along(i * 10) }} />
				))}
				<b style={{ top: along(top), height: `calc((100% - 16px) * ${(bottom - top) / 100})` }} />
				<span className="chd-knob" style={{ top: along(pos(value)) }} />
			</div>
			<span className="chd-fader-label">{label}</span>
		</div>
	);
}

/* ---------- Charts ---------- */

function BarChart({ values, labels, readout, height }) {
	const [hover, setHover] = useState(null);
	const max = Math.max(...values, 1);
	return (
		<div className="chd-bars-wrap">
			<p className="chd-readout">{hover === null ? ' ' : readout(hover, values[hover])}</p>
			<div className="chd-bars" style={{ height }} onMouseLeave={() => setHover(null)}>
				{values.map((v, i) => (
					<button key={i} type="button" className={hover === i ? 'is-hover' : ''} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onClick={() => setHover(i)} aria-label={readout(i, v)}>
						<i style={{ height: `${(v / max) * 100}%` }} />
					</button>
				))}
			</div>
			<div className="chd-bar-labels">
				{labels.map((l, i) => (
					<span key={i}>{l}</span>
				))}
			</div>
		</div>
	);
}

function LineChart({ values, labels }) {
	const W = 500;
	const H = 120;
	const y = (v) => H - 8 - ((v - 0.4) / 0.5) * (H - 16);
	const x = (i) => (values.length === 1 ? W / 2 : (i / (values.length - 1)) * (W - 20) + 10);
	const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
	const step = Math.ceil(labels.length / 7);
	return (
		<div className="chd-line">
			<svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Average volume by day, against a 75% line">
				<line x1="0" x2={W} y1={y(0.75)} y2={y(0.75)} className="chd-ref" vectorEffect="non-scaling-stroke" />
				<path d={d} className="chd-curve-line" vectorEffect="non-scaling-stroke" />
			</svg>
			<span className="chd-ref-label" style={{ top: `${(y(0.75) / H) * 100}%` }}>75%</span>
			<div className="chd-bar-labels">
				{labels.map((l, i) => (
					<span key={i}>{i % step === 0 ? l : ''}</span>
				))}
			</div>
		</div>
	);
}

function Ranked({ rows, share }) {
	const top = rows[0]?.seconds || 1;
	const total = rows.reduce((sum, r) => sum + r.seconds, 0) || 1;
	return (
		<ol className="chd-ranked">
			{rows.map((r) => (
				<li key={r.name}>
					<div>
						<span className="chd-ranked-name">{r.name}</span>
						{r.detail && <span className="chd-ranked-detail">{r.detail}</span>}
						<span className="chd-ranked-time">{share ? `${Math.round((r.seconds / total) * 100)}%` : duration(r.seconds)}</span>
					</div>
					<i style={{ width: `${(r.seconds / top) * 100}%` }} />
				</li>
			))}
		</ol>
	);
}

/* ---------- Pages ---------- */

function OverviewPage({ s, set, go, player, setPlayer, onPowerOff }) {
	const connected = s.devices.filter((d) => d.connected);
	return (
		<>
			<BatteryHero state={s} onPowerOff={onPowerOff} />
			<NowPlaying player={player} setPlayer={setPlayer} />
			<Card title="Sound mode">
				<ModeCards mode={s.mode} setMode={(mode) => set({ mode })} compact />
				<p className="chd-note">Tip: press ⌃⌥N to cycle modes. It works here too.</p>
			</Card>
			<div className="chd-split">
				<Card title="Devices">
					<ul className="chd-device-list">
						{connected.map((d) => (
							<li key={d.id}>
								<span className="chd-device-icon"><Icon name={d.kind} size={16} /></span>
								<span>
									<b>{d.name}</b>
									<i>{d.id === s.playing ? 'Now playing' : 'Connected'}</i>
								</span>
								{d.id === s.playing && <span className="chd-dot" />}
							</li>
						))}
					</ul>
					<button type="button" className="chd-link" onClick={() => go('Devices')}>Manage devices</button>
				</Card>
				<Card title="Equalizer">
					<Select label="Equalizer preset" value={s.preset} options={PRESETS.map((p) => p.name)} onChange={(name) => set(applyPreset(s, name))} />
					<EqCurve bands={s.bands} height={96} labels onChange={(i, v) => set(setBand(s, i, v))} />
					<div className="chd-row-foot">
						<span className="chd-note">Drag a point to shape the sound.</span>
						<button type="button" className="chd-link" onClick={() => go('Equalizer')}>More</button>
					</div>
				</Card>
			</div>
		</>
	);
}

function SoundPage({ s, set }) {
	return (
		<>
			<PageHeader title="Sound" subtitle="Noise cancelling and ambient sound" />
			<ModeCards mode={s.mode} setMode={(mode) => set({ mode })} />
			<Card title="Ambient sound">
				{s.mode === 'amb' ? (
					<>
						<Row title="Level" detail="How much of your surroundings you hear">
							<span className="chd-big-number">{s.ambient}</span>
						</Row>
						<input className="chd-range" type="range" min="1" max="20" value={s.ambient} aria-label="Ambient sound level" onChange={(e) => set({ ambient: Number(e.target.value) })} />
						<hr />
						<Row title="Focus on voice" detail="Lets voices through while reducing other noise">
							<Toggle label="Focus on voice" on={s.voice} onChange={(voice) => set({ voice })} />
						</Row>
					</>
				) : (
					<p className="chd-muted">Switch to Ambient Sound to adjust the level and focus on voice.</p>
				)}
			</Card>
			<Card title="Controls">
				<Row title="NC/AMB button" detail="What the button on the headphones cycles through">
					<Select label="NC/AMB button" value={s.ncButton} options={NC_BUTTON} onChange={(ncButton) => set({ ncButton })} />
				</Row>
				<hr />
				<Row title="Keyboard shortcut" detail="Cycles Noise Cancelling → Ambient → Off from any app">
					<kbd className="chd-kbd">⌃⌥N</kbd>
				</Row>
			</Card>
		</>
	);
}

function EqualizerPage({ s, set }) {
	return (
		<>
			<PageHeader title="Equalizer" subtitle="Presets and a 5-band EQ with Clear Bass" />
			<Card title="Preset">
				<div className="chd-presets">
					{PRESETS.map((p) => (
						<button key={p.name} type="button" className={s.preset === p.name ? 'is-on' : ''} aria-pressed={s.preset === p.name} onClick={() => set(applyPreset(s, p.name))}>
							{p.name}
						</button>
					))}
				</div>
			</Card>
			<Card title="Custom">
				<EqCurve bands={s.bands} height={110} />
				<div className="chd-faders">
					<Fader label="Clear Bass" value={s.clearBass} onChange={(clearBass) => set({ clearBass, preset: 'Manual' })} />
					<span className="chd-fader-rule" />
					{s.bands.map((v, i) => (
						<Fader key={BAND_LABELS[i]} label={BAND_LABELS[i]} value={v} onChange={(nv) => set(setBand(s, i, nv))} />
					))}
				</div>
				<div className="chd-row-foot">
					<span className="chd-note">Moving a fader switches the preset to Manual.</span>
					<button type="button" className="chd-btn" onClick={() => set({ bands: [0, 0, 0, 0, 0], clearBass: 0, preset: 'Manual' })}>Reset to Flat</button>
				</div>
			</Card>
		</>
	);
}

function ListeningPage({ s, set }) {
	const [days, setDays] = useState(7);
	const st = useMemo(() => statsFor(days, s.history), [days, s.history]);
	return (
		<>
			<PageHeader title="Listening" subtitle={`What you played and how loud, over the last ${days} days`}>
				<div className="chd-range-picker">
					{[7, 30].map((d) => (
						<button key={d} type="button" className={days === d ? 'is-on' : ''} aria-pressed={days === d} onClick={() => setDays(d)}>{d} days</button>
					))}
				</div>
			</PageHeader>
			{st.total < 1 ? (
				<Card title="Nothing recorded yet">
					<p className="chd-muted">While Connect Head is running it notes what plays in Music, Spotify and YouTube, and how loud your Mac sends it to the headphones. Play something and it will show up here.</p>
					<button type="button" className="chd-btn" onClick={() => set({ history: HISTORY })}>Bring back the sample history</button>
				</Card>
			) : (
				<>
					<div className="chd-stats">
						<section className="chd-card chd-stat">
							<h4 className="chd-kicker chd-kicker-bare">Listening time</h4>
							<p>{duration(st.total)}</p>
							<i>{duration(st.total / days)} a day on average</i>
						</section>
						<section className="chd-card chd-stat">
							<h4 className="chd-kicker chd-kicker-bare">Most played</h4>
							<p>{st.topArtists[0].name}</p>
							<i>{duration(st.topArtists[0].seconds)}</i>
						</section>
						<section className="chd-card chd-stat">
							<h4 className="chd-kicker chd-kicker-bare">Average volume</h4>
							<p>{Math.round(st.averageVolume * 100)}%</p>
							<i>{duration(st.loudSeconds)} above 75%</i>
						</section>
					</div>
					<Card title="Listening time by day">
						<BarChart values={st.perDay.map((d) => d.seconds)} labels={st.perDay.map((d) => d.label)} height={130} readout={(i, v) => `${st.perDay[i].long}: ${duration(v)}`} />
					</Card>
					<Card title="When you listen">
						<BarChart values={st.perHour} labels={st.perHour.map((_, h) => (h % 6 === 0 ? hourLabel(h) : ''))} height={90} readout={(i, v) => `${hourLabel(i)}–${hourLabel((i + 1) % 24)}: ${duration(v)}`} />
					</Card>
					<div className="chd-split">
						<Card title="Top artists"><Ranked rows={st.topArtists.slice(0, 5)} /></Card>
						<Card title="Top tracks"><Ranked rows={st.topTracks.slice(0, 5)} /></Card>
					</div>
					<Card title="Where it played"><Ranked rows={st.services} share /></Card>
					<Card title="Volume while listening">
						<LineChart values={st.perDayVolume} labels={st.perDay.map((d) => d.label)} />
						<p className="chd-note">A common guideline for long sessions is the 60/60 rule: under 60% volume, for about 60 minutes at a time.</p>
					</Card>
				</>
			)}
		</>
	);
}

function DevicesPage({ s, set }) {
	const update = (id, change) => set({ devices: s.devices.map((d) => (d.id === id ? { ...d, ...change } : d)) });
	return (
		<>
			<PageHeader title="Devices" subtitle="Phones and computers paired with your headphones" />
			{!s.multipoint && <p className="chd-muted">“Connect to 2 devices” is off, so only one device can be connected at a time. Turn it on in Settings.</p>}
			<Card>
				<ul className="chd-device-rows">
					{s.devices.map((d) => {
						const playing = d.id === s.playing;
						return (
							<li key={d.id} className={d.connected ? '' : 'is-off'}>
								<span className="chd-device-icon is-large"><Icon name={d.kind} size={17} /></span>
								<span className="chd-device-copy">
									<b>{d.name} {d.thisMac && <em className="chd-tag">This Mac</em>}</b>
									<i><span className="chd-small-dot" />{d.connected ? (playing ? 'Connected · playing audio' : 'Connected') : 'Not connected'}</i>
								</span>
								<span className="chd-device-actions">
									{d.connected ? (
										<>
											{playing ? (
												<span className="chd-playing"><span className="chd-dot" />Playing</span>
											) : (
												<button type="button" className="chd-btn" onClick={() => set({ playing: d.id })}>Play Here</button>
											)}
											{!d.thisMac && (
												<button type="button" className="chd-btn" onClick={() => set({ devices: s.devices.map((x) => (x.id === d.id ? { ...x, connected: false } : x)), playing: playing ? 'mac' : s.playing })}>Disconnect</button>
											)}
										</>
									) : (
										<button
											type="button"
											className="chd-btn is-solid"
											onClick={() =>
												s.multipoint ? update(d.id, { connected: true }) : set({ devices: s.devices.map((x) => (x.thisMac ? x : { ...x, connected: x.id === d.id })) })
											}
										>
											Connect
										</button>
									)}
								</span>
							</li>
						);
					})}
				</ul>
			</Card>
		</>
	);
}

function SettingsPage({ s, set, onPowerOff }) {
	const t = (key, title, detail) => (
		<Row title={title} detail={detail}>
			<Toggle label={title} on={s[key]} onChange={(v) => set({ [key]: v })} />
		</Row>
	);
	return (
		<>
			<PageHeader title="Settings" subtitle="Headphone and app preferences" />
			<Card title="Audio">
				{t('dsee', 'DSEE upsampling', 'Restores detail lost in compressed music')}
				{t('ldac', 'Prioritize sound quality', 'Prefer LDAC over a more stable connection')}
			</Card>
			<Card title="Connection">
				{t('multipoint', 'Connect to 2 devices', 'Stay connected to a phone and a computer at once')}
				{t('callVoice', 'Capture voice during calls', 'Picks up your voice more clearly on calls')}
			</Card>
			<Card title="Headphones">
				<Row title="Auto power off">
					<Select label="Auto power off" value={s.autoOff} options={AUTO_OFF} onChange={(autoOff) => set({ autoOff })} />
				</Row>
				<Row title="Voice assistant">
					<Select label="Voice assistant" value={s.assistant} options={ASSISTANTS} onChange={(assistant) => set({ assistant })} />
				</Row>
				{t('pause', 'Pause when taken off')}
				{t('guidance', 'Voice guidance', 'Spoken prompts for power, modes and battery')}
				<Row title="Power off headphones">
					<button type="button" className="chd-btn is-danger" onClick={onPowerOff}>Power Off…</button>
				</Row>
			</Card>
			<Card title="App">
				{t('login', 'Launch at login', 'Starts quietly in the menu bar')}
				{t('menuBar', 'Show in menu bar', 'Battery and quick controls in the menu bar')}
				<Row title="Listening history" detail="Kept on this Mac for 120 days, for the Listening page">
					<button type="button" className="chd-btn" onClick={() => set({ history: { sessions: [], volume: [] } })}>Clear History…</button>
				</Row>
			</Card>
		</>
	);
}

function applyPreset(s, name) {
	const preset = PRESETS.find((p) => p.name === name);
	return { preset: name, bands: preset.bands || s.bands, clearBass: name === 'Off' ? 0 : s.clearBass };
}

function setBand(s, i, v) {
	return { bands: s.bands.map((b, j) => (j === i ? v : b)), preset: 'Manual' };
}

/* ---------- The window ---------- */

const START = {
	battery: 57,
	mode: 'amb',
	ambient: 12,
	voice: true,
	ncButton: NC_BUTTON[0],
	preset: 'Manual',
	bands: [3, 1, -2, 2, 5],
	clearBass: 7,
	devices: START_DEVICES,
	playing: 'mac',
	dsee: true,
	ldac: true,
	multipoint: true,
	callVoice: true,
	autoOff: AUTO_OFF[0],
	assistant: ASSISTANTS[0],
	pause: true,
	guidance: true,
	login: true,
	menuBar: true,
	history: HISTORY,
};

// One running copy of the app. `device` picks the layout: the Mac window with
// its sidebar, or the Android app with its status bar and bottom tabs.
function ConnectHeadApp({ device, theme }) {
	const mac = device === 'mac';
	const [page, setPage] = useState('Overview');
	const [s, setS] = useState(START);
	const [link, setLink] = useState('connected'); // connected | confirm | off | connecting
	const [player, setPlayer] = useState({ index: 0, position: 96, playing: true });
	const [moreOpen, setMoreOpen] = useState(false);
	const scrollRef = useRef(null);

	const set = (change) => setS((prev) => ({ ...prev, ...change }));
	const go = (next) => {
		setPage(next);
		setMoreOpen(false);
		if (scrollRef.current) scrollRef.current.scrollTop = 0;
	};

	// The track plays on while the window is on screen.
	useEffect(() => {
		if (!player.playing || link !== 'connected') return undefined;
		const id = setInterval(() => {
			setPlayer((p) => {
				const track = TRACKS[p.index];
				return p.position + 1 >= track.duration ? { ...p, index: (p.index + 1) % TRACKS.length, position: 0 } : { ...p, position: p.position + 1 };
			});
		}, 1000);
		return () => clearInterval(id);
	}, [player.playing, link]);

	useEffect(() => {
		if (link !== 'connecting') return undefined;
		const id = setTimeout(() => setLink('connected'), 1400);
		return () => clearTimeout(id);
	}, [link]);

	const cycleMode = () => setS((prev) => ({ ...prev, mode: MODES[(MODES.findIndex((m) => m.id === prev.mode) + 1) % MODES.length].id }));

	const onKeyDown = (e) => {
		if (mac && e.ctrlKey && e.altKey && e.code === 'KeyN') {
			e.preventDefault();
			cycleMode();
		}
	};

	const ready = link === 'connected' || link === 'confirm';
	const pageProps = { s, set, go, player, setPlayer, onPowerOff: () => setLink('confirm') };
	const dialogId = `chd-dialog-title-${device}`;

	return (
		<div className={`chd is-${device}`} data-theme={theme} onKeyDown={onKeyDown} role="application" aria-label={`Connect Head for ${mac ? 'Mac' : 'Android'}, interactive prototype`}>
			{mac ? (
				<div className="chd-titlebar" aria-hidden="true">
					<span /><span /><span />
					<p>ULT WEAR</p>
				</div>
			) : (
				<div className="chd-statusbar" aria-hidden="true">
					<span>9:41</span>
					<span className="chd-statusbar-icons"><i /><i /><b /></span>
				</div>
			)}

			<div className="chd-body">
				{mac && (
					<nav className="chd-side" aria-label="Pages">
						<ul>
							{PAGES.map((p) => (
								<li key={p}>
									<button type="button" className={page === p ? 'is-on' : ''} aria-current={page === p ? 'page' : undefined} onClick={() => go(p)}>{p}</button>
								</li>
							))}
						</ul>
						<div className="chd-status">
							<p className="chd-status-line"><span className={`chd-dot ${ready ? '' : 'is-dim'}`} />{ready ? 'Connected' : link === 'connecting' ? 'Connecting' : 'Off'}</p>
							<p className="chd-status-name">ULT WEAR</p>
							<p className="chd-status-detail">{ready ? `${s.battery}% battery` : 'Headphones are off'}</p>
						</div>
					</nav>
				)}

				<div className="chd-main" ref={scrollRef} data-page={page}>
					<div className="chd-masthead">
						<div>
							<Wordmark />
							<p className="chd-edition">The ULT WEAR Edition</p>
						</div>
						<p className="chd-connected"><span className={`chd-dot ${ready ? '' : 'is-dim'}`} />{ready ? 'Connected' : 'Off'}</p>
					</div>

					{ready ? (
						<div className="chd-page" key={page}>
							{page === 'Overview' && <OverviewPage {...pageProps} />}
							{page === 'Sound' && <SoundPage {...pageProps} />}
							{page === 'Equalizer' && <EqualizerPage {...pageProps} />}
							{page === 'Listening' && <ListeningPage {...pageProps} />}
							{page === 'Devices' && <DevicesPage {...pageProps} />}
							{page === 'Settings' && <SettingsPage {...pageProps} />}
						</div>
					) : (
						<div className="chd-off">
							<div className={`chd-off-badge ${link === 'connecting' ? 'is-pulsing' : ''}`}><Icon name="nc" size={54} /></div>
							{link === 'connecting' ? (
								<p className="chd-off-title">Connecting to ULT WEAR…</p>
							) : (
								<>
									<p className="chd-off-title">Headphones are off</p>
									<p className="chd-muted">Press and hold the power button on the headphones for about 2 seconds. Connect Head reconnects as soon as they’re on.</p>
									<button type="button" className="chd-btn is-solid" onClick={() => setLink('connecting')}>Turn them back on</button>
								</>
							)}
						</div>
					)}
				</div>
			</div>

			{/* The Android app's tab bar, after the portfolio's own. */}
			{!mac && (
				<nav className="chd-tabs" aria-label="Pages">
					{PRIMARY.map((p) => (
						<button key={p} type="button" className={page === p ? 'is-on' : ''} onClick={() => go(p)}>
							<Icon name={PAGE_ICONS[p]} size={19} />
							<span>{p}</span>
						</button>
					))}
					<button type="button" className={!PRIMARY.includes(page) || moreOpen ? 'is-on' : ''} aria-expanded={moreOpen} onClick={() => setMoreOpen((o) => !o)}>
						<Icon name="more" size={19} />
						<span>More</span>
					</button>
					{moreOpen && (
						<div className="chd-more">
							{PAGES.filter((p) => !PRIMARY.includes(p)).map((p) => (
								<button key={p} type="button" onClick={() => go(p)}>
									<Icon name={PAGE_ICONS[p]} size={20} />
									<span>{p}</span>
								</button>
							))}
						</div>
					)}
				</nav>
			)}

			{link === 'confirm' && (
				<div className="chd-dialog-scrim">
					<div className="chd-dialog" role="alertdialog" aria-labelledby={dialogId}>
						<p id={dialogId} className="chd-dialog-title">Turn off ULT WEAR?</p>
						<p className="chd-muted">To turn them back on, press the power button on the headphones. Connect Head reconnects on its own.</p>
						<div className="chd-dialog-actions">
							<button type="button" className="chd-btn" onClick={() => setLink('connected')}>Cancel</button>
							<button type="button" className="chd-btn is-danger" onClick={() => setLink('off')}>Power Off</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// One app on its own raised stage: a "Live prototype" tag, a note and an
// appearance switch, then the app in a window that can pop out like the
// project videos.
function Stage({ device, tag, note, children }) {
	const [theme, setTheme] = useState('light');

	return (
		<section className={`chd-stage chd-stage-${device}`} aria-label={tag}>
			<p className="chd-stage-tag">
				<span className="chd-stage-pulse" aria-hidden="true" /> {tag}
			</p>
			<div className="chd-bar">
				<p className="chd-bar-note">{note}</p>
				<div className="chd-theme" role="group" aria-label="Appearance">
					{['light', 'dark'].map((t) => (
						<button key={t} type="button" className={theme === t ? 'is-on' : ''} aria-pressed={theme === t} onClick={() => setTheme(t)}>
							{t === 'light' ? 'Paper' : 'Black paper'}
						</button>
					))}
				</div>
			</div>
			{children(theme)}
		</section>
	);
}

// Both apps, each on its own stage. The Mac app needs a wide screen, so phones
// get the Android app only.
export default function ConnectHeadDemo() {
	return (
		<div className="chd-wrap" id="live-prototype">
			<Stage device="mac" tag="Live prototype · Mac app" note="Every control works, including the ⌃⌥N shortcut. Sample data; no headphones needed.">
				{(theme) => (
					<PrototypeWindow
						className="chd-mac-window"
						label="Mac app"
						title="Connect Head · Mac"
						storageKey="chd-pip-mac"
						download={{ label: 'Download', href: DOWNLOADS.mac }}
						inset="calc(2rem + 223px)"
						size={{ width: 880, height: 640 }}
						scale={0.5}
					>
						<ConnectHeadApp device="mac" theme={theme} />
					</PrototypeWindow>
				)}
			</Stage>

			<Stage device="android" tag="Live prototype · Android app" note="Every control works; More opens Devices and Settings. Sample data; no headphones needed.">
				{(theme) => (
					<PrototypeWindow
						className="chd-android-window"
						label="Android app"
						title="Android app"
						storageKey="chd-pip-android"
						download={{ label: 'Download', href: DOWNLOADS.android }}
						size={{ width: 380, height: 760 }}
						scale={0.58}
					>
						<ConnectHeadApp device="android" theme={theme} />
					</PrototypeWindow>
				)}
			</Stage>

			<p className="chd-caption">
				Working copies of the apps, rebuilt for the web from their own layouts. On a wide screen, pop either one out to keep it on screen while you read. Preset curves, devices and listening history are sample data.
			</p>
		</div>
	);
}
