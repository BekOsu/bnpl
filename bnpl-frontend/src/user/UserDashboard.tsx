// src/user/UserDashboard.tsx
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../api/client";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../auth/useAuth";

/* ────────────── API models ─────────────────────────────────────── */
interface Installment {
  id: number;
  amount: string;
  due_date: string;
  status: "pending" | "paid" | "late";
}

interface Plan {
  id: number;
  total_amount: string;
  customer: { email: string };
  installments: Installment[];
}

/* ────────────── Helper: split into upcoming / past ─────────────── */
const splitInstallments = (insts: Installment[]) => {
  const today = new Date().toISOString().slice(0, 10);
  return {
    upcoming: insts.filter(i => i.due_date >= today),
    past:     insts.filter(i => i.due_date < today),
  };
};

/* ────────────── Component ──────────────────────────────────────── */
const UserDashboard: React.FC = () => {
  const { profile }       = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);

  /* Fetch all plans */
  const loadPlans = async () => {
    try {
      const { data } = await api.get<Plan[]>("plans/");
      setPlans(data);
    } catch (e) {
      console.error(e);
      toast.error("❌ Couldn’t load your plans");
    }
  };

  /* pull mutate + isLoading */
  const { mutate, isLoading } = useMutation({
    mutationFn: (id: number) => api.post(`plans/installments/${id}/pay/`),
    onSuccess: () => {
      toast.success("✅ Installment paid!");
      loadPlans();
    },
    onError: () => {
      toast.error("❌ Payment failed. Try again.");
    },
  });

  useEffect(() => {
    loadPlans();
  }, []);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {profile?.username ? `${profile.username}’s ` : ""}BNPL Plans
      </h1>

      {plans.length === 0 && (
        <p className="text-gray-500">No BNPL plans assigned to you.</p>
      )}

      {plans.map(plan => {
        const paidCount = plan.installments.filter(i => i.status === "paid").length;
        const total     = plan.installments.length;
        const { upcoming, past } = splitInstallments(plan.installments);

        return (
          <section key={plan.id} className="border rounded p-4 shadow space-y-4">
            {/* Header + Progress */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {plan.customer.email} – {plan.total_amount} ريال
              </h2>
              <ProgressBar value={paidCount} total={total} />
            </div>

            {/* Upcoming */}
            <div>
              <h3 className="font-medium mb-2">Upcoming</h3>
              {upcoming.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming installments.</p>
              ) : (
                <InstallmentTable
                  data={upcoming}
                  onPay={mutate}
                  loading={isLoading}
                />
              )}
            </div>

            {/* Past / Paid */}
            <div>
              <h3 className="font-medium mb-2">Past / Paid</h3>
              {past.length === 0 ? (
                <p className="text-sm text-gray-500">None yet.</p>
              ) : (
                <InstallmentTable
                  data={past}
                  onPay={mutate}
                  loading={isLoading}
                />
              )}
            </div>
          </section>
        );
      })}
    </main>
  );
};

export default UserDashboard;

/* ────────────── Subcomponent: InstallmentTable ───────────────── */
interface TableProps {
  data: Installment[];
  onPay: (id: number) => void;
  loading: boolean;
}

function InstallmentTable({ data, onPay, loading }: TableProps) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <table className="w-full text-sm border">
      <thead className="bg-base-200">
        <tr>
          <th className="p-1">Due Date</th>
          <th className="p-1">Amount</th>
          <th className="p-1">Status</th>
          <th className="p-1">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map(inst => (
          <tr key={inst.id}>
            <td className="p-1">{inst.due_date}</td>
            <td className="p-1">{inst.amount}</td>
            <td
              className={`p-1 font-semibold ${
                inst.status === "paid"
                  ? "text-green-600"
                  : inst.status === "late"
                  ? "text-red-600"
                  : ""
              }`}
            >
              {inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
            </td>
            <td className="p-1">
              {inst.status !== "paid" ? (
                <button
                  className="btn btn-xs btn-primary"
                  onClick={() => onPay(inst.id)}
                  disabled={loading}
                >
                  {loading ? "..." : inst.status === "late" ? "Pay Now The Late" : "Pay Now"}
                </button>
              ) : (
                "-"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
