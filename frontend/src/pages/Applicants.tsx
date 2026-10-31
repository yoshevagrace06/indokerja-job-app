import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Mail,
  CalendarDays,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  getApplicantsByJob,
  updateApplicationStatus,
  type Applicant,
} from "../api/applications";

const STATUSES = [
  "APPLIED",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
];

const STATUS_STYLE: Record<string, string> = {
  APPLIED: "bg-gray-100 text-gray-700 border-gray-200",
  REVIEWING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  SHORTLISTED: "bg-blue-100 text-blue-700 border-blue-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  ACCEPTED: "bg-green-100 text-green-700 border-green-200",
};

const STATUS_LABEL: Record<string, string> = {
  APPLIED: "Applied",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Applicants() {
  const { jobId } = useParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const loadApplicants = async () => {
    if (!jobId) return;
    try {
      setLoading(true);
      setError("");
      const data = await getApplicantsByJob(jobId);
      setApplicants(data);
    } catch (err: any) {
      setError(
        `Status: ${err.response?.status} | Message: ${JSON.stringify(err.response?.data)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [jobId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string,
  ) => {
    setUpdatingId(applicationId);
    setOpenDropdownId(null);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === applicationId
            ? { ...a, status: newStatus as Applicant["status"] }
            : a,
        ),
      );
    } catch (err: any) {
      setError(
        `Status: ${err.response?.status} | Message: ${JSON.stringify(err.response?.data)}`,
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
        <p className="max-w-3xl mx-auto text-gray-400 text-sm">
          Memuat data pelamar...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
      <div ref={containerRef} className="max-w-3xl mx-auto">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200 mb-5"
        >
          <ArrowLeft size={16} />
          Kembali ke daftar lowongan
        </Link>

        <div className="flex items-center gap-3 mb-6 animate-fade-slide-up">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Daftar Pelamar
            </h1>
            <p className="text-sm text-gray-500">
              {applicants.length} orang melamar pada lowongan ini
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 break-words animate-fade-in">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {applicants.length === 0 && !error && (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center animate-fade-in">
            <Users size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              Belum ada yang melamar untuk lowongan ini.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {applicants.map((a, i) => {
            const isOpen = openDropdownId === a.id;
            return (
              <div
                key={a.id}
                className={`relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
                  animate-fade-slide-up
                  transition-[box-shadow,border-color] duration-300 ease-out
                  hover:shadow-lg hover:shadow-blue-100 hover:border-blue-200
                  ${isOpen ? "z-20" : "z-0"}`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center flex-shrink-0 transition-transform duration-200 ease-out hover:scale-110">
                    {getInitials(a.jobSeeker.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {a.jobSeeker.name}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-gray-500 truncate">
                      <Mail size={13} className="flex-shrink-0" />
                      {a.jobSeeker.email}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <CalendarDays size={12} className="flex-shrink-0" />
                      Melamar:{" "}
                      {new Date(a.appliedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border min-w-[90px] text-center transition-colors duration-300 ease-out ${STATUS_STYLE[a.status]}`}
                  >
                    {STATUS_LABEL[a.status]}
                  </span>

                  <div className="relative">
                    <button
                      type="button"
                      disabled={updatingId === a.id}
                      onClick={() =>
                        setOpenDropdownId((prev) =>
                          prev === a.id ? null : a.id,
                        )
                      }
                      className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-2 min-w-[118px]
                        transition-[border-color,color] duration-200 ease-out
                        hover:border-blue-300 hover:text-blue-600
                        disabled:opacity-50"
                    >
                      {updatingId === a.id ? (
                        <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      ) : (
                        <>
                          Ubah Status
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ease-out ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </>
                      )}
                    </button>

                    {isOpen && (
                      <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-gray-100 bg-white shadow-xl shadow-blue-100/60 overflow-hidden z-50 origin-top-right animate-dropdown-in">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleStatusChange(a.id, s)}
                            className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm text-gray-700
                              transition-colors duration-150 ease-out
                              hover:bg-blue-50 hover:text-blue-600"
                          >
                            {STATUS_LABEL[s]}
                            {a.status === s && (
                              <Check size={14} className="text-blue-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
