import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, FileText, User, LogOut, PlusCircle, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive(path)
        ? "bg-blue-50 text-blue-600"
        : "text-gray-500 hover:text-blue-600 hover:bg-blue-50/60"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="w-full px-6 flex items-center justify-between h-16">
        <Link
          to={user.role === "JOB_SEEKER" ? "/dashboard" : "/jobs"}
          className="flex items-center gap-2 group"
        >
          <div className="bg-blue-600 text-white p-1.5 rounded-lg transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6">
            <Briefcase size={18} />
          </div>
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">
            IndoKerja.id
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {user.role === "JOB_SEEKER" && (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link to="/jobs" className={linkClass("/jobs")}>
                <Briefcase size={16} />
                <span className="hidden sm:inline">Lowongan</span>
              </Link>
              <Link to="/my-applications" className={linkClass("/my-applications")}>
                <FileText size={16} />
                <span className="hidden sm:inline">Lamaran Saya</span>
              </Link>
            </>
          )}

          {user.role === "COMPANY" && (
            <>
              <Link to="/jobs" className={linkClass("/jobs")}>
                <Briefcase size={16} />
                <span className="hidden sm:inline">Lowongan</span>
              </Link>
              <Link to="/jobs/create" className={linkClass("/jobs/create")}>
                <PlusCircle size={16} />
                <span className="hidden sm:inline">Buat Lowongan</span>
              </Link>
            </>
          )}

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 hover:bg-blue-50/60 group"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold transition-transform duration-200 group-hover:scale-110">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700 group-hover:text-blue-600">
                {user.name}
              </span>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/60 py-1.5 animate-fade-in">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50/60 hover:text-blue-600 transition-colors duration-150"
                >
                  <User size={16} />
                  Profil Saya
                </Link>
                <div className="h-px bg-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 w-full text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}