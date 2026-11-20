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
	IoCutOutline,
	IoHappyOutline,
	IoHeartOutline,
	IoHome,
	IoHomeOutline,
	IoImagesOutline,
	IoLibrary,
	IoLibraryOutline,
	IoLogoGoogle,
	IoMic,
	IoMicOutline,
	IoMoonOutline,
	IoNotificationsOutline,
	IoPause,
	IoPlay,
	IoSettings,
	IoSettingsOutline,
	IoShuffle,
	IoSparkles,
	IoStarOutline,
	IoStop,
	IoSunnyOutline,
	IoSyncOutline,
	IoTrashOutline,
} from 'react-icons/io5';
import PrototypeWindow from './PrototypeWindow';

// A working copy of the LookBack Android app, ported screen by screen from its
// React Native source (src/app, src/components, src/theme), so it looks and
// behaves like the phone app. The memories are the app's own built-in sample
// set (src/dev/seed.ts) with its painted sample photos and hummed sample voice
// notes, so nothing here is personal. Motion is transforms and opacity, and stops for reduced motion.

const IMG = '/images/lookback';
const APK = 'https://github.com/Sreekaran1704/LookBack/releases/download/v1.2.0/LookBack-1.2.0.apk';
const TODAY = '2026-11-11';
/** The phone's screen in dp, the 20:9 Android phone the app was built on, and its bezel. */
const SCREEN = { w: 363, h: 800 };
const BEZEL = 6;
const DEVICE = { w: SCREEN.w + BEZEL * 2, h: SCREEN.h + BEZEL * 2 };
/** The phone's clock reads 9:41 am. */
const NOW_MINUTES = 9 * 60 + 41;

/* ---------- Theme (src/theme) ---------- */

const PAPERS = [
	{ name: 'cream', label: 'Cream', light: '#FBF5E6', dark: '#2A251E', darkDeep: '#1B1814', dots: '#5B8CC9', accent2: '#E8A23B' },
	{ name: 'peach', label: 'Peach', light: '#FFE9E1', dark: '#3B2722', darkDeep: '#261915', dots: '#F29A86', accent2: '#6FB59B' },
	{ name: 'rose', label: 'Rose', light: '#FCE4EC', dark: '#3A2030', darkDeep: '#25141F', dots: '#E57BA2', accent2: '#9C7BD9' },
	{ name: 'lemon', label: 'Lemon', light: '#FBF3CC', dark: '#35301A', darkDeep: '#221E10', dots: '#D9A521', accent2: '#6FA8DC' },
	{ name: 'mint', label: 'Mint', light: '#E2F5EA', dark: '#1D3429', darkDeep: '#12221A', dots: '#3FAF7C', accent2: '#F29A86' },
	{ name: 'sky', label: 'Sky', light: '#E1EEFB', dark: '#1C2B3E', darkDeep: '#111B28', dots: '#4D8DD6', accent2: '#F2B33D' },
	{ name: 'lavender', label: 'Lavender', light: '#ECE6FA', dark: '#2A2440', darkDeep: '#1B172A', dots: '#8B6FD9', accent2: '#E57BA2' },
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

const blend = (a, b, t) => {
	const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
};

/** The bars are made of the chosen paper (papers.ts navColors): a brighter sheet of it, or lamp-lit in dark. */
function navColors(paper, tone) {
	if (tone === 'light') {
		return {
			strip: blend(paper.light, '#FFFFFF', 0.55),
			edge: withAlpha(paper.dots, 0.35),
			stitch: withAlpha(paper.dots, 0.6),
			shadow: withAlpha(paper.darkDeep, 0.2),
			ink: '#2A2118',
			inkMuted: blend('#7A6A58', paper.dots, 0.2),
			active: withAlpha(paper.dots, 0.24),
			tape: paper.dots,
			tape2: paper.accent2,
			plus: paper.dots,
			rim: '#FFFDF8',
		};
	}
	return {
		strip: blend(paper.dark, paper.dots, 0.2),
		edge: withAlpha(paper.dots, 0.45),
		stitch: withAlpha(blend(paper.dots, '#FFFFFF', 0.25), 0.7),
		shadow: withAlpha('#000000', 0.55),
		ink: blend(paper.light, '#FFFFFF', 0.3),
		inkMuted: withAlpha(paper.light, 0.62),
		active: withAlpha(paper.dots, 0.4),
		tape: blend(paper.dots, paper.dark, 0.15),
		tape2: blend(paper.accent2, paper.dark, 0.2),
		plus: paper.dots,
		rim: blend(paper.light, paper.dark, 0.08),
	};
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
		nav: navColors(paper, tone),
		width,
		contentW: width - 40,
		shadow: (tint, lift = 1) => (dark ? paperShadow('#000000', lift, true) : paperShadow(tint || LIGHT.shadowBase, lift, false)),
	};
}

const ThemeContext = createContext(makeTheme('rose', 'light', SCREEN.w));
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
		{ localDate: shiftYears(TODAY, -1), text: 'Picnic in the park with the whole crew.\nWe stayed until the lights came on.', photo: true, voice: 4 },
		{ localDate: shiftYears(TODAY, -2), text: 'Moved into the new place. Boxes everywhere.', photo: false, voice: 4 },
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
			voice: item.voice ? { seed: hashString(item.localDate), ms: item.voice * 1000, wave: sampleWave(hashString(item.localDate), item.voice) } : null,
			createdAt: item.localDate,
			objectType: null,
			tapePattern: null,
			sticker: null,
			stickerColor: null,
			tapeColor: null,
		}));
}
// Built on first use: the sample voice notes need the waveform helpers defined further down.
let sampleCache = null;
const sampleSet = () => (sampleCache = sampleCache || sampleEntries());
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

/**
 * Words on a paper object (WritableText): plain text, or while writing, the same words as a text box in
 * exactly that style, so you write on the paper itself.
 */
function Words({ text, style, lines, editor, focus = false }) {
	const ref = useRef(null);
	useEffect(() => {
		if (focus) ref.current?.focus({ preventScroll: true });
	}, [focus]);
	if (!editor) return <p style={{ ...style, ...clamp(lines) }}>{text}</p>;
	return (
		<textarea
			ref={ref}
			className="lbd-writable"
			value={editor.value}
			onChange={(event) => editor.onChange(event.target.value)}
			onFocus={editor.onFocus}
			onClick={(event) => event.stopPropagation()}
			placeholder={editor.placeholder}
			aria-label={editor.label}
			rows={1}
			style={{ ...style, '--ph': 'rgba(122, 106, 88, 0.85)' }}
		/>
	);
}

/** Where a photo's words go (polaroid.ts): on the strip when they fit (2 lines of 20), else on the back with "… P.T.O". */
const PTO = 'P.T.O';
function wrappedLines(text, perLine) {
	let total = 0;
	for (const paragraph of text.split('\n')) {
		let lines = 1;
		let used = 0;
		for (const word of paragraph.split(/\s+/).filter(Boolean)) {
			let w = word.length;
			const need = used === 0 ? w : used + 1 + w;
			if (need <= perLine) {
				used = need;
				continue;
			}
			if (used > 0) {
				lines += 1;
				used = 0;
			}
			while (w > perLine) {
				lines += 1;
				w -= perLine;
			}
			used = w;
		}
		total += lines;
	}
	return total;
}
function planPolaroidWords(text, voice = false) {
	const words = text.trim();
	if (!words) return { front: null, back: null, teaser: null };
	if (voice) return { front: null, back: words, teaser: null };
	if (wrappedLines(words, 20) <= 2) return { front: words, back: null, teaser: null };
	const room = 40 - (PTO.length + 4) - 4;
	const flat = words.replace(/\s+/g, ' ');
	const cut = flat.slice(0, room);
	const space = cut.lastIndexOf(' ');
	return { front: null, back: words, teaser: (space > room * 0.5 ? cut.slice(0, space) : cut).trim() };
}

/** A note on lined or plain paper with a torn bottom edge and sometimes a folded corner. */
function TornNote({ width, text, paper, tint, seed, ruled = true, folded = false, numberOfLines, lift = 1, editor }) {
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
				<Words text={text} editor={editor} lines={numberOfLines} style={ty(editor ? 'hand' : kind, { color: colors.ink, paddingLeft: ruled ? 16 : 0, position: 'relative', whiteSpace: 'pre-line' })} />
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

/** A photo printed like old instant film (vintageFilm): sepia, faded, softer, with a warm wash and vignette. */
function FilmPhoto({ seed }) {
	return (
		<span className="lbd-film">
			<SeedPhoto seed={seed} />
		</span>
	);
}

/**
 * Instant film (Polaroid.tsx): the print, and a deep strip where the words are handwritten when they fit.
 * Longer words (or any words, when a voice note has the strip) go on its back, cream ruled paper with the
 * date and a heart, and the front says "P.T.O ↻". It turns over in 3D. No photo but a voice note: the
 * waveform is the print.
 */
function Polaroid({ width, photo, words = '', date, tint, develop, lift = 1, voice, player, flipped = false, editor }) {
	const theme = useTheme();
	const { colors } = theme;
	const inner = width - 20;
	const fontSize = inner / (20 * 0.45);
	const hand = { fontFamily: 'var(--lbd-hand)', fontWeight: 600, fontSize, lineHeight: `${fontSize * 1.08}px` };
	const backHand = { ...hand, fontSize: fontSize * 0.78, lineHeight: `${fontSize * 0.78 * 1.25}px` };
	const stripH = Math.max(46, inner * 0.27);
	const height = 10 + inner + stripH;
	const voiceOnStrip = !!voice && photo != null;
	const value = editor ? editor.value : words;
	const plan = planPolaroidWords(value, voiceOnStrip);
	const hasBack = plan.back !== null || (!!editor && voiceOnStrip);
	const showBack = editor ? (voiceOnStrip ? flipped : plan.back !== null) : flipped && hasBack;
	const frontEditor = editor && !voiceOnStrip && !plan.back;
	const backEditor = editor && (plan.back !== null || voiceOnStrip);
	const ptoText = <span style={{ color: tint, fontWeight: 700 }}>{`${PTO} ↻`}</span>;
	let strip;
	if (voiceOnStrip) {
		strip = (
			<span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, height: stripH, padding: '0 4px' }}>
				<VoiceRow voice={voice} width={inner - 8} height={Math.round(stripH * 0.46)} color={tint} player={player} />
				{plan.back && <span style={{ ...hand, fontSize: fontSize * 0.8, lineHeight: `${fontSize * 0.9}px` }}>{ptoText}</span>}
			</span>
		);
	} else {
		strip = (
			<span style={{ display: 'flex', alignItems: 'center', height: stripH, padding: '0 4px', transform: 'rotate(-2deg)' }}>
				{frontEditor ? (
					<Words editor={{ ...editor, placeholder: 'a few words on the polaroid…' }} focus={!showBack && editor.focusSide} style={{ ...hand, color: colors.ink, width: '100%' }} />
				) : plan.front ? (
					<p style={{ ...hand, color: colors.ink, ...clamp(2) }}>{plan.front}</p>
				) : plan.teaser ? (
					<p style={{ ...hand, color: colors.ink, ...clamp(2) }}>
						{`${plan.teaser}… `}
						{ptoText}
					</p>
				) : date ? (
					<p style={{ ...hand, color: colors.ink, whiteSpace: 'nowrap' }}>{date}</p>
				) : null}
			</span>
		);
	}
	const front = (
		<div className="lbd-face" style={{ width, height, background: colors.paperWhite, padding: '10px 10px 0', borderRadius: 3, boxShadow: theme.shadow(tint, lift) }}>
			<div style={{ position: 'relative', width: inner, height: inner, background: colors.inkFaint, overflow: 'hidden' }}>
				{photo != null ? <FilmPhoto seed={photo} /> : voice ? <SoundPrint size={inner} tint={tint} voice={voice} player={player} /> : null}
				{develop && <span key={photo} className="lbd-abs lbd-develop" style={{ inset: 0, background: colors.paperWhite }} />}
			</div>
			{strip}
		</div>
	);
	const gap = parseFloat(backHand.lineHeight);
	const back = hasBack ? (
		<div
			className="lbd-face lbd-face-back"
			style={{
				width,
				height,
				padding: 12,
				display: 'flex',
				flexDirection: 'column',
				borderRadius: 3,
				background: `repeating-linear-gradient(to bottom, transparent 0 ${gap - 1}px, ${colors.ruleLine} ${gap - 1}px ${gap}px) 0 12px / 100% calc(100% - 24px) no-repeat, ${colors.paper}`,
				boxShadow: theme.shadow(tint, lift),
			}}
		>
			<div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
				{backEditor ? (
					<Words editor={{ ...editor, placeholder: 'a few words on the back…' }} focus={showBack && editor.focusSide} style={{ ...backHand, color: colors.ink, width: '100%' }} />
				) : (
					<p style={{ ...backHand, color: colors.ink, whiteSpace: 'pre-line' }}>{plan.back}</p>
				)}
			</div>
			<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<span style={ty('handSmall', { color: colors.inkMuted })}>{date}</span>
				<svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
					<path d={HEART_PATH} fill={withAlpha(tint, 0.85)} />
				</svg>
			</span>
		</div>
	) : null;
	return (
		<div className="lbd-card3d" style={{ width, height }}>
			<div className={`lbd-card3d-in ${showBack ? 'is-back' : ''}`}>
				{front}
				{back}
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
				<FilmPhoto seed={photo} />
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
function TicketStub({ width, text, paper, accent, stubLabel, serial, lift = 1, editor }) {
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
				<Words text={text} editor={editor} style={ty(compact ? 'label' : 'ticket', { color: theme.colors.ink, position: 'relative' })} />
			</div>
		</div>
	);
}

/** A memory as a physical scrapbook object, with its fastener and sticker (ScrapObject.tsx). */
function ScrapObject({ entry, width, look: lookOverride, stamp = false, numberOfLines, lift = 1, develop = false, tapeFlicker = false, onPress, onPressTape, onPressSticker, label, player, flipped = false, editor }) {
	const theme = useTheme();
	const { colors } = theme;
	const look = lookOverride || lookForEntry(entry);
	const year = parseDate(entry.localDate).year;
	const palette = yearPalette(year);
	const tapeP = paletteByName(entry.tapeColor) || palette;
	const stickerP = paletteByName(entry.stickerColor) || palette;
	const photo = entry.photo;
	const voice = entry.voice || null;
	// A voice memory is always a polaroid (its waveform is the picture, or runs along a photo's strip), and so
	// is a photo with words (they go on its strip, or its back).
	const objectType = voice || (photo != null && (editor ? true : entry.text.trim().length > 0)) ? 'polaroid' : look.objectType;
	const notePapers = [colors.paper, colors.paperWhite, colors.blush, palette.tint];
	const notePaper = notePapers[Math.floor(look.sizeJitter * notePapers.length)] || colors.paper;
	let body = null;
	if (objectType === 'polaroid')
		body = <Polaroid width={width} photo={photo} words={entry.text} date={displayDate(entry.localDate)} tint={palette.primary} develop={develop} lift={lift} voice={voice} player={player} flipped={flipped} editor={editor} />;
	else if (objectType === 'tapedPhoto') body = photo != null ? <TapedPhoto width={width} photo={photo} tint={palette.primary} corners={look.sizeJitter > 0.5} lift={lift} /> : null;
	else if (objectType === 'ticket')
		body = <TicketStub width={width} text={entry.text} paper={palette.tint} accent={palette.primary} stubLabel={String(year)} serial={String(look.pathSeed % 10000).padStart(4, '0')} lift={lift} editor={editor} />;
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
				editor={editor}
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
const BLINKS = new Set(['happy', 'wave', 'peek']);
/**
 * Alive like the app's: it bobs and breathes, blinks every few seconds (now and then twice), tilts its
 * head now and then, hops when `bump` changes, and when `tappable`, squishes and hops when poked.
 */
function Buddy({ mood = 'happy', size = 96, accent, bump, entrance = true, style, tappable = false }) {
	const id = useId();
	const [seen, setSeen] = useState(bump);
	const [jump, setJump] = useState({ n: 0, kind: '' });
	if (bump !== seen) {
		setSeen(bump);
		setJump((j) => ({ n: j.n + 1, kind: 'lbd-hop' }));
	}
	const r = mulberry32(hashString(id));
	const blinkDur = 3.4 + r() * 3.2;
	const blinkDelay = -r() * blinkDur;
	const double = r() < 0.3;
	const tiltDur = 6 + r() * 4;
	const tiltDelay = -r() * tiltDur;
	const tiltSide = r() < 0.5 ? -1 : 1;
	const height = mood === 'peek' ? size * 0.68 : size;
	const poke = () => {
		buzz();
		setJump((j) => ({ n: j.n + 1, kind: 'lbd-poke' }));
	};
	const tilts = mood !== 'wave' && mood !== 'cheer';
	const tapProps = tappable
		? {
				role: 'button',
				tabIndex: 0,
				'aria-label': 'The bunny',
				onClick: poke,
				onKeyDown: (event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						poke();
					}
				},
			}
		: { 'aria-hidden': true };
	return (
		<span className={`lbd-buddy ${entrance ? 'is-pop' : ''} ${tappable ? 'is-tappable' : ''}`} style={{ width: size, height, ...style }} {...tapProps}>
			<span key={jump.n} className={jump.kind}>
				<span className={tilts ? 'lbd-tilt' : ''} style={tilts ? { animationDuration: `${tiltDur}s`, animationDelay: `${tiltDelay}s`, '--tilt': `${tiltSide * 4}deg` } : undefined}>
					<span className={`lbd-bob lbd-bob-${mood}`} style={{ width: size, height }}>
						<img src={`${IMG}/buddy/${mood}.png`} alt="" draggable="false" style={{ width: size, height: size }} />
						{BLINKS.has(mood) && (
							<img
								src={`${IMG}/buddy/${mood}-blink.png`}
								alt=""
								draggable="false"
								className={`lbd-blink ${double ? 'is-double' : ''}`}
								style={{ width: size, height: size, animationDuration: `${blinkDur}s`, animationDelay: `${blinkDelay}s` }}
							/>
						)}
						<span className="lbd-bow" style={{ width: size, height: size, background: accent || '#F5B23C' }} />
					</span>
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
		// Title and date share one baseline; the wavy underline hangs below, outside the row (1.2 fix).
		<div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 28 }}>
			<div style={{ position: 'relative' }}>
				<h3 ref={ref} style={ty('heading', { color: theme.colors.onDesk, whiteSpace: 'nowrap', display: 'inline-block', paddingRight: 5 })}>
					{title}
				</h3>
				<div style={{ position: 'absolute', left: 0, top: '100%', height: 12 }}>
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

/* ---------- Opening a diary (BookFlight.tsx) ---------- */

/** The app's timings (tokens.ts motion.bookFlight), in ms. */
const BOOK = { pull: 300, travel: 620, turn: 520, open: 820, page: 560, pageGap: 140, burst: 900, settle: 220, dive: 640 };
const BOOK_COVER_SHARE = 0.42;
const BOOK_TARGET_Y = 0.44;
const BOOK_ARC = 70;
const BOOK_PERSPECTIVE = 1400;
const EASE_INOUT = 'cubic-bezier(0.65, 0, 0.35, 1)';
const EASE_SOFT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const COVER_EASE = 'cubic-bezier(0.42, 0, 0.25, 1)';
const PAGE_EASE = 'cubic-bezier(0.4, 0, 0.3, 1)';
const SPARKS = 12;

/** When each part of the flight starts, from the tap (the same arithmetic as BookFlight). */
function bookTimes() {
	const travelAt = BOOK.pull * 0.6;
	const turnAt = travelAt + BOOK.travel * 0.7;
	const openAt = turnAt + BOOK.turn;
	const pagesAt = openAt + BOOK.open * 0.45;
	const openedAt = Math.max(openAt + BOOK.open, pagesAt + BOOK.pageGap + BOOK.page) + BOOK.settle;
	return { travelAt, turnAt, openAt, pagesAt, openedAt, done: openedAt + BOOK.dive };
}

/** A diary's cover as it lies in your hands (AlbumStack coverOnly): linen in the year's colour, stitched edge,
 * elastic band, a paper name label, a sleepy face, the memory count, and a ribbon tab peeking out of the top. */
function DiaryCover({ year, count, width, height }) {
	const palette = yearPalette(year);
	return (
		<span className="lbd-cover2" style={{ width, height, '--c': palette.primary, '--c2': palette.secondary, '--ink': palette.ink }}>
			<span className="lbd-cover2-tab" style={{ background: palette.secondary }} />
			<span className="lbd-cover2-stitch" />
			<span className="lbd-cover2-band" />
			<span className="lbd-cover2-label" style={ty('month', { color: palette.ink, fontSize: width * 0.2, lineHeight: `${width * 0.24}px` })}>
				{year}
			</span>
			<svg className="lbd-cover2-face" width={width * 0.36} height={width * 0.14} viewBox="0 0 36 14" aria-hidden="true">
				<ellipse cx="4" cy="9" rx="4" ry="2.4" fill="#FF9DB0" opacity="0.55" />
				<ellipse cx="32" cy="9" rx="4" ry="2.4" fill="#FF9DB0" opacity="0.55" />
				<path d="M7 5 Q 10 8 13 5 M23 5 Q 26 8 29 5" stroke={palette.ink} strokeWidth="1.6" fill="none" strokeLinecap="round" />
				<path d="M15.5 9 Q 18 11.5 20.5 9" stroke={palette.ink} strokeWidth="1.5" fill="none" strokeLinecap="round" />
			</svg>
			<span className="lbd-cover2-count" style={ty('small', { color: palette.ink, borderColor: palette.secondary })}>
				{count}
			</span>
		</span>
	);
}

/** Ruled paper for the diary's pages. */
const ruledPaper = (bg) => `repeating-linear-gradient(to bottom, transparent 0 21px, rgba(91, 140, 201, 0.32) 21px 22px) 0 18px / 100% calc(100% - 30px) no-repeat, ${bg}`;

/**
 * Pulling a diary off the shelf, as the app does it: the spine tips out of its row and floats to the middle,
 * turns like a solid box onto its cover, the cover swings open over the top, two pages flutter over, the book
 * slides to centre the open spread (glow and sparkles), and then the view zooms into the right-hand page until
 * it is the year page. The year page is opened underneath, hidden by the paper, while the book turns.
 */
function DiaryFlight({ flight, W, H, dark, onPush, onDone }) {
	const palette = yearPalette(flight.year);
	const coverW = W * BOOK_COVER_SHARE;
	const coverH = coverW * 1.3;
	const hingeX = W / 2 - coverW / 2;
	const cy = H * BOOK_TARGET_Y;
	const top = cy - coverH / 2;
	const k = coverH / flight.h;
	const spineW = flight.w * k;
	const spread = coverW / 2;
	const pageCx = W / 2 + coverW / 2;
	const zoom = Math.max(W / coverW, H / coverH) * 1.08;
	const pageTint = dark ? '#ECE2CA' : palette.tint;
	const paper = '#FFFDF8';
	// The moving parts, collected as they mount (a plain holder: they are only read in the effect).
	const [parts] = useState(() => ({}));
	const set = (name) => (el) => {
		parts[name] = el;
	};
	const sparks = (() => {
		const rng = seededRng(`sparkle-${flight.year}`);
		return Array.from({ length: SPARKS }, (_, i) => ({
			angle: (i / SPARKS) * Math.PI * 2 + rng.range(-0.2, 0.2),
			distance: coverW * rng.range(0.8, 1.3),
			size: rng.range(18, 30),
			spin: rng.range(-90, 90),
			kind: ['star', 'heart', 'sun', 'star'][i % 4],
			color: i % 3 === 0 ? '#F5B23C' : i % 3 === 1 ? palette.primary : palette.secondary,
		}));
	})();

	useEffect(() => {
		const r = parts;
		const t = bookTimes();
		const anims = [];
		const go = (el, frames, opts) => {
			if (el) anims.push(el.animate(frames, { fill: 'both', ...opts }));
		};
		const persp = `perspective(${BOOK_PERSPECTIVE}px)`;
		// The room softens to paper as the book leaves the shelf (fully opaque before the year page opens under it).
		go(r.backdrop, [{ opacity: 0 }, { opacity: 0.4, offset: BOOK.pull / (t.travelAt + BOOK.travel) }, { opacity: 1 }], { duration: t.travelAt + BOOK.travel, easing: 'linear' });
		// The spine: tips forward and lifts out of its row, then floats to the middle in an arc, growing to the cover's height.
		const dx = flight.x - (hingeX - spineW);
		const dy = flight.y - top;
		const flyDur = t.travelAt + BOOK.travel;
		const pullEnd = BOOK.pull / flyDur;
		const startT = `translate(${dx}px, ${dy}px) scale(${1 / k})`;
		go(
			r.spineFly,
			[
				{ transform: `${startT} rotate(0deg)`, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' },
				{ transform: `translate(${dx}px, ${dy - 26}px) scale(${1.06 / k}) rotate(-4deg)`, offset: pullEnd, easing: 'cubic-bezier(0.45, 0, 0.3, 1)' },
				{ transform: `translate(${dx * 0.45}px, ${dy * 0.45 - BOOK_ARC}px) scale(${(1 / k + 1) / 2}) rotate(-5deg)`, offset: pullEnd + (1 - pullEnd) * 0.5, easing: 'cubic-bezier(0.3, 0, 0.3, 1)' },
				{ transform: 'translate(0px, 0px) scale(1) rotate(0deg)' },
			],
			{ duration: flyDur },
		);
		// …then turns away on its right edge as the cover comes round on the same edge, darkening as it turns from the light.
		go(r.spineTurn, [{ transform: `${persp} rotateY(0deg)` }, { transform: `${persp} rotateY(-90deg)` }], { delay: t.turnAt, duration: BOOK.turn, easing: EASE_INOUT });
		go(r.spineShade, [{ opacity: 0 }, { opacity: 0.5 }], { delay: t.turnAt, duration: BOOK.turn, easing: EASE_INOUT });
		go(r.spineFly, [{ visibility: 'visible' }, { visibility: 'hidden' }], { delay: t.turnAt + BOOK.turn - 10, duration: 10 });
		// The soft shadow under the book gathers as it comes to rest, and widens as it opens.
		go(r.shadow, [{ opacity: 0, transform: 'scaleX(0.6)' }, { opacity: 0.55, transform: 'scaleX(1)' }], { delay: t.travelAt, duration: BOOK.travel, easing: EASE_SOFT });
		go(r.shadowWide, [{ transform: 'translateX(0) scaleX(1)' }, { transform: `translateX(${spread}px) scaleX(1.85)` }], { delay: t.openAt, duration: BOOK.open, easing: COVER_EASE });
		// The cover: edge-on until the turn, faces you, then swings open over the top and lies flat on the left.
		const total = t.openAt + BOOK.open;
		go(
			r.cover,
			[
				{ transform: `${persp} rotateY(90deg)`, offset: 0 },
				{ transform: `${persp} rotateY(90deg)`, offset: t.turnAt / total, easing: EASE_INOUT },
				{ transform: `${persp} rotateY(0deg)`, offset: (t.turnAt + BOOK.turn) / total, easing: COVER_EASE },
				{ transform: `${persp} rotateY(0deg)`, offset: t.openAt / total, easing: COVER_EASE },
				{ transform: `${persp} rotateY(-180deg)`, offset: 1 },
			],
			{ duration: total },
		);
		go(r.coverShade, [{ opacity: 0.5 }, { opacity: 0 }], { delay: t.turnAt, duration: BOOK.turn, easing: EASE_INOUT });
		// Shown by visibility, not opacity: fading a 3D element flattens it, and its back face would show through.
		go(r.cover, [{ visibility: 'hidden' }, { visibility: 'visible' }], { delay: t.turnAt, duration: 2 });
		// The pages under the cover, there once the book has turned round; the whole book slides to centre the spread.
		go(r.block, [{ opacity: 0 }, { opacity: 1 }], { delay: t.turnAt + BOOK.turn * 0.9, duration: 60 });
		go(r.book, [{ transform: 'translateX(0px)' }, { transform: `translateX(${spread}px)` }], { delay: t.openAt, duration: BOOK.open, easing: COVER_EASE });
		// Two pages flutter over after the cover, one after the other.
		[r.page0, r.page1].forEach((el, i) => {
			go(el, [{ transform: `${persp} rotateY(0deg)` }, { transform: `${persp} rotateY(-180deg)` }], { delay: t.pagesAt + i * BOOK.pageGap, duration: BOOK.page, easing: PAGE_EASE });
			go(el, [{ visibility: 'hidden' }, { visibility: 'visible' }], { delay: t.turnAt + BOOK.turn * 0.95, duration: 2 });
		});
		// A warm glow grows behind the open book, and stars and hearts burst out of it.
		go(r.glow, [{ opacity: 0, transform: 'scale(0.6)' }, { opacity: 0.85, transform: 'scale(1.15)' }], { delay: t.openAt, duration: BOOK.open, easing: EASE_SOFT });
		sparks.forEach((s, i) => {
			const el = r[`spark${i}`];
			const x = Math.cos(s.angle) * s.distance;
			const y = Math.sin(s.angle) * s.distance * 0.75;
			go(
				el,
				[
					{ opacity: 0, transform: 'translate(0px, 0px) scale(0.3) rotate(0deg)' },
					{ opacity: 1, offset: 0.2 },
					{ opacity: 1, offset: 0.7 },
					{ opacity: 0, transform: `translate(${x}px, ${y}px) scale(1) rotate(${s.spin}deg)` },
				],
				{ delay: t.openAt + BOOK.open * 0.55 + i * 25, duration: BOOK.burst, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
			);
		});
		// The book zooms into its right-hand page until it fills the screen, the words fading first, then the page
		// fades into the real year page underneath.
		go(r.scene, [{ transform: 'translate(0px, 0px) scale(1)' }, { transform: `translate(${W / 2 - pageCx}px, ${H / 2 - cy}px) scale(${zoom})` }], { delay: t.openedAt, duration: BOOK.dive, easing: EASE_INOUT });
		go(r.words, [{ opacity: 1 }, { opacity: 0 }], { delay: t.openedAt, duration: BOOK.dive * 0.4 });
		go(r.root, [{ opacity: 1 }, { opacity: 0 }], { delay: t.openedAt + BOOK.dive * 0.55, duration: BOOK.dive * 0.45, easing: 'ease-in' });
		const timers = [setTimeout(onPush, t.turnAt), setTimeout(() => buzz(14), t.openAt + BOOK.open), setTimeout(onDone, t.done)];
		return () => {
			timers.forEach(clearTimeout);
			anims.forEach((a) => a.cancel());
		};
		// The flight plays once, from the spine it was given.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const face = { position: 'absolute', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' };
	const sheet = { width: coverW, height: coverH, borderRadius: 8, border: `0.6px solid ${withAlpha(palette.ink, 0.25)}`, overflow: 'hidden' };
	return (
		<div ref={set('root')} className="lbd-flight2" aria-hidden="true">
			<span ref={set('backdrop')} className="lbd-abs" style={{ inset: 0, background: 'var(--desk)' }} />
			<div ref={set('scene')} className="lbd-abs" style={{ inset: 0, transformOrigin: `${pageCx}px ${cy}px` }}>
				<span ref={set('glow')} className="lbd-abs" style={{ left: W / 2 - coverW * 1.2, top: cy - coverW * 1.2, width: coverW * 2.4, height: coverW * 2.4, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(245, 178, 60, 0.55) 0%, rgba(245, 178, 60, 0.22) 45%, rgba(245, 178, 60, 0) 100%)', opacity: 0 }} />
				<span ref={set('shadowWide')} className="lbd-abs" style={{ left: W / 2 - coverW * 0.65, top: cy + coverH / 2 - coverH * 0.06, width: coverW * 1.3, height: coverH * 0.16 }}>
					<span ref={set('shadow')} className="lbd-abs" style={{ inset: 0, borderRadius: '50%', background: `radial-gradient(closest-side, ${withAlpha(palette.ink, 0.5)}, ${withAlpha(palette.ink, 0)})`, opacity: 0 }} />
				</span>
				<div ref={set('book')} className="lbd-abs" style={{ left: 0, top: 0, width: W, height: H, transformStyle: 'preserve-3d' }}>
					{/* The pages under the cover: edges peeking out, and the first page (the year page in small). */}
					<div ref={set('block')} className="lbd-abs" style={{ left: hingeX, top, width: coverW, height: coverH, opacity: 0 }}>
						{[3, 2, 1].map((n) => (
							<span key={n} className="lbd-abs" style={{ ...sheet, left: n * 3, top: n * 3, background: n % 2 ? paper : '#FBF5E6' }} />
						))}
						<span className="lbd-abs lbd-center" style={{ ...sheet, left: 0, top: 0, flexDirection: 'column', background: pageTint }}>
							<span ref={set('words')} className="lbd-center" style={{ flexDirection: 'column' }}>
								<span style={ty('handLarge', { color: palette.primary, fontSize: coverW * 0.22, lineHeight: `${coverW * 0.26}px` })}>{flight.year}</span>
								<span style={ty('handSmall', { color: '#7A6A58', fontSize: coverW * 0.1 })}>
									{flight.count} {flight.count === 1 ? 'memory' : 'memories'}
								</span>
							</span>
							<span className="lbd-abs" style={{ left: 0, top: 0, bottom: 0, width: coverW * 0.1, background: palette.ink, opacity: 0.08 }} />
						</span>
					</div>
					{/* Two pages flutter over after the cover; the second's back says hello. */}
					{[0, 1].map((i) => (
						<div key={i} ref={set(`page${i}`)} className="lbd-abs" style={{ left: hingeX, top, width: coverW, height: coverH, transformOrigin: '0 50%', transformStyle: 'preserve-3d', visibility: 'hidden' }}>
							<span style={{ ...face, ...sheet, left: 0, top: 0, background: ruledPaper(paper) }} />
							<span className="lbd-center" style={{ ...face, ...sheet, left: 0, top: 0, transform: 'rotateY(180deg)', flexDirection: 'column', background: ruledPaper(paper) }}>
								{i === 1 && (
									<>
										<span style={ty('hand', { color: '#2A2118', fontSize: coverW * 0.12, lineHeight: `${coverW * 0.15}px`, textAlign: 'center' })}>
											hello again,
											<br />
											{flight.year}
										</span>
										<span style={ty('handSmall', { color: palette.primary, fontSize: coverW * 0.11 })}>✿ ♥ ✿</span>
									</>
								)}
							</span>
						</div>
					))}
					{/* The cover, which comes round on the spine's edge and swings open to its lining. */}
					<div ref={set('cover')} className="lbd-abs" style={{ left: hingeX, top, width: coverW, height: coverH, transformOrigin: '0 50%', transformStyle: 'preserve-3d', visibility: 'hidden' }}>
						<span style={{ ...face, left: 0, top: 0 }}>
							<DiaryCover year={flight.year} count={flight.count} width={coverW} height={coverH} />
							<span ref={set('coverShade')} className="lbd-abs" style={{ inset: 0, borderRadius: 10, background: '#2A2118', opacity: 0.5 }} />
						</span>
						<span className="lbd-center" style={{ ...face, left: 0, top: 0, width: coverW, height: coverH, borderRadius: 10, background: palette.primary, transform: 'rotateY(180deg)' }}>
							<span style={{ width: coverW * 0.78, height: coverH * 0.82, borderRadius: 8, background: palette.tint, opacity: 0.9 }} />
						</span>
					</div>
				</div>
				{/* The spine, as it left the shelf. */}
				<div ref={set('spineFly')} className="lbd-abs" style={{ left: hingeX - spineW, top, width: spineW, height: coverH, transformOrigin: '0 0' }}>
					<div ref={set('spineTurn')} style={{ width: spineW, height: coverH, transformOrigin: '100% 50%' }}>
						<div style={{ width: flight.w, height: flight.h, transform: `scale(${k})`, transformOrigin: '0 0', position: 'relative' }}>
							<BookSpine year={flight.year} count={flight.count} age={parseDate(TODAY).year - flight.year} />
							<span ref={set('spineShade')} className="lbd-abs" style={{ inset: 0, borderRadius: 6, background: '#2A2118', opacity: 0 }} />
						</div>
					</div>
				</div>
				{sparks.map((s, i) => (
					<span key={i} ref={set(`spark${i}`)} className="lbd-abs" style={{ left: W / 2 + spread - s.size / 2, top: cy - s.size / 2, opacity: 0 }}>
						<Sticker kind={s.kind} size={s.size} color={s.color} color2={palette.secondary} />
					</span>
				))}
			</div>
		</div>
	);
}

/* ---------- Version 1.2: voice, action bars, header (voice.ts, Waveform.tsx, Screen.tsx) ---------- */

/** A tiny tap on phones that can buzz (the app plays Android's own haptic effects). */
const buzz = (ms = 8) => {
	try {
		// Only after a real tap: browsers refuse (and log) vibration before the person has touched the page.
		if (typeof navigator !== 'undefined' && navigator.vibrate && navigator.userActivation?.hasBeenActive) navigator.vibrate(ms);
	} catch {
		// Haptics are best-effort.
	}
};

const mixHex = (a, b, t) => {
	const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
};

const WAVE_BARS = 32;
const MIN_BAR = 0.08;
const VOICE_MAX_MS = 60000;
const formatVoiceMs = (ms) => {
	const total = Math.max(0, Math.round((ms || 0) / 1000));
	return `${Math.floor(total / 60)}:${pad2(total % 60)}`;
};

/** The levels heard while recording, squeezed into 32 bars, loudest = full height (shapeWaveform). */
function shapeWaveform(levels, bars = WAVE_BARS) {
	if (!levels.length) return Array.from({ length: bars }, () => MIN_BAR);
	const out = [];
	for (let i = 0; i < bars; i++) {
		const from = Math.floor((i * levels.length) / bars);
		const to = Math.max(from + 1, Math.floor(((i + 1) * levels.length) / bars));
		let peak = 0;
		for (let j = from; j < to && j < levels.length; j++) peak = Math.max(peak, levels[j]);
		out.push(peak);
	}
	const loudest = Math.max(...out);
	return out.map((v) => Math.round(Math.max(MIN_BAR, loudest > 0 ? v / loudest : 0) * 100) / 100);
}

/** The hummed tune the sample voice notes play (src/dev/seedVoice.ts): a note per syllable. */
const NOTES = [262, 294, 330, 349, 392, 440, 494, 523];
const SYLLABLE = 0.32;
const SYLLABLE_GAP = 0.08;
function syllable(seed, k) {
	const r = mulberry32(seed + k * 7919);
	return { freq: NOTES[Math.floor(r() * NOTES.length)], loud: 0.35 + r() * 0.6 };
}
/** The waveform the recorder would have measured for that tune. */
function sampleWave(seed, seconds) {
	const levels = [];
	const r = mulberry32(seed);
	for (let t = 0; t < seconds; t += 0.08) {
		const k = Math.floor(t / (SYLLABLE + SYLLABLE_GAP));
		const inSyl = t - k * (SYLLABLE + SYLLABLE_GAP);
		levels.push(inSyl > SYLLABLE ? 0.02 : syllable(seed, k).loud * Math.sin((Math.PI * inSyl) / SYLLABLE) + r() * 0.04);
	}
	return shapeWaveform(levels);
}
/** Plays the hum from `from` to `to` seconds on a Web Audio context; returns the oscillators to stop. */
function hum(ctx, seed, from, to) {
	const nodes = [];
	const step = SYLLABLE + SYLLABLE_GAP;
	const now = ctx.currentTime + 0.02;
	for (let k = Math.floor(from / step); k * step < to; k++) {
		const start = Math.max(from, k * step);
		const end = Math.min(to, k * step + SYLLABLE);
		if (end <= start) continue;
		const { freq, loud } = syllable(seed, k);
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = 'triangle';
		osc.frequency.value = freq;
		const at = now + (start - from);
		const len = end - start;
		gain.gain.setValueAtTime(0, at);
		gain.gain.linearRampToValueAtTime(0.16 * loud, at + Math.min(0.06, len / 3));
		gain.gain.linearRampToValueAtTime(0, at + len);
		osc.connect(gain).connect(ctx.destination);
		osc.start(at);
		osc.stop(at + len + 0.02);
		nodes.push(osc);
	}
	return nodes;
}

/**
 * Plays a voice memory (useVoicePlayback.ts): Listen / Pause, picking up where it left off, rewinding at
 * the end. The demo can't ship real voices, so it plays the sample's hummed tune.
 */
function useVoicePlayer(voice) {
	const [state, setState] = useState({ seed: voice?.seed, playing: false, offset: 0, startedAt: 0 });
	const ctxRef = useRef(null);
	const nodes = useRef([]);
	const timer = useRef(null);
	const stopAudio = () => {
		nodes.current.forEach((n) => {
			try {
				n.stop();
			} catch {
				// Already stopped.
			}
		});
		nodes.current = [];
		clearTimeout(timer.current);
	};
	useEffect(() => () => ctxRef.current?.close?.(), []);
	// A new recording replaces the old one (or the page goes): stop the old sound.
	useEffect(() => () => stopAudio(), [voice?.seed]);
	// …and start the new one from the top.
	if (state.seed !== voice?.seed) setState({ seed: voice?.seed, playing: false, offset: 0, startedAt: 0 });
	if (!voice) return null;
	const dur = voice.ms;
	const toggle = () => {
		buzz();
		if (state.playing) {
			stopAudio();
			setState((s) => ({ ...s, playing: false, offset: Math.min(dur, s.offset + performance.now() - s.startedAt), startedAt: 0 }));
			return;
		}
		const offset = state.offset >= dur - 50 ? 0 : state.offset;
		try {
			const Ctx = window.AudioContext || window.webkitAudioContext;
			if (Ctx) {
				ctxRef.current = ctxRef.current || new Ctx();
				ctxRef.current.resume?.();
				nodes.current = hum(ctxRef.current, voice.seed, offset / 1000, dur / 1000);
			}
		} catch {
			// No sound in this browser: the waveform still plays.
		}
		setState((s) => ({ ...s, playing: true, offset, startedAt: performance.now() }));
		timer.current = setTimeout(() => {
			stopAudio();
			setState((s) => ({ ...s, playing: false, offset: 0, startedAt: 0 }));
		}, dur - offset);
	};
	return { playing: state.playing, offset: state.offset, dur, toggle };
}

const HEART_PATH = 'M12 21s-7.5-4.6-9.6-9.1C.8 8.4 2.9 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.8 0 5.9 3.9 4.3 7.4C19.5 16.4 12 21 12 21z';

/**
 * A voice memory's waveform: soft capsules lighter on top, loud where the voice was loud. As it plays,
 * the part heard fills in and a little heart rides along. `live`: recording (all filled, heart at the end).
 */
function Waveform({ wave, width, height, color, player, live = false }) {
	const theme = useTheme();
	const bars = wave && wave.length ? wave : Array.from({ length: WAVE_BARS }, () => MIN_BAR);
	const slot = width / bars.length;
	const barW = Math.max(2, slot * 0.6);
	const fill = `linear-gradient(180deg, ${mixHex(color, '#FFFFFF', 0.45)} 0%, ${color} 55%, ${mixHex(color, '#FFFFFF', 0.18)} 100%)`;
	const row = (
		<span className="lbd-wave-row" style={{ width, height }}>
			{bars.map((v, i) => (
				<span key={i} style={{ width: slot }}>
					<i style={{ width: barW, height: Math.max(barW, height * v), borderRadius: barW / 2, background: fill }} />
				</span>
			))}
		</span>
	);
	const playing = player?.playing;
	const at = live ? 1 : player ? player.offset / player.dur : 0;
	const anim = playing ? { animationDuration: `${player.dur}ms`, animationDelay: `-${player.offset}ms` } : null;
	const heart = Math.max(10, height * 0.5);
	const showHeart = live || playing || at > 0.001;
	return (
		<span className="lbd-wave" style={{ width, height }} aria-hidden="true">
			<span style={{ opacity: 0.32 }}>{row}</span>
			<span className={`lbd-wave-played ${playing ? 'is-playing' : ''}`} style={{ height, width: playing ? undefined : `${at * 100}%`, ...anim }}>
				{row}
			</span>
			{showHeart && (
				<span className={`lbd-wave-head ${playing ? 'is-playing' : ''}`} style={{ top: (height - heart) / 2, width: heart, height: heart, left: playing ? undefined : `${at * 100}%`, ...anim }}>
					<svg viewBox="0 0 24 24" width={heart} height={heart} className={playing || live ? 'lbd-heart-beat' : ''}>
						<path d={HEART_PATH} fill={color} stroke={theme.colors.paperWhite} strokeWidth={2.4} strokeLinejoin="round" />
					</svg>
				</span>
			)}
		</span>
	);
}

function PlayButton({ size, color, player, label }) {
	const theme = useTheme();
	const Icon = player?.playing ? IoPause : IoPlay;
	const face = (
		<span className="lbd-center" style={{ width: size, height: size, borderRadius: '50%', background: color, flex: 'none' }}>
			<Icon size={size * 0.5} color={theme.colors.paperWhite} style={{ marginLeft: player?.playing ? 0 : size * 0.06 }} />
		</span>
	);
	if (!player) return face;
	return (
		<button
			type="button"
			className="lbd-pressable"
			aria-label={player.playing ? 'Pause the voice note' : `Play the voice note, ${label}`}
			onClick={(event) => {
				event.stopPropagation();
				player.toggle();
			}}
			style={{ padding: 0, border: 0, background: 'none', cursor: 'pointer', borderRadius: '50%' }}
		>
			{face}
		</button>
	);
}

/** The listening row: play button, waveform, length (on a polaroid's strip under its photo). */
function VoiceRow({ voice, width, height, color, player }) {
	const theme = useTheme();
	const button = Math.round(height * 0.86);
	const fontSize = Math.max(14, height * 0.42);
	const labelW = fontSize * 1.9;
	const label = formatVoiceMs(voice.ms);
	return (
		<span style={{ display: 'flex', alignItems: 'center', gap: 8, width, height }}>
			<PlayButton size={button} color={color} player={player} label={label} />
			<Waveform wave={voice.wave} width={Math.max(0, width - button - labelW - 16)} height={height} color={color} player={player} />
			<span style={ty('hand', { fontSize, lineHeight: `${fontSize * 1.15}px`, color: theme.colors.inkMuted, width: labelW, textAlign: 'right' })}>{label}</span>
		</span>
	);
}

/** A voice memory with no photo: its waveform, big, is the picture. */
function SoundPrint({ size, tint, voice, player }) {
	const theme = useTheme();
	return (
		<span
			className="lbd-abs lbd-center"
			style={{ inset: 0, flexDirection: 'column', gap: 16, background: `radial-gradient(circle farthest-corner at 40% 35%, ${withAlpha(tint, 0.1)} 0%, ${withAlpha(tint, 0.32)} 100%), ${theme.colors.paper}` }}
		>
			<Waveform wave={voice.wave} width={size * 0.8} height={size * 0.4} color={tint} player={player} />
			<span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<PlayButton size={Math.round(size * 0.17)} color={tint} player={player} label={formatVoiceMs(voice.ms)} />
				<span style={ty('label', { fontSize: size * 0.09, lineHeight: `${size * 0.11}px`, color: theme.colors.ink })}>{formatVoiceMs(voice.ms)}</span>
			</span>
		</span>
	);
}

/** A little hand-drawn garden wall for the bunny to peek over (BrickWall.tsx). */
function BrickWall({ width, height }) {
	if (width <= 0 || height <= 0) return null;
	const BRICK = ['#C9765A', '#C9765A', '#DB8E70', '#A95F47'];
	const cap = 5;
	const gap = 2;
	const rows = Math.max(2, Math.round((height - cap) / 13));
	const rowH = (height - cap - gap * (rows + 1)) / rows;
	const perRow = 3;
	const brickW = (width - gap * (perRow + 1)) / perRow;
	const r = mulberry32(7);
	const bricks = [];
	for (let row = 0; row < rows; row++) {
		const y = cap + gap + row * (rowH + gap);
		const shift = row % 2 ? -brickW / 2 : 0;
		for (let i = 0; i <= perRow; i++) {
			const x0 = gap + shift + i * (brickW + gap);
			const x = Math.max(gap, x0);
			const w = Math.min(width - gap, x0 + brickW) - x;
			if (w > 2) bricks.push({ x, y, w, fill: BRICK[Math.floor(r() * BRICK.length)] });
		}
	}
	return (
		<svg width={width} height={height} aria-hidden="true" style={{ display: 'block', position: 'relative' }}>
			<rect x={0.5} y={cap / 2} width={width - 1} height={height - cap / 2 - 0.5} rx={4} fill="#F1E2C8" stroke="#7E4E3A" />
			{bricks.map((b, i) => (
				<rect key={i} x={b.x} y={b.y} width={b.w} height={rowH} rx={3} fill={b.fill} stroke="#7E4E3A" strokeWidth={0.8} strokeOpacity={0.6} />
			))}
			<rect x={0} y={0} width={width} height={cap + 1} rx={cap / 2} fill="#DB8E70" stroke="#7E4E3A" />
		</svg>
	);
}

/**
 * The top of a page (PageHeader): the title with its highlighter swipe, one handwritten line, and the
 * bunny peeking in, exactly as tall as the words beside it; with `wall`, over a little brick wall.
 */
function PageHeader({ title, count, subtitle, accent, buddyAccent, buddy = true, bump, wall = false }) {
	const theme = useTheme();
	const [ref, size] = useSize();
	const textH = size.h;
	const peek = 0.68;
	const baseWall = wall ? Math.round(textH * 0.3) : 0;
	const tuck = Math.round(baseWall * 0.45);
	const buddySize = textH > 0 ? Math.min((textH - baseWall + tuck) / peek, 96) : 0;
	const sink = wall ? Math.min(tuck, Math.round(buddySize * peek * 0.15)) : 0;
	const wallH = wall ? Math.round(textH - buddySize * peek + sink) : 0;
	const flower = subtitle?.endsWith('✿');
	return (
		<div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
			<div ref={ref} style={{ flex: 1 }}>
				<ScreenTitle title={title} count={count} accent={accent} />
				{subtitle && (
					<p style={ty('hand', { color: theme.colors.onDeskMuted, marginTop: 4, whiteSpace: 'pre-line' })}>
						{flower ? subtitle.slice(0, -1) : subtitle}
						{flower && <span style={{ color: theme.nav.tape2 }}>✿</span>}
					</p>
				)}
			</div>
			{buddy && buddySize > 0 && (
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Buddy mood="peek" accent={buddyAccent || accent} size={buddySize} bump={bump} tappable style={wall ? { marginBottom: -sink } : undefined} />
					{wall && <BrickWall width={Math.round(buddySize * 1.05)} height={wallH} />}
				</div>
			)}
		</div>
	);
}

/**
 * A page's own buttons in one taped, stitched paper bar at the bottom, where the thumb is (ActionRow):
 * equal places of icon + handwritten label; the main action a tilted sticker capsule with a white rim.
 */
function ActionRow({ actions, lead, tapes = true }) {
	const theme = useTheme();
	const { colors } = theme;
	const nav = theme.nav;
	return (
		<div style={{ position: 'relative' }}>
			<div className="lbd-actrow" style={{ background: nav.strip, borderColor: nav.edge, boxShadow: `0 3px 0 ${nav.shadow}` }}>
				<span className="lbd-actrow-stitch" style={{ borderColor: nav.stitch }} />
				{lead}
				{actions.map((a) => {
					const fg = a.primary ? nav.rim : a.tint || (a.active ? nav.ink : nav.inkMuted);
					const Icon = a.icon;
					return (
						<button
							key={a.key}
							type="button"
							className="lbd-act lbd-pressable"
							disabled={a.disabled}
							aria-label={a.ariaLabel || a.label}
							aria-pressed={a.active === undefined ? undefined : !!a.active}
							onClick={() => {
								buzz();
								a.onClick();
							}}
							style={{ flex: a.primary ? 1.4 : 1 }}
						>
							<span
								className="lbd-act-in"
								style={
									a.primary
										? { background: a.primary, border: `2.5px solid ${nav.rim}`, transform: 'rotate(-2deg)', boxShadow: theme.shadow(a.primary, 0.6) }
										: a.active
											? { background: nav.active }
											: null
								}
							>
								<Icon size={22} color={fg} />
								<span style={ty('small', { color: a.primary ? nav.rim : a.active || a.tint ? nav.ink : nav.inkMuted, whiteSpace: 'nowrap' })}>{a.label}</span>
							</span>
						</button>
					);
				})}
			</div>
			{tapes && (
				<>
					<WashiTape width={52.8} color={nav.tape} color2={nav.rim} pattern="stripes" angle={-24} style={{ left: -12, top: -8, zIndex: 2 }} />
					<WashiTape width={52.8} color={nav.tape2} color2={nav.rim} pattern="dots" angle={22} style={{ right: -12, top: -8, zIndex: 2 }} />
				</>
			)}
		</div>
	);
}

/** The bar at a pushed page's foot; anything above it (a sheet, the voice strip) rises out of it. */
function ActionBar({ actions, children }) {
	return (
		<div className="lbd-actions">
			{children}
			<ActionRow actions={actions} />
		</div>
	);
}

/** A question asked on paper (ConfirmSheet): the bunny peeking over a taped card, "Keep it" + the action. */
function ConfirmSheet({ title, message, confirmLabel, confirmIcon, onConfirm, onCancel }) {
	const theme = useTheme();
	const palette = yearPalette(parseDate(TODAY).year);
	return (
		<div className="lbd-confirm" role="dialog" aria-modal="true" aria-label={title}>
			<button type="button" className="lbd-confirm-scrim" aria-label="Keep it" onClick={onCancel} />
			<div className="lbd-confirm-card">
				<div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 24, marginBottom: -2 }}>
					<Buddy mood="peek" size={110} accent={palette.primary} entrance={false} />
				</div>
				<Panel seed="confirm" accent={palette.primary} accent2={palette.secondary}>
					<p style={ty('heading', { color: theme.colors.ink })}>{title}</p>
					<p style={ty('caption', { color: theme.colors.inkMuted, marginTop: 8 })}>{message}</p>
					<div style={{ display: 'flex', gap: 12, marginTop: 16, marginBottom: 8 }}>
						<PillButton label="Keep it" icon={IoHeartOutline} grow onClick={onCancel} />
						<PillButton label={confirmLabel} icon={confirmIcon} tone="dark" grow onClick={onConfirm} />
					</div>
				</Panel>
			</div>
		</div>
	);
}

/**
 * Recording a voice note (VoiceRecorder.tsx), simulated in the browser: the waveform draws itself from a
 * made-up level meter (no microphone is used), up to a minute; Done keeps it.
 */
function useVoiceRecording(onDone) {
	const [rec, setRec] = useState({ recording: false, elapsed: 0, levels: [] });
	const timer = useRef(null);
	const started = useRef(0);
	const seed = useRef(1);
	const stop = () => {
		clearInterval(timer.current);
		setRec((r) => {
			if (r.recording && r.elapsed >= 500) {
				const voice = { wave: shapeWaveform(r.levels), ms: Math.round(r.elapsed), seed: seed.current };
				setTimeout(() => onDone(voice), 0);
			}
			return { ...r, recording: false };
		});
		buzz(12);
	};
	const start = () => {
		buzz(12);
		seed.current = Math.floor(Math.random() * 1e6) + 1;
		started.current = performance.now();
		const r = mulberry32(seed.current);
		setRec({ recording: true, elapsed: 0, levels: [] });
		clearInterval(timer.current);
		timer.current = setInterval(() => {
			const t = (performance.now() - started.current) / 1000;
			const k = Math.floor(t / (SYLLABLE + SYLLABLE_GAP));
			const inSyl = t - k * (SYLLABLE + SYLLABLE_GAP);
			const level = inSyl > SYLLABLE ? 0.03 : syllable(seed.current, k).loud * Math.sin((Math.PI * inSyl) / SYLLABLE) + r() * 0.05;
			setRec((s) => ({ ...s, elapsed: t * 1000, levels: [...s.levels, level] }));
			if (t * 1000 >= VOICE_MAX_MS) stop();
		}, 80);
	};
	useEffect(() => () => clearInterval(timer.current), []);
	return { ...rec, start, stop };
}

/** The slim strip above the writing page's bar: recording (waveform + time + Done), or Listen · Re-record · Remove. */
function VoiceStrip({ rec, voice, player, onRemove, accent }) {
	const theme = useTheme();
	const [waveRef, waveSize] = useSize();
	if (!rec.recording && !voice) return null;
	const live = rec.levels.slice(-WAVE_BARS);
	const liveWave = [...Array.from({ length: WAVE_BARS - live.length }, () => 0.06), ...live];
	const lead = rec.recording ? (
		<span style={{ flex: 2.6, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12, minWidth: 0 }}>
			<span className="lbd-rec-dot" style={{ background: accent }} />
			<span ref={waveRef} style={{ flex: 1, height: 28, minWidth: 0 }}>
				{waveSize.w > 0 && <Waveform wave={liveWave} width={waveSize.w} height={28} color={accent} live />}
			</span>
			<span style={ty('label', { color: theme.colors.ink })}>{formatVoiceMs(rec.elapsed)}</span>
		</span>
	) : (
		<span className="lbd-center" style={{ flex: 1, flexDirection: 'column', gap: 1 }}>
			<IoMic size={22} color={accent} />
			<span style={ty('small', { color: theme.colors.inkMuted })}>{formatVoiceMs(voice.ms)}</span>
		</span>
	);
	const actions = rec.recording
		? [{ key: 'done', icon: IoStop, label: 'Done', primary: accent, ariaLabel: 'Stop recording', onClick: rec.stop }]
		: [
				...(player ? [{ key: 'listen', icon: player.playing ? IoPause : IoPlay, label: player.playing ? 'Pause' : 'Listen', tint: accent, active: player.playing, onClick: player.toggle }] : []),
				{
					key: 'again',
					icon: IoMicOutline,
					label: 'Re-record',
					ariaLabel: 'Record the voice note again',
					onClick: () => {
						if (player?.playing) player.toggle();
						rec.start();
					},
				},
				{ key: 'remove', icon: IoTrashOutline, label: 'Remove', ariaLabel: 'Remove the voice note', onClick: onRemove },
			];
	return (
		<div className="lbd-rise-in">
			<ActionRow lead={lead} actions={actions} tapes={false} />
		</div>
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
				<PageHeader title="LookBack" subtitle="one small thing a day ✿" accent={thisYear.secondary} buddyAccent={thisYear.primary} wall />
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
								<Buddy mood="happy" accent={thisYear.primary} size={64} tappable />
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
				<PageHeader
					title="Years"
					count={years.length || undefined}
					subtitle={oldest !== undefined ? `${entries.length} memories since ${oldest}.\nTap a diary to open it.` : 'Your diaries will stand here.'}
					accent={palette.secondary}
					buddyAccent={palette.primary}
					wall
				/>
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
function YearPage({ year, entries, tidy, onTidy, onBack, go, reduceMotion, scrollRef, stackAfter = 0 }) {
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
		<>
		<Page id={`year-${year}`} on scrollRef={scrollRef} className="lbd-page-bar" style={{ '--page': theme.dark ? undefined : palette.tint }}>
			<div style={{ marginBottom: 32 }}>
				<PageHeader
					title={String(year)}
					count={entries.length}
					subtitle={tidy ? 'sorted by month ✿' : 'all in one happy pile ✿'}
					accent={palette.secondary}
					buddyAccent={palette.primary}
					bump={tidy ? 1 : 0}
				/>
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
								<div className="lbd-fall" style={{ animationDelay: reduceMotion ? '0ms' : `${stackAfter + 120 + z * 55}ms` }}>
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
		{/* Inside a diary its own buttons replace the main bar: Back, and Tidy up / Scatter. */}
		<ActionBar
			actions={[
				{ key: 'back', icon: IoChevronBack, label: 'Back', tint: palette.primary, onClick: onBack },
				...(entries.length > 1 ? [{ key: 'tidy', icon: tidy ? IoShuffle : IoAlbumsOutline, label: tidy ? 'Scatter' : 'Tidy up', tint: palette.primary, active: tidy, onClick: onTidy }] : []),
			]}
		/>
		</>
	);
}

function MemoryPage({ entry, onBack, go, onDelete }) {
	const theme = useTheme();
	const year = parseDate(entry.localDate).year;
	const palette = yearPalette(year);
	const player = useVoicePlayer(entry.voice);
	const [asking, setAsking] = useState(false);
	// A polaroid whose words are on its back turns over (with a voice note and a photo, the words are always on the back).
	const [flipped, setFlipped] = useState(false);
	const isPolaroid = entry.photo != null || !!entry.voice;
	const hasBack = isPolaroid && planPolaroidWords(entry.text, entry.photo != null && !!entry.voice).back !== null;
	const actions = [{ key: 'back', icon: IoChevronBack, label: 'Back', tint: palette.primary, onClick: onBack }];
	if (player) actions.push({ key: 'play', icon: player.playing ? IoPause : IoPlay, label: player.playing ? 'Pause' : 'Listen', tint: palette.primary, active: player.playing, onClick: player.toggle });
	if (hasBack) actions.push({ key: 'turn', icon: IoSyncOutline, label: flipped ? 'Turn back' : 'Turn over', tint: palette.primary, active: flipped, onClick: () => setFlipped((f) => !f) });
	actions.push({ key: 'delete', icon: IoTrashOutline, label: 'Delete', ariaLabel: 'Delete this memory', onClick: () => setAsking(true) });
	return (
		<>
			<Page id={`memory-${entry.id}`} on className="lbd-page-bar">
				<div className="lbd-stack-xl">
					{/* The date is the title; how long ago it was goes under it. */}
					<PageHeader title={monthDay(entry.localDate)} subtitle={`${memoryKicker(entry.localDate, TODAY)} · ${year}`} accent={palette.secondary} buddyAccent={palette.primary} />
					<div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
						<ScrapObject
							entry={entry}
							width={theme.width * 0.84}
							stamp={!flipped}
							lift={1.6}
							player={player}
							flipped={flipped}
							onPress={player && !flipped ? player.toggle : hasBack ? () => setFlipped((f) => !f) : undefined}
							label={player && !flipped ? 'Play the voice note' : hasBack ? 'Turn it over' : undefined}
						/>
					</div>
					<p style={ty('hand', { color: theme.colors.onDeskMuted, textAlign: 'right', transform: 'rotate(-2deg)' })}>saved on {displayDate(entry.createdAt)}</p>
					<PageFooter label={`a page from ${year}`} />
				</div>
			</Page>
			{/* The page's own buttons at the foot, where the thumb is; the main bar steps aside inside a memory. */}
			<ActionBar actions={actions} />
			{asking && (
				<ConfirmSheet
					title="Let this one go?"
					message={`Bun will forget the page from ${displayDate(entry.localDate)}${entry.photo != null ? ', photo and all' : entry.voice ? ', voice and all' : ''}. It leaves this phone now and your Drive backup at the next backup. There's no getting it back.`}
					confirmLabel="Shred it"
					confirmIcon={IoCutOutline}
					onConfirm={() => {
						setAsking(false);
						buzz(20);
						onDelete(entry);
					}}
					onCancel={() => setAsking(false)}
				/>
			)}
		</>
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
	/** What opens above the bar: the photo choices, or the sticker / tape options. */
	const [part, setPart] = useState(null);
	const [celebrating, setCelebrating] = useState(null);
	const [voice, setVoice] = useState(existing?.voice ?? null);
	const [askRemove, setAskRemove] = useState(false);
	/** A photo with a voice note: its words are written on the back, so it can be turned over. */
	const [onBack, setOnBack] = useState(false);
	const player = useVoicePlayer(voice);
	const rec = useVoiceRecording(setVoice);
	const previewRef = useRef(null);
	const pageRef = useRef(null);
	const pageW = theme.contentW;

	const pick = (source) => {
		const at = PICKS.indexOf(photo);
		setPhoto(source === 'camera' ? PICKS[(at + 3) % PICKS.length] : PICKS[(at + 1) % PICKS.length]);
		setSetAside(null);
		setDevelop((d) => d + 1);
		setMode('photo');
		setPart(null);
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
		setPart(next);
		const page = pageRef.current;
		const preview = previewRef.current;
		if (page && preview) page.scrollTo({ top: preview.offsetTop - 12, behavior: reduceMotion ? 'auto' : 'smooth' });
	};

	const canSave = !celebrating && !rec.recording && (mode === 'photo' ? photo != null : text.trim().length > 0 || voice != null);
	const entry = {
		id: TODAY_ID,
		localDate: TODAY,
		text: text.trim(),
		photo: mode === 'photo' ? photo : null,
		voice,
		createdAt: TODAY,
		objectType: null,
		tapePattern: tape,
		sticker,
		stickerColor,
		tapeColor,
	};
	const preview = { ...entry, text };
	const seededLook = lookForEntry(preview);
	// You type on the paper itself, so its kind must not change mid-sentence: a note's paper is picked once (as if
	// for a short note) and only a ticket turns into a torn note when the words outgrow it.
	const shortType = lookForEntry({ ...preview, text: 'a', photo: null }).objectType;
	const noteType = shortType === 'ticket' && text.length <= 70 ? 'ticket' : 'tornNote';
	const previewLook = mode === 'photo' ? { ...seededLook, objectType: 'polaroid' } : { ...seededLook, objectType: noteType };
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

	// Photo and Style open right above the bar, in view without scrolling (1.2).
	const sheet = part ? (
		<div key={part === 'photo' ? 'photo' : 'style'} className="lbd-rise-in lbd-sheet" style={{ background: colors.panel, boxShadow: theme.shadow(undefined, 1) }}>
			{part === 'photo' ? (
				<>
					<p style={ty('label', { color: colors.ink })}>{photo != null && mode === 'photo' ? 'Another photo?' : 'Add a photo'}</p>
					<div style={{ display: 'flex', gap: 12 }}>
						<PillButton label="Library" icon={IoImagesOutline} grow onClick={() => pick('library')} />
						<PillButton label="Camera" icon={IoCameraOutline} grow onClick={() => pick('camera')} />
					</div>
					{photo != null && voice && <PillButton label={onBack ? 'Back to the photo' : 'Write on the back'} icon={IoSyncOutline} color={palette.primary} onClick={() => setOnBack((b) => !b)} />}
				</>
			) : (
				<>
					<SlidingToggle options={PARTS} value={part} onChange={setPart} accent={palette.secondary} label="Sticker or tape" />
					<div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', maxHeight: 300 }}>
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
				</>
			)}
		</div>
	) : null;
	const actions = [
		{ key: 'close', icon: IoClose, label: 'Close', onClick: onClose },
		{ key: 'photo', icon: IoCameraOutline, label: 'Photo', tint: palette.primary, active: part === 'photo', onClick: () => setPart((p) => (p === 'photo' ? null : 'photo')) },
		{ key: 'style', icon: IoColorPaletteOutline, label: 'Style', tint: palette.primary, active: part === 'sticker' || part === 'tape', onClick: () => setPart((p) => (p === 'sticker' || p === 'tape' ? null : 'sticker')) },
		// Voice records (and stops); once there is a note, the strip above has Listen · Re-record · Remove.
		...(voice && !rec.recording
			? []
			: [{ key: 'voice', icon: rec.recording ? IoStop : IoMicOutline, label: rec.recording ? 'Stop' : 'Voice', tint: palette.primary, active: rec.recording, onClick: () => { setPart(null); if (rec.recording) rec.stop(); else rec.start(); } }]),
		{ key: 'save', icon: IoCheckmark, label: existing ? 'Update' : 'Save', primary: colors.green, disabled: !canSave, onClick: save },
	];

	return (
		<>
		<Page id="entry" on scrollRef={pageRef} className="lbd-page-entry">
			<div className="lbd-stack-xl">
				<ScreenTitle title="Today" count={monthDay(TODAY)} accent={palette.secondary} />
				<SlidingToggle options={MODES} value={mode} onChange={changeMode} accent={palette.primary} label="Kind of memory" />
				<div ref={previewRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0 12px', gap: 16 }} aria-live="polite">
					<ScrapObject
						key={develop}
						entry={preview}
						look={previewLook}
						develop={develop > 0}
						width={pageW * 0.8}
						player={player}
						flipped={onBack}
						editor={{
							value: text,
							onChange: setText,
							placeholder: 'A note, a quote, anything small…',
							label: mode === 'photo' ? 'Words on the polaroid' : "Today's note",
							onFocus: () => setPart(null),
							focusSide: true,
						}}
						onPress={mode === 'photo' && photo == null ? () => pick('library') : photo != null && voice ? () => setOnBack((b) => !b) : undefined}
						label="Pick a photo"
						onPressTape={() => openPart('tape')}
						onPressSticker={() => openPart('sticker')}
					/>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'stretch' }}>
						<Buddy mood={photo != null && mode === 'photo' ? 'cheer' : text.trim() ? 'happy' : 'wave'} accent={palette.primary} size={51.2} bump={`${text.length}-${develop}`} tappable />
						<p style={ty('small', { color: colors.onDeskMuted, flex: 1 })}>
							{canSave
								? `Lovely. I'll bring this back on ${displayDate(shiftYears(TODAY, 1))}. Decorate it from the buttons below.`
								: mode === 'photo'
									? photo != null
										? 'Write on the strip under the photo. Longer words go on the back: P.T.O!'
										: 'Tap the polaroid (or Photo below) to pick a photo, then write on it.'
									: 'Write right on the paper, or say it out loud with Voice.'}
						</p>
					</div>
				</div>
			</div>
		</Page>
		<ActionBar actions={actions}>
			{sheet}
			<VoiceStrip rec={rec} voice={rec.recording ? null : voice} player={player} onRemove={() => setAskRemove(true)} accent={palette.primary} />
		</ActionBar>
		{askRemove && (
			<ConfirmSheet
				title="Take your voice off?"
				message={`Only the voice note goes; your words${photo != null ? ' and photo' : ''} stay.`}
				confirmLabel="Remove it"
				confirmIcon={IoTrashOutline}
				onConfirm={() => {
					setAskRemove(false);
					if (player?.playing) player.toggle();
					setVoice(null);
					setOnBack(false);
				}}
				onCancel={() => setAskRemove(false)}
			/>
		)}
		{celebrating && <Celebration entry={celebrating} palette={palette} />}
		</>
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
				<PageHeader title="Settings" subtitle="make this notebook yours ✿" accent={palette.secondary} buddyAccent={palette.primary} />

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


function NavTab({ icon: Icon, activeIcon: ActiveIcon, label, active, onClick }) {
	const theme = useTheme();
	const Shown = active && ActiveIcon ? ActiveIcon : Icon;
	return (
		<button type="button" className="lbd-tab lbd-pressable" aria-current={active ? 'page' : undefined} aria-label={label} onClick={onClick}>
			<Shown size={22} color={active ? theme.nav.ink : theme.nav.inkMuted} style={{ position: 'relative' }} />
			<span style={ty('small', { color: active ? theme.nav.ink : theme.nav.inkMuted, position: 'relative' })}>{label}</span>
		</button>
	);
}

/** Rounded strip outline, `inset` in from the edge (for the stitch). */
function stripPath(w, h, inset = 0) {
	const r = 22 - inset;
	const [l, t, rt, b] = [inset, inset, w - inset, h - inset];
	return `M ${l + r} ${t} L ${rt - r} ${t} Q ${rt} ${t} ${rt} ${t + r} L ${rt} ${b - r} Q ${rt} ${b} ${rt - r} ${b} L ${l + r} ${b} Q ${l} ${b} ${l} ${b - r} L ${l} ${t + r} Q ${l} ${t} ${l + r} ${t} Z`;
}

const NAV_TABS = [
	{ key: 'home', label: 'Home', icon: IoHomeOutline, activeIcon: IoHome },
	{ key: 'years', label: 'Years', icon: IoLibraryOutline, activeIcon: IoLibrary },
	{ key: 'settings', label: 'Settings', icon: IoSettingsOutline, activeIcon: IoSettings },
];

/**
 * The bar at the foot of Home, Years and Settings (NavBar.tsx): a stitched strip of the chosen paper,
 * taped at both ends, with three equal places and a highlight under the page you're on; beside it the
 * round + sticker with bunny ears that writes today (green once written, a pencil to edit).
 */
function NavBar({ hidden, tab, written, onTab, onWrite }) {
	const theme = useTheme();
	const { colors, nav } = theme;
	const w = theme.width - 40;
	const h = 72;
	const d = 62;
	const gap = 8;
	const stripW = w - d - gap;
	const slot = stripW / NAV_TABS.length;
	const on = NAV_TABS.findIndex((t) => t.key === tab);
	const fill = written ? colors.green : nav.plus;
	const tapeW = 52.8;
	return (
		<nav className={`lbd-nav ${hidden ? 'is-hidden' : ''}`} aria-label="Pages" inert={hidden} style={{ height: h }}>
			<svg width={stripW} height={h + 3} className="lbd-abs" style={{ left: 0, top: 0, overflow: 'visible' }} aria-hidden="true">
				<path d={stripPath(stripW, h)} fill={nav.shadow} transform="translate(0 3)" />
				<path d={stripPath(stripW, h)} fill={nav.strip} stroke={nav.edge} strokeWidth={1} />
				<path d={stripPath(stripW, h, 5)} fill="none" stroke={nav.stitch} strokeWidth={1.4} strokeDasharray="5 4" strokeLinecap="round" />
			</svg>
			<WashiTape width={tapeW} color={nav.tape} color2={nav.rim} pattern="stripes" angle={-24} style={{ left: -12, top: -8, zIndex: 2 }} />
			<WashiTape width={tapeW} color={nav.tape2} color2={nav.rim} pattern="dots" angle={22} style={{ left: stripW - tapeW + 12, top: -8, zIndex: 2 }} />
			<div className="lbd-nav-tabs" style={{ width: stripW, height: h }}>
				{on >= 0 && <span className="lbd-nav-pill" style={{ left: on * slot + 9, width: slot - 18, background: nav.active }} />}
				{NAV_TABS.map((t) => (
					<NavTab key={t.key} icon={t.icon} activeIcon={t.activeIcon} label={t.label} active={tab === t.key} onClick={() => onTab(t.key)} />
				))}
			</div>
			<div className="lbd-nav-plus" style={{ left: stripW + gap, width: d, height: h }}>
				<span className="lbd-ears" style={{ top: (h - d) / 2 - d * 0.32, width: d }} aria-hidden="true">
					{[-16, 16].map((r) => (
						<i key={r} style={{ transform: `rotate(${r}deg)`, background: nav.rim, borderColor: nav.edge }}>
							<b style={{ background: colors.buddyEar }} />
						</i>
					))}
				</span>
				<button
					type="button"
					className="lbd-plus lbd-pressable"
					onClick={onWrite}
					aria-label={written ? "Edit today's memory" : "Write today's memory"}
					style={{ width: d, height: d, background: fill, borderColor: nav.rim, boxShadow: theme.shadow(fill, 1.2) }}
				>
					{written ? <IoCreate size={26.4} color={nav.rim} /> : <IoAdd size={33} color={nav.rim} />}
				</button>
			</div>
		</nav>
	);
}

/* ---------- The app ---------- */

/**
 * The phone keeps the real device's screen size (OnePlus Nord 5: 1272 × 2800 px at 560 dpi = 363 × 800 dp), so every layout wraps as it does on
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
	const [deleted, setDeleted] = useState(() => new Set());
	const entries = (todayEntry ? [...sampleSet(), todayEntry] : sampleSet()).filter((e) => !deleted.has(e.id));

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

	// Pulling a diary off the shelf: the whole flight (DiaryFlight) plays over the page; the year opens underneath.
	const openYear = (year, spineEl) => {
		if (flight) return;
		if (reduceMotion || !spineEl || !rootRef.current) {
			push({ type: 'year', year });
			return;
		}
		const root = rootRef.current.getBoundingClientRect();
		const rect = spineEl.getBoundingClientRect();
		const scale = root.width / rootRef.current.offsetWidth || 1;
		buzz(10);
		setFlight({
			year,
			count: entries.filter((e) => parseDate(e.localDate).year === year).length,
			x: (rect.left - root.left) / scale,
			y: (rect.top - root.top) / scale,
			w: rect.width / scale,
			h: rect.height / scale,
			key: (flight?.key ?? 0) + 1 + year,
		});
	};

	const top = stack[stack.length - 1];
	// The main bar is for Home / Years / Settings only: pages you open into have their own bar (1.2).
	const pushed = !!top;
	const toggleTidy = () => {
		yearRef.current?.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
		setTidy((t) => !t);
	};
	const deleteEntry = (entry) => {
		setDeleted((d) => new Set(d).add(entry.id));
		if (entry.id === todayEntry?.id) setTodayEntry(null);
		pop();
		toast('Let go. All gone ✿');
	};

	const renderRoute = (route) => {
		if (route.type === 'year') {
			return (
				<YearPage
					year={route.year}
					entries={entries.filter((e) => parseDate(e.localDate).year === route.year)}
					tidy={tidy}
					onTidy={toggleTidy}
					// Opened from the shelf, the page waits under the book; its memories stack on after the reveal.
					stackAfter={route.flown ? bookTimes().done - bookTimes().turnAt : 0}
					onBack={pop}
					go={push}
					reduceMotion={reduceMotion}
					scrollRef={route === top ? yearRef : undefined}
				/>
			);
		}
		if (route.type === 'memory') {
			const entry = entries.find((e) => e.id === route.id);
			return entry ? <MemoryPage entry={entry} onBack={pop} go={push} onDelete={deleteEntry} /> : null;
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
					<DiaryFlight
						key={flight.key}
						flight={flight}
						W={width}
						H={rootSize.h || SCREEN.h}
						dark={theme.dark}
						onPush={() => push({ type: 'year', year: flight.year, flown: true })}
						onDone={() => setFlight(null)}
					/>
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
					hidden={pushed}
					tab={stack.length ? null : tab}
					written={!!todayEntry}
					action={null}
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
	const [look, setLook] = useState({ paper: 'rose', tone: 'light' });

	return (
		<div className="chd-wrap lbd-wrap" id="live-prototype">
			<section className="chd-stage lbd-stage lbd-stage-app" aria-label="Live prototype · Android app">
				<p className="chd-stage-tag">
					<span className="chd-stage-pulse" aria-hidden="true" /> Live prototype · Android app
				</p>
				<div className="chd-bar">
					<p className="chd-bar-note">Version 1.2: open the 2025 letter and tap Listen, record a voice note, poke the bunny, pull a diary off the shelf. Sample memories only; recording is simulated.</p>
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
				A working copy of the app as of version 1.2, ported screen by screen from its React Native source, with its real icon and mascot art. The memories are the app’s own built-in sample set; the voice notes play a hummed tune, and recording is simulated (no microphone is used). On a wide screen, pop it out to keep it beside you while you read.
			</p>
		</div>
	);
}
