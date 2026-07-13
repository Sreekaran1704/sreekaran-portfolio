const FormInput = ({
	inputLabel,
	labelFor,
	inputType,
	inputId,
	inputName,
	placeholderText,
	ariaLabelName,
}) => {
	return (
		<div className="mb-4">
			<label
				className="paper-form-label block text-lg mb-1"
				htmlFor={labelFor}
			>
				{inputLabel}
			</label>
			<input
				className="paper-form-input w-full px-5 py-2 rounded-md text-md"
				type={inputType}
				id={inputId}
				name={inputName}
				placeholder={placeholderText}
				aria-label={ariaLabelName}
				required
			/>
		</div>
	);
};

export default FormInput;
