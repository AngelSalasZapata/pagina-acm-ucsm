import { useState, useRef, useEffect, useCallback } from 'react'

function buildGraph(record, records) {
  const nodes = []
  const edges = []
  const added = new Set()

  const addNode = (id, label, group = 'default') => {
    if (!id || added.has(id)) return
    added.add(id)
    const angle = Math.random() * 2 * Math.PI
    const radius = 80 + Math.random() * 120
    nodes.push({
      id,
      label: String(label ?? id).slice(0, 24),
      group,
      x: 300 + Math.cos(angle) * radius,
      y: 250 + Math.sin(angle) * radius,
    })
  }

  addNode(record.id, record.id, 'center')

  for (const [key, val] of Object.entries(record)) {
    if (key === 'id') continue
    if (val && typeof val === 'object' && val.id) {
      addNode(val.id, val.id, 'related')
      edges.push({ from: record.id, to: val.id, label: key })
    } else if (Array.isArray(val)) {
      for (const item of val) {
        if (item && typeof item === 'object' && item.id) {
          addNode(item.id, item.id, 'related')
          edges.push({ from: record.id, to: item.id, label: key })
        }
      }
    } else if (typeof val === 'string' && val.startsWith('¿')) {
      const rid = val.slice(1, -1)
      if (records.find(r => r.id === rid)) {
        addNode(rid, rid, 'related')
        edges.push({ from: record.id, to: rid, label: key })
      }
    }
  }

  const centerNode = nodes.find(n => n.id === record.id)
  if (centerNode) {
    centerNode.x = 300
    centerNode.y = 250
  }

  return { nodes, edges }
}

export default function GraphView({ record, records }) {
  const [graph, setGraph] = useState(null)
  const svgRef = useRef(null)
  const [dragging, setDragging] = useState(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [nodes, setNodes] = useState([])

  useEffect(() => {
    if (!record) { setGraph(null); setNodes([]); return }
    const g = buildGraph(record, records || [])
    setGraph(g)
    setNodes(g.nodes)
  }, [record, records])

  const handleMouseDown = useCallback((e, nodeId) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return
    setDragging(nodeId)
    setOffset({ x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y })
  }, [nodes])

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    setNodes(prev => prev.map(n =>
      n.id === dragging ? { ...n, x: e.clientX - rect.left - offset.x, y: e.clientY - rect.top - offset.y } : n
    ))
  }, [dragging, offset])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  if (!record) return (
    <div className="flex items-center justify-center h-full text-gray-600 text-sm">
      select a record to see relationships
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-800 text-sm text-gray-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400" />
        {record.id}
      </div>
      <div className="flex-1 relative">
        <svg
          ref={svgRef}
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#4a5568" />
            </marker>
          </defs>

          {graph && graph.edges.map((e, i) => {
            const from = nodes.find(n => n.id === e.from)
            const to = nodes.find(n => n.id === e.to)
            if (!from || !to) return null
            const dx = to.x - from.x
            const dy = to.y - from.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const mx = (from.x + to.x) / 2
            const my = (from.y + to.y) / 2
            return (
              <g key={i}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#374151" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <text x={mx} y={my - 6} textAnchor="middle" fill="#6b7280" fontSize="10">{e.label}</text>
              </g>
            )
          })}

          {nodes.map((n) => (
            <g
              key={n.id}
              onMouseDown={(e) => handleMouseDown(e, n.id)}
              style={{ cursor: 'grab' }}
            >
              <circle
                cx={n.x} cy={n.y}
                r={n.group === 'center' ? 28 : 20}
                fill={n.group === 'center' ? '#0891b2' : '#1e293b'}
                stroke={n.group === 'center' ? '#22d3ee' : '#334155'}
                strokeWidth={2}
              />
              <text
                x={n.x} y={n.y + 4}
                textAnchor="middle"
                fill={n.group === 'center' ? '#fff' : '#94a3b8'}
                fontSize="11"
                fontFamily="monospace"
              >
                {n.label.length > 12 ? n.label.slice(0, 12) + '…' : n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
