// The app itself (src/app/_layout.tsx, (tabs)/_layout.tsx, NavBar.tsx): the bar's pages in a sideways pager (Home ·
// Years · Write · Shared · You), pages you open pushed on top, the round Write button, notes that ease up, and the
// volume flying off the shelf. The visitor's own pages and choices live only in this browser.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { makeTheme, ThemeContext, control } from './theme';
import { addDays, hashString, loadStored, sampleEntries, saveStored, shiftYears, toLocalDate, useReducedMotion } from './lib';
import { PaperTabs, Stitches, Texture, Toast, Icon, WashIn } from './ui';
import { type } from './theme';
import { randomPortrait, defaultPortrait } from './portrait';
import { BookFlight, EntryScreen, GiveScreen, HomeScreen, MemoryScreen, PersonSeal, PortraitScreen, SettingsScreen, SharedScreen, WelcomeScreen, YearScreen, YearsScreen, YouScreen } from './screens';

const STORE = 'lb-demo-v13';
const SCREEN_W = 363;
const TABS = [
	{ key: 'home', label: 'Home', icon: 'home' },
	{ key: 'years', label: 'Years', icon: 'library' },
	{ key: 'shared', label: 'Shared', icon: 'mail' },
	{ key: 'you', label: 'You', icon: 'person' },
];
const EMPTY = { mine: [], edits: {}, deleted: [], profile: { name: '', portrait: null }, reminder: { enabled: true, hour: 20, minute: 0 }, autoAccept: true };

/** A page given to you by a sample friend (GiftArrival / the Shared page), so the flow is there to see. */
function samplePeople(today) {
	const mum = { name: 'Mum', added: addDays(today, -2), portrait: { ...randomPortrait(mulberry(hashString('mum'))), hair: 18, cover: 0, accessory: 0, film: 2 } };
	const received = [
		{
			id: 'gift-mum',
			from: 'Mum',
			givenOn: addDays(today, -2),
			localDate: addDays(shiftYears(today, -1), -2),
			text: 'Found this in the old album: you, aged six, on the beach in a hat far too big for you.',
			photo: { seed: hashString('mum-beach') },
			voice: { seed: hashString('mum-voice'), ms: 5000, title: 'From Mum' },
			reply: null,
			createdAt: addDays(shiftYears(today, -1), -2),
		},
	];
	return { people: [mum], received };
}
function mulberry(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Voice recordings are blob URLs while the page lives; kept as a data URL when it fits in the browser's storage. */
async function blobToData(url) {
	const blob = await (await fetch(url)).blob();
	if (blob.size > 1.5e6) return null;
	return new Promise((resolve) => {
		const r = new FileReader();
		r.onload = () => resolve(r.result);
		r.onerror = () => resolve(null);
		r.readAsDataURL(blob);
	});
}

export default function LookBackApp({ look, onLook }) {
	const theme = makeTheme(look);
	const reduce = useReducedMotion();
	const [today] = useState(() => toLocalDate());
	const [store, setStore] = useState(EMPTY);
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		setStore({ ...EMPTY, ...loadStored(STORE, EMPTY) });
		setLoaded(true);
	}, []);
	useEffect(() => {
		if (loaded) saveStored(STORE, store);
	}, [store, loaded]);
	const update = useCallback((fn) => setStore((s) => fn(s)), []);

	const samples = useMemo(() => sampleEntries(today), [today]);
	const { people, received } = useMemo(() => samplePeople(today), [today]);
	const entries = useMemo(() => {
		const mineDates = new Set(store.mine.map((e) => e.localDate));
		const list = [...samples.filter((e) => !mineDates.has(e.localDate) && !store.deleted.includes(e.id)), ...store.mine];
		return list.map((e) => (store.edits[e.id] ? { ...e, ...store.edits[e.id], voice: e.voice && store.edits[e.id].voiceTitle !== undefined ? { ...e.voice, title: store.edits[e.id].voiceTitle } : e.voice } : e)).sort((a, b) => b.localDate.localeCompare(a.localDate));
	}, [samples, store]);

	/* ---------- Navigation ---------- */

	const [tab, setTab] = useState(0);
	const [stack, setStack] = useState([]);
	const [leaving, setLeaving] = useState(null);
	const top = stack[stack.length - 1];
	const go = useCallback((route) => setStack((s) => [...s, { ...route, key: `${route.name}-${Date.now()}` }]), []);
	const back = useCallback(() => {
		setStack((s) => {
			if (!s.length) return s;
			setLeaving(s[s.length - 1]);
			setTimeout(() => setLeaving(null), 220);
			return s.slice(0, -1);
		});
	}, []);
	const [toastText, setToastText] = useState('');
	const toastTimer = useRef(null);
	const toast = useCallback((text) => {
		setToastText(text);
		clearTimeout(toastTimer.current);
		toastTimer.current = setTimeout(() => setToastText(''), 2200);
	}, []);

	/* ---------- A volume off the shelf ---------- */

	const rootRef = useRef(null);
	const [flight, setFlight] = useState(null);
	const openYear = (year, rect) => {
			const root = rootRef.current?.getBoundingClientRect();
			const k = root ? root.width / SCREEN_W : 1;
			const from = rect && root ? { x: (rect.left - root.left) / k, y: (rect.top - root.top) / k, w: rect.width / k, h: rect.height / k } : null;
			if (reduce) {
				go({ name: 'year', year });
				return;
			}
			setFlight({ year, from });
	};

	/* ---------- Changing the diary ---------- */

	const saveMine = (entry) =>
		update((s) => ({ ...s, mine: [...s.mine.filter((e) => e.localDate !== entry.localDate), entry], deleted: entry.id.startsWith('seed-') ? s.deleted : s.deleted }));
	const keepVoice = (entry) => {
		if (!entry.voice?.url?.startsWith('blob:')) return;
		blobToData(entry.voice.url).then((data) => {
			if (data) update((s) => ({ ...s, mine: s.mine.map((e) => (e.id === entry.id ? { ...e, voice: { ...e.voice, url: data } } : e)) }));
		});
	};
	const app = {
		entries,
		today,
		profile: store.profile,
		setProfile: (profile) => update((s) => ({ ...s, profile })),
		reminder: store.reminder,
		setReminder: (reminder) => update((s) => ({ ...s, reminder })),
		autoAccept: store.autoAccept,
		setAutoAccept: (autoAccept) => update((s) => ({ ...s, autoAccept })),
		look,
		setLook: onLook,
		people,
		received,
		fromPerson: (name) => people.find((p) => p.name === name),
		reduce,
		go,
		back,
		toast,
		setTab: (i) => {
			setStack([]);
			setTab(i);
		},
		openYear,
		flying: flight?.year,
		keepToday: (text) => {
			const existing = entries.find((e) => e.localDate === today);
			const entry = { ...(existing ?? { id: `mine-${today}`, localDate: today, photo: null, voice: null, reply: null, createdAt: today }), id: existing?.id?.startsWith('mine-') ? existing.id : `mine-${today}`, text };
			saveMine(entry);
			toast(`Kept until ${shiftYears(today, 1).slice(0, 4)} · ${new Date(`${today}T12:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
		},
		saveToday: ({ text, photo, voice }) => {
			const entry = { id: `mine-${today}`, localDate: today, text, photo, voice, reply: null, createdAt: today };
			saveMine(entry);
			keepVoice(entry);
			return entry;
		},
		writeBack: (id, text) => {
			update((s) => ({ ...s, edits: { ...s.edits, [id]: { ...s.edits[id], reply: text.trim() || null, repliedOn: text.trim() ? today : null } } }));
			if (text.trim()) toast('Sealed beside your past self');
		},
		labelVoice: (id, title) => update((s) => ({ ...s, edits: { ...s.edits, [id]: { ...s.edits[id], voiceTitle: title.trim() || null } } })),
		removeEntry: (id) => {
			update((s) => (id.startsWith('mine-') ? { ...s, mine: s.mine.filter((e) => e.id !== id) } : { ...s, deleted: [...s.deleted, id] }));
			back();
			toast('all gone');
		},
		finishWelcome: (write) => {
			setStack([]);
			setTab(0);
			if (write) setTimeout(() => go({ name: 'entry' }), 50);
		},
		resetDemo: () => {
			setStore(EMPTY);
			setStack([]);
			setTab(0);
			onLook({ paper: 'navy', tone: 'dark' });
			toast('The sample diary is back');
		},
	};

	/* ---------- The pager: swipe sideways between the bar's pages ---------- */

	const [drag, setDrag] = useState(0);
	const pan = useRef(null);
	const onPointerDown = (e) => {
		if (e.target.closest('[data-hold-pager], textarea, input, .lb-card3d')) return;
		pan.current = { x: e.clientX, y: e.clientY, live: false, t: performance.now(), k: rootRef.current ? rootRef.current.getBoundingClientRect().width / SCREEN_W : 1 };
	};
	const onPointerMove = (e) => {
		const p = pan.current;
		if (!p) return;
		const dx = (e.clientX - p.x) / p.k;
		const dy = (e.clientY - p.y) / p.k;
		if (!p.live) {
			if (Math.abs(dy) > 12) {
				pan.current = null;
				return;
			}
			if (Math.abs(dx) > 12) {
				p.live = true;
				e.currentTarget.setPointerCapture?.(e.pointerId);
			}
		}
		if (p.live) setDrag(Math.max(-SCREEN_W, Math.min(SCREEN_W, (tab === 0 && dx > 0) || (tab === TABS.length - 1 && dx < 0) ? dx * 0.3 : dx)));
	};
	const onPointerUp = (e) => {
		const p = pan.current;
		pan.current = null;
		if (!p?.live) return;
		const v = (e.clientX - p.x) / p.k / Math.max(1, performance.now() - p.t);
		let next = tab;
		if (drag < -90 || v < -0.5) next = Math.min(TABS.length - 1, tab + 1);
		if (drag > 90 || v > 0.5) next = Math.max(0, tab - 1);
		setTab(next);
		setDrag(0);
	};
	// A click right after a swipe isn't a tap.
	const onClickCapture = (e) => {
		if (Math.abs(drag) > 4) e.stopPropagation();
	};
	const slide = Math.max(0, Math.min(TABS.length - 1, tab - drag / SCREEN_W));

	const written = entries.some((e) => e.localDate === today && e.id.startsWith('mine-'));
	const bar = theme.bar;
	const writeButton = (
		<button type="button" className="lb-write-btn" onClick={() => go({ name: 'entry' })} aria-label={written ? "Edit today's page" : "Write today's page"} style={{ background: bar.bg, boxShadow: theme.shadow(1.6) }}>
			<Texture kind="paper" opacity={bar.texture} radius={40} />
			<Stitches radius={32} />
			{written ? null : <span className="lb-write-wash" style={{ background: `${theme.colors.gilt}4D` }} />}
			<Icon name={written ? 'edit' : 'pencil'} size={22} color={bar.ink} />
			<span style={{ ...type.small, color: bar.ink, fontSize: 12, lineHeight: '15px', fontWeight: 700, position: 'relative' }}>{written ? 'Edit' : 'Write'}</span>
		</button>
	);
	const me = (
		<span style={{ display: 'block', marginTop: -4, height: 19, overflow: 'visible' }}>
			<PersonSeal name={store.profile.name} portrait={store.profile.portrait} size={23} />
		</span>
	);

	const screenFor = (route) => {
		switch (route.name) {
			case 'memory':
				return <MemoryScreen app={app} id={route.id} />;
			case 'entry':
				return <EntryScreen app={app} />;
			case 'year':
				return <YearScreen app={app} year={route.year} />;
			case 'give':
				return <GiveScreen app={app} id={route.id} />;
			case 'settings':
				return <SettingsScreen app={app} />;
			case 'portrait':
				return <PortraitScreen app={app} />;
			case 'welcome':
				return <WelcomeScreen app={app} />;
			default:
				return null;
		}
	};

	return (
		<ThemeContext.Provider value={theme}>
			<div ref={rootRef} className={`lb${theme.dark ? ' is-night' : ''}${reduce ? ' is-reduced' : ''}`} style={{ background: theme.colors.desk, color: theme.colors.onDesk }}>
				<div className="lb-status" style={{ color: theme.dark ? '#F0E4CC' : '#2A2118' }} aria-hidden="true">
					<span>{new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/i, '')}</span>
					<span className="lb-status-icons">
						<i />
						<i />
						<b />
					</span>
				</div>
				<div className={`lb-pager${drag ? ' is-dragging' : ''}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onClickCapture={onClickCapture} aria-hidden={!!top}>
					<div className="lb-pager-track" style={{ transform: `translateX(${-tab * SCREEN_W + drag}px)` }}>
						{[HomeScreen, YearsScreen, SharedScreen, YouScreen].map((S, i) => (
							<section key={TABS[i].key} className="lb-pager-page" aria-label={TABS[i].label} aria-hidden={i !== tab} inert={i !== tab}>
								<S app={app} />
							</section>
						))}
					</div>
				</div>
				<div className={`lb-nav${top ? ' is-away' : ''}`}>
					<PaperTabs
						items={TABS.map((t, i) => ({ key: t.key, icon: t.icon, label: t.label, active: i === tab, onPress: () => setTab(i), picture: t.key === 'you' ? me : undefined, badge: t.key === 'shared' ? received.length : undefined }))}
						center={writeButton}
						centerAt={2}
						slide={slide}
						compact
					/>
				</div>
				{stack.map((route, i) => (
					<div key={route.key} className={`lb-pushed${i === stack.length - 1 ? ' is-top' : ''}`} inert={i !== stack.length - 1}>
						{screenFor(route)}
					</div>
				))}
				{leaving ? (
					<div key={`${leaving.key}-out`} className="lb-pushed is-leaving" aria-hidden="true">
						{screenFor(leaving)}
					</div>
				) : null}
				{flight ? (
					<BookFlight
						year={flight.year}
						from={flight.from}
						onOpen={() => go({ name: 'year', year: flight.year })}
						onDone={() => setFlight(null)}
					/>
				) : null}
				<Toast text={toastText} />
			</div>
		</ThemeContext.Provider>
	);
}

export { defaultPortrait };
