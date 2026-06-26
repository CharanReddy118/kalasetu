import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else navigate("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm mt-8">
      <h2 className="text-2xl font-bold text-kala-charcoal mb-6 text-center">
        {t("login_welcome")}
      </h2>
      <div className="space-y-4">
        <input
          type="email"
          placeholder={t("login_email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        <input
          type="password"
          placeholder={t("login_password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-kala-orange text-white font-semibold py-2 rounded-lg hover:bg-[#a8551f] transition disabled:opacity-60"
        >
          {loading ? t("login_loading") : t("login_button")}
        </button>
      </div>
      <p className="text-center text-gray-600 mt-4 text-sm">
        {t("login_new_here")}{" "}
        <Link to="/signup" className="text-kala-green font-medium">
          {t("login_create_account")}
        </Link>
      </p>
    </div>
  );
}

export default Login;