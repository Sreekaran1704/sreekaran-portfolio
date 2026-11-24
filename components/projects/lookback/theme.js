// The LookBack diary's theme, ported from the app's src/theme (tokens.ts, papers.ts, yearColors.ts, index.ts).
// Values are copied, not eyeballed: the paper colors, gilt, ink, sepia, the bar's desk and keys, type sizes.

import { createContext, useContext } from 'react';

export function withAlpha(hex, alpha) {
	const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
		.toString(16)
		.padStart(2, '0');
	return `${hex.slice(0, 7)}${a}`;
}

export function mixHex(a, b, t) {
	const ch = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
	return `#${[0, 1, 2]
		.map((i) => Math.round(ch(a, i) + (ch(b, i) - ch(a, i)) * t).toString(16).padStart(2, '0'))
		.join('')}`.toUpperCase();
}

/* ---------- Year colors (src/theme/yearColors.ts) ---------- */

const YEAR_PALETTES = [
	{ name: 'coral', primary: '#FF6B5E', secondary: '#FF8FC2', tint: '#FFE3DD', ink: '#5A1610' },
	{ name: 'teal', primary: '#13B5A4', secondary: '#38CDEB', tint: '#D7F5F1', ink: '#063F3A' },
	{ name: 'amber', primary: '#F5A30B', secondary: '#FB7E3C', tint: '#FFF0CF', ink: '#5A3600' },
	{ name: 'violet', primary: '#8B5CF6', secondary: '#6366F1', tint: '#ECE5FF', ink: '#2A1468' },
	{ name: 'lime', primary: '#7CC217', secondary: '#22C55E', tint: '#EAF8D2', ink: '#24400A' },
];
export function yearPalette(year) {
	const n = YEAR_PALETTES.length;
	return YEAR_PALETTES[(((2025 - year) % n) + n) % n];
}

/* ---------- Papers (src/theme/papers.ts) ---------- */

const GOLD = { giltDay: '#9C7A3C', giltNight: '#C3A060', titleNight: '#DCC28E' };
export const PAPERS = [
	{ name: 'ivory', label: 'Ivory', light: '#F3EBDB', lightDeep: '#E6DCC6', dark: '#1F1A14', darkDeep: '#15110C', dots: '#A88B5C', accent2: '#7A2E2E', titleDay: '#2A2118', ...GOLD },
	{ name: 'tobacco', label: 'Tobacco', light: '#EEDDC8', lightDeep: '#E0CCB2', dark: '#26190F', darkDeep: '#1A110A', dots: '#8E6A48', accent2: '#3F5A4A', titleDay: '#3A2414', ...GOLD },
	{ name: 'oxblood', label: 'Oxblood', light: '#F0DCD9', lightDeep: '#E3C9C5', dark: '#2B1418', darkDeep: '#1D0D10', dots: '#8E4450', accent2: '#A8833F', titleDay: '#4A1A22', ...GOLD },
	{ name: 'ink', label: 'Ink', light: '#E2E5E9', lightDeep: '#D2D6DC', dark: '#16191E', darkDeep: '#0E1014', dots: '#6B717B', accent2: '#A8833F', titleDay: '#1C2026', ...GOLD },
	{ name: 'bottle', label: 'Bottle', light: '#DBE7DA', lightDeep: '#C9D9C7', dark: '#10241B', darkDeep: '#0A1812', dots: '#4E7A62', accent2: '#A8833F', titleDay: '#173326', ...GOLD },
	{ name: 'navy', label: 'Navy', light: '#D9E4F0', lightDeep: '#C6D5E6', dark: '#122337', darkDeep: '#0B1726', dots: '#3D78B3', accent2: '#C2804A', titleDay: '#16263D', giltDay: '#3D6E9E', giltNight: '#5A8CBE', titleNight: '#8BAED1' },
	{ name: 'plum', label: 'Plum', light: '#E5DDEE', lightDeep: '#D5CAE2', dark: '#211830', darkDeep: '#160F21', dots: '#76608F', accent2: '#A8833F', titleDay: '#2E2142', ...GOLD },
];
export const DEFAULT_LOOK = { paper: 'navy', tone: 'dark' };
export const paperByName = (name) => PAPERS.find((p) => p.name === name) ?? PAPERS[0];

const DAY_CARD_LIFT = 0.3;
const CARD_DIM_NIGHT = 0.06;
const STITCH_ALPHA = 0.5;

function navColors(paper, tone) {
	const day = tone === 'light';
	const BAKELITE = '#2A2420';
	const key = day ? mixHex(paper.light, '#FFFFFF', DAY_CARD_LIFT) : mixHex(mixHex(BAKELITE, paper.dark, 0.75), '#FFFFFF', 0.05);
	const ENGRAVED_DAY = '#2A2118';
	const ENGRAVED_NIGHT = '#F0E4CC';
	return {
		strip: key,
		ink: day ? ENGRAVED_DAY : ENGRAVED_NIGHT,
		inkMuted: day ? mixHex(ENGRAVED_DAY, key, 0.4) : mixHex(ENGRAVED_NIGHT, BAKELITE, 0.35),
		active: '#F0A23C',
		brass: '#C9A04A',
		brassDark: '#7E5F22',
	};
}

/* ---------- Colors (src/theme/tokens.ts) ---------- */

const palette = {
	page: '#EFE4CC',
	pageLamp: '#DCCFB2',
	pageBright: '#F6EEDB',
	pageBrightLamp: '#E6DAC0',
	inkBlue: '#23304A',
	sepia: '#6B2A22',
	kraft: '#D8B98C',
	kraftDim: '#C2A276',
	ink: '#2A2118',
	inkMuted: '#6B5F50',
	inkFaint: 'rgba(42, 33, 24, 0.14)',
	wax: '#7A231C',
};

const lightColors = {
	paper: palette.page,
	paperWhite: palette.pageBright,
	kraft: palette.kraft,
	ruleLine: 'rgba(120, 95, 60, 0.3)',
	marginLine: 'rgba(142, 42, 32, 0.45)',
	ink: palette.ink,
	inkMuted: palette.inkMuted,
	inkFaint: palette.inkFaint,
	onDesk: palette.ink,
	onDeskMuted: 'rgba(42, 33, 24, 0.7)',
	onDeskFaint: 'rgba(42, 33, 24, 0.45)',
	onPrimary: '#14201A',
	wood: '#5A3A24',
	woodLight: '#7A5234',
	woodDark: '#3A2416',
	woodDeep: '#24160D',
	shadowBase: '#4A3A28',
	scrim: 'rgba(20, 16, 12, 0.45)',
	wax: palette.wax,
	inkBlue: palette.inkBlue,
	sepia: palette.sepia,
	green: '#2DB86A',
};
const darkColors = {
	...lightColors,
	paper: palette.pageLamp,
	paperWhite: palette.pageBrightLamp,
	kraft: palette.kraftDim,
	onDesk: '#E3D7BC',
	onDeskMuted: 'rgba(227, 215, 188, 0.7)',
	onDeskFaint: 'rgba(227, 215, 188, 0.44)',
	shadowBase: '#000000',
	wood: '#4A2F1D',
	woodLight: '#644329',
	woodDark: '#2E1C11',
	woodDeep: '#1C1109',
	scrim: 'rgba(0, 0, 0, 0.6)',
};

/* ---------- Type (tokens.ts typography) ---------- */
// Cormorant Garamond 600 = gilt lettering; IM Fell English = printed dates and notes; Caveat = the person's hand.

const GILT = "'Cormorant Garamond', Georgia, serif";
const PRINT = "'IM Fell English', Georgia, serif";
const HAND = "'Caveat', 'Comic Neue', cursive";
const serif = (size, line, family, italic = false, weight = 600, letterSpacing = 0) => ({
	fontFamily: family,
	fontSize: size,
	lineHeight: `${line}px`,
	fontStyle: italic ? 'italic' : 'normal',
	fontWeight: weight,
	letterSpacing,
});
export const type = {
	title: serif(40, 46, GILT, true),
	titleNarrow: serif(34, 40, GILT, true),
	heading: serif(28, 32, GILT, true),
	headline: serif(30, 36, GILT, true),
	month: serif(32, 38, GILT, true),
	label: serif(18, 22, GILT, false, 600, 0.4),
	caption: serif(17, 23, PRINT, true, 400),
	stamp: serif(13, 16, GILT, false, 600, 2.4),
	stampLarge: serif(20, 24, GILT, false, 600, 2.8),
	albumYear: serif(32, 38, GILT),
	print: serif(18, 24, PRINT, false, 400),
	printItalic: serif(18, 24, PRINT, true, 400),
	hand: serif(24, 28, HAND, false, 600),
	handSmall: serif(15, 20, PRINT, true, 400),
	handLarge: serif(32, 36, HAND, false, 700),
	body: serif(22, 28, HAND, false, 500),
	small: serif(15, 20, PRINT, false, 400),
};

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, gutter: 20, xl: 24, xxl: 32, xxxl: 48 };
export const control = { radius: 12, height: 52, stitchInset: 4, washInset: 6 };

export function paperShadow(tint, lift = 1, dark = false) {
	const base = dark ? 0.6 : 0.24;
	return `${lift}px ${2 * lift}px ${lift}px ${withAlpha(tint, base)}, ${3 * lift}px ${8 * lift}px ${14 * lift}px ${withAlpha(tint, base * 0.6)}`;
}

const cache = new Map();
/** The whole theme for a look (makeTheme in src/theme/index.ts). */
export function makeTheme(look) {
	const key = `${look.paper}:${look.tone}`;
	if (cache.has(key)) return cache.get(key);
	const paper = paperByName(look.paper);
	const dark = look.tone === 'dark';
	const colors = dark
		? {
				...darkColors,
				desk: paper.dark,
				deskDeep: paper.darkDeep,
				gilt: paper.giltNight,
				giltBright: paper.titleNight,
				stitch: withAlpha(paper.giltNight, STITCH_ALPHA),
				primary: paper.giltNight,
				panel: mixHex(paper.lightDeep, '#000000', CARD_DIM_NIGHT),
			}
		: {
				...lightColors,
				desk: paper.light,
				deskDeep: paper.lightDeep,
				gilt: paper.giltDay,
				giltBright: paper.titleDay,
				stitch: withAlpha(paper.giltDay, STITCH_ALPHA),
				primary: paper.giltDay,
				panel: mixHex(paper.light, '#FFFFFF', DAY_CARD_LIFT),
			};
	const nav = navColors(paper, look.tone);
	const theme = {
		dark,
		paper,
		colors,
		nav,
		bar: dark ? { bg: nav.strip, ink: nav.ink, muted: nav.inkMuted, texture: 0.16 } : { bg: colors.panel, ink: colors.ink, muted: withAlpha(colors.ink, 0.74), texture: 0.5 },
		shadow: (lift = 1) => paperShadow(colors.shadowBase, lift, dark),
		year: yearPalette,
	};
	cache.set(key, theme);
	return theme;
}

export const ThemeContext = createContext(makeTheme(DEFAULT_LOOK));
export const useTheme = () => useContext(ThemeContext);
