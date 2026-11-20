import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

type Row = Record<string, unknown>;

export default function Analytics() {
  const [data, setData] = useState<{month:string;sales:number;purchases:number;expenses:number}[]>([]);

  useEffect(() => {
    const read = (key:string):Row[] => {
      try {
        const v = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(v) ? v : [];
      } catch { return []; }
    };
    const groups:Record<string,{month:string;sales:number;purchases:number;expenses:number}> = {};
    const add = (key:string, field:'sales'|'purchases'|'expenses', amount:(x:Row)=>number) => {
      read(key).forEach(x => {
        const date = String(x.date || '');
        if (!date) return;
        const month = date.slice(0,7);
        groups[month] ||= {month,sales:0,purchases:0,expenses:0};
        groups[month][field] += amount(x);
      });
    };
    add('smartledger-pro-sales','sales',x=>Number(x.total)||0);
    add('smartledger-pro-purchases','purchases',x=>Number(x.total)||Number(x.qty)*Number(x.rate)||0);
    add('smartledger-pro-expenses','expenses',x=>Number(x.amount)||0);
    setData(Object.values(groups).sort((a,b)=>a.month.localeCompare(b.month)).slice(-12));
  }, []);

  const money = (n:number)=>`₹${n.toLocaleString('en-IN')}`;

  return <section className="space-y-5">
    <div><h1 className="text-2xl font-bold">Business Analytics</h1><p className="text-sm text-gray-500">Monthly trends from recorded transactions.</p></div>
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold">Monthly Performance</h2>
      {data.length ? <div className="h-80 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value)=>money(Number(value))} /><Legend /><Bar dataKey="sales" name="Sales" fill="#1b4332" /><Bar dataKey="purchases" name="Purchases" fill="#b08968" /><Bar dataKey="expenses" name="Expenses" fill="#d97757" /></BarChart></ResponsiveContainer></div> : <p className="py-12 text-center text-gray-500">Add dated transactions to view analytics.</p>}
    </div>
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-3 font-semibold">Monthly Data</h2>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-gray-500"><th className="p-2">Month</th><th className="p-2">Sales</th><th className="p-2">Purchases</th><th className="p-2">Expenses</th></tr></thead><tbody>{data.map(x=><tr className="border-b" key={x.month}><td className="p-2">{x.month}</td><td className="p-2">{money(x.sales)}</td><td className="p-2">{money(x.purchases)}</td><td className="p-2">{money(x.expenses)}</td></tr>)}</tbody></table></div>
    </div>
  </section>;
}
