// Pure helpers ported from the app's src/lib (dates.ts, seeded.ts, polaroid.ts, voice.ts) and the sample
// memories from src/dev/seed.ts, so the web copy shows the same days, words, photos and voice notes as the
// app's built-in sample set. Nothing here is anyone's real diary.

import { useEffect, useRef, useState } from 'react';

/* ---------- Dates (src/lib/dates.ts) ---------- */

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const parseDate = (d) => {
	const [year, month, day] = d.split('-').map(Number);
	return { year, month, day };
};
const pad2 = (n) => String(n).padStart(2, '0');
export const formatDate = ({ year, month, day }) => `${year}-${pad2(month)}-${pad2(day)}`;
const daysInMonth = (year, month) => new Date(Date.UTC(year, month, 0)).getUTCDate();
export const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** The visitor's own calendar date, never a UTC-derived one. */
export function toLocalDate(d = new Date()) {
	return formatDate({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() });
}
export function addDays(date, n) {
	const p = parseDate(date);
	const t = new Date(Date.UTC(p.year, p.month - 1, p.day + n));
	return formatDate({ year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate() });
}
export function shiftYears(date, n) {
	const p = parseDate(date);
	const year = p.year + n;
	return formatDate({ year, month: p.month, day: Math.min(p.day, daysInMonth(year, p.month)) });
}
/** "Nov 23, 2025" */
export const displayDate = (d) => {
	const p = parseDate(d);
	return `${MONTHS[p.month - 1].slice(0, 3)} ${p.day}, ${p.year}`;
};
/** "Nov 23" */
export const shortDay = (d) => displayDate(d).replace(/,? \d{4}$/, '');
/** "November 23" */
export const monthDay = (d) => {
	const p = parseDate(d);
	return `${MONTHS[p.month - 1]} ${p.day}`;
};
export function ordinal(n) {
	const tens = n % 100;
	if (tens >= 11 && tens <= 13) return `${n}th`;
	const suffix = ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th';
	return `${n}${n % 10 > 3 ? 'th' : suffix}`;
}
/** "The 23rd of November, 2025" */
export const diaryDate = (d) => {
	const p = parseDate(d);
	return `The ${ordinal(p.day)} of ${MONTHS[p.month - 1]}, ${p.year}`;
};
export function matchesOnThisDay(entryDate, today) {
	const e = parseDate(entryDate);
	const t = parseDate(today);
	if (e.year >= t.year) return false;
	if (e.month === t.month && e.day === t.day) return true;
	return e.month === 2 && e.day === 29 && t.month === 2 && t.day === 28 && !isLeap(t.year);
}
export const onThisDay = (entries, today) => entries.filter((e) => matchesOnThisDay(e.localDate, today)).sort((a, b) => b.localDate.localeCompare(a.localDate));
export const yearsBetween = (a, b) => parseDate(b).year - parseDate(a).year;
export const yearsAgoLabel = (n) => (n === 1 ? 'One year ago today' : `${n} years ago today`);
export function memoryKicker(entryDate, today) {
	if (entryDate === today) return 'Today';
	const years = yearsBetween(entryDate, today);
	if (matchesOnThisDay(entryDate, today)) return yearsAgoLabel(years);
	if (years <= 0) return 'Earlier this year';
	return years === 1 ? 'Last year' : `${years} years ago`;
}
export function replyLabel(entryDate, repliedOn) {
	const a = parseDate(entryDate);
	const b = parseDate(repliedOn);
	const day = a.month === 2 && a.day === 29 && !isLeap(b.year) ? 28 : a.day;
	const beforeItsDay = b.month < a.month || (b.month === a.month && b.day < day);
	const years = b.year - a.year - (beforeItsDay ? 1 : 0);
	if (years <= 0) return 'later';
	return years === 1 ? 'a year on' : `${years} years on`;
}
export function groupByYear(entries) {
	const map = new Map();
	entries.forEach((e) => {
		const y = parseDate(e.localDate).year;
		map.set(y, [...(map.get(y) || []), e]);
	});
	return [...map.entries()].sort(([a], [b]) => b - a).map(([year, list]) => ({ year, entries: list.sort((x, y) => y.localDate.localeCompare(x.localDate)) }));
}
export function groupByMonth(entries) {
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

/* ---------- Seeded randomness (src/lib/seeded.ts) ---------- */

export function hashString(value) {
	let h = 0x811c9dc5;
	for (let i = 0; i < value.length; i++) {
		h ^= value.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return h >>> 0;
}
export function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
export function seededRng(seed) {
	const next = mulberry32(hashString(seed));
	return { next, range: (min, max) => min + (max - min) * next(), pick: (items) => items[Math.floor(next() * items.length)] };
}
/** A page lies a little crooked: ±4° seeded by its id, times 0.3 (ScrapObject PAGE_TILT). */
export const pageTilt = (id) => seededRng(id).range(-4, 4) * 0.3;

/* ---------- Words on the photograph (src/lib/polaroid.ts) ---------- */

export function wrappedLines(text, perLine) {
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
/** What fits on the front (frontLines of perLine), and whether the rest goes on the back. */
export function planWords(text, perLine = 28, frontLines = 2) {
	const words = text.trim();
	if (!words) return { front: null, back: null, teaser: null };
	if (wrappedLines(words, perLine) <= frontLines) return { front: words, back: null, teaser: null };
	const flat = words.replace(/\s+/g, ' ');
	const room = perLine * frontLines - 4;
	const cut = flat.slice(0, room);
	const space = cut.lastIndexOf(' ');
	return { front: null, back: words, teaser: (space > room * 0.5 ? cut.slice(0, space) : cut).trim() };
}

/* ---------- Voice (src/lib/voice.ts, src/dev/seedVoice.ts) ---------- */

export const VOICE_MAX_MS = 60000;
export function formatVoiceMs(ms) {
	if (!ms || ms < 0) return '0:00';
	const s = Math.round(ms / 1000);
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
const NOTES = [262, 294, 330, 349, 392, 440, 494, 523];
const SYLLABLE = 0.32;
const SYLLABLE_GAP = 0.08;
function syllable(seed, k) {
	const r = mulberry32(seed + k * 7919);
	return { freq: NOTES[Math.floor(r() * NOTES.length)], loud: 0.35 + r() * 0.6 };
}
/** The sample voice notes hum a little tune (the app's seed voices do the same: no real voice ships). */
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
/** How loud the hum is at a moment (0–1), for the recorder's needle. */
export function humLevel(seed, t) {
	const step = SYLLABLE + SYLLABLE_GAP;
	const k = Math.floor(t / step);
	const inSyl = t - k * step;
	if (inSyl > SYLLABLE) return 0.03;
	return syllable(seed, k).loud * Math.sin((Math.PI * inSyl) / SYLLABLE);
}

let sharedCtx = null;
export function audioContext() {
	if (typeof window === 'undefined') return null;
	try {
		const Ctx = window.AudioContext || window.webkitAudioContext;
		if (!Ctx) return null;
		sharedCtx = sharedCtx || new Ctx();
		sharedCtx.resume?.();
		return sharedCtx;
	} catch {
		return null;
	}
}

/** The tape deck's own sounds (assets/sounds in the app): the key's clunk, the motor, the hiss. */
const SOUND_CACHE = {};
export function tapeSound(name, volume = 0.5) {
	if (typeof window === 'undefined') return;
	try {
		const src = `/images/lookback/tape-${name}.wav`;
		const base = SOUND_CACHE[src] || (SOUND_CACHE[src] = new Audio(src));
		const a = base.cloneNode();
		a.volume = volume;
		a.play().catch(() => {});
	} catch {
		// No sound here; the deck still moves.
	}
}

/**
 * Plays a voice memory: a sample's hummed tune (voice.seed) or the visitor's own recording (voice.url).
 * Play / pause picks up where it left off, stop rewinds; `progress()` and `level()` are read every frame.
 */
export function useVoicePlayer(voice) {
	const [playing, setPlaying] = useState(false);
	const offset = useRef(0);
	const startedAt = useRef(0);
	const nodes = useRef([]);
	const audio = useRef(null);
	const analyser = useRef(null);
	const timer = useRef(null);
	const key = voice ? voice.url || voice.seed : null;
	const dur = voice?.ms ?? 0;

	const halt = () => {
		nodes.current.forEach((n) => {
			try {
				n.stop();
			} catch {
				// Already stopped.
			}
		});
		nodes.current = [];
		audio.current?.pause();
		clearTimeout(timer.current);
	};
	useEffect(() => {
		offset.current = 0;
		return () => {
			halt();
			setPlaying(false);
		};
	}, [key]);

	if (!voice) return null;
	const position = () => (playing ? Math.min(dur, offset.current + performance.now() - startedAt.current) : offset.current);
	const play = () => {
		const from = offset.current >= dur - 50 ? 0 : offset.current;
		offset.current = from;
		const ctx = audioContext();
		if (voice.url) {
			if (!audio.current || audio.current.dataset.src !== voice.url) {
				audio.current = new Audio(voice.url);
				audio.current.dataset.src = voice.url;
				analyser.current = null;
				if (ctx) {
					try {
						const node = ctx.createMediaElementSource(audio.current);
						const an = ctx.createAnalyser();
						an.fftSize = 256;
						node.connect(an).connect(ctx.destination);
						analyser.current = an;
					} catch {
						// Plays without a meter.
					}
				}
			}
			audio.current.currentTime = from / 1000;
			audio.current.play().catch(() => {});
		} else if (ctx) {
			nodes.current = hum(ctx, voice.seed, from / 1000, dur / 1000);
		}
		startedAt.current = performance.now();
		setPlaying(true);
		timer.current = setTimeout(() => {
			halt();
			offset.current = dur;
			setPlaying(false);
		}, dur - from);
	};
	const pause = () => {
		offset.current = position();
		halt();
		setPlaying(false);
	};
	const stop = () => {
		halt();
		offset.current = 0;
		setPlaying(false);
	};
	const rewind = () => {
		const was = playing;
		halt();
		offset.current = 0;
		setPlaying(false);
		if (was) setTimeout(play, 0);
	};
	const level = () => {
		if (!playing) return 0;
		if (voice.url) {
			const an = analyser.current;
			if (!an) return 0.35 + Math.random() * 0.3;
			const buf = new Uint8Array(an.fftSize);
			an.getByteTimeDomainData(buf);
			let peak = 0;
			for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i] - 128) / 128);
			return Math.min(1, peak * 2.2);
		}
		return humLevel(voice.seed, position() / 1000);
	};
	return { playing, dur, position, progress: () => (dur ? position() / dur : 0), level, toggle: () => (playing ? pause() : play()), play, pause, stop, rewind };
}

/* ---------- Sample memories (src/dev/seed.ts) ---------- */

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
function textFor(i) {
	if (i % 7 === 3) return LONG[i % LONG.length];
	if (i % 5 === 1) return QUOTES[i % QUOTES.length];
	return SHORT[i % SHORT.length];
}

function seedEntry(item) {
	const seed = hashString(item.localDate);
	const at = `${item.localDate}T20:00:00`;
	return {
		id: `seed-${item.localDate}`,
		localDate: item.localDate,
		text: item.text,
		photo: item.photo ? { seed } : null,
		voice: item.voice ? { seed, ms: item.voiceMs ?? 4000, title: item.voiceTitle ?? null } : null,
		reply: item.reply ?? null,
		repliedOn: item.repliedOn ?? null,
		createdAt: at,
		sample: true,
	};
}

/** The app's sample set, relative to the visitor's today (so "One year ago today" always has letters). */
export function sampleEntries(today) {
	const out = [];
	out.push({
		localDate: shiftYears(today, -1),
		text: 'Picnic in the park with the whole crew.\nWe stayed until the lights came on.',
		photo: true,
		voice: true,
		voiceMs: 4000,
		voiceTitle: 'A little of me',
	});
	out.push({ localDate: shiftYears(today, -2), text: 'Moved into the new place. Boxes everywhere.', photo: false, voice: true, voiceMs: 6000, reply: 'It finally feels like home. The boxes are long gone.', repliedOn: shiftYears(today, -1) });
	out.push({ localDate: shiftYears(today, -3), text: '"Begin anywhere." — painted on the café wall', photo: false });
	out.push({ localDate: shiftYears(today, -4), text: 'Road trip, day one.', photo: true });
	for (let i = 1; i <= 10; i++) out.push({ localDate: shiftYears(addDays(today, i), -1), text: textFor(i), photo: i % 3 === 0 });
	for (let i = 0; i < 48; i++) out.push({ localDate: addDays(shiftYears(today, -1), -(i * 27 + 5)), text: textFor(i + 2), photo: i % 4 === 0 });
	out.push({ localDate: '2024-02-29', text: 'Leap day! An extra day, spent on pancakes.', photo: false });
	const seen = new Set();
	return out
		.filter((item) => {
			if (seen.has(item.localDate) || item.localDate >= today) return false;
			seen.add(item.localDate);
			return true;
		})
		.map(seedEntry)
		.sort((a, b) => b.localDate.localeCompare(a.localDate));
}

/* ---------- Small hooks ---------- */

export function useReducedMotion() {
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

/** Runs `fn(t)` every animation frame while `on`, for things read straight off the player (reels, needle, time). */
export function useFrame(on, fn) {
	const ref = useRef(fn);
	useEffect(() => {
		ref.current = fn;
	});
	useEffect(() => {
		if (!on) return undefined;
		let raf = 0;
		const tick = (t) => {
			ref.current(t);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [on]);
}

/** A per-visitor copy of something in localStorage (wrapped: private windows may refuse). */
export function loadStored(key, fallback) {
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
export function saveStored(key, value) {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Not saved; the demo still works for this visit.
	}
}
