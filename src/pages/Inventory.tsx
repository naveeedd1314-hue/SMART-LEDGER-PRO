import { useMemo, useState } from 'react'
import { Search, Package, AlertTriangle, IndianRupee, Plus, ClipboardList } from 'lucide-react'

type Product = {
  id: string | number
  name: string
  selling: number
  purchase: number
  stock: number
  sku?: string
  category?: string
  hsn?: string
  gstRate?: number
}

type Adjustment = {
  id: string
  date: string
  product: string
  change: number
  reason: string
  movement?: 'Stock In' | 'Stock Out' | 'Correction'
  stockAfter?: number
}

const read = <T,>(key: string): T[] => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

const money = (n: number) =>
  `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

export default function Inventory() {
  const [items, setItems] = useState<Product[]>(() => read<Product>('smartledger-products'))
  const [adjustments, setAdjustments] = useState<Adjustment[]>(() => read<Adjustment>('smartledger-pro-stock-adjustments'))
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [group, setGroup] = useState('General')
  const [hsn, setHsn] = useState('')
  const [gstRate, setGstRate] = useState('0')
  const [purchase, setPurchase] = useState('')
  const [selling, setSelling] = useState('')
  const [qty, setQty] = useState('')
  const [lowLimit, setLowLimit] = useState('5')
  const [adjustProduct, setAdjustProduct] = useState('')
  const [adjustQty, setAdjustQty] = useState('')
  const [reason, setReason] = useState('Stock correction')

  const saveItems = (next: Product[]) => {
    setItems(next)
    localStorage.setItem('smartledger-products', JSON.stringify(next))
  }

  const saveAdjustments = (next: Adjustment[]) => {
    setAdjustments(next)
    localStorage.setItem('smartledger-pro-stock-adjustments', JSON.stringify(next))
  }

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(items.map(x => x.category || 'General')))],
    [items]
  )

  const filtered = items.filter(x =>
    (category === 'All' || (x.category || 'General') === category) &&
    `${x.name} ${x.sku || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  const totalUnits = items.reduce((s, x) => s + (Number(x.stock) || 0), 0)
  const stockValue = items.reduce((s, x) => s + (Number(x.stock) || 0) * (Number(x.purchase) || 0), 0)
  const retailValue = items.reduce((s, x) => s + (Number(x.stock) || 0) * (Number(x.selling) || 0), 0)
  const lowStock = items.filter(x => Number(x.stock) <= Math.max(0, Number(lowLimit) || 0))

  function addProduct() {
    if (!name.trim() || Number(selling) <= 0 || Number(purchase) < 0 || Number(qty) < 0) {
      alert('Enter a product name, valid prices and opening stock.')
      return
    }
    if (items.some(x => x.name.trim().toLowerCase() === name.trim().toLowerCase())) {
      alert('A product with this name already exists.')
      return
    }
    if (sku.trim() && items.some(x => (x.sku || '').toLowerCase() === sku.trim().toLowerCase())) {
      alert('This SKU already exists.')
      return
    }

    const next = [...items, {
      id: crypto.randomUUID(),
      name: name.trim(),
      sku: sku.trim(),
      category: group.trim() || 'General',
      hsn: hsn.trim(),
      gstRate: Number(gstRate),
      purchase: Number(purchase),
      selling: Number(selling),
      stock: Number(qty)
    }]
    saveItems(next)
    if (Number(qty) > 0) {
      saveAdjustments([{
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        product: name.trim(),
        change: Number(qty),
        reason: 'Opening stock',
        movement: 'Stock In',
        stockAfter: Number(qty)
      }, ...adjustments])
    }
    setName('')
    setSku('')
    setHsn('')
    setGstRate('0')
    setPurchase('')
    setSelling('')
    setQty('')
    alert('Product added successfully.')
  }

  function changeStock() {
    const product = items.find(x => String(x.id) === adjustProduct)
    const change = Number(adjustQty)
    if (!product || !Number.isFinite(change) || change === 0) {
      alert('Select a product and enter a non-zero stock change.')
      return
    }
    if (Number(product.stock) + change < 0) {
      alert('Stock cannot become negative.')
      return
    }

    saveItems(items.map(x =>
      x.id === product.id ? { ...x, stock: Number(x.stock) + change } : x
    ))

    saveAdjustments([{
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      product: product.name,
      change,
 movement: change > 0 ? 'Stock In' : 'Stock Out',
 stockAfter: Number(product.stock) + change,
 
      reason: reason.trim() || 'Stock correction'
    }, ...adjustments])

    setAdjustQty('')
    alert('Stock adjusted and recorded.')
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <p className="text-sm text-gray-500">Products, stock valuation, alerts and stock corrections.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Products', value: items.length, icon: Package },
          { label: 'Total Units', value: totalUnits.toLocaleString('en-IN'), icon: ClipboardList },
          { label: 'Stock Cost Value', value: money(stockValue), icon: IndianRupee },
          { label: 'Low Stock Items', value: lowStock.length, icon: AlertTriangle }
        ].map(card => {
          const Icon = card.icon
          return <div key={card.label} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-500">
              {card.label}<Icon size={19} />
            </div>
            <strong className="mt-2 block text-xl">{card.value}</strong>
          </div>
        })}
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Add New Product</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">Product name
            <input className="mt-1 w-full rounded-lg border p-3" value={name} onChange={e => setName(e.target.value)} placeholder="Product name" />
          </label>
          <label className="text-sm">SKU / Barcode
            <input className="mt-1 w-full rounded-lg border p-3" value={sku} onChange={e => setSku(e.target.value)} placeholder="Optional code" />
          </label>
          <label className="text-sm">Category
            <input className="mt-1 w-full rounded-lg border p-3" value={group} onChange={e => setGroup(e.target.value)} placeholder="General" />
          </label>
          <label className="text-sm">HSN / SAC code
            <input className="mt-1 w-full rounded-lg border p-3" value={hsn} onChange={e => setHsn(e.target.value)} placeholder="Enter HSN / SAC" />
          </label>
          <label className="text-sm">GST rate
            <select className="mt-1 w-full rounded-lg border p-3" value={gstRate} onChange={e => setGstRate(e.target.value)}>
              {['0','5','12','18','28'].map(x => <option key={x} value={x}>{x}%</option>)}
            </select>
          </label>
          <label className="text-sm">Purchase price
            <input type="number" min="0" step="any" className="mt-1 w-full rounded-lg border p-3" value={purchase} onChange={e => setPurchase(e.target.value)} placeholder="0.00" />
          </label>
          <label className="text-sm">Selling price
            <input type="number" min="0" step="any" className="mt-1 w-full rounded-lg border p-3" value={selling} onChange={e => setSelling(e.target.value)} placeholder="0.00" />
          </label>
          <label className="text-sm">Opening stock
            <input type="number" min="0" step="any" className="mt-1 w-full rounded-lg border p-3" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" />
          </label>
        </div>
        <button onClick={addProduct} className="flex items-center gap-2 rounded-lg bg-green-900 px-5 py-3 font-semibold text-white">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Stock Adjustment</h2>
        <p className="text-sm text-gray-500">Use positive quantity for stock inward and negative quantity for stock reduction. Every adjustment is recorded.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <select className="rounded-lg border p-3" value={adjustProduct} onChange={e => setAdjustProduct(e.target.value)}>
            <option value="">Select product</option>
            {items.map(x => <option key={x.id} value={String(x.id)}>{x.name} — {x.stock} in stock</option>)}
          </select>
          <input type="number" step="any" className="rounded-lg border p-3" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} placeholder="Quantity change (+ / -)" />
          <input className="rounded-lg border p-3" value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason" />
        </div>
        <button onClick={changeStock} className="rounded-lg border border-green-900 px-5 py-3 font-semibold text-green-900">Apply Adjustment</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Estimated Retail Stock Value</p>
          <strong className="text-xl">{money(retailValue)}</strong>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <label className="text-sm text-gray-500">Low stock alert threshold
            <input type="number" min="0" className="mt-1 block w-full rounded-lg border p-2" value={lowLimit} onChange={e => setLowLimit(e.target.value)} />
          </label>
          <p className="mt-2 text-sm text-amber-700">{lowStock.length} products at or below this quantity.</p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Product Stock ({filtered.length})</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex items-center gap-2 rounded-lg border px-3">
              <Search size={17} className="text-gray-400" />
              <input className="min-w-0 p-2 outline-none" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search product or SKU" />
            </div>
            <select className="rounded-lg border p-2" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b text-gray-500">
              <th className="p-2">Product</th><th className="p-2">SKU</th><th className="p-2">HSN/SAC</th><th className="p-2">GST</th><th className="p-2">Category</th>
              <th className="p-2">Purchase</th><th className="p-2">Selling</th><th className="p-2">Stock</th><th className="p-2">Stock Value</th>
            </tr></thead>
            <tbody>{filtered.map(x => <tr key={x.id} className="border-b">
              <td className="p-2 font-medium">{x.name}</td>
              <td className="p-2">{x.sku || '—'}</td>
              <td className="p-2">{x.hsn || '—'}</td>
              <td className="p-2">{Number(x.gstRate) || 0}%</td>
              <td className="p-2">{x.category || 'General'}</td>
              <td className="p-2">{money(Number(x.purchase) || 0)}</td>
              <td className="p-2">{money(Number(x.selling) || 0)}</td>
              <td className={`p-2 font-semibold ${Number(x.stock) <= Number(lowLimit) ? 'text-amber-700' : ''}`}>{x.stock}</td>
              <td className="p-2">{money((Number(x.stock) || 0) * (Number(x.purchase) || 0))}</td>
            </tr>)}</tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="py-6 text-center text-gray-500">No matching products found.</p>}
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Recent Stock Adjustments</h2>
        {adjustments.length ? <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b text-gray-500">
              <th className="p-2">Date</th>
              <th className="p-2">Product</th>
              <th className="p-2">Movement</th>
              <th className="p-2">Qty Change</th>
              <th className="p-2">Stock After</th>
              <th className="p-2">Reason</th>
            </tr></thead>
            <tbody>{adjustments.slice(0, 50).map(x => {
              const movement = x.movement || (x.change > 0 ? 'Stock In' : 'Stock Out')
              return <tr key={x.id} className="border-b">
                <td className="p-2">{x.date}</td>
                <td className="p-2">{x.product}</td>
                <td className="p-2">{movement}</td>
                <td className={`p-2 font-semibold ${x.change > 0 ? 'text-green-800' : 'text-red-700'}`}>{x.change > 0 ? '+' : ''}{x.change}</td>
                <td className="p-2">{x.stockAfter ?? '—'}</td>
                <td className="p-2">{x.reason}</td>
              </tr>
            })}</tbody>
          </table>
        </div> : <p className="py-4 text-sm text-gray-500">No stock adjustments recorded.</p>}
      </div>
    </section>
  )
}
