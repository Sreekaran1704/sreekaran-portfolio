const CounterItem = ({ title, counter, measurement }) => {
	return (
		<div className="mb-20 sm:mb-0">
			<h2 className="paper-counter-value text-4xl text-center mb-2">
				{counter} {measurement}
			</h2>
			<span className="paper-counter-label block text-md text-center">
				{title}
			</span>
		</div>
	);
};

export default CounterItem;
