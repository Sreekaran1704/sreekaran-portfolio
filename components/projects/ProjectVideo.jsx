import { useCallback, useEffect, useRef, useState } from 'react';
import {
	FiArrowUpRight,
	FiChevronDown,
	FiChevronUp,
	FiMaximize,
	FiMaximize2,
	FiMinimize2,
	FiMove,
	FiPause,
	FiPlay,
	FiVolume2,
	FiVolumeX,
	FiX,
} from 'react-icons/fi';

// "youtube.com/shorts/<id>", "youtu.be/<id>" or "watch?v=<id>".
const youtubeId = (url = '') =>
	url.match(/(?:shorts\/|youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/)?.[1];

// The floating window follows PhotoCull's demo (PhotoCullDemo.jsx): same
// title strip, drag, minimize and back-to-page controls, and the same rule
// that floating is a CSS state on one element, never a DOM move, because
// moving the YouTube iframe would reload it and stop the video.
const WIDE = '(min-width: 768px)';
const POSITION_KEY = 'pj-video-pip-position';
const EDGE = 8;
const KEY_STEP = 24;

const clock = (seconds) => {
	if (!Number.isFinite(seconds)) return '0:00';
	const s = Math.max(0, Math.floor(seconds));
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// The YouTube IFrame API is loaded once, on the first play.
let youtubeApi;
const loadYouTube = () => {
	if (youtubeApi) return youtubeApi;
	youtubeApi = new Promise((resolve) => {
		if (window.YT?.Player) {
			resolve(window.YT);
			return;
		}
		const previous = window.onYouTubeIframeAPIReady;
		window.onYouTubeIframeAPIReady = () => {
			previous?.();
			resolve(window.YT);
		};
		const script = document.createElement('script');
		script.src = 'https://www.youtube.com/iframe_api';
		document.head.appendChild(script);
	});
	return youtubeApi;
};

// A video player in the paper's own style. A YouTube video plays through the
// IFrame API with YouTube's controls hidden; a file the site serves itself
// plays in a plain <video>. Either way the poster, stamp and control strip
// below are ours.
function ProjectVideo({ video }) {
	const ytId = youtubeId(video.youtubeUrl);

	const videoRef = useRef(null);
	const ytMount = useRef(null);
	const ytPlayer = useRef(null);
	const frameRef = useRef(null);

	const [started, setStarted] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [ended, setEnded] = useState(false);
	const [muted, setMuted] = useState(false);
	const [time, setTime] = useState(0);
	const [duration, setDuration] = useState(video.duration || 0);

	// Window state, as in PhotoCull: `pip` is what's on screen; `pinned` means
	// the visitor popped it out by hand; `dismissed` means they closed it.
	const [wide, setWide] = useState(false);
	const [pip, setPip] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [dismissed, setDismissed] = useState(false);
	const [slotHeight, setSlotHeight] = useState(null);
	const [position, setPosition] = useState(null);
	const [minimized, setMinimized] = useState(false);
	const [dragging, setDragging] = useState(false);
	const dragRef = useRef(null);
	const slotRef = useRef(null);
	const stageRef = useRef(null);
	const returningRef = useRef(false);

	// Native <video>: mirror its state.
	useEffect(() => {
		const el = videoRef.current;
		if (!el) return undefined;
		const sync = () => {
			setPlaying(!el.paused);
			setEnded(el.ended);
			setTime(el.currentTime);
			if (Number.isFinite(el.duration)) setDuration(el.duration);
			setMuted(el.muted);
		};
		const events = ['play', 'pause', 'timeupdate', 'loadedmetadata', 'volumechange', 'ended'];
		events.forEach((e) => el.addEventListener(e, sync));
		return () => events.forEach((e) => el.removeEventListener(e, sync));
	}, []);

	// YouTube reports no time events, so poll while it plays.
	useEffect(() => {
		if (!ytId || !playing) return undefined;
		const timer = setInterval(() => {
			const p = ytPlayer.current;
			if (p?.getCurrentTime) setTime(p.getCurrentTime());
		}, 250);
		return () => clearInterval(timer);
	}, [ytId, playing]);

	useEffect(() => () => ytPlayer.current?.destroy?.(), []);

	// Keep the window fully on screen, below the sticky masthead.
	const clamp = useCallback((point) => {
		const stage = stageRef.current;
		if (!point || !stage) return point;
		const top = (parseFloat(getComputedStyle(stage).getPropertyValue('--np-sticky-h')) || 46) + EDGE;
		const maxX = Math.max(EDGE, window.innerWidth - stage.offsetWidth - EDGE);
		const maxY = Math.max(top, window.innerHeight - stage.offsetHeight - EDGE);
		return {
			x: Math.round(Math.min(Math.max(EDGE, point.x), maxX)),
			y: Math.round(Math.min(Math.max(top, point.y), maxY)),
		};
	}, []);

	const enterPip = useCallback(() => {
		setSlotHeight(stageRef.current?.offsetHeight || null);
		setPip(true);
	}, []);

	useEffect(() => {
		const query = window.matchMedia(WIDE);
		const apply = () => {
			setWide(query.matches);
			if (!query.matches) setPip(false);
		};
		apply();
		query.addEventListener('change', apply);
		return () => query.removeEventListener('change', apply);
	}, []);

	// Float once the video is playing and has scrolled off the top; dock again
	// when its place on the page is back in view.
	useEffect(() => {
		const slot = slotRef.current;
		if (!slot || !wide || typeof IntersectionObserver === 'undefined') return undefined;
		const observer = new IntersectionObserver(
			([entry]) => {
				const inView = entry.intersectionRatio > 0.2;
				if (inView) returningRef.current = false;
				if (inView && !pinned) setPip(false);
				else if (!inView && entry.boundingClientRect.top < 0 && playing && !dismissed && !returningRef.current) {
					enterPip();
				}
			},
			{ threshold: [0, 0.2, 0.5] }
		);
		observer.observe(slot);
		return () => observer.disconnect();
	}, [wide, playing, dismissed, pinned, enterPip]);

	const pause = () => {
		if (ytId) ytPlayer.current?.pauseVideo?.();
		else videoRef.current?.pause();
	};

	const close = () => {
		pause();
		setMinimized(false);
		setPip(false);
		setPinned(false);
		setDismissed(true);
	};

	// Escape closes the window; the back-to-top button steps aside for it.
	useEffect(() => {
		document.documentElement.classList.toggle('pc-pip-open', pip);
		if (!pip) return undefined;
		const onKey = (event) => {
			if (event.key === 'Escape' && !dragRef.current) close();
		};
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('keydown', onKey);
			document.documentElement.classList.remove('pc-pip-open');
		};
	});

	useEffect(() => {
		try {
			const saved = JSON.parse(window.localStorage.getItem(POSITION_KEY));
			if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) setPosition(saved);
		} catch {
			// No storage: start in the default corner.
		}
	}, []);

	useEffect(() => {
		if (dragging) return;
		try {
			if (position) window.localStorage.setItem(POSITION_KEY, JSON.stringify(position));
			else window.localStorage.removeItem(POSITION_KEY);
		} catch {
			// Position just won't be remembered.
		}
	}, [position, dragging]);

	useEffect(() => {
		if (!pip) return undefined;
		const refit = () => setPosition((point) => clamp(point));
		const frame = requestAnimationFrame(refit);
		window.addEventListener('resize', refit);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', refit);
		};
	}, [pip, minimized, clamp]);

	useEffect(() => {
		const stage = stageRef.current;
		const onLeft = Boolean(pip && position && stage && position.x + stage.offsetWidth / 2 < window.innerWidth / 2);
		document.documentElement.classList.toggle('pc-pip-left', onLeft);
		return () => document.documentElement.classList.remove('pc-pip-left');
	}, [pip, position]);

	useEffect(() => {
		document.documentElement.classList.toggle('pc-pip-dragging', dragging);
		return () => document.documentElement.classList.remove('pc-pip-dragging');
	}, [dragging]);

	const startDrag = (event) => {
		if (event.button !== 0 || event.target.closest('button:not(.pc-pip-grip)')) return;
		const rect = stageRef.current.getBoundingClientRect();
		dragRef.current = { dx: event.clientX - rect.left, dy: event.clientY - rect.top };
		try {
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {
			// Without capture the drag still works while the pointer stays on the strip.
		}
		setDragging(true);
		event.preventDefault();
	};

	const moveDrag = (event) => {
		if (!dragRef.current) return;
		setPosition(clamp({ x: event.clientX - dragRef.current.dx, y: event.clientY - dragRef.current.dy }));
	};

	const endDrag = () => {
		dragRef.current = null;
		setDragging(false);
	};

	const nudge = (event) => {
		const step = event.shiftKey ? KEY_STEP * 4 : KEY_STEP;
		const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
		if (event.key === 'Home') {
			event.preventDefault();
			setPosition(null);
			return;
		}
		if (!delta) return;
		event.preventDefault();
		const rect = stageRef.current.getBoundingClientRect();
		setPosition(clamp({ x: rect.left + delta[0], y: rect.top + delta[1] }));
	};

	const popOut = () => {
		setPinned(true);
		setDismissed(false);
		enterPip();
	};

	const backToPage = () => {
		returningRef.current = true;
		setMinimized(false);
		setPip(false);
		setPinned(false);
		requestAnimationFrame(() => {
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			slotRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
		});
	};

	const startYouTube = async () => {
		const YT = await loadYouTube();
		ytPlayer.current = new YT.Player(ytMount.current, {
			videoId: ytId,
			playerVars: {
				autoplay: 1,
				controls: 0,
				disablekb: 1,
				fs: 0,
				iv_load_policy: 3,
				modestbranding: 1,
				playsinline: 1,
				rel: 0,
			},
			events: {
				onReady: (e) => {
					setDuration(e.target.getDuration() || duration);
					e.target.playVideo();
				},
				onStateChange: (e) => {
					const { PLAYING, ENDED } = window.YT.PlayerState;
					setPlaying(e.data === PLAYING);
					setEnded(e.data === ENDED);
					if (e.data === ENDED) setTime(e.target.getDuration());
				},
			},
		});
	};

	const toggle = () => {
		if (ytId) {
			const p = ytPlayer.current;
			if (!p) {
				setStarted(true);
				startYouTube();
			} else if (playing) p.pauseVideo();
			else {
				if (ended) p.seekTo(0, true);
				p.playVideo();
			}
			return;
		}
		const el = videoRef.current;
		setStarted(true);
		if (el.paused) el.play().catch(() => {});
		else el.pause();
	};

	const seek = (event) => {
		const to = Number(event.target.value);
		if (ytId) ytPlayer.current?.seekTo(to, true);
		else videoRef.current.currentTime = to;
		setTime(to);
		setEnded(false);
	};

	const toggleMute = () => {
		if (ytId) {
			const p = ytPlayer.current;
			if (!p) return;
			if (p.isMuted()) p.unMute();
			else p.mute();
			setMuted(!muted);
			return;
		}
		videoRef.current.muted = !videoRef.current.muted;
	};

	const fullscreen = () => {
		const el = videoRef.current;
		if (el?.webkitEnterFullscreen && !document.fullscreenEnabled) el.webkitEnterFullscreen();
		else frameRef.current.requestFullscreen?.();
	};

	const onKey = (event) => {
		if (event.target.closest('button, input')) return;
		if (event.key === ' ' || event.key === 'k') {
			event.preventDefault();
			toggle();
		}
	};

	const progress = duration ? (Math.min(time, duration) / duration) * 100 : 0;
	// The poster covers YouTube before the first play and after the end, so
	// its title bar and end-screen suggestions never show.
	const showPoster = ytId && (!started || ended);

	return (
		<figure className="pj-video">
			<div
				ref={slotRef}
				className={`pj-video-slot${pip ? ' is-holding' : ''}`}
				style={pip && slotHeight ? { minHeight: slotHeight } : undefined}
			>
				{pip && (
					<div className="pj-video-placeholder">
						<p>The video is in a floating window. Drag its title strip to move it.</p>
						<button type="button" className="notice-link-btn notice-link-outline" onClick={backToPage}>
							Bring it back here
						</button>
					</div>
				)}

				<div
					ref={stageRef}
					className={['pj-window', pip && 'is-pip', pip && minimized && 'is-minimized', dragging && 'is-dragging']
						.filter(Boolean)
						.join(' ')}
					style={pip && position ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' } : undefined}
					role={pip ? 'region' : undefined}
					aria-label={pip ? `${video.title}, picture-in-picture` : undefined}
				>
					{pip ? (
						<div
							className="pc-pip-handle"
							onPointerDown={startDrag}
							onPointerMove={moveDrag}
							onPointerUp={endDrag}
							onPointerCancel={endDrag}
							onDoubleClick={(event) => !event.target.closest('button:not(.pc-pip-grip)') && setPosition(null)}
						>
							<button
								type="button"
								className="pc-pip-grip"
								onKeyDown={nudge}
								aria-label="Move video window"
								aria-describedby="pj-pip-move-hint"
								title="Drag to move · arrow keys move · Home or double-click resets"
							>
								<FiMove aria-hidden="true" />
							</button>
							<span id="pj-pip-move-hint" className="sr-only">
								Use the arrow keys to move the window, Shift for larger steps, and Home to return it to the
								corner.
							</span>
							<span className="pc-pip-title">{video.title}</span>
							<span className="pc-pip-actions">
								<button
									type="button"
									onClick={() => setMinimized((value) => !value)}
									aria-expanded={!minimized}
									aria-label={minimized ? 'Expand video window' : 'Minimize video window'}
									title={minimized ? 'Expand' : 'Minimize'}
								>
									{minimized ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
								</button>
								<button type="button" onClick={backToPage} aria-label="Put the video back on the page" title="Back to page">
									<FiMaximize2 aria-hidden="true" />
								</button>
								<button type="button" onClick={close} aria-label="Close the video window" title="Close">
									<FiX aria-hidden="true" />
								</button>
							</span>
						</div>
					) : (
						<div className="pc-demo-bar">
							<span className="pc-demo-bar-label">
								<i aria-hidden="true" /> {video.label || 'Video'}
							</span>
							<span className="pc-demo-bar-actions">
								{wide && (
									<button type="button" onClick={popOut} title="Keep the video in the corner while you scroll">
										<FiMinimize2 aria-hidden="true" /> Pop out
									</button>
								)}
								{video.youtubeUrl && (
									<a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
										YouTube <FiArrowUpRight aria-hidden="true" />
									</a>
								)}
							</span>
						</div>
					)}

					<div ref={frameRef} className={`pj-video-frame${playing ? ' is-playing' : ''}`} onKeyDown={onKey}>
						<div className="pj-video-stage">
							{ytId ? (
								<div className="pj-video-yt">
									<div ref={ytMount} />
									{/* Takes clicks so they toggle playback instead of reaching YouTube. */}
									<div className="pj-video-shield" onClick={toggle} aria-hidden="true" />
								</div>
							) : (
								<video
									ref={videoRef}
									src={video.src}
									poster={video.poster}
									playsInline
									preload="none"
									onClick={toggle}
									aria-label={video.title}
								/>
							)}

							{showPoster && video.poster && (
								<img className="pj-video-poster is-cover" src={video.poster} alt="" onClick={toggle} />
							)}

							{(!started || ended) && (
								<button
									type="button"
									className="pj-video-start"
									onClick={toggle}
									aria-label={`${ended ? 'Replay' : 'Play'} ${video.title}`}
								>
									<span className="pj-video-start-icon" aria-hidden="true">
										<FiPlay />
									</span>
									<span className="pj-video-start-label">
										{ended ? 'Watch again' : `Watch · ${clock(duration)}`}
									</span>
								</button>
							)}
						</div>

						<div className="pj-video-bar">
							<button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
								{playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
							</button>

							<span className="pj-video-time">
								{clock(ended ? duration : time)} / {clock(duration)}
							</span>

							<input
								type="range"
								className="pj-video-seek"
								min="0"
								max={duration || 0}
								step="0.1"
								value={Math.min(time, duration)}
								onChange={seek}
								disabled={Boolean(ytId) && !started}
								aria-label="Seek"
								style={{ '--pj-progress': `${progress}%` }}
							/>

							<button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
								{muted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
							</button>

							<button type="button" onClick={fullscreen} aria-label="Full screen">
								<FiMaximize aria-hidden="true" />
							</button>
						</div>
					</div>
				</div>
			</div>
			<figcaption>{video.title}</figcaption>
		</figure>
	);
}

export default ProjectVideo;
