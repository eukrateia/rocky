import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = schema.safeParse(form);
    if (!parsed.success) return setError(parsed.error.errors[0].message);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-xl">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-blue-300">Get started</p>
        <h1 className="mb-8 text-3xl font-bold">Create account</h1>
        {error && <p className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        <input className="mb-3 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="mb-3 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="mb-6 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500">Create account</button>
        <p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link className="text-blue-300" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
