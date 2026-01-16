"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import { apiFetch } from "@/lib/api";

type StatCardProps = {
  title: string;
  value: string;
  accent: "sky" | "teal" | "emerald" | "amber";
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  hint?: string;
};

function formatTodayDDMMYYYY(date: Date): string {
  // Định dạng ngày dd/mm/yyyy
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/* ========== ICONS (không dùng màu tím) ========== */
const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 2c.5 3-1.5 4.5-2.5 6-1 1.5-.5 3.5 1.5 4 0-1 1-2 2-2.5.5 2 .5 3.5-.5 5 2-.5 4-2.5 4-5 0-3-2-5-4.5-7.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 13.5c-1.5 3.5.5 7 5.5 7s7-3.5 5.5-7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LightningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const CheckBadgeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 2l2.3 3.9L19 7l-3 3 .7 4.9L12 13l-4.7 1.9L8 10 5 7l4.7-.9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9.5 10.5l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BookmarksIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M6 3h8a3 3 0 013 3v13l-7-3-7 3V6a3 3 0 013-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

/* Icons cho hoạt động */
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 12.5l2.5 2.5L16 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M20 12a8 8 0 10-2.34 5.66" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M20 8v4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M3 6.5a2.5 2.5 0 012.5-2.5H12v15H5.5A2.5 2.5 0 013 16.5v-10Z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M21 6.5A2.5 2.5 0 0018.5 4H12v15h6.5A2.5 2.5 0 0021 16.5v-10Z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/* ========== COMPONENTS ========== */
function StatCard({ title, value, accent, Icon, hint }: StatCardProps) {
  // Map màu nhấn theo accent (tránh tím)
  const accentClass =
    accent === "sky"
      ? "bg-sky-50 text-sky-600 border-sky-200"
      : accent === "teal"
      ? "bg-teal-50 text-teal-600 border-teal-200"
      : accent === "emerald"
      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
      : "bg-amber-50 text-amber-600 border-amber-200";

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold mb-1">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
            {hint ? <p className="muted mt-1">{hint}</p> : null}
          </div>
          <div className={`shrink-0 border rounded-xl ${accentClass}`} style={{ padding: 10 }} aria-hidden>
            <Icon width={28} height={28} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  // Clamp giá trị để không vượt 0-100
  const safePercent = Math.max(0, Math.min(100, percent));
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${safePercent}%` }} />
      </div>
      <div className="text-right text-sm text-gray-600 mt-1">{safePercent}% hoàn thành</div>
    </div>
  );
}

/* Item hoạt động với layout hai dòng + icon + badge thời gian */
type Activity = { label: string; time: string; kind: "complete" | "review" | "lesson" };

function activityPreset(kind: Activity["kind"]) {
  // Chọn màu nền/viền theo loại hoạt động
  switch (kind) {
    case "complete":
      return { ring: "ring-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" };
    case "review":
      return { ring: "ring-amber-200", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
    default:
      return { ring: "ring-sky-200", bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" };
  }
}

function ActivityIcon({ kind }: { kind: Activity["kind"] }) {
  const size = 22;
  if (kind === "complete") return <CheckCircleIcon width={size} height={size} />;
  if (kind === "review") return <RefreshIcon width={size} height={size} />;
  return <BookOpenIcon width={size} height={size} />;
}

function splitTitleSubtitle(raw: string) {
  // Tách "Tiêu đề - Phụ đề" thành 2 dòng; nếu không có " - " thì để nguyên
  const parts = raw.split(" - ");
  if (parts.length >= 2) {
    return { title: parts[0], subtitle: parts.slice(1).join(" - ") };
  }
  return { title: raw, subtitle: "" };
}

function RecentActivityItem({ item }: { item: Activity }) {
  const preset = activityPreset(item.kind);
  const { title, subtitle } = splitTitleSubtitle(item.label);

  return (
    <li
      className={`flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 transition hover:shadow-sm hover:border-gray-200`}
    >
      <div
        className={`relative shrink-0 rounded-xl ${preset.bg} ${preset.ring} ring-1`}
        style={{ width: 44, height: 44, display: "grid", placeItems: "center" }}
      >
        <div className={`${preset.text}`}>
          <ActivityIcon kind={item.kind} />
        </div>
        <span className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${preset.dot}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-gray-900 font-medium truncate">{title}</div>
        {subtitle ? <div className="text-gray-600 text-sm truncate">{subtitle}</div> : null}
      </div>

      <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
        {item.time}
      </span>
    </li>
  );
}

/* ========== PAGE ========== */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState<{
    streakDays: number;
    hasToday: boolean;
    lastActiveDate: string | null;
  } | null>(null);

  const [todayTasks, setTodayTasks] = useState<{
    vocabulary_count: number;
    sentence_count: number;
    contest_completed: boolean;
  } | null>(null);

  const today = useMemo(() => formatTodayDDMMYYYY(new Date()), []);

  // Load dữ liệu thật từ API
  useEffect(() => {
    if (status !== "authenticated" || !accessToken) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const [streakRes, tasksRes] = await Promise.all([
          apiFetch<{
            streakDays: number;
            hasToday: boolean;
            lastActiveDate: string | null;
          }>("/contest-progress/streak", {
            authToken: accessToken,
          }),
          apiFetch<{
            vocabulary_count: number;
            sentence_count: number;
            contest_completed: boolean;
          }>("/daily-tasks/today", {
            authToken: accessToken,
          }),
        ]);

        if (cancelled) return;
        setStreak(streakRes);
        setTodayTasks(tasksRes);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.error("Không tải được dữ liệu dashboard:", error);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [status, accessToken]);

  const stats = useMemo(() => {
    const streakDays = streak?.streakDays ?? 0;
    const vocabToday = todayTasks?.vocabulary_count ?? 0;
    const sentenceToday = todayTasks?.sentence_count ?? 0;
    const contestCompleted = todayTasks?.contest_completed ?? false;

    // Tính % hoàn thành mục tiêu trong ngày: 10 từ + 5 câu + 1 bài test
    const vocabRatio = Math.min(1, vocabToday / 10);
    const sentenceRatio = Math.min(1, sentenceToday / 5);
    const testRatio = contestCompleted ? 1 : 0;
    const weeklyGoalPercent = Math.round(((vocabRatio + sentenceRatio + testRatio) / 3) * 100);

    return {
      streakDays,
      vocabToday,
      sentenceToday,
      weeklyGoalPercent,
    };
  }, [streak, todayTasks]);

  // Hoạt động gần đây sinh động hơn dựa trên dữ liệu thật
  const recentActivities: Activity[] = useMemo(() => {
    const items: Activity[] = [];

    if (todayTasks?.contest_completed) {
      items.push({
        label: "Hoàn thành bài luyện tập hôm nay",
        time: "Hôm nay",
        kind: "complete",
      });
    }

    if ((todayTasks?.vocabulary_count ?? 0) > 0) {
      items.push({
        label: `Đã học ${todayTasks!.vocabulary_count}/10 từ vựng mục tiêu ngày`,
        time: "Hôm nay",
        kind: "review",
      });
    }

    if ((todayTasks?.sentence_count ?? 0) > 0) {
      items.push({
        label: `Đã luyện ${todayTasks!.sentence_count}/5 câu nói hôm nay`,
        time: "Hôm nay",
        kind: "lesson",
      });
    }

    if ((streak?.streakDays ?? 0) > 0) {
      items.push({
        label: `Chuỗi học liên tục ${streak!.streakDays} ngày`,
        time: streak?.hasToday ? "Đến hôm nay" : "Gần đây",
        kind: "complete",
      });
    }

    if (items.length === 0) {
      items.push({
        label: "Bắt đầu bài học đầu tiên của bạn",
        time: "Hôm nay",
        kind: "lesson",
      });
    }

    return items;
  }, [todayTasks, streak]);

  return (
    <section className="section">
      <div className="container">
        {/* Header chào mừng */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="section-title">Dashboard</h1>
              <p className="section-subtitle">Tổng quan tiến độ học tập của bạn — {today}</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="px-3 py-2 rounded-lg border bg-white text-gray-700">Mục tiêu tuần</div>
              <div className="px-3 py-2 rounded-lg border bg-white text-gray-700">Chế độ tập trung</div>
            </div>
          </div>
        </div>

        {/* Lưới thống kê nhanh */}
        <div className="grid-responsive">
          <StatCard
            title="Chuỗi ngày học"
            value={`${stats.streakDays} ngày`}
            hint={stats.streakDays > 0 ? "Tiếp tục duy trì nhé!" : "Làm 1 bài hôm nay để mở streak"}
            accent="amber"
            Icon={FireIcon}
          />
          <StatCard
            title="Từ vựng hôm nay"
            value={`${stats.vocabToday}/10 từ`}
            hint="Mục tiêu mỗi ngày: 10 từ mới"
            accent="emerald"
            Icon={BookmarksIcon}
          />
          <StatCard
            title="Câu nói hôm nay"
            value={`${stats.sentenceToday}/5 câu`}
            hint="Luyện nói đều để phản xạ tốt hơn"
            accent="sky"
            Icon={BookOpenIcon}
          />
          <StatCard
            title="Hoàn thành mục tiêu ngày"
            value={`${stats.weeklyGoalPercent}%`}
            hint="Dựa trên từ vựng, câu nói và bài luyện tập hôm nay"
            accent="teal"
            Icon={LightningIcon}
          />
        </div>

        {/* Khu vực tiến độ tuần */}
        <div className="grid-responsive" style={{ marginTop: 16 }}>
          <div className="card">
            <div className="card-body">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tiến độ mục tiêu ngày</h3>
                  <p className="muted mb-3">
                    Hoàn thành 10 từ vựng, 5 câu nói và 1 bài luyện tập để đạt 100% mục tiêu ngày hôm nay.
                  </p>
                </div>
              </div>
              <ProgressBar percent={stats.weeklyGoalPercent} />
            </div>
          </div>
        </div>

        {/* Hoạt động gần đây - khối rộng hơn, to và nổi bật */}
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-body">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-sky-100 text-sky-600 grid place-items-center border border-sky-200">
                  <RefreshIcon width={18} height={18} />
                </div>
                <h3 className="text-lg font-semibold">Hoạt động gần đây</h3>
              </div>
            </div>

            {/* Layout 2 cột trên màn hình lớn để “rộng hơn”, đồng thời mỗi item to hơn */}
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recentActivities.map((item, idx) => (
                <RecentActivityItem key={idx} item={item} />
              ))}
            </ul>
          </div>
        </div>

        {/* Gợi ý tiếp theo */}
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-body">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold mb-1">Gợi ý tiếp theo</h3>
                <p className="muted">Bắt đầu bài: Thanh điệu nâng cao — tập trung vào thanh 3 và 4</p>
              </div>
              <Link
                href="/capychina"
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition inline-block text-center"
              >
                Bắt đầu học
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}