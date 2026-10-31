import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Wallet,
  Clock,
  FileText,
  Building2,
  ListChecks,
  ClipboardCheck,
  Gift,
  ChevronDown,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";
import api from "../api/axios";

const PROVINCES = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Sumatera Selatan",
  "Bangka Belitung",
  "Bengkulu",
  "Lampung",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Banten",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Sulawesi Tengah",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Gorontalo",
  "Sulawesi Barat",
  "Maluku",
  "Maluku Utara",
  "Papua",
  "Papua Barat",
];

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
];

interface FormData {
  title: string;
  location: string;
  salary: string;
  jobType: string;
  aboutCompany: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
}

interface FormErrors {
  [key: string]: string;
}

type OpenDropdown = "location" | "jobType" | null;

export default function CreateJob() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const containerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    title: "",
    location: "",
    salary: "",
    jobType: "",
    aboutCompany: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatRupiah = (digits: string) => {
    if (!digits) return "";
    return Number(digits).toLocaleString("id-ID");
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, salary: raw }));
    if (errors.salary) setErrors((prev) => ({ ...prev, salary: "" }));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.title.trim()) next.title = "Job title wajib diisi";
    if (!form.location) next.location = "Lokasi wajib dipilih";
    if (!form.salary) next.salary = "Salary wajib diisi";
    if (!form.jobType) next.jobType = "Job type wajib dipilih";
    if (!form.aboutCompany.trim())
      next.aboutCompany = "About the Company wajib diisi";
    if (!form.responsibilities.trim())
      next.responsibilities = "Responsibilities wajib diisi";
    if (!form.requirements.trim())
      next.requirements = "Requirements wajib diisi";
    if (!form.benefits.trim()) next.benefits = "Benefits wajib diisi";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    const description = [
      `About the Company\n${form.aboutCompany.trim()}`,
      `Responsibilities\n${form.responsibilities.trim()}`,
      `Requirements\n${form.requirements.trim()}`,
      `Benefits\n${form.benefits.trim()}`,
    ].join("\n\n");

    setLoading(true);
    try {
      await api.post("/jobs", {
        title: form.title.trim(),
        location: form.location,
        salary: form.salary,
        jobType: form.jobType,
        description,
      });
      navigate("/jobs");
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message || "Gagal membuat lowongan. Coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  const reveal = (delayMs: number) => ({
    className: `transition-all duration-500 ease-out ${
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`,
    style: { transitionDelay: `${delayMs}ms` },
  });

  const selectedJobType = JOB_TYPES.find((j) => j.value === form.jobType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div
          {...reveal(0)}
          className={`mb-8 flex items-center gap-4 ${reveal(0).className}`}
        >
          <div className="group w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 transition-transform duration-300 hover:scale-110 hover:rotate-6">
            <Briefcase className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Buat Lowongan Baru
            </h1>
            <p className="text-sm text-gray-500">
              Lengkapi detail lowongan dengan jelas agar kandidat tertarik
            </p>
          </div>
        </div>

        {submitError && (
          <div
            {...reveal(50)}
            className={`mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 ${reveal(50).className}`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {submitError}
          </div>
        )}

        <form
          ref={containerRef}
          onSubmit={handleSubmit}
          className="relative bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-gray-100 p-6 sm:p-8 space-y-6"
        >
          {/* Job Title */}
          <div {...reveal(80)}>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Briefcase className="w-4 h-4 text-blue-500" />
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Contoh: Frontend Developer"
              className={`w-full rounded-xl border px-4 py-2.5 text-gray-800 outline-none transition-all duration-200
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-300
                ${errors.title ? "border-red-400" : "border-gray-200"}`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Location — custom dropdown */}
          <div
            {...reveal(120)}
            className={`relative z-30 ${reveal(120).className}`}
          >
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <MapPin className="w-4 h-4 text-blue-500" />
              Location (Provinsi) <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "location" ? null : "location",
                )
              }
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all duration-200
                hover:border-blue-300 focus:ring-2 focus:ring-blue-400
                ${errors.location ? "border-red-400" : "border-gray-200"}`}
            >
              <span
                className={form.location ? "text-gray-800" : "text-gray-400"}
              >
                {form.location || "Pilih provinsi"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  openDropdown === "location" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "location" && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-gray-100 bg-white shadow-xl shadow-blue-100/60 overflow-hidden">
                <div className="max-h-60 overflow-y-auto py-1">
                  {PROVINCES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        handleChange("location", p);
                        setOpenDropdown(null);
                      }}
                      className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm text-gray-700 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {p}
                      {form.location === p && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {errors.location && (
              <p className="mt-1 text-xs text-red-500">{errors.location}</p>
            )}
          </div>

          {/* Salary */}
          <div {...reveal(160)}>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Wallet className="w-4 h-4 text-blue-500" />
              Salary (per bulan) <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center rounded-xl border transition-all duration-200 overflow-hidden
                focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 hover:border-blue-300
                ${errors.salary ? "border-red-400" : "border-gray-200"}`}
            >
              <span className="pl-4 pr-2 text-gray-500 font-medium select-none">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={formatRupiah(form.salary)}
                onChange={handleSalaryChange}
                placeholder="5.000.000"
                className="w-full py-2.5 pr-4 text-gray-800 outline-none"
              />
            </div>
            {errors.salary && (
              <p className="mt-1 text-xs text-red-500">{errors.salary}</p>
            )}
          </div>

          {/* Job Type — custom dropdown */}
          <div
            {...reveal(200)}
            className={`relative z-20 ${reveal(200).className}`}
          >
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              Job Type <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((prev) =>
                  prev === "jobType" ? null : "jobType",
                )
              }
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all duration-200
                hover:border-blue-300 focus:ring-2 focus:ring-blue-400
                ${errors.jobType ? "border-red-400" : "border-gray-200"}`}
            >
              <span
                className={selectedJobType ? "text-gray-800" : "text-gray-400"}
              >
                {selectedJobType?.label || "Pilih job type"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  openDropdown === "jobType" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "jobType" && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-gray-100 bg-white shadow-xl shadow-blue-100/60 overflow-hidden">
                {JOB_TYPES.map((jt) => (
                  <button
                    key={jt.value}
                    type="button"
                    onClick={() => {
                      handleChange("jobType", jt.value);
                      setOpenDropdown(null);
                    }}
                    className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm text-gray-700 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {jt.label}
                    {form.jobType === jt.value && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
            {errors.jobType && (
              <p className="mt-1 text-xs text-red-500">{errors.jobType}</p>
            )}
          </div>

          {/* Description — 4 bagian */}
          <div
            {...reveal(240)}
            className={`relative z-0 space-y-5 ${reveal(240).className}`}
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-gray-800 pt-2 border-t border-gray-100">
              <FileText className="w-4 h-4 text-blue-500" />
              Job Description
            </p>

            <DescField
              icon={<Building2 className="w-4 h-4 text-blue-500" />}
              label="About the Company"
              value={form.aboutCompany}
              onChange={(v) => handleChange("aboutCompany", v)}
              error={errors.aboutCompany}
              placeholder="Ceritakan tentang perusahaan kamu..."
            />
            <DescField
              icon={<ListChecks className="w-4 h-4 text-blue-500" />}
              label="Responsibilities"
              value={form.responsibilities}
              onChange={(v) => handleChange("responsibilities", v)}
              error={errors.responsibilities}
              placeholder="Apa saja tanggung jawab di posisi ini..."
            />
            <DescField
              icon={<ClipboardCheck className="w-4 h-4 text-blue-500" />}
              label="Requirements"
              value={form.requirements}
              onChange={(v) => handleChange("requirements", v)}
              error={errors.requirements}
              placeholder="Kualifikasi yang dibutuhkan..."
            />
            <DescField
              icon={<Gift className="w-4 h-4 text-blue-500" />}
              label="Benefits"
              value={form.benefits}
              onChange={(v) => handleChange("benefits", v)}
              error={errors.benefits}
              placeholder="Apa yang didapat kandidat..."
            />
          </div>

          {/* Submit */}
          <div
            {...reveal(280)}
            className={`relative z-0 ${reveal(280).className}`}
          >
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-medium py-3 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Buat Lowongan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DescField({
  icon,
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
        {icon}
        {label} <span className="text-red-500">*</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={`w-full rounded-xl border px-4 py-2.5 text-gray-800 outline-none transition-all duration-200 resize-none
          focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-300
          ${error ? "border-red-400" : "border-gray-200"}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
