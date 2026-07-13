import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import Button from './reusable/Button';

const selectOptions = [
	'Web Application',
	'Mobile Application',
	'UI/UX Design',
	'Branding',
];

function HireMeModal({ onClose, onRequest }) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-30 transition-all duration-500"
		>
			{/* Modal Backdrop */}
			<div className="bg-black bg-opacity-50 fixed inset-0 w-full h-full z-20"></div>

			{/* Modal Content */}
			<main className="flex flex-col items-center justify-center h-full w-full">
				<div className="modal-wrapper flex items-center z-30">
					<div className="paper-modal max-w-md mx-5 xl:max-w-xl lg:max-w-xl md:max-w-xl max-h-screen flex-row rounded-lg relative">
						<div className="paper-modal-header flex justify-between gap-10 p-5">
							<h5 className="paper-modal-title text-xl">
								What project are you looking for?
							</h5>
							<button
								onClick={onClose}
								className="px-4 paper-modal-close"
								aria-label="Close Modal"
							>
								<FiX className="text-3xl" />
							</button>
						</div>
						<div className="modal-body p-5 w-full h-full">
							<form
								onSubmit={(e) => {
									e.preventDefault();
								}}
								className="max-w-xl m-4 text-left"
							>
								<div className="">
									<input
										className="paper-form-input w-full px-5 py-2 rounded-md text-md"
										id="name"
										name="name"
										type="text"
										required
										placeholder="Name"
										aria-label="Name"
									/>
								</div>
								<div className="mt-6">
									<input
										className="paper-form-input w-full px-5 py-2 rounded-md text-md"
										id="email"
										name="email"
										type="text"
										required
										placeholder="Email"
										aria-label="Email"
									/>
								</div>
								<div className="mt-6">
									<select
										className="paper-select w-full px-5 py-2 rounded-md text-md"
										id="subject"
										name="subject"
										type="text"
										required
										aria-label="Project Category"
									>
										{selectOptions.map((option) => (
											<option
												className="text-normal sm:text-md"
												key={option}
											>
												{option}
											</option>
										))}
									</select>
								</div>

								<div className="mt-6">
									<textarea
										className="paper-form-input w-full px-5 py-2 rounded-md text-md"
										id="message"
										name="message"
										cols="14"
										rows="6"
										aria-label="Details"
										placeholder="Project description"
									></textarea>
								</div>

								<div className="mt-6 pb-4 sm:pb-1">
									<span
										onClick={onRequest}
										type="submit"
										className="notice-link-btn px-4 sm:px-6 py-2 sm:py-2.5 rounded-md"
										aria-label="Submit Request"
									>
										<Button title="Send Request" />
									</span>
								</div>
							</form>
						</div>
						<div className="modal-footer mt-2 sm:mt-0 py-5 px-8 text-right">
							<span
								onClick={onClose}
								type="button"
								className="notice-link-btn notice-link-outline px-4 sm:px-6 py-2 rounded-md"
								aria-label="Close Modal"
							>
								<Button title="Close" />
							</span>
						</div>
					</div>
				</div>
			</main>
		</motion.div>
	);
}

export default HireMeModal;
