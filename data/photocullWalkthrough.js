// Guided walkthrough of the PhotoCull Web Demo, shown beside the embedded app.
//
// Control names in **double asterisks** are the exact labels in the Streamlit
// app (src/photocull/ui/web_app.py) and render as on-screen controls.
//
// The demo is a cross-origin iframe, so the portfolio cannot see what the
// visitor does inside it: every completion button is the visitor's own
// confirmation, never detection.
//
// Step shape:
//   id, section, title         identity and labels
//   optional                   shown as optional in progress
//   when(choices)              include the step only on some branches
//   deps                       choice keys whose change invalidates this step
//                              (every results step depends on `route`: a
//                              different photo set means different results)
//   choice                     { key, legend, options: [{ value, label, hint }] }
//                              must be answered before the step can complete
//   content(choices)           { do, expect, how, next, list?, note? }
//   actions(choices)           completion buttons: { label, status, also?, goTo? }
//                              status: 'done' | 'skipped' | 'unavailable'

export const walkthroughSteps = [
	{
		id: 'start',
		section: 'Start',
		title: 'Choose your photos',
		deps: ['route'],
		choice: {
			key: 'route',
			legend: 'How do you want to try PhotoCull?',
			options: [
				{ value: 'sample', label: 'Use the sample photos', hint: 'Generated illustrations, nothing to upload' },
				{ value: 'upload', label: 'Upload my own photos', hint: 'JPEG, PNG or WEBP, one at a time' },
			],
		},
		content: ({ route }) =>
			route === 'upload'
				? {
						do: 'Click **Upload Photos**. In **Add photos · one image at a time**, choose a JPEG, PNG or WEBP image, then click **Analyze and add photo**.',
						expect: 'An “Analyzing your image” spinner, then results with an image counter (1 / 30 images) and the upload budget used so far.',
						how: 'Your image is sent to the demo server and analyzed in memory for this session. It is not intentionally persisted, and nothing on your device is changed. Photos go up one at a time so the shared server’s memory stays bounded.',
						list: ['Up to 30 images per session', '15 MiB per image, 60 MiB in total', 'Up to 8 megapixels per image', 'JPEG, PNG or WEBP'],
						next: 'One photo is enough to start, but duplicates, bursts and events only appear when photos can be compared, so next you can add a few more.',
					}
				: route === 'sample'
					? {
							do: 'Click **Try Demo Without Uploading Photos**. Analysis runs automatically; there is nothing else to press.',
							expect: 'A short “Exploring the generated demo” spinner, then a green note that you are exploring generated, public-safe illustrations, and results underneath.',
							how: 'The sample is 12 generated illustrations, not personal photos. They include a copied file, a re-encoded version, shots taken in quick succession and a few technically weak frames, so every part of the analysis has something to show.',
							next: 'Next you will read the Overview, which summarizes everything the analysis found.',
						}
					: {
							do: 'Pick how you want to start. The instructions for your choice appear here.',
							expect: 'With the sample, results appear in seconds. With uploads, you add and analyze photos one at a time.',
							how: 'Both routes run the same local computer-vision pipeline on the demo server. No paid AI API is involved.',
							next: 'Once photos are loaded, the walkthrough moves to the results.',
						},
		actions: ({ route }) =>
			route === 'upload'
				? [{ label: 'I analyzed my uploaded photo', status: 'done' }]
				: [{ label: 'I loaded the sample photos', status: 'done' }],
		note: 'If the demo says it is busy or out of resources, click **Clear temporary session** and try again. An idle app may also take a moment to wake.',
	},
	{
		id: 'upload-more',
		section: 'Start',
		title: 'Add more photos, one at a time',
		optional: true,
		deps: ['route'],
		when: ({ route }) => route === 'upload',
		content: () => ({
			do: 'Repeat for each photo: choose the next image in **Add photos · one image at a time**, then click **Analyze and add photo**.',
			expect: 'The counter climbs (for example 6 / 30 images) and the results refresh after each photo. **Refresh results** re-runs the analysis if you need it.',
			how: 'Duplicate, burst and event detection compare photos with each other. Ten to twenty photos, including a couple of shots taken seconds apart, give them something to find. Events also need camera capture times (EXIF); screenshots and some edited exports do not have them.',
			next: 'With your photos in, the Overview shows what PhotoCull found.',
		}),
		actions: () => [
			{ label: 'I added more photos', status: 'done' },
			{ label: 'Continue with what I have', status: 'skipped', kind: 'alt' },
		],
	},
	{
		id: 'overview',
		section: 'Overview',
		title: 'Read the Overview',
		deps: ['route'],
		content: ({ route }) => ({
			do: 'Under **Explore your photos**, select **Overview**.',
			expect: `Six counts (Photos analyzed, Duplicate groups, Event groups, Exact groups, Near groups, Burst groups), a line counting photos with technical warnings, an estimate of potential exact-copy bytes, and three cards under **A first look**.${
				route === 'upload' ? ' Zeros are normal for a small or varied set of photos.' : ''
			}`,
			how: 'Exact copies are matched by SHA-256 fingerprints, near duplicates by perceptual hashes, and bursts and events by capture time. The bytes figure is only an estimate: PhotoCull never deletes, moves or edits images.',
			next: 'The cards each show a technical-quality score. The next step explains what that score does and does not mean.',
		}),
		actions: () => [{ label: 'I read the Overview', status: 'done' }],
	},
	{
		id: 'quality',
		section: 'Overview',
		title: 'Understand technical-quality warnings',
		deps: ['route'],
		content: ({ route }) => ({
			do: 'On a card under **A first look**, note the **Technical quality** score, then expand **Why this photo**.',
			expect: 'The reasons behind the score, weaker points in grey, and the note that technical signals do not establish aesthetic or emotional superiority.',
			how: `The score combines measurable signals such as sharpness, exposure, clipping, contrast and resolution. A warning flags something measurable, like blur or low light. It says nothing about whether the moment matters to you.${
				route === 'sample' ? ' The sample includes soft-focus and low-light frames on purpose.' : ''
			}`,
			next: 'Next, the same scores help pick a representative inside groups of duplicates.',
		}),
		actions: () => [{ label: 'I opened Why this photo', status: 'done' }],
	},
	{
		id: 'duplicates',
		section: 'Review',
		title: 'Review exact and near duplicates',
		deps: ['route'],
		content: ({ route }) => ({
			do: 'Select **Review**, choose an Exact Duplicate or Near Duplicate entry in **Review group**, then expand **Evidence** below the cards.',
			expect: 'The photos in that group, a sentence explaining which one is the representative and why, and Evidence listing the reason and the maximum hash distance.',
			how: 'Exact duplicates are byte-for-byte identical files. Near duplicates are the same picture resized, recompressed or lightly edited, with perceptual hashes within a deliberately conservative distance. PhotoCull would rather miss a near duplicate than group two different photos.',
			next: 'Bursts appear in the same list, but they mean something different.',
			note:
				route === 'upload'
					? 'If **Review** says “No conservative duplicate or burst groups found”, that is a valid result for distinct photos. Use the button for that case.'
					: undefined,
		}),
		actions: () => [
			{ label: 'I reviewed this group', status: 'done' },
			{ label: 'Review says no groups were found', status: 'unavailable', also: ['bursts'], goTo: 'events', kind: 'alt' },
		],
	},
	{
		id: 'bursts',
		section: 'Review',
		title: 'Understand bursts and representatives',
		deps: ['route'],
		content: () => ({
			do: 'In **Review group**, choose a Burst Group entry and compare its cards.',
			expect: 'Photos from the same moment, a representative picked by technical quality, and the note that burst groups mark a moment and do not imply a deletion recommendation.',
			how: 'A burst is a run of shots taken seconds apart. It identifies a moment, not redundancy: an expression, pose or glance can differ between frames. The representative is the technically cleanest frame, not a verdict that the others should go.',
			next: 'Events zoom out from single moments to whole occasions.',
		}),
		actions: () => [
			{ label: 'I reviewed a burst group', status: 'done' },
			{ label: 'There are no burst groups in my list', status: 'unavailable', kind: 'alt' },
		],
	},
	{
		id: 'events',
		section: 'Events',
		title: 'Explore events',
		deps: ['route'],
		content: ({ route }) => ({
			do: 'Select **Events**.',
			expect: 'Event cards (such as “Event 01 · 3 photos”) with a start → end time, a few representative thumbnails and the reason they were chosen.',
			how: 'Photos are split into likely occasions where capture times jump by about two hours. Events get neutral names; PhotoCull never guesses that something was “your birthday dinner”, and it never invents capture times from upload times. Renaming, merging and splitting events are Local Edition features, not available in this demo.',
			next: 'Next, the shortlist: which photos PhotoCull would recommend, and why.',
			note:
				route === 'upload'
					? 'Photos without camera capture times show “No usable EXIF capture times”. Use the button for that case.'
					: undefined,
		}),
		actions: () => [
			{ label: 'I explored the events', status: 'done' },
			{ label: 'It says no usable EXIF capture times', status: 'unavailable', kind: 'alt' },
		],
	},
	{
		id: 'ranking',
		section: 'Best Photos',
		title: 'Compare Generic Ranking A and B',
		deps: ['route', 'rank'],
		choice: {
			key: 'rank',
			legend: 'Which ranking do you want to look at first?',
			options: [
				{ value: 'A', label: 'Ranking A · Technical quality', hint: 'The simple baseline' },
				{ value: 'B', label: 'Ranking B · Quality and diversity', hint: 'The default view' },
			],
		},
		content: ({ rank }) =>
			rank === 'A'
				? {
						do: 'Select **Best Photos**, keep **Ranking mode** on **Generic**, and set **Generic ranking** to **A · Technical quality**.',
						expect: 'A shortlist ordered by technical-quality score, with a caption such as “10 recommendations · one per known duplicate/burst group · no forced fillers”.',
						how: 'Ranking A sorts by the technical-quality score alone. Like B, it lets each known duplicate or burst group contribute at most one photo, so copies do not crowd the list.',
						next: 'Switch **Generic ranking** to B to see which photos change, then open the reasoning behind one pick.',
					}
				: rank === 'B'
					? {
							do: 'Select **Best Photos**, keep **Ranking mode** on **Generic**, and leave **Generic ranking** on **B · Quality and diversity**.',
							expect: 'A shortlist that spreads across different moments and events, with a caption such as “10 recommendations · one per known duplicate/burst group · no forced fillers”.',
							how: 'Ranking B starts from technical quality and adds representation, uniqueness and similarity penalties, so one scene does not fill the list. In the project’s tests it did not outperform the simpler Ranking A: it is a different trade-off, not a guaranteed upgrade.',
							next: 'Switch **Generic ranking** to A to compare, then open the reasoning behind one pick.',
						}
					: {
							do: 'Pick a ranking to start with. You can switch between them in the demo at any time.',
							expect: 'Both produce a Best Photos shortlist of 10 or 20 (set with **Shortlist size**).',
							how: 'A is the technical-quality baseline; B adds diversity. Neither is assumed to be better.',
							next: 'After comparing, you will open the explanation behind a pick.',
						},
		actions: ({ rank }) => [{ label: rank === 'A' ? 'I viewed Ranking A' : 'I viewed Ranking B', status: 'done' }],
	},
	{
		id: 'why',
		section: 'Best Photos',
		title: 'Open “Why this photo”',
		deps: ['route'],
		content: () => ({
			do: 'On any **Best Photos** card, expand **Why this photo**.',
			expect: 'The specific signals behind that pick, its weaker points, and the reminder that technical signals are not an aesthetic judgment.',
			how: 'Every recommendation is explained by the measurements that produced it. Showing weaker points too means you can disagree with the evidence in front of you.',
			next: 'Then record your own decision on a photo.',
		}),
		actions: () => [{ label: 'I read why a photo was picked', status: 'done' }],
	},
	{
		id: 'decide',
		section: 'Best Photos',
		title: 'Mark Keep, Favorite or Review',
		deps: ['route'],
		content: () => ({
			do: 'Under a card, open **Your choice** and select **favorite**. Mark others **keep** or **review** if you like.',
			expect: 'The card keeps your label, and the label is included when you export.',
			how: 'Labels are your decisions, kept separate from the algorithm’s ranking, and PhotoCull acts on none of them. In the Web Demo they last only for this session; the Local Edition keeps them.',
			next: 'Optionally, teach PhotoCull your taste, or go straight to exporting.',
		}),
		actions: () => [{ label: 'I marked a favorite', status: 'done' }],
	},
	{
		id: 'prefs',
		section: 'Preferences',
		title: 'Optional: teach PhotoCull your taste',
		optional: true,
		deps: ['route', 'prefs'],
		choice: {
			key: 'prefs',
			legend: 'Do you want to try preference comparisons?',
			options: [
				{ value: 'try', label: 'Try preference comparisons', hint: 'A few A-versus-B choices' },
				{ value: 'skip', label: 'Skip to Export', hint: 'Come back to it any time' },
			],
		},
		content: ({ prefs }) => ({
			do:
				prefs === 'skip'
					? 'Nothing to do in the demo for this step.'
					: prefs === 'try'
						? 'Continue, and the next step shows how to compare photos in **Preferences**.'
						: 'Choose whether to try preference comparisons.',
			expect: 'Preferences shows two photos side by side and asks which you prefer.',
			how: 'Personalization is experimental. It learns from your pairwise choices, only switches on when it beats choices it has not seen, and can stay inactive for the whole session. A short walkthrough will not activate it.',
			next: prefs === 'skip' ? 'Next, export your shortlist.' : 'Next, make a few comparisons.',
		}),
		actions: ({ prefs }) =>
			prefs === 'skip'
				? [{ label: 'Skip to Export', status: 'skipped' }]
				: [{ label: 'Show me how', status: 'done' }],
	},
	{
		id: 'prefs-try',
		section: 'Preferences',
		title: 'Compare photos in Preferences',
		optional: true,
		deps: ['route', 'prefs'],
		when: ({ prefs }) => prefs === 'try',
		content: () => ({
			do: 'Select **Preferences**. With **Preference set** on **Training**, choose **Prefer A**, **Prefer B**, **Tie** or **Skip** for a few pairs. **Undo latest preference** reverses the last one.',
			expect: 'The “/ 50 decisive training comparisons” counter rises, while the status keeps saying “Personalization is not active yet.” That is expected.',
			how: 'Each choice is one pairwise training example. Activation needs 50 decisive comparisons and then an independent improvement on the **Held-out** set, and a small demo may not contain enough pairs. **Reset session preferences** clears your choices without touching any photo.',
			next: 'Finally, export your shortlist.',
		}),
		actions: () => [
			{ label: 'I made a few comparisons', status: 'done' },
			{ label: 'It says no fresh comparisons in this set', status: 'unavailable', kind: 'alt' },
		],
	},
	{
		id: 'export',
		section: 'Export',
		title: 'Export your shortlist',
		deps: ['route', 'format'],
		choice: {
			key: 'format',
			legend: 'Which format do you want?',
			options: [
				{ value: 'json', label: 'JSON manifest', hint: 'For scripts and tools' },
				{ value: 'csv', label: 'CSV manifest', hint: 'For spreadsheets' },
			],
		},
		content: ({ format }) => {
			const shared = {
				how: 'The manifest is metadata only: no images, and no source paths. It describes the current shortlist (filename, rank, event, measurements, explanations and your labels). Nothing is moved, overwritten or deleted.',
				next: 'Last step: clear the temporary session when you are done.',
			};
			if (format === 'json') {
				return {
					...shared,
					do: 'Select **Export**, keep or trim the photos listed in **Export photos**, then click **Download JSON manifest**.',
					expect: 'Your browser downloads photocull-demo-shortlist.json: structured records you can load in Python, JavaScript or any JSON tool.',
				};
			}
			if (format === 'csv') {
				return {
					...shared,
					do: 'Select **Export**, keep or trim the photos listed in **Export photos**, then click **Download CSV manifest**.',
					expect: 'Your browser downloads photocull-demo-shortlist.csv with one row per photo, ready to open in Excel, Numbers or Google Sheets.',
				};
			}
			return { ...shared, do: 'Choose a format to see the exact button.', expect: 'A small file describing your shortlist.' };
		},
		actions: ({ format }) => [
			{ label: format === 'csv' ? 'I downloaded my CSV export' : 'I downloaded my JSON export', status: 'done' },
		],
	},
	{
		id: 'clear',
		section: 'Finish',
		title: 'Clear the temporary session',
		deps: ['route'],
		content: () => ({
			do: 'Scroll to the bottom of the demo and click **Clear temporary session**.',
			expect: 'Your photos, labels and preferences disappear and the demo returns to its start screen.',
			how: 'Clearing releases the session from the server’s memory straight away; idle sessions are also cleared automatically after about 15 minutes. Restarting this walkthrough does not clear the demo. Only this button does.',
			next: 'That is the whole Web Demo. The Local Edition adds folder scanning, a private on-device cache, saved decisions and event editing.',
		}),
		actions: () => [
			{ label: 'I cleared my session', status: 'done' },
			{ label: 'Keep my session for now', status: 'skipped', kind: 'alt' },
		],
	},
];

// Pure walkthrough logic, kept beside the data so the component stays thin.

export const pathFor = (choices) => walkthroughSteps.filter((step) => !step.when || step.when(choices));

export const stepById = (id) => walkthroughSteps.find((step) => step.id === id);

// The first step on the path still waiting for a branch choice. Steps after it
// cannot be reached yet.
export function firstBlockedIndex(path, choices) {
	const index = path.findIndex((step) => step.choice && choices[step.choice.key] == null);
	return index === -1 ? path.length - 1 : index;
}

// Changing a choice resets every step that depends on it and drops progress
// on steps the new branch no longer includes.
export function applyChoice(state, key, value) {
	const previous = state.choices[key];
	const choices = { ...state.choices, [key]: value };
	if (previous == null || previous === value) return { ...state, choices, notice: '' };

	const onPath = new Set(pathFor(choices).map((step) => step.id));
	const status = {};
	let reset = 0;
	Object.entries(state.status).forEach(([id, value_]) => {
		const step = stepById(id);
		if (onPath.has(id) && !step.deps?.includes(key)) status[id] = value_;
		else reset += 1;
	});
	return {
		...state,
		choices,
		status,
		notice: reset ? `Changing this choice reset ${reset} step${reset === 1 ? '' : 's'} that depended on it.` : '',
	};
}
