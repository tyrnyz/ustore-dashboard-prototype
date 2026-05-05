import { useState } from 'react';
import { PRODUCTS, MONTHS } from '../data';
import { ArrowRight, Database, CheckCircle } from 'lucide-react';

const TRANSACTION_TYPES = ['Sale', 'Return', 'Damage', 'Internal Transfer'];

const RECENT_ENTRIES = [
  { date: '2026-05-05', item: 'UST Ballpen Set',       qty: 12, supplier: 'Campus Essentials PH',  type: 'Sale' },
  { date: '2026-05-05', item: 'UST Notebook (80 leaves)', qty: 8, supplier: 'Campus Essentials PH', type: 'Sale' },
  { date: '2026-05-04', item: 'UST Lanyard',            qty: 3,  supplier: 'Campus Essentials PH',  type: 'Return' },
  { date: '2026-05-04', item: 'Tiger Logo Cap',         qty: 5,  supplier: 'Golden Tiger Supplies',  type: 'Sale' },
  { date: '2026-05-03', item: 'UST Varsity Jacket',     qty: 2,  supplier: 'Thomasian Merch Co.',   type: 'Sale' },
  { date: '2026-05-03', item: 'UST Tumbler 600ml',      qty: 4,  supplier: 'Golden Tiger Supplies',  type: 'Sale' },
  { date: '2026-05-02', item: 'UST Keychain',           qty: 10, supplier: 'Campus Essentials PH',  type: 'Sale' },
  { date: '2026-05-01', item: 'UST Mug 350ml',          qty: 1,  supplier: 'Golden Tiger Supplies',  type: 'Damage' },
];

const TYPE_BADGE = {
  'Sale':              'bg-green-100 text-green-700',
  'Return':            'bg-blue-100 text-blue-700',
  'Damage':            'bg-red-100 text-red-700',
  'Internal Transfer': 'bg-purple-100 text-purple-700',
};

export default function TallyInterface({ setView }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [txType, setTxType] = useState('Sale');

  const selectedProduct = PRODUCTS.find(p => p.id === Number(itemId));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header style={{ background: '#1B2A4A' }} className="px-8 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
            <span className="font-black text-xs leading-none" style={{ color: '#1B2A4A' }}>UST</span>
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight">USTore Digital Tally Interface</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Internal Inventory Counting Tool — Non-Transactional
            </div>
          </div>
        </div>
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: '#F5A623', color: '#1B2A4A' }}
          onMouseEnter={e => e.currentTarget.style.background = '#d4911e'}
          onMouseLeave={e => e.currentTarget.style.background = '#F5A623'}
        >
          View Analytics Dashboard <ArrowRight size={15} />
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Entry Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">Record Inventory Entry</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Transaction Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Transaction Type</label>
              <select
                value={txType}
                onChange={e => setTxType(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
              >
                {TRANSACTION_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Item */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-xs font-semibold text-gray-600">Item</label>
              <select
                value={itemId}
                onChange={e => setItemId(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
              >
                <option value="">— Select an item —</option>
                {PRODUCTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Supplier (auto-fill, read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Supplier</label>
              <input
                type="text"
                readOnly
                value={selectedProduct ? selectedProduct.supplier : ''}
                placeholder="Auto-filled on item selection"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-50 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{ background: '#1B2A4A', color: '#fff' }}
              onMouseEnter={e => e.currentTarget.style.background = '#243a60'}
              onMouseLeave={e => e.currentTarget.style.background = '#1B2A4A'}
            >
              Record Entry
            </button>
            <span className="text-xs text-gray-400">Fields will be validated before submission</span>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Recent Entries</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['Date', 'Item', 'Qty', 'Supplier', 'Type'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ENTRIES.map((entry, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-600 text-xs whitespace-nowrap">{entry.date}</td>
                    <td className="px-3 py-2 text-gray-700 font-medium whitespace-nowrap">{entry.item}</td>
                    <td className="px-3 py-2 text-gray-700 font-semibold">{entry.qty}</td>
                    <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">{entry.supplier}</td>
                    <td className="px-3 py-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE[entry.type]}`}>
                        {entry.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer / Pipeline Status */}
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Database size={13} className="text-green-500" />
            <span>Data Pipeline Status:</span>
            <span className="font-semibold text-green-600">Connected to SQLite Star Schema</span>
            <span className="text-gray-400">|</span>
            <span>Last sync: May 5, 2026 — 08:14 AM</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
            <CheckCircle size={13} />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
