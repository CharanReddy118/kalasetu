import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import MessageButton from "../components/MessageButton";

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full capitalize ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function ArtisanDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("artisan_id", user.id)
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) return <p className="text-gray-500">Loading your products...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-kala-charcoal">
          My Products ({products.length})
        </h3>
        <Link to="/add-product" className="text-kala-orange font-medium">
          + Add Product
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="text-gray-500">You haven't listed any products yet.</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between"
            >
              <span className="text-kala-charcoal">{p.title}</span>
              {p.price != null && (
                <span className="text-kala-orange font-semibold">₹{p.price}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function YouthDashboard({ user }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("applications")
        .select("*, opportunities(title)")
        .eq("applicant_id", user.id)
        .order("created_at", { ascending: false });
      setApps(data || []);
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) return <p className="text-gray-500">Loading your applications...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-kala-charcoal">
          My Applications ({apps.length})
        </h3>
        <Link to="/opportunities" className="text-kala-orange font-medium">
          Browse opportunities
        </Link>
      </div>
      {apps.length === 0 ? (
        <p className="text-gray-500">You haven't applied to anything yet.</p>
      ) : (
        <div className="space-y-3">
          {apps.map((a) => (
            <div
              key={a.id}
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <span className="text-kala-charcoal">
                {a.opportunities?.title || "Opportunity"}
              </span>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BuyerDashboard({ user }) {
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase
      .from("opportunities")
      .select("*, applications(*, profiles(full_name, location))")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });
    setOpps(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [user]);

  async function setStatus(appId, status) {
    await supabase.from("applications").update({ status }).eq("id", appId);
    load();
  }

  if (loading) return <p className="text-gray-500">Loading your postings...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-kala-charcoal">
          My Opportunities ({opps.length})
        </h3>
        <Link to="/post-opportunity" className="text-kala-orange font-medium">
          + Post Opportunity
        </Link>
      </div>
      {opps.length === 0 ? (
        <p className="text-gray-500">You haven't posted any opportunities yet.</p>
      ) : (
        <div className="space-y-6">
          {opps.map((op) => (
            <div key={op.id} className="bg-white p-5 rounded-xl shadow-sm">
              <h4 className="font-semibold text-kala-charcoal mb-1">
                {op.title}
              </h4>
              <p className="text-sm text-gray-500 mb-3">
                {op.applications.length} applicant
                {op.applications.length === 1 ? "" : "s"}
              </p>

              {op.applications.length > 0 && (
                <div className="space-y-2">
                  {op.applications.map((app) => (
                    <div
                      key={app.id}
                      className="border border-gray-100 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-kala-charcoal">
                          {app.profiles?.full_name || "Applicant"}
                        </span>
                        <StatusBadge status={app.status} />
                      </div>
                      {app.message && (
                        <p className="text-sm text-gray-600 mt-1">
                          {app.message}
                        </p>
                      )}

                      {/* Message Button added right here */}
                      <div className="mt-2">
                        <MessageButton otherUserId={app.applicant_id} label="Message" />
                      </div>

                      {app.status === "pending" && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setStatus(app.id, "accepted")}
                            className="text-sm bg-kala-green text-white px-3 py-1 rounded-lg hover:bg-[#24543d]"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => setStatus(app.id, "rejected")}
                            className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({ products: 0, applications: 0, opportunities: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    async function loadEverything() {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const [p, a, o] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("artisan_id", user.id),
        supabase.from("applications").select("id", { count: "exact", head: true }).eq("applicant_id", user.id),
        supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("buyer_id", user.id),
      ]);

      setCounts({
        products: p.count || 0,
        applications: a.count || 0,
        opportunities: o.count || 0,
      });
      setLoading(false);
    }
    loadEverything();
  }, [user]);

  if (loading) return <p className="text-center py-16 text-gray-600">Loading...</p>;
  if (!user)
    return (
      <p className="text-center py-16 text-gray-600">
        Please log in to see your dashboard.
      </p>
    );

  const hasAnything =
    counts.products > 0 || counts.applications > 0 || counts.opportunities > 0;

  return (
    <div className="py-4">
      <h2 className="text-3xl font-bold text-kala-charcoal mb-1">Dashboard</h2>
      <p className="text-gray-500 mb-8">
        Welcome back, {profile?.full_name || "there"}.
      </p>

      <div className="space-y-10">
        {counts.products > 0 && <ArtisanDashboard user={user} />}
        {counts.applications > 0 && <YouthDashboard user={user} />}
        {counts.opportunities > 0 && <BuyerDashboard user={user} />}

        <div className="bg-kala-cream rounded-xl p-6">
          <h3 className="font-semibold text-kala-charcoal mb-3">Quick actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/add-product" className="bg-kala-orange text-white px-4 py-2 rounded-lg hover:bg-[#a8551f] transition">
              + Sell a Product
            </Link>
            <Link to="/opportunities" className="bg-kala-green text-white px-4 py-2 rounded-lg hover:bg-[#24543d] transition">
              Find Work
            </Link>
            <Link to="/post-opportunity" className="bg-white border border-gray-300 text-kala-charcoal px-4 py-2 rounded-lg hover:border-kala-orange transition">
              Post an Opportunity
            </Link>
          </div>
        </div>

        {!hasAnything && (
          <p className="text-gray-500 text-center">
            Nothing here yet — sell a product, find work, or post an opportunity to get started.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;