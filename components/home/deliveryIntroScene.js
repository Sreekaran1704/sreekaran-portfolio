// The first-visit intro: a paperboy rides up the street, rolls a paper and
// throws it at the reader; it lands as a front page whose nameplate settles
// onto the real masthead. Drawn and driven by hand (SVG + one rAF loop) so it
// needs no animation library. Every frame is a pure function of time `t`.

const NS = 'http://www.w3.org/2000/svg';
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, u) => a + (b - a) * u;
const seg = (t, [a, b]) => clamp((t - a) / (b - a));
const ease = {
	inOut: (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2),
	out: (u) => 1 - Math.pow(1 - u, 3),
	in: (u) => u * u * u,
	outBack: (u) => 1 + 2.5 * Math.pow(u - 1, 3) + 1.5 * Math.pow(u - 1, 2),
};

// Timeline, in seconds.
// The approach and the pause on the front page are the shortest beats; the
// roll and throw keep just enough time to read.
const T = {
	fadeIn: [0, 0.1],
	approach: [0, 0.65],
	grab: 0.3, lift: [0.35, 0.43], roll: [0.45, 0.56], windup: [0.56, 0.61], release: 0.65,
	exit: [0.65, 0.95],
	fly: [0.65, 0.95],
	land: [0.92, 1.07],
	expand: [1.12, 1.25],
	morph: [1.18, 1.36],
	fade: [1.3, 1.45],
};
export const INTRO_DURATION = 1.45;
// How far down the street the rider starts (depth; 1 is right in front).
const START_DEPTH = 6;

const VP = { x: 800, y: 430 };
const G = 420; // ground line below the horizon at depth 1
const P = (X, Y, z) => [VP.x + X / z, VP.y + (G - Y) / z];
const pts = (a) => a.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
const INK = '#161412';
const SKIN = '#e7c39f';
const SHIRT = '#1a5aa6';

function el(tag, attrs, parent) {
	const n = document.createElementNS(NS, tag);
	Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
	if (parent) parent.appendChild(n);
	return n;
}
// Paper-coloured fills follow the edition (cream in colour, white in B&W).
const paper = (n) => { n.style.fill = 'var(--np-paper)'; return n; };

function drawStreet(svg) {
	const defs = el('defs', {}, svg);
	const dots = el('pattern', { id: 'np-intro-dots', width: 7, height: 7, patternUnits: 'userSpaceOnUse' }, defs);
	el('circle', { cx: 2, cy: 2, r: 1.1, fill: INK }, dots);
	const sun = el('pattern', { id: 'np-intro-sun', width: 11, height: 11, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
	el('circle', { cx: 5.5, cy: 5.5, r: 3.6, fill: '#e07a1f' }, sun);

	const scene = el('g', {}, svg);
	paper(el('rect', { x: -400, y: -100, width: 2400, height: 1200 }, scene));
	el('rect', { x: -400, y: -100, width: 2400, height: 530, fill: 'url(#np-intro-dots)', opacity: 0.06 }, scene);
	el('circle', { cx: 800, cy: 345, r: 150, fill: 'url(#np-intro-sun)', opacity: 0.55 }, scene);
	el('rect', { x: -400, y: 430, width: 2400, height: 600, fill: '#efe8da' }, scene);
	el('line', { x1: -400, y1: 430, x2: 2000, y2: 430, stroke: INK, 'stroke-width': 1.5 }, scene);

	el('polygon', { points: pts([P(-430, 0, 0.8), P(430, 0, 0.8), P(430, 0, 90), P(-430, 0, 90)]), fill: '#e2d9c6', stroke: INK, 'stroke-width': 2 }, scene);
	[-470, 470].forEach((X) => {
		const [a, b] = [P(X, 0, 0.8), P(X, 0, 90)];
		el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: INK, 'stroke-width': 1.2 }, scene);
	});
	for (let z = 1.2; z < 46; z += 2.2) {
		el('polygon', { points: pts([P(-8, 0, z), P(8, 0, z), P(8, 0, z + 1), P(-8, 0, z + 1)]), fill: INK, opacity: 0.75 }, scene);
	}

	// Rowhouses on both sides, far to near: [side, nearDepth, farDepth, height].
	[
		[-1, 0.45, 3.2, 600], [-1, 3.2, 6, 700], [-1, 6, 9.5, 520], [-1, 9.5, 14, 660], [-1, 14, 20, 560], [-1, 20, 30, 640], [-1, 30, 50, 520],
		[1, 0.45, 2.8, 540], [1, 2.8, 6.5, 660], [1, 6.5, 10, 600], [1, 10, 15, 720], [1, 15, 22, 540], [1, 22, 32, 620], [1, 32, 50, 560],
	]
		.sort((a, b) => b[1] - a[1])
		.forEach(([side, z1, z2, h], i) => {
			const X = side * 520;
			const face = pts([P(X, 0, z1), P(X, h, z1), P(X, h, z2), P(X, 0, z2)]);
			paper(el('polygon', { points: face, stroke: INK, 'stroke-width': 1.6 }, scene));
			if (i % 2) el('polygon', { points: face, fill: 'url(#np-intro-dots)', opacity: 0.22 }, scene);
			const [c1, c2] = [P(X, h, z1), P(X, h, z2)];
			el('line', { x1: c1[0], y1: c1[1], x2: c2[0], y2: c2[1], stroke: INK, 'stroke-width': 3.5 }, scene);
			for (let Y = 110; Y < h - 90; Y += 135) {
				[0.22, 0.5, 0.78].forEach((u) => {
					if (Y === 110 && u === 0.5) return; // the door goes here
					const za = z1 + (u - 0.08) * (z2 - z1);
					const zb = z1 + (u + 0.08) * (z2 - z1);
					el('polygon', { points: pts([P(X, Y, za), P(X, Y + 72, za), P(X, Y + 72, zb), P(X, Y, zb)]), fill: '#2b2824', opacity: 0.82 }, scene);
				});
			}
			const da = z1 + 0.45 * (z2 - z1);
			const db = z1 + 0.55 * (z2 - z1);
			el('polygon', { points: pts([P(X, 0, da), P(X, 150, da), P(X, 150, db), P(X, 0, db)]), fill: '#8f1d1d', opacity: 0.75 }, scene);
		});

	[19, 14, 10, 7, 4.6, 2.6].forEach((z) => {
		[-1, 1].forEach((side) => {
			const X = side * 470;
			const s = 1 / z;
			const [g, top] = [P(X, 0, z), P(X, 380, z)];
			const arm = P(X - side * 46, 372, z);
			el('line', { x1: g[0], y1: g[1], x2: top[0], y2: top[1], stroke: INK, 'stroke-width': Math.max(0.8, 9 * s) }, scene);
			el('line', { x1: top[0], y1: top[1], x2: arm[0], y2: arm[1], stroke: INK, 'stroke-width': Math.max(0.8, 6 * s) }, scene);
			el('circle', { cx: arm[0], cy: arm[1] + 9 * s, r: Math.max(1, 11 * s), fill: '#f2c94c', stroke: INK, 'stroke-width': Math.max(0.6, 3 * s) }, scene);
		});
	});
	return scene;
}

// The paperboy, seen from the front. Local coords: ground contact at (0, 0).
function drawRider(svg) {
	const rider = el('g', {}, svg);
	const shadow = el('ellipse', { cx: 0, cy: 0, rx: 72, ry: 11, fill: INK, opacity: 0.16 }, rider);
	const body = el('g', {}, rider);
	const legStyle = { fill: 'none', stroke: '#2b2824', 'stroke-width': 17, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
	const legL = el('polyline', legStyle, body);
	const legR = el('polyline', legStyle, body);
	const shoeL = el('ellipse', { rx: 13, ry: 7, fill: INK }, body);
	const shoeR = el('ellipse', { rx: 13, ry: 7, fill: INK }, body);
	el('path', { d: 'M-44,-232 Q0,-246 44,-232 L33,-166 Q0,-158 -33,-166 Z', fill: SHIRT, stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, body);
	el('path', { d: 'M-12,-240 L0,-224 L12,-240', fill: '#fff', stroke: INK, 'stroke-width': 2 }, body);
	el('line', { x1: -36, y1: -230, x2: 36, y2: -176, stroke: '#5b3a1a', 'stroke-width': 5 }, body);
	el('rect', { x: 26, y: -194, width: 36, height: 30, rx: 4, fill: '#b35300', stroke: INK, 'stroke-width': 3 }, body);
	el('rect', { x: 31, y: -204, width: 9, height: 16, fill: '#fff', stroke: INK, 'stroke-width': 1.5 }, body);
	el('rect', { x: 43, y: -201, width: 9, height: 13, fill: '#fff', stroke: INK, 'stroke-width': 1.5 }, body);
	el('rect', { x: -8, y: -254, width: 16, height: 18, fill: SKIN }, body);
	[[-25, -283], [25, -283], [-22, -270], [22, -270]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 6.5, fill: '#1c1714' }, body));
	el('circle', { cx: 0, cy: -277, r: 24, fill: SKIN, stroke: INK, 'stroke-width': 3 }, body);
	el('circle', { cx: -9, cy: -278, r: 6.5, fill: 'none', stroke: INK, 'stroke-width': 2.5 }, body);
	el('circle', { cx: 9, cy: -278, r: 6.5, fill: 'none', stroke: INK, 'stroke-width': 2.5 }, body);
	el('line', { x1: -2.5, y1: -278, x2: 2.5, y2: -278, stroke: INK, 'stroke-width': 2.5 }, body);
	el('path', { d: 'M-8,-265 Q0,-258 8,-265', fill: 'none', stroke: INK, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, body);
	el('path', { d: 'M-27,-286 Q-27,-310 0,-311 Q27,-310 27,-286 Z', fill: '#c0262d', stroke: INK, 'stroke-width': 3 }, body);
	el('ellipse', { cx: 0, cy: -287, rx: 30, ry: 6.5, fill: '#8f1d1d', stroke: INK, 'stroke-width': 2.5 }, body);
	el('circle', { cx: 0, cy: -311, r: 4, fill: INK }, body);
	el('path', { d: 'M-78,-148 Q0,-168 78,-148', fill: 'none', stroke: INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, body);
	el('rect', { x: -84, y: -155, width: 16, height: 11, rx: 4, fill: '#2b2824' }, body);
	el('rect', { x: 68, y: -155, width: 16, height: 11, rx: 4, fill: '#2b2824' }, body);
	el('line', { x1: -9, y1: -56, x2: -6, y2: -146, stroke: INK, 'stroke-width': 5 }, body);
	el('line', { x1: 9, y1: -56, x2: 6, y2: -146, stroke: INK, 'stroke-width': 5 }, body);
	el('ellipse', { cx: 0, cy: -56, rx: 11, ry: 56, fill: 'none', stroke: INK, 'stroke-width': 8 }, body);
	const tread = el('ellipse', { cx: 0, cy: -56, rx: 11, ry: 56, fill: 'none', stroke: '#9a9182', 'stroke-width': 3, 'stroke-dasharray': '5 15' }, body);
	el('rect', { x: -38, y: -146, width: 76, height: 38, fill: '#e2d2b4', stroke: INK, 'stroke-width': 3 }, body);
	for (let x = -26; x <= 26; x += 13) el('line', { x1: x, y1: -146, x2: x, y2: -108, stroke: INK, 'stroke-width': 1.2, opacity: 0.5 }, body);
	const basketPapers = [-24, -6, 12].map((x) => el('rect', { x, y: -166, width: 14, height: 26, fill: '#fff', stroke: INK, 'stroke-width': 1.8 }, body));
	el('circle', { cx: 0, cy: -98, r: 8, fill: '#f2c94c', stroke: INK, 'stroke-width': 2.5 }, body);
	const armStyle = { fill: 'none', stroke: SHIRT, 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
	const armL = el('polyline', armStyle, body);
	const handL = el('circle', { r: 8, fill: SKIN, stroke: INK, 'stroke-width': 2 }, body);
	const armR = el('polyline', armStyle, body);
	const handR = el('circle', { r: 8, fill: SKIN, stroke: INK, 'stroke-width': 2 }, body);
	const held = el('g', {}, body);
	const heldSheet = el('rect', { y: -24, height: 48, fill: '#fff', stroke: INK, 'stroke-width': 2 }, held);
	const heldLines = el('g', { stroke: INK, 'stroke-width': 1.6 }, held);
	[-14, -6, 2, 10].forEach((y) => el('line', { x1: -20, x2: 20, y1: y, y2: y }, heldLines));
	const heldBand = el('rect', { x: -7, y: -4, width: 14, height: 8, fill: '#c0262d', opacity: 0 }, held);
	return { rider, shadow, body, legL, legR, shoeL, shoeR, tread, basketPapers, armL, handL, armR, handR, held, heldSheet, heldLines, heldBand };
}

function drawFlight(svg) {
	const flight = el('g', { opacity: 0 }, svg);
	const ns = { 'vector-effect': 'non-scaling-stroke' };
	el('rect', { x: -6, y: -24, width: 12, height: 48, rx: 6, fill: '#fff', stroke: INK, 'stroke-width': 3, ...ns }, flight);
	el('line', { x1: -3, x2: 3, y1: -15, y2: -15, stroke: INK, 'stroke-width': 1.5, ...ns }, flight);
	el('line', { x1: -3, x2: 3, y1: 14, y2: 14, stroke: INK, 'stroke-width': 1.5, ...ns }, flight);
	el('rect', { x: -6, y: -3.5, width: 12, height: 7, fill: '#c0262d' }, flight);
	return flight;
}

function riderPose(t) {
	const pa = seg(t, T.approach);
	const pe = seg(t, T.exit);
	// Log-space approach, front-loaded so he is close enough to read the throw.
	let z = START_DEPTH * Math.pow(1.1 / START_DEPTH, Math.pow(pa, 0.75));
	let X = -40;
	if (t > T.exit[0]) {
		z = lerp(1.1, 0.8, ease.inOut(pe));
		X = -40 + 1500 * ease.in(pe);
	}
	const s = 1 / z;
	const phi = t * 2 * Math.PI * 3;
	return { s, phi, x: VP.x + X * s, y: VP.y + G * s - 3 * Math.abs(Math.sin(phi)) * s, theta: 2.2 * Math.sin(phi) + 16 * ease.in(pe) };
}

// Right hand: on the bar, into the basket, paper up, wind up, throw, back.
const HAND_KEYS = [[0, 64, -150], [T.grab, 64, -150], [T.lift[0], 12, -160], [T.lift[1], 82, -250], [T.windup[0], 84, -252], [T.windup[1], 100, -304], [T.release, 26, -226], [T.release + 0.2, 64, -150]];
const RELEASE_HAND = [26, -236];
function handAt(t) {
	for (let i = 0; i < HAND_KEYS.length - 1; i += 1) {
		const [t0, x0, y0] = HAND_KEYS[i];
		const [t1, x1, y1] = HAND_KEYS[i + 1];
		if (t <= t1) {
			const u = ease.inOut(clamp((t - t0) / (t1 - t0)));
			return [lerp(x0, x1, u), lerp(y0, y1, u)];
		}
	}
	return [64, -150];
}

function elbow(S, H, side) {
	const dx = H[0] - S[0];
	const dy = H[1] - S[1];
	const L = Math.hypot(dx, dy) || 1;
	const off = Math.sqrt(Math.max(0, 52 * 52 - (L / 2) * (L / 2)));
	let nx = -dy / L;
	let ny = dx / L;
	if (Math.sign(nx) !== side) { nx = -nx; ny = -ny; }
	return [(S[0] + H[0]) / 2 + nx * off, (S[1] + H[1]) / 2 + ny * off];
}

function toScreen(pose, [hx, hy]) {
	const r = (pose.theta * Math.PI) / 180;
	const c = Math.cos(r);
	const n = Math.sin(r);
	return [pose.x + pose.s * (c * hx - n * hy), pose.y + pose.s * (n * hx + c * hy)];
}

const polyline = (...p) => p.map((q) => q.join(',')).join(' ');

// Measures the text of both nameplates (the real one is a full-width block).
function measureMorph(plate, target, sheet) {
	if (!target) return null;
	const textRect = (node) => {
		const r = document.createRange();
		r.selectNodeContents(node);
		return r.getBoundingClientRect();
	};
	const prevSheet = sheet.style.transform;
	const prevPlate = plate.style.transform;
	sheet.style.transform = 'none';
	plate.style.transform = 'none';
	const A = textRect(plate);
	const B = textRect(target);
	sheet.style.transform = prevSheet;
	plate.style.transform = prevPlate;
	if (!A.width || !B.width) return null;
	const sc = B.width / A.width;
	// Where the real nameplate wraps onto two lines, just dissolve instead.
	if (Math.abs(A.height * sc - B.height) > B.height * 0.35) return null;
	return { dx: B.left + B.width / 2 - (A.left + A.width / 2), dy: B.top + B.height / 2 - (A.top + A.height / 2), sc };
}

/**
 * Builds the scene inside `root` and plays it once. Calls `onDone` when the
 * page has been revealed. Returns a function that stops it early.
 */
export function playDeliveryIntro(root, onDone) {
	const svg = root.querySelector('.np-intro-scene');
	const stage = root.querySelector('.np-intro-stage');
	const sheet = root.querySelector('.np-intro-sheet');
	const plate = root.querySelector('.np-intro-plate');
	const fades = [...root.querySelectorAll('.np-intro-fade')];
	const target = document.querySelector('.np-nameplate');

	svg.textContent = '';
	const scene = drawStreet(svg);
	const r = drawRider(svg);
	const flight = drawFlight(svg);
	const releasePose = riderPose(T.release);
	const releaseAt = toScreen(releasePose, RELEASE_HAND);
	let morph;

	function render(t) {
		scene.style.opacity = seg(t, T.fadeIn) * (1 - seg(t, T.expand));
		r.rider.style.opacity = t < T.exit[1] ? seg(t, T.fadeIn) : 0;

		const pose = riderPose(t);
		r.rider.setAttribute('transform', `translate(${pose.x.toFixed(1)} ${pose.y.toFixed(1)}) scale(${pose.s.toFixed(4)})`);
		r.body.setAttribute('transform', `rotate(${pose.theta.toFixed(2)})`);
		r.shadow.setAttribute('rx', 72 - 4 * Math.abs(Math.sin(pose.phi)));
		r.tread.setAttribute('stroke-dashoffset', (-t * 420).toFixed(1));
		const k = Math.sin(pose.phi);
		const leg = (side, kk) => [[side * 20, -168], [side * 37, -118 - 20 * kk], [side * 28, -38 - 20 * kk]];
		const L1 = leg(-1, k);
		const L2 = leg(1, -k);
		r.legL.setAttribute('points', polyline(...L1));
		r.legR.setAttribute('points', polyline(...L2));
		r.shoeL.setAttribute('cx', L1[2][0]);
		r.shoeL.setAttribute('cy', L1[2][1] + 4);
		r.shoeR.setAttribute('cx', L2[2][0]);
		r.shoeR.setAttribute('cy', L2[2][1] + 4);
		const SL = [-38, -228];
		const HL = [-66, -150];
		const SR = [38, -228];
		const HR = handAt(t);
		r.armL.setAttribute('points', polyline(SL, elbow(SL, HL, -1), HL));
		r.handL.setAttribute('cx', HL[0]);
		r.handL.setAttribute('cy', HL[1]);
		r.armR.setAttribute('points', polyline(SR, elbow(SR, HR, 1), HR));
		r.handR.setAttribute('cx', HR[0]);
		r.handR.setAttribute('cy', HR[1]);
		r.basketPapers[2].style.opacity = t >= T.lift[0] ? 0 : 1;

		// The paper in hand: pulled out, flicked open, rolled up, banded.
		const holding = t >= T.lift[0] && t < T.release;
		r.held.style.opacity = holding ? 1 : 0;
		if (holding) {
			const open = ease.out(seg(t, T.lift));
			const roll = ease.inOut(seg(t, T.roll));
			const w = t < T.roll[0] ? lerp(14, 56, open) : lerp(56, 12, roll);
			r.heldSheet.setAttribute('x', -w / 2);
			r.heldSheet.setAttribute('width', w);
			r.heldSheet.setAttribute('rx', lerp(1, 6, roll));
			r.heldLines.setAttribute('opacity', 1 - clamp(roll * 1.6));
			r.heldLines.setAttribute('transform', `scale(${(w / 56).toFixed(3)} 1)`);
			r.heldBand.setAttribute('opacity', seg(t, [T.roll[1] - 0.05, T.roll[1]]));
			let rot = -8;
			if (t >= T.windup[0] && t < T.windup[1]) rot = lerp(-8, -40, seg(t, T.windup));
			else if (t >= T.windup[1]) rot = lerp(-40, 20, seg(t, [T.windup[1], T.release]));
			r.held.setAttribute('transform', `translate(${HR[0]} ${HR[1] - 10}) rotate(${rot.toFixed(1)})`);
		}

		// The rolled paper spins toward the reader until it fills the view.
		const inFlight = t >= T.fly[0] && t < T.fly[1] + 0.02;
		flight.style.opacity = inFlight ? 1 - seg(t, [T.fly[1] - 0.05, T.fly[1]]) : 0;
		if (inFlight) {
			const u = seg(t, T.fly);
			const ue = ease.inOut(u);
			const x = lerp(releaseAt[0], 800, ue);
			const y = lerp(releaseAt[1], 470, ue) - 150 * Math.sin(Math.PI * u);
			const sc = releasePose.s * Math.pow(11 / releasePose.s, Math.pow(u, 1.8));
			flight.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(-20 + 620 * ease.out(u)).toFixed(1)}) scale(${sc.toFixed(3)})`);
		}

		// A small thud as it lands.
		const thud = [T.land[0] + 0.02, T.land[0] + 0.13];
		const shake = t > thud[0] && t < thud[1] ? (1 - seg(t, thud)) * 5 * Math.sin(t * 95) : 0;
		stage.style.transform = shake ? `translate(${shake.toFixed(2)}px, ${(shake * 0.6).toFixed(2)}px)` : '';

		// The front page lands at a tilt, then opens to the full screen.
		const lu = seg(t, T.land);
		const xu = ease.inOut(seg(t, T.expand));
		let sk = lerp(0.16, 0.84, ease.outBack(lu));
		let sr = lerp(-18, -2.5, ease.out(lu));
		if (t > T.expand[0]) {
			sk = lerp(0.84, 1, xu);
			sr = lerp(-2.5, 0, xu);
		}
		sheet.style.opacity = seg(t, [T.land[0] - 0.02, T.land[0] + 0.05]);
		sheet.style.transform = `scale(${sk.toFixed(4)}) rotate(${sr.toFixed(2)}deg)`;
		sheet.style.setProperty('--np-intro-shadow', (0.35 * (1 - xu)).toFixed(3));

		// Its nameplate settles onto the real masthead; the rest dissolves.
		if (t >= T.expand[0] && morph === undefined) morph = measureMorph(plate, target, sheet);
		const mu = ease.inOut(seg(t, T.morph));
		plate.style.transform = morph && mu > 0
			? `translate(${(morph.dx * mu).toFixed(1)}px, ${(morph.dy * mu).toFixed(1)}px) scale(${(1 + (morph.sc - 1) * mu).toFixed(4)})`
			: '';
		const fo = 1 - seg(t, [T.morph[0] - 0.03, T.morph[0] + 0.1]);
		fades.forEach((f) => { f.style.opacity = fo; });
		if (morph === null) plate.style.opacity = fo;
		root.style.opacity = 1 - seg(t, T.fade);
	}

	let t = 0;
	let last = performance.now();
	let frame;
	let done = false;
	let teardown;
	const finish = () => {
		if (done) return;
		teardown();
		onDone();
	};
	const tick = (now) => {
		t = Math.min(INTRO_DURATION, t + (now - last) / 1000);
		last = now;
		render(t);
		if (t >= INTRO_DURATION) finish();
		else frame = requestAnimationFrame(tick);
	};
	// Skipping jumps straight to the final dissolve.
	const skip = () => { if (t < T.fade[0]) t = T.fade[0]; };
	const onKey = (e) => { if (['Escape', 'Enter', ' ', 'Spacebar'].includes(e.key)) { e.preventDefault(); skip(); } };
	const onResize = () => { if (morph !== undefined) morph = measureMorph(plate, target, sheet); };
	root.addEventListener('click', skip);
	window.addEventListener('keydown', onKey);
	window.addEventListener('resize', onResize);
	render(0);
	frame = requestAnimationFrame(tick);

	teardown = () => {
		done = true;
		cancelAnimationFrame(frame);
		root.removeEventListener('click', skip);
		window.removeEventListener('keydown', onKey);
		window.removeEventListener('resize', onResize);
	};
	return teardown;
}
