import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = schema.safeParse(form);
    if (!parsed.success) return setError(parsed.error.errors[0].message);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.20),_transparent_35%)]" />
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-xl">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-blue-300">Welcome back</p>
        <h1 className="mb-8 text-3xl font-bold">Sign in</h1>
        {error && <p className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        <input className="mb-3 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="mb-6 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500">Login</button>
        <p className="mt-6 text-center text-sm text-slate-400">No account? <Link className="text-blue-300" to="/register">Create one</Link></p>
      </form>
    </div>
  );
}
