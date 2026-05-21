const COPYRIGHT_YEAR = 2026;

function AppFooterCopyright() {
	return (
		<div className="font-general-regular flex justify-center items-center text-center">
			<div className="text-lg text-ternary-dark dark:text-ternary-light">
				&copy; {COPYRIGHT_YEAR}{' '}
				<span className="font-medium text-secondary-dark dark:text-secondary-light">
					Sreekaran Reddy
				</span>
				. Built to showcase data, machine learning, and applied AI work.
			</div>
		</div>
	);
}

export default AppFooterCopyright;
