import { useState, useMemo } from 'react';
import { PRODUCTS_ENRICHED, getForecastData, getForecastMetrics } from '../data';
import KPICard from '../components/KPICard';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart
} from 'recharts';
import { Activity, Target, Percent } from 'lucide-react';

const fmt = n => (n == null ? '—' : n.toLocaleString());

export default function Forecast({ filters }) {
  const [selectedId, setSelectedId] = useState(1);

  const product = PRODUCTS_ENRICHED.find(p => p.id === selectedId);
  const chartData = useMemo(() => getForecastData(selectedId), [selectedId]);
  const metrics = useMemo(() => getForecastMetrics(selectedId), [selectedId]);

  // Seasonal: monthly seasonal index (normalize each month vs avg)
  const avg = product.avgMonthly || 1;
  const seasonalData = product.monthlySales.map((u, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    seasonal: Math.round((u / avg - 1) * 100 * 10) / 10,
    trend: Math.round(u * 10) / 10,
  }));

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto scrollbar-thin h-full">
      {/* Product Selector */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Product</label>
        <select
          value={selectedId}
          onChange={e => setSelectedId(Number(e.target.value))}
          className="text-sm border border-gray-200 rounded-md bg-white text-gray-700 py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-yellow-400 appearance-none"
          style={{ minWidth: 280 }}
        >
          {PRODUCTS_ENRICHED.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
          ))}
        </select>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          product.fsn === 'F' ? 'bg-green-100 text-green-700' :
          product.fsn === 'S' ? 'bg-amber-100 text-amber-700' :
          'bg-red-100 text-red-700'
        }`}>{product.fsn === 'F' ? 'Fast-Moving' : product.fsn === 'S' ? 'Slow-Moving' : 'Non-Moving'}</span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard label="RMSE" value={metrics.rmse} sub="Root Mean Square Error" icon={Activity} />
        <KPICard label="MAE" value={metrics.mae} sub="Mean Absolute Error" icon={Target} />
        <KPICard label="MAPE" value={`${metrics.mape}%`} sub="Mean Abs. Percentage Error" icon={Percent} />
      </div>

      {/* Forecast vs Actual Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Forecast vs. Actual — {product.name}</h2>
        <p className="text-xs text-gray-400 mb-3">Solid = actual sales · Dashed = forecast · Shaded band = 95% confidence interval</p>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
            <Tooltip
              formatter={(val, name) => [val == null ? '—' : val, name]}
              labelStyle={{ fontWeight: 600 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {/* Confidence band */}
            <Area dataKey="upper" stroke="none" fill="#3B82F6" fillOpacity={0.08} legendType="none" name="Upper bound" />
            <Area dataKey="lower" stroke="none" fill="#ffffff" fillOpacity={1} legendType="none" name="Lower bound" />
            <Line type="monotone" dataKey="actual" stroke="#1B2A4A" strokeWidth={2.5} dot={{ r: 3 }} name="Actual" connectNulls={false} />
            <Line type="monotone" dataKey="forecast" stroke="#F5A623" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Forecast" connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Seasonal Decomposition */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Seasonal Index — Deviation from Average Monthly Demand (%)</h2>
        <ResponsiveContainer width="100%" height={160}>
          <ComposedChart data={seasonalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#6b7280' }} />
            <Tooltip formatter={(v, n) => [`${v}${n === 'seasonal' ? '%' : ' units'}`, n === 'seasonal' ? 'Seasonal Index' : 'Actual Units']} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="seasonal" stroke="#F5A623" strokeWidth={2} dot={{ r: 3 }} name="Seasonal Index" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
