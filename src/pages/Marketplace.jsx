import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabaseClient";
import MessageButton from "../components/MessageButton";

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      // Fetch products AND the seller's name from the linked profile.
      const { data, error } = await supabase
        .from("products")
        .select("*, profiles(full_name, location)")
        .order("created_at", { ascending: false });
      if (!error && data) setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  if (loading)
    return <p className="text-center py-16 text-gray-600">Loading...</p>;

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-kala-charcoal">Marketplace</h2>
        <Link
          to="/add-product"
          className="bg-kala-orange text-white font-semibold px-5 py-2 rounded-lg hover:bg-[#a8551f] transition"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          No products yet. Be the first to add one!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-kala-cream flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-kala-charcoal">
                  {product.title}
                </h3>
                {product.price != null && (
                  <p className="text-kala-orange font-bold mt-1">
                    ₹{product.price}
                  </p>
                )}
                {product.description && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-3">
                  by {product.profiles?.full_name || "Unknown"}
                  {product.profiles?.location
                    ? ` · ${product.profiles.location}`
                    : ""}
                </p>
                
                {/* Message Artisan Button Container */}
                <div className="mt-3">
                  <MessageButton otherUserId={product.artisan_id} label="Message artisan" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Marketplace;