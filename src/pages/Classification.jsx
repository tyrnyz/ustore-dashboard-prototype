import { useMemo } from 'react';
import { PRODUCTS, PRODUCTS_ENRICHED, filterProducts, getParetoData, getThresholdSensitivity } from '../data';
import KPICard from '../components/KPICard';
import DataTable, { FSN_BADGE, HVL_BADGE } from '../components/DataTable';
import {
  ComposedChart, Bar, BarChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Zap, Clock, XCircle } from 'lucide-react';

const fmt = n => `₱${n.toLocaleString()}`;

export default function Classification({ filters }) {
  const products = useMemo(() => filterProducts(PRODUCTS_ENRICHED, filters), [filters]);

  const fsnCounts = useMemo(() => {
    const c = { F: 0, S: 0, N: 0 };
    products.forEach(p => { c[p.fsn_class]++; });
    return c;
  }, [products]);
  const hvlCount = useMemo(() => products.filter(p => p.is_hvl).length, [products]);
  const total = products.length || 1;

  const paretoData = useMemo(() => getParetoData(), []);
  const sensitivity = useMemo(() => getThresholdSensitivity(PRODUCTS), []);

  const sensitivityTableData = [
    { label: 'Fast (F)',  p75: sensitivity.p75.F, p80: sensitivity.p80.F, p85: sensitivity.p85.F },
    { label: 'Slow (S)', p75: sensitivity.p75.S, p80: sensitivity.p80.S, p85: sensitivity.p85.S },
    { label: 'Non (N)',  p75: sensitivity.p75.N, p80: sensitivity.p80.N, p85: sensitivity.p85.N },
  ];
  const sensChartData = [
    { name: 'p75', cutoff: `p75 (>${sensitivity.p75.cutoff})`, F: sensitivity.p75.F, S: sensitivity.p75.S, N: sensitivity.p75.N },
    { name: 'p80', cutoff: `p80 (>${sensitivity.p80.cutoff}) ★`, F: sensitivity.p80.F, S: sensitivity.p80.S, N: sensitivity.p80.N },
    { name: 'p85', cutoff: `p85 (>${sensitivity.p85.cutoff})`, F: sensitivity.p85.F, S: sensitivity.p85.S, N: sensitivity.p85.N },
  ];

  const columns = [
    { key: 'name',       label: 'Product Name' },
    { key: 'category',   label: 'Category' },
    { key: 'supplier',   label: 'Supplier' },
    { key: 'totalUnits', label: 'Units Sold', render: v => v.toLocaleString() },
    { key: 'avgMonthly', label: 'Avg/Month',  render: v => v.toFixed(1) },
    { key: 'adus',       label: 'ADUS ↑',     render: v => v.toFixed(3) },
    { key: 'cv',         label: 'CV%',        render: v => `${v.toFixed(1)}%` },
    {
      key: 'fsn_class', label: 'FSN Class',
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${FSN_BADGE[v]}`}>
            {v === 'F' ? 'Fast' : v === 'S' ? 'Slow' : 'Non-Moving'}
          </span>
          {row.is_hvl && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${HVL_BADGE}`}>
              HVL
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto scrollbar-thin h-full">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard
          label="Fast-Moving (F)"
          value={fsnCounts.F}
          sub={`${Math.round(fsnCounts.F / total * 100)}% of SKUs${hvlCount > 0 ? ` · Includes ${hvlCount} HVL item${hvlCount > 1 ? 's' : ''}` : ' · High turnover'}`}
          color="green"
          icon={Zap}
        />
        <KPICard label="Slow-Moving (S)" value={fsnCounts.S} sub={`${Math.round(fsnCounts.S / total * 100)}% of SKUs · Monitor stock`} color="amber" icon={Clock} />
        <KPICard label="Non-Moving (N)"  value={fsnCounts.N} sub={`${Math.round(fsnCounts.N / total * 100)}% of SKUs · Review/discontinue`} color="red" icon={XCircle} />
      </div>

      {/* HVL Info Banner */}
      {hvlCount > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 flex items-start gap-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${HVL_BADGE} flex-shrink-0 mt-0.5`}>HVL</span>
          <div className="text-xs text-purple-700">
            <span className="font-semibold">High-Velocity Limited</span> — {hvlCount} item{hvlCount > 1 ? 's' : ''} sold more than 80% of initial consignment stock within the first 14 days of entry. These items are classified as Fast-Moving regardless of ADUS percentile rank. Standard reorder does not apply — see Reorder Alerts for Strategic Re-run Advisories.
          </div>
        </div>
      )}

      {/* Pareto Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Pareto Chart — Revenue Contribution by Product</h2>
        <p className="text-xs text-gray-400 mb-3">Bars = individual revenue · Line = cumulative % of total revenue</p>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={paretoData} margin={{ left: 0, right: 30, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#6b7280' }} angle={-40} textAnchor="end" interval={0} />
            <YAxis yAxisId="left" tickFormatter={v => `₱${(v/1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: '#6b7280' }} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#6b7280' }} domain={[0, 100]} />
            <Tooltip formatter={(v, name) => [name === 'Cumulative %' ? `${v}%` : fmt(v), name]} />
            <Legend wrapperStyle={{ fontSize: 11 }} verticalAlign="top" />
            <Bar yAxisId="left" dataKey="revenue" fill="#1B2A4A" radius={[2, 2, 0, 0]} name="Revenue" />
            <ReferenceLine yAxisId="right" y={80} stroke="#F5A623" strokeDasharray="4 2" label={{ value: '80%', position: 'right', fontSize: 10, fill: '#F5A623' }} />
            <Line yAxisId="right" type="monotone" dataKey="cumPct" stroke="#F5A623" strokeWidth={2} dot={false} name="Cumulative %" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Threshold Sensitivity Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Threshold Sensitivity Analysis</h2>
        <p className="text-xs text-gray-400 mb-4">
          Classification counts at three ADUS percentile cutoffs — ★ marks the selected threshold (80th percentile).
          SKUs retaining the same classification across all three thresholds confirm boundary stability. Borderline items are flagged for manual review.
        </p>
        <div className="grid grid-cols-2 gap-6">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Class</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">75th pct</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-blue-600">80th pct ★</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">85th pct</th>
                </tr>
              </thead>
              <tbody>
                {sensitivityTableData.map(row => (
                  <tr key={row.label} className="border-b border-gray-100">
                    <td className="px-3 py-2 font-semibold text-gray-700">{row.label}</td>
                    <td className="px-3 py-2 text-center text-gray-600">{row.p75}</td>
                    <td className="px-3 py-2 text-center font-bold" style={{ color: '#1B2A4A', background: 'rgba(245,166,35,0.06)' }}>{row.p80}</td>
                    <td className="px-3 py-2 text-center text-gray-600">{row.p85}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 text-xs text-gray-400">ADUS cutoff</td>
                  <td className="px-3 py-2 text-center text-xs text-gray-400">{sensitivity.p75.cutoff}</td>
                  <td className="px-3 py-2 text-center text-xs text-gray-500 font-semibold">{sensitivity.p80.cutoff}</td>
                  <td className="px-3 py-2 text-center text-xs text-gray-400">{sensitivity.p85.cutoff}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Chart */}
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={sensChartData} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="cutoff" tick={{ fontSize: 9, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="F" fill="#10B981" name="Fast (F)" radius={[2,2,0,0]} />
              <Bar dataKey="S" fill="#F59E0B" name="Slow (S)" radius={[2,2,0,0]} />
              <Bar dataKey="N" fill="#EF4444" name="Non (N)"  radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">FSN Classification — Full Item List</h2>
          <span className="text-xs text-gray-400">ADUS = Average Daily Units Sold (classification driver)</span>
        </div>
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
}
