// src/user/PayInstallment.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

const PayInstallment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const handlePay = async () => {
    try {
      /* ✅ correct URL */
      await api.post(`plans/installments/${id}/pay/`);
      setMsg("✅ Installment paid!");
      setTimeout(() => navigate("/user"), 1200);
    } catch (e) {
      setMsg("❌ Payment failed (already paid or not due).");
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Pay Installment #{id}</h1>
      <button className="btn btn-primary mt-4" onClick={handlePay}>
        Confirm Payment
      </button>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </main>
  );
};

export default PayInstallment;
