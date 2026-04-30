import { SUPPLIERS, CATEGORIES } from '../data';
import { Filter, Calendar } from 'lucide-react';

const DATE_RANGES = ['Last 3 Months', 'Last 6 Months', 'Last 12 Months', 'All Time'];

export default function FilterBar({ filters, setFilters, pageTitle }) {
  function update(key, val) {
    setFilters(f => ({ ...f, [key]: val }));
  }

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-base font-semibold text-navy">{pageTitle}</h1>
      <div className="flex items-center gap-3">
        <Filter size={14} className="text-gray-400" />
        <Select
          icon={<Calendar size={13} className="text-gray-400" />}
          value={filters.dateRange}
          onChange={v => update('dateRange', v)}
          options={DATE_RANGES}
        />
        <Select
          value={filters.supplier}
          onChange={v => update('supplier', v)}
          options={SUPPLIERS}
        />
        <Select
          value={filters.category}
          onChange={v => update('category', v)}
          options={CATEGORIES}
        />
      </div>
    </div>
  );
}

function Select({ value, onChange, options, icon }) {
  return (
    <div className="relative flex items-center">
      {icon && <span className="absolute left-2 pointer-events-none">{icon}</span>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`text-xs border border-gray-200 rounded-md bg-gray-50 text-gray-700 py-1.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-yellow-400 ${icon ? 'pl-7' : 'pl-3'}`}
        style={{ minWidth: 140 }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-2 pointer-events-none text-gray-400 text-xs">▾</span>
    </div>
  );
}
