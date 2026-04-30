export default function KPICard({ label, value, sub, color = 'default', icon: Icon }) {
  const colorMap = {
    default: 'text-navy',
    red: 'text-red-600',
    green: 'text-green-600',
    amber: 'text-amber-500',
    gold: 'text-yellow-500',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col gap-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        {Icon && <Icon size={16} className="text-gray-400" />}
      </div>
      <div className={`text-2xl font-bold leading-tight ${colorMap[color] || colorMap.default}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}
