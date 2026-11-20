import { useEffect, useState } from 'react';

type Payment = { id: string; date: string; type: string; party: string; amount: number; method: string; reference: string; note: string };

export default function Payments() {
  const [items, setItems] = useState<Payment[]>([]);
  const [type, setType] = useState('Customer Receipt');
  const [party, setParty] = useState('');
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('Cash');
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('smartledger-pro-payments') || '[]'));
  }, []);

  function save() {
    if (!party.trim() || amount <= 0 || !date) return alert('Enter party, date and a valid amount.');
    const next = [{ id: crypto.randomUUID(), date, type, party: party.trim(), amount, method, reference, note }, ...items];
    setItems(next);
    localStorage.setItem('smartledger-pro-payments', JSON.stringify(next));
    setParty(''); setAmount(0); setReference(''); setNote('');
  }

  const receipts = items.filter(x=>x.type==='Customer Receipt').reduce((s,x)=>s+x.amount,0);
  const paid = items.filter(x=>x.type==='Supplier Payment').reduce((s,x)=>s+x.amount,0);
  const money = (n:number)=>`₹${n.toLocaleString('en-IN',{maximumFractionDigits:2})}`;

  return <section className="space-y-5">
    <div><h1 className="text-2xl font-bold">Payments & Receipts</h1><p className="text-sm text-gray-500">Record money received from customers and paid to suppliers.</p></div>
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl bg-white p-4 shadow-sm"><p className="text-sm text-gray-500">Customer Receipts</p><strong className="text-xl">{money(receipts)}</strong></div>
      <div className="rounded-xl bg-white p-4 shadow-sm"><p className="text-sm text-gray-500">Supplier Payments</p><strong className="text-xl">{money(paid)}</strong></div>
      <div className="rounded-xl bg-white p-4 shadow-sm"><p className="text-sm text-gray-500">Transactions</p><strong className="text-xl">{items.length}</strong></div>
    </div>
    <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
      <h2 className="font-semibold">New Transaction</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Transaction type<select className="mt-1 w-full rounded-lg border p-3" value={type} onChange={e=>setType(e.target.value)}><option>Customer Receipt</option><option>Supplier Payment</option></select></label>
        <label className="text-sm">Date<input type="date" className="mt-1 w-full rounded-lg border p-3" value={date} onChange={e=>setDate(e.target.value)} /></label>
        <input className="rounded-lg border p-3" placeholder="Customer / Supplier name" value={party} onChange={e=>setParty(e.target.value)} />
        <input className="rounded-lg border p-3" type="number" min="0" placeholder="Amount" value={amount} onChange={e=>setAmount(Number(e.target.value))} />
        <label className="text-sm">Payment method<select className="mt-1 w-full rounded-lg border p-3" value={method} onChange={e=>setMethod(e.target.value)}>{['Cash','UPI','Bank Transfer','Cheque','Card','Other'].map(x=><option key={x}>{x}</option>)}</select></label>
        <input className="rounded-lg border p-3" placeholder="Reference / UTR / Cheque number" value={reference} onChange={e=>setReference(e.target.value)} />
        <input className="rounded-lg border p-3 sm:col-span-2" placeholder="Notes (optional)" value={note} onChange={e=>setNote(e.target.value)} />
      </div>
      <button onClick={save} className="rounded-lg bg-green-900 px-5 py-3 text-white">Save Transaction</button>
    </div>
    <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
      <h2 className="font-semibold">Transaction History</h2>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-gray-500"><th className="p-2">Date</th><th className="p-2">Type</th><th className="p-2">Party</th><th className="p-2">Method</th><th className="p-2">Reference</th><th className="p-2">Amount</th></tr></thead><tbody>{items.map(x=><tr key={x.id} className="border-b"><td className="p-2">{x.date}</td><td className="p-2">{x.type}</td><td className="p-2">{x.party}</td><td className="p-2">{x.method}</td><td className="p-2">{x.reference}</td><td className="p-2">{money(x.amount)}</td></tr>)}</tbody></table></div>
      {items.length===0 && <p className="py-5 text-center text-gray-500">No transactions yet.</p>}
    </div>
  </section>;
}
