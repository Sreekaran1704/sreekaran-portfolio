import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import {
	IoAdd,
	IoAlbumsOutline,
	IoArrowForward,
	IoBandageOutline,
	IoBookOutline,
	IoCameraOutline,
	IoCheckmark,
	IoCheckmarkCircle,
	IoChevronBack,
	IoClose,
	IoCloudOutline,
	IoColorPaletteOutline,
	IoCreate,
	IoCreateOutline,
	IoHappyOutline,
	IoHome,
	IoHomeOutline,
	IoImagesOutline,
	IoLibrary,
	IoLibraryOutline,
	IoLogoGoogle,
	IoMoonOutline,
	IoNotificationsOutline,
	IoSettings,
	IoSettingsOutline,
	IoShuffle,
	IoSparkles,
	IoStarOutline,
	IoSunnyOutline,
} from 'react-icons/io5';
import PrototypeWindow from './PrototypeWindow';

// A working copy of the LookBack Android app, ported screen by screen from its
// React Native source (src/app, src/components, src/theme), so it looks and
// behaves like the phone app. The memories are the app's own built-in sample
// set (src/dev/seed.ts) with its painted sample photos, so nothing here is
// personal. Motion is transforms and opacity, and stops for reduced motion.

const IMG = '/images/lookback';
const APK = 'https://github.com/Sreekaran1704/LookBack/releases/download/v1.0.0/LookBack-1.0.0.apk';
const TODAY = '2026-11-11';
/** The phone's screen in dp, the 20:9 Android phone the app was built on, and its bezel. */
const SCREEN = { w: 412, h: 915 };
const BEZEL = 6;
const DEVICE = { w: SCREEN.w + BEZEL * 2, h: SCREEN.h + BEZEL * 2 };
/** The phone's clock reads 9:41 am. */
const NOW_MINUTES = 9 * 60 + 41;

/* ---------- Theme (src/theme) ---------- */

const PAPERS = [
	{ name: 'cream', label: 'Cream', light: '#FBF5E6', dark: '#2A251E', dots: '#5B8CC9' },
	{ name: 'peach', label: 'Peach', light: '#FFE9E1', dark: '#3B2722', dots: '#F29A86' },
	{ name: 'rose', label: 'Rose', light: '#FCE4EC', dark: '#3A2030', dots: '#E57BA2' },
	{ name: 'lemon', label: 'Lemon', light: '#FBF3CC', dark: '#35301A', dots: '#D9A521' },
	{ name: 'mint', label: 'Mint', light: '#E2F5EA', dark: '#1D3429', dots: '#3FAF7C' },
	{ name: 'sky', label: 'Sky', light: '#E1EEFB', dark: '#1C2B3E', dots: '#4D8DD6' },
	{ name: 'lavender', label: 'Lavender', light: '#ECE6FA', dark: '#2A2440', dots: '#8B6FD9' },
];

const YEAR_PALETTES = [
	{ name: 'coral', primary: '#FF6B5E', secondary: '#FF8FC2', tint: '#FFE3DD', ink: '#5A1610' },
	{ name: 'teal', primary: '#13B5A4', secondary: '#38CDEB', tint: '#D7F5F1', ink: '#063F3A' },
	{ name: 'amber', primary: '#F5A30B', secondary: '#FB7E3C', tint: '#FFF0CF', ink: '#5A3600' },
	{ name: 'violet', primary: '#8B5CF6', secondary: '#6366F1', tint: '#ECE5FF', ink: '#2A1468' },
	{ name: 'lime', primary: '#7CC217', secondary: '#22C55E', tint: '#EAF8D2', ink: '#24400A' },
];
const STYLE_PALETTES = [
	...YEAR_PALETTES,
	{ name: 'rose', primary: '#F25C8E', secondary: '#FFB3CB', tint: '#FFE4EE', ink: '#5C1230' },
	{ name: 'sky', primary: '#3B8FE8', secondary: '#8CC8FF', tint: '#DFF0FF', ink: '#0E2F57' },
];
const yearPalette = (year) => YEAR_PALETTES[(((2025 - year) % 5) + 5) % 5];
const paletteByName = (name) => STYLE_PALETTES.find((p) => p.name === name) || null;

const withAlpha = (hex, a) => `${hex.slice(0, 7)}${Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0')}`;

const COMMON = {
	ruleLine: 'rgba(91, 140, 201, 0.32)',
	marginLine: 'rgba(232, 84, 84, 0.45)',
	ink: '#2A2118',
	inkMuted: '#7A6A58',
	inkFaint: 'rgba(42, 33, 24, 0.14)',
	amber: '#F5B23C',
	onAmber: '#3D2600',
	green: '#2DB86A',
	onGreen: '#FFFFFF',
	metal: '#9AA3AD',
	metalLight: '#D9DEE3',
	buddyEar: '#FFC4D0',
};
const LIGHT = {
	...COMMON,
	panel: '#FFFDF8',
	control: '#FFFDF8',
	primary: '#2A2118',
	onPrimary: '#FFFDF8',
	paper: '#FBF5E6',
	paperWhite: '#FFFDF8',
	blush: '#F8DDD3',
	onDesk: '#2A2118',
	onDeskMuted: '#7A6A58',
	onDeskFaint: '#B3A088',
	wood: '#B57A47',
	woodLight: '#D9A26A',
	woodDark: '#7E4E2B',
	woodDeep: '#5A341B',
	shadowBase: '#5B3E1F',
	scrim: 'rgba(42, 33, 24, 0.35)',
};
const DARK = {
	...COMMON,
	panel: '#EFE8D8',
	control: '#EFE8D8',
	primary: '#F5B23C',
	onPrimary: '#3D2600',
	paper: '#ECE2CA',
	paperWhite: '#EFE8D8',
	blush: '#E9CDC3',
	onDesk: '#F4ECD8',
	onDeskMuted: 'rgba(244, 236, 216, 0.68)',
	onDeskFaint: 'rgba(244, 236, 216, 0.45)',
	wood: '#9A6339',
	woodLight: '#BE8752',
	woodDark: '#653D20',
	woodDeep: '#3E2412',
	shadowBase: '#000000',
	scrim: 'rgba(0, 0, 0, 0.5)',
};

function paperShadow(tint, lift, dark) {
	const base = dark ? 0.6 : 0.24;
	return `${lift}px ${2 * lift}px ${lift}px ${withAlpha(tint, base)}, ${3 * lift}px ${8 * lift}px ${14 * lift}px ${withAlpha(tint, base * 0.6)}`;
}

function makeTheme(paperName, tone, width) {
	const paper = PAPERS.find((p) => p.name === paperName) || PAPERS[0];
	const dark = tone === 'dark';
	const colors = dark
		? { ...DARK, desk: paper.dark, gridLine: 'rgba(255, 255, 255, 0.09)' }
		: { ...LIGHT, desk: paper.light, gridLine: withAlpha(paper.dots, 0.32) };
	return {
		dark,
		lite: false,
		paper,
		colors,
		width,
		contentW: width - 40,
		shadow: (tint, lift = 1) => (dark ? paperShadow('#000000', lift, true) : paperShadow(tint || LIGHT.shadowBase, lift, false)),
	};
}

const ThemeContext = createContext(makeTheme('cream', 'light', 412));
const useTheme = () => useContext(ThemeContext);

/** Crowds of small objects (the year pile) draw without soft shadows, as LiteShadows does. */
function Lite({ children }) {
	const theme = useTheme();
	return <ThemeContext.Provider value={{ ...theme, lite: true, shadow: () => 'none' }}>{children}</ThemeContext.Provider>;
}

// Caveat everywhere, in the app's sizes: [size, line height, weight, letter spacing].
const TYPE = {
	title: [50, 54, 700],
	titleNarrow: [42, 46, 700],
	heading: [32, 36, 700],
	headline: [36, 40, 700],
	month: [40, 44, 700],
	label: [23, 27, 700],
	caption: [22, 26, 500],
	stamp: [18, 20, 700, 1.4],
	stampLarge: [28, 30, 700, 1.6],
	hand: [24, 28, 600],
	handSmall: [19, 22, 500],
	handLarge: [32, 36, 700],
	body: [22, 28, 500],
	ticket: [23, 26, 600],
	small: [19, 22, 500],
};
function ty(kind, extra) {
	const [size, line, weight, spacing = 0] = TYPE[kind];
	return { fontFamily: 'var(--lbd-hand)', fontSize: size, lineHeight: `${line}px`, fontWeight: weight, letterSpacing: spacing, ...extra };
}
const lineH = (kind) => TYPE[kind][1];
const clamp = (lines) => (lines ? { display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : null);

/* ---------- Dates (src/lib/dates) ---------- */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const parseDate = (d) => {
	const [year, month, day] = d.split('-').map(Number);
	return { year, month, day };
};
const pad2 = (n) => String(n).padStart(2, '0');
const formatDate = ({ year, month, day }) => `${year}-${pad2(month)}-${pad2(day)}`;
const daysInMonth = (year, month) => new Date(Date.UTC(year, month, 0)).getUTCDate();
function addDays(date, n) {
	const p = parseDate(date);
	const t = new Date(Date.UTC(p.year, p.month - 1, p.day + n));
	return formatDate({ year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate() });
}
function shiftYears(date, n) {
	const p = parseDate(date);
	const year = p.year + n;
	return formatDate({ year, month: p.month, day: Math.min(p.day, daysInMonth(year, p.month)) });
}
const displayDate = (d) => {
	const p = parseDate(d);
	return `${MONTHS[p.month - 1].slice(0, 3)} ${p.day}, ${p.year}`;
};
const monthDay = (d) => {
	const p = parseDate(d);
	return `${MONTHS[p.month - 1]} ${p.day}`;
};
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
function matchesOnThisDay(entryDate, today) {
	const e = parseDate(entryDate);
	const t = parseDate(today);
	if (e.year >= t.year) return false;
	if (e.month === t.month && e.day === t.day) return true;
	return e.month === 2 && e.day === 29 && t.month === 2 && t.day === 28 && !isLeap(t.year);
}
const onThisDay = (entries, today) => entries.filter((e) => matchesOnThisDay(e.localDate, today)).sort((a, b) => b.localDate.localeCompare(a.localDate));
const yearsBetween = (a, b) => parseDate(b).year - parseDate(a).year;
const yearsAgoLabel = (n) => (n === 1 ? 'One year ago today' : `${n} years ago today`);
function memoryKicker(entryDate, today) {
	if (entryDate === today) return 'Today';
	const years = yearsBetween(entryDate, today);
	if (matchesOnThisDay(entryDate, today)) return yearsAgoLabel(years);
	if (years <= 0) return 'Earlier this year';
	return years === 1 ? 'Last year' : `${years} years ago`;
}
function groupByYear(entries) {
	const map = new Map();
	entries.forEach((e) => {
		const y = parseDate(e.localDate).year;
		map.set(y, [...(map.get(y) || []), e]);
	});
	return [...map.entries()].sort(([a], [b]) => b - a).map(([year, list]) => ({ year, entries: list }));
}
function groupByMonth(entries) {
	const groups = [];
	[...entries]
		.sort((a, b) => a.localDate.localeCompare(b.localDate))
		.forEach((e) => {
			const { month } = parseDate(e.localDate);
			const last = groups[groups.length - 1];
			if (last && last.month === month) last.entries.push(e);
			else groups.push({ month, entries: [e] });
		});
	return groups;
}
function firstLine(text, max) {
	const line = text.trim().split(/\r?\n/)[0]?.trim() ?? '';
	return line.length > max ? `${line.slice(0, max - 1).trimEnd()}…` : line;
}
const diaryAgeLabel = (age) => (age <= 0 ? 'brand new' : age === 1 ? '1 year old' : `${age} years old`);

/* ---------- Seeded looks (src/lib/seeded) ---------- */

const OBJECT_TYPES = ['polaroid', 'tapedPhoto', 'tornNote', 'ticket'];
const TAPE_PATTERNS = ['stripes', 'dots', 'floral', 'grid', 'zigzag'];
const STICKERS = ['star', 'heart', 'sun', 'moon', 'smiley'];

function hashString(value) {
	let h = 0x811c9dc5;
	for (let i = 0; i < value.length; i++) {
		h ^= value.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return h >>> 0;
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
function seededRng(seed) {
	const next = mulberry32(hashString(seed));
	return {
		next,
		range: (min, max) => min + (max - min) * next(),
		pick: (items) => items[Math.floor(next() * items.length)],
		chance: (p) => next() < p,
	};
}

/** The scrapbook look of a memory: chosen style wins, the rest comes from its id. */
function lookForEntry(entry, maxTilt = 4, maxOffset = 10) {
	const rng = seededRng(entry.id);
	const hasPhoto = entry.photo != null;
	const trimmed = entry.text.trim();
	const short = trimmed.length <= 70;
	const quote = /^["“'‘]/.test(trimmed);
	const typeRoll = rng.next();
	const seededType = hasPhoto ? (typeRoll < 0.6 ? 'polaroid' : 'tapedPhoto') : short && typeRoll < (quote ? 0.85 : 0.2) ? 'ticket' : 'tornNote';
	const seededTape = rng.pick(TAPE_PATTERNS);
	const hasSticker = rng.chance(0.6);
	const seededSticker = rng.pick(STICKERS);
	const fastenerRoll = rng.next();
	const tilt = rng.range(-maxTilt, maxTilt);
	rng.range(-maxOffset, maxOffset);
	rng.range(-maxOffset / 2, maxOffset / 2);
	const tapeAngle = rng.range(-8, 8);
	const stickerCorner = rng.pick(['tl', 'tr', 'bl', 'br']);
	const stickerTilt = rng.range(-18, 18);
	const folded = rng.chance(0.4);
	const sizeJitter = rng.next();
	const pathSeed = Math.floor(rng.next() * 1_000_000);
	const fits = (type) => (type === 'polaroid' || type === 'tapedPhoto') === hasPhoto;
	const objectType = OBJECT_TYPES.includes(entry.objectType) && fits(entry.objectType) ? entry.objectType : seededType;
	const sticker = entry.sticker === 'none' ? null : STICKERS.includes(entry.sticker) ? entry.sticker : hasSticker ? seededSticker : null;
	const tapeChosen = TAPE_PATTERNS.includes(entry.tapePattern) || !!entry.tapeColor;
	let fastener;
	if (objectType === 'tapedPhoto' || tapeChosen) fastener = 'tape';
	else if (objectType === 'polaroid') fastener = fastenerRoll < 0.5 ? 'tape' : fastenerRoll < 0.75 ? 'clip' : 'pin';
	else if (objectType === 'tornNote') fastener = fastenerRoll < 0.4 ? 'pin' : fastenerRoll < 0.8 ? 'tape' : 'clip';
	else fastener = fastenerRoll < 0.7 ? 'tape' : 'pin';
	return {
		objectType,
		tapePattern: TAPE_PATTERNS.includes(entry.tapePattern) ? entry.tapePattern : seededTape,
		sticker,
		fastener,
		tilt,
		tapeAngle,
		stickerCorner,
		stickerTilt,
		folded: objectType === 'tornNote' && folded,
		sizeJitter,
		pathSeed,
	};
}

/* ---------- The app's sample memories (src/dev/seed.ts) ---------- */

const SHORT = [
	'Coffee on the balcony before anyone was awake.',
	'Finally fixed the squeaky door.',
	'Small steps still count.',
	'Long walk, no podcast. Just the wind.',
	'Tried the new noodle place. 9/10.',
	'First cold morning of the season.',
	'Rain all day. Baked bread.',
	'Sunset from the bridge was unreal.',
	'Today was ordinary, and that was nice.',
];
const QUOTES = ['"Be here now." — sticky note on my monitor', '"Done is better than perfect."', '"Go slow to go far." — Grandpa'];
const LONG = [
	'Called Grandma and she told the story about the summer the river froze and everyone skated to school. She laughed the whole time, and I wrote down as much as I could so I would not forget how she tells it.',
	'Got lost on the way home and found a tiny bookshop wedged between a bakery and a bike repair place. The owner recommended a book about lighthouses, and I ended up reading half of it on the bench outside.',
	'Big day at work: the thing we have been building for months finally shipped. Celebrated with tacos and a very long nap. Next week I want to remember to thank everyone properly.',
];
const textFor = (i) => (i % 7 === 3 ? LONG[i % 3] : i % 5 === 1 ? QUOTES[i % 3] : SHORT[i % SHORT.length]);

function sampleEntries() {
	const plan = [
		{ localDate: shiftYears(TODAY, -1), text: 'Picnic in the park with the whole crew.\nWe stayed until the lights came on.', photo: true },
		{ localDate: shiftYears(TODAY, -2), text: 'Moved into the new place. Boxes everywhere.', photo: false },
		{ localDate: shiftYears(TODAY, -3), text: '"Begin anywhere." — painted on the café wall', photo: false },
		{ localDate: shiftYears(TODAY, -4), text: 'Road trip, day one.', photo: true },
	];
	for (let i = 1; i <= 10; i++) plan.push({ localDate: shiftYears(addDays(TODAY, i), -1), text: textFor(i), photo: i % 3 === 0 });
	for (let i = 0; i < 48; i++) plan.push({ localDate: addDays(shiftYears(TODAY, -1), -(i * 27 + 5)), text: textFor(i + 2), photo: i % 4 === 0 });
	plan.push({ localDate: '2024-02-29', text: 'Leap day! An extra day, spent on pancakes.', photo: false });
	plan.push({ localDate: '2025-02-28', text: 'Regular Feb 28, should show next to the leap day entry.', photo: false });
	const seen = new Set();
	return plan
		.filter((item) => {
			if (seen.has(item.localDate) || item.localDate >= TODAY) return false;
			seen.add(item.localDate);
			return true;
		})
		.map((item) => ({
			id: `seed-${item.localDate}`,
			localDate: item.localDate,
			text: item.text,
			photo: item.photo ? hashString(item.localDate) : null,
			createdAt: item.localDate,
			objectType: null,
			tapePattern: null,
			sticker: null,
			stickerColor: null,
			tapeColor: null,
		}));
}
const SAMPLE = sampleEntries();
const TODAY_ID = `entry-${TODAY}`;

/* ---------- Small helpers ---------- */

function useSize() {
	const ref = useRef(null);
	const [size, setSize] = useState({ w: 0, h: 0 });
	useEffect(() => {
		const el = ref.current;
		if (!el || typeof ResizeObserver === 'undefined') return undefined;
		const observer = new ResizeObserver(() => {
			const w = el.offsetWidth;
			const h = el.offsetHeight;
			setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return [ref, size];
}

function useSvgId(prefix) {
	return `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
}

function useReducedMotion() {
	const [reduce, setReduce] = useState(false);
	useEffect(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		const apply = () => setReduce(query.matches);
		apply();
		query.addEventListener('change', apply);
		return () => query.removeEventListener('change', apply);
	}, []);
	return reduce;
}

/* ---------- Scrapbook pieces (src/components/scrapbook) ---------- */

const SKIES = [
	['#FF9A8B', '#FFD3A5', '#5B3A6E'],
	['#5EC8E5', '#C9F0FF', '#2E6B4F'],
	['#2B1B4F', '#F08A5D', '#1E2A3A'],
	['#A1C4FD', '#FDE2E4', '#4F7C5A'],
	['#FFB75E', '#FFF1C1', '#7A4B2A'],
];

/** The app's painted sample photo (src/dev/seedPhotos.ts): sky, sun and two rows of hills. */
function SeedPhoto({ seed }) {
	const id = useSvgId('sky');
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

function starPoints(cx, cy, outer, inner) {
	return Array.from({ length: 10 }, (_, i) => {
		const r = i % 2 === 0 ? outer : inner;
		const a = (Math.PI / 5) * i - Math.PI / 2;
		return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
	}).join(' ');
}
const HEART = 'M20 34 C 6 24, 4 14, 11 9 C 15 6, 19 8, 20 12 C 21 8, 25 6, 29 9 C 36 14, 34 24, 20 34 Z';
const MOON = 'M27 6 A 15 15 0 1 0 34 27 A 12 12 0 1 1 27 6 Z';

function StickerShape({ kind, color, color2 }) {
	const cut = { stroke: '#FFFFFF', strokeWidth: 6.4, strokeLinejoin: 'round' };
	switch (kind) {
		case 'star':
			return (
				<>
					<polygon points={starPoints(20, 21, 16, 7.5)} fill="#FFFFFF" {...cut} />
					<polygon points={starPoints(20, 21, 16, 7.5)} fill={color} />
					<polygon points={starPoints(18, 18, 5, 2.4)} fill="#FFFFFF" opacity={0.45} />
				</>
			);
		case 'heart':
			return (
				<>
					<path d={HEART} fill="#FFFFFF" {...cut} />
					<path d={HEART} fill={color} />
					<circle cx={14} cy={14} r={2.4} fill="#FFFFFF" opacity={0.5} />
				</>
			);
		case 'sun':
			return (
				<>
					<circle cx={20} cy={20} r={17} fill="#FFFFFF" />
					<g stroke={color2} strokeWidth={3} strokeLinecap="round">
						{Array.from({ length: 8 }, (_, i) => {
							const a = (Math.PI / 4) * i;
							return <path key={i} d={`M ${20 + Math.cos(a) * 11} ${20 + Math.sin(a) * 11} L ${20 + Math.cos(a) * 15.5} ${20 + Math.sin(a) * 15.5}`} />;
						})}
					</g>
					<circle cx={20} cy={20} r={8.5} fill={color} />
				</>
			);
		case 'moon':
			return (
				<>
					<path d={MOON} fill="#FFFFFF" {...cut} />
					<path d={MOON} fill={color} />
					<circle cx={16} cy={22} r={1.8} fill="#FFFFFF" opacity={0.4} />
				</>
			);
		default:
			return (
				<>
					<circle cx={20} cy={20} r={16} fill="#FFFFFF" />
					<circle cx={20} cy={20} r={13} fill={color} />
					<circle cx={15.5} cy={17} r={1.8} fill="#2A2118" />
					<circle cx={24.5} cy={17} r={1.8} fill="#2A2118" />
					<path d="M 14 23 Q 20 29 26 23" stroke="#2A2118" strokeWidth={2} fill="none" strokeLinecap="round" />
				</>
			);
	}
}

/** Die-cut sticker: soft shadow on light paper, a coloured glow by lamplight. */
function Sticker({ kind, size = 36, color, color2, style }) {
	const theme = useTheme();
	const filter = theme.lite ? undefined : theme.dark ? `drop-shadow(0 0 4px ${withAlpha(color, 0.85)})` : 'drop-shadow(1px 2px 1px rgba(91, 62, 31, 0.35))';
	return (
		<svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="lbd-sticker" style={{ filter, ...style }}>
			<StickerShape kind={kind} color={color} color2={color2 || color} />
		</svg>
	);
}

function tapeOutline(w, h) {
	const notch = 3.5;
	const steps = Math.max(3, Math.round(h / (notch * 2)));
	const step = h / steps;
	let d = `M ${notch} 0 L ${w - notch} 0`;
	for (let i = 1; i <= steps; i++) d += ` L ${i % 2 ? w : w - notch} ${i * step}`;
	d += ` L ${notch} ${h}`;
	for (let i = steps - 1; i >= 0; i--) d += ` L ${i % 2 ? 0 : notch} ${i * step}`;
	return `${d} Z`;
}

function TapeTile({ pattern, color2 }) {
	switch (pattern) {
		case 'stripes':
			return <rect x={0} y={0} width={6} height={12} fill={color2} />;
		case 'dots':
			return <circle cx={6} cy={6} r={2.2} fill={color2} />;
		case 'grid':
			return (
				<g stroke={color2} strokeWidth={1.2}>
					<line x1={0} y1={0} x2={12} y2={0} />
					<line x1={0} y1={0} x2={0} y2={12} />
				</g>
			);
		case 'zigzag':
			return <polyline points="0,8 3,4 6,8 9,4 12,8" stroke={color2} strokeWidth={1.6} fill="none" />;
		default:
			return (
				<g fill={color2}>
					{[0, 72, 144, 216, 288].map((a) => (
						<circle key={a} cx={6 + Math.cos((a * Math.PI) / 180) * 2.6} cy={6 + Math.sin((a * Math.PI) / 180) * 2.6} r={1.7} />
					))}
					<circle cx={6} cy={6} r={1.3} fill="#FFFFFF" />
				</g>
			);
	}
}

/** Translucent patterned washi tape with torn ends. */
function WashiTape({ width, height = 22, color, color2, pattern, angle = 0, style, className = '' }) {
	const theme = useTheme();
	const clipId = useSvgId('tc');
	const patId = useSvgId('tp');
	if (theme.lite) {
		return <span className={`lbd-abs ${className}`} style={{ width, height, background: color, opacity: 0.86, transform: `rotate(${angle}deg)`, ...style }} />;
	}
	return (
		<svg width={width} height={height} aria-hidden="true" className={`lbd-abs ${className}`} style={{ opacity: 0.86, transform: `rotate(${angle}deg)`, overflow: 'visible', ...style }}>
			<defs>
				<clipPath id={clipId}>
					<path d={tapeOutline(width, height)} />
				</clipPath>
				<pattern id={patId} width={12} height={12} patternUnits="userSpaceOnUse" patternTransform={`rotate(${pattern === 'stripes' ? 45 : 0})`}>
					<TapeTile pattern={pattern} color2={color2} />
				</pattern>
			</defs>
			<g clipPath={`url(#${clipId})`}>
				<rect width={width} height={height} fill={color} />
				<rect width={width} height={height} fill={`url(#${patId})`} opacity={0.7} />
				<rect width={width} height={height * 0.3} fill="rgba(255,255,255,0.25)" />
			</g>
		</svg>
	);
}

function PaperClip({ style }) {
	const d = 'M 7 40 L 7 9 A 5 5 0 0 1 17 9 L 17 36 A 3 3 0 0 1 11 36 L 11 12';
	return (
		<svg width={25.2} height={46} viewBox="0 0 24 46" aria-hidden="true" className="lbd-abs" style={style}>
			<path d={d} stroke="#9AA3AD" strokeWidth={2.6} fill="none" strokeLinecap="round" />
			<path d={d} stroke="#D9DEE3" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.9} />
		</svg>
	);
}

function Pin({ color, style }) {
	const theme = useTheme();
	return (
		<svg width={32.4} height={32.4} viewBox="0 0 36 36" aria-hidden="true" className="lbd-abs" style={style}>
			<ellipse cx={21} cy={23} rx={9} ry={6} fill={theme.dark ? 'rgba(0,0,0,0.5)' : 'rgba(91,62,31,0.25)'} />
			<path d="M 18 18 L 23 27" stroke="#9AA3AD" strokeWidth={1.6} strokeLinecap="round" />
			<circle cx={16} cy={15} r={9} fill={color} />
			<circle cx={13} cy={12} r={3} fill="#FFFFFF" opacity={0.55} />
		</svg>
	);
}

function DateStamp({ text, color, angle = -6, style }) {
	return (
		<span className="lbd-abs lbd-stampmark" style={{ transform: `rotate(${angle}deg)`, '--c': color, ...style }} aria-hidden="true">
			<span style={ty('stamp', { color, textTransform: 'uppercase', whiteSpace: 'nowrap' })}>{text}</span>
		</span>
	);
}

/** A note on lined or plain paper with a torn bottom edge and sometimes a folded corner. */
function TornNote({ width, text, paper, tint, seed, ruled = true, folded = false, numberOfLines, lift = 1 }) {
	const theme = useTheme();
	const { colors } = theme;
	const handwritten = text.length <= 110;
	const kind = handwritten ? 'hand' : 'body';
	const gap = lineH(kind);
	const edge = 10;
	const count = Math.ceil(width / 9) + 1;
	const next = mulberry32(seed);
	const offsets = Array.from({ length: count }, () => next() * edge);
	let edgePath = `M 0 0 L ${width} 0`;
	for (let i = count - 1; i >= 0; i--) edgePath += ` L ${Math.min(width, i * 9)} ${edge * 0.3 + offsets[i] * 0.7}`;
	const lines = ruled && !theme.lite;
	return (
		<div style={{ width }}>
			<div style={{ position: 'relative', background: paper, padding: '16px 16px 8px', boxShadow: theme.shadow(tint, lift) }}>
				{lines && (
					<span
						className="lbd-abs"
						aria-hidden="true"
						style={{
							inset: '13px 0 0 0',
							backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${gap - 1}px, ${colors.ruleLine} ${gap - 1}px ${gap}px)`,
						}}
					/>
				)}
				{lines && <span className="lbd-abs" aria-hidden="true" style={{ left: 25.6, top: 0, bottom: 0, width: 1, background: colors.marginLine }} />}
				<p style={ty(kind, { color: colors.ink, paddingLeft: ruled ? 16 : 0, position: 'relative', whiteSpace: 'pre-line', ...clamp(numberOfLines) })}>{text}</p>
				{folded && (
					<svg width={24} height={24} className="lbd-abs" style={{ right: 0, top: 0 }} aria-hidden="true">
						<path d="M 0 0 L 24 24 L 0 24 Z" fill={colors.paperWhite} />
						<path d="M 0 0 L 24 24 L 0 24 Z" fill={colors.inkFaint} />
						<path d="M 0 0 L 24 24" stroke={colors.inkFaint} strokeWidth={1} />
					</svg>
				)}
			</div>
			<svg width={width} height={edge} style={{ display: 'block', marginTop: -0.5 }} aria-hidden="true">
				<path d={`${edgePath} Z`} fill={paper} />
			</svg>
		</div>
	);
}

function Polaroid({ width, photo, caption, tint, develop, lift = 1 }) {
	const theme = useTheme();
	const inner = width - 20;
	return (
		<div style={{ width, background: theme.colors.paperWhite, padding: '10px 10px 0', borderRadius: 3, boxShadow: theme.shadow(tint, lift) }}>
			<div style={{ position: 'relative', width: inner, height: inner, background: theme.colors.inkFaint, overflow: 'hidden' }}>
				{photo != null && <SeedPhoto seed={photo} />}
				{develop && <span key={photo} className="lbd-abs lbd-develop" style={{ inset: 0, background: theme.colors.paperWhite }} />}
			</div>
			<div style={{ height: 46, display: 'flex', alignItems: 'center', padding: '0 4px' }}>
				{caption && <p style={ty('hand', { color: theme.colors.ink, transform: 'rotate(-2deg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })}>{caption}</p>}
			</div>
		</div>
	);
}

function TapedPhoto({ width, photo, tint, corners, lift = 1 }) {
	const theme = useTheme();
	const inner = width - 8;
	const corner = (rotation, pos) => (
		<svg width={18} height={18} className="lbd-abs" style={{ transform: `rotate(${rotation}deg)`, ...pos }} aria-hidden="true">
			<path d="M0 0 L18 0 L0 18 Z" fill={theme.colors.ink} opacity={0.85} />
		</svg>
	);
	return (
		<div style={{ position: 'relative', width, padding: 4, background: theme.colors.paperWhite, boxShadow: theme.shadow(tint, lift) }}>
			<div style={{ width: inner, height: inner * 1.25 }}>
				<SeedPhoto seed={photo} />
			</div>
			{corners && (
				<>
					{corner(0, { left: -2, top: -2 })}
					{corner(90, { right: -2, top: -2 })}
					{corner(180, { right: -2, bottom: -2 })}
					{corner(270, { left: -2, bottom: -2 })}
				</>
			)}
		</div>
	);
}

function ticketPath(w, h, n, perfX) {
	const r = 6;
	const cy = h / 2;
	return `M ${r} 0 L ${perfX - n} 0 A ${n} ${n} 0 0 0 ${perfX + n} 0 L ${w - r} 0 Q ${w} 0 ${w} ${r} L ${w} ${cy - n} A ${n} ${n} 0 0 0 ${w} ${cy + n} L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h} L ${perfX + n} ${h} A ${n} ${n} 0 0 0 ${perfX - n} ${h} L ${r} ${h} Q 0 ${h} 0 ${h - r} L 0 ${cy + n} A ${n} ${n} 0 0 0 0 ${cy - n} L 0 ${r} Q 0 0 ${r} 0 Z`;
}

/** Ticket stub for short quotes: perforated edge and punched notches. */
function TicketStub({ width, text, paper, accent, stubLabel, serial, lift = 1 }) {
	const theme = useTheme();
	const [ref, size] = useSize();
	const h = size.h || 110;
	const notch = 11;
	const stubW = width * 0.22;
	const compact = width < 230;
	const perfDots = Math.floor((h - notch * 2) / 8);
	return (
		<div ref={ref} style={{ position: 'relative', width, minHeight: 88, display: 'flex' }}>
			<span className="lbd-abs" style={{ left: notch, right: notch, top: notch / 2, bottom: 0, borderRadius: notch, boxShadow: theme.shadow(accent, lift) }} />
			<svg width={width} height={h} className="lbd-abs" style={{ left: 0, top: 0 }} aria-hidden="true">
				<path d={ticketPath(width, h, notch, stubW)} fill={theme.dark ? theme.colors.paper : paper} />
				<path d={ticketPath(width, h, notch, stubW)} fill="none" stroke={accent} strokeWidth={1.4} opacity={0.55} />
				{perfDots > 0 && (
					<line x1={stubW} x2={stubW} y1={notch + 4} y2={notch + 8 * (perfDots - 0.5)} stroke={accent} strokeWidth={3.2} strokeLinecap="round" strokeDasharray="0.01 8" opacity={0.6} />
				)}
				<line x1={stubW + 10} x2={width - 12} y1={h - 14} y2={h - 14} stroke={accent} strokeWidth={1} opacity={0.4} />
			</svg>
			<div style={{ position: 'relative', width: stubW, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<span style={ty('stamp', { color: accent, transform: 'rotate(-90deg)', whiteSpace: 'nowrap' })}>{stubLabel}</span>
			</div>
			<div style={{ position: 'relative', flex: 1, padding: '16px 16px 16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
				<span style={ty('small', { color: accent, letterSpacing: 1.2, whiteSpace: 'nowrap' })}>{compact ? `Nº ${serial}` : `ADMIT ONE · Nº ${serial}`}</span>
				<p style={ty(compact ? 'label' : 'ticket', { color: theme.colors.ink })}>{text}</p>
			</div>
		</div>
	);
}

/** A memory as a physical scrapbook object, with its fastener and sticker (ScrapObject.tsx). */
function ScrapObject({ entry, width, look: lookOverride, stamp = false, numberOfLines, lift = 1, develop = false, tapeFlicker = false, onPress, onPressTape, onPressSticker, label }) {
	const theme = useTheme();
	const { colors } = theme;
	const look = lookOverride || lookForEntry(entry);
	const year = parseDate(entry.localDate).year;
	const palette = yearPalette(year);
	const tapeP = paletteByName(entry.tapeColor) || palette;
	const stickerP = paletteByName(entry.stickerColor) || palette;
	const photo = entry.photo;
	const notePapers = [colors.paper, colors.paperWhite, colors.blush, palette.tint];
	const notePaper = notePapers[Math.floor(look.sizeJitter * notePapers.length)] || colors.paper;
	const photoNote = photo != null && entry.text.trim().length > 0 && (look.objectType === 'polaroid' || look.objectType === 'tapedPhoto');
	const caption = photoNote ? displayDate(entry.localDate) : firstLine(entry.text, 28) || displayDate(entry.localDate);

	let body = null;
	if (look.objectType === 'polaroid') body = <Polaroid width={width} photo={photo} caption={caption} tint={palette.primary} develop={develop} lift={lift} />;
	else if (look.objectType === 'tapedPhoto') body = photo != null ? <TapedPhoto width={width} photo={photo} tint={palette.primary} corners={look.sizeJitter > 0.5} lift={lift} /> : null;
	else if (look.objectType === 'ticket')
		body = <TicketStub width={width} text={entry.text} paper={palette.tint} accent={palette.primary} stubLabel={String(year)} serial={String(look.pathSeed % 10000).padStart(4, '0')} lift={lift} />;
	else
		body = (
			<TornNote
				width={width}
				text={entry.text}
				paper={notePaper}
				tint={palette.primary}
				seed={look.pathSeed}
				ruled={look.sizeJitter < 0.65}
				folded={look.folded}
				numberOfLines={numberOfLines}
				lift={lift}
			/>
		);

	const tapeWidth = Math.max(width * 0.42, 66);
	const corner = look.fastener !== 'tape' && look.stickerCorner === 'tl' ? 'tr' : look.stickerCorner;
	const stickerPos = {
		[corner[0] === 't' ? 'top' : 'bottom']: -12.6,
		[corner[1] === 'l' ? 'left' : 'right']: -10.8,
	};
	const noteW = width * 0.72;
	const stop = (fn) => (event) => {
		event.stopPropagation();
		fn();
	};

	const drawn = (
		<div className="lbd-scrap-inner" style={{ position: 'relative', width, transform: `rotate(${look.tilt}deg)` }}>
			{body}
			{photoNote && (
				<div style={{ position: 'relative', marginLeft: 'auto', width: noteW, marginTop: -width * 0.16, marginRight: -width * 0.12, transform: `rotate(${-look.tilt * 1.5 + 3}deg)` }}>
					<TornNote
						width={noteW}
						text={entry.text.trim()}
						paper={notePaper === colors.paperWhite ? colors.paper : notePaper}
						tint={palette.primary}
						seed={look.pathSeed + 7}
						ruled
						numberOfLines={numberOfLines ?? 4}
						lift={lift * 0.8}
					/>
					<WashiTape width={noteW * 0.4} color={tapeP.primary} color2={tapeP.secondary} pattern={look.tapePattern} angle={-look.tapeAngle - 10} style={{ top: -11, left: noteW * 0.08 }} />
				</div>
			)}
			{look.fastener === 'tape' ? (
				<WashiTape
					width={tapeWidth}
					color={tapeP.primary}
					color2={tapeP.secondary}
					pattern={look.tapePattern}
					angle={look.tapeAngle}
					className={tapeFlicker ? 'lbd-flicker' : ''}
					style={{ top: -11, left: (width - tapeWidth) / 2 }}
				/>
			) : look.fastener === 'clip' ? (
				<PaperClip style={{ top: -16, left: width * 0.16 }} />
			) : (
				<Pin color={palette.primary} style={{ top: -10.8, left: width / 2 - 18 }} />
			)}
			{look.sticker && <Sticker kind={look.sticker} color={stickerP.primary} color2={stickerP.secondary} style={{ position: 'absolute', ...stickerPos, transform: `rotate(${look.stickerTilt}deg)` }} />}
			{onPressTape && (
				<button type="button" className="lbd-abs lbd-hit" aria-label="Change the tape" onClick={stop(onPressTape)} style={{ top: -22, left: (width - tapeWidth) / 2 - 8, width: tapeWidth + 16, height: 44 }} />
			)}
			{onPressSticker && (
				<button type="button" className="lbd-abs lbd-hit" aria-label={look.sticker ? 'Change the sticker' : 'Add a sticker'} onClick={stop(onPressSticker)} style={{ ...stickerPos, width: 36, height: 36 }}>
					{!look.sticker && (
						<span className="lbd-add-sticker" style={{ borderColor: stickerP.primary, background: colors.paperWhite, color: stickerP.primary, ...ty('label') }}>
							+
						</span>
					)}
				</button>
			)}
			{stamp && <DateStamp text={displayDate(entry.localDate)} color={palette.primary} angle={-look.tilt * 2 - 6} style={{ right: 8, bottom: -16 }} />}
		</div>
	);
	if (!onPress) return drawn;
	return (
		<div
			role="button"
			tabIndex={0}
			className="lbd-press"
			aria-label={label || `Memory from ${displayDate(entry.localDate)}`}
			onClick={onPress}
			onKeyDown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					onPress();
				}
			}}
		>
			{drawn}
		</div>
	);
}

/** The bunny: a pre-rendered pose with its bow tinted in the year's colour (Buddy.tsx). */
function Buddy({ mood = 'happy', size = 96, accent, bump, entrance = true, style }) {
	const [seen, setSeen] = useState(bump);
	const [hops, setHops] = useState(0);
	if (bump !== seen) {
		setSeen(bump);
		setHops((h) => h + 1);
	}
	const height = mood === 'peek' ? size * 0.68 : size;
	return (
		<span className={`lbd-buddy ${entrance ? 'is-pop' : ''}`} style={{ width: size, height, ...style }} aria-hidden="true">
			<span key={hops} className={hops ? 'lbd-hop' : ''}>
				<span className={`lbd-bob lbd-bob-${mood}`} style={{ width: size, height }}>
					<img src={`${IMG}/buddy/${mood}.png`} alt="" draggable="false" style={{ width: size, height: size }} />
					<span className="lbd-bow" style={{ width: size, height: size, background: accent || '#F5B23C' }} />
				</span>
			</span>
		</span>
	);
}

function BuddySays({ text, mood = 'wave', accent, bump }) {
	const theme = useTheme();
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
			<Buddy mood={mood} accent={accent} bump={bump} />
			<div style={{ flex: 1, background: theme.colors.paperWhite, borderRadius: '14px 14px 14px 3px', padding: '12px 16px', boxShadow: theme.shadow(accent, 0.8), transform: 'rotate(-1deg)' }}>
				<p style={ty('caption', { color: theme.colors.ink })}>{text}</p>
			</div>
		</div>
	);
}

function doodlePath(kind, w, h, seed) {
	const r = mulberry32(seed);
	const j = (amount) => (r() - 0.5) * 2 * amount;
	if (kind === 'underline') {
		const y = h * 0.6;
		return `M 2 ${y + j(2)} C ${w * 0.3} ${y - h * 0.4 + j(2)}, ${w * 0.6} ${y + h * 0.4 + j(2)}, ${w - 2} ${y - h * 0.15 + j(2)}`;
	}
	if (kind === 'highlight') return `M 4 ${h * 0.62 + j(2)} Q ${w * 0.5} ${h * 0.5 + j(3)} ${w - 4} ${h * 0.58 + j(2)}`;
	const cx = w / 2;
	const cy = h / 2;
	const rx = w / 2 - 3;
	const ry = h / 2 - 3;
	return `M ${cx + rx * 0.9} ${cy - ry * 0.75} C ${cx + rx * 1.15} ${cy + ry * 0.4}, ${cx + rx * 0.3} ${cy + ry * 1.1}, ${cx - rx * 0.4} ${cy + ry * 0.95} C ${cx - rx * 1.15} ${cy + ry * 0.7}, ${cx - rx * 1.05} ${cy - ry * 0.85}, ${cx - rx * 0.1} ${cy - ry * 1.02} C ${cx + rx * 0.5} ${cy - ry * 1.1}, ${cx + rx * 0.95} ${cy - ry * 0.6}, ${cx + rx * 0.75 + j(2)} ${cy - ry * 0.2 + j(2)}`;
}

/** Hand-drawn marks: wavy underline, highlighter swipe, scribbled circle. */
function Doodle({ kind, width, height, color, seed = 1, style }) {
	if (width <= 0) return null;
	const highlight = kind === 'highlight';
	return (
		<svg width={width} height={height} className="lbd-abs" style={{ overflow: 'visible', ...style }} aria-hidden="true">
			<path d={doodlePath(kind, width, height, seed)} stroke={color} strokeWidth={highlight ? height * 0.55 : 3} strokeLinecap="round" strokeLinejoin="round" opacity={highlight ? 0.5 : 1} fill="none" />
		</svg>
	);
}

/* ---------- Screen furniture (Screen.tsx, Buttons.tsx, Pickers.tsx) ---------- */

/** Big handwritten title with a highlighter swipe, and a count circled in pen. */
function ScreenTitle({ title, count, accent }) {
	const theme = useTheme();
	const [titleRef, titleSize] = useSize();
	const [countRef, countSize] = useSize();
	const kind = theme.width < 400 ? 'titleNarrow' : 'title';
	const highlight = accent || theme.colors.amber;
	return (
		<div role="heading" aria-level={2} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
			<span style={{ position: 'relative', display: 'inline-block' }}>
				<Doodle kind="highlight" width={titleSize.w + 12} height={lineH(kind)} color={highlight} seed={title.length} style={{ left: -4, top: 4 }} />
				<span ref={titleRef} style={ty(kind, { color: theme.colors.onDesk, position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', paddingRight: 6 })}>
					{title}
				</span>
			</span>
			{count !== undefined && (
				<span style={{ position: 'relative', display: 'inline-block', padding: '0 7px' }}>
					<Doodle kind="circle" width={countSize.w + 14} height={lineH('hand') + 7} color={highlight} seed={String(count).length + 3} style={{ left: 0, top: -3.5 }} />
					<span ref={countRef} style={ty('hand', { color: theme.colors.onDeskMuted, padding: '0 7px', display: 'inline-block', whiteSpace: 'nowrap', position: 'relative' })}>
						{count}
					</span>
				</span>
			)}
		</div>
	);
}

function SectionHeader({ title, detail, accent }) {
	const theme = useTheme();
	const [ref, size] = useSize();
	return (
		<div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, marginBottom: 16 }}>
			<div>
				<h3 ref={ref} style={ty('heading', { color: theme.colors.onDesk, whiteSpace: 'nowrap', display: 'inline-block', paddingRight: 5 })}>
					{title}
				</h3>
				<div style={{ position: 'relative', height: 12 }}>
					<Doodle kind="underline" width={size.w} height={12} color={accent || theme.colors.amber} seed={title.length} style={{ left: 0, top: 0 }} />
				</div>
			</div>
			{detail && <span style={ty('hand', { color: theme.colors.onDeskMuted, flex: 1, textAlign: 'right', whiteSpace: 'nowrap' })}>{detail}</span>}
		</div>
	);
}

function PageFooter({ label }) {
	const theme = useTheme();
	return <p style={ty('handSmall', { color: theme.colors.onDeskFaint, textAlign: 'center', marginTop: 24 })}>~ {label} ~</p>;
}

function CircleButton({ icon: Icon, label, onClick, tint }) {
	const theme = useTheme();
	return (
		<button type="button" className="lbd-circle lbd-pressable" aria-label={label} onClick={onClick} style={{ background: theme.colors.control, boxShadow: theme.shadow(tint, 0.8) }}>
			<Icon size={22} color={theme.colors.ink} />
		</button>
	);
}

function PillButton({ label, icon: Icon, tone = 'paper', large = false, onClick, disabled, color, outline = false, grow = false, ariaLabel }) {
	const theme = useTheme();
	const { colors } = theme;
	const palette = color
		? outline
			? { bg: colors.paperWhite, fg: color }
			: { bg: color, fg: colors.paperWhite }
		: { paper: { bg: colors.control, fg: colors.ink }, dark: { bg: colors.primary, fg: colors.onPrimary }, green: { bg: colors.green, fg: colors.onGreen } }[tone];
	const style = {
		minHeight: large ? 54 : 46,
		background: palette.bg,
		color: palette.fg,
		boxShadow: theme.shadow(color || (tone === 'paper' || tone === 'dark' ? undefined : palette.bg), 0.8),
		alignSelf: grow ? undefined : large ? 'stretch' : 'flex-start',
		flex: grow ? 1 : undefined,
		padding: grow ? '0 12px' : '0 20px',
		border: color ? `${outline ? 2 : 3}px ${outline ? 'dashed' : 'solid'} ${outline ? color : colors.paperWhite}` : 0,
	};
	return (
		<button type="button" className="lbd-pill lbd-pressable" onClick={onClick} disabled={disabled} aria-label={ariaLabel} style={style}>
			{Icon && <Icon size={large ? 22 : 18} />}
			<span style={ty('label', { whiteSpace: 'nowrap' })}>{label}</span>
		</button>
	);
}

/** A paper track with a coloured tab that slides to the chosen side. */
function SlidingToggle({ options, value, onChange, accent, label }) {
	const theme = useTheme();
	const index = options.findIndex((o) => o.value === value);
	return (
		<div className="lbd-toggle" role="radiogroup" aria-label={label} style={{ background: theme.colors.paperWhite, boxShadow: theme.shadow(undefined, 0.6) }}>
			{index >= 0 && <span className="lbd-toggle-tab" style={{ width: `calc((100% - 8px) / ${options.length})`, transform: `translateX(${index * 100}%)`, background: accent || theme.colors.primary }} />}
			{options.map((o) => {
				const on = o.value === value;
				const Icon = o.icon;
				return (
					<button key={o.value} type="button" role="radio" aria-checked={on} onClick={() => onChange(o.value)} style={{ color: on ? theme.colors.paperWhite : theme.colors.inkMuted }}>
						{Icon && <Icon size={18} />}
						<span style={ty('label', { whiteSpace: 'nowrap' })}>{o.label}</span>
					</button>
				);
			})}
		</div>
	);
}

/** A paper card stuck to the page: a little crooked, taped down, with a sticker in a corner. */
function Panel({ seed, accent, accent2, children }) {
	const theme = useTheme();
	const [ref, size] = useSize();
	const rng = seededRng(`panel-${seed}`);
	const tilt = rng.range(-1.2, 1.2);
	const tapeAngle = rng.range(-7, 7);
	const tapeAt = rng.range(0.2, 0.55);
	const pattern = rng.pick(TAPE_PATTERNS);
	const sticker = rng.pick(STICKERS);
	const stickerTilt = rng.range(-18, 18);
	const tapeW = Math.max(size.w * 0.28, 66);
	return (
		<section ref={ref} style={{ position: 'relative', background: theme.colors.panel, borderRadius: 6, padding: '16px 20px 12px', boxShadow: theme.shadow(undefined, 1), transform: `rotate(${tilt}deg)` }}>
			{children}
			{size.w > 0 && <WashiTape width={tapeW} color={accent} color2={accent2} pattern={pattern} angle={tapeAngle} style={{ top: -11, left: (size.w - tapeW) * tapeAt }} />}
			<Sticker kind={sticker} size={30} color={accent2} color2={accent} style={{ position: 'absolute', right: -9, bottom: -9, transform: `rotate(${stickerTilt}deg)` }} />
		</section>
	);
}

/* ---------- Home: letters from your past self (MemoryLetters.tsx) ---------- */

function Letter({ entry, width, open, onToggle, onOpen, isFront, wasDragged }) {
	const theme = useTheme();
	const { colors } = theme;
	const year = parseDate(entry.localDate).year;
	const palette = yearPalette(year);
	const rng = seededRng(`letter-${entry.id}`);
	const tilt = rng.range(-1.5, 1.5);
	const seal = rng.pick(STICKERS);
	const stampTilt = rng.range(-8, 8);
	const height = width * 0.64;
	const rise = height * 0.62;
	const flapH = height * 0.56;
	const letterW = width * 0.84;
	const flapPath = `M 0 0 L ${width} 0 L ${width / 2 + 6} ${flapH - 6} Q ${width / 2} ${flapH} ${width / 2 - 6} ${flapH - 6} Z`;

	return (
		<div className={`lbd-env ${open ? 'is-open' : ''}`} style={{ width, height: rise + height, transform: `rotate(${tilt}deg)` }}>
			<div className="lbd-abs" style={{ top: rise, left: 0, width, height }}>
				<span className="lbd-abs" style={{ inset: 0, zIndex: -1, borderRadius: 10, boxShadow: theme.shadow(palette.primary, 1.2) }} />
				<span className="lbd-abs" style={{ inset: 0, background: palette.secondary, borderRadius: 10 }} />
				<svg className="lbd-abs lbd-env-flap-open" width={width} height={flapH} style={{ top: -flapH, left: 0 }} aria-hidden="true">
					<g transform={`translate(0 ${flapH}) scale(1 -1)`}>
						<path d={flapPath} fill={colors.paperWhite} stroke={palette.primary} strokeWidth={1.5} strokeLinejoin="round" />
					</g>
				</svg>
				<div className="lbd-abs" style={{ top: -rise, left: 0, right: 0, height: rise + height - 10, overflow: 'hidden', pointerEvents: 'none' }}>
					<div className="lbd-abs lbd-env-letter" style={{ top: 14, left: (width - letterW) / 2, '--rise': `${rise}px`, pointerEvents: open ? 'auto' : 'none' }}>
						<ScrapObject entry={entry} width={letterW} numberOfLines={4} onPress={() => onOpen(entry)} />
					</div>
				</div>
				<div className="lbd-abs" style={{ top: height * 0.42, left: 0, right: 0, bottom: 0, borderRadius: '0 0 10px 10px', overflow: 'hidden', background: palette.tint }}>
					<svg width={width} height={height * 0.58} aria-hidden="true" style={{ display: 'block' }}>
						<path d={`M 0 ${height * 0.58} L ${width / 2} ${height * 0.1} L ${width} ${height * 0.58}`} stroke={palette.primary} strokeWidth={1.5} fill="none" opacity={0.35} />
					</svg>
					<span className={`lbd-abs ${isFront ? '' : 'lbd-hide'}`} style={{ left: 16, right: 68, bottom: 8 }}>
						<span style={ty('handSmall', { color: colors.inkMuted, display: 'block', whiteSpace: 'nowrap' })}>to: me, today</span>
						<span style={ty('hand', { color: colors.ink, display: 'block', whiteSpace: 'nowrap' })}>from: past me</span>
					</span>
					<span className="lbd-abs lbd-center" style={{ right: 12, bottom: 12, width: 44, height: 50.6, background: colors.paperWhite, border: `2px dashed ${palette.primary}`, transform: `rotate(${stampTilt}deg)` }}>
						<span style={ty('stamp', { color: palette.primary, letterSpacing: 0 })}>{year}</span>
					</span>
				</div>
				<span className="lbd-abs lbd-env-closed" style={{ top: 0, left: 0, right: 0, height: height * 0.42 + 1, background: palette.tint, borderRadius: '10px 10px 0 0' }} />
				<svg className="lbd-abs lbd-env-flap" width={width} height={flapH} style={{ top: 0, left: 0 }} aria-hidden="true">
					<path d={flapPath} fill={colors.paperWhite} stroke={palette.primary} strokeWidth={1.5} strokeLinejoin="round" />
				</svg>
				<span className="lbd-abs lbd-env-closed" style={{ top: flapH - 24, left: (width - 40) / 2 }}>
					<Sticker kind={seal} size={40} color={palette.primary} color2={palette.secondary} />
				</span>
				<button
					type="button"
					className="lbd-abs lbd-hit"
					tabIndex={isFront ? 0 : -1}
					style={{ top: open ? height * 0.42 : 0, bottom: 0, left: 0, right: 0 }}
					onClick={() => !wasDragged() && onToggle()}
					aria-label={open ? `Put the ${year} letter away` : `Open the letter from ${year}`}
				/>
			</div>
		</div>
	);
}

function LetterDeck({ entries, onOpen, reduceMotion }) {
	const theme = useTheme();
	const { colors } = theme;
	const width = theme.contentW * 0.8;
	const height = width * 0.64;
	const rise = height * 0.62;
	const [order, setOrder] = useState(() => entries.map((_, i) => i));
	const [openId, setOpenId] = useState(null);
	const [drag, setDrag] = useState({ x: 0, active: false, fly: false });
	const [returning, setReturning] = useState(null);
	const pointer = useRef(null);
	const dragged = useRef(false);
	const front = order[0];
	const frontEntry = entries[front];

	const cycle = (to) => {
		setOpenId(null);
		const done = () => {
			setOrder((o) => [...o.slice(1), o[0]]);
			setDrag({ x: 0, active: false, fly: false });
			if (reduceMotion) return;
			setReturning({ index: front, x: to });
			requestAnimationFrame(() => requestAnimationFrame(() => setReturning(null)));
		};
		if (reduceMotion) return done();
		setDrag({ x: to, active: false, fly: true });
		setTimeout(done, 200);
		return undefined;
	};
	const bringToFront = (index) => {
		if (index === front) return;
		setOpenId(null);
		setOrder((o) => {
			const at = o.indexOf(index);
			return [...o.slice(at), ...o.slice(0, at)];
		});
	};

	const onPointerDown = (event) => {
		if (event.button !== 0 || drag.fly) return;
		pointer.current = { x: event.clientX, y: event.clientY, t: event.timeStamp, id: event.pointerId, active: false };
		dragged.current = false;
	};
	const onPointerMove = (event) => {
		const p = pointer.current;
		if (!p) return;
		const mx = event.clientX - p.x;
		const my = event.clientY - p.y;
		if (!p.active) {
			if (Math.abs(my) > 14 && Math.abs(my) > Math.abs(mx)) {
				pointer.current = null;
				return;
			}
			if (Math.abs(mx) < 12) return;
			p.active = true;
			dragged.current = true;
			try {
				event.currentTarget.setPointerCapture(p.id);
			} catch {
				// The drag still works while the pointer stays on the deck.
			}
		}
		setDrag({ x: mx, active: true, fly: false });
	};
	const onPointerUp = (event) => {
		const p = pointer.current;
		pointer.current = null;
		if (!p?.active) return;
		const mx = event.clientX - p.x;
		const velocity = (mx / Math.max(1, event.timeStamp - p.t)) * 1000;
		if (Math.abs(mx) > width * 0.26 || Math.abs(velocity) > 850) cycle((mx + velocity * 0.1 >= 0 ? 1 : -1) * width * 1.15);
		else setDrag({ x: 0, active: false, fly: false });
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
			<div style={{ position: 'relative', width, height: rise + height + 24 }}>
				<div className="lbd-abs" style={{ left: 0, right: 0, top: 0, height: rise, display: 'flex', alignItems: 'flex-end', gap: 8, pointerEvents: 'none' }}>
					<Buddy mood="wave" accent={yearPalette(parseDate(frontEntry.localDate).year).primary} size={Math.min(96, rise)} style={{ marginBottom: -8 }} />
					<p style={ty('handSmall', { color: colors.onDeskMuted, flex: 1, paddingBottom: 12 })}>{`psst… ${entries.length} letters from your past self! Swipe to shuffle, tap to open.`}</p>
				</div>
				<div className="lbd-abs lbd-deck" style={{ inset: 0 }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
					{entries.map((entry, index) => {
						const s = order.indexOf(index);
						const side = s % 2 === 0 ? 1 : -1;
						const isFront = s === 0;
						const dx = isFront ? drag.x : 0;
						const back = returning?.index === index ? returning.x : 0;
						const transform = `translateX(${dx + back + s * 9 * side}px) translateY(${s * 12}px) rotate(${dx / 16 + s * 3.5 * side}deg) scale(${1 - s * 0.045})`;
						const still = (isFront && drag.active) || returning?.index === index;
						return (
							<div
								key={entry.id}
								className={`lbd-abs lbd-deck-card ${still ? 'is-still' : ''} ${isFront && drag.fly ? 'is-flying' : ''}`}
								style={{ inset: 0, transform, zIndex: entries.length - s, opacity: s > 2.5 ? 0 : 1, pointerEvents: isFront ? 'auto' : 'none' }}
								aria-hidden={!isFront}
							>
								<Letter
									entry={entry}
									width={width}
									open={openId === entry.id}
									isFront={isFront}
									onToggle={() => setOpenId((o) => (o === entry.id ? null : entry.id))}
									onOpen={onOpen}
									wasDragged={() => dragged.current}
								/>
							</div>
						);
					})}
				</div>
			</div>
			<p style={ty('handLarge', { color: colors.onDesk, textAlign: 'center', alignSelf: 'stretch' })}>{yearsAgoLabel(yearsBetween(frontEntry.localDate, TODAY))}</p>
			<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }} role="group" aria-label="Letters by year">
				{entries.map((entry, index) => {
					const year = parseDate(entry.localDate).year;
					const palette = yearPalette(year);
					const on = index === front;
					return (
						<button
							key={entry.id}
							type="button"
							className="lbd-center lbd-yearstamp"
							aria-pressed={on}
							aria-label={`Letter from ${year}`}
							onClick={() => bringToFront(index)}
							style={{
								background: on ? palette.primary : colors.paperWhite,
								border: `2px dashed ${on ? colors.paperWhite : palette.primary}`,
								boxShadow: theme.shadow(palette.primary, on ? 1.2 : 0.5),
								transform: on ? 'rotate(-6deg) translateY(-4px) scale(1.1)' : 'none',
							}}
						>
							<span style={ty('stamp', { color: on ? colors.paperWhite : palette.primary, letterSpacing: 0 })}>{year}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}

/* ---------- Years: the cupboard (Cupboard.tsx, BookSpine.tsx) ---------- */

const spineSize = (year, maxHeight) => {
	const rng = seededRng(`spine-${year}`);
	return { width: Math.round(rng.range(52, 62)), height: Math.round(maxHeight * rng.range(0.84, 1)) };
};

function BookSpine({ year, count, age, onPress, hidden, maxHeight = 190 }) {
	const theme = useTheme();
	const { colors } = theme;
	const palette = yearPalette(year);
	const roundId = useSvgId('round');
	const { width: w, height: h } = spineSize(year, maxHeight);
	const wear = Math.min(Math.max(age, 0), 6);
	const rng = seededRng(`spine-wear-${year}`);
	const scuffs = Array.from({ length: wear >= 2 ? wear + 1 : 0 }, () => ({ x: rng.range(6, w - 10), y: rng.range(10, h - 12), len: rng.range(4, 10) }));
	const bandY = [h * 0.07, h * 0.93];
	const faceY = h * 0.74;
	const labelH = h * 0.5;
	const cx = w / 2;
	const mood = wear === 0 ? 'awake' : wear < 3 ? 'content' : 'dozing';
	const art = (
		<span className="lbd-spine-art" style={{ width: w, height: h }}>
			{age <= 0 && <span className="lbd-abs" style={{ left: w * 0.62, top: -10, width: 7, height: 18, background: palette.secondary, borderRadius: '2px 2px 0 0' }} />}
			<span className="lbd-abs" style={{ inset: 0, borderRadius: 6, background: palette.primary, border: `1.2px solid ${withAlpha(palette.ink, 0.6)}`, overflow: 'hidden' }}>
				<svg width={w} height={h} className="lbd-abs" style={{ left: -1.2, top: -1.2 }} aria-hidden="true">
					<defs>
						<linearGradient id={roundId} x1="0" y1="0" x2="1" y2="0">
							<stop offset="0" stopColor="#000" stopOpacity={0.32} />
							<stop offset="0.3" stopColor="#fff" stopOpacity={0.18} />
							<stop offset="0.5" stopColor="#fff" stopOpacity={0.05} />
							<stop offset="1" stopColor="#000" stopOpacity={0.38} />
						</linearGradient>
					</defs>
					{bandY.map((y) => (
						<rect key={y} x={0} y={y - 4} width={w} height={8} fill={withAlpha(palette.ink, 0.35)} />
					))}
					{bandY.map((y) => (
						<rect key={`g${y}`} x={0} y={y - 0.75} width={w} height={1.5} fill={colors.amber} opacity={0.9} />
					))}
					<rect width={w} height={h} fill={colors.paper} opacity={wear * 0.07} />
					{scuffs.map((s) => (
						<path key={`${s.x}-${s.y}`} d={`M ${s.x} ${s.y} l ${s.len} ${s.len * 0.3}`} stroke="#fff" strokeWidth={1.2} opacity={0.4} strokeLinecap="round" />
					))}
					<rect width={w} height={h} fill={`url(#${roundId})`} />
					<circle cx={cx - 10} cy={faceY + 5} r={3.4} fill="#fff" opacity={0.3} />
					<circle cx={cx + 10} cy={faceY + 5} r={3.4} fill="#fff" opacity={0.3} />
					{mood === 'awake' ? (
						<>
							<circle cx={cx - 6} cy={faceY} r={2.4} fill={palette.ink} />
							<circle cx={cx + 6} cy={faceY} r={2.4} fill={palette.ink} />
							<circle cx={cx - 6.8} cy={faceY - 0.8} r={0.8} fill="#fff" />
							<circle cx={cx + 5.2} cy={faceY - 0.8} r={0.8} fill="#fff" />
						</>
					) : (
						<path
							d={mood === 'content' ? `M ${cx - 9} ${faceY + 1} q 3 -4 6 0 M ${cx + 3} ${faceY + 1} q 3 -4 6 0` : `M ${cx - 9} ${faceY - 1} q 3 3.5 6 0 M ${cx + 3} ${faceY - 1} q 3 3.5 6 0`}
							stroke={palette.ink}
							strokeWidth={1.6}
							strokeLinecap="round"
							fill="none"
						/>
					)}
					<path d={mood === 'dozing' ? `M ${cx - 2} ${faceY + 6} q 2 1.4 4 0` : `M ${cx - 3} ${faceY + 4.5} q 3 3.2 6 0`} stroke={palette.ink} strokeWidth={1.5} strokeLinecap="round" fill="none" />
				</svg>
				<span className="lbd-abs lbd-center" style={{ top: h * 0.13, left: w * 0.16, width: w * 0.68, height: labelH, background: colors.paperWhite, borderRadius: 6, border: `1px solid ${withAlpha(palette.ink, 0.35)}`, overflow: 'hidden' }}>
					<span style={ty('stampLarge', { color: palette.ink, transform: 'rotate(-90deg)', whiteSpace: 'nowrap', letterSpacing: 1 })}>{year}</span>
				</span>
				<span className="lbd-abs" style={ty('stamp', { left: 0, right: 0, bottom: h * 0.1, color: colors.paperWhite, textAlign: 'center', letterSpacing: 0 })}>
					{count}
				</span>
			</span>
		</span>
	);
	if (!onPress) return art;
	return (
		<button
			type="button"
			className="lbd-spine"
			style={{ opacity: hidden ? 0 : 1 }}
			onClick={(event) => onPress(event.currentTarget)}
			aria-label={`${year} diary, ${diaryAgeLabel(age)}, ${count} ${count === 1 ? 'memory' : 'memories'}`}
		>
			{art}
		</button>
	);
}

/** The wooden cupboard: oldest diary on the left, the bunny as a bookend (YearsCupboard.tsx). */
function YearsCupboard({ entries, onOpenYear, flying }) {
	const theme = useTheme();
	const { colors } = theme;
	const width = theme.contentW;
	const [ref, size] = useSize();
	const panelId = useSvgId('panel');
	const shadeId = useSvgId('shade');
	const years = groupByYear(entries);
	const thisYear = yearPalette(parseDate(TODAY).year);
	if (years.length === 0) return <p style={ty('caption', { color: colors.onDeskMuted })}>Nothing here yet. Add today&apos;s moment.</p>;

	const shelfW = width - 28 - 24;
	const shelves = [[]];
	let used = 0;
	[...years].reverse().forEach((group) => {
		const w = spineSize(group.year, 190).width + 3;
		if (used + w > shelfW - 64 && shelves[shelves.length - 1].length > 0) {
			shelves.push([]);
			used = 0;
		}
		shelves[shelves.length - 1].push(group);
		used += w;
	});

	const height = size.h;
	const innerW = width - 28;
	const grain = [];
	if (height > 0) {
		const rng = seededRng('cupboard-grain');
		const plankW = innerW / 4;
		for (let p = 0; p < 4; p++) {
			for (let k = 0; k < 3; k++) {
				const x = 14 + p * plankW + plankW * (0.2 + k * 0.3) + rng.range(-4, 4);
				let d = `M ${x} 20`;
				for (let y = 20; y < height; y += 40) d += ` Q ${x + rng.range(-5, 5)} ${y + 20} ${x + rng.range(-2, 2)} ${y + 40}`;
				grain.push(d);
			}
		}
	}

	return (
		<div style={{ position: 'relative', width, paddingBottom: 12 }}>
			{height > 0 && (
				<div className="lbd-abs" style={{ inset: 0, pointerEvents: 'none' }} aria-hidden="true">
					{[16, width - 16 - 26].map((x) => (
						<span key={x} className="lbd-abs" style={{ left: x, top: height - 2, width: 26, height: 14, background: colors.woodDark, borderRadius: '0 0 10px 10px' }} />
					))}
					<span className="lbd-abs" style={{ left: 0, top: 0, width, height, borderRadius: 10, background: colors.wood, border: `1.5px solid ${colors.woodDeep}`, boxShadow: theme.shadow(colors.woodDeep, 1.6) }} />
					<svg width={width} height={height} className="lbd-abs" style={{ left: 0, top: 0 }}>
						<defs>
							<linearGradient id={panelId} x1="0" y1="0" x2="1" y2="0">
								<stop offset="0" stopColor={colors.woodDeep} />
								<stop offset="0.5" stopColor={colors.woodDark} />
								<stop offset="1" stopColor={colors.woodDeep} />
							</linearGradient>
							<linearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
								<stop offset="0" stopColor="#000" stopOpacity={0.35} />
								<stop offset="0.35" stopColor="#000" stopOpacity={0} />
							</linearGradient>
						</defs>
						<rect x={14} y={20} width={innerW} height={height - 34} fill={`url(#${panelId})`} />
						{[1, 2, 3].map((p) => (
							<rect key={p} x={14 + (p * innerW) / 4} y={20} width={1.5} height={height - 34} fill="#000" opacity={0.3} />
						))}
						{grain.map((d, i) => (
							<path key={d} d={d} stroke={i % 2 ? '#fff' : '#000'} strokeWidth={1} opacity={i % 2 ? 0.07 : 0.12} fill="none" />
						))}
						<rect x={14} y={20} width={innerW} height={height - 34} fill={`url(#${shadeId})`} />
						<rect x={0} y={0} width={width} height={20} rx={10} fill={colors.woodLight} />
						<rect x={0} y={16} width={width} height={4} fill="#000" opacity={0.18} />
						<rect x={4} y={3} width={width - 8} height={2} rx={1} fill="#fff" opacity={0.35} />
						<rect x={3} y={20} width={2} height={height - 26} fill="#fff" opacity={0.2} />
						<rect x={width - 5} y={20} width={2} height={height - 26} fill="#000" opacity={0.2} />
					</svg>
				</div>
			)}
			<div ref={ref} style={{ position: 'relative', padding: '20px 14px 0' }}>
				{shelves.map((row, r) => {
					const last = r === shelves.length - 1;
					return (
						<div key={row.map((g) => g.year).join()}>
							<div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, padding: '24px 12px 0' }}>
								{row.map((group) => (
									<BookSpine
										key={group.year}
										year={group.year}
										count={group.entries.length}
										age={parseDate(TODAY).year - group.year}
										hidden={flying === group.year}
										onPress={(el) => onOpenYear(group.year, el)}
									/>
								))}
								{last && (
									<span style={{ marginLeft: 'auto' }}>
										<Buddy mood="happy" size={64} entrance={false} accent={thisYear.primary} />
									</span>
								)}
							</div>
							<div
								style={{
									position: 'relative',
									zIndex: 1,
									height: 15,
									margin: '0 -14px',
									background: last ? colors.wood : colors.woodLight,
									borderTop: '2px solid rgba(255,255,255,0.35)',
									borderBottom: last ? 0 : `3px solid ${colors.woodDark}`,
									boxShadow: last ? 'none' : '0 6px 8px rgba(0,0,0,0.35)',
								}}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

/** The diary's cover, as it looks once pulled off the shelf (AlbumStack.tsx, simplified). */
function DiaryCover({ year, count, width }) {
	const palette = yearPalette(year);
	const height = width * 1.24;
	return (
		<span className="lbd-cover" style={{ width, height, '--c': palette.primary, '--c2': palette.secondary, '--ink': palette.ink }}>
			<span className="lbd-cover-pages" />
			<span className="lbd-cover-front">
				<span className="lbd-cover-band" />
				<span className="lbd-cover-label" style={ty('month', { color: palette.ink })}>
					{year}
				</span>
				<span className="lbd-cover-count" style={ty('small', { color: palette.ink })}>
					{count}
				</span>
			</span>
		</span>
	);
}

/* ---------- Pages ---------- */

function Page({ id, on, className = '', style, children, scrollRef }) {
	return (
		<div
			ref={scrollRef}
			className={`lbd-page ${on ? 'is-on' : ''} ${className}`}
			style={style}
			aria-hidden={!on}
			inert={!on}
			data-page={id}
		>
			{children}
		</div>
	);
}

function HomePage({ entries, todayEntry, go, scrollRef, on, flying, onOpenYear, reduceMotion }) {
	const theme = useTheme();
	const { colors } = theme;
	const memories = onThisDay(entries, TODAY);
	const thisYear = yearPalette(parseDate(TODAY).year);
	return (
		<Page id="home" on={on} scrollRef={scrollRef}>
			<div className="lbd-stack-xxl">
				<div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
					<div style={{ flex: 1 }}>
						<ScreenTitle title="LookBack" accent={thisYear.secondary} />
						<p style={ty('hand', { color: colors.onDeskMuted, marginTop: 4 })}>one small thing a day ✿</p>
					</div>
					<Buddy mood="peek" accent={thisYear.primary} size={64} />
				</div>
				<div>
					<SectionHeader title="On this day" detail={monthDay(TODAY)} accent={thisYear.primary} />
					<LetterDeck entries={memories} onOpen={(entry) => go({ type: 'memory', id: entry.id })} reduceMotion={reduceMotion} />
				</div>
				<div>
					<SectionHeader title="Today" accent={thisYear.primary} />
					{todayEntry ? (
						<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
							<ScrapObject entry={todayEntry} width={theme.contentW * 0.5} numberOfLines={4} onPress={() => go({ type: 'memory', id: todayEntry.id })} />
							<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
								<Buddy mood="happy" accent={thisYear.primary} size={64} />
								<p style={ty('caption', { color: colors.onDeskMuted })}>Saved. See you next year.</p>
								<PillButton label="Edit today" icon={IoCreateOutline} onClick={() => go({ type: 'entry' })} />
							</div>
						</div>
					) : (
						<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
							<BuddySays mood="wave" accent={thisYear.primary} text="What's one small thing from today?" />
							<PillButton label="Add today's moment" icon={IoAdd} tone="dark" large onClick={() => go({ type: 'entry' })} />
						</div>
					)}
				</div>
				<div>
					<SectionHeader title="Years" accent={thisYear.primary} />
					<YearsCupboard entries={entries} onOpenYear={onOpenYear} flying={flying} />
				</div>
			</div>
			<PageFooter label="page 1 · the cover" />
		</Page>
	);
}

function YearsPage({ entries, on, onOpenYear, flying }) {
	const theme = useTheme();
	const years = groupByYear(entries);
	const oldest = years[years.length - 1]?.year;
	const palette = yearPalette(parseDate(TODAY).year);
	return (
		<Page id="years" on={on}>
			<div className="lbd-stack-xl">
				<div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
					<div style={{ flex: 1 }}>
						<ScreenTitle title="Years" count={years.length || undefined} accent={palette.secondary} />
						<p style={ty('hand', { color: theme.colors.onDeskMuted, marginTop: 4 })}>
							{oldest !== undefined ? `${entries.length} memories since ${oldest}. Tap a diary to open it.` : 'Your diaries will stand here.'}
						</p>
					</div>
					<Buddy mood="peek" accent={palette.primary} size={64} />
				</div>
				<YearsCupboard entries={entries} onOpenYear={onOpenYear} flying={flying} />
			</div>
			<PageFooter label="the bookshelf" />
		</Page>
	);
}

function scatterLayout(ids, o) {
	const pad = (o.itemW * (o.scale - 1)) / 2;
	const maxX = Math.max(pad, o.width - o.itemW - pad);
	const step = (maxX - pad) / (o.columns - 1);
	const pitch = o.itemH * o.rowRatio;
	const slots = ids.map((id, i) => {
		const rng = seededRng(`scatter-${id}`);
		const x = pad + (i % o.columns) * step + rng.range(-o.itemW * 0.14, o.itemW * 0.14);
		const y = pad + Math.floor(i / o.columns) * pitch + rng.range(-o.itemH * 0.1, o.itemH * 0.1);
		return { x: Math.min(maxX, Math.max(pad, x)), y: Math.max(0, y), rotate: rng.range(-o.maxTilt, o.maxTilt), scale: o.scale };
	});
	const rows = Math.ceil(ids.length / o.columns);
	return { slots, height: rows === 0 ? 0 : pad * 2 + (rows - 1) * pitch + o.itemH * o.scale };
}

function tidyLayout(groups, o) {
	const slots = [];
	const headers = [];
	let y = 0;
	groups.forEach((ids) => {
		headers.push(y);
		y += o.headerH;
		ids.forEach((id, j) => {
			const rng = seededRng(`tidy-${id}`);
			slots.push({ x: (j % o.columns) * (o.itemW + o.gap), y: y + Math.floor(j / o.columns) * (o.cellH + o.gap), rotate: rng.range(-o.maxTilt, o.maxTilt), scale: 1 });
		});
		y += Math.ceil(ids.length / o.columns) * (o.cellH + o.gap) + o.groupGap;
	});
	return { slots, headers, height: y };
}

function MonthHeader({ month, count, top, palette, on }) {
	const theme = useTheme();
	const [ref, size] = useSize();
	return (
		<div className={`lbd-abs lbd-month ${on ? 'is-on' : ''}`} style={{ top, left: 0, right: 0, display: 'flex', alignItems: 'center', gap: 8 }} aria-hidden={!on}>
			<span style={{ position: 'relative', display: 'inline-block' }}>
				<Doodle kind="highlight" width={size.w + 8} height={44} color={month % 2 ? palette.secondary : palette.primary} seed={month} style={{ left: -4, top: 4 }} />
				<span ref={ref} style={ty('month', { color: theme.colors.onDesk, position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', paddingRight: 6 })}>
					{MONTHS[month - 1]}
				</span>
			</span>
			<span style={ty('hand', { color: theme.colors.onDeskMuted, flex: 1, whiteSpace: 'nowrap' })}>
				{count} {count === 1 ? 'memory' : 'memories'}
			</span>
			<Sticker kind={STICKERS[month % 5]} size={30} color={palette.secondary} color2={palette.primary} style={{ transform: `rotate(${month % 2 ? 12 : -12}deg)` }} />
		</div>
	);
}

/** A year, opened: every memory thrown on the page; Tidy up sorts them under their months ([year].tsx). */
function YearPage({ year, entries, tidy, onBack, go, reduceMotion, scrollRef }) {
	const theme = useTheme();
	const palette = yearPalette(year);
	const contentW = theme.contentW;
	const gap = 12;
	const itemW = (contentW - gap * 2) / 3;
	const cellH = itemW * 1.3;
	const months = groupByMonth(entries);
	const tidied = tidyLayout(
		months.map((g) => g.entries.map((e) => e.id)),
		{ itemW, cellH, columns: 3, gap, headerH: 60, groupGap: 24, maxTilt: 2.5 },
	);
	const flat = months.flatMap((g) => g.entries);
	const shuffled = [...flat].sort((a, b) => hashString(a.id) - hashString(b.id));
	const scattered = scatterLayout(
		shuffled.map((e) => e.id),
		{ width: contentW, itemW, itemH: cellH, columns: 3, scale: 1.22, rowRatio: 0.62, maxTilt: 16 },
	);
	const pileIndex = new Map(shuffled.map((e, i) => [e.id, i]));
	const MINI = 1.7;
	return (
		<Page id={`year-${year}`} on scrollRef={scrollRef} style={{ '--page': theme.dark ? undefined : palette.tint }}>
			<div style={{ marginBottom: 16 }}>
				<CircleButton icon={IoChevronBack} label="Back" tint={palette.primary} onClick={onBack} />
			</div>
			<div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
				<ScreenTitle title={String(year)} count={entries.length} accent={palette.secondary} />
				<Buddy mood="peek" accent={palette.primary} size={64} bump={tidy ? 1 : 0} />
			</div>
			<Lite>
				<div className="lbd-pile" style={{ position: 'relative', height: tidy ? tidied.height : scattered.height }}>
					{months.map((g, i) => (
						<MonthHeader key={g.month} month={g.month} count={g.entries.length} top={tidied.headers[i]} palette={palette} on={tidy} />
					))}
					{flat.map((entry, i) => {
						const z = pileIndex.get(entry.id);
						const slot = tidy ? tidied.slots[i] : scattered.slots[z];
						const look = { ...lookForEntry(entry), tilt: 0 };
						return (
							<div
								key={entry.id}
								className="lbd-abs lbd-pile-item"
								style={{ left: 0, top: 0, width: itemW, height: cellH, zIndex: z, transform: `translate(${slot.x}px, ${slot.y}px) rotate(${slot.rotate}deg) scale(${slot.scale})` }}
							>
								<div className="lbd-fall" style={{ animationDelay: reduceMotion ? '0ms' : `${120 + z * 55}ms` }}>
									<div className="lbd-mini" style={{ width: itemW * MINI, transform: `scale(${1 / MINI})` }}>
										<span className="lbd-abs" style={{ inset: 0, background: theme.colors.shadowBase, opacity: 0.2, borderRadius: 6, transform: 'translate(4px, 6px)' }} />
										<ScrapObject entry={entry} look={look} width={itemW * MINI} numberOfLines={5} onPress={() => go({ type: 'memory', id: entry.id })} />
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</Lite>
			<PageFooter label={`${year} · ${entries.length} ${entries.length === 1 ? 'page' : 'pages'}`} />
		</Page>
	);
}

function MemoryPage({ entry, onBack, go }) {
	const theme = useTheme();
	const palette = yearPalette(parseDate(entry.localDate).year);
	const isToday = entry.localDate === TODAY;
	return (
		<Page id={`memory-${entry.id}`} on>
			<div className="lbd-stack-xl">
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<CircleButton icon={IoChevronBack} label="Back" tint={palette.primary} onClick={onBack} />
					{isToday && <PillButton label="Edit" icon={IoCreateOutline} onClick={() => go({ type: 'entry' })} />}
				</div>
				<p style={ty('headline', { color: theme.colors.onDesk })}>{memoryKicker(entry.localDate, TODAY)}</p>
				<div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
					<ScrapObject entry={entry} width={theme.width * 0.84} stamp lift={1.6} />
				</div>
				{entry.photo != null && entry.text && <p style={ty('body', { color: theme.colors.onDesk, whiteSpace: 'pre-line' })}>{entry.text}</p>}
				<p style={ty('hand', { color: theme.colors.onDeskMuted, textAlign: 'right', transform: 'rotate(-2deg)' })}>saved on {displayDate(entry.createdAt)}</p>
			</div>
		</Page>
	);
}

/* ---------- Writing today's page (entry.tsx) ---------- */

const MODES = [
	{ value: 'note', label: 'Just words', icon: IoCreateOutline },
	{ value: 'photo', label: 'With a photo', icon: IoCameraOutline },
];
const PARTS = [
	{ value: 'sticker', label: 'Sticker', icon: IoStarOutline },
	{ value: 'tape', label: 'Tape', icon: IoBandageOutline },
];
// Sample photos stand in for the camera roll: the app's own painted scenes.
const PICKS = [hashString('pick-1'), hashString('pick-2'), hashString('pick-3'), hashString('pick-4'), hashString('pick-5')];

function Chip({ selected, onClick, label, children }) {
	const theme = useTheme();
	return (
		<button
			type="button"
			className="lbd-chip lbd-pressable lbd-center"
			aria-pressed={selected}
			aria-label={label}
			onClick={onClick}
			style={{ background: theme.colors.paperWhite, borderColor: selected ? theme.colors.amber : theme.colors.paperWhite, boxShadow: theme.shadow(undefined, selected ? 1.2 : 0.6), transform: selected ? 'rotate(-3deg)' : 'none' }}
		>
			{children}
		</button>
	);
}

function ColorRow({ label, value, onChange, year }) {
	const theme = useTheme();
	const swatch = (key, palette, selected, pick, a11y, auto = false) => (
		<button
			key={key}
			type="button"
			role="radio"
			aria-checked={selected}
			aria-label={a11y}
			className="lbd-swatch lbd-center"
			onClick={pick}
			style={{
				borderColor: selected ? theme.colors.ink : theme.colors.paperWhite,
				background: `linear-gradient(${palette.primary} 50%, ${palette.secondary} 50%)`,
				boxShadow: theme.shadow(palette.ink, selected ? 1 : 0.5),
				transform: selected ? 'scale(1.1)' : 'none',
			}}
		>
			{auto && <IoSparkles size={16} color={theme.colors.paperWhite} />}
		</button>
	);
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
			<p style={ty('label', { color: theme.colors.ink })}>{label}</p>
			<div role="radiogroup" aria-label={label} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, padding: 4 }}>
				{swatch('auto', year, value === null, () => onChange(null), `${label}: the year's color`, true)}
				{STYLE_PALETTES.map((p) => swatch(p.name, p, value === p.name, () => onChange(p.name), `${label}: ${p.name}`))}
			</div>
		</div>
	);
}

function EntryPage({ existing, onClose, onSave, reduceMotion }) {
	const theme = useTheme();
	const { colors } = theme;
	const palette = yearPalette(parseDate(TODAY).year);
	const [mode, setMode] = useState(existing?.photo != null ? 'photo' : 'note');
	const [text, setText] = useState(existing?.text || '');
	const [photo, setPhoto] = useState(existing?.photo ?? null);
	const [setAside, setSetAside] = useState(null);
	const [develop, setDevelop] = useState(0);
	const [sticker, setSticker] = useState(existing?.sticker ?? null);
	const [tape, setTape] = useState(existing?.tapePattern ?? null);
	const [stickerColor, setStickerColor] = useState(existing?.stickerColor ?? null);
	const [tapeColor, setTapeColor] = useState(existing?.tapeColor ?? null);
	const [part, setPart] = useState(null);
	const [celebrating, setCelebrating] = useState(null);
	const previewRef = useRef(null);
	const pageRef = useRef(null);
	const pageW = theme.contentW;

	const pick = (source) => {
		const at = PICKS.indexOf(photo);
		setPhoto(source === 'camera' ? PICKS[(at + 3) % PICKS.length] : PICKS[(at + 1) % PICKS.length]);
		setSetAside(null);
		setDevelop((d) => d + 1);
	};
	const changeMode = (next) => {
		if (next === mode) return;
		setMode(next);
		if (next === 'note' && photo != null) {
			setSetAside(photo);
			setPhoto(null);
		} else if (next === 'photo' && setAside != null) {
			setPhoto(setAside);
			setSetAside(null);
		}
	};
	const openPart = (next) => {
		setPart((p) => (p === next ? null : next));
		const page = pageRef.current;
		const preview = previewRef.current;
		if (page && preview) page.scrollTo({ top: preview.offsetTop - 12, behavior: reduceMotion ? 'auto' : 'smooth' });
	};

	const canSave = !celebrating && (mode === 'photo' ? photo != null : text.trim().length > 0);
	const entry = {
		id: TODAY_ID,
		localDate: TODAY,
		text: text.trim(),
		photo: mode === 'photo' ? photo : null,
		createdAt: TODAY,
		objectType: null,
		tapePattern: tape,
		sticker,
		stickerColor,
		tapeColor,
	};
	const preview = { ...entry, text: text.trim() || (mode === 'photo' ? '' : 'Your moment goes here…') };
	const seededLook = lookForEntry(preview);
	const previewLook = mode === 'photo' && photo == null ? { ...seededLook, objectType: 'polaroid' } : seededLook;
	const stickerPick = paletteByName(stickerColor) || palette;
	const tapePick = paletteByName(tapeColor) || palette;
	const lines = mode === 'photo' ? 3 : 6;

	const save = () => {
		if (!canSave) return;
		if (reduceMotion) {
			onSave(entry);
			return;
		}
		setCelebrating(entry);
		setTimeout(() => onSave(entry), 1250);
	};

	return (
		<Page id="entry" on scrollRef={pageRef} className="lbd-page-entry">
			<div className="lbd-stack-xl">
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<CircleButton icon={IoClose} label="Close" onClick={onClose} />
					<PillButton label={existing ? 'Update' : 'Stick it in'} icon={IoCheckmark} tone="green" onClick={save} disabled={!canSave} />
				</div>
				<ScreenTitle title="Today" count={monthDay(TODAY)} accent={palette.secondary} />
				<SlidingToggle options={MODES} value={mode} onChange={changeMode} accent={palette.primary} label="Kind of memory" />
				<div ref={previewRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0 12px', gap: 16 }} aria-live="polite">
					<ScrapObject
						key={develop}
						entry={preview}
						look={previewLook}
						develop={develop > 0}
						width={pageW * 0.6}
						numberOfLines={6}
						onPress={mode === 'photo' && photo == null ? () => pick('library') : undefined}
						label="Pick a photo"
						onPressTape={() => openPart('tape')}
						onPressSticker={() => openPart('sticker')}
					/>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'stretch' }}>
						<Buddy mood={photo != null && mode === 'photo' ? 'cheer' : text.trim() ? 'happy' : 'wave'} accent={palette.primary} size={51.2} bump={`${text.length}-${develop}`} />
						<p style={ty('small', { color: colors.onDeskMuted, flex: 1 })}>
							{canSave
								? `Lovely. I'll bring this back on ${displayDate(shiftYears(TODAY, 1))}. Tap the tape or sticker to change them.`
								: mode === 'photo'
									? 'Tap the polaroid to pick a photo, then write a note to stick on it.'
									: 'Write below and watch it appear. Tap the tape or sticker to change them.'}
						</p>
					</div>
				</div>
				{mode === 'photo' && (
					<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
						<PillButton label={photo != null ? 'Another photo' : 'Library'} icon={IoImagesOutline} onClick={() => pick('library')} />
						<PillButton label="Camera" icon={IoCameraOutline} onClick={() => pick('camera')} />
					</div>
				)}
				<label className="lbd-lined" style={{ background: colors.paperWhite, boxShadow: theme.shadow(palette.primary, 1), '--rule': colors.ruleLine, '--margin': colors.marginLine }}>
					<textarea
						value={text}
						onChange={(event) => setText(event.target.value)}
						onFocus={() => setPart(null)}
						placeholder={mode === 'photo' ? 'A little note to stick on the photo…' : 'A note, a quote, anything small…'}
						aria-label={mode === 'photo' ? 'Note on the photo' : "Today's note"}
						style={ty('body', { color: colors.ink, lineHeight: '30px', minHeight: 30 * lines, '--ph': colors.inkMuted })}
					/>
				</label>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
					<SlidingToggle options={PARTS} value={part ?? 'none'} onChange={openPart} accent={palette.secondary} label="Change the sticker or tape" />
					{part && (
						<div key={part} className="lbd-rise-in" style={{ background: colors.panel, borderRadius: 6, padding: 16, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: theme.shadow(undefined, 1) }}>
							{part === 'sticker' ? (
								<>
									<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
										<Chip selected={sticker === null} onClick={() => setSticker(null)} label="Surprise me">
											<IoSparkles size={22} color={palette.primary} />
										</Chip>
										<Chip selected={sticker === 'none'} onClick={() => setSticker('none')} label="No sticker">
											<IoClose size={22} color={colors.inkMuted} />
										</Chip>
										{STICKERS.map((kind) => (
											<Chip key={kind} selected={sticker === kind} onClick={() => setSticker(kind)} label={`${kind} sticker`}>
												<Sticker kind={kind} size={33} color={stickerPick.primary} color2={stickerPick.secondary} />
											</Chip>
										))}
									</div>
									<ColorRow label="Sticker color" value={stickerColor} onChange={setStickerColor} year={palette} />
								</>
							) : (
								<>
									<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
										<Chip selected={tape === null} onClick={() => setTape(null)} label="Surprise me">
											<IoSparkles size={22} color={palette.primary} />
										</Chip>
										{TAPE_PATTERNS.map((pattern) => (
											<Chip key={pattern} selected={tape === pattern} onClick={() => setTape(pattern)} label={`${pattern} tape`}>
												<span style={{ position: 'relative', width: 46, height: 22 }}>
													<WashiTape width={46} color={tapePick.primary} color2={tapePick.secondary} pattern={pattern} angle={-8} style={{ left: 0, top: 0 }} />
												</span>
											</Chip>
										))}
									</div>
									<ColorRow label="Tape color" value={tapeColor} onChange={setTapeColor} year={palette} />
								</>
							)}
						</div>
					)}
				</div>
			</div>
			{celebrating && <Celebration entry={celebrating} palette={palette} />}
		</Page>
	);
}

function Confetti({ colors }) {
	const ref = useRef(null);
	useEffect(() => {
		const root = ref.current;
		if (!root) return undefined;
		const rnd = mulberry32(2);
		const animations = [...root.children].map((piece) => {
			const angle = -Math.PI / 2 + (rnd() - 0.5) * Math.PI * 1.1;
			const speed = 520 * (0.5 + rnd() * 0.6);
			const vx = Math.cos(angle) * speed;
			const vy = Math.sin(angle) * speed;
			const spin = (rnd() - 0.5) * 900;
			const frames = Array.from({ length: 14 }, (_, k) => {
				const t = k / 13;
				const s = t * 1.3;
				return { transform: `translate(${vx * s}px, ${vy * s + 450 * s * s}px) rotate(${spin * s}deg)`, opacity: t < 0.8 ? 1 : (1 - t) * 5 };
			});
			return piece.animate(frames, { duration: 1300, fill: 'forwards' });
		});
		return () => animations.forEach((a) => a.cancel());
	}, []);
	return (
		<div ref={ref} className="lbd-abs lbd-center" style={{ inset: 0, pointerEvents: 'none' }} aria-hidden="true">
			{Array.from({ length: 26 }, (_, i) => (
				<span key={i} className="lbd-abs" style={{ width: 9, height: i % 3 === 0 ? 9 : 4, borderRadius: i % 3 === 0 ? 5 : 1, background: colors[i % colors.length] }} />
			))}
		</div>
	);
}

function Celebration({ entry, palette }) {
	const theme = useTheme();
	return (
		<div className="lbd-celebrate" role="status" aria-label="Saved">
			<span className="lbd-abs lbd-fade-in" style={{ inset: 0, background: theme.colors.scrim }} />
			<div className="lbd-pop-in" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
				<ScrapObject entry={entry} width={theme.width * 0.62} numberOfLines={6} lift={2} tapeFlicker />
				<Buddy mood="cheer" accent={palette.primary} />
			</div>
			<Confetti colors={[palette.primary, palette.secondary, theme.colors.amber, theme.colors.paperWhite]} />
		</div>
	);
}

/* ---------- Settings (settings.tsx) ---------- */

function CardTitle({ icon: Icon, title, color }) {
	const theme = useTheme();
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
			<span className="lbd-center" style={{ width: 35.2, height: 35.2, borderRadius: 22, background: color, flex: 'none' }}>
				<Icon size={16} color={theme.colors.paperWhite} />
			</span>
			<h4 style={ty('heading', { color: theme.colors.ink, flex: 1 })}>{title}</h4>
		</div>
	);
}

function Help({ children }) {
	const theme = useTheme();
	return <p style={ty('small', { color: theme.colors.inkMuted, padding: '8px 0' })}>{children}</p>;
}

function Row({ label, divider, children }) {
	const theme = useTheme();
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 54, gap: 12, borderTop: divider ? `1px solid ${theme.colors.ruleLine}` : 0 }}>
			<span style={ty('hand', { color: theme.colors.ink, flex: 1 })}>{label}</span>
			{children}
		</div>
	);
}

const formatTime = (minutes) => {
	const h = Math.floor(minutes / 60);
	return `${h % 12 || 12}:${pad2(minutes % 60)} ${h < 12 ? 'am' : 'pm'}`;
};
const REMINDER_TIMES = [8 * 60, 9 * 60, 12 * 60, 18 * 60, 21 * 60];

function SettingsPage({ on, look, onLook, entries, name, setName, reminder, setReminder, toast }) {
	const theme = useTheme();
	const { colors } = theme;
	const palette = yearPalette(parseDate(TODAY).year);
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(name);
	// Letters arrive only on days with a memory from an earlier year, over the next 30 days.
	const upcoming = Array.from({ length: 30 }, (_, i) => i).filter((i) => (i > 0 || reminder.minutes > NOW_MINUTES) && onThisDay(entries, addDays(TODAY, i)).length > 0).length;
	const saveName = () => {
		setEditing(false);
		setName(draft.trim());
	};

	return (
		<Page id="settings" on={on}>
			<div className="lbd-stack-xxl">
				<div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
					<ScreenTitle title="Settings" accent={palette.secondary} />
					<Buddy mood="peek" accent={palette.primary} size={64} />
				</div>

				<Panel seed="you" accent={palette.primary} accent2={palette.secondary}>
					<CardTitle icon={IoHappyOutline} title="You" color={palette.primary} />
					<Row label="Your name">
						{editing ? (
							<input
								value={draft}
								onChange={(event) => setDraft(event.target.value)}
								onBlur={saveName}
								onKeyDown={(event) => event.key === 'Enter' && saveName()}
								autoFocus
								maxLength={24}
								placeholder="your name"
								aria-label="Your name"
								className="lbd-input"
								style={ty('hand', { color: colors.ink })}
							/>
						) : (
							<button
								type="button"
								className="lbd-textbtn"
								onClick={() => {
									setDraft(name);
									setEditing(true);
								}}
								style={ty('hand', { color: name ? colors.ink : colors.inkMuted })}
							>
								{name || 'add ✎'}
							</button>
						)}
					</Row>
				</Panel>

				<Panel seed="look" accent={palette.secondary} accent2={palette.primary}>
					<CardTitle icon={IoColorPaletteOutline} title="Look" color={palette.secondary} />
					<div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0' }}>
						<div role="radiogroup" aria-label="Paper" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
							{PAPERS.map((p) => {
								const selected = p.name === look.paper;
								const dark = look.tone === 'dark';
								return (
									<button key={p.name} type="button" role="radio" aria-checked={selected} aria-label={`${p.label} paper`} className="lbd-paperchip" onClick={() => onLook((l) => ({ ...l, paper: p.name }))}>
										<span
											className="lbd-paperchip-sheet"
											style={{
												background: dark ? p.dark : p.light,
												border: `${selected ? 3 : 1}px solid ${selected ? colors.ink : colors.inkFaint}`,
												boxShadow: theme.shadow(undefined, selected ? 1.2 : 0.5),
												transform: selected ? 'rotate(-4deg) scale(1.06)' : 'none',
												'--dot': withAlpha(dark ? '#FFFDF8' : p.dots, 0.5),
											}}
										>
											{selected && (
												<span className="lbd-paperchip-check lbd-center" style={{ background: colors.green, borderColor: colors.paperWhite }}>
													<IoCheckmark size={16} color="#fff" />
												</span>
											)}
										</span>
										<span style={ty('small', { color: colors.ink, textAlign: 'center' })}>{p.label}</span>
									</button>
								);
							})}
						</div>
						<SlidingToggle
							label="Light or dark"
							options={[
								{ value: 'light', label: 'Light', icon: IoSunnyOutline },
								{ value: 'dark', label: 'Dark', icon: IoMoonOutline },
							]}
							value={look.tone}
							onChange={(tone) => onLook((l) => ({ ...l, tone }))}
							accent={palette.primary}
						/>
					</div>
					<Help>Your notebook&apos;s paper. Dark is the same paper by lamplight; notes and photos stay light on it.</Help>
				</Panel>

				<Panel seed="reminder" accent={palette.primary} accent2={palette.secondary}>
					<CardTitle icon={IoNotificationsOutline} title="Reminders" color={colors.amber} />
					<button type="button" role="checkbox" aria-checked={reminder.enabled} className="lbd-checkrow" onClick={() => setReminder({ ...reminder, enabled: !reminder.enabled })}>
						<svg width={32} height={32} aria-hidden="true">
							<path d="M 3 4 L 26 3 L 27 26 L 4 27 Z" stroke={colors.ink} strokeWidth={2} fill="none" strokeLinejoin="round" />
							{reminder.enabled && <path d="M 6 14 L 12 23 L 30 0" stroke={colors.green} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
						</svg>
						<span style={ty('hand', { color: colors.ink, flex: 1 })}>Letters from past years</span>
					</button>
					{reminder.enabled && (
						<Row label="Arrive at" divider>
							<button
								type="button"
								className="lbd-textbtn"
								aria-label={`Reminder time ${formatTime(reminder.minutes)}. Tap to change`}
								onClick={() => setReminder({ ...reminder, minutes: REMINDER_TIMES[(REMINDER_TIMES.indexOf(reminder.minutes) + 1) % REMINDER_TIMES.length] })}
								style={ty('handLarge', { color: colors.ink })}
							>
								{formatTime(reminder.minutes)}
							</button>
						</Row>
					)}
					<Help>{`Only on days that have a memory from an earlier year.${reminder.enabled ? ` ${upcoming} coming up in the next 30 days.` : ''}`}</Help>
				</Panel>

				<Panel seed="backup" accent={palette.secondary} accent2={palette.primary}>
					<CardTitle icon={IoCloudOutline} title="Backup" color={colors.green} />
					<Help>Keep a private copy in your own Google Drive, in a &quot;LookBack&quot; folder only you can see.</Help>
					<PillButton label="Connect Google Drive" icon={IoLogoGoogle} color={colors.green} onClick={() => toast('Drive backup connects in the Android app')} />
					<div style={{ height: 8 }} />
				</Panel>

				<Panel seed="about" accent={palette.primary} accent2={palette.secondary}>
					<CardTitle icon={IoBookOutline} title="About" color={palette.primary} />
					<Row label="LookBack">
						<span style={ty('handSmall', { color: colors.inkMuted })}>version 1.0.0</span>
					</Row>
					<button type="button" className="lbd-rowbtn" onClick={() => toast('The bunny says hi in the Android app')}>
						<Row label="Meet the bunny again" divider>
							<IoArrowForward size={16} color={colors.ink} />
						</Row>
					</button>
					<Help>One small thing a day. It comes back to you on the same day next year.</Help>
				</Panel>
			</div>
			<PageFooter label="the last page · settings" />
		</Page>
	);
}

/* ---------- The paper navigation strip (NavBar.tsx) ---------- */

function stripPath(w, h, cx, cy, notchR, inset = 0) {
	const r = 22 - inset;
	const top = inset;
	const left = inset;
	const right = w - inset;
	const bottom = h - inset;
	const R = notchR + inset;
	const y0 = top + 4;
	const dx = Math.sqrt(Math.max(0, R * R - (y0 - cy) ** 2));
	const large = y0 < cy ? 1 : 0;
	return `M ${left + r} ${top} L ${cx - dx - 12} ${top} Q ${cx - dx} ${top} ${cx - dx} ${y0} A ${R} ${R} 0 ${large} 0 ${cx + dx} ${y0} Q ${cx + dx} ${top} ${cx + dx + 12} ${top} L ${right - r} ${top} Q ${right} ${top} ${right} ${top + r} L ${right} ${bottom - r} Q ${right} ${bottom} ${right - r} ${bottom} L ${left + r} ${bottom} Q ${left} ${bottom} ${left} ${bottom - r} L ${left} ${top + r} Q ${left} ${top} ${left + r} ${top} Z`;
}

function NavTab({ icon: Icon, activeIcon: ActiveIcon, label, active, accent, onClick }) {
	const theme = useTheme();
	const Shown = active && ActiveIcon ? ActiveIcon : Icon;
	return (
		<button type="button" className="lbd-tab lbd-pressable" aria-current={active ? 'page' : undefined} aria-label={label} onClick={onClick}>
			{active && <span className="lbd-tab-pill" style={{ background: withAlpha(accent, 0.28) }} />}
			<Shown size={22} color={active ? theme.colors.ink : theme.colors.inkMuted} style={{ position: 'relative' }} />
			<span style={ty('small', { color: active ? theme.colors.ink : theme.colors.inkMuted, position: 'relative' })}>{label}</span>
		</button>
	);
}

function NavBar({ hidden, tab, written, action, onTab, onWrite }) {
	const theme = useTheme();
	const { colors } = theme;
	const palette = yearPalette(parseDate(TODAY).year);
	const w = theme.width - 40;
	const h = 72;
	const d = 62;
	const cx = w / 2;
	const cy = d * 0.08;
	const notchR = d / 2 + 6;
	const fill = written ? colors.green : palette.primary;
	return (
		<nav className={`lbd-nav ${hidden ? 'is-hidden' : ''}`} aria-label="Pages" inert={hidden} style={{ height: h }}>
			<svg width={w} height={h + 3} className="lbd-abs" style={{ left: 0, top: 0, overflow: 'visible' }} aria-hidden="true">
				<path d={stripPath(w, h, cx, cy, notchR)} fill={withAlpha(palette.ink, theme.dark ? 0.5 : 0.18)} transform="translate(0 3)" />
				<path d={stripPath(w, h, cx, cy, notchR)} fill={colors.panel} stroke={withAlpha(palette.ink, 0.25)} strokeWidth={1} />
				<path d={stripPath(w, h, cx, cy, notchR, 5)} fill="none" stroke={withAlpha(palette.primary, 0.55)} strokeWidth={1.4} strokeDasharray="5 4" strokeLinecap="round" />
			</svg>
			<WashiTape width={52.8} color={palette.primary} color2={colors.paperWhite} pattern="stripes" angle={-24} style={{ left: -12, top: -8, zIndex: 2 }} />
			<WashiTape width={52.8} color={palette.secondary} color2={colors.paperWhite} pattern="dots" angle={22} style={{ right: -12, top: -8, zIndex: 2 }} />
			<div className="lbd-nav-row">
				<div className="lbd-nav-side">
					<NavTab icon={IoHomeOutline} activeIcon={IoHome} label="Home" active={tab === 'home'} accent={palette.primary} onClick={() => onTab('home')} />
					<NavTab icon={IoLibraryOutline} activeIcon={IoLibrary} label="Years" active={tab === 'years'} accent={palette.primary} onClick={() => onTab('years')} />
				</div>
				<div className="lbd-nav-mid" style={{ width: notchR * 2 }}>
					<span className="lbd-ears" style={{ top: cy - d / 2 - d * 0.3, width: d }} aria-hidden="true">
						{[-16, 16].map((r) => (
							<i key={r} style={{ transform: `rotate(${r}deg)`, background: colors.paperWhite, borderColor: withAlpha(palette.ink, 0.25) }}>
								<b style={{ background: colors.buddyEar }} />
							</i>
						))}
					</span>
					<button
						type="button"
						className="lbd-write lbd-pressable"
						onClick={onWrite}
						aria-label={written ? "Edit today's memory" : "Write today's memory"}
						style={{ top: cy - d / 2, width: d, height: d, background: fill, borderColor: colors.paperWhite, boxShadow: theme.shadow(fill, 1.2) }}
					>
						{written ? <IoCreate size={26.4} color={colors.paperWhite} /> : <IoAdd size={33} color={colors.paperWhite} />}
					</button>
					<span style={ty('small', { color: colors.ink, textAlign: 'center' })}>{written ? 'edit ✓' : 'write'}</span>
				</div>
				<div className="lbd-nav-side">
					{action && (
						<span key={action.label} className="lbd-fade-in" style={{ flex: 1, display: 'flex' }}>
							<NavTab icon={action.icon} label={action.label} accent={palette.primary} onClick={action.onClick} />
						</span>
					)}
					<NavTab icon={IoSettingsOutline} activeIcon={IoSettings} label="Settings" active={tab === 'settings'} accent={palette.primary} onClick={() => onTab('settings')} />
				</div>
			</div>
		</nav>
	);
}

/* ---------- The app ---------- */

/**
 * The phone keeps the device's real screen size, 412 × 915 dp, so every layout wraps as it does on
 * the phone; when the column is narrower or the window shorter, the whole phone is scaled down
 * instead of re-flowed. Popped out or full screen, it fits the window it is in.
 */
function PhoneFit({ children }) {
	const ref = useRef(null);
	const [scale, setScale] = useState(1);
	useEffect(() => {
		const el = ref.current;
		const box = el?.parentElement;
		if (!el || !box || typeof ResizeObserver === 'undefined') return undefined;
		const fit = () => {
			const contained = el.closest('.is-pip') || document.fullscreenElement?.contains(el);
			const style = getComputedStyle(box);
			const width = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
			const height = contained ? box.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) : window.innerHeight * 0.9;
			const next = Math.min(1, width / DEVICE.w, height / DEVICE.h);
			setScale(next > 0 ? next : 1);
		};
		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(box);
		window.addEventListener('resize', fit);
		document.addEventListener('fullscreenchange', fit);
		return () => {
			observer.disconnect();
			window.removeEventListener('resize', fit);
			document.removeEventListener('fullscreenchange', fit);
		};
	}, []);
	return (
		<div ref={ref} className="lbd-fit" style={{ width: DEVICE.w * scale, height: DEVICE.h * scale }}>
			<div className="lbd-device" style={{ width: DEVICE.w, height: DEVICE.h, transform: `scale(${scale})` }}>
				{children}
			</div>
		</div>
	);
}

function LookBackApp({ look, onLook }) {
	const reduceMotion = useReducedMotion();
	const [rootRef, rootSize] = useSize();
	const [tab, setTab] = useState('home');
	const [stack, setStack] = useState([]);
	const [leaving, setLeaving] = useState(null);
	const [todayEntry, setTodayEntry] = useState(null);
	const [tidy, setTidy] = useState(false);
	const [name, setName] = useState('');
	const [reminder, setReminder] = useState({ enabled: false, minutes: 9 * 60 });
	const [pill, setPill] = useState(null);
	const [flight, setFlight] = useState(null);
	const [live, setLive] = useState(false);
	const homeRef = useRef(null);
	const yearRef = useRef(null);
	const timers = useRef([]);
	const pillCount = useRef(0);
	const width = rootSize.w || SCREEN.w;
	const theme = makeTheme(look.paper, look.tone, width);
	const entries = todayEntry ? [...SAMPLE, todayEntry] : SAMPLE;

	useEffect(() => {
		const el = rootRef.current;
		if (!el || typeof IntersectionObserver === 'undefined') return undefined;
		const observer = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting));
		observer.observe(el);
		return () => observer.disconnect();
	}, [rootRef]);
	useEffect(() => () => timers.current.forEach(clearTimeout), []);
	const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

	const toast = (message) => {
		pillCount.current += 1;
		setPill({ message, key: pillCount.current });
		later(() => setPill((p) => (p && p.message === message ? null : p)), 2200);
	};
	const push = (route) => {
		if (route.type === 'year') setTidy(false);
		setStack((s) => [...s, { ...route, key: `${route.type}-${route.id || route.year || ''}-${s.length}` }]);
	};
	const pop = () => {
		const top = stack[stack.length - 1];
		if (!top) return;
		setStack((s) => s.slice(0, -1));
		if (reduceMotion) return;
		setLeaving(top);
		later(() => setLeaving((l) => (l === top ? null : l)), 300);
	};
	const goTab = (next) => {
		if (stack.length) {
			setStack([]);
			setTab(next);
			return;
		}
		if (next === tab && next === 'home') homeRef.current?.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
		setTab(next);
	};
	const save = (entry) => {
		setTodayEntry(entry);
		setStack((s) => s.filter((r) => r.type !== 'entry'));
		toast(`Saved for ${displayDate(shiftYears(TODAY, 1))}`);
	};

	// Pulling a diary off the shelf: it lifts out, flies to the middle as its cover, opens, and the year appears.
	const openYear = (year, spineEl) => {
		if (flight) return;
		if (reduceMotion || !spineEl || !rootRef.current) {
			push({ type: 'year', year });
			return;
		}
		const root = rootRef.current.getBoundingClientRect();
		const rect = spineEl.getBoundingClientRect();
		const scale = root.width / rootRef.current.offsetWidth || 1;
		setFlight({
			year,
			count: entries.filter((e) => parseDate(e.localDate).year === year).length,
			x: (rect.left - root.left) / scale,
			y: (rect.top - root.top) / scale,
			w: rect.width / scale,
			h: rect.height / scale,
			phase: 'pull',
		});
		later(() => setFlight((f) => f && { ...f, phase: 'fly' }), 220);
		later(() => setFlight((f) => f && { ...f, phase: 'open' }), 780);
		later(() => push({ type: 'year', year }), 1100);
		later(() => setFlight((f) => f && { ...f, phase: 'fade' }), 1150);
		later(() => setFlight(null), 1500);
	};

	const top = stack[stack.length - 1];
	const onEntry = top?.type === 'entry';
	const yearTop = top?.type === 'year' ? top : null;
	const action =
		yearTop && entries.filter((e) => parseDate(e.localDate).year === yearTop.year).length > 1
			? {
					label: tidy ? 'Scatter' : 'Tidy up',
					icon: tidy ? IoShuffle : IoAlbumsOutline,
					onClick: () => {
						yearRef.current?.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
						setTidy((t) => !t);
					},
				}
			: null;

	const renderRoute = (route) => {
		if (route.type === 'year') {
			return (
				<YearPage
					year={route.year}
					entries={entries.filter((e) => parseDate(e.localDate).year === route.year)}
					tidy={tidy}
					onBack={pop}
					go={push}
					reduceMotion={reduceMotion}
					scrollRef={route === top ? yearRef : undefined}
				/>
			);
		}
		if (route.type === 'memory') {
			const entry = entries.find((e) => e.id === route.id);
			return entry ? <MemoryPage entry={entry} onBack={pop} go={push} /> : null;
		}
		return <EntryPage existing={todayEntry} onClose={pop} onSave={save} reduceMotion={reduceMotion} />;
	};
	const layers = leaving ? [...stack, leaving] : stack;
	const flyingYear = flight?.year ?? null;

	return (
		<ThemeContext.Provider value={theme}>
			<div
				ref={rootRef}
				className="lbd"
				data-tone={look.tone}
				data-live={live ? '' : undefined}
				style={{
					'--desk': theme.colors.desk,
					'--dots': theme.colors.gridLine,
					'--margin': theme.colors.marginLine,
					'--on-desk': theme.colors.onDesk,
				}}
			>
				<div className="lbd-layer lbd-tabs" inert={stack.length > 0 && !leaving ? true : undefined}>
					<HomePage
						on={tab === 'home'}
						entries={entries}
						todayEntry={todayEntry}
						go={push}
						scrollRef={homeRef}
						onOpenYear={openYear}
						flying={flyingYear}
						reduceMotion={reduceMotion}
					/>
					<YearsPage on={tab === 'years'} entries={entries} onOpenYear={openYear} flying={flyingYear} />
					<SettingsPage
						on={tab === 'settings'}
						look={look}
						onLook={onLook}
						entries={entries}
						name={name}
						setName={setName}
						reminder={reminder}
						setReminder={setReminder}
						toast={toast}
					/>
				</div>
				{layers.map((route) => {
					const isLeaving = route === leaving;
					const isTop = route === top && !isLeaving;
					return (
						<div
							key={route.key}
							className={`lbd-layer lbd-route lbd-route-${route.type} ${isLeaving ? 'is-leaving' : ''}`}
							inert={!isTop}
							aria-hidden={!isTop}
						>
							{renderRoute(route)}
						</div>
					);
				})}

				{flight && (
					<div className={`lbd-flight is-${flight.phase}`} aria-hidden="true">
						<span className="lbd-flight-page" style={{ background: theme.dark ? theme.colors.desk : yearPalette(flight.year).tint }} />
						<span className="lbd-flight-spine" style={{ left: flight.x, top: flight.y, width: flight.w, height: flight.h }}>
							<BookSpine year={flight.year} count={flight.count} age={parseDate(TODAY).year - flight.year} />
						</span>
						<span className="lbd-flight-cover" style={{ '--from-x': `${flight.x + flight.w / 2 - width / 2}px`, '--from-y': `${flight.y + flight.h / 2}px` }}>
							<DiaryCover year={flight.year} count={flight.count} width={width * 0.62} />
							{STICKERS.slice(0, 4).flatMap((kind, i) => [0, 1, 2].map((k) => (
								<span key={`${kind}${k}`} className="lbd-spark" style={{ '--a': `${(i * 3 + k) * 30}deg` }}>
									<Sticker kind={k === 1 ? 'heart' : kind === 'moon' ? 'star' : kind} size={20} color={yearPalette(flight.year).primary} color2={yearPalette(flight.year).secondary} />
								</span>
							)))}
						</span>
					</div>
				)}

				<div className="lbd-status" aria-hidden="true">
					<span>9:41</span>
					<span className="lbd-status-icons">
						<i />
						<i />
						<b />
					</span>
				</div>

				<NavBar
					hidden={onEntry}
					tab={stack.length ? null : tab}
					written={!!todayEntry}
					action={action}
					onTab={goTab}
					onWrite={() => push({ type: 'entry' })}
				/>

				{pill && (
					<div key={pill.key} className="lbd-status-pill lbd-pop-in" role="status">
						<IoCheckmarkCircle size={22} />
						<span style={ty('label')}>{pill.message}</span>
					</div>
				)}
			</div>
		</ThemeContext.Provider>
	);
}

/* ---------- The app icon's moods ---------- */

// The same rules as src/lib/appIcon.ts: never before the first page; plead after
// 6 pm when today is empty; cry once a whole day is missed; wail after 4+ days.
const ICONS = {
	Default: { src: 'icon.png', title: 'Happy, waving', note: 'Today’s page is written, or it’s still early.' },
	Waiting: { src: 'icon-waiting.png', title: 'Pleading', note: 'It’s after 6 pm and today’s page is still empty.' },
	Missed: { src: 'icon-missed.png', title: 'Crying', note: 'A whole day went by without a page.' },
	Gone: { src: 'icon-gone.png', title: 'Wailing in a puddle', note: 'Four days or more without a page.' },
};

function iconState(started, days, evening) {
	if (!started || days === 0) return 'Default';
	if (days === 1) return evening ? 'Waiting' : 'Default';
	return days >= 4 ? 'Gone' : 'Missed';
}

function IconMoods() {
	const [days, setDays] = useState(2);
	const [evening, setEvening] = useState(true);
	const [started, setStarted] = useState(true);
	const state = iconState(started, days, evening);
	const daysLabel = days === 0 ? 'Written today' : days === 1 ? 'Last page: yesterday' : `Last page: ${days} days ago`;

	return (
		<div className="lbd-moods">
			<div className="lbd-homescreen" aria-label={`Home screen. The LookBack icon is ${ICONS[state].title.toLowerCase()}.`} role="img">
				<div className="lbd-homescreen-grid" aria-hidden="true">
					{['#9ec5e8', '#f4b6a8', '#b8dbb0', '#f6d58b', '#c9b8ec', '#f2a7c3', '#a8d8d2'].map((c, i) => (
						<span key={c} className="lbd-app" style={{ '--app': c }}>
							<i />
							<small>{['Clock', 'Photos', 'Maps', 'Notes', 'Music', 'Mail', 'Weather'][i]}</small>
						</span>
					))}
					<span className="lbd-app lbd-app-lookback">
						<span className="lbd-icon-stack">
							{Object.entries(ICONS).map(([key, icon]) => (
								<img key={key} src={`${IMG}/${icon.src}`} alt="" className={key === state ? 'is-on' : ''} draggable="false" />
							))}
						</span>
						<small>LookBack</small>
					</span>
				</div>
				<img className="lbd-widget" src={`${IMG}/widget-preview.png`} alt="" loading="lazy" draggable="false" />
			</div>

			<div className="lbd-mood-controls">
				<p className="lbd-mood-state">
					<b>{ICONS[state].title}.</b> {started ? ICONS[state].note : 'No pages yet, so the bunny never nags.'}
				</p>
				<label className="lbd-range">
					<span>
						Days since your last page: <b>{daysLabel}</b>
					</span>
					<input type="range" min="0" max="6" step="1" value={days} disabled={!started} onChange={(event) => setDays(Number(event.target.value))} />
					<span className="lbd-range-ticks" aria-hidden="true">
						{[0, 1, 2, 3, 4, 5, 6].map((n) => (
							<i key={n}>{n === 6 ? '6+' : n}</i>
						))}
					</span>
				</label>
				<div className="chd-theme" role="group" aria-label="Time of day">
					{[
						[false, 'Before 6 pm'],
						[true, 'After 6 pm'],
					].map(([value, label]) => (
						<button key={label} type="button" className={evening === value ? 'is-on' : ''} aria-pressed={evening === value} onClick={() => setEvening(value)}>
							{label}
						</button>
					))}
				</div>
				<label className="lbd-check">
					<input type="checkbox" checked={!started} onChange={(event) => setStarted(!event.target.checked)} /> Hasn’t written a first page yet
				</label>
				<p className="lbd-mood-foot">The home-screen widget, beside the icon, adds today’s memory in one tap.</p>
			</div>
		</div>
	);
}

/* ---------- The stages ---------- */

export default function LookBackDemo() {
	const [look, setLook] = useState({ paper: 'cream', tone: 'light' });

	return (
		<div className="chd-wrap lbd-wrap" id="live-prototype">
			<section className="chd-stage lbd-stage lbd-stage-app" aria-label="Live prototype · Android app">
				<p className="chd-stage-tag">
					<span className="chd-stage-pulse" aria-hidden="true" /> Live prototype · Android app
				</p>
				<div className="chd-bar">
					<p className="chd-bar-note">Tap an envelope, swipe the letters, write today, pull a diary off the shelf. Sample memories only.</p>
					<div className="chd-theme" role="group" aria-label="Appearance">
						{[
							['light', 'Light'],
							['dark', 'Dark'],
						].map(([tone, label]) => (
							<button key={tone} type="button" className={look.tone === tone ? 'is-on' : ''} aria-pressed={look.tone === tone} onClick={() => setLook((l) => ({ ...l, tone }))}>
								{label}
							</button>
						))}
					</div>
				</div>
				<PrototypeWindow
					className="lbd-window"
					label="Android app"
					title="LookBack · Android"
					storageKey="lbd-pip-android"
					download={{ label: 'Download APK', href: APK }}
					size={{ width: DEVICE.w, height: DEVICE.h }}
					scale={0.52}
				>
					<PhoneFit>
						<LookBackApp look={look} onLook={setLook} />
					</PhoneFit>
				</PrototypeWindow>
			</section>

			<section className="chd-stage lbd-stage lbd-stage-icon" aria-label="Live prototype · App icon">
				<p className="chd-stage-tag">
					<span className="chd-stage-pulse" aria-hidden="true" /> Live prototype · App icon
				</p>
				<div className="chd-bar">
					<p className="chd-bar-note">The launcher icon gets more dramatic the longer today’s page stays empty. Drag the slider.</p>
				</div>
				<IconMoods />
			</section>

			<p className="chd-caption">
				A working copy of the app, ported screen by screen from its React Native source, with its real icon and mascot art. The memories are the app’s own built-in sample set. On a wide screen, pop it out to keep it beside you while you read.
			</p>
		</div>
	);
}
