const COPYRIGHT_YEAR = 2026;

function AppFooterCopyright() {
	return (
		<div className="flex justify-center items-center text-center">
			<div className="footer-copyright-text">
				&copy; {COPYRIGHT_YEAR}{' '}
				<span className="footer-copyright-name">
					Sreekaran Reddy
				</span>
				. Built to showcase data, machine learning, and applied AI work.
			</div>
		</div>
	);
}

export default AppFooterCopyright;
