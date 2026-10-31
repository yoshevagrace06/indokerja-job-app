import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Clock, CheckCircle2, XCircle, Search, ArrowRight } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface ApplicationItem {
  id: string;
  status: "APPLIED" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "ACCEPTED";
  appliedAt: string;
  job: {
    title: string;
    location: string;
    company?: { companyName: string };
  };
}

const STATUS_COLOR: Record<string, string> = {
  APPLIED: "bg-gray-100 text-gray-700",
  REVIEWING: "bg-yellow-100 text-yellow-700",
  SHORTLISTED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  ACCEPTED: "bg-green-100 text-green-700",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/applications/me")
      .then((res) => setApplications(res.data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const total = applications.length;
  const reviewing = applications.filter((a) => a.status === "REVIEWING").length;
  const accepted = applications.filter((a) => a.status === "ACCEPTED").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;

  const recent = [...applications]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  const stats = [
    { label: "Total Lamaran", value: total, icon: Briefcase, color: "blue" },
    { label: "Sedang Direview", value: reviewing, icon: Clock, color: "yellow" },
    { label: "Diterima", value: accepted, icon: CheckCircle2, color: "green" },
    { label: "Ditolak", value: rejected, icon: XCircle, color: "red" },
  ];

  const colorMap: Record<string, { bg: string; text: string; shadow: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", shadow: "hover:shadow-blue-100" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", shadow: "hover:shadow-yellow-100" },
    green: { bg: "bg-green-50", text: "text-green-600", shadow: "hover:shadow-green-100" },
    red: { bg: "bg-red-50", text: "text-red-600", shadow: "hover:shadow-red-100" },
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <p className="text-gray-400 text-sm">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 animate-fade-slide-up">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Halo, {user?.name} 👋
          </h1>
          <p className="text-gray-500 mt-1">Ringkasan lamaran kerja kamu</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const c = colorMap[stat.color];
            return (
              <div
                key={stat.label}
                className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${c.shadow} animate-fade-slide-up`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-3 transition-transform duration-300 hover:scale-110 hover:rotate-6`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-4 animate-fade-in delay-300">
          <h2 className="text-lg font-bold text-gray-900">Lamaran Terbaru</h2>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:gap-2.5 transition-all duration-200"
          >
            <Search size={14} />
            Cari Lowongan
            <ArrowRight size={14} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center animate-fade-in delay-400">
            <Briefcase size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm mb-3">
              Kamu belum melamar pekerjaan apapun.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-200"
            >
              Jelajahi Lowongan
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((a, i) => (
              <div
                key={a.id}
                className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-100 animate-fade-slide-up"
                style={{ animationDelay: `${0.3 + i * 0.06}s` }}
              >
                <div>
                  <p className="font-semibold text-gray-900">{a.job.title}</p>
                  <p className="text-sm text-gray-500">
                    {a.job.company?.companyName ?? "Perusahaan"} · {a.job.location}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_COLOR[a.status]}`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}