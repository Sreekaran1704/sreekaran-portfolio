// The diary's screens, ported from the app's src/app routes: Home, Years, Shared and You (the bar's pages), a memory,
// the writing page, a year's volume, the portrait maker, Settings and the first-run pages. Copy is the app's own.

import { useEffect, useMemo, useRef, useState } from 'react';
import { PAPERS, type, useTheme, withAlpha, mixHex } from './theme';
import {
	addDays,
	diaryDate,
	displayDate,
	formatVoiceMs,
	groupByMonth,
	groupByYear,
	memoryKicker,
	monthDay,
	MONTHS,
	onThisDay,
	parseDate,
	seededRng,
	shiftYears,
	useFrame,
	useVoicePlayer,
	VOICE_MAX_MS,
	tapeSound,
} from './lib';
import {
	ActionRow,
	BuddySays,
	CardTitle,
	CheckRow,
	ConfirmSheet,
	Desk,
	Help,
	Icon,
	Page,
	PageFooter,
	PageHeader,
	Panel,
	PaperTabs,
	PillButton,
	Row,
	SectionHeader,
	Stitches,
	Texture,
	WashIn,
} from './ui';
import { Cassette, DiaryPage, LetterDeck, Letter, LiftedCassette, MemoryCard, Photo, ScrapObject, TapeRecorder, YearsCupboard } from './pieces';
import { defaultPortrait, FilmPortrait, PORTRAIT_OPTIONS, PORTRAIT_SECTIONS, PORTRAIT_SWATCHES, randomPortrait } from './portrait';

const SCREEN_W = 363;
const CONTENT_W = SCREEN_W - 48;

/* ---------- Pieces shared by several screens ---------- */

/** Someone's portrait in its film frame (PersonSeal). */
export function PersonSeal({ name, portrait, size = 52 }) {
	const { colors } = useTheme();
	return <FilmPortrait portrait={portrait ?? defaultPortrait(name || 'someone')} size={size} hole={colors.panel} />;
}

/** A page's own buttons at its foot (DiaryDock / ActionBar). */
export function Dock({ actions, children }) {
	return (
		<div className="lb-dock">
			{children ? <div className="lb-dock-above">{children}</div> : null}
			<PaperTabs items={actions} />
		</div>
	);
}

/** The paper chips and Day / Night switch (PaperPicker, SlideSwitch in Pickers.tsx). */
export function LookPicker({ look, onLook }) {
	const theme = useTheme();
	const { colors } = theme;
	return (
		<div style={{ display: 'grid', gap: 16, padding: '8px 0' }}>
			<div className="lb-paperstrip" role="radiogroup" aria-label="Paper">
				{PAPERS.map((p) => {
					const on = p.name === look.paper;
					return (
						<button key={p.name} type="button" role="radio" aria-checked={on} className="lb-paperchip lb-press" onClick={() => onLook({ ...look, paper: p.name })}>
							<span className="lb-paperchip-sheet" style={{ background: look.tone === 'dark' ? p.dark : p.light, borderColor: on ? colors.ink : withAlpha(colors.ink, 0.2), boxShadow: on ? `0 0 0 2px ${colors.panel}, 0 0 0 3.5px ${colors.ink}` : theme.shadow(0.5) }}>
								<span style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 1, background: colors.marginLine }} />
								<span style={{ ...type.stamp, fontSize: 10, color: look.tone === 'dark' ? p.titleNight : p.titleDay, letterSpacing: 0.5 }}>Aa</span>
							</span>
							<span style={{ ...type.small, fontSize: 13, color: colors.ink, fontWeight: on ? 700 : 400 }}>{p.label}</span>
						</button>
					);
				})}
			</div>
			<div className="lb-switch" role="radiogroup" aria-label="Tone" style={{ background: colors.panel, boxShadow: theme.shadow(0.6) }}>
				<Texture kind="paper" opacity={0.5} radius={12} />
				<Stitches />
				{[
					['light', 'Day', 'sun'],
					['dark', 'Night', 'moon'],
				].map(([tone, label, icon]) => {
					const on = look.tone === tone;
					return (
						<button key={tone} type="button" role="radio" aria-checked={on} className="lb-switch-opt" onClick={() => onLook({ ...look, tone })}>
							{on ? <WashIn color={colors.gilt} edge /> : null}
							<Icon name={icon} size={17} color={colors.ink} />
							<span style={{ ...type.small, fontWeight: on ? 700 : 600, color: colors.ink, position: 'relative' }}>{label}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}

/* ---------- Home (src/app/(tabs)/index.tsx) ---------- */

/** "Today" on Home: the diary lying open at today's page; write on it right here (TodaySpread). */
function TodaySpread({ entry, today, onOpen, onWrite, onKeep }) {
	const theme = useTheme();
	const { colors } = theme;
	const [writing, setWriting] = useState(false);
	const [draft, setDraft] = useState('');
	const width = CONTENT_W;
	const h = width * 0.74;
	const pageW = (width - 14) / 2;
	const pageH = h - 14 - 4;
	const words = entry?.text.trim() ?? '';
	const LINE = 22;
	const keep = () => {
		setWriting(false);
		if (draft.trim() !== words && (draft.trim() || entry?.photo || entry?.voice)) onKeep(draft);
	};
	const link = (label, onClick, aria) => (
		<button type="button" className="lb-plain" onClick={onClick} aria-label={aria} style={{ ...type.hand, color: colors.sepia, fontSize: 18, lineHeight: '22px' }}>
			{label}
		</button>
	);
	const page = (side, children) => (
		<div
			className="lb-spread-page"
			style={{
				width: pageW,
				height: pageH,
				backgroundColor: colors.paper,
				borderRadius: side === 'left' ? '6px 1px 1px 6px' : '1px 6px 6px 1px',
				backgroundImage:
					side === 'left'
						? 'linear-gradient(90deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0.25) 45%, rgba(0,0,0,0.05) 82%, rgba(0,0,0,0.22) 100%)'
						: 'linear-gradient(90deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.05) 18%, rgba(255,255,255,0.25) 55%, rgba(0,0,0,0.03) 100%)',
			}}
		>
			<Texture kind="paper" opacity={0.45} />
			<div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>{children}</div>
		</div>
	);
	const polaroidW = pageW * 0.8;
	const polaroid = entry?.photo ? (
		<div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
			<div style={{ width: polaroidW, padding: `${polaroidW * 0.06}px ${polaroidW * 0.06}px ${polaroidW * 0.2}px`, background: '#FBFAF6', transform: 'rotate(-3deg)', boxShadow: '0 3px 6px rgba(0,0,0,0.3)', position: 'relative' }}>
				<span style={{ display: 'block', width: '100%', aspectRatio: '1', position: 'relative' }}>
					<Photo photo={entry.photo} />
				</span>
				<span className="lb-abs" style={{ top: -8, left: polaroidW * 0.3, width: polaroidW * 0.4, height: 16, background: 'rgba(245, 238, 220, 0.75)', transform: 'rotate(4deg)' }} />
			</div>
		</div>
	) : null;
	const pouchW = pageW * 0.84;
	const pouch = entry?.voice ? (
		<div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
			<div style={{ width: pouchW, height: pouchW * 0.56, position: 'relative' }}>
				<span className="lb-abs" style={{ left: pouchW * 0.06, top: 0 }}>
					<Cassette width={pouchW * 0.88} title={entry.voice.title || displayDate(today)} detail={formatVoiceMs(entry.voice.ms)} />
				</span>
				<span className="lb-abs" style={{ left: 0, right: 0, bottom: 0, height: pouchW * 0.3, borderRadius: '3px 3px 6px 6px', backgroundColor: '#6B4A2E', backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(255,255,255,0.08) 70%, rgba(0,0,0,0.2) 100%)', boxShadow: '0 3px 6px rgba(0,0,0,0.35)' }}>
					<span className="lb-abs" style={{ inset: 4, borderRadius: 4, border: '1px dashed rgba(233, 205, 150, 0.7)' }} />
				</span>
			</div>
		</div>
	) : null;
	const ruled = { backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent ${LINE - 1.4}px, ${colors.ruleLine} ${LINE - 1.4}px, ${colors.ruleLine} ${LINE}px)`, backgroundPosition: '0 24px', backgroundRepeat: 'repeat-y', backgroundSize: '100% auto' };
	const right = (
		<div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 12, ...ruled }}>
			<span style={{ ...type.caption, color: colors.sepia, fontSize: 13, lineHeight: '18px' }}>{diaryDate(today)}</span>
			{writing ? (
				<>
					<textarea
						className="lb-write"
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						autoFocus
						placeholder="What's weighing on you today?"
						aria-label="Today's page"
						style={{ ...type.hand, flex: 1, color: colors.inkBlue, fontSize: 19, lineHeight: `${LINE}px`, marginTop: 4 }}
					/>
					<div className="lb-row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
						{link('+ photo', onWrite, 'Add a photo or a voice note')}
						{link('keep ✓', keep, "Keep today's page")}
					</div>
				</>
			) : (
				<button
					type="button"
					className="lb-plain"
					onClick={() => {
						setDraft(entry?.text ?? '');
						setWriting(true);
					}}
					aria-label={words ? "Write on today's page" : "Write today's page"}
					style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'left' }}
				>
					{words ? (
						<p className="lb-hand" style={{ ...type.hand, color: colors.inkBlue, fontSize: 19, lineHeight: `${LINE}px`, marginTop: 4, WebkitLineClamp: entry.photo && entry.voice ? 2 : 6 }}>
							{words}
						</p>
					) : (
						<>
							<span style={{ ...type.hand, color: colors.inkBlue, fontSize: 21, lineHeight: `${LINE}px`, marginTop: 4 }}>Dear me,</span>
							<span style={{ ...type.hand, color: withAlpha(colors.ink, 0.35), fontSize: 18, lineHeight: `${LINE}px` }}>what&apos;s weighing on you today?</span>
						</>
					)}
					{entry?.photo ? pouch : null}
					<span style={{ flex: 1 }} />
					{words ? (
						<span style={{ alignSelf: 'flex-end', width: 78, height: 30, transform: 'rotate(-3deg)', background: colors.paperWhite, boxShadow: '0 1.5px 0 rgba(66,43,20,0.17)', position: 'relative', textAlign: 'center' }}>
							<span className="lb-abs" style={{ left: 5, top: -3, width: 24, height: 8, background: 'rgba(245, 238, 220, 0.75)', transform: 'rotate(-7deg)' }} />
							<span style={{ ...type.printItalic, fontSize: 18, lineHeight: '28px', color: colors.sepia }}>edit</span>
						</span>
					) : (
						<span className="lb-row" style={{ alignSelf: 'flex-end', gap: 5, borderBottom: `1px solid ${withAlpha(colors.sepia, 0.5)}` }}>
							<Icon name="pencil" size={14} color={colors.sepia} />
							<span style={{ ...type.printItalic, fontSize: 18, lineHeight: '24px', color: colors.sepia }}>write now</span>
						</span>
					)}
				</button>
			)}
		</div>
	);
	const left =
		entry?.photo || entry?.voice ? (
			<button type="button" className="lb-plain" onClick={onOpen} aria-label="Open today's page" style={{ flex: 1, padding: 12 }}>
				{polaroid}
				{entry.photo ? null : pouch}
			</button>
		) : (
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 12 }}>
				<span style={{ ...type.stampLarge, color: colors.sepia, fontSize: 34, lineHeight: '38px' }}>{today.slice(8)}</span>
				<span style={{ ...type.caption, color: colors.inkMuted }}>{entry ? 'today' : 'a fresh page'}</span>
				<div style={{ marginTop: 12, display: 'grid', justifyItems: 'center', gap: 4 }}>
					{link('+ a photo', onWrite, 'Add a photo to today')}
					{link('+ your voice', onWrite, 'Record a voice note for today')}
				</div>
			</div>
		);
	return (
		<div className="lb-spread" style={{ width, height: h, background: colors.deskDeep, boxShadow: theme.shadow(1.4) }}>
			<span className="lb-abs" style={{ left: 9, right: 9, bottom: 6, height: 6, borderRadius: '0 0 6px 6px', background: colors.paperWhite, borderTop: '1px solid rgba(0,0,0,0.1)' }} />
			<div className="lb-row" style={{ alignItems: 'stretch', position: 'relative' }}>
				{page('left', left)}
				{page('right', right)}
			</div>
			<span className="lb-abs" style={{ left: width / 2 - 1, top: 7, bottom: 11, width: 2, background: 'rgba(0,0,0,0.18)' }} />
		</div>
	);
}

export function HomeScreen({ app }) {
	const { entries, today, profile, go, openYear, flying, keepToday } = app;
	const theme = useTheme();
	const memories = onThisDay(entries, today);
	const todayEntry = entries.find((e) => e.localDate === today);
	return (
		<Page>
			<PageHeader title="Your memories" subtitle={profile.name ? `a little of your life, ${profile.name}` : 'a little of your life, kept for you'} onEmblem={() => tapeSound('clunk', 0.4)} />
			<div>
				<SectionHeader title="From your past self" detail={monthDay(today)} />
				{memories.length > 1 ? (
					<div data-hold-pager>
						<LetterDeck entries={memories} today={today} width={CONTENT_W * 0.8} name={profile.name} onOpen={(id) => go({ name: 'memory', id })} />
					</div>
				) : memories.length === 1 ? (
					<div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
						<Letter entry={memories[0]} today={today} width={CONTENT_W * 0.82} name={profile.name} onOpen={(id) => go({ name: 'memory', id })} />
					</div>
				) : (
					<BuddySays text="Nothing came back today. Whatever you write now returns to you on this day next year." />
				)}
			</div>
			<div>
				<SectionHeader title="Today’s page" />
				<TodaySpread entry={todayEntry} today={today} onOpen={() => todayEntry && go({ name: 'memory', id: todayEntry.id })} onWrite={() => go({ name: 'entry' })} onKeep={keepToday} />
			</div>
			<div>
				<SectionHeader title="Years" />
				<YearsCupboard groups={groupByYear(entries)} today={today} onOpenYear={openYear} flying={flying} />
			</div>
			<PageFooter label="page 1 · the cover" />
			<span hidden>{theme.dark}</span>
		</Page>
	);
}

/* ---------- Years (src/app/(tabs)/years.tsx) ---------- */

export function YearsScreen({ app }) {
	const { entries, today, openYear, flying } = app;
	const groups = groupByYear(entries);
	const oldest = groups[groups.length - 1]?.year;
	return (
		<Page>
			<PageHeader
				title="Years"
				count={groups.length || undefined}
				subtitle={
					oldest !== undefined ? (
						<>
							{entries.length} {entries.length === 1 ? 'memory' : 'memories'} since {oldest}.<br />
							Open a year. Meet yourself again.
						</>
					) : (
						'Your diaries will stand here.'
					)
				}
			/>
			<YearsCupboard groups={groups} today={today} onOpenYear={openYear} flying={flying} />
			<PageFooter label="the bookshelf" />
		</Page>
	);
}

/* ---------- A year's volume (src/app/year/[year].tsx, src/lib/yearSpread.ts) ---------- */

function scatterLayout(ids, o) {
	const pad = (o.itemW * (o.scale - 1)) / 2;
	const maxX = Math.max(pad, o.width - o.itemW - pad);
	const step = o.columns > 1 ? (maxX - pad) / (o.columns - 1) : 0;
	const pitch = o.itemH * o.rowRatio;
	const slots = ids.map((id, i) => {
		const rng = seededRng(`scatter-${id}`);
		const col = i % o.columns;
		const row = Math.floor(i / o.columns);
		const x = pad + col * step + rng.range(-o.itemW * 0.14, o.itemW * 0.14);
		const y = pad + row * pitch + rng.range(-o.itemH * 0.1, o.itemH * 0.1);
		return { x: Math.min(maxX, Math.max(pad, x)), y: Math.max(0, y), rotate: rng.range(-o.maxTilt, o.maxTilt), scale: o.scale };
	});
	const rows = Math.ceil(ids.length / o.columns);
	return { slots, height: rows === 0 ? 0 : pad * 2 + (rows - 1) * pitch + o.itemH * o.scale };
}
function tidyLayout(groups, o) {
	const slots = [];
	const headers = [];
	let y = 0;
	groups.forEach((ids, g) => {
		headers.push(y);
		y += o.headerH;
		const rows = Math.ceil(ids.length / o.columns);
		for (let r = 0; r < rows; r++) {
			const inRow = ids.slice(r * o.columns, (r + 1) * o.columns);
			const rowH = Math.max(...inRow.map((_, k) => o.heights[g][r * o.columns + k]));
			inRow.forEach((id, k) => slots.push({ x: k * (o.itemW + o.gap), y, rotate: seededRng(`tidy-${id}`).range(-o.maxTilt, o.maxTilt), scale: 1 }));
			y += rowH + (r < rows - 1 ? o.gap : 0);
		}
		y += o.groupGap;
	});
	return { slots, headers, height: y };
}

export function YearScreen({ app, year }) {
	const { entries, back, go, reduce } = app;
	const theme = useTheme();
	const { colors } = theme;
	const palette = theme.year(year);
	const list = useMemo(() => entries.filter((e) => parseDate(e.localDate).year === year), [entries, year]);
	const [tidy, setTidy] = useState(false);
	const [shown, setShown] = useState(reduce ? list.length : 0);
	useEffect(() => {
		if (reduce || shown >= list.length) return undefined;
		const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 120 : 55);
		return () => clearTimeout(t);
	}, [shown, list.length, reduce]);
	const W = CONTENT_W;
	const gap = 10;
	const itemW = (W - gap * 2) / 3;
	const cellH = itemW * 1.3;
	const months = groupByMonth(list);
	const order = useMemo(() => [...list].sort((a, b) => seededRng(`order-${a.id}`).next() - seededRng(`order-${b.id}`).next()), [list]);
	const scattered = scatterLayout(order.map((e) => e.id), { width: W, itemW, itemH: cellH, columns: 3, scale: 1.22, rowRatio: 0.62, maxTilt: 16 });
	const MINI = 1.7;
	// Each page's real height on screen (measured once drawn), so tidy rows never overlap.
	const [measured, setMeasured] = useState({});
	const measure = (id) => (el) => {
		if (!el) return;
		const h = Math.round(el.offsetHeight / MINI + 6);
		setMeasured((m) => (Math.abs((m[id] ?? 0) - h) > 1 ? { ...m, [id]: h } : m));
	};
	const heights = months.map((m) => m.entries.map((e) => measured[e.id] ?? cellH));
	const tidied = tidyLayout(months.map((m) => m.entries.map((e) => e.id)), { itemW, cellH, columns: 3, gap, headerH: 52, groupGap: 12, maxTilt: 2.5, heights });
	const flat = months.flatMap((m) => m.entries);
	const pos = (e) => (tidy ? tidied.slots[flat.indexOf(e)] : scattered.slots[order.indexOf(e)]);
	return (
		<>
			<Page bar="dock" wash={palette.primary}>
				<PageHeader title={String(year)} count={list.length} subtitle={list.length === 0 ? undefined : tidy ? 'moments on a string, month by month' : 'every page, loose in the volume'} />
				<div className="lb-pile" style={{ height: tidy ? tidied.height : scattered.height }}>
					{months.map((m, i) => (
						<div key={m.month} className={`lb-month${tidy ? ' is-on' : ''}`} style={{ top: tidied.headers[i] }}>
							<span style={{ ...type.month, color: colors.giltBright }}>{MONTHS[m.month - 1]}</span>
							<span style={{ ...type.stamp, color: colors.giltBright, border: `1px solid ${colors.gilt}`, borderRadius: 3, padding: '1px 6px' }}>{m.entries.length}</span>
							<span style={{ flex: 1, height: 1.4, background: colors.gilt, opacity: 0.6 }} />
						</div>
					))}
					{order.slice(0, shown).map((e) => {
						const s = pos(e);
						return (
							<div key={e.id} className="lb-pile-item" style={{ width: itemW, zIndex: tidy ? 1 : order.indexOf(e), transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rotate}deg) scale(${s.scale})` }}>
								<div ref={measure(e.id)} style={{ width: itemW * MINI, transform: `scale(${1 / MINI})`, transformOrigin: '0 0' }}>
									<ScrapObject entry={e} width={itemW * MINI} lines={5} lift={0.6} onPress={() => go({ name: 'memory', id: e.id })} />
								</div>
							</div>
						);
					})}
				</div>
				{list.length > 0 ? <PageFooter label={`${year} · ${list.length} ${list.length === 1 ? 'page' : 'pages'}`} /> : null}
			</Page>
			<Dock
				actions={[
					{ key: 'back', icon: 'back', label: 'Back', onPress: back },
					{ key: 'tidy', icon: tidy ? 'shuffle' : 'albums', label: tidy ? 'Scatter' : 'Tidy up', tint: colors.giltBright, active: tidy, onPress: () => setTidy((t) => !t) },
				]}
			/>
		</>
	);
}

/* ---------- A memory (src/app/memory/[id].tsx) ---------- */

export function MemoryScreen({ app, id }) {
	const { entries, today, back, go, writeBack, labelVoice, removeEntry, fromPerson } = app;
	const theme = useTheme();
	const { colors } = theme;
	const entry = entries.find((e) => e.id === id) ?? app.received.find((e) => e.id === id);
	const given = !!entry?.from;
	const player = useVoicePlayer(entry?.voice ?? null);
	const [turned, setTurned] = useState(false);
	const [writing, setWriting] = useState(false);
	const [draft, setDraft] = useState('');
	const [labeling, setLabeling] = useState(false);
	const [labelDraft, setLabelDraft] = useState('');
	const [asking, setAsking] = useState(false);
	const [shredding, setShredding] = useState(false);
	const [held, setHeld] = useState(false);
	if (!entry) {
		return (
			<>
				<Page bar="dock">
					<PageHeader title="A memory" emblem={false} />
					<BuddySays text="This memory isn't here anymore." />
				</Page>
				<Dock actions={[{ key: 'back', icon: 'back', label: 'Back', onPress: back }]} />
			</>
		);
	}
	const year = parseDate(entry.localDate).year;
	const hasPage = entry.text.trim().length > 0 || !!entry.photo;
	const canWriteBack = !given && entry.localDate < today;
	const label = entry.voice?.title || 'A little of me';
	const cardW = Math.min(SCREEN_W - 56, 300);
	const startWriting = () => {
		setLabeling(false);
		setDraft(entry.reply ?? '');
		setWriting(true);
	};
	const actions = writing
		? [
				{ key: 'cancel', icon: 'close', label: 'Cancel', onPress: () => setWriting(false) },
				{
					key: 'seal',
					icon: 'check',
					label: entry.reply && !draft.trim() ? 'Remove' : 'Seal it',
					primary: colors.primary,
					onPress: () => {
						writeBack(entry.id, draft);
						setWriting(false);
					},
				},
			]
		: [{ key: 'back', icon: 'back', label: 'Back', onPress: back }];
	if (!writing && hasPage) actions.push({ key: 'turn', icon: 'sync', label: turned ? 'Front' : 'Turn', onPress: () => setTurned((t) => !t) });
	if (!writing && canWriteBack) actions.push({ key: 'reply', icon: 'edit', label: 'Reply', tint: colors.giltBright, onPress: startWriting });
	if (!writing && !given) actions.push({ key: 'give', icon: 'gift', label: 'Give', onPress: () => go({ name: 'give', id: entry.id }) });
	if (!writing && !given) actions.push({ key: 'delete', icon: 'trash', label: 'Delete', onPress: () => setAsking(true) });
	return (
		<>
			<Page bar="dock">
				<PageHeader title={monthDay(entry.localDate)} subtitle={given ? `from ${entry.from} · given on ${displayDate(entry.givenOn)}` : `${memoryKicker(entry.localDate, today)} · ${year}`} emblem={false} />
				<div className={`lb-memory${shredding ? ' is-shredding' : ''}`} style={{ display: 'grid', justifyItems: 'center', gap: 24, padding: '16px 0' }}>
					{given ? (
						<div className="lb-row" style={{ gap: 12, width: '100%' }}>
							<PersonSeal name={entry.from} portrait={fromPerson(entry.from)?.portrait} size={56} />
							<span style={{ ...type.caption, color: colors.onDeskMuted }}>A page {entry.from} gave you, phone to phone. Kept here, on this phone only.</span>
						</div>
					) : null}
					{hasPage ? <MemoryCard entry={entry} width={cardW} back={turned} onTurn={() => setTurned((t) => !t)} /> : null}
					{!writing && entry.voice && player ? (
						<div style={{ width: '100%' }}>
							<TapeRecorder player={player} label={label} held={held} onLift={() => setHeld(true)} />
						</div>
					) : null}
					{entry.voice && !writing && !given ? (
						labeling ? (
							<div style={{ width: '100%', background: colors.paper, padding: 16, display: 'grid', gap: 8, boxShadow: theme.shadow(1) }}>
								<span style={{ ...type.caption, color: colors.inkMuted }}>A few words for the cassette</span>
								<input className="lb-input" value={labelDraft} onChange={(e) => setLabelDraft(e.target.value)} maxLength={60} autoFocus placeholder="e.g. The walk home" aria-label="Cassette label" style={{ ...type.hand, color: colors.inkBlue }} />
								<div className="lb-row" style={{ justifyContent: 'flex-end', gap: 16 }}>
									<button type="button" className="lb-plain" onClick={() => setLabeling(false)} style={{ ...type.label, color: colors.inkMuted, minHeight: 44 }}>
										Cancel
									</button>
									<button
										type="button"
										className="lb-plain"
										onClick={() => {
											labelVoice(entry.id, labelDraft);
											setLabeling(false);
										}}
										style={{ ...type.label, color: colors.ink, minHeight: 44 }}
									>
										Keep label
									</button>
								</div>
							</div>
						) : (
							<button
								type="button"
								className="lb-plain"
								onClick={() => {
									setLabelDraft(entry.voice.title ?? '');
									setLabeling(true);
								}}
								style={{ ...type.caption, color: colors.onDesk, minHeight: 44 }}
							>
								{entry.voice.title ? 'Rewrite the cassette label' : 'Write a few words on the cassette'}
							</button>
						)
					) : null}
					{entry.reply || writing ? (
						<div className="lb-note" style={{ background: colors.paper, boxShadow: theme.shadow(1) }}>
							<Texture kind="paper" opacity={0.7} />
							<span style={{ ...type.caption, color: colors.sepia, position: 'relative' }}>a note beside this memory</span>
							{writing ? (
								<textarea
									className="lb-write"
									value={draft}
									onChange={(e) => setDraft(e.target.value)}
									autoFocus
									rows={3}
									placeholder="How does this feel now? What would you tell yourself that day?"
									aria-label="Your reply to your past self"
									style={{ ...type.hand, color: colors.sepia, position: 'relative' }}
								/>
							) : (
								<p style={{ ...type.hand, color: colors.sepia, position: 'relative', whiteSpace: 'pre-wrap' }}>{entry.reply}</p>
							)}
							{!writing && entry.repliedOn ? <span style={{ ...type.caption, color: colors.inkMuted, position: 'relative' }}>written back on {displayDate(entry.repliedOn)}</span> : null}
						</div>
					) : null}
				</div>
				<div style={{ display: 'grid', justifyItems: 'center', gap: 2, marginTop: -16 }}>
					{canWriteBack && !entry.reply && !writing ? (
						<button type="button" className="lb-plain lb-row" onClick={startWriting} style={{ gap: 6, borderBottom: `1px solid ${colors.onDeskMuted}` }}>
							<Icon name="pencil" size={15} color={colors.onDesk} />
							<span style={{ ...type.caption, color: colors.onDesk }}>Leave a note beside this.</span>
						</button>
					) : null}
					<span style={{ ...type.caption, color: colors.onDeskMuted, fontSize: 14 }}>sealed on {displayDate(entry.createdAt.slice(0, 10))}</span>
				</div>
				<PageFooter label={`a page from ${year}`} />
			</Page>
			<Dock actions={actions} />
			{held && player ? (
				<LiftedCassette
					player={player}
					label={label}
					onPutDown={() => {
						player.stop();
						setHeld(false);
					}}
				/>
			) : null}
			{asking ? (
				<ConfirmSheet
					title="Tear out this page?"
					message={`The page from ${displayDate(entry.localDate)}${entry.photo ? ', photo and all' : entry.voice ? ', voice and all' : ''} leaves this phone now, and your Drive backup at the next backup. There's no getting it back.`}
					confirmLabel="Tear it out"
					confirmIcon="trash"
					onConfirm={() => {
						setAsking(false);
						player?.stop();
						setShredding(true);
						setTimeout(() => removeEntry(entry.id), 900);
					}}
					onCancel={() => setAsking(false)}
				/>
			) : null}
		</>
	);
}

/* ---------- The writing page (src/app/entry.tsx, VoiceRecorder.tsx) ---------- */

function useRecorder(onDone) {
	const [recording, setRecording] = useState(false);
	const [elapsed, setElapsed] = useState(0);
	const [level, setLevel] = useState(0);
	const rec = useRef(null);
	const started = useRef(0);
	const stream = useRef(null);
	const analyser = useRef(null);
	const sample = useRef(false);
	const chunks = useRef([]);
	useFrame(recording, () => {
		const t = performance.now() - started.current;
		setElapsed(t);
		if (analyser.current) {
			const buf = new Uint8Array(analyser.current.fftSize);
			analyser.current.getByteTimeDomainData(buf);
			let peak = 0;
			for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i] - 128) / 128);
			setLevel(Math.min(1, peak * 2.4));
		} else setLevel(0.3 + 0.4 * Math.abs(Math.sin(t / 180)));
		if (t >= VOICE_MAX_MS) stop();
	});
	const finish = (url) => {
		const ms = Math.max(1000, Math.round(performance.now() - started.current));
		setRecording(false);
		stream.current?.getTracks().forEach((tr) => tr.stop());
		stream.current = null;
		analyser.current = null;
		onDone(url ? { url, ms, title: null } : { seed: Math.floor(Math.random() * 1e9), ms, title: null, sample: true });
	};
	const start = async () => {
		chunks.current = [];
		sample.current = false;
		try {
			const s = await navigator.mediaDevices.getUserMedia({ audio: true });
			stream.current = s;
			const ctx = new (window.AudioContext || window.webkitAudioContext)();
			const an = ctx.createAnalyser();
			an.fftSize = 256;
			ctx.createMediaStreamSource(s).connect(an);
			analyser.current = an;
			const mr = new MediaRecorder(s);
			mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
			mr.onstop = () => finish(URL.createObjectURL(new Blob(chunks.current, { type: mr.mimeType || 'audio/webm' })));
			rec.current = mr;
			mr.start();
		} catch {
			// No microphone (refused or none): record a sample tape instead, so the flow still shows.
			sample.current = true;
			rec.current = null;
		}
		tapeSound('start', 0.4);
		started.current = performance.now();
		setElapsed(0);
		setRecording(true);
	};
	function stop() {
		tapeSound('stop', 0.4);
		if (rec.current && rec.current.state !== 'inactive') rec.current.stop();
		else finish(null);
	}
	return { recording, elapsed, level, start, stop, sample: sample.current };
}

/** Today's page is sealed: the page shrinks, a wax seal is pressed on it, and it says when it comes back (SealPress). */
function SealPress({ entry, until, onDone }) {
	const { colors } = useTheme();
	useEffect(() => {
		const t = setTimeout(onDone, 1900);
		return () => clearTimeout(t);
	}, [onDone]);
	return (
		<div className="lb-seal" onClick={onDone} role="status">
			<div className="lb-seal-page">
				<DiaryPage entry={entry} width={230} lines={4} lift={2} />
				<span className="lb-seal-wax" style={{ background: colors.wax }}>
					<span style={{ ...type.stamp, color: '#E8C9A0', fontSize: 9, letterSpacing: 1 }}>LOOK</span>
					<span style={{ ...type.stamp, color: '#E8C9A0', fontSize: 9, letterSpacing: 1 }}>BACK</span>
				</span>
			</div>
			<p style={{ ...type.headline, color: '#F0E4CC', textAlign: 'center' }}>Sealed.</p>
			<p style={{ ...type.caption, color: 'rgba(240,228,204,0.8)', textAlign: 'center' }}>It comes back to you on {until}.</p>
		</div>
	);
}

/** Shrinks a picked photo (the app shrinks to 1600 px; here 900 px, so it fits in this browser's storage). */
function readPhoto(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = reject;
		reader.onload = () => {
			const img = new Image();
			img.onerror = reject;
			img.onload = () => {
				const k = Math.min(1, 900 / Math.max(img.width, img.height));
				const c = document.createElement('canvas');
				c.width = Math.round(img.width * k);
				c.height = Math.round(img.height * k);
				c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
				resolve(c.toDataURL('image/jpeg', 0.82));
			};
			img.src = reader.result;
		};
		reader.readAsDataURL(file);
	});
}

export function EntryScreen({ app }) {
	const { entries, today, back, saveToday, removeEntry } = app;
	const theme = useTheme();
	const { colors } = theme;
	const existing = entries.find((e) => e.localDate === today) ?? null;
	const [text, setText] = useState(existing?.text ?? '');
	const [photo, setPhoto] = useState(existing?.photo ?? null);
	const [voice, setVoice] = useState(existing?.voice ?? null);
	const [sheet, setSheet] = useState(false);
	const [askVoice, setAskVoice] = useState(false);
	const [askDelete, setAskDelete] = useState(false);
	const [sealing, setSealing] = useState(null);
	const fileRef = useRef(null);
	const camRef = useRef(null);
	const rec = useRecorder((v) => setVoice(v));
	const player = useVoicePlayer(rec.recording ? null : voice);
	const canSave = text.trim().length > 0 || !!photo || !!voice;
	const comesBack = displayDate(shiftYears(today, 1));
	const preview = { id: existing?.id ?? `mine-${today}`, localDate: today, text, photo, voice: voice && !rec.recording ? voice : null, reply: null, createdAt: today };
	const pick = (ref) => {
		setSheet(false);
		ref.current?.click();
	};
	const onFile = async (e) => {
		const file = e.target.files?.[0];
		e.target.value = '';
		if (!file) return;
		try {
			setPhoto({ url: await readPhoto(file) });
		} catch {
			app.toast("Couldn't read that photo");
		}
	};
	const save = () => {
		if (!canSave || rec.recording) return;
		player?.stop();
		const entry = saveToday({ text, photo, voice });
		setSealing(entry);
	};
	const actions = [
		{ key: 'close', icon: 'close', label: 'Close', onPress: back },
		{ key: 'photo', icon: 'image', label: 'Photo', tint: colors.giltBright, active: sheet, onPress: () => setSheet((s) => !s) },
		...(voice && !rec.recording
			? []
			: [
					{
						key: 'voice',
						icon: rec.recording ? 'stop' : 'mic',
						label: rec.recording ? 'Stop' : 'Voice',
						tint: colors.giltBright,
						active: rec.recording,
						onPress: () => {
							setSheet(false);
							if (rec.recording) rec.stop();
							else rec.start();
						},
					},
				]),
		...(existing ? [{ key: 'delete', icon: 'trash', label: 'Delete', onPress: () => setAskDelete(true) }] : []),
		{ key: 'save', icon: 'check', label: existing ? 'Update' : 'Seal', primary: colors.primary, disabled: !canSave || rec.recording, onPress: save },
	];
	const nav = theme.nav;
	return (
		<>
			<Page bar="dock" gap={24}>
				<PageHeader title="Today's page" />
				<div style={{ display: 'grid', justifyItems: 'center', gap: 16 }}>
					<DiaryPage
						entry={preview}
						width={CONTENT_W - 8}
						player={player}
						editor={{ value: text, onChange: setText, placeholder: 'What is weighing on you today?', autoFocus: !existing, label: "Today's page" }}
					/>
					<p style={{ ...type.caption, color: colors.onDeskMuted, textAlign: 'center' }}>{canSave ? `Seal it, and it comes back to you on ${comesBack}.` : 'Write it as it is. No one reads this but you, a year from now.'}</p>
				</div>
			</Page>
			<Dock actions={actions}>
				{sheet ? (
					<div className="lb-sheetup" style={{ background: colors.panel, boxShadow: theme.shadow(1) }}>
						<span style={{ ...type.label, color: colors.ink }}>{photo ? 'Another photo?' : 'Tuck a photo into the page'}</span>
						<div className="lb-row" style={{ gap: 12 }}>
							<PillButton label="Library" icon="images" grow onClick={() => pick(fileRef)} />
							<PillButton label="Camera" icon="camera" grow onClick={() => pick(camRef)} />
						</div>
						{photo ? (
							<PillButton
								label="Take the photo out"
								icon="close"
								onClick={() => {
									setPhoto(null);
									setSheet(false);
								}}
							/>
						) : null}
					</div>
				) : null}
				{rec.recording ? (
					<div style={{ padding: '0 20px 8px' }}>
						<div className="lb-actionrow" style={{ background: nav.strip, boxShadow: theme.shadow(1) }}>
							<div className="lb-row" style={{ flex: 2, gap: 10, padding: '0 12px' }}>
								<span className="lb-reclamp" />
								<span style={{ ...type.label, color: nav.ink }}>{formatVoiceMs(rec.elapsed)}</span>
								<span className="lb-meter" aria-hidden="true">
									<span style={{ transform: `scaleX(${Math.max(0.04, rec.level)})`, background: theme.colors.gilt }} />
								</span>
							</div>
							<button type="button" className="lb-tab lb-tabpress" onClick={rec.stop} style={{ height: 52 }}>
								<WashIn color={colors.giltBright} />
								<Icon name="stop" size={20} color={nav.ink} />
								<span style={{ ...type.small, fontSize: 13, color: nav.ink, fontWeight: 700, position: 'relative' }}>Done</span>
							</button>
						</div>
						<p style={{ ...type.small, color: colors.onDeskMuted, textAlign: 'center', marginTop: 4 }}>{rec.sample ? 'no microphone here, so a sample tape is recording' : 'your voice, on tape · up to a minute'}</p>
					</div>
				) : voice ? (
					<div style={{ padding: '0 20px 8px' }}>
						<ActionRow
							lead={
								<span style={{ padding: '0 8px', ...type.label, color: colors.ink, position: 'relative', alignSelf: 'center' }}>{formatVoiceMs(voice.ms)}</span>
							}
							actions={[
								{ key: 'listen', icon: player?.playing ? 'pause' : 'play', label: player?.playing ? 'Pause' : 'Listen', tint: colors.giltBright, active: player?.playing, onPress: () => player?.toggle() },
								{
									key: 'again',
									icon: 'refresh',
									label: 'Re-record',
									onPress: () => {
										player?.stop();
										rec.start();
									},
								},
								{ key: 'remove', icon: 'trash', label: 'Remove', onPress: () => setAskVoice(true) },
							]}
						/>
					</div>
				) : null}
			</Dock>
			<input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
			<input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
			{askVoice ? (
				<ConfirmSheet
					title="Take the tape out?"
					message={`Only the voice note goes; your words${photo ? ' and photo stay' : ' stay'}.`}
					confirmLabel="Take it out"
					confirmIcon="trash"
					onConfirm={() => {
						setAskVoice(false);
						player?.stop();
						setVoice(null);
					}}
					onCancel={() => setAskVoice(false)}
				/>
			) : null}
			{askDelete && existing ? (
				<ConfirmSheet
					title="Tear out today's page?"
					message={`Today's page${existing.photo ? ', photo and all,' : existing.voice ? ', voice and all,' : ''} leaves this phone now, and your Drive backup at the next backup. There's no getting it back.`}
					confirmLabel="Tear it out"
					confirmIcon="trash"
					onConfirm={() => {
						setAskDelete(false);
						removeEntry(existing.id);
					}}
					onCancel={() => setAskDelete(false)}
				/>
			) : null}
			{sealing ? <SealPress entry={sealing} until={comesBack} onDone={back} /> : null}
		</>
	);
}

/* ---------- Shared (src/app/(tabs)/shared.tsx) and giving a page (src/app/letters.tsx) ---------- */

export function SharedScreen({ app }) {
	const { people, received, go, toast, profile } = app;
	const theme = useTheme();
	const { colors } = theme;
	return (
		<Page>
			<PageHeader title="Shared" subtitle="pages passed between you and your people" emblem={false} />
			<Panel>
				<h4 style={{ ...type.heading, color: colors.ink, borderBottom: `1px solid ${colors.ruleLine}`, paddingBottom: 4, marginBottom: 8 }}>Given to you</h4>
				{received.length === 0 ? <Help>Pages people give you are kept here, on this phone only.</Help> : null}
				{received.map((r) => (
					<button key={r.id} type="button" className="lb-row lb-person lb-press" onClick={() => go({ name: 'memory', id: r.id })}>
						<PersonSeal name={r.from} portrait={people.find((p) => p.name === r.from)?.portrait} size={52} />
						<span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
							<span style={{ ...type.label, color: colors.ink, display: 'block' }}>{r.from}</span>
							<span style={{ ...type.caption, fontSize: 15, color: colors.inkMuted, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
								a page from {displayDate(r.localDate)} · {r.voice ? 'recorded' : 'written'}
							</span>
						</span>
						<Icon name="forward" size={18} color={colors.ink} />
					</button>
				))}
			</Panel>
			<Panel>
				<h4 style={{ ...type.heading, color: colors.ink, borderBottom: `1px solid ${colors.ruleLine}`, paddingBottom: 4, marginBottom: 8 }}>Your people</h4>
				{people.map((p) => (
					<div key={p.name} className="lb-row lb-person">
						<PersonSeal name={p.name} portrait={p.portrait} size={52} />
						<span style={{ flex: 1 }}>
							<span style={{ ...type.label, color: colors.ink, display: 'block' }}>{p.name}</span>
							<span style={{ ...type.caption, fontSize: 15, color: colors.inkMuted }}>added {displayDate(p.added)}</span>
						</span>
						<button type="button" className="lb-plain" aria-label={`Remove ${p.name}`} onClick={() => toast(`${p.name} stays in this demo`)}>
							<Icon name="closeCircle" size={22} color={colors.ink} />
						</button>
					</div>
				))}
				<p style={{ ...type.caption, color: colors.inkMuted, textAlign: 'center', marginTop: 8 }}>Looking for people beside you… ask them to open Shared on their phone.</p>
				<div className="lb-row" style={{ gap: 8, marginTop: 4 }}>
					<Icon name="radio" size={18} color="#4A7FC0" />
					<span style={{ ...type.caption, color: colors.inkMuted }}>People beside you can find you as {profile.name || 'you'} while this page is open.</span>
				</div>
			</Panel>
			<div className="lb-row" style={{ gap: 12 }}>
				<PillButton label="My code" icon="qr" grow onClick={() => toast('On the phone this shows your QR code')} />
				<PillButton label="Scan" icon="scan" grow onClick={() => toast("On the phone this scans a friend's code")} />
			</div>
			<PageFooter label="shared · phone to phone" />
		</Page>
	);
}

export function GiveScreen({ app, id }) {
	const { entries, people, back, toast } = app;
	const theme = useTheme();
	const { colors } = theme;
	const entry = entries.find((e) => e.id === id);
	const [flying, setFlying] = useState(null);
	const give = (p) => {
		setFlying(p.name);
		setTimeout(() => {
			toast(`Given to ${p.name}, phone to phone`);
			back();
		}, 1700);
	};
	return (
		<>
			<Page bar="dock">
				<PageHeader title="Give this page" subtitle={entry ? `from ${displayDate(entry.localDate)}` : ''} emblem={false} />
				{entry ? <ScrapObject entry={entry} width={CONTENT_W * 0.8} lines={4} /> : null}
				<Panel>
					<h4 style={{ ...type.heading, color: colors.ink, marginBottom: 8 }}>To someone you trust</h4>
					{people.map((p) => (
						<button key={p.name} type="button" className="lb-row lb-person lb-press" onClick={() => give(p)} disabled={!!flying}>
							<PersonSeal name={p.name} portrait={p.portrait} size={52} />
							<span style={{ ...type.label, color: colors.ink, flex: 1, textAlign: 'left' }}>Give to {p.name}</span>
							<Icon name="gift" size={20} color={colors.ink} />
						</button>
					))}
					<Help>It goes straight from your phone to theirs, sealed with your phone&apos;s key, never online. (In this web copy nothing is sent.)</Help>
				</Panel>
			</Page>
			<Dock actions={[{ key: 'back', icon: 'back', label: 'Back', onPress: back }]} />
			{flying ? (
				<div className="lb-giftflight" aria-live="polite">
					<div className="lb-giftflight-env" style={{ background: colors.paperWhite }}>
						<span style={{ ...type.hand, color: colors.inkBlue, fontSize: 22 }}>for: {flying} ♡</span>
					</div>
					<p style={{ ...type.caption, color: '#F0E4CC' }}>going to {flying}…</p>
				</div>
			) : null}
		</>
	);
}

/* ---------- You (src/app/(tabs)/you.tsx, SettingsCards.tsx) ---------- */

export function YouScreen({ app }) {
	const { profile, setProfile, look, setLook, reminder, setReminder, go, toast, people, received, autoAccept, setAutoAccept } = app;
	const theme = useTheme();
	const { colors } = theme;
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(profile.name);
	const save = () => {
		setEditing(false);
		setProfile({ ...profile, name: draft.trim() });
	};
	const time = new Date(2000, 0, 1, reminder.hour, reminder.minute).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
	return (
		<Page>
			<PageHeader title="You" subtitle={profile.name ? `${profile.name}'s diary` : 'whose diary is this?'} />
			<Panel>
				<CardTitle icon="person" title="You" />
				<div className="lb-row" style={{ gap: 16, padding: '8px 0' }}>
					<button type="button" className="lb-plain lb-press" onClick={() => go({ name: 'portrait' })} aria-label="Your portrait. Tap to change it">
						<PersonSeal name={profile.name} portrait={profile.portrait} size={96} />
					</button>
					<span style={{ ...type.caption, color: colors.inkMuted, flex: 1 }}>{profile.portrait ? 'Your portrait, on the pages you give.' : 'Make a portrait of yourself for the pages you give.'}</span>
				</div>
				<Row label={profile.portrait ? 'Change your portrait' : 'Make your portrait'} divider onClick={() => go({ name: 'portrait' })}>
					<Icon name="arrow" size={16} color={colors.ink} />
				</Row>
				<Row label="Name" divider>
					{editing ? (
						<input
							className="lb-input"
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							onBlur={save}
							onKeyDown={(e) => e.key === 'Enter' && save()}
							autoFocus
							placeholder="your name"
							maxLength={24}
							aria-label="Your name"
							style={{ ...type.hand, color: colors.ink, width: 130, textAlign: 'right' }}
						/>
					) : (
						<button
							type="button"
							className="lb-plain"
							onClick={() => {
								setDraft(profile.name);
								setEditing(true);
							}}
							style={{ ...type.hand, color: profile.name ? colors.ink : colors.inkMuted, minWidth: 110, textAlign: 'right' }}
						>
							{profile.name || 'add ✎'}
						</button>
					)}
				</Row>
				<Help>People you give a page to see it from this name.</Help>
			</Panel>
			<Panel>
				<CardTitle icon="color" title="Look" />
				<LookPicker look={look} onLook={setLook} />
				<Help>The colour of your paper. Night is the same paper by lamplight.</Help>
			</Panel>
			<Panel>
				<CardTitle icon="bell" title="Reminders" />
				<CheckRow label="Letters from past years" checked={reminder.enabled} onClick={() => setReminder({ ...reminder, enabled: !reminder.enabled })} />
				{reminder.enabled ? (
					<Row label="Arrive at" divider>
						<label className="lb-time" style={{ ...type.handLarge, color: colors.ink }}>
							{time}
							<input
								type="time"
								value={`${String(reminder.hour).padStart(2, '0')}:${String(reminder.minute).padStart(2, '0')}`}
								onChange={(e) => {
									const [h, m] = e.target.value.split(':').map(Number);
									if (!Number.isNaN(h)) setReminder({ ...reminder, hour: h, minute: m });
								}}
								aria-label="Reminder time"
							/>
						</label>
					</Row>
				) : null}
				<Help>Only on days that have a memory from an earlier year.{reminder.enabled ? ' 10 coming up in the next 30 days.' : ''}</Help>
			</Panel>
			<Panel>
				<CardTitle icon="settings" title="Settings" />
				<Help>About the diary, and reading the first page again.</Help>
				<Row label="Open settings" divider onClick={() => go({ name: 'settings' })}>
					<Icon name="arrow" size={16} color={colors.ink} />
				</Row>
			</Panel>
			<Panel>
				<CardTitle icon="google" title="Google account" />
				<Help>One connection for two things: a private copy of your diary in your own Drive (a &ldquo;LookBack&rdquo; folder only you can see), and letting the people you trust give you pages.</Help>
				<PillButton label="Connect Google" icon="google" tone="dark" large onClick={() => toast('On the phone this signs in to your own Google Drive')} />
				<div style={{ height: 8 }} />
			</Panel>
			<Panel>
				<CardTitle icon="people" title="Shared" />
				<Row label="Your people">
					<span style={{ ...type.printItalic, color: colors.ink }}>{people.length}</span>
				</Row>
				<Row label="Pages given to you" divider>
					<span style={{ ...type.printItalic, color: colors.ink }}>{received.length}</span>
				</Row>
				<Row label="Waiting to go" divider>
					<span style={{ ...type.printItalic, color: colors.ink }}>0</span>
				</Row>
				<CheckRow label="Pages from my people arrive by themselves" checked={autoAccept} onClick={() => setAutoAccept(!autoAccept)} />
				<Help>Only from people you added. Anyone else still asks first.</Help>
				<Row label="Open Shared" divider onClick={() => app.setTab(2)}>
					<Icon name="arrow" size={16} color={colors.ink} />
				</Row>
			</Panel>
			<PageFooter label="you · your account" />
		</Page>
	);
}

/* ---------- Settings (src/app/settings.tsx) ---------- */

export function SettingsScreen({ app }) {
	const { back, go, resetDemo } = app;
	const { colors } = useTheme();
	const [ask, setAsk] = useState(false);
	return (
		<>
			<Page bar="dock">
				<PageHeader title="Settings" subtitle="make this diary yours" emblem={false} />
				<Panel>
					<CardTitle icon="info" title="About" />
					<Row label="LookBack">
						<span style={{ ...type.printItalic, color: colors.ink }}>1.3.0</span>
					</Row>
					<Help>One small page a day. A year later, it comes back. Everything stays on this phone, with an optional backup to your own Drive.</Help>
					<Row label="Read the first page again" divider onClick={() => go({ name: 'welcome' })}>
						<Icon name="arrow" size={16} color={colors.ink} />
					</Row>
				</Panel>
				<Panel>
					<CardTitle icon="refresh" title="This web copy" />
					<Help>Your own pages, photos, replies and choices are kept only in this browser. Nothing is sent anywhere.</Help>
					<Row label="Start over with the sample diary" divider onClick={() => setAsk(true)}>
						<Icon name="arrow" size={16} color={colors.ink} />
					</Row>
				</Panel>
				<PageFooter label="the last page · settings" />
			</Page>
			<Dock actions={[{ key: 'back', icon: 'back', label: 'Back', onPress: back }]} />
			{ask ? (
				<ConfirmSheet
					title="Start over?"
					message="Your pages, replies and choices in this browser go; the sample diary comes back."
					confirmLabel="Start over"
					confirmIcon="refresh"
					onConfirm={() => {
						setAsk(false);
						resetDemo();
					}}
					onCancel={() => setAsk(false)}
				/>
			) : null}
		</>
	);
}

/* ---------- The portrait maker (src/app/portrait.tsx, PortraitChoices.tsx) ---------- */

export function PortraitScreen({ app }) {
	const { profile, setProfile, back, toast } = app;
	const theme = useTheme();
	const { colors } = theme;
	const [p, setP] = useState(() => profile.portrait ?? defaultPortrait(profile.name || 'someone'));
	return (
		<>
			<Page bar="dock" gap={16}>
				<PageHeader title="Your portrait" subtitle="how your people will see you" emblem={false} />
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<FilmPortrait portrait={p} size={200} hole={colors.desk} />
				</div>
				<Panel>
					{PORTRAIT_SECTIONS.map(({ part, label, swatch }) => (
						<div key={part} style={{ marginBottom: 10 }}>
							<span style={{ ...type.printItalic, fontSize: 19, color: colors.ink, display: 'block', marginBottom: 6 }}>{label}</span>
							<div className="lb-choices">
								{PORTRAIT_OPTIONS[part].map((opt, i) => {
									const on = p[part] === i;
									if (swatch) {
										return (
											<button
												key={opt}
												type="button"
												className="lb-swatch"
												aria-label={`${label} ${opt}`}
												aria-pressed={on}
												onClick={() => setP({ ...p, [part]: i })}
												style={{ background: PORTRAIT_SWATCHES[part][i], boxShadow: on ? `0 0 0 2px ${colors.panel}, 0 0 0 4px ${colors.ink}` : 'inset 0 0 0 1px rgba(0,0,0,0.15)' }}
											/>
										);
									}
									return (
										<button
											key={opt}
											type="button"
											className="lb-chip"
											aria-pressed={on}
											onClick={() => setP({ ...p, [part]: i })}
											style={{ background: on ? colors.ink : 'transparent', color: on ? colors.panel : colors.ink, borderColor: on ? colors.ink : withAlpha(colors.ink, 0.25), ...type.label, fontSize: 17 }}
										>
											{opt}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</Panel>
			</Page>
			<Dock
				actions={[
					{ key: 'back', icon: 'back', label: 'Back', onPress: back },
					{ key: 'surprise', icon: 'shuffle', label: 'Surprise', onPress: () => setP({ ...randomPortrait(), film: p.film }) },
					{
						key: 'save',
						icon: 'check',
						label: 'Save',
						primary: colors.primary,
						onPress: () => {
							setProfile({ ...profile, portrait: p });
							toast('Your portrait is kept');
							back();
						},
					},
				]}
			/>
		</>
	);
}

/* ---------- First run (src/app/welcome.tsx) ---------- */

const STEPS = ['hello', 'name', 'portrait', 'paper', 'reminder', 'backup', 'done'];

export function WelcomeScreen({ app }) {
	const { profile, setProfile, look, setLook, reminder, setReminder, finishWelcome, go } = app;
	const theme = useTheme();
	const { colors } = theme;
	const [step, setStep] = useState(0);
	const [name, setName] = useState(profile.name);
	const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
	const current = STEPS[step];
	const who = name.trim();
	const time = new Date(2000, 0, 1, reminder.hour, reminder.minute).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
	const page = (title, body, children) => (
		<div style={{ display: 'grid', gap: 16 }}>
			<h3 style={{ ...type.titleNarrow, color: colors.giltBright, textAlign: 'center' }}>{title}</h3>
			<p style={{ ...type.printItalic, color: colors.onDeskMuted, textAlign: 'center', fontSize: 19, lineHeight: '27px' }}>{body}</p>
			<div style={{ display: 'grid', gap: 12, marginTop: 12 }}>{children}</div>
		</div>
	);
	return (
		<div className="lb-page">
			<Desk />
			<div className="lb-welcome">
				<div className="lb-row" style={{ justifyContent: 'center', gap: 12, padding: '8px 0 16px' }} aria-label={`Step ${step + 1} of ${STEPS.length}`}>
					{STEPS.map((s, i) => (
						<span key={s} style={{ width: 9, height: 9, transform: 'rotate(45deg)', border: `1px solid ${colors.gilt}`, background: i <= step ? colors.gilt : 'transparent' }} />
					))}
				</div>
				<div key={current} className="lb-welcome-step">
					{current === 'portrait' ? null : (
						<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
							<Cassette width={current === 'hello' || current === 'done' ? 170 : 110} title="LookBack" />
						</div>
					)}
					{current === 'hello'
						? page('This is your diary', "Write down what's weighing on you, or say it out loud onto a tape. A year from today it comes back to you, so you can see how it feels now.", <PillButton label="Begin" icon="arrow" tone="dark" large onClick={next} />)
						: null}
					{current === 'name'
						? page(
								'Whose diary is this?',
								'A first name, for the cover. You can skip this.',
								<>
									<div style={{ background: colors.panel, padding: '8px 16px', borderRadius: 6, boxShadow: theme.shadow(1) }}>
										<input className="lb-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="your name" maxLength={24} aria-label="Your name" style={{ ...type.handLarge, color: colors.ink, width: '100%', textAlign: 'center' }} />
									</div>
									<PillButton
										label={who ? 'That’s me' : 'Skip'}
										icon="arrow"
										tone="dark"
										large
										onClick={() => {
											setProfile({ ...profile, name: who });
											next();
										}}
									/>
								</>,
							)
						: null}
					{current === 'portrait'
						? page(
								'And what do you look like?',
								"Make a little portrait of yourself. It goes with the pages you give, so your people know they're from you. Change it any time on You.",
								<>
									<div style={{ display: 'flex', justifyContent: 'center' }}>
										<FilmPortrait portrait={profile.portrait ?? defaultPortrait(who || 'someone')} size={150} hole={colors.desk} />
									</div>
									<PillButton label="Make my portrait" icon="person" tone="dark" large onClick={() => go({ name: 'portrait' })} />
									<PillButton label="Later" large onClick={next} />
								</>,
							)
						: null}
					{current === 'paper'
						? page(
								'Choose your paper',
								`${who ? `${who}, pick` : 'Pick'} the paper your diary is written on. Lamplight is the same paper at night.`,
								<>
									<div style={{ background: colors.panel, borderRadius: 6, padding: 16, boxShadow: theme.shadow(1) }}>
										<LookPicker look={look} onLook={setLook} />
									</div>
									<PillButton label="Go on" icon="arrow" tone="dark" large onClick={next} />
								</>,
							)
						: null}
					{current === 'reminder'
						? page(
								'Letters from the past',
								'On days when a page from an earlier year comes back, the diary sends you a quiet letter. When should it arrive?',
								<>
									<div style={{ display: 'grid', justifyItems: 'center' }}>
										<label className="lb-time lb-pill" style={{ background: colors.panel, padding: '0 20px', ...type.small, fontWeight: 700, color: colors.ink }}>
											{time}
											<input
												type="time"
												value={`${String(reminder.hour).padStart(2, '0')}:${String(reminder.minute).padStart(2, '0')}`}
												onChange={(e) => {
													const [h, m] = e.target.value.split(':').map(Number);
													if (!Number.isNaN(h)) setReminder({ ...reminder, hour: h, minute: m });
												}}
												aria-label="Change the time"
											/>
										</label>
										<span style={{ ...type.small, color: colors.onDeskMuted, marginTop: 8 }}>tap to change the time</span>
									</div>
									<PillButton
										label="Yes, send me letters"
										icon="mail"
										tone="dark"
										large
										onClick={() => {
											setReminder({ ...reminder, enabled: true });
											next();
										}}
									/>
									<PillButton label="Not now" large onClick={next} />
								</>,
							)
						: null}
					{current === 'backup'
						? page(
								'Keep a copy?',
								'Your diary lives on this phone. Connect Google to keep a private copy in your own Drive (a "LookBack" folder only you can see) and to let people you trust give you pages.',
								<>
									<PillButton label="Connect Google" icon="google" tone="dark" large onClick={() => app.toast('On the phone this signs in to your own Google Drive')} />
									<PillButton label="Maybe later" large onClick={next} />
								</>,
							)
						: null}
					{current === 'done'
						? page(who ? `Ready, ${who}` : 'Ready', "Your diary is ready. What's weighing on you today?", (
								<>
									<PillButton label="Write today's page" icon="edit" tone="dark" large onClick={() => finishWelcome(true)} />
									<PillButton label="Look around first" icon="home" large onClick={() => finishWelcome(false)} />
								</>
							))
						: null}
				</div>
			</div>
		</div>
	);
}

/* ---------- The book flight (BookFlight.tsx, simplified): a volume leaves the shelf and opens to its year ---------- */

export function BookFlight({ year, from, onOpen, onDone }) {
	const theme = useTheme();
	const palette = theme.year(year);
	const leather = mixHex(palette.primary, '#000000', 0.62);
	const [stage, setStage] = useState(0);
	const calls = useRef({ onOpen, onDone });
	useEffect(() => {
		const timers = [
			setTimeout(() => setStage(1), 30),
			setTimeout(() => setStage(2), 760),
			setTimeout(() => setStage(3), 1500),
			setTimeout(() => calls.current.onOpen(), 1560),
			setTimeout(() => calls.current.onDone(), 2100),
		];
		return () => timers.forEach(clearTimeout);
	}, []);
	const start = from ? { left: from.x, top: from.y, width: from.w, height: from.h } : { left: SCREEN_W / 2 - 28, top: 400, width: 56, height: 180 };
	return (
		<div className={`lb-flight is-${stage}`} aria-hidden="true">
			<div
				className="lb-flight-book"
				style={{
					'--x0': `${start.left}px`,
					'--y0': `${start.top}px`,
					'--w0': `${start.width}px`,
					'--h0': `${start.height}px`,
					background: leather,
				}}
			>
				<Texture kind="leather" opacity={0.5} radius={6} />
				<span className="lb-flight-cover">
					<span style={{ ...type.albumYear, color: '#D4B26A', textShadow: '0 1px 0 rgba(0,0,0,0.6)' }}>{year}</span>
					<span style={{ ...type.stamp, color: '#D4B26A', marginTop: 6 }}>LOOKBACK</span>
				</span>
				<span className="lb-flight-pages" style={{ background: theme.colors.paper }}>
					<span style={{ ...type.hand, color: theme.colors.inkBlue }}>hello again, {year}</span>
				</span>
			</div>
		</div>
	);
}

export { addDays };
