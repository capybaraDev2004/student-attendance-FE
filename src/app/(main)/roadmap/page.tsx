"use client";

import { useState } from "react";

// Component cho từng giai đoạn
interface RoadmapStageProps {
	stage: number;
	title: string;
	duration: string;
	description: string;
	goals: string[];
	content: {
		topic: string;
		vocabulary: string;
		grammar: string;
	}[];
	lessons: string[];
	color: string;
	icon: string;
}

function RoadmapStage({ stage, title, duration, description, goals, content, lessons, color, icon }: RoadmapStageProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const colorClasses = {
		emerald: "from-emerald-500 to-emerald-600 border-emerald-200 bg-emerald-50",
		blue: "from-blue-500 to-blue-600 border-blue-200 bg-blue-50", 
		amber: "from-amber-500 to-amber-600 border-amber-200 bg-amber-50",
		rose: "from-rose-500 to-rose-600 border-rose-200 bg-rose-50",
		indigo: "from-indigo-500 to-indigo-600 border-indigo-200 bg-indigo-50",
		teal: "from-teal-500 to-teal-600 border-teal-200 bg-teal-50"
	};

	const bgClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.emerald;

	// Mở/thu gọn khi bấm vào toàn bộ thẻ + hỗ trợ bàn phím
	const toggleExpand = () => setIsExpanded((v) => !v);
	const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// Hỗ trợ Enter/Space cho accessibility
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			toggleExpand();
		}
	};

	return (
		<div
			className={`roadmap-stage-card border-2 ${bgClass.split(' ')[1]} ${bgClass.split(' ')[2]} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer select-none`}
			onClick={toggleExpand}
			role="button"
			tabIndex={0}
			aria-expanded={isExpanded}
			onKeyDown={handleKey}
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-4">
					<div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${bgClass.split(' ')[0]} ${bgClass.split(' ')[1].replace('to-', 'to-')} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
						{icon}
					</div>
					<div>
						<h3 className="text-2xl font-bold text-slate-800 mb-1">
							Giai đoạn {stage}
						</h3>
						<p className="text-lg font-semibold text-slate-700">{title}</p>
						<span className="inline-block px-3 py-1 bg-white/70 rounded-full text-sm font-medium text-slate-600 mt-1">
							⏱️ {duration}
						</span>
					</div>
				</div>
				{/* Mũi tên hiển thị trạng thái, không cần click riêng */}
				<div className="p-2 rounded-xl transition-colors pointer-events-none">
					<svg 
						className={`w-6 h-6 text-slate-600 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
						fill="none" 
						stroke="currentColor" 
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</div>

			{/* Mô tả ngắn */}
			<p className="text-slate-700 mb-4 leading-relaxed">{description}</p>

			{/* Mục tiêu */}
			<div className="mb-4">
				<h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
					🎯 Mục tiêu:
				</h4>
				<ul className="space-y-1">
					{goals.map((goal, index) => (
						<li key={index} className="flex items-start gap-2 text-slate-700">
							<span className="text-emerald-600 font-bold">•</span>
							{goal}
						</li>
					))}
				</ul>
			</div>

			{/* Nội dung chi tiết (có thể thu gọn/mở rộng) */}
			{isExpanded && (
				<div className="space-y-6 mt-6 pt-6 border-t border-white/50">
					{/* Bảng nội dung học */}
					<div>
						<h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
							🧱 Nội dung học:
						</h4>
						<div className="overflow-x-auto">
							<table className="w-full bg-white/70 rounded-xl overflow-hidden shadow-sm">
								<thead className="bg-slate-100/70">
									<tr>
										<th className="px-4 py-3 text-left font-semibold text-slate-700">Chủ đề</th>
										<th className="px-4 py-3 text-left font-semibold text-slate-700">Từ vựng</th>
										<th className="px-4 py-3 text-left font-semibold text-slate-700">Ngữ pháp</th>
									</tr>
								</thead>
								<tbody>
									{content.map((item, index) => (
										<tr key={index} className="border-t border-slate-200/50">
											<td className="px-4 py-3 font-medium text-slate-800">{item.topic}</td>
											<td className="px-4 py-3 text-slate-700">{item.vocabulary}</td>
											<td className="px-4 py-3 text-slate-700">{item.grammar}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Bài học gợi ý */}
					<div>
						<h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
							📘 Bài học gợi ý:
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{lessons.map((lesson, index) => (
								<div key={index} className="bg-white/70 rounded-xl p-3 shadow-sm border border-white/50">
									<span className="text-slate-700">{lesson}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default function RoadmapPage() {
	const roadmapData = [
		{
			stage: 1,
			title: "Làm quen tiếng Trung & Pinyin",
			duration: "2–3 tuần",
			description: "Giai đoạn khởi đầu để làm quen với hệ thống phát âm và viết cơ bản của tiếng Trung.",
			goals: [
				"Biết phát âm chuẩn (4 thanh điệu)",
				"Nhận biết cấu trúc âm tiết, từ loại, cách viết cơ bản"
			],
			content: [
				{
					topic: "1️⃣ Pinyin",
					vocabulary: "a, o, e, i, u, ü + các tổ hợp",
					grammar: "mā, má, mǎ, mà"
				},
				{
					topic: "2️⃣ Thanh điệu", 
					vocabulary: "4 thanh + thanh nhẹ",
					grammar: "妈 mā – mẹ, 马 mǎ – ngựa"
				},
				{
					topic: "3️⃣ Viết chữ Hán",
					vocabulary: "Nét cơ bản, thứ tự viết", 
					grammar: "一 (ngang), 人 (người)"
				},
				{
					topic: "4️⃣ Câu chào cơ bản",
					vocabulary: "你好, 谢谢, 再见",
					grammar: ""
				},
				{
					topic: "5️⃣ Cấu trúc câu đơn giản",
					vocabulary: "S + V + O",
					grammar: "我爱你。你好吗？"
				}
			],
			lessons: [
				"[Bài 1] Giới thiệu tiếng Trung & thanh điệu",
				"[Bài 2] Học Pinyin (có âm thanh + ví dụ)",
				"[Bài 3] Viết nét cơ bản", 
				"[Bài 4] 10 câu chào hỏi đầu tiên"
			],
			color: "emerald",
			icon: "🌱"
		},
		{
			stage: 2,
			title: "HSK 1: Cơ bản giao tiếp",
			duration: "1–2 tháng",
			description: "Học từ vựng cơ bản và các cấu trúc câu đơn giản để có thể giao tiếp trong những tình huống hàng ngày.",
			goals: [
				"~150 từ thông dụng",
				"Hiểu câu cơ bản (chào hỏi, hỏi tên, tuổi, nghề, địa điểm)"
			],
			content: [
				{
					topic: "Giới thiệu bản thân",
					vocabulary: "我, 你, 他, 她, 名字, 老师",
					grammar: "你叫什么名字？"
				},
				{
					topic: "Số đếm & thời gian",
					vocabulary: "一, 二, 三, 星期, 年, 月, 日",
					grammar: "今天星期几？"
				},
				{
					topic: "Gia đình",
					vocabulary: "爸爸, 妈妈, 哥哥, 妹妹",
					grammar: "这是我妈妈。"
				},
				{
					topic: "Đồ vật, nơi chốn",
					vocabulary: "学校, 房间, 书, 桌子",
					grammar: "书在桌子上。"
				},
				{
					topic: "Thức ăn, đồ uống",
					vocabulary: "水, 饭, 茶, 苹果",
					grammar: "我喜欢喝茶。"
				},
				{
					topic: "Động từ cơ bản",
					vocabulary: "是, 有, 去, 来, 看",
					grammar: "我去学校。"
				}
			],
			lessons: [
				"15–20 bài theo chủ đề",
				"Từ vựng (chữ, Pinyin, nghĩa, audio, hình minh họa)",
				"Câu ví dụ thực tế",
				"Mini quiz (chọn nghĩa / nghe chọn chữ / điền trống)"
			],
			color: "blue",
			icon: "💙"
		},
		{
			stage: 3,
			title: "HSK 2: Mở rộng & Giao tiếp đời sống",
			duration: "2 tháng", 
			description: "Mở rộng vốn từ vựng và học các cấu trúc câu phức tạp hơn để giao tiếp trong nhiều tình huống đời sống.",
			goals: [
				"~300 từ",
				"Hiểu & nói câu dài hơn, nhiều động từ, trạng từ, miêu tả thời gian, nơi chốn"
			],
			content: [
				{
					topic: "Hoạt động hàng ngày",
					vocabulary: "起床, 工作, 睡觉",
					grammar: "我每天七点起床。"
				},
				{
					topic: "Mua sắm",
					vocabulary: "商店, 东西, 钱, 贵, 便宜",
					grammar: "这个多少钱？"
				},
				{
					topic: "Thời tiết",
					vocabulary: "天气, 热, 冷, 下雨",
					grammar: "今天下雨了。"
				},
				{
					topic: "Sở thích",
					vocabulary: "唱歌, 跳舞, 运动",
					grammar: "你喜欢运动吗？"
				},
				{
					topic: "Hỏi – trả lời phức tạp",
					vocabulary: "因为, 所以",
					grammar: "因为我忙，所以没去。"
				},
				{
					topic: "So sánh",
					vocabulary: "比, 更",
					grammar: "今天比昨天冷。"
				}
			],
			lessons: [
				"20–25 bài theo chủ đề",
				"Thêm 'Luyện nghe ngắn' (audio 5–10s, trắc nghiệm nội dung)",
				"Quiz từ vựng có timer",
				"Gợi ý: cho phép người học ghi âm phát âm & AI đánh giá"
			],
			color: "amber",
			icon: "💛"
		},
		{
			stage: 4,
			title: "HSK 3: Củng cố, phản xạ, hiểu văn bản ngắn",
			duration: "2–3 tháng",
			description: "Nâng cao khả năng hiểu và sử dụng tiếng Trung trong các tình huống phức tạp hơn.",
			goals: [
				"~600 từ, nắm rõ 30+ cấu trúc ngữ pháp",
				"Hiểu đoạn hội thoại / đoạn văn ngắn",
				"Giao tiếp cơ bản trong mọi tình huống"
			],
			content: [
				{
					topic: "Miêu tả người/vật",
					vocabulary: "比, 的, 得, 地",
					grammar: "她唱得很好。"
				},
				{
					topic: "Hỏi đường, địa điểm",
					vocabulary: "怎么去…？左边，右边",
					grammar: "你知道银行怎么去吗？"
				},
				{
					topic: "Sức khỏe, bệnh nhẹ",
					vocabulary: "医生, 身体, 疼",
					grammar: "你哪里不舒服？"
				},
				{
					topic: "Thời gian & kế hoạch",
					vocabulary: "以前, 以后, 正在",
					grammar: "下班以后我去超市。"
				},
				{
					topic: "Cảm xúc & ý kiến",
					vocabulary: "觉得, 希望, 认为",
					grammar: "我觉得学习汉语很有意思。"
				},
				{
					topic: "Kết nối câu",
					vocabulary: "如果…就…, 虽然…但是…",
					grammar: "虽然很忙，但是我很开心。"
				}
			],
			lessons: [
				"'Bài đọc ngắn' (100–150 từ), có câu hỏi kèm",
				"'Hội thoại có audio' (2 người nói, có phụ đề + dịch)",
				"Mini test tổng hợp (nghe – từ vựng – ngữ pháp – đọc)"
			],
			color: "rose",
			icon: "💚"
		},
		{
			stage: 5,
			title: "Ôn tập & luyện thi / hội thoại thực tế",
			duration: "1 tháng",
			description: "Củng cố kiến thức đã học và luyện tập các kỹ năng giao tiếp thực tế.",
			goals: [
				"Tự tin giao tiếp cơ bản",
				"Làm quen dạng bài thi HSK"
			],
			content: [
				{
					topic: "Tổng hợp ôn tập",
					vocabulary: "Từ vựng, cấu trúc ngữ pháp",
					grammar: "Luyện nghe – chọn đáp án"
				},
				{
					topic: "Chat hội thoại",
					vocabulary: "Giả lập (AI / bot)",
					grammar: "Viết lại đoạn ngắn bằng chữ Hán"
				}
			],
			lessons: [
				"Ôn tập tổng hợp từ vựng",
				"Luyện nghe với đáp án trắc nghiệm",
				"Chat bot AI để luyện hội thoại",
				"Bài tập viết đoạn văn ngắn"
			],
			color: "indigo",
			icon: "🧠"
		},
		{
			stage: 6,
			title: "Học nâng cao / chuyên đề mở rộng",
			duration: "Linh hoạt",
			description: "Các chuyên đề nâng cao và ứng dụng thực tế của tiếng Trung trong các lĩnh vực khác nhau.",
			goals: [
				"Ứng dụng tiếng Trung vào các lĩnh vực chuyên môn",
				"Nâng cao kỹ năng nghe, nói thông qua media"
			],
			content: [
				{
					topic: "Học qua phim / bài hát",
					vocabulary: "Từ vựng thông dụng trong media",
					grammar: "Cấu trúc câu tự nhiên"
				},
				{
					topic: "Từ vựng theo ngành nghề",
					vocabulary: "Du lịch, thương mại, IT",
					grammar: "Thuật ngữ chuyên môn"
				},
				{
					topic: "AI giảng viên ảo",
					vocabulary: "Hỏi ngữ pháp, luyện phát âm",
					grammar: "Tương tác thông minh"
				}
			],
			lessons: [
				"Chuyên đề 'Học qua phim / bài hát' 🎬",
				"'Học từ vựng theo ngành nghề'",
				"Tích hợp AI giảng viên ảo",
				"Luyện phát âm với AI"
			],
			color: "teal",
			icon: "🧩"
		}
	];

	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
			{/* Hero Section (đã giảm khoảng cách) */}
			<section className="section-lg pb-8">
				<div className="container text-center">
					<div className="animate-fade-in-up">
						<h1 className="hero-title mb-6">
							Lộ Trình Học Tiếng Trung
						</h1>
						<p className="text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
							Hành trình từ người mới bắt đầu đến thành thạo tiếng Trung với lộ trình học có hệ thống, 
							từ cơ bản đến nâng cao qua 6 giai đoạn rõ ràng.
						</p>
						
						{/* Stats (đã giảm margin dưới) */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-4">
							<div className="bg-white/70 rounded-2xl p-6 shadow-lg border border-emerald-200">
								<div className="text-3xl font-bold text-emerald-600 mb-2">6</div>
								<div className="text-slate-600">Giai đoạn</div>
							</div>
							<div className="bg-white/70 rounded-2xl p-6 shadow-lg border border-blue-200">
								<div className="text-3xl font-bold text-blue-600 mb-2">~600</div>
								<div className="text-slate-600">Từ vựng</div>
							</div>
							<div className="bg-white/70 rounded-2xl p-6 shadow-lg border border-amber-200">
								<div className="text-3xl font-bold text-amber-600 mb-2">8-12</div>
								<div className="text-slate-600">Tháng</div>
							</div>
							<div className="bg-white/70 rounded-2xl p-6 shadow-lg border border-rose-200">
								<div className="text-3xl font-bold text-rose-600 mb-2">HSK 3</div>
								<div className="text-slate-600">Trình độ</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Roadmap Stages (đã kéo sát hơn) */}
			<section className="section pb-4" style={{ marginTop: '-8rem' }}>
				<div className="container">
					<div className="space-y-8">
						{roadmapData.map((stage, index) => (
							<div key={stage.stage} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
								<RoadmapStage {...stage} />
							</div>
              
						))}
					</div>
				</div>
			</section>
		</main>
	);
}