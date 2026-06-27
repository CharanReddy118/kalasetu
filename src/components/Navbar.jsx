import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

function Navbar() {
  const { user, signOut } = useAuth();
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (!user) {
      setAvatarUrl(null);
      return;
    }
    supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setAvatarUrl(data?.avatar_url || null));
  }, [user]);

  const linkStyle = ({ isActive }) =>
    isActive
      ? "text-kala-orange font-semibold"
      : "text-kala-charcoal hover:text-kala-orange transition";

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  // The language toggle — shows the language you'll switch TO.
  const langButton = (
    <button
      onClick={toggleLang}
      title="Switch language"
      className="text-sm border border-gray-300 rounded-lg px-3 py-1 text-kala-charcoal hover:border-kala-orange transition shrink-0"
    >
      {lang === "en" ? "తెలుగు" : "English"}
    </button>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        <NavLink to="/" className="text-2xl font-bold text-kala-orange shrink-0">
          A2B-SETU
        </NavLink>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <NavLink to="/" end className={linkStyle}>{t("nav_home")}</NavLink>
              <NavLink to="/marketplace" className={linkStyle}>{t("nav_marketplace")}</NavLink>
              <NavLink to="/opportunities" className={linkStyle}>{t("nav_opportunities")}</NavLink>
              <NavLink to="/chat" className={linkStyle}>{t("nav_messages")}</NavLink>
              <NavLink to="/dashboard" className={linkStyle}>{t("nav_dashboard")}</NavLink>
              {langButton}
              <NavLink
                to="/profile"
                title="Your profile"
                className="w-9 h-9 rounded-full overflow-hidden bg-kala-orange text-white flex items-center justify-center font-semibold text-sm hover:opacity-90 transition shrink-0"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="You" className="w-full h-full object-cover" />
                ) : (
                  initials(user.user_metadata?.full_name || user.email)
                )}
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-kala-green text-white px-4 py-2 rounded-lg hover:bg-[#24543d] transition shrink-0"
              >
                {t("nav_logout")}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" end className={linkStyle}>{t("nav_home")}</NavLink>
              <NavLink to="/login" className={linkStyle}>{t("nav_login")}</NavLink>
              {langButton}
              <NavLink
                to="/signup"
                className="bg-kala-green text-white px-4 py-2 rounded-lg hover:bg-[#24543d] transition shrink-0"
              >
                {t("nav_signup")}
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;