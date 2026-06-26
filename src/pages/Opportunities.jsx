import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabaseClient";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false });
      if (!error && data) setOpportunities(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return <p className="text-center py-16 text-gray-600">Loading...</p>;

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-kala-charcoal">Opportunities</h2>
        <Link
          to="/post-opportunity"
          className="bg-kala-orange text-white font-semibold px-5 py-2 rounded-lg hover:bg-[#a8551f] transition"
        >
          + Post Opportunity
        </Link>
      </div>

      {opportunities.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No opportunities yet.</p>
      ) : (
        <div className="space-y-4">
          {opportunities.map((op) => (
            <Link
              key={op.id}
              to={`/opportunities/${op.id}`}
              className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-kala-charcoal">
                  {op.title}
                </h3>
                {op.type && (
                  <span className="text-xs bg-kala-cream text-kala-green px-3 py-1 rounded-full capitalize">
                    {op.type}
                  </span>
                )}
              </div>
              {op.description && (
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {op.description}
                </p>
              )}
              <div className="flex gap-4 text-sm text-gray-400 mt-3">
                {op.budget != null && (
                  <span className="text-kala-orange font-semibold">
                    ₹{op.budget}
                  </span>
                )}
                {op.location && <span>{op.location}</span>}
                <span>by {op.profiles?.full_name || "Unknown"}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Opportunities;