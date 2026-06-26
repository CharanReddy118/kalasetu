import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) setError(error.message);
    else navigate("/role-selection");
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm mt-8">
      <h2 className="text-2xl font-bold text-kala-charcoal mb-6 text-center">
        {t("signup_title")}
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder={t("signup_full_name")}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        <input
          type="email"
          placeholder={t("signup_email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        <input
          type="password"
          placeholder={t("signup_password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-kala-orange text-white font-semibold py-2 rounded-lg hover:bg-[#a8551f] transition disabled:opacity-60"
        >
          {loading ? t("signup_loading") : t("signup_button")}
        </button>
      </div>
      <p className="text-center text-gray-600 mt-4 text-sm">
        {t("signup_have_account")}{" "}
        <Link to="/login" className="text-kala-green font-medium">
          {t("signup_login")}
        </Link>
      </p>
    </div>
  );
}

export default Signup;