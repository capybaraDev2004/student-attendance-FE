"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface PaymentsChartData {
  byStatus: { status: string; label: string; count: number; amount: number }[];
  byVipPackage: { package: string; label: string; count: number; amount: number }[];
  byMonth: { month: string; count: number; amount: number }[];
}

const CHART_COLORS = [
  "#059669", "#0d9488", "#0f766e", "#115e59",
  "#dc2626", "#ea580c", "#ca8a04", "#65a30d",
  "#2563eb", "#7c3aed", "#db2777",
];

export default function PaymentCharts({ data }: { data: PaymentsChartData | null }) {
  const byStatus = data?.byStatus ?? [];
  const byVipPackage = data?.byVipPackage ?? [];
  const byMonth = data?.byMonth ?? [];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded shadow-sm p-5 min-h-[18rem]">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Giao dịch theo trạng thái
          </h3>
          {byStatus.length > 0 ? (
            <div className="h-72 w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byStatus}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ label, percent }) =>
                      `${label} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {byStatus.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _name: string, props: { payload: { amount: number } }) => [
                      `${value} giao dịch — ${(props?.payload?.amount ?? 0).toLocaleString("vi-VN")} VNĐ`,
                      props?.payload?.label,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500 text-sm">
              Chưa có dữ liệu giao dịch
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded shadow-sm p-5 min-h-[18rem]">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Giao dịch theo gói VIP
          </h3>
          {byVipPackage.length > 0 ? (
            <div className="h-72 w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byVipPackage}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ label, percent }) =>
                      `${label} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {byVipPackage.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _name: string, props: { payload: { amount: number } }) => [
                      `${value} giao dịch — ${(props?.payload?.amount ?? 0).toLocaleString("vi-VN")} VNĐ`,
                      props?.payload?.label,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500 text-sm">
              Chưa có dữ liệu giao dịch
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-5 min-h-[22rem]">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Giao dịch theo tháng (12 tháng gần nhất)
        </h3>
        {byMonth.length > 0 ? (
          <div className="h-80 w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byMonth}
                margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => {
                    const s = String(v);
                    const [y, m] = s.split("-");
                    return m && y ? `${m}/${y.slice(2)}` : s;
                  }}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length || label == null) return null;
                    const d = payload[0]?.payload as { month: string; count: number; amount: number };
                    return (
                      <div className="bg-white border border-gray-200 rounded shadow-lg px-3 py-2 text-sm">
                        <p className="font-medium text-gray-800">Tháng {label}</p>
                        <p>Số giao dịch: {d?.count ?? 0}</p>
                        <p>Tổng tiền: {(d?.amount ?? 0).toLocaleString("vi-VN")} VNĐ</p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="count" name="Số giao dịch" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="amount" name="Tổng tiền (VNĐ)" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500 text-sm">
            Chưa có dữ liệu theo tháng
          </div>
        )}
      </div>
    </>
  );
}
