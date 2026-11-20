import { useEffect, useState } from 'react';

type Row = Record<string, unknown>;

export default function Reports() {
  const [sales, setSales] = useState<Row[]>([]);
  const [purchases, setPurchases] = useState<Row[]>([]);
  const [expenses, setExpenses] = useState<Row[]>([]);
  const [payments, setPayments] = useState<Row[]>([]);

  useEffect(() => {
    const read = (key: string): Row[] => {
      try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value : [];
      } catch { return []; }
    };
    setSales(read('smartledger-pro-sales'));
    setPurchases(read('smartledger-pro-purchases'));
    setExpenses(read('smartledger-pro-expenses'));
    setPayments(read('smartledger-pro-payments'));
  }, []);

  const num = (v: unknown) => Number(v) || 0;
  const salesTotal = sales.reduce((s,x)=>s+num(x.total),0);
  const purchaseTotal = purchases.reduce((s,x)=>s+num(x.total || x.amount) || s+num(x.qty)*num(x.rate),0);
  const expenseTotal = expenses.reduce((s,x)=>s+num(x.amount),0);
  const received = payments.filter(x=>x.type==='Customer Receipt').reduce((s,x)=>s+num(x.amount),0);
  const supplierPaid = payments.filter(x=>x.type==='Supplier Payment').reduce((s,x)=>s+num(x.amount),0);
  const salesPaid = sales.reduce((s,x)=>s+num(x.paid),0);
  const purchasePaid = purchases.reduce((s,x)=>s+num(x.paid),0);
  const customerDue = sales.reduce((s,x)=>s+num(x.balance),0);
  const supplierDue = purchases.reduce((s,x)=>s+Math.max(0,num(x.total || x.amount || (num(x.qty)*num(x.rate))-num(x.paid))),0);
  const netMovement = salesPaid + received - purchasePaid - supplierPaid - expenseTotal;
  const money = (n:number)=>`₹${n.toLocaleString('en-IN',{maximumFractionDigits:2})}`;

  const cards = [
    ['Sales Revenue',salesTotal],
    ['Purchase Value',purchaseTotal],
    ['Business Expenses',expenseTotal],
    ['Customer Outstanding',customerDue],
    ['Supplier Outstanding',supplierDue],
    ['Estimated Cash Movement',netMovement]
  ];

  return <section className="space-y-5">
    <div><h1 className="text-2xl font-bold">Financial Reports</h1><p className="text-sm text-gray-500">Summary based on records currently stored in this device.</p></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(([label,value])=><div key={String(label)} className="rounded-xl bg-white p-4 shadow-sm"><p className="text-sm text-gray-500">{label}</p><strong className="text-xl">{money(Number(value))}</strong></div>)}
    </div>
    <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
      <h2 className="font-semibold text-lg">Transaction Summary</h2>
      <div className="divide-y text-sm">
        {[
          ['Sales invoices',sales.length],
          ['Purchase entries',purchases.length],
          ['Expense entries',expenses.length],
          ['Payment transactions',payments.length],
          ['Customer receipts',money(received)],
          ['Supplier payments',money(supplierPaid)]
        ].map(([label,value])=><div key={String(label)} className="flex justify-between gap-3 py-3"><span>{label}</span><strong>{value}</strong></div>)}
      </div>
    </div>
    <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
      These figures are operational summaries, not a finalized profit-and-loss statement. Accurate profit requires item-level cost of goods sold, returns, opening stock, tax treatment and reconciled party ledgers. Cash movement is an estimate and may include duplicate receipts or payments if the same transaction is recorded in both an invoice and Payments.
    </div>
  </section>;
}
