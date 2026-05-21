export const articlesData = [
	{
		id: 1,
		title: 'How I Slowly Understood What’s Really Happening Inside LLMs like ChatGPT',
		subtitle: 'A personal journey into tokenization, probability, and next-token prediction.',
		description:
			'I wrote this as a learning trail through LLMs, starting from the first question that bothered me: how does a model even see text? The article walks through tokenization, Byte Pair Encoding, next-token probabilities, inference, and how a base model behaves like a compressed memory of internet text.',
		category: 'LLMs',
		year: '2026',
		readTime: '6 min read',
		image:
			'https://media.licdn.com/dms/image/v2/D5612AQGYsNTCkokjlw/article-cover_image-shrink_720_1280/B56ZyNiUK0HQAI-/0/1771901110337?e=2147483647&t=CIXogbKmWYdzF3MP57winUZ8IXh5kpzA4gLWTsYInjU&v=beta',
		tags: ['LLMs', 'Tokenization', 'Inference'],
		url: 'https://www.linkedin.com/pulse/how-i-slowly-understood-whats-really-happening-inside-ramasahayam-fkluc',
	},
	{
		id: 2,
		title: 'Bedtime Story: How Text Became Magic',
		subtitle: 'A story-style introduction to how neural networks read text.',
		description:
			'I used a bedtime-story format to explain why neural networks cannot directly read words and why text must become numbers first. The article introduces tokens, vocabularies, encoding, and the strange little bridge between human language and machine-readable input.',
		category: 'AI Fundamentals',
		year: '2026',
		readTime: '6 min read',
		image:
			'https://media.licdn.com/dms/image/v2/D5612AQGca4PQv6RXrg/article-cover_image-shrink_720_1280/B56ZycpdU4KMAI-/0/1772154640131?e=2147483647&t=7YC1oYTMMq1jc1R6eGN1CVaUwnmk1Zp0Ayn-cDYpj9o&v=beta',
		tags: ['Tokenization', 'Neural Networks', 'Storytelling'],
		url: 'https://www.linkedin.com/pulse/bedtime-story-how-text-became-magic-sreekaranreddy-ramasahayam-usync',
	},
	{
		id: 3,
		title: 'Chapter 6: When Words Became Pieces',
		subtitle: 'The story of Byte Pair Encoding.',
		description:
			'This article explains Byte Pair Encoding through a story where characters, fragments, and frequent pairs slowly become a vocabulary. I wanted to show how BPE helps models handle unfamiliar words by breaking language into reusable pieces instead of memorizing every possible word.',
		category: 'NLP',
		year: '2026',
		readTime: '7 min read',
		image:
			'https://media.licdn.com/dms/image/v2/D5612AQEKBAFhR_42ig/article-cover_image-shrink_720_1280/B56Zy5y8XIIoAI-/0/1772643665877?e=2147483647&t=JYm1DAt8vGcyhQ54khU0jab8hv4nsqpdHfXQ3gjyLfE&v=beta',
		tags: ['BPE', 'Tokenization', 'NLP'],
		url: 'https://www.linkedin.com/pulse/chapter-6-when-words-became-pieces-story-byte-pair-ramasahayam-fongc',
	},
	{
		id: 4,
		title: 'The Space Between Words',
		subtitle: 'How embeddings and position help models understand context.',
		description:
			'I built this article around a simple misunderstanding between Arjun and Meera: “I need space.” From there, I explain input-target pairs, token embeddings, positional embeddings, and why the same word can mean different things depending on where it stands and what surrounds it.',
		category: 'LLM Internals',
		year: '2026',
		readTime: '8 min read',
		image:
			'https://media.licdn.com/dms/image/v2/D5612AQFNnWyXjnHJ_g/article-cover_image-shrink_720_1280/B56ZzPaVYAI0AI-/0/1773006313777?e=2147483647&t=G55wu-LQEiWbHpuYVU_Zp8poI1Qu6a-TMA6uSuj7Gv4&v=beta',
		tags: ['Embeddings', 'Context', 'Transformers'],
		url: 'https://www.linkedin.com/pulse/space-between-words-sreekaranreddy-ramasahayam-fbsgc',
	},
	{
		id: 5,
		title: 'The Night Before Attention Was Born',
		subtitle: 'A bedtime story about how machines learned to remember.',
		description:
			'I used a story between a father and a little girl to explain why attention became such an important idea in AI. The article starts with old encoder-decoder models, memory, vectors, and the problem that eventually made attention feel less like a feature and more like a rescue mission.',
		category: 'Attention',
		year: '2026',
		readTime: '10 min read',
		image:
			'https://media.licdn.com/dms/image/v2/D5612AQFMIzugdRzYvw/article-cover_image-shrink_720_1280/B56Zzo26WSH8AM-/0/1773433235807?e=2147483647&t=PTBjhg3R-6u0X_3N1oe8S1KxIwQ7-F8lcCkjixRT0BA&v=beta',
		tags: ['Attention', 'Transformers', 'Storytelling'],
		url: 'https://www.linkedin.com/pulse/night-before-attention-born-sreekaranreddy-ramasahayam-dsmxc',
	},
];