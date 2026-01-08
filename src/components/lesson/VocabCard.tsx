"use client";

type Props = {
	chinese: string;
	pinyin: string;
	meaning: string;
	audioUrl?: string;
	example?: string;
};

export default function VocabCard({ chinese, pinyin, meaning, audioUrl, example }: Props) {
	const playAudio = () => {
		// Phát audio nếu có
		if (!audioUrl) return;
		const audio = new Audio(audioUrl);
		audio.play().catch(() => {});
	};

	return (
		<div className="rounded-lg border bg-white p-4 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="text-2xl font-semibold">{chinese}</div>
					<div className="text-sm text-gray-500">{pinyin}</div>
					<div className="mt-1 text-gray-800">{meaning}</div>
					{example && <div className="mt-2 text-sm text-gray-600">Ví dụ: {example}</div>}
				</div>
				{audioUrl && (
					<button onClick={playAudio} className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700">Nghe</button>
				)}
			</div>
		</div>
	);
}


