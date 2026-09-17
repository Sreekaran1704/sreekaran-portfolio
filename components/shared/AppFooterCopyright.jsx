const COPYRIGHT_YEAR = 2026;

function AppFooterCopyright() {
	return (
		<div className="np-footer-inner">
			<p className="np-footer-plate">The Sreekaran Reddy Portfolio</p>
			<p className="np-footer-text">
				&copy; {COPYRIGHT_YEAR} Sreekaran Reddy. Built to showcase data, machine
				learning, and applied AI work.
			</p>
		</div>
	);
}

export default AppFooterCopyright;
