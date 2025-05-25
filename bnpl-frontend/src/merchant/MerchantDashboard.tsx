// src/merchant/MerchantDashboard.tsx
import React, { useEffect, useState } from "react";
import api from "../api/client";
import ProgressBar from "../components/ProgressBar";
import { toast } from "react-toastify";

/* ---------- Types -------------------------------------------------- */
interface Installment {
  id: number;
  amount: string;                   // backend returns decimals as strings
  due_date: string;
  status: "pending" | "paid" | "late";
}

interface Plan {
  id: number;
  total_amount: string;
  customer: { email: string };
  installments: Installment[];
}

interface Analytics {
  total_revenue: number;
  overdue_installments: number;
  success_rate: number;
}

/* ---------- Component --------------------------------------------- */
export default function MerchantDashboard() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [stats, setStats] = useState<Analytics>({
    total_revenue: 0,
    overdue_installments: 0,
    success_rate: 0,
  });

  /* Fetch plans + analytics */
  const fetchData = async () => {
    try {
      const { data: planList } = await api.get<Plan[]>("/plans/");
      const { data: metrics }  = await api.get<Analytics>("/analytics/merchant/");
      setPlans(planList);
      setStats(metrics);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load merchant data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Merchant Dashboard</h1>

      <div className="text-right">
        <a href="/merchant/create-plan" className="btn btn-outline btn-sm">
          + Create New Plan
        </a>
      </div>

      {/* Analytics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <StatCard title="Total Revenue"        value={`${stats.total_revenue} ريال`} accent="text-green-600" />
        <StatCard title="Overdue Installments" value={stats.overdue_installments}   accent="text-red-600"   />
        <StatCard title="Success Rate"         value={`${stats.success_rate}%`}      accent="text-blue-600"  />
      </div>

      {/* Plans list */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Your BNPL Plans</h2>

        {plans.length === 0 && (
          <p className="text-gray-500">You haven’t created any plans yet.</p>
        )}

        {plans.map((plan) => {
          const paid  = plan.installments.filter(i => i.status === "paid").length;
          const total = plan.installments.length;

          return (
            <div key={plan.id} className="border rounded p-4 shadow space-y-3">
              <h3 className="text-lg font-medium">{plan.customer.email}</h3>
              <p>Total: {plan.total_amount} ريال</p>
              <ProgressBar value={paid} total={total} />

              {/* Installments mini-table */}
              <table className="w-full text-sm border mt-2">
                <thead className="bg-base-200">
                  <tr>
                    <th className="p-1">Due</th>
                    <th className="p-1">Amount</th>
                    <th className="p-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.installments.map(inst => (
                    <tr key={inst.id}>
                      <td className="p-1">{inst.due_date}</td>
                      <td className="p-1">{inst.amount}</td>
                      {/* ← color-code the status cell: */}
                      <td
                        className={`p-1 font-semibold ${
                          inst.status === "paid"   ? "text-green-600" :
                          inst.status === "late"   ? "text-red-600"   :
                                                     "text-gray-700"
                        }`}
                      >
                        {inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </section>
    </main>
  );
}

/* ---------- Small helper ----------------------------------------- */
function StatCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-medium">{title}</h2>
      <p className={`text-2xl font-bold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
