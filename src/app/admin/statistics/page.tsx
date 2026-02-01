"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import dynamic from "next/dynamic";
import type { PaymentsChartData } from "./PaymentCharts";

const PaymentCharts = dynamic(() => import("./PaymentCharts"), { ssr: false });

interface OverviewStats {
  users: number;
  vocabulary: number;
  sentences: number;
  flashcards: number;
  news: number;
  payments: number;
  vocabularyCategories: number;
  sentenceCategories: number;
}

const STAT_CARDS = [
  { key: "users", label: "Người dùng", icon: "👤", color: "blue" },
  { key: "vocabulary", label: "Từ vựng", icon: "📖", color: "emerald" },
  { key: "vocabularyCategories", label: "Danh mục từ vựng", icon: "📁", color: "teal" },
  { key: "sentences", label: "Câu", icon: "💬", color: "violet" },
  { key: "sentenceCategories", label: "Danh mục câu", icon: "📂", color: "purple" },
  { key: "flashcards", label: "Flashcard", icon: "🃏", color: "amber" },
  { key: "news", label: "Tin tức", icon: "📰", color: "rose" },
  { key: "payments", label: "Giao dịch", icon: "💰", color: "green" },
] as const;

const CARD_COLOR_CLASSES: Record<string, string> = {
  blue: "border-blue-200 bg-blue-50/80",
  emerald: "border-emerald-200 bg-emerald-50/80",
  teal: "border-teal-200 bg-teal-50/80",
  violet: "border-violet-200 bg-violet-50/80",
  purple: "border-purple-200 bg-purple-50/80",
  amber: "border-amber-200 bg-amber-50/80",
  rose: "border-rose-200 bg-rose-50/80",
  green: "border-green-200 bg-green-50/80",
};

export default function AdminStatistics() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [chartData, setChartData] = useState<PaymentsChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated" || !accessToken) {
      setLoading(false);
      setErrorMessage("Bạn cần đăng nhập với quyền quản trị.");
      return;
    }
    const fetchAll = async () => {
      try {
        setErrorMessage(null);
        const [overviewRes, chartRes] = await Promise.all([
          apiFetch<OverviewStats>("/admin/stats", { authToken: accessToken }),
          apiFetch<PaymentsChartData>("/admin/stats/payments-chart", { authToken: accessToken }),
        ]);
        setOverview(overviewRes ?? null);
        setChartData(chartRes ?? null);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
        setErrorMessage((error as Error)?.message ?? "Lỗi khi tải thống kê");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [status, accessToken]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (status !== "authenticated" || !accessToken) {
    return (
      <div className="bg-red-50 text-red-700 border border-red-200 rounded p-4">
        Bạn cần đăng nhập với quyền quản trị để xem trang thống kê.
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded p-4">
        Bạn không có quyền truy cập trang này.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-3xl">📊</span>
          Thống kê
        </h1>
        <p className="text-gray-600 mt-1">
          Tổng quan dữ liệu hệ thống và thống kê giao dịch
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-4">
          {errorMessage}
        </div>
      )}

      {/* Tổng quan theo hạng mục */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Tổng quan theo hạng mục
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ key, label, icon, color }) => (
            <div
              key={key}
              className={`border rounded p-4 shadow-sm ${CARD_COLOR_CLASSES[color] ?? ""}`}
            >
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <span>{icon}</span>
                {label}
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 tabular-nums">
                {overview?.[key] ?? 0}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Thống kê giao dịch - Biểu đồ (client-only để recharts render đúng) */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Thống kê giao dịch
        </h2>
        <PaymentCharts data={chartData} />
      </section>
    </div>
  );
}
