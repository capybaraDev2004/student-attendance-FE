type Props = {
	 title: string;
	 level?: string;
	 description?: string;
};

export default function LessonHeader({ title, level, description }: Props) {
	return (
		<section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
			<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-2xl font-semibold">{title}</h1>
					{description && <p className="text-gray-600">{description}</p>}
				</div>
				{level && <span className="inline-flex h-8 items-center rounded-md bg-green-50 px-3 text-sm text-green-700">Cấp độ: {level}</span>}
			</div>
		</section>
	);
}


