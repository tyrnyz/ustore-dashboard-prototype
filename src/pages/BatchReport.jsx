import { useState, useMemo } from 'react';
import { getBatchReportData, MONTHS } from '../data';
import { Download, FileText, Printer } from 'lucide-react';

const fmt = n => `₱${n.toLocaleString()}`;

export default function BatchReport() {
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const monthIndex = MONTHS.indexOf(selectedMonth);
  const reportData = useMemo(() => getBatchReportData(monthIndex < 0 ? 5 : monthIndex), [monthIndex]);
  const grandTotal = reportData.reduce((s, s2) => s + s2.subtotal, 0);

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto scrollbar-thin h-full">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Month</label>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="text-sm border border-gray-200 rounded-md bg-white text-gray-700 py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-yellow-400 appearance-none"
          >
            {MONTHS.map(m => <option key={m}>{m}</option>)}
          </select>
          <span className="text-sm text-gray-500 font-medium">2024</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-gray-200 text-gray-600 hover:bg-gray-100"
          >
            <Printer size={14} /> Print Preview
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-white"
            style={{ background: '#1B2A4A' }}
            onMouseEnter={e => e.currentTarget.style.background = '#243a60'}
            onMouseLeave={e => e.currentTarget.style.background = '#1B2A4A'}
          >
            <Download size={14} /> Export as PDF
          </button>
        </div>
      </div>

      {/* Report Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                <span className="font-black text-[9px] leading-none" style={{ color: '#1B2A4A' }}>UST</span>
              </div>
              <span className="font-bold text-base" style={{ color: '#1B2A4A' }}>USTore Monthly Batch Sales Report</span>
            </div>
            <p className="text-xs text-gray-500">For UST Purchasing Office and Finance Department</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Period</div>
            <div className="text-sm font-bold text-gray-700">{selectedMonth} 2024</div>
            <div className="text-xs text-gray-400 mt-1">Generated: May 5, 2026</div>
          </div>
        </div>
      </div>

      {/* Supplier Tables */}
      {reportData.map(({ supplier, items, subtotal }) => (
        <div key={supplier} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-200" style={{ background: '#1B2A4A' }}>
            <span className="text-xs font-bold uppercase tracking-wider text-white">{supplier}</span>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Item</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Quantity</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Unit Price</th>
                <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700 font-medium">{item.name}</td>
                  <td className="px-4 py-2 text-right text-gray-700">{item.quantity.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-gray-600">{fmt(item.unitPrice)}</td>
                  <td className="px-4 py-2 text-right font-semibold text-gray-800">{fmt(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'rgba(27,42,74,0.04)' }}>
                <td colSpan={3} className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Subtotal — {supplier}
                </td>
                <td className="px-4 py-2 text-right font-bold text-gray-800">{fmt(subtotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ))}

      {/* Grand Total */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <tr style={{ background: '#1B2A4A' }}>
              <td className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wider text-white" colSpan={3}>
                Grand Total — All Suppliers
              </td>
              <td className="px-4 py-3 text-right text-base font-black" style={{ color: '#F5A623' }}>
                {fmt(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FileText size={12} className="text-gray-400" />
              <span>Report generated from: <span className="font-semibold text-gray-700">SQLite Star Schema via Python ETL Pipeline</span></span>
            </div>
            <div className="text-xs text-gray-500">
              Period: <span className="font-semibold text-gray-700">{selectedMonth} 2024</span>
            </div>
            <div className="text-xs text-gray-500">
              Prepared for: <span className="font-semibold text-gray-700">UST Purchasing Office / Finance Department</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 text-right">
            <div>Total Suppliers: {reportData.length}</div>
            <div>Total Line Items: {reportData.reduce((s, r) => s + r.items.length, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
