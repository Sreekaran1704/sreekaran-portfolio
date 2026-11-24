// The diary's page chrome, ported from src/components (Screen.tsx, PaperTabs.tsx, CardParts.tsx, ConfirmSheet.tsx,
// Buttons.tsx, PaperBackground.tsx, Texture.tsx): the gilt title, tooled rules, paper cards with a red margin, the
// stitched key bar at the foot of every page, and questions asked on paper.

import { Fragment } from 'react';
import {
	IoAdd,
	IoAlbumsOutline,
	IoArrowDown,
	IoArrowForward,
	IoCameraOutline,
	IoCheckmark,
	IoChevronBack,
	IoChevronForward,
	IoClose,
	IoCloseCircleOutline,
	IoCloudUploadOutline,
	IoColorPaletteOutline,
	IoCreateOutline,
	IoGiftOutline,
	IoHeartOutline,
	IoHome,
	IoHomeOutline,
	IoImageOutline,
	IoImagesOutline,
	IoInformationCircleOutline,
	IoLibraryOutline,
	IoLogoGoogle,
	IoMailOutline,
	IoMic,
	IoMicOutline,
	IoMoonOutline,
	IoNotificationsOutline,
	IoPause,
	IoPeopleOutline,
	IoPencil,
	IoPersonCircleOutline,
	IoPlay,
	IoPlayBack,
	IoQrCodeOutline,
	IoRadioOutline,
	IoRefresh,
	IoScanOutline,
	IoSettingsOutline,
	IoShuffle,
	IoSquareOutline,
	IoSunnyOutline,
	IoSyncOutline,
	IoTrashOutline,
} from 'react-icons/io5';
import { control, type, useTheme, withAlpha } from './theme';
import { Cassette } from './pieces';

export const IMG = '/images/lookback';

const ICONS = {
	add: IoAdd,
	albums: IoAlbumsOutline,
	arrow: IoArrowForward,
	down: IoArrowDown,
	back: IoChevronBack,
	camera: IoCameraOutline,
	check: IoCheckmark,
	close: IoClose,
	closeCircle: IoCloseCircleOutline,
	cloud: IoCloudUploadOutline,
	color: IoColorPaletteOutline,
	edit: IoCreateOutline,
	forward: IoChevronForward,
	gift: IoGiftOutline,
	google: IoLogoGoogle,
	heart: IoHeartOutline,
	home: IoHomeOutline,
	homeFilled: IoHome,
	image: IoImageOutline,
	images: IoImagesOutline,
	info: IoInformationCircleOutline,
	library: IoLibraryOutline,
	mail: IoMailOutline,
	mic: IoMicOutline,
	micOn: IoMic,
	moon: IoMoonOutline,
	bell: IoNotificationsOutline,
	pause: IoPause,
	people: IoPeopleOutline,
	pencil: IoPencil,
	person: IoPersonCircleOutline,
	play: IoPlay,
	rewind: IoPlayBack,
	qr: IoQrCodeOutline,
	radio: IoRadioOutline,
	refresh: IoRefresh,
	scan: IoScanOutline,
	settings: IoSettingsOutline,
	shuffle: IoShuffle,
	stop: IoSquareOutline,
	sun: IoSunnyOutline,
	sync: IoSyncOutline,
	trash: IoTrashOutline,
};
export function Icon({ name, size = 22, color, style }) {
	const C = ICONS[name] || IoAdd;
	return <C size={size} color={color} style={{ display: 'block', flexShrink: 0, ...style }} aria-hidden="true" />;
}

/** A material laid over a surface (Texture.tsx): the app's own paper, leather and walnut textures. */
export function Texture({ kind = 'paper', opacity = 1, radius }) {
	return (
		<span
			className="lb-texture"
			aria-hidden="true"
			style={{
				opacity,
				borderRadius: radius,
				backgroundImage: `url(${IMG}/${kind}.png)`,
				backgroundSize: kind === 'wood' ? 'cover' : '256px 256px',
				backgroundRepeat: kind === 'wood' ? 'no-repeat' : 'repeat',
			}}
		/>
	);
}

/**
 * The page behind everything (PaperBackground desk): the chosen paper, light from the top left, a soft vignette, a
 * shade where it curves into the binding on the left, its fibres; inside a year's diary, tinted with the year's color.
 */
export function Desk({ wash }) {
	const theme = useTheme();
	const { colors } = theme;
	const base = wash ? mixWash(colors.desk, wash) : colors.desk;
	return (
		<div
			className="lb-desk"
			aria-hidden="true"
			style={{
				backgroundColor: base,
				backgroundImage: [
					'radial-gradient(circle at 12% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)',
					'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.16) 100%)',
					'linear-gradient(90deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0) 26px)',
				].join(','),
			}}
		>
			<Texture kind="paper" opacity={theme.dark ? 0.18 : 0.28} />
		</div>
	);
}
function mixWash(desk, wash) {
	const ch = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
	return `#${[0, 1, 2].map((i) => Math.round(ch(desk, i) + (ch(wash, i) - ch(desk, i)) * 0.22).toString(16).padStart(2, '0')).join('')}`;
}

/** The diary's emblem beside a page's title: a little mixtape cassette (Buddy.tsx, which is no longer a bunny). */
export function Emblem({ size = 64, onClick }) {
	return (
		<button type="button" className="lb-emblem" onClick={onClick} aria-label="The LookBack cassette" style={{ width: size * 1.1 }}>
			<Cassette width={size * 1.1} title="LookBack" detail="C·60" />
		</button>
	);
}

/** The gilt title with its optional count in a tooled box (ScreenTitle). */
export function ScreenTitle({ title, count }) {
	const { colors } = useTheme();
	return (
		<div className="lb-row" style={{ gap: 12 }}>
			<h2 className="lb-title lb-emboss" style={{ ...type.titleNarrow, color: colors.giltBright }}>
				{title}
			</h2>
			{count !== undefined ? (
				<span style={{ border: `1px solid ${colors.gilt}`, borderRadius: 3, padding: '2px 8px', ...type.stamp, color: colors.giltBright }}>{count}</span>
			) : null}
		</div>
	);
}

/** The top of every page: buttons row, the gilt title, one printed line, and the emblem on the right (PageHeader). */
export function PageHeader({ title, count, subtitle, emblem = true, left, right, onEmblem }) {
	const { colors } = useTheme();
	return (
		<div>
			{left || right ? (
				<div className="lb-row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
					<div className="lb-row" style={{ gap: 12 }}>{left}</div>
					<div className="lb-row" style={{ gap: 12 }}>{right}</div>
				</div>
			) : null}
			<div className="lb-row" style={{ gap: 12 }}>
				<div style={{ flex: 1, minWidth: 0 }}>
					<ScreenTitle title={title} count={count} />
					{subtitle ? <p style={{ ...type.caption, fontSize: 18, color: colors.onDeskMuted, marginTop: 4 }}>{subtitle}</p> : null}
				</div>
				{emblem ? <Emblem size={56} onClick={onEmblem} /> : null}
			</div>
		</div>
	);
}

export function GiltRule() {
	const { colors } = useTheme();
	return (
		<div className="lb-row" aria-hidden="true">
			<span style={{ width: 6, height: 6, background: colors.gilt, transform: 'rotate(45deg)', flexShrink: 0 }} />
			<span style={{ flex: 1, height: 1.4, background: colors.gilt, opacity: 0.7 }} />
		</div>
	);
}

export function SectionHeader({ title, detail }) {
	const { colors } = useTheme();
	return (
		<div style={{ marginBottom: 16, display: 'grid', gap: 4 }}>
			<div className="lb-row" style={{ alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
				<h3 className="lb-emboss" style={{ ...type.heading, color: colors.onDesk, whiteSpace: 'nowrap' }}>
					{title}
				</h3>
				{detail ? <span style={{ ...type.caption, color: colors.onDeskMuted, flex: 1, textAlign: 'right', whiteSpace: 'nowrap' }}>{detail}</span> : null}
			</div>
			<GiltRule />
		</div>
	);
}

/** A printed page number between two short gilt rules (PageFooter). */
export function PageFooter({ label }) {
	const { colors } = useTheme();
	return (
		<div className="lb-row" style={{ justifyContent: 'center', gap: 12, marginTop: 24 }}>
			<span style={{ width: 24, height: 1.4, background: colors.gilt, opacity: 0.6 }} />
			<span style={{ ...type.handSmall, color: colors.onDeskFaint, flex: 1, textAlign: 'center' }}>{label}</span>
			<span style={{ width: 24, height: 1.4, background: colors.gilt, opacity: 0.6 }} />
		</div>
	);
}

/** A stack of diary pages with a red margin, fibres and a soft paper edge (Panel). */
export function Panel({ children, style, paper }) {
	const theme = useTheme();
	const { colors } = theme;
	return (
		<div className="lb-panel-wrap">
			<span className="lb-panel-under" style={{ background: colors.paper }} aria-hidden="true" />
			<div className="lb-panel" style={{ background: paper ?? colors.panel, boxShadow: theme.shadow(1), ...style }}>
				<Texture kind="paper" radius={7} opacity={0.35} />
				<span className="lb-margin" style={{ background: colors.marginLine }} aria-hidden="true" />
				<div style={{ position: 'relative' }}>{children}</div>
			</div>
		</div>
	);
}

/** A card's heading: its icon on a small ink disc, the title in ink (CardTitle). */
export function CardTitle({ icon, title }) {
	const { colors } = useTheme();
	return (
		<div className="lb-row" style={{ gap: 12, marginBottom: 8 }}>
			<span className="lb-badge" style={{ background: colors.ink }}>
				<Icon name={icon} size={17} color={colors.panel} />
			</span>
			<h4 style={{ ...type.heading, color: colors.ink, flex: 1 }}>{title}</h4>
		</div>
	);
}
export function Help({ children }) {
	const { colors } = useTheme();
	return <p style={{ ...type.caption, color: colors.inkMuted, padding: '8px 0' }}>{children}</p>;
}
export function Row({ label, divider, children, onClick }) {
	const { colors } = useTheme();
	const Tag = onClick ? 'button' : 'div';
	return (
		<Tag type={onClick ? 'button' : undefined} onClick={onClick} className={`lb-row lb-setrow${onClick ? ' lb-press' : ''}`} style={{ borderTop: divider ? `1px solid ${colors.ruleLine}` : 'none' }}>
			<span style={{ ...type.print, color: colors.ink, flex: 1, textAlign: 'left' }}>{label}</span>
			{children}
		</Tag>
	);
}
export function CheckRow({ label, checked, onClick }) {
	const { colors } = useTheme();
	const s = 26;
	return (
		<button type="button" className="lb-row lb-setrow lb-press" onClick={onClick} role="checkbox" aria-checked={checked} style={{ gap: 12 }}>
			<svg width={s + 6} height={s + 6} aria-hidden="true">
				<path d={`M 3 4 L ${s} 3 L ${s + 1} ${s} L 4 ${s + 1} Z`} stroke={colors.ink} strokeWidth="2" fill="none" strokeLinejoin="round" />
				{checked ? <path d={`M 6 ${s / 2 + 1} L ${s / 2 - 1} ${s - 3} L ${s + 4} 0`} stroke={colors.sepia} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
			</svg>
			<span style={{ ...type.print, color: colors.ink, flex: 1, textAlign: 'left' }}>{label}</span>
		</button>
	);
}

/** A fine tooled rule just inside a control's edge (Stitches). */
export function Stitches({ radius = control.radius, inset = control.stitchInset, color }) {
	const { colors } = useTheme();
	return (
		<span
			className="lb-stitches"
			aria-hidden="true"
			style={{ inset, borderRadius: Math.max(0, radius - inset), borderColor: withAlpha(color ?? colors.gilt, 0.45) }}
		/>
	);
}

/** What's chosen: a flat quiet tint, outlined on the bar's page you're on (Wash / WashIn). */
export function WashIn({ color, edge = false, insetY = control.washInset }) {
	return (
		<span
			className="lb-wash"
			aria-hidden="true"
			style={{
				left: control.washInset,
				right: control.washInset,
				top: insetY,
				bottom: insetY,
				borderRadius: control.radius - control.washInset + 2,
				background: withAlpha(color, edge ? 0.12 : 0.2),
				border: edge ? `1.4px solid ${withAlpha(color, 0.6)}` : 'none',
			}}
		/>
	);
}

/** The stitched paper pill (PillButton): paper, its grain, the rule inside its edge; the main one washed in gilt. */
export function PillButton({ label, icon, tone = 'paper', onClick, grow = false, large = false, disabled, ariaLabel }) {
	const theme = useTheme();
	const { colors } = theme;
	const wash = { paper: null, dark: colors.gilt, green: colors.green }[tone];
	return (
		<button
			type="button"
			className="lb-pill lb-press"
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel ?? label}
			style={{ background: colors.panel, boxShadow: theme.shadow(0.8), flex: grow ? 1 : undefined, alignSelf: large ? 'stretch' : undefined, padding: grow ? '0 12px' : '0 20px' }}
		>
			<Texture kind="paper" opacity={0.5} radius={control.radius} />
			<Stitches />
			{wash ? <WashIn color={wash} /> : null}
			{icon ? <Icon name={icon} size={large ? 20 : 17} color={colors.ink} /> : null}
			<span style={{ ...type.small, color: colors.ink, fontSize: large ? 16 : 15, fontWeight: 700, position: 'relative', whiteSpace: 'nowrap' }}>{label}</span>
		</button>
	);
}

/**
 * The key bar (PaperTabs): stitched paper of equal places, each a small ink drawing over a printed label; the page
 * you're on (or a switched-on action) on an outlined wash, a page's main action washed in its color. `center` is a
 * round button standing up out of the middle (the bar's Write). `slide` is the pager position (the wash glides).
 */
export function PaperTabs({ items, center, centerAt = 2, slide, compact = true }) {
	const theme = useTheme();
	const { colors } = theme;
	const bar = theme.bar;
	const barH = compact ? control.height : 60;
	const places = items.length + (center ? 1 : 0);
	const washX = slide === undefined ? null : center ? slide + Math.min(1, Math.max(0, slide - (centerAt - 1))) : slide;
	return (
		<div className="lb-tabs" style={{ padding: '4px 20px 12px' }}>
			<div className="lb-tabs-bar" style={{ height: barH, background: bar.bg, boxShadow: theme.shadow(1.2) }}>
				<Texture kind="paper" opacity={bar.texture} radius={control.radius} />
				<Stitches />
				<div className="lb-tabs-row" style={{ padding: `0 ${control.stitchInset}px` }}>
					{washX !== null ? (
						<span
							className="lb-tabs-wash"
							aria-hidden="true"
							style={{
								width: `calc(${100 / places}% - ${(control.washInset * 2 * (places - 1)) / places}px)`,
								transform: `translateX(calc(${washX * 100}% + ${washX * control.washInset * 2}px))`,
								left: control.stitchInset + control.washInset,
								top: control.washInset + 2,
								bottom: control.washInset + 2,
								borderRadius: control.radius - control.washInset + 2,
								background: withAlpha(colors.gilt, 0.12),
								border: `1.4px solid ${withAlpha(colors.gilt, 0.6)}`,
							}}
						/>
					) : null}
					{items.map((t, i) => (
						<Fragment key={t.key}>
							{center && i === centerAt ? <div className="lb-tab lb-tab-center">{center}</div> : null}
							<BarItem tab={t} barH={barH} slide={washX !== null} bar={bar} />
						</Fragment>
					))}
				</div>
			</div>
		</div>
	);
}

function BarItem({ tab, barH, slide, bar }) {
	const { colors } = useTheme();
	const on = tab.active || !!tab.primary;
	const color = on ? bar.ink : bar.muted;
	return (
		<button
			type="button"
			className="lb-tab lb-tabpress"
			onClick={tab.onPress}
			disabled={tab.disabled}
			aria-label={tab.ariaLabel ?? tab.label}
			aria-current={tab.active ? 'page' : undefined}
			style={{ height: barH, opacity: tab.disabled ? 0.4 : 1 }}
		>
			{!slide && on ? <WashIn color={tab.primary ?? colors.gilt} insetY={control.washInset + 2} edge={!tab.primary} /> : null}
			<span className="lb-tab-icon">
				{tab.picture ?? <Icon name={tab.icon} size={19} color={tab.tint && !on ? tab.tint : color} />}
				{tab.badge ? <span className="lb-tab-badge" style={{ background: colors.sepia, color: colors.paperWhite, borderColor: bar.bg }}>{tab.badge > 9 ? '9+' : tab.badge}</span> : null}
			</span>
			<span style={{ ...type.small, color, fontSize: 11, lineHeight: '14px', marginTop: 3, fontWeight: on ? 700 : 600, letterSpacing: 0.3 }}>{tab.label}</span>
		</button>
	);
}

/** A row of buttons on a stitched slip (ActionRow in Screen.tsx), with anything in `lead` before them. */
export function ActionRow({ actions, lead }) {
	const theme = useTheme();
	const { colors } = theme;
	const muted = withAlpha(colors.ink, 0.74);
	return (
		<div className="lb-actionrow" style={{ background: colors.panel, boxShadow: theme.shadow(1) }}>
			<Texture kind="paper" opacity={0.5} radius={control.radius} />
			<Stitches />
			{lead}
			{actions.map((a) => {
				const on = a.active || !!a.primary;
				return (
					<button key={a.key} type="button" className="lb-tab lb-tabpress" onClick={a.onPress} disabled={a.disabled} aria-label={a.ariaLabel ?? a.label} style={{ height: control.height }}>
						{on ? <WashIn color={a.primary ?? colors.gilt} /> : null}
						<Icon name={a.icon} size={20} color={a.tint && !on ? a.tint : on ? colors.ink : muted} />
						<span style={{ ...type.small, fontSize: 13, lineHeight: '16px', marginTop: 3, color: on ? colors.ink : muted, fontWeight: on ? 700 : 600, position: 'relative' }}>{a.label}</span>
					</button>
				);
			})}
		</div>
	);
}

/** A question asked on paper: a diary page on the dimmed leather, the cassette resting on its edge (ConfirmSheet). */
export function ConfirmSheet({ title, message, confirmLabel, confirmIcon = 'check', cancelLabel = 'Keep it', single = false, onConfirm, onCancel }) {
	const theme = useTheme();
	const { colors } = theme;
	return (
		<div className="lb-sheet" role="dialog" aria-modal="true" aria-label={title} style={{ background: withAlpha(theme.paper.darkDeep, 0.55) }}>
			<button type="button" className="lb-sheet-scrim" aria-label={cancelLabel} onClick={onCancel} />
			<div className="lb-sheet-card">
				<div style={{ display: 'flex', justifyContent: 'center', marginBottom: -26, position: 'relative', zIndex: 2 }}>
					<Cassette width={96} title="LookBack" />
				</div>
				<Panel style={{ paddingTop: 38 }}>
					<h4 style={{ ...type.heading, color: colors.ink, textAlign: 'center' }}>{title}</h4>
					<p style={{ ...type.caption, color: colors.inkMuted, marginTop: 8, textAlign: 'center' }}>{message}</p>
					<div className="lb-row" style={{ gap: 12, marginTop: 16, marginBottom: 8 }}>
						<PillButton label={cancelLabel} icon="heart" grow onClick={onCancel} />
						{single ? null : <PillButton label={confirmLabel} icon={confirmIcon} tone="dark" grow onClick={onConfirm} />}
					</div>
				</Panel>
			</div>
		</div>
	);
}

/** The diary's cassette beside a slip of paper with a printed note (BuddySays): empty states and nudges. */
export function BuddySays({ text }) {
	const theme = useTheme();
	const { colors } = theme;
	return (
		<div className="lb-row" style={{ gap: 12 }}>
			<Emblem size={56} />
			<div style={{ position: 'relative', flex: 1, background: colors.paper, borderRadius: '2px 6px 6px 2px', padding: '12px 16px 12px 24px', boxShadow: theme.shadow(0.8) }}>
				<Texture kind="paper" opacity={0.4} radius={6} />
				<span className="lb-margin" style={{ left: 12, background: colors.marginLine }} />
				<p style={{ ...type.caption, color: colors.ink, position: 'relative' }}>{text}</p>
			</div>
		</div>
	);
}

/** A short note that eases up from the foot and goes (StatusPill). */
export function Toast({ text }) {
	const theme = useTheme();
	if (!text) return null;
	return (
		<div className="lb-toast" role="status" style={{ background: theme.colors.panel, color: theme.colors.ink, boxShadow: theme.shadow(1.2) }}>
			<Texture kind="paper" opacity={0.5} radius={control.radius} />
			<span style={{ ...type.small, fontWeight: 700, position: 'relative' }}>{text}</span>
		</div>
	);
}

/** A scrolling page: the desk behind, the usual padding, room at the foot for the bar. */
export function Page({ children, wash, bar = 'nav', scrollRef, onScroll, gap = 32 }) {
	return (
		<div className="lb-page">
			<Desk wash={wash} />
			<div className={`lb-scroll lb-scroll-${bar}`} ref={scrollRef} onScroll={onScroll}>
				<div className="lb-content" style={{ gap }}>
					{children}
				</div>
			</div>
		</div>
	);
}
