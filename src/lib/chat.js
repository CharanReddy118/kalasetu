import { supabase } from "./supabaseClient";

// Returns the id of the conversation between two users,
// creating it if it doesn't exist yet.
export async function startConversation(currentUserId, otherUserId) {
  // Always store the pair in the same order (sorted) so we never
  // create two conversations for the same two people.
  const [userA, userB] = [currentUserId, otherUserId].sort();

  // 1. Look for an existing conversation.
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_a", userA)
    .eq("user_b", userB)
    .maybeSingle();

  if (existing) return existing.id;

  // 2. None found — create one.
  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ user_a: userA, user_b: userB })
    .select("id")
    .single();

  if (error) throw error;
  return created.id;
}