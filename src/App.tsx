import Returns from './pages/Returns'
import Purchases from './pages/Purchases'
import Inventory from './pages/Inventory'
import { useState } from 'react'
import {
  LayoutDashboard, ShoppingCart, ShoppingBag, Package,
  Users, Truck, Wallet, ChartNoAxesCombined, FileText,
  Settings, Bell, Search, Menu, Plus, ArrowUpRight,
  ArrowDownRight, Boxes, CreditCard,
  Receipt, ChevronDown, BookOpen
} from 'lucide-react'

const navigation = [
  { title: 'OVERVIEW', items: [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Analytics', icon: ChartNoAxesCombined },
  ]},
  { title: 'BUSINESS', items: [
    { name: 'Sales', icon: ShoppingCart },
    { name: 'Purchases', icon: ShoppingBag },
    { name: 'Inventory', icon: Package },
    { name: 'Customers', icon: Users },
    { name: 'Suppliers', icon: Truck },
  ]},
  { title: 'FINANCE', items: [
    { name: 'Expenses', icon: Wallet },
    { name: 'Payments', icon: CreditCard },
    { name: 'Reports', icon: FileText },
    { name: 'Ledger', icon: BookOpen },
    { name: 'Returns', icon: Receipt },
  ]},
  { title: 'SYSTEM', items: [
    { name: 'Settings', icon: Settings },
  ]},
]

const metrics = [
  { label: 'Total Sales', value: '₹0.00', change: 'Sales revenue', icon: ShoppingCart },
  { label: 'Total Purchases', value: '₹0.00', change: 'Purchase value', icon: ShoppingBag },
  { label: 'To Collect', value: '₹0.00', change: 'Customer receivables', icon: ArrowDownRight },
  { label: 'To Pay', value: '₹0.00', change: 'Supplier payables', icon: ArrowUpRight },
]

function App() {
  const [active, setActive] = useState('Dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f5f3eb] text-[#25382d]">
      <aside className={`${menuOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#e6e3d8] bg-[#183b2b] text-white transition-transform md:translate-x-0`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d9c9a4] text-xl font-black text-[#183b2b]">S</div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">SmartLedger</h1>
            <p className="text-[10px] uppercase tracking-[3px] text-[#c9d6ca]">PRO BUSINESS ERP</p>
          </div>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-7">
          {navigation.map(group => (
            <div key={group.title}>
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[2px] text-[#a9bdad]">{group.title}</p>
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon
                  return (
                    <button key={item.name} onClick={() => { setActive(item.name); setMenuOpen(false) }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active === item.name ? 'bg-[#d9c9a4] font-semibold text-[#183b2b]' : 'text-[#e0e8df] hover:bg-white/10'}`}>
                      <Icon size={18} /> {item.name}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="m-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold">SmartLedger Pro</p>
          <p className="mt-1 text-[11px] text-[#c1d0c3]">Your business. Under control.</p>
        </div>
      </aside>

      <main className="min-h-screen md:ml-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#e6e3d8] bg-[#f5f3eb]/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}><Menu /></button>
            <div>
              <p className="text-xs text-[#849187]">Business management / {active}</p>
              <h2 className="text-lg font-bold">{active}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden rounded-xl border border-[#e5e1d5] bg-white p-2.5 sm:block"><Search size={18}/></button>
            <button className="relative rounded-xl border border-[#e5e1d5] bg-white p-2.5"><Bell size={18}/><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#b57c4b]"/></button>
            <div className="flex items-center gap-2 rounded-xl border border-[#e5e1d5] bg-white p-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dce5d9] text-sm font-bold">S</div>
              <span className="hidden text-xs font-semibold sm:block">My Business</span>
              <ChevronDown size={14}/>
            </div>
          </div>
        </header>

        {active === 'Returns' ? <Returns /> : active === 'Purchases' ? <Purchases /> : active === 'Inventory' ? <Inventory /> : (
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#849187]">Friday, 20 November 2026</p>
              <h2 className="mt-1 text-2xl font-bold">Business overview</h2>
              <p className="mt-1 text-sm text-[#849187]">Monitor your business performance from one place.</p>
            </div>
            <button onClick={() => setActive('Sales')} className="flex items-center gap-2 rounded-xl bg-[#183b2b] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#28523c]">
              <Plus size={17}/> New transaction
            </button>
          </div>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.label} className="rounded-2xl border border-[#e8e4d9] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#77857a]">{metric.label}</span>
                    <span className="rounded-xl bg-[#edf1e9] p-2.5 text-[#31583e]"><Icon size={19}/></span>
                  </div>
                  <p className="mt-5 text-2xl font-bold tracking-tight">{metric.value}</p>
                  <p className="mt-2 text-xs text-[#929b91]">{metric.change}</p>
                </div>
              )
            })}
          </section>

          <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="rounded-2xl border border-[#e8e4d9] bg-white p-6 xl:col-span-2">
              <div className="flex items-center justify-between">
                <div><h3 className="font-bold">Business performance</h3><p className="mt-1 text-xs text-[#929b91]">Your financial activity will appear here.</p></div>
                <button className="rounded-lg border border-[#e8e4d9] px-3 py-2 text-xs">This month <ChevronDown className="ml-2 inline" size={13}/></button>
              </div>
              <div className="flex h-56 flex-col items-center justify-center text-center">
                <ChartNoAxesCombined size={38} className="text-[#b6c2b4]"/>
                <p className="mt-3 text-sm font-semibold">No transactions yet</p>
                <p className="mt-1 text-xs text-[#929b91]">Create your first transaction to see business analytics.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-[#e8e4d9] bg-white p-6">
              <h3 className="font-bold">Quick actions</h3>
              <p className="mt-1 text-xs text-[#929b91]">Common business operations</p>
              <div className="mt-5 space-y-3">
                {[
                  {name:'Create sales invoice',icon:Receipt,page:'Sales'},
                  {name:'Record purchase',icon:ShoppingBag,page:'Purchases'},
                  {name:'Add new product',icon:Boxes,page:'Inventory'},
                  {name:'Add customer',icon:Users,page:'Customers'},
                ].map(action => {
                  const Icon = action.icon
                  return <button key={action.name} onClick={() => setActive(action.page)} className="flex w-full items-center gap-3 rounded-xl border border-[#eeeae0] p-3 text-left text-sm font-medium hover:bg-[#f5f3eb]"><Icon size={18} className="text-[#42664a]"/>{action.name}<ArrowUpRight size={15} className="ml-auto text-[#9aa398]"/></button>
                })}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-[#e8e4d9] bg-white p-6">
            <div className="flex items-center justify-between">
              <div><h3 className="font-bold">Recent transactions</h3><p className="mt-1 text-xs text-[#929b91]">Your latest business activity</p></div>
              <button onClick={() => setActive('Reports')} className="text-xs font-semibold text-[#31583e]">View reports →</button>
            </div>
            <div className="flex h-32 items-center justify-center text-sm text-[#929b91]">No transactions recorded yet.</div>
          </section>

          <footer className="py-8 text-center text-xs text-[#929b91]">SmartLedger Pro · Business management platform</footer>
        </div>
        )}
      </main>
      {menuOpen && <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-30 bg-black/30 md:hidden"/>}
    </div>
  )
}

export default App
