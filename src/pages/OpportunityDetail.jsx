import MessageButton from "../components/MessageButton";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

function OpportunityDetail() {
  const { id } = useParams(); // grabs the :id from the URL
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("opportunities")
        .select("*, profiles(full_name, location)")
        .eq("id", id)
        .single();
      setOpportunity(data);

      // Has this user already applied?
      if (user) {
        const { data: existing } = await supabase
          .from("applications")
          .select("id")
          .eq("opportunity_id", id)
          .eq("applicant_id", user.id)
          .maybeSingle();
        if (existing) setApplied(true);
      }
      loading && setLoading(false);
    }
    load();
  }, [id, user]);

  async function handleApply() {
    if (!user) return;
    setError("");
    setSubmitting(true);
    const { error } = await supabase.from("applications").insert({
      opportunity_id: id,
      applicant_id: user.id,
      message,
    });
    setSubmitting(false);
    if (error) setError(error.message);
    else setApplied(true);
  }

  if (loading)
    return <p className="text-center py-16 text-gray-600">Loading...</p>;
  if (!opportunity)
    return (
      <p className="text-center py-16 text-gray-600">Opportunity not found.</p>
    );

  const isOwner = user && user.id === opportunity.buyer_id;

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Link to="/opportunities" className="text-kala-green text-sm">
        ← Back to opportunities
      </Link>
      <div className="bg-white p-8 rounded-xl shadow-sm mt-4">
        <h2 className="text-2xl font-bold text-kala-charcoal">
          {opportunity.title}
        </h2>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
          {opportunity.type && (
            <span className="bg-kala-cream text-kala-green px-3 py-1 rounded-full capitalize">
              {opportunity.type}
            </span>
          )}
          {opportunity.budget != null && (
            <span className="text-kala-orange font-semibold">
              ₹{opportunity.budget}
            </span>
          )}
          {opportunity.location && <span>{opportunity.location}</span>}
          <span>Posted by {opportunity.profiles?.full_name || "Unknown"}</span>
        </div>

        {opportunity.description && (
          <p className="mt-4 text-gray-700 whitespace-pre-line">
            {opportunity.description}
          </p>
        )}

        <hr className="my-6 border-gray-200" />

        {/* Message Button Section */}
        {!isOwner && user && (
          <div className="mb-4">
            <MessageButton otherUserId={opportunity.buyer_id} label="Message poster" />
          </div>
        )}

        {isOwner ? (
          <p className="text-gray-500">
            This is your posting. You'll see applicants in your dashboard (coming
            soon).
          </p>
        ) : applied ? (
          <p className="text-kala-green font-medium">
            ✓ You've applied to this opportunity.
          </p>
        ) : (
          <div className="space-y-3">
            <h3 className="font-semibold text-kala-charcoal">Apply</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Write a short message to the poster..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              onClick={handleApply}
              disabled={submitting}
              className="bg-kala-orange text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#a8551f] transition disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OpportunityDetail;