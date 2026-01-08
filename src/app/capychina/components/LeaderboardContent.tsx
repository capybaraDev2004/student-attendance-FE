import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type LeaderboardScope = "country" | "region" | "province";

type LeaderboardEntry = {
  rank: number;
  user_id: number;
  name: string;
  avatar_url: string | null;
  region: string | null;
  province: string | null;
  xp: number;
};

export default function LeaderboardContent() {
  const { data: session } = useSession();
  const rawRegion =
    (session as any)?.user?.region ?? (session as any)?.region ?? null;
  const rawProvince =
    (session as any)?.user?.province ?? (session as any)?.province ?? null;

  const regionLabel =
    rawRegion === "bac"
      ? "Miền Bắc"
      : rawRegion === "trung"
      ? "Miền Trung"
      : rawRegion === "nam"
      ? "Miền Nam"
      : null;

  const scopeOptions: { key: LeaderboardScope; label: string }[] = [
    { key: "country", label: "Việt Nam" },
    { key: "region", label: regionLabel ?? "Theo miền" },
    { key: "province", label: rawProvince ?? "Theo tỉnh" },
  ];

  const [scope, setScope] = useState<LeaderboardScope>("country");
  const [items, setItems] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE}/leaderboard?scope=${scope}${
            scope === "region" && rawRegion ? `&region=${encodeURIComponent(rawRegion)}` : ""
          }${
            scope === "province" && rawProvince ? `&province=${encodeURIComponent(rawProvince)}` : ""
          }`
        );
        if (!res.ok) {
          const text = await res.text();
          console.error("Lỗi load leaderboard:", res.status, text);
          setError("Không tải được bảng xếp hạng. Vui lòng thử lại sau.");
          return;
        }
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Lỗi gọi API leaderboard:", e);
        setError("Không tải được bảng xếp hạng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scope, rawRegion, rawProvince]);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-xl">
      <h2 className="text-3xl font-bold text-slate-900">Bảng xếp hạng CapyChina</h2>
      <p className="mt-2 text-base text-slate-600">
        Theo dõi điểm XP và chuỗi ngày học của bạn bè để có động lực duy trì nhịp học.
      </p>

      {/* Tabs phạm vi */}
      <div className="mt-6 inline-flex rounded-full bg-slate-100 p-1">
        {scopeOptions.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setScope(opt.key)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              scope === opt.key
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Nội dung bảng xếp hạng */}
      <div className="mt-6 space-y-4">
        {loading && (
          <div className="py-8 text-center text-slate-500">
            Đang tải bảng xếp hạng...
          </div>
        )}

        {!loading && error && (
          <div className="py-4 text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="py-8 text-center text-slate-500">
            Chưa có dữ liệu bảng xếp hạng.
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            {items.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-semibold text-sm">
                    {user.rank}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {user.name}
                    </p>
                    {user.province && (
                      <p className="text-xs text-slate-500">
                        {user.province}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-lg font-bold text-emerald-700">
                  {user.xp} XP
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
