import { useState } from 'react';
import FilterBar from './components/FilterBar';
import Overview from './pages/Overview';
import Forecast from './pages/Forecast';
import Classification from './pages/Classification';
import Reorder from './pages/Reorder';
import BatchReport from './pages/BatchReport';
import TallyInterface from './pages/TallyInterface';
import {
  LayoutDashboard, TrendingUp, Tag, Bell, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';

const PAGES = [
  { id: 'overview',        label: 'Dashboard Overview',  icon: LayoutDashboard },
  { id: 'classification',  label: 'FSN Classification',  icon: Tag },
  { id: 'forecast',        label: 'Demand Forecast',     icon: TrendingUp },
  { id: 'reorder',         label: 'Reorder Alerts',      icon: Bell },
  { id: 'report',          label: 'Batch Sales Report',  icon: FileText },
];

const PAGE_TITLES = {
  overview:       'Dashboard Overview',
  classification: 'FSN Classification',
  forecast:       'Demand Forecast',
  reorder:        'Reorder Alerts',
  report:         'Monthly Batch Sales Report',
};

const DEFAULT_FILTERS = {
  dateRange: 'Last 12 Months',
  supplier: 'All Suppliers',
  category: 'All Categories',
};

export default function App() {
  const [view, setView] = useState('tally');
  const [page, setPage] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  if (view === 'tally') {
    return <TallyInterface setView={setView} />;
  }

  const PageComponent = {
    overview:       Overview,
    classification: Classification,
    forecast:       Forecast,
    reorder:        Reorder,
    report:         BatchReport,
  }[page];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-200"
        style={{ width: collapsed ? 56 : 220, background: '#1B2A4A' }}
      >
        {/* Logo area */}
        <div className="flex items-center gap-2.5 px-3 py-4 border-b border-white/10" style={{ minHeight: 56 }}>
          {!collapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                <span className="font-black text-[9px] leading-none" style={{ color: '#1B2A4A' }}>UST</span>
              </div>
              <div className="min-w-0">
                <div className="text-white text-xs font-bold leading-tight truncate">USTore</div>
                <div className="leading-tight truncate" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9 }}>
                  Forecasting &amp; Inventory Dashboard
                </div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center mx-auto">
              <span className="font-black leading-none" style={{ color: '#1B2A4A', fontSize: 9 }}>UST</span>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto">
          {PAGES.map(({ id, label, icon: Icon }) => {
            const active = page === id;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                title={collapsed ? label : undefined}
                className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-left w-full transition-colors"
                style={{
                  background: active ? 'rgba(245,166,35,0.15)' : 'transparent',
                  color: active ? '#F5A623' : 'rgba(255,255,255,0.6)',
                }}
              >
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && <span className="text-xs font-medium truncate">{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Back to Tally */}
        {!collapsed && (
          <button
            onClick={() => setView('tally')}
            className="mx-2 mb-2 px-2.5 py-2 rounded-lg text-left text-xs transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            ← Back to Tally Interface
          </button>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center justify-center py-3 border-t transition-colors"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <FilterBar filters={filters} setFilters={setFilters} pageTitle={PAGE_TITLES[page]} />
        <main className="flex-1 overflow-hidden">
          <PageComponent filters={filters} />
        </main>
      </div>
    </div>
  );
}
