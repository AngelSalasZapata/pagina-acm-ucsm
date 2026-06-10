export default function DataViewer({ records, onSelectRecord, selectedId }) {
  if (!records || records.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600 text-sm">
        select a table to view records
      </div>
    )
  }

  const keys = [...new Set(records.flatMap(r => Object.keys(r)))]
  const renderCell = (val) => {
    if (val === null || val === undefined) return <span className="text-gray-600">null</span>
    if (typeof val === 'object') return <span className="text-yellow-400/70">{JSON.stringify(val).slice(0, 60)}</span>
    return String(val)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-800 text-sm text-gray-400">
        {records.length} record{records.length !== 1 ? 's' : ''}
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-3 py-2 text-gray-500 font-medium">id</th>
              {keys.filter(k => k !== 'id').map(k => (
                <th key={k} className="text-left px-3 py-2 text-gray-500 font-medium">{k}</th>
              ))}
              <th className="w-0 px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr
                key={r.id}
                onClick={() => onSelectRecord(r)}
                className={`border-b border-gray-800/50 hover:bg-gray-800/40 transition cursor-pointer ${selectedId === r.id ? 'bg-cyan-600/10' : ''}`}
              >
                <td className="px-3 py-2 text-cyan-400 font-mono text-xs">{r.id}</td>
                {keys.filter(k => k !== 'id').map(k => (
                  <td key={k} className="px-3 py-2 text-gray-300 max-w-[200px] truncate">{renderCell(r[k])}</td>
                ))}
                <td className="px-3 py-2">
                  <span className="text-xs text-gray-600">→</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
