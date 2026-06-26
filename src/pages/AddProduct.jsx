import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
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

    let imageUrl = null;

    // 1. If a photo was chosen, upload it to the storage bucket first.
    if (file) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file);

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      // 2. Get the public URL of the file we just uploaded.
      const { data } = supabase.storage.from("products").getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    // 3. Save the product row (storing the image URL, not the file).
    const { error: insertError } = await supabase.from("products").insert({
      artisan_id: user.id,
      title,
      description,
      price: price ? Number(price) : null,
      image_url: imageUrl,
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
    } else {
      navigate("/marketplace");
    }
  }

  if (!user)
    return (
      <p className="text-center py-16 text-gray-600">
        Please log in to add a product.
      </p>
    );

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm mt-8">
      <h2 className="text-2xl font-bold text-kala-charcoal mb-6">
        Add a Product
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-kala-orange"
        />
        <div>
          <label className="block text-sm font-medium text-kala-charcoal mb-1">
            Product photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-kala-orange text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#a8551f] transition disabled:opacity-60"
        >
          {loading ? "Publishing..." : "Publish Product"}
        </button>
      </div>
    </div>
  );
}

export default AddProduct;