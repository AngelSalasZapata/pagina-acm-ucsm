import { useState } from 'react'

const HISTORY_KEY = 'surreal_query_history'

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}

export default function QueryEditor({ db }) {
  const [query, setQuery] = useState('SELECT * FROM type::table($table);')
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState(loadHistory)

  const runQuery = async () => {
    if (!db || !query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await db.query(query.trim())
      setResults(Array.isArray(res) ? res : [res])
      const h = [{ q: query.trim(), time: Date.now() }, ...history.filter(x => x.q !== query.trim())].slice(0, 20)
      setHistory(h)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(h))
    } catch (err) {
      setError(err.message)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const renderValue = (val) => {
    if (val === null || val === undefined) return <span className="text-gray-600">null</span>
    if (typeof val === 'object') return (
      <pre className="text-xs text-yellow-300/80 whitespace-pre-wrap">{JSON.stringify(val, null, 2)}</pre>
    )
    return <span className="text-green-400">{String(val)}</span>
  }

  const renderResult = (data, i) => {
    if (data instanceof Error) {
      return <div key={i} className="text-red-400 text-xs p-2 bg-red-900/20 rounded border border-red-900/40">{data.message}</div>
    }
    if (Array.isArray(data)) {
      if (data.length === 0) return <div key={i} className="text-gray-600 text-xs p-2">empty result</div>
      const keys = [...new Set(data.flatMap(r => Object.keys(r || {})))]
      return (
        <div key={i} className="bg-gray-900/50 rounded border border-gray-800 p-2 overflow-auto">
          <div className="text-xs text-gray-500 mb-1">{data.length} row{data.length !== 1 ? 's' : ''}</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {keys.map(k => <th key={k} className="text-left px-2 py-1 text-gray-500 font-medium text-xs">{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row, ri) => (
                <tr key={ri} className="border-b border-gray-800/50">
                  {keys.map(k => (
                    <td key={k} className="px-2 py-1 text-xs max-w-[200px] truncate">{renderValue(row?.[k])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    return (
      <div key={i} className="bg-gray-900/50 rounded border border-gray-800 p-2">
        <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-800">
        <div className="flex gap-2">
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm font-mono text-gray-200 resize-none outline-none focus:border-cyan-500"
            rows={3}
            placeholder="Enter SURQL query..."
          />
          <button
            onClick={runQuery}
            disabled={loading || !db}
            className="px-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 rounded text-sm font-medium transition cursor-pointer self-start"
          >
            {loading ? '…' : 'Run'}
          </button>
        </div>
        {history.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400">history ({history.length})</summary>
            <div className="mt-1 space-y-1">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(h.q)}
                  className="block w-full text-left text-xs text-gray-500 hover:text-gray-300 px-2 py-0.5 rounded hover:bg-gray-800 truncate cursor-pointer"
                >
                  {h.q}
                </button>
              ))}
            </div>
          </details>
        )}
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {error && (
          <div className="text-red-400 text-sm font-mono mb-3 p-2 bg-red-900/20 rounded border border-red-900/40">
            {error}
          </div>
        )}
        {results && results.map((r, i) => renderResult(r, i))}
        {!db && !error && (
          <div className="flex items-center justify-center h-full text-gray-600 text-sm">
            connect to a database first
          </div>
        )}
      </div>
    </div>
  )
}
