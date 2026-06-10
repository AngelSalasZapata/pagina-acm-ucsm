import { useState, useCallback, useRef } from 'react'
import { Surreal } from 'surrealdb'
import Sidebar from './components/Sidebar'
import DataViewer from './components/DataViewer'
import GraphView from './components/GraphView'
import QueryEditor from './components/QueryEditor'

export default function App() {
  const [db, setDb] = useState(null)
  const [connected, setConnected] = useState(false)
  const [tables, setTables] = useState([])
  const [activeTable, setActiveTable] = useState(null)
  const [records, setRecords] = useState([])
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [tab, setTab] = useState('data')
  const [allRecords, setAllRecords] = useState([])
  const connRef = useRef(null)

  const handleConnect = useCallback(async (cfg) => {
    try {
      if (!cfg.namespace) {
        throw new Error('namespace is required')
      }
      if (connRef.current) {
        await connRef.current.close().catch(() => {})
      }
      const ns = cfg.namespace.replace(/[^a-zA-Z0-9_-]/g, '')
      const db = (cfg.database || ns).replace(/[^a-zA-Z0-9_-]/g, '')

      const surreal = new Surreal()
      await surreal.connect(`${cfg.url}/rpc`)
      await surreal.signin({ username: cfg.user, password: cfg.pass })

      await surreal.query(`DEFINE NAMESPACE IF NOT EXISTS ${ns};`)
      await surreal.use({ namespace: ns })
      await surreal.query(`DEFINE DATABASE IF NOT EXISTS ${db};`)
      await surreal.use({ namespace: ns, database: db })

      connRef.current = surreal
      setDb(surreal)
      setConnected(true)

      const [info] = await surreal.query('INFO FOR DB;')
      const tbls = info?.tb ? Object.keys(info.tb) : []
      setTables(tbls.sort())
      setActiveTable(null)
      setRecords([])
      setSelectedRecord(null)
      setAllRecords([])
    } catch (err) {
      alert('Connection error: ' + err.message)
    }
  }, [])

  const handleSelectTable = useCallback(async (table) => {
    if (!db) return
    setActiveTable(table)
    setSelectedRecord(null)
    try {
      const [data] = await db.query(`SELECT * FROM ${table};`)
      setRecords(data)
      setAllRecords(prev => {
        const map = new Map(prev.map(r => [r.id, r]))
        data.forEach(r => map.set(r.id, r))
        return [...map.values()]
      })
    } catch (err) {
      console.error(err)
      setRecords([])
    }
  }, [db])

  const handleSelectRecord = useCallback((record) => {
    setSelectedRecord(record)
    setTab('graph')
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        onConnect={handleConnect}
        tables={tables}
        activeTable={activeTable}
        onSelectTable={handleSelectTable}
        connected={connected}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-0 flex items-center gap-1">
          {['data', 'graph', 'query'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm border-b-2 transition cursor-pointer ${
                tab === t
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'data' ? 'Data' : t === 'graph' ? 'Graph' : 'Query'}
            </button>
          ))}
          {selectedRecord && tab !== 'graph' && (
            <span className="ml-auto text-xs text-gray-600 truncate max-w-[200px]">
              selected: {selectedRecord.id}
            </span>
          )}
        </header>

        <main className="flex-1 overflow-hidden">
          {tab === 'data' && (
            <DataViewer
              records={records}
              onSelectRecord={handleSelectRecord}
              selectedId={selectedRecord?.id}
            />
          )}
          {tab === 'graph' && (
            <GraphView record={selectedRecord} records={allRecords} />
          )}
          {tab === 'query' && <QueryEditor db={db} />}
        </main>
      </div>
    </div>
  )
}
