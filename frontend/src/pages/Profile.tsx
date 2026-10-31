import { useEffect, useState } from "react";
import { User, Mail, Shield, Calendar, Building2 } from "lucide-react";
import { getMyProfile, type Profile as ProfileType } from "../api/users";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch((err) => {
        setError(err.response?.data?.message || "Gagal memuat profil");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-400 text-sm">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error || "Profil tidak ditemukan"}
          </div>
        </div>
      </div>
    );
  }

  const initial = profile.name.charAt(0).toUpperCase();
  const joinedDate = new Date(profile.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const infoItems = [
    { icon: User, label: "Nama Lengkap", value: profile.name },
    { icon: Mail, label: "Email", value: profile.email },
    {
      icon: Shield,
      label: "Peran",
      value: profile.role === "COMPANY" ? "Company" : "Job Seeker",
    },
    ...(profile.company
      ? [{ icon: Building2, label: "Perusahaan", value: profile.company.companyName }]
      : []),
    { icon: Calendar, label: "Bergabung sejak", value: joinedDate },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50/40 to-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6 animate-fade-slide-up">
          Profil Saya
        </h1>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 animate-fade-slide-up delay-100">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-blue-200 transition-transform duration-300 hover:scale-105 hover:rotate-3">
              {initial}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 mt-1.5">
                {profile.role === "COMPANY" ? "Company" : "Job Seeker"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            {infoItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 py-3 px-3 rounded-xl transition-all duration-200 hover:bg-blue-50/50 animate-fade-in"
                  style={{ animationDelay: `${0.2 + i * 0.08}s` }}
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 transition-all duration-200 group-hover:bg-blue-50">
                    <Icon size={17} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-medium text-gray-900 text-sm">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}