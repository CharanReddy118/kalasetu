import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

function PostOpportunity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("job");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!user) return;
    if (!title) {
      setError("Please enter a title.");
      return;
    }
    setError("");
    setLoading(true);
    const { error } = await supabase.from("opportunities").insert({
      buyer_id: user.id,
      title,
      description,
      type,
      budget: budget ? Number(budget) : null,
      location,
    });
    setLoading(false);
    if (error) setError(error.message);
    else navigate("/opportunities");
  }

  if (!user)
    return (
      <p className="text-center py-16 text-gray-600">
        Please log in to post an opportunity.
      </p>
    );

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm mt-8">
      <h2 className="text-2xl font-bold text-kala-charcoal mb-6">
        Post an Opportunity
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title (e.g. Logo design needed)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        <textarea
          placeholder="Describe the work..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        >
          <option value="job">Job</option>
          <option value="project">Freelance Project</option>
        </select>
        <input
          type="number"
          placeholder="Budget (₹)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        <input
          type="text"
          placeholder="Location (or 'Remote')"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-kala-orange text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#a8551f] transition disabled:opacity-60"
        >
          {loading ? "Posting..." : "Post Opportunity"}
        </button>
      </div>
    </div>
  );
}

export default PostOpportunity;