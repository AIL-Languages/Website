"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicUser } from "@/lib/auth/types";
import type { Payment, PaymentStatus } from "@/lib/ops/payments";

type Filter = "all" | PaymentStatus;

const labels: Record<PaymentStatus, string> = {
  pagado: "🟢 Pagado",
  pendiente: "⚪ Pendiente",
  vencido: "🔴 Vencido",
  por_verificar: "🟡 Por verificar",
};

type Props = {
  payments: Payment[];
  students: PublicUser[];
  canManage: boolean;
};

export function PaymentsBoard({ payments, students, canManage }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState(false);

  const visible = useMemo(
    () => (filter === "all" ? payments : payments.filter((item) => item.status === filter)),
    [filter, payments],
  );

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const student = students.find((item) => item.id === data.studentId);
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, studentName: student?.name }),
    });
    setOpen(false);
    router.refresh();
  }

  async function markPaid(id: string) {
    await fetch(`/api/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pagado" }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["all", "pagado", "pendiente", "vencido", "por_verificar"] as Filter[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              filter === item ? "bg-navy text-white" : "bg-white text-navy"
            }`}
          >
            {item === "all" ? "Todos" : labels[item]}
          </button>
        ))}
        {canManage ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="ml-auto rounded-full bg-cyan px-4 py-1.5 text-sm font-semibold text-navy-deep"
          >
            + Registrar pago
          </button>
        ) : null}
      </div>

      {open && canManage ? (
        <form onSubmit={onCreate} className="grid gap-3 rounded-[1.5rem] bg-white p-6 sm:grid-cols-2">
          <select name="studentId" required className="rounded-xl border border-navy/10 px-4 py-3">
            <option value="">Alumno</option>
            {students.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input name="concept" required placeholder="Concepto" className="rounded-xl border border-navy/10 px-4 py-3" />
          <input name="amount" required placeholder="Monto, ej. 2600" className="rounded-xl border border-navy/10 px-4 py-3" />
          <input name="dueDate" type="date" className="rounded-xl border border-navy/10 px-4 py-3" />
          <select name="method" className="rounded-xl border border-navy/10 px-4 py-3">
            <option value="transferencia">Transferencia</option>
            <option value="deposito">Depósito</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="efectivo">Efectivo</option>
          </select>
          <select name="status" defaultValue="pendiente" className="rounded-xl border border-navy/10 px-4 py-3">
            <option value="pendiente">Pendiente</option>
            <option value="por_verificar">Por verificar</option>
            <option value="pagado">Pagado</option>
          </select>
          <input name="notes" placeholder="Observación" className="rounded-xl border border-navy/10 px-4 py-3 sm:col-span-2" />
          <button className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white sm:col-span-2">
            Guardar pago
          </button>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-[1.75rem] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-mist text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Alumno</th>
                <th className="px-5 py-3 font-semibold">Concepto</th>
                <th className="px-5 py-3 font-semibold">Monto</th>
                <th className="px-5 py-3 font-semibold">Fecha</th>
                <th className="px-5 py-3 font-semibold">Método</th>
                <th className="px-5 py-3 font-semibold">Estatus</th>
                <th className="px-5 py-3 font-semibold">Comprobante</th>
                {canManage ? <th className="px-5 py-3 font-semibold">Acciones</th> : null}
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id} className="border-t border-navy/8">
                  <td className="px-5 py-3">
                    {canManage ? (
                      <Link
                        href={`/dashboard/pagos/alumno/${item.studentId}`}
                        className="font-semibold text-navy hover:text-cyan"
                      >
                        {item.studentName}
                      </Link>
                    ) : (
                      item.studentName
                    )}
                  </td>
                  <td className="px-5 py-3">{item.concept}</td>
                  <td className="px-5 py-3">${item.amount}</td>
                  <td className="px-5 py-3 text-muted">
                    {item.paidAt || item.dueDate || "—"}
                  </td>
                  <td className="px-5 py-3">{item.method || "—"}</td>
                  <td className="px-5 py-3">{labels[item.status]}</td>
                  <td className="px-5 py-3">
                    {item.documentId ? (
                      <a
                        href={`/api/documents/${item.documentId}/file`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-cyan"
                      >
                        📄 Ver
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  {canManage ? (
                    <td className="px-5 py-3">
                      {item.status !== "pagado" ? (
                        <button
                          type="button"
                          onClick={() => markPaid(item.id)}
                          className="text-sm font-semibold text-navy"
                        >
                          Marcar pagado
                        </button>
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
