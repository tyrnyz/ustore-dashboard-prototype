import { useMemo } from 'react';
import { PRODUCTS_ENRICHED, filterProducts } from '../data';
import KPICard from '../components/KPICard';
import DataTable, { STATUS_BADGE } from '../components/DataTable';
import {
  ComposedChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { AlertOctagon, AlertTriangle, Clock } from 'lucide-react';

const fmt = n => `₱${n.toLocaleString()}`;

export default function Reorder({ filters }) {
  const products = useMemo(() => filterProducts(PRODUCTS_ENRICHED, filters), [filters]);

  const alertItems = useMemo(
    () => products.filter(p => p.status !== 'OK').sort((a, b) => a.currentStock - a.rop - (b.currentStock - b.rop)),
    [products]
  );
  const reorderNow = alertItems.filter(p => p.status === 'REORDER NOW').length;
  const approaching = alertItems.filter(p => p.status === 'APPROACHING').length;
  const avgDays = Math.round(products.reduce((s, p) => s + p.daysOfStock, 0) / (products.length || 1));

  // Chart: all products sorted by stock-vs-rop gap
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
    { key: 'eoq',          label: 'Rec. Order Qty', render: v => v.toLocaleString() },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[v]}`}>{v}</span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto scrollbar-thin h-full">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard
          label="Reorder Now"
          value={reorderNow}
          sub="Stock at or below ROP"
          color={reorderNow > 0 ? 'red' : 'green'}
          icon={AlertOctagon}
        />
        <KPICard
          label="Approaching ROP"
          value={approaching}
          sub="Within 10% of ROP"
          color={approaching > 0 ? 'amber' : 'green'}
          icon={AlertTriangle}
        />
        <KPICard
          label="Avg. Days of Stock"
          value={`${avgDays}d`}
          sub="Across all active SKUs"
          icon={Clock}
        />
      </div>

      {/* Stock vs ROP Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Current Stock vs. Reorder Point — Top 15 Items (lowest buffer first)</h2>
        <p className="text-xs text-gray-400 mb-3">Red bars = stock below ROP · Amber = approaching · Navy = healthy</p>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#374151' }} width={140} />
            <Tooltip
              formatter={(v, name) => [v.toLocaleString(), name === 'stock' ? 'Current Stock' : 'ROP']}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="stock" name="Current Stock" radius={[0, 3, 3, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.status === 'REORDER NOW' ? '#EF4444' : entry.status === 'APPROACHING' ? '#F59E0B' : '#1B2A4A'}
                />
              ))}
            </Bar>
            {chartData.map((entry, i) => (
              <ReferenceLine key={i} x={entry.rop} stroke="#F5A623" strokeDasharray="0" strokeWidth={1} isFront />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-1">Note: ROP markers (gold lines) shown per item; items are sorted so lowest relative buffer appears first.</p>
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
