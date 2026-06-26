import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (!error && data) {
        setProfile(data);
        setBio(data.bio || "");
        setLocation(data.location || "");
      }
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const { error } = await supabase
      .from("profiles")
      .update({ bio, location, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setSaving(false);
    setMessage(error ? error.message : "Profile saved!");
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    setMessage("");

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setUploading(false);
      setMessage(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    setUploading(false);
    if (updateError) {
      setMessage(updateError.message);
    } else {
      setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
      setMessage("Photo updated!");
    }
  }

  if (loading)
    return <p className="text-center py-16 text-gray-600">Loading...</p>;

  if (!user)
    return (
      <p className="text-center py-16 text-gray-600">
        Please{" "}
        <Link to="/login" className="text-kala-green font-medium">
          log in
        </Link>{" "}
        to view your profile.
      </p>
    );

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm mt-8">
      {/* Avatar + change photo */}
      <div className="flex items-center gap-4 mb-6">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Your avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-kala-orange text-white flex items-center justify-center text-2xl font-semibold">
            {(profile?.full_name || "?").trim().charAt(0).toUpperCase()}
          </div>
        )}
        <label className="text-sm text-kala-green font-medium cursor-pointer">
          {uploading ? "Uploading..." : "Change photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </label>
      </div>

      <h2 className="text-2xl font-bold text-kala-charcoal mb-1">
        {profile?.full_name || "Your Profile"}
      </h2>
      {profile?.role ? (
        <span className="inline-block bg-kala-cream text-kala-green text-sm font-medium px-3 py-1 rounded-full mb-6 capitalize">
          {profile.role}
        </span>
      ) : (
        <p className="text-sm text-gray-500 mb-6">
          No role yet —{" "}
          <Link to="/role-selection" className="text-kala-orange font-medium">
            choose one
          </Link>
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-kala-charcoal mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell people about yourself..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-kala-charcoal mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Village / City"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
          />
        </div>

        {message && (
          <p className="text-sm text-kala-green font-medium">{message}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-kala-orange text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#a8551f] transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

export default Profile;