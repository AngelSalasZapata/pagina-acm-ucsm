import { useState } from 'react'

export default function Sidebar({ onConnect, tables, activeTable, onSelectTable, connected }) {
  const [url, setUrl] = useState('http://localhost:8000')
  const [namespace, setNamespace] = useState('default')
  const [database, setDatabase] = useState('default')
  const [user, setUser] = useState('root')
  const [pass, setPass] = useState('root')

  const handleConnect = (e) => {
    e.preventDefault()
    onConnect({ url, namespace, database, user, pass })
  }

  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-bold text-cyan-400">SurrealDB Admin</h1>
        <p className="text-xs text-gray-500 mt-0.5">dynamic data explorer</p>
      </div>

      <form onSubmit={handleConnect} className="p-4 space-y-2 border-b border-gray-800">
        <input className="w-full bg-gray-800 rounded px-3 py-1.5 text-sm border border-gray-700 focus:border-cyan-500 outline-none" placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} />
        <div className="flex gap-2">
          <input className="flex-1 bg-gray-800 rounded px-3 py-1.5 text-sm border border-gray-700 focus:border-cyan-500 outline-none" placeholder="Namespace" value={namespace} onChange={e => setNamespace(e.target.value)} />
          <input className="flex-1 bg-gray-800 rounded px-3 py-1.5 text-sm border border-gray-700 focus:border-cyan-500 outline-none" placeholder="Database" value={database} onChange={e => setDatabase(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <input className="flex-1 bg-gray-800 rounded px-3 py-1.5 text-sm border border-gray-700 focus:border-cyan-500 outline-none" placeholder="User" value={user} onChange={e => setUser(e.target.value)} />
          <input className="flex-1 bg-gray-800 rounded px-3 py-1.5 text-sm border border-gray-700 focus:border-cyan-500 outline-none" placeholder="Pass" value={pass} onChange={e => setPass(e.target.value)} type="password" />
        </div>
        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 rounded py-1.5 text-sm font-medium transition cursor-pointer">
          {connected ? 'Reconnect' : 'Connect'}
        </button>
        {connected && <p className="text-xs text-green-400 text-center">connected</p>}
      </form>

      <nav className="flex-1 overflow-y-auto p-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-2">Tables</p>
        {tables.map(t => (
          <button
            key={t}
            onClick={() => onSelectTable(t)}
            className={`w-full text-left px-3 py-1.5 rounded text-sm mb-0.5 transition cursor-pointer ${activeTable === t ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-600/30' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent'}`}
          >
            {t}
          </button>
        ))}
        {tables.length === 0 && connected && <p className="text-xs text-gray-600 px-2">no tables found</p>}
        {!connected && <p className="text-xs text-gray-600 px-2">connect to see tables</p>}
      </nav>
    </aside>
  )
}
