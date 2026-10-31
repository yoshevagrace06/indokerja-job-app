import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  Briefcase,
  Building2,
  Send,
  CheckCircle2,
  AlertCircle,
  ListChecks,
  ClipboardCheck,
  Gift,
  Lock,
  Unlock,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  jobType: string;
  isOpen: boolean;
  company?: {
    companyName: string;
    description?: string;
    userId?: string;
  };
}

const SECTION_LABELS = [
  { key: "About the Company", icon: Building2 },
  { key: "Responsibilities", icon: ListChecks },
  { key: "Requirements", icon: ClipboardCheck },
  { key: "Benefits", icon: Gift },
];

function parseDescription(description: string) {
  const sections: { label: string; icon: typeof Building2; content: string }[] = [];

  const remaining = description;
  const labelPattern = SECTION_LABELS.map((s) => s.key).join("|");
  const regex = new RegExp(`(${labelPattern})\\n`, "g");

  const matches = [...remaining.matchAll(regex)];
  if (matches.length === 0) {
    return null;
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const label = current[1];
    const startIdx = current.index! + current[0].length;
    const endIdx = i + 1 < matches.length ? matches[i + 1].index! : remaining.length;
    const content = remaining.slice(startIdx, endIdx).trim();
    const meta = SECTION_LABELS.find((s) => s.key === label);
    sections.push({ label, icon: meta?.icon ?? Building2, content });
  }

  return sections;
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => {
        setJob(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat detail lowongan");
        setLoading(false);
      });
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setApplyMessage("");
    try {
      await api.post("/applications", { jobId: id });
      setApplyMessage("Berhasil melamar pekerjaan ini!");
      setApplySuccess(true);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Gagal melamar. Silakan coba lagi.";
      setApplyMessage(Array.isArray(msg) ? msg.join(", ") : msg);
      setApplySuccess(false);
    } finally {
      setApplying(false);
    }
  };

  const handleToggle = async () => {
    if (!job) return;
    setToggling(true);
    try {
      const res = await api.patch(`/jobs/${job.id}/toggle`);
      setJob((prev) => (prev ? { ...prev, isOpen: res.data.isOpen } : prev));
    } catch {
      // gagal toggle, diamkan saja biar user bisa coba lagi
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
        <p className="max-w-2xl mx-auto text-gray-400 text-sm">Memuat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!job) return null;

  const infoItems = [
    { icon: MapPin, value: job.location },
    { icon: Wallet, value: job.salary },
    { icon: Briefcase, value: job.jobType },
  ];

  const parsedSections = parseDescription(job.description);
  const isJobSeeker = user?.role === "JOB_SEEKER";
  const isCompany = user?.role === "COMPANY";
  const isOwner = isCompany && user?.id === job.company?.userId;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 mb-5 animate-fade-in"
        >
          <ArrowLeft size={16} />
          Kembali ke daftar lowongan
        </Link>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 animate-fade-slide-up">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-6">
                <Briefcase size={26} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {job.title}
                </h1>
                <p className="flex items-center gap-1.5 text-gray-500 mt-1">
                  <Building2 size={15} />
                  {job.company?.companyName ?? "Perusahaan"}
                </p>
              </div>
            </div>

            {!job.isOpen && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full flex-shrink-0">
                <Lock size={12} />
                Ditutup
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {infoItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700 animate-fade-in"
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                  <Icon size={14} />
                  {item.value}
                </span>
              );
            })}
          </div>

          <div className="mb-8 animate-fade-in delay-200">
            <h2 className="font-bold text-gray-900 mb-4 text-lg">
              Deskripsi Pekerjaan
            </h2>

            {parsedSections ? (
              <div className="space-y-5">
                {parsedSections.map((section, i) => {
                  const Icon = section.icon;
                  return (
                    <div key={i}>
                      <h3 className="flex items-center gap-2 font-bold text-gray-900 text-sm mb-1.5">
                        <Icon size={15} className="text-blue-500" />
                        {section.label}
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm pl-6">
                        {section.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                {job.description}
              </p>
            )}
          </div>

          {/* Tombol Apply — hanya untuk Job Seeker */}
          {isJobSeeker && (
            <>
              <button
                onClick={handleApply}
                disabled={applying || applySuccess || !job.isOpen}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:pointer-events-none disabled:hover:translate-y-0"
              >
                {!job.isOpen ? (
                  <>
                    <Lock size={18} />
                    Lowongan Ditutup
                  </>
                ) : applySuccess ? (
                  <>
                    <CheckCircle2 size={18} />
                    Sudah Dilamar
                  </>
                ) : applying ? (
                  "Mengirim..."
                ) : (
                  <>
                    <Send size={18} />
                    Apply Sekarang
                  </>
                )}
              </button>

              {applyMessage && (
                <div
                  className={`flex items-center gap-2 mt-4 text-sm font-medium px-4 py-2.5 rounded-xl animate-fade-in ${
                    applySuccess
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-red-50 text-red-600 border border-red-100"
                  }`}
                >
                  {applySuccess ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  {applyMessage}
                </div>
              )}
            </>
          )}

          {/* Tombol toggle — hanya untuk Company pemilik job ini */}
          {isOwner && (
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:pointer-events-none ${
                job.isOpen
                  ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
              }`}
            >
              {toggling ? (
                "Memproses..."
              ) : job.isOpen ? (
                <>
                  <Lock size={18} />
                  Tutup Lowongan
                </>
              ) : (
                <>
                  <Unlock size={18} />
                  Buka Lagi Lowongan
                </>
              )}
            </button>
          )}

          {/* Info untuk Company yang bukan pemilik job ini */}
          {isCompany && !isOwner && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl">
              <Briefcase size={16} />
              Kamu melihat ini sebagai akun Company — hanya Job Seeker yang
              dapat melamar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}