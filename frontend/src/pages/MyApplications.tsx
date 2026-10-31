import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  Briefcase,
  Building2,
  Calendar,
  FileText,
} from "lucide-react";
import api from "../api/axios";

interface Application {
  id: string;
  status: string;
  appliedAt: string;
  job: {
    title: string;
    location: string;
    salary: string;
    jobType: string;
    company?: {
      companyName: string;
    };
  };
}

const statusColor: Record<string, string> = {
  APPLIED: "bg-gray-100 text-gray-700",
  REVIEWING: "bg-yellow-100 text-yellow-700",
  SHORTLISTED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  ACCEPTED: "bg-green-100 text-green-700",
};

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/applications/me")
      .then((res) => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat daftar lamaran");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
        <p className="max-w-3xl mx-auto text-gray-400 text-sm">Memuat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
        <div className="max-w-3xl mx-auto bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-slide-up">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Lamaran Saya
            </h1>
            <p className="text-gray-500 mt-1">
              {applications.length} lowongan telah kamu lamar
            </p>
          </div>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:gap-2.5 transition-all duration-200"
          >
            <ArrowLeft size={14} />
            Lihat semua lowongan
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center animate-fade-in delay-100">
            <FileText size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm mb-4">
              Kamu belum melamar pekerjaan apapun.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-200"
            >
              Jelajahi Lowongan
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app, i) => (
              <div
                key={app.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100 hover:border-blue-200 animate-fade-slide-up group"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white">
                      <Briefcase size={20} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 truncate">
                        {app.job.title}
                      </h2>
                      <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                        <Building2 size={13} />
                        {app.job.company?.companyName ?? "Perusahaan"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${
                      statusColor[app.status] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
                    <MapPin size={12} />
                    {app.job.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
                    <Wallet size={12} />
                    {app.job.salary}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
                    <Briefcase size={12} />
                    {app.job.jobType}
                  </span>
                </div>

                <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
                  <Calendar size={12} />
                  Dilamar pada {new Date(app.appliedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}