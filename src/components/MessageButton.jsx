import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { startConversation } from "../lib/chat";

function MessageButton({ otherUserId, label = "Message" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Hide the button if you're logged out or it's your own listing.
  if (!user || !otherUserId || user.id === otherUserId) return null;

  async function handleClick() {
    setLoading(true);
    try {
      const conversationId = await startConversation(user.id, otherUserId);
      navigate(`/chat/${conversationId}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-kala-green text-white px-4 py-2 rounded-lg hover:bg-[#24543d] transition disabled:opacity-60"
    >
      {loading ? "Opening..." : label}
    </button>
  );
}

export default MessageButton;