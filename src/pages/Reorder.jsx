import { useMemo } from 'react';
import { PRODUCTS_ENRICHED, filterProducts } from '../data';
import KPICard from '../components/KPICard';
import DataTable, { STATUS_BADGE, HVL_BADGE } from '../components/DataTable';
import {
  ComposedChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { AlertOctagon, AlertTriangle, Clock, Info } from 'lucide-react';

export default function Reorder({ filters }) {
  const products = useMemo(() => filterProducts(PRODUCTS_ENRICHED, filters), [filters]);

  const alertItems = useMemo(
    () => products.filter(p => p.status !== 'OK').sort((a, b) => (a.currentStock - a.rop) - (b.currentStock - b.rop)),
    [products]
  );
  const reorderNow = alertItems.filter(p => p.status === 'REORDER NOW').length;
  const approaching = alertItems.filter(p => p.status === 'APPROACHING').length;
  const avgDays = Math.round(products.reduce((s, p) => s + p.daysOfStock, 0) / (products.length || 1));

  const chartData = useMemo(() => {
    return [...products]
      .sort((a, b) => (a.currentStock - a.rop) - (b.currentStock - b.rop))
      .slice(0, 15)
      .map(p => ({
        name: p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name,
        stock: p.currentStock,
        rop: p.rop,
        status: p.status,
      }));
  }, [products]);

  const columns = [
    { key: 'name',     label: 'Product Name' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'currentStock', label: 'Current Stock', render: v => v.toLocaleString() },
    { key: 'rop',          label: 'ROP',           render: v => v.toLocaleString() },
    { key: 'safetyStock',  label: 'Safety Stock',  render: v => v.toLocaleString() },
    { key: 'eoq',          label: 'EOQ', render: v => v.toLocaleString() },
    {
      key: 'status', label: 'Status',
      render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[v]}`}>{v}</span>
          {row.is_hvl && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${HVL_BADGE}`}>HVL</span>}
        </div>
      ),
    },
    {
      key: 'prescriptive_advisory', label: 'Recommended Action',
      render: (v, row) => v ? (
        <span className={`text-xs ${row.is_hvl ? 'text-purple-700 font-semibold' : 'text-gray-600'}`}>{v}</span>
      ) : (
        <span className="text-xs text-gray-400">—</span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto scrollbar-thin h-full">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard label="Reorder Now"     value={reorderNow}  sub="Stock at or below ROP"    color={reorderNow  > 0 ? 'red'   : 'green'} icon={AlertOctagon} />
        <KPICard label="Approaching ROP" value={approaching} sub="Within 15% of ROP"        color={approaching > 0 ? 'amber' : 'green'} icon={AlertTriangle} />
        <KPICard label="Avg. Days of Stock" value={`${avgDays}d`} sub="Across all active SKUs" icon={Clock} />
      </div>

      {/* Formula Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-start gap-2 mb-3">
          <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">ROP / Safety Stock Formula</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <FormulaLine label="Reorder Point (ROP)" formula="(Prophet-Forecasted Daily Demand × Lead Time) + Safety Stock" />
            <FormulaLine label="Safety Stock" formula="Z × σ_demand × √Lead Time" />
            <FormulaLine label="EOQ" formula="√(2 × Annual Demand × Ordering Cost / Holding Cost)" />
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Param label="Z-score" value="1.65" note="95% service level" />
              <Param label="Lead Time" value="14 days" note="Uniform — all SKUs" />
            </div>
            <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
              <span className="font-semibold">Note:</span> Lead time is a generalized verbal estimate from USTore management applied uniformly across all active SKUs. Per-supplier lead times will be refined during Capstone 2 implementation.
            </div>
          </div>
        </div>
      </div>

      {/* Stock vs ROP Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
          Current Stock vs. Reorder Point — Top 15 Items (lowest buffer first)
        </h2>
        <p className="text-xs text-gray-400 mb-3">Red = below ROP · Amber = approaching · Navy = healthy · Gold lines = ROP threshold</p>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#374151' }} width={140} />
            <Tooltip formatter={(v, name) => [v.toLocaleString(), name === 'stock' ? 'Current Stock' : 'ROP']} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="stock" name="Current Stock" radius={[0, 3, 3, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.status === 'REORDER NOW' ? '#EF4444' : entry.status === 'APPROACHING' ? '#F59E0B' : '#1B2A4A'} />
              ))}
            </Bar>
            {chartData.map((entry, i) => (
              <ReferenceLine key={i} x={entry.rop} stroke="#F5A623" strokeWidth={1} isFront />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Alert Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Items Requiring Action</h2>
          <span className="text-xs text-gray-400">{alertItems.length} items</span>
        </div>
        {alertItems.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">No items currently require reordering.</div>
        ) : (
          <DataTable columns={columns} data={alertItems} />
        )}
      </div>
    </div>
  );
}

function FormulaLine({ label, formula }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-600">{label}</div>
      <div className="text-xs font-mono text-gray-800 bg-gray-50 rounded px-2 py-1 mt-0.5">{formula}</div>
    </div>
  );
}

function Param({ label, value, note }) {
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-400">{note}</div>
    </div>
  );
}
