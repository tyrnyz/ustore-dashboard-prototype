import { useMemo } from 'react';
import { PRODUCTS_ENRICHED, filterProducts, getParetoData } from '../data';
import KPICard from '../components/KPICard';
import DataTable, { FSN_BADGE } from '../components/DataTable';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Zap, Clock, XCircle } from 'lucide-react';

const fmt = n => `₱${n.toLocaleString()}`;

export default function Classification({ filters }) {
  const products = useMemo(() => filterProducts(PRODUCTS_ENRICHED, filters), [filters]);

  const fsnCounts = useMemo(() => {
    const c = { F: 0, S: 0, N: 0 };
    products.forEach(p => { c[p.fsn]++; });
    return c;
  }, [products]);
  const total = products.length || 1;

  const paretoData = useMemo(() => getParetoData(), []);

  const columns = [
    { key: 'name',       label: 'Product Name' },
    { key: 'category',   label: 'Category' },
    { key: 'supplier',   label: 'Supplier' },
    { key: 'totalUnits', label: 'Units Sold', render: v => v.toLocaleString() },
    { key: 'avgMonthly', label: 'Avg/Month',  render: v => v.toFixed(1) },
    { key: 'cv',         label: 'CV%',        render: v => `${v.toFixed(1)}%` },
    {
      key: 'fsn', label: 'FSN Class',
      render: v => (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${FSN_BADGE[v]}`}>
          {v === 'F' ? 'Fast' : v === 'S' ? 'Slow' : 'Non-Moving'}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto scrollbar-thin h-full">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard label="Fast-Moving (F)" value={fsnCounts.F} sub={`${Math.round(fsnCounts.F / total * 100)}% of SKUs · High turnover`} color="green" icon={Zap} />
        <KPICard label="Slow-Moving (S)" value={fsnCounts.S} sub={`${Math.round(fsnCounts.S / total * 100)}% of SKUs · Monitor stock`} color="amber" icon={Clock} />
        <KPICard label="Non-Moving (N)"  value={fsnCounts.N} sub={`${Math.round(fsnCounts.N / total * 100)}% of SKUs · Review/discontinue`} color="red" icon={XCircle} />
      </div>

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
            <Tooltip
              formatter={(v, name) => [
                name === 'Cumulative %' ? `${v}%` : fmt(v),
                name
              ]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} verticalAlign="top" />
            <Bar yAxisId="left" dataKey="revenue" fill="#1B2A4A" radius={[2, 2, 0, 0]} name="Revenue" />
            <ReferenceLine yAxisId="right" y={80} stroke="#F5A623" strokeDasharray="4 2" label={{ value: '80%', position: 'right', fontSize: 10, fill: '#F5A623' }} />
            <Line yAxisId="right" type="monotone" dataKey="cumPct" stroke="#F5A623" strokeWidth={2} dot={false} name="Cumulative %" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">FSN Classification — Full Item List</h2>
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
}
