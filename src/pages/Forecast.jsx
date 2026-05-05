import { useState, useMemo } from 'react';
import { PRODUCTS_ENRICHED, getForecastData, getForecastMetrics } from '../data';
import {
  ComposedChart, LineChart, BarChart, Line, Area, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea
} from 'recharts';
import { TrendingUp, CheckCircle } from 'lucide-react';

const BAND_COLORS = {
  enrollment: 'rgba(16,185,129,0.08)',
  exam:       'rgba(245,158,11,0.08)',
  event:      'rgba(59,130,246,0.08)',
  break:      'rgba(107,114,128,0.08)',
};
const BAND_LABELS = {
  enrollment: 'Enrollment',
  exam:       'Exams',
  event:      'Event',
  break:      'Break',
};

export default function Forecast({ filters }) {
  const [selectedId, setSelectedId] = useState(1);

  const product = PRODUCTS_ENRICHED.find(p => p.id === selectedId);
  const chartData = useMemo(() => getForecastData(selectedId), [selectedId]);
  const metrics = useMemo(() => getForecastMetrics(selectedId), [selectedId]);
  const decompData = useMemo(() => chartData.filter(d => d.actual !== null), [chartData]);

  const calendarBands = useMemo(() => {
    const seen = new Set();
    return chartData
      .filter(d => d.calendar_flag && !seen.has(d.month) && seen.add(d.month))
      .map(d => ({
        month: d.month,
        fill: BAND_COLORS[d.calendar_flag],
        label: BAND_LABELS[d.calendar_flag],
      }));
  }, [chartData]);

  const isNonMoving = product.fsn_class === 'N';

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto scrollbar-thin h-full">
      {/* Product Selector */}
      <div className="flex items-center gap-3 flex-wrap">
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
          product.fsn_class === 'F' ? 'bg-green-100 text-green-700' :
          product.fsn_class === 'S' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
        }`}>
          {product.fsn_class === 'F' ? 'Fast-Moving' : product.fsn_class === 'S' ? 'Slow-Moving' : 'Non-Moving'}
        </span>
        {product.is_hvl && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-300">
            HVL
          </span>
        )}
      </div>

      {/* Metric Cards — Prophet vs Naive */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'MAPE', prophet: `${metrics.prophet.mape}%`, naive: `${metrics.naive.mape}%`, unit: '' },
          { label: 'MAE',  prophet: `${metrics.prophet.mae}`, naive: `${metrics.naive.mae}`, unit: ' units' },
          { label: 'RMSE', prophet: `${metrics.prophet.rmse}`, naive: `${metrics.naive.rmse}`, unit: ' units' },
        ].map(({ label, prophet, naive, unit }) => (
          <div key={label} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{label}</div>
            <div className="text-2xl font-bold leading-tight" style={{ color: '#1B2A4A' }}>
              {prophet}{unit}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-green-600">Prophet</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              vs. <span className="font-semibold text-gray-500">{naive}{unit}</span> Naive baseline
            </div>
          </div>
        ))}
      </div>

      {isNonMoving && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-xs text-amber-700">
          <span className="font-semibold">Limited data note:</span> This item is classified as Non-Moving (low ADUS). MAE is used as the primary accuracy metric for low-volume items; MAPE may be inflated by near-zero denominators.
        </div>
      )}

      {/* Forecast vs Actual Chart */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
          Prophet Forecast vs. Actual — {product.name}
        </h2>
        <p className="text-xs text-gray-400 mb-1">
          Solid navy = actual · Dashed gold = Prophet forecast · Dotted gray = naive baseline · Shaded = 95% MCMC confidence interval
        </p>
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          {[
            { color: 'rgba(16,185,129,0.3)', label: 'Enrollment' },
            { color: 'rgba(245,158,11,0.3)', label: 'Exams' },
            { color: 'rgba(59,130,246,0.3)',  label: 'Event' },
            { color: 'rgba(107,114,128,0.3)', label: 'Break' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
            <Tooltip formatter={(val, name) => [val == null ? '—' : val, name]} labelStyle={{ fontWeight: 600 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />

            {/* Calendar event bands */}
            {calendarBands.map((band, i) => (
              <ReferenceArea
                key={i}
                x1={band.month}
                x2={band.month}
                fill={band.fill}
                fillOpacity={1}
                label={{ value: band.label, position: 'insideTop', fontSize: 8, fill: 'rgba(80,80,80,0.55)' }}
              />
            ))}

            {/* MCMC Confidence band */}
            <Area dataKey="prophet_upper" stroke="none" fill="#3B82F6" fillOpacity={0.12} legendType="none" name="Upper bound" />
            <Area dataKey="prophet_lower" stroke="none" fill="#ffffff" fillOpacity={1}    legendType="none" name="Lower bound" />

            <Line type="monotone" dataKey="actual"           stroke="#1B2A4A"  strokeWidth={2.5} dot={{ r: 3 }} name="Actual"           connectNulls={false} />
            <Line type="monotone" dataKey="prophet_forecast" stroke="#F5A623"  strokeWidth={2}   dot={false}   name="Prophet Forecast" connectNulls strokeDasharray="6 3" />
            <Line type="monotone" dataKey="naive_forecast"   stroke="#9CA3AF"  strokeWidth={1.5} dot={false}   name="Naive Baseline"   connectNulls strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Prophet Decomposition */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Prophet Model Decomposition</h2>
        <p className="text-xs text-gray-400 mb-4">Additive components: Trend + Seasonality + Academic Calendar Effects</p>
        <div className="grid grid-cols-1 gap-4">
          {/* Trend */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Trend Component</div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={decompData} margin={{ top: 4, right: 8, bottom: 0, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} width={38} />
                <Tooltip formatter={v => [v, 'Trend']} />
                <Line type="monotone" dataKey="trend" stroke="#1B2A4A" strokeWidth={2} dot={false} name="Trend" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Seasonal */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Monthly Seasonality Component (%)</div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={decompData} margin={{ top: 4, right: 8, bottom: 0, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 9, fill: '#9ca3af' }} width={38} />
                <Tooltip formatter={v => [`${v}%`, 'Seasonal Index']} />
                <Line type="monotone" dataKey="seasonal" stroke="#F5A623" strokeWidth={2} dot={false} name="Seasonal" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Event Effects */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">Academic Calendar Effects (units)</div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={decompData} margin={{ top: 4, right: 8, bottom: 0, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} width={38} />
                <Tooltip formatter={v => [v, 'Event Effect']} />
                <Bar dataKey="event_effect" name="Event Effect">
                  {decompData.map((entry, i) => (
                    <rect key={i} fill={entry.event_effect >= 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg">
        <TrendingUp size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          Forecasts generated by <span className="font-semibold">Prophet (Meta)</span> time-series model with academic calendar event regressors.
          Confidence intervals derived from MCMC posterior sampling (1,000 samples).
          Wider bands during Semestral Break reflect reduced historical data density.
        </p>
      </div>
    </div>
  );
}
