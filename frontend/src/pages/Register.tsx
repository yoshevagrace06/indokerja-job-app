import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Briefcase,
  Building2,
  UserPlus,
  Sparkles,
} from "lucide-react";
import api from "../api/axios";

type Role = "JOB_SEEKER" | "COMPANY";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("JOB_SEEKER");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload: Record<string, string> = { name, email, password, role };
      if (role === "COMPANY" && companyName.trim()) {
        payload.companyName = companyName.trim();
      }

      await api.post("/auth/register", payload);
      navigate("/login", {
        state: { registered: true, email },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white px-4 py-10 overflow-hidden">
      <div className="absolute top-[5%] left-[5%] text-blue-300 animate-float">
        <Briefcase size={54} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[7%] left-[40%] text-indigo-300 animate-float delay-500">
        <Sparkles size={32} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[12%] right-[8%] text-indigo-300 animate-float delay-300">
        <Building2 size={46} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[20%] left-[22%] text-blue-200 animate-float delay-600">
        <Sparkles size={26} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[24%] right-[30%] text-indigo-200 animate-float delay-200">
        <Lock size={28} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[6%] left-[9%] text-blue-300 animate-float delay-200">
        <UserPlus size={50} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[4%] left-[38%] text-indigo-300 animate-float delay-400">
        <Briefcase size={32} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[12%] right-[6%] text-indigo-300 animate-float delay-400">
        <Lock size={42} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[22%] right-[36%] text-blue-200 animate-float delay-700">
        <Sparkles size={24} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[34%] left-[3%] text-blue-200 animate-float delay-100">
        <User size={68} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[40%] right-[3%] text-indigo-200 animate-float delay-500">
        <Mail size={60} strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-[2%] right-[22%] text-blue-300 animate-float delay-200">
        <Building2 size={34} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[3%] right-[32%] text-indigo-300 animate-float delay-400">
        <UserPlus size={30} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[62%] left-[18%] text-blue-200 animate-float delay-600">
        <Sparkles size={30} strokeWidth={1.5} />
      </div>
      <div className="absolute top-[58%] right-[16%] text-indigo-200 animate-float delay-700">
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
          <p className="text-gray-500 text-sm mt-1">Buat akun baru</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/70 border border-gray-100 animate-fade-slide-up delay-150 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-1"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Daftar akun
            </h2>
            <p className="text-sm text-gray-500">
              Pilih peranmu dan lengkapi datanya
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-5 animate-fade-in">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Daftar sebagai
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("JOB_SEEKER")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 hover:-translate-y-0.5 ${
                  role === "JOB_SEEKER"
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-300"
                    : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
                }`}
              >
                <User size={16} />
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole("COMPANY")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 hover:-translate-y-0.5 ${
                  role === "COMPANY"
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-300"
                    : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
                }`}
              >
                <Building2 size={16} />
                Company
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative group">
              <User
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 group-focus-within:text-blue-600 group-focus-within:scale-110"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Nama kamu"
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {role === "COMPANY" && (
            <div className="mb-4 animate-fade-in">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Perusahaan
              </label>
              <div className="relative group">
                <Building2
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 group-focus-within:text-blue-600 group-focus-within:scale-110"
                />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="PT Contoh Indonesia"
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
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
                minLength={6}
                placeholder="Minimal 6 karakter"
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
                <UserPlus size={18} />
                Daftar
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6 animate-fade-in delay-300">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition-colors duration-200"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}