import { useState } from 'react'

export default function Inventory() {
  const [items, setItems] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('smartledger-products') || '[]')
    } catch { return [] }
  })
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')

  function save() {
    if (!name.trim()) return
    const next = [...items, {
      id: Date.now(), name, selling: Number(price),
      purchase: 0, stock: Number(qty), sku: '', category: 'General'
    }]
    setItems(next)
    localStorage.setItem('smartledger-products', JSON.stringify(next))
    setName('')
    setPrice('')
    setQty('')
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Inventory Management</h1>
      <p>Total Products: {items.length}</p>
      <div className="flex flex-col gap-3">
        <input className="border rounded p-3" placeholder="Product name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border rounded p-3" placeholder="Selling price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <input className="border rounded p-3" placeholder="Opening stock" type="number" value={qty} onChange={e => setQty(e.target.value)} />
        <button onClick={save} className="bg-green-900 text-white rounded p-3">Save Product</button>
      </div>
      {items.map(item => (
        <div key={item.id} className="border rounded p-3">
          <b>{item.name}</b>
          <p>Price: ₹{item.selling} | Stock: {item.stock}</p>
        </div>
      ))}
    </div>
  )
}
