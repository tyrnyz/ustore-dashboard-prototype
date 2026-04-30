import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const FSN_BADGE = {
  F: 'bg-green-100 text-green-700 border border-green-300',
  S: 'bg-amber-100 text-amber-700 border border-amber-300',
  N: 'bg-red-100 text-red-700 border border-red-300',
};

const STATUS_BADGE = {
  'REORDER NOW': 'bg-red-100 text-red-700 border border-red-300',
  'APPROACHING': 'bg-amber-100 text-amber-700 border border-amber-300',
  'OK': 'bg-green-100 text-green-700 border border-green-200',
};

export default function DataTable({ columns, data }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  function handleSort(key) {
    if (sortCol === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  }

  const sorted = sortCol
    ? [...data].sort((a, b) => {
        const av = a[sortCol], bv = b[sortCol];
        if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      })
    : data;

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map(col => (
              <th
                key={col.key}
                className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap cursor-pointer select-none hover:bg-gray-100"
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {sortCol === col.key ? (
                    sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  ) : (
                    <ChevronsUpDown size={12} className="text-gray-300" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-3 py-2 text-gray-700 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { FSN_BADGE, STATUS_BADGE };
