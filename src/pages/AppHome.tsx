import { useEffect, useMemo, useState } from "react";
import { apiGET, apiPOST, apiPATCH, apiDELETE } from "../lib/api";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addDays,
} from "date-fns";
import { useNavigate } from "react-router-dom";


type Task = {
  id: string;
  type: "STUDY" | "HOME" | "WORK" | "OTHER";
  title: string;
  details?: string | null;
  dueAt: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  estimatedMinutes?: number | null;
};

const TYPES: Task["type"][] = ["STUDY", "HOME", "WORK", "OTHER"];

function colorByDeadline(dueISO: string) {
  const now = new Date();
  const due = new Date(dueISO);
  const diffDays = Math.ceil((+due - +now) / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) return "border-red-500/70";
  if (diffDays <= 3) return "border-yellow-500/70";
  if (diffDays <= 7) return "border-green-500/70";
  return "border-white/10";
}

export default function AppHome() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { 
      navigate("/login"); // lock
    }
  }, [navigate]);
  const [monthDate, setMonthDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<null | Task>(null);
  const [form, setForm] = useState({
    type: "STUDY" as Task["type"],
    title: "",
    details: "",
    dueAt: "",
    estimatedMinutes: "" as string | number,
  });

  // ép type Date[]
  const days: Date[] = useMemo(() => {
    const from = startOfMonth(monthDate);
    const to = endOfMonth(monthDate);
    return eachDayOfInterval({ start: from, end: to });
  }, [monthDate]);

  const fetchMonth = async () => {
    setLoading(true);
    try {
      const from = format(startOfMonth(monthDate), "yyyy-MM-dd");
      const to = format(endOfMonth(monthDate), "yyyy-MM-dd");
      const data = await apiGET<Task[]>("/tasks", { from, to });
      setTasks(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonth();
  }, [monthDate]);

  const activities = tasks
    .filter((t) => t.status !== "DONE")
    .sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt));

 const submitTask = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const body = {
      type: form.type,
      title: form.title,
      details: form.details || undefined,
      dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined,
      estimatedMinutes: form.estimatedMinutes ? Number(form.estimatedMinutes) : undefined,
    };

    if (editing) {
      // UPDATE
      const updated = await apiPATCH<Task>(`/tasks/${editing.id}`, body);
      setTasks(prev => prev.map(t => t.id === editing.id ? updated : t));
    } else {
      // CREATE
      const created = await apiPOST<Task>("/tasks", body);
      setTasks(prev => [...prev, created]);
    }
    // onClick={() =>  {setOpenModal(false); setEditing(null);}}
    // setOpenModal(false);
    // setEditing(null);
    setForm({ type: "STUDY", title: "", details: "", dueAt: "", estimatedMinutes: "" });
  } catch (err: any) {
    alert(err.message);
  }
  
};


  const toggleDone = async (task: Task) => {
    const nextStatus = task.status === "DONE" ? "TODO" : "DONE";
    const updated = await apiPATCH<Task>(`/tasks/${task.id}`, {
      status: nextStatus,
    });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
  };

  const removeTask = async (task: Task) => {
    if (!confirm("Xoá task này?")) return;
    await apiDELETE(`/tasks/${task.id}`);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex h-14 items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-white/10" />
          <span className="text-white/70">Student Time</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-white/15 px-3 py-1 text-sm hover:bg-white/10"
            onClick={() => setMonthDate(addDays(monthDate, -30))}
          >
            ◀ Tháng trước
          </button>
          <button
            className="rounded-md border border-white/15 px-3 py-1 text-sm hover:bg-white/10"
            onClick={() => setMonthDate(new Date())}
          >
            Hôm nay
          </button>
          <button
            className="rounded-md border border-white/15 px-3 py-1 text-sm hover:bg-white/10"
            onClick={() => setMonthDate(addDays(monthDate, 30))}
          >
            Tháng sau ▶
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Calendar */}
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              View my calendar — {format(monthDate, "MM/yyyy")}
            </h2>
            <button
              onClick={() => setOpenModal(true)}
              className="rounded-xl bg-yellow-400 px-4 py-2 text-black font-medium hover:brightness-95"
            >
              + Thêm việc
            </button>
          </div>

          


          <div className="grid grid-cols-7 gap-2">
            {days.map((d: Date) => {
              const dayTasks = tasks.filter((t) =>
                isSameDay(new Date(t.dueAt), d)
              );
              {dayTasks.slice(0, 3).map(t => (
            <button
              key={t.id}
              onClick={() => { setEditing(t); setForm({
                type: t.type, title: t.title,
                details: t.details ?? "",
                dueAt: new Date(t.dueAt).toISOString().slice(0,16), // datetime-local value
                estimatedMinutes: t.estimatedMinutes ?? ""
              }); setOpenModal(true); }}
              className="w-full text-left rounded bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
            >
              <span className="text-yellow-300">{t.title}</span>
              <div className="text-[10px] text-white/60">
                {format(new Date(t.dueAt), "HH:mm dd/MM")}
              </div>
            </button>
          ))}
              let borderClass = "border-white/10";
              if (dayTasks.length) {
                const soonest = dayTasks[0];
                borderClass = colorByDeadline(soonest.dueAt);
              }
              return (
                <div
                  key={d.toISOString()}
                  className={`rounded-lg border p-2 ${borderClass}`}
                >
                  <div className="mb-1 text-sm text-white/60">
                    {format(d, "dd/MM")}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="rounded bg-white/5 px-2 py-1 text-xs"
                      >
                        <span className="text-yellow-300">{t.title}</span>
                        <div className="text-[10px] text-white/60">
                          {format(new Date(t.dueAt), "HH:mm dd/MM")}
                        </div>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-[11px] text-white/50">
                        +{dayTasks.length - 3} tasks
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {loading && <p className="mt-3 text-white/60">Đang tải…</p>}
        </section>

        {/* Activities */}
        <aside>
          <h2 className="mb-3 text-xl font-semibold">View my activities</h2>
          <div className="space-y-2">
            {activities.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-white/60">
                      {t.type} • Hết hạn:{" "}
                      {format(new Date(t.dueAt), "HH:mm dd/MM")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleDone(t)}
                      className="rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                    >
                      {t.status === "DONE" ? "↩︎ Undo" : "✓ Done"}
                    </button>
                    <button
                      onClick={() => { setEditing(t); setForm({
                        type: t.type, title: t.title,
                        details: t.details ?? "",
                        dueAt: new Date(t.dueAt).toISOString().slice(0,16),
                        estimatedMinutes: t.estimatedMinutes ?? ""
                      }); setOpenModal(true); }}
                      className="rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                      >
                      Sửa
                    </button>

                    <button
                      onClick={() => removeTask(t)}
                      className="rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10 text-red-300"
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!activities.length && (
              <p className="text-white/50">Chưa có việc nào cần làm.</p>
            )}
          </div>
        </aside>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <form
            onSubmit={submitTask}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6"
          >
            <h3 className="mb-4 text-lg font-semibold">Thêm việc</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <label className="text-sm w-28 text-white/70">Phân loại</label>
                <select
                  className="flex-1 rounded border border-white/15 bg-black px-2 py-1"
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value as Task["type"] }))
                  }
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <label className="text-sm w-28 text-white/70">Tên công việc</label>
                <input
                  className="flex-1 rounded border border-white/15 bg-black px-2 py-1"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex gap-2">
                <label className="text-sm w-28 text-white/70">Hạn</label>
                <input
                  type="datetime-local"
                  className="flex-1 rounded border border-white/15 bg-black px-2 py-1"
                  value={form.dueAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dueAt: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex gap-2">
                <label className="text-sm w-28 text-white/70">
                  Ước lượng (phút)
                </label>
                <input
                  type="number"
                  min={1}
                  className="flex-1 rounded border border-white/15 bg-black px-2 py-1"
                  value={form.estimatedMinutes}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      estimatedMinutes: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/70">
                  Chi tiết
                </label>
                <textarea
                  className="w-full rounded border border-white/15 bg-black px-2 py-1"
                  rows={3}
                  value={form.details}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, details: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
              type="button"
              onClick={() => { 
                setOpenModal(false); 
                setEditing(null); 
              }}
              className="rounded-md border border-white/20 px-3 py-1 hover:bg-white/10"
            >
              Huỷ
            </button>
              <button
                type="submit"
                className="rounded-md bg-yellow-400 px-3 py-1 text-black"
              >
                {editing ? "Cập nhật" : "Lưu"}
              </button>
            </div>


            

          </form>
        </div>
      )}
    </div>
  );
}
