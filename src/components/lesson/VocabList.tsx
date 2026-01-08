import VocabCard from "./VocabCard";

type Vocab = {
	vocab_id: number;
	chinese_word: string;
	pinyin: string;
	meaning_vn: string;
	audio_url?: string | null;
	example_sentence?: string | null;
};

export default function VocabList({ items }: { items: Vocab[] }) {
	return (
		<section className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{items.map((v) => (
				<VocabCard
					key={v.vocab_id}
					chinese={v.chinese_word}
					pinyin={v.pinyin}
					meaning={v.meaning_vn}
					audioUrl={v.audio_url ?? undefined}
					example={v.example_sentence ?? undefined}
				/>
			))}
		</section>
	);
}


