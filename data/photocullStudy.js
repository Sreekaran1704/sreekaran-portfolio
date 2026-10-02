// PhotoCull project page content. Every figure here comes from the project's
// verified results; the duplicate metrics are from a synthetic held-out
// benchmark and must always be labelled that way.

export const photocullLinks = {
	live: 'https://cameraai-sree.streamlit.app/',
	embed: 'https://cameraai-sree.streamlit.app/?embed=true&compact=true',
	github: 'https://github.com/Sreekaran1704/CameraAI',
};

export const photocullBadges = ['Computer Vision', 'Ranking', 'Clustering', 'Local ML', 'Privacy-First'];

export const photocullCapabilities = [
	'Detect exact and near-duplicate photos',
	'Identify burst groups',
	'Flag technical image-quality issues',
	'Organize photos into likely events',
	'Generate diverse photo shortlists',
	'Experiment with personalized preference learning',
];

export const photocullPipeline = [
	{ step: 'Photo scan', detail: 'Decode-check each file, record metadata and a SHA-256 fingerprint. Originals are never modified.' },
	{ step: 'Technical-quality features', detail: 'Measurable quality indicators, computed after EXIF orientation is applied.' },
	{ step: 'Perceptual hashes', detail: 'Compact visual fingerprints that stay close when two images look alike.' },
	{ step: 'Duplicate / burst detection', detail: 'Exact matches by SHA-256, near-duplicates by a conservative hash rule, bursts by capture time.' },
	{ step: 'Event grouping', detail: 'Likely occasions from capture-time gaps, with uncertain timestamps marked low confidence.' },
	{ step: 'Ranking', detail: 'Explainable, diversity-aware shortlists; each duplicate or burst group contributes at most one pick.' },
	{ step: 'Optional personalization', detail: 'Explicit pairwise choices train a local preference model.', optional: true },
];

export const photocullHeadline = [
	{ value: '98.36', unit: '%', label: 'Near-duplicate precision' },
	{ value: '71.43', unit: '%', label: 'Near-duplicate recall' },
	{ value: '82.76', unit: '%', label: 'Near-duplicate F1' },
	{ value: '155', unit: '', label: 'Automated tests passed' },
	{ value: '0.54', unit: 's', label: '1K-image warm run' },
];

export const photocullRuntime = [
	['1,000-image local fixture run', '13.31s cold / 0.54s warm'],
	['30-image web analysis core', '0.33s'],
	['Automated tests', '155 passed'],
	['Known dependency vulnerabilities', '0 at final validation'],
];

export const photocullIdeas = [
	['SHA-256 + perceptual hashing', 'Exact and visual fingerprints, side by side.'],
	['Conservative near-duplicate rule', 'Tuned to avoid flagging distinct photos.'],
	['Timestamp-aware bursts', 'A burst marks a moment, not redundancy.'],
	['Event clustering', 'Capture-time grouping with manual corrections that persist.'],
	['Local visual embeddings', 'Optional MobileNet / TinyCLIP, run on-device.'],
	['Diversity-aware ranking', 'Shortlists that cover the set instead of repeating it.'],
	['Pairwise preference learning', 'Human-in-the-loop choices, kept local.'],
	['Evaluation-first model selection', 'Defaults chosen on held-out and hard-negative sets.'],
	['Offline, private inference', 'No paid inference API; degrades gracefully without models.'],
];

export const photocullEditions = [
	{
		name: 'Local Edition',
		tag: 'Photos stay on-device',
		points: ['Scans folders on your machine', 'Local SQLite cache', 'Persistent analysis and decisions', 'Photos never leave the device'],
	},
	{
		name: 'Web Demo',
		tag: 'Session-only processing',
		points: ['Explicit browser uploads', 'Processed temporarily for the session', 'No persistent user database', 'Images do reach the demo server'],
	},
];

export const photocullNever = [
	'Delete, move or rename photos',
	'Edit your photographs',
	'Upload Local Edition photos to a server',
	'Identify people with face recognition',
	'Make permanent aesthetic judgments',
];
