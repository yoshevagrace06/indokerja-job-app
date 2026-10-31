import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Briefcase, LogIn, Sparkles, CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface LocationState {
  registered?: boolean;
  email?: string;
}

export default function Login() {
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const [email, setEmail] = useState(state.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegisteredMsg, setShowRegisteredMsg] = useState(!!state.registered);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowRegisteredMsg(false);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { access_token, user } = res.data;
      login(user, access_token);
      navigate(user.role === "JOB_SEEKER" ? "/dashboard" : "/jobs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white px-4 overflow-hidden">
      <div className="absolute top-[5%] left-[5%] text-blue-300 animate-float">
        <Briefcase size={54} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[8%] left-[42%] text-indigo-300 animate-float delay-500">
        <Sparkles size={34} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[14%] right-[8%] text-indigo-300 animate-float delay-300">
        <Mail size={46} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[22%] left-[20%] text-blue-200 animate-float delay-600">
        <Sparkles size={26} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[26%] right-[28%] text-indigo-200 animate-float delay-200">
        <Lock size={28} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[8%] left-[9%] text-blue-300 animate-float delay-200">
        <LogIn size={50} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[6%] left-[40%] text-indigo-300 animate-float delay-400">
        <Briefcase size={32} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[16%] right-[6%] text-indigo-300 animate-float delay-400">
        <Lock size={42} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[26%] right-[38%] text-blue-200 animate-float delay-700">
        <Sparkles size={24} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[36%] left-[3%] text-blue-200 animate-float delay-100">
        <Briefcase size={68} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[42%] right-[3%] text-indigo-200 animate-float delay-500">
        <Mail size={60} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[2%] right-[24%] text-blue-300 animate-float delay-200">
        <Lock size={36} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[4%] right-[32%] text-indigo-300 animate-float delay-400">
        <LogIn size={32} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[65%] left-[18%] text-blue-200 animate-float delay-600">
        <Sparkles size={30} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[60%] right-[16%] text-indigo-200 animate-float delay-700">
        <Mail size={26} strokeWidth={1.5} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-8 animate-fade-slide-up">
          <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-300 mb-4 transition-all duration-300 hover:scale-125 hover:rotate-6 hover:shadow-xl hover:shadow-blue-300 cursor-pointer">
            <Briefcase size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            IndoKerja.id
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Temukan karier impianmu
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/70 border border-gray-100 animate-fade-slide-up delay-150 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-1"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Selamat datang kembali
            </h2>
            <p className="text-sm text-gray-500">Masuk untuk melanjutkan</p>
          </div>

          {showRegisteredMsg && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-sm px-4 py-2.5 rounded-xl mb-5 animate-fade-in">
              <CheckCircle2 size={16} />
              Registrasi berhasil, silakan login.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-5 animate-fade-in">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative group">
              <Mail
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 group-focus-within:text-blue-600 group-focus-within:scale-110"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nama@email.com"
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative group">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 group-focus-within:text-blue-600 group-focus-within:scale-110"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-2.5 text-sm outline-none transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 hover:scale-125 transition-all duration-200"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              "Memproses..."
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6 animate-fade-in delay-300">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition-colors duration-200"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}