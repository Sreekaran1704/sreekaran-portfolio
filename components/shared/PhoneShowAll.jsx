// On a phone a long list opens on its first few items (see mobile.css). This
// button reveals the rest, then hands focus to the first newly shown item.
function PhoneShowAll({ total, preview, label, listRef, onExpand }) {
	if (total <= preview) return null;

	const expand = () => {
		onExpand();
		requestAnimationFrame(() => {
			listRef.current?.children[preview]?.querySelector('a')?.focus({ preventScroll: true });
		});
	};

	return (
		<button type="button" className="np-show-all" onClick={expand}>
			{label} <span aria-hidden="true">↓</span>
		</button>
	);
}

export default PhoneShowAll;
