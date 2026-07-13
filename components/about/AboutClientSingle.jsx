import Image from 'next/image';

function AboutClientSingle({ title, image }) {
	return (
		<div className="paper-client-card py-5 px-10 rounded-lg mb-5 cursor-pointer">
			<Image
				src={image}
				alt={title}
				layout="responsive"
				width={100}
				height={50}
			/>
		</div>
	);
}

export default AboutClientSingle;
