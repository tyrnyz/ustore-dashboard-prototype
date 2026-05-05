import { useMemo } from 'react';
import { PRODUCTS_ENRICHED, MONTHLY_REVENUE, filterProducts, filterRevenue, getCalendarInterpretations } from '../data';
import KPICard from '../components/KPICard';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DollarSign, Package, Tag, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const PIE_COLORS = ['#F5A623', '#1B2A4A', '#3B82F6', '#10B981', '#EF4444'];
const fmt = n => `₱${n.toLocaleString()}`;
const fmtK = n => n >= 1000000 ? `₱${(n / 1000000).toFixed(2)}M` : `₱${(n / 1000).toFixed(1)}K`;

const SEVERITY_STYLES = {
  high:     { border: 'border-l-4 border-red-500',   accent: 'text-red-600',   bg: 'bg-red-50',   badge: 'bg-red-100 text-red-700' },
  moderate: { border: 'border-l-4 border-amber-500', accent: 'text-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
  low:      { border: 'border-l-4 border-blue-400',  accent: 'text-blue-600',  bg: 'bg-blue-50',  badge: 'bg-blue-100 text-blue-700' },
};

export default function Overview({ filters }) {
  const products = useMemo(() => filterProducts(PRODUCTS_ENRICHED, filters), [filters]);
  const monthlyRev = useMemo(() => filterRevenue(MONTHLY_REVENUE, products, filters), [filters, products]);

  const totalRevenue = products.reduce((s, p) => s + p.totalRevenue, 0);
  const totalUnits = products.reduce((s, p) => s + p.totalUnits, 0);
  const activeSKUs = products.length;
  const reorderNow = products.filter(p => p.status === 'REORDER NOW').length;
  const approaching = products.filter(p => p.status === 'APPROACHING').length;
  const belowROP = reorderNow + approaching;

  const top10 = [...products].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10).map(p => ({
    name: p.name.length > 22 ? p.name.slice(0, 20) + '…' : p.name,
    revenue: p.totalRevenue,
  }));

  const catMap = {};
  products.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + p.totalRevenue; });
  const catData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  const fsnCounts = { F: 0, S: 0, N: 0 };
  products.forEach(p => { fsnCounts[p.fsn_class]++; });
  const total = activeSKUs || 1;

  const advisories = useMemo(() => getCalendarInterpretations(), []);

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto scrollbar-thin h-full">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Total Revenue" value={fmtK(totalRevenue)} sub="Jan–Dec 2024" icon={DollarSign} />
        <KPICard label="Total Units Sold" value={totalUnits.toLocaleString()} sub="All products" icon={Package} />
        <KPICard label="Active SKUs" value={activeSKUs} sub="In catalog" icon={Tag} />
        <KPICard label="Items Below / Near ROP" value={belowROP} color={belowROP > 0 ? 'red' : 'green'} sub="Requiring attention" icon={AlertTriangle} />
      </div>

      {/* Stock Status Banner */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3 flex items-center gap-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Stock Status</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          <span className="text-sm font-bold text-red-600">{reorderNow}</span>
          <span className="text-xs text-gray-500">items REORDER NOW</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span className="text-sm font-bold text-amber-600">{approaching}</span>
          <span className="text-xs text-gray-500">items APPROACHING ROP</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          <span className="text-sm font-bold text-green-600">{activeSKUs - belowROP}</span>
          <span className="text-xs text-gray-500">items OK</span>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Monthly Revenue Trend — 2024</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyRev}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tickFormatter={v => `₱${(v/1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: '#6b7280' }} width={55} />
              <Tooltip formatter={v => fmt(v)} labelStyle={{ fontWeight: 600 }} />
              <Line type="monotone" dataKey="revenue" stroke="#F5A623" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => fmt(v)} />
              <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Top 10 Products by Revenue</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top10} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={v => `₱${(v/1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#374151' }} width={140} />
              <Tooltip formatter={v => fmt(v)} />
              <Bar dataKey="revenue" fill="#1B2A4A" radius={[0, 3, 3, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">FSN Classification Summary</h2>
          <div className="flex flex-col gap-3">
            <FSNStat label="Fast-Moving" count={fsnCounts.F} pct={Math.round(fsnCounts.F / total * 100)} color="green" />
            <FSNStat label="Slow-Moving" count={fsnCounts.S} pct={Math.round(fsnCounts.S / total * 100)} color="amber" />
            <FSNStat label="Non-Moving"  count={fsnCounts.N} pct={Math.round(fsnCounts.N / total * 100)} color="red" />
          </div>
          <div className="mt-4 h-4 rounded-full overflow-hidden flex">
            <div style={{ width: `${fsnCounts.F / total * 100}%` }} className="bg-green-500" />
            <div style={{ width: `${fsnCounts.S / total * 100}%` }} className="bg-amber-400" />
            <div style={{ width: `${fsnCounts.N / total * 100}%` }} className="bg-red-500" />
          </div>
          <div className="text-xs text-gray-400 mt-1 text-right">{activeSKUs} total SKUs</div>
        </div>
      </div>

      {/* Upcoming Event Advisories */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
          <Info size={13} className="text-blue-500" />
          Upcoming Event Advisories
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {advisories.map((adv, i) => {
            const s = SEVERITY_STYLES[adv.severity];
            return (
              <div key={i} className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${s.border}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-sm text-gray-800 leading-tight">{adv.event}</div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${s.badge}`}>
                    {adv.severity}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-2">{adv.timeframe}</div>
                <div className={`text-xs font-medium mb-3 ${s.accent}`}>{adv.impact}</div>
                <ul className="space-y-1">
                  {adv.recommendations.map((rec, j) => (
                    <li key={j} className="text-xs text-gray-600 flex gap-1.5">
                      <span className="text-gray-400 flex-shrink-0 mt-0.5">›</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FSNStat({ label, count, pct, color }) {
  const colors = {
    green: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    red:   { bg: 'bg-red-50',   text: 'text-red-700',   badge: 'bg-red-100 text-red-700' },
  }[color];
  return (
    <div className={`${colors.bg} rounded-lg p-3 flex items-center justify-between`}>
      <div>
        <div className={`text-xs font-semibold ${colors.text}`}>{label}</div>
        <div className={`text-2xl font-bold ${colors.text} leading-tight`}>{count}</div>
      </div>
      <span className={`text-sm font-bold px-2 py-1 rounded-full ${colors.badge}`}>{pct}%</span>
    </div>
  );
}
