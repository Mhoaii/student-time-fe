import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPOST } from "../../../lib/api";
import { Link, useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await apiPOST<{ message: string }>("/auth/register", values);
      setServerMsg("Đã gửi email kích hoạt. Vui lòng kiểm tra hộp thư.");
      // Sau 2s điều hướng sang /login
      setTimeout(() => navigate("/login"), 2000);
    } catch (e: any) {
      setServerMsg(e.message || "Có lỗi xảy ra, thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-black text-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <h1 className="mb-2 text-2xl font-semibold">Tạo tài khoản</h1>
        <p className="mb-6 text-sm text-white/70">
          Điền thông tin để nhận email chứa <b>LINK KÍCH HOẠT</b>.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-white/80">Họ tên</label>
            <input
              className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 outline-none ring-yellow-400/0 focus:ring-2"
              placeholder="Nguyễn Văn A"
              {...register("name")}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Email</label>
            <input
              className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/60"
              placeholder="a@example.com"
              type="email"
              {...register("email")}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Mật khẩu</label>
            <input
              className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400/60"
              placeholder="••••••••"
              type="password"
              {...register("password")}
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <button
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-4 py-2 font-medium text-black transition hover:brightness-95 disabled:opacity-60"
            type="submit"
          >
            {loading ? "Đang gửi..." : "Đăng ký"}
          </button>
        </form>

        {serverMsg && (
          <p className="mt-4 text-sm text-yellow-300/90">{serverMsg}</p>
        )}

        <p className="mt-6 text-center text-sm text-white/60">
          Đã có tài khoản?{" "}
          <Link className="text-yellow-300 hover:underline" to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
