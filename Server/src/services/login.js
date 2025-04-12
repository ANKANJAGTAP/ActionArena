import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseServiceKey } from "../config/supabaseConfig.js";
import { generateToken } from "../Utils/jwtUtils.js";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  const { user, session } = data;

  // 👇 Extract city and role from metadata
  const userWithFields = {
    id: user.id,
    email: user.user_metadata?.email,
    city: user.user_metadata?.city,
    role: user.user_metadata?.role,
  };

  const token = generateToken(userWithFields);

  return {
    token,
    user: userWithFields,
    supabaseSession: session,
  };
}

export default { login };
