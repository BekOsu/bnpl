// src/merchant/CreatePlanForm.tsx
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../api/client";

type PlanPayload = {
  customer_email: string;
  total_amount: number | string;
  num_installments: number | string;
  start_date: string;            // "YYYY-MM-DD"
};

export default function CreatePlanForm() {
  const { register, handleSubmit, reset } = useForm<PlanPayload>();
  const queryClient = useQueryClient();

  const createPlan = useMutation({
    mutationFn: (payload: PlanPayload) => api.post("plans/", payload), // 🛠 /plans/
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });          // 🛠 new API
      toast.success("✅ BNPL plan created!");
      reset();
    },
    onError: () => toast.error("❌ Failed to create plan. Check customer email."),
  });

  return (
    <form
      onSubmit={handleSubmit((d) => createPlan.mutate(d))}
      className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded shadow"
    >
      <input {...register("customer_email")} placeholder="Customer Email" className="input input-bordered w-full" />
      <input {...register("total_amount")}  placeholder="Total Amount"     type="number" className="input input-bordered w-full" />
      <input {...register("num_installments")} placeholder="# Installments" type="number" className="input input-bordered w-full" />
      <input {...register("start_date")} placeholder="Start Date" type="date" className="input input-bordered w-full" />
      <button type="submit" className="btn btn-primary w-full">Create Plan</button>
    </form>
  );
}
