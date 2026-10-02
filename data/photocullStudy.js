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

// "How to use" walkthrough shown one step at a time beside the live demo.
// `where` marks steps that only the Local Edition supports.
export const photocullGuide = [
	{
		title: 'Choose how to start',
		body: [
			'Click Try Demo Without Uploading Photos to run the bundled sample set, or drag your own images into the upload area.',
			'Uploads reach the demo server and are processed temporarily for this session.',
		],
		list: ['Up to 30 images', '15 MiB per image, 60 MiB per session', 'JPG/JPEG, PNG or WEBP'],
	},
	{
		title: 'Start the analysis',
		body: [
			'Review the previews, then start the analysis. Photos pass through technical-quality analysis, perceptual hashing, duplicate and burst detection, event grouping, and ranking.',
			'No paid AI API is involved at any stage.',
		],
	},
	{
		title: 'Read the Overview',
		body: ['A high-level summary of the set. Depending on your photos, you may see:'],
		list: ['Photos analyzed', 'Exact, near-duplicate and burst groups', 'Possible technical-quality issues', 'Event groups', 'Potential duplicate storage savings'],
	},
	{
		title: 'Understand technical quality',
		body: [
			'Each photo gets measurements such as sharpness, exposure, under- and overexposure, clipping, contrast and resolution, combined into a technical-quality score.',
		],
		tip: 'Read the score as “how technically clean is this image?”, not “how beautiful is it?”',
	},
	{
		title: 'Review duplicates',
		body: [
			'Exact duplicates have identical content, matched by SHA-256. Three identical 8 MB files means about 16 MB could be recovered while keeping one copy.',
			'Near duplicates are the same picture resized, recompressed, lightly edited or cropped, matched conservatively with perceptual hashes.',
		],
		tip: 'Expand the evidence to see hash distance, timestamps and dimensions. Nothing is ever deleted automatically.',
	},
	{
		title: 'Check burst groups',
		body: [
			'A burst is a run of photos taken within the same moment, a few seconds apart.',
			'Bursts are not necessarily duplicates: someone may have changed expression, moved, or looked at the camera.',
		],
	},
	{
		title: 'See the recommended representative',
		body: [
			'Within a duplicate or burst group, PhotoCull may mark one photo as the Recommended Representative, based on sharpness, exposure, resolution and overall technical quality.',
		],
		tip: 'Open the explanation to see why it was chosen. It is a recommendation, not a claim that the photo is objectively best.',
	},
	{
		title: 'Correct PhotoCull',
		body: ['You stay in charge. Mark photos as Keep, Favorite, Review Later or Not Duplicate.', 'If two grouped photos capture meaningfully different moments, choose Not Duplicate.'],
		tip: 'In the Local Edition, corrections persist, so later analyses respect them.',
	},
	{
		title: 'Explore events',
		body: [
			'Events splits photos into likely occasions using capture timestamps, with about a two-hour gap as the default rule, and picks representative images for each.',
			'Events get neutral names. PhotoCull never guesses that an event was “your birthday dinner”.',
		],
	},
	{
		title: 'Edit events',
		where: 'Local Edition',
		body: ['Rename an event, move or remove photos, merge events, or split one apart.', 'Manual edits are stored separately from automatic clustering, so rerunning the analysis does not silently undo your organization.'],
	},
	{
		title: 'Open Best Photos',
		body: [
			'Build shortlists such as Best 10, Best 20, best per event, best per burst, and Favorites.',
			'Ranking is diversity-aware: instead of five near-identical sunsets, a shortlist spreads across the sunset, the skyline, dinner and a portrait.',
		],
		tip: 'In testing, a more complex generic ranking did not beat the simpler technical-quality baseline, so extra complexity is not assumed to be better.',
	},
	{
		title: 'Mark favorites',
		body: ['Favorites stay separate from algorithmic recommendations. A later ranking change never silently removes a favorite.'],
	},
	{
		title: 'Teach PhotoCull your taste',
		where: 'Local Edition',
		body: [
			'In Preferences, choose between two photos: Prefer A, Prefer B, Tie or Skip. Each choice becomes a pairwise training example.',
			'Personalization stays inactive until there is enough feedback, and turns on only if it beats held-out preferences. Undo and reset never touch your originals.',
		],
	},
	{
		title: 'Export, then try your own photos',
		body: [
			'Export results as CSV or JSON with filename, event, rank, quality, duplicate group, recommendation and your labels. Exports never modify originals.',
			'Finally, upload 10–20 of your own photos and run the same workflow.',
		],
	},
];

export const photocullNever = [
	'Delete, move or rename photos',
	'Edit your photographs',
	'Upload Local Edition photos to a server',
	'Identify people with face recognition',
	'Make permanent aesthetic judgments',
];
