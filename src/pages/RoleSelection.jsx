import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const roles = [
  { id: "artisan", title: "Artisan", desc: "Showcase and sell your crafts." },
  { id: "youth", title: "Skilled Youth", desc: "Find jobs and freelance gigs." },
  { id: "buyer", title: "Buyer / Company", desc: "Hire talent and buy products." },
];

function RoleSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function chooseRole(roleId) {
    if (!user) return;
    setError("");
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ role: roleId, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate("/profile");
    }
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-kala-charcoal text-center mb-2">
        Choose your role
      </h2>
      <p className="text-center text-gray-600 mb-10">
        How would you like to use KalaSetu?
      </p>
      {error && <p className="text-center text-red-600 mb-4">{error}</p>}
      <div className="grid gap-6 md:grid-cols-3">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => chooseRole(role.id)}
            disabled={loading}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-transparent hover:border-kala-orange text-left transition disabled:opacity-60"
          >
            <h3 className="text-xl font-semibold text-kala-orange mb-2">
              {role.title}
            </h3>
            <p className="text-gray-600">{role.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RoleSelection;