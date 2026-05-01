export default function StatCard({ label, value, hint }) {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value ?? '—'}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}
