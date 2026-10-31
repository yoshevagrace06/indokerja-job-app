import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Wallet, Briefcase, Users, PlusCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface Job {
  id: string;
  title: string;
  location: string;
  salary: string;
  jobType: string;
  company?: {
    companyName: string;
  };
}

export default function JobList() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/jobs")
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Gagal memuat daftar lowongan");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
        <p className="max-w-6xl mx-auto text-gray-400 text-sm">Memuat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
        <div className="max-w-6xl mx-auto bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-slide-up">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Daftar Lowongan
            </h1>
            <p className="text-gray-500 mt-1">
              {jobs.length} lowongan tersedia saat ini
            </p>
          </div>
          {user?.role === "COMPANY" && (
            <Link
              to="/jobs/create"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200"
            >
              <PlusCircle size={16} />
              Buat Lowongan
            </Link>
          )}
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center animate-fade-in delay-100">
            <Briefcase size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Belum ada lowongan tersedia.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, i) => (
              <div
                key={job.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-100 hover:border-blue-200 animate-fade-slide-up group"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <Link to={`/jobs/${job.id}`} className="block">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white">
                    <Briefcase size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {job.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-3">
                    {job.company?.companyName ?? "Perusahaan"}
                  </p>
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} className="text-gray-400" />
                      {job.location}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Wallet size={14} className="text-gray-400" />
                      {job.salary}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase size={14} className="text-gray-400" />
                      {job.jobType}
                    </p>
                  </div>
                </Link>

                {user?.role === "COMPANY" && (
                  <Link
                    to={`/jobs/${job.id}/applicants`}
                    className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-blue-600 border border-blue-100 rounded-lg py-2 transition-all duration-200 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Users size={14} />
                    Lihat Pelamar
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}