/**
 * Set admin password directly via Supabase Admin API.
 *
 * Usage:
 *   npx tsx scripts/set-admin-password.ts EMAIL NEW_PASSWORD
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: npx tsx scripts/set-admin-password.ts EMAIL NEW_PASSWORD");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  // Find user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error("Error listing users:", listError.message);
    process.exit(1);
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.error(`User ${email} not found. Creating...`);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError) {
      console.error("Create failed:", createError.message);
      process.exit(1);
    }
    console.log(`Created user: ${newUser.user.id}`);

    // Set as super_admin
    await supabase.from("profiles").update({
      role: "super_admin",
      status: "active"
    }).eq("id", newUser.user.id);

    console.log(`Set as super_admin. Login at /login with:`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    return;
  }

  // Update password
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password,
  });

  if (updateError) {
    console.error("Update failed:", updateError.message);
    process.exit(1);
  }

  // Ensure super_admin role
  await supabase.from("profiles").update({
    role: "super_admin",
    status: "active"
  }).eq("id", user.id);

  console.log(`Password updated for ${email} (${user.id})`);
  console.log(`Role set to super_admin, status active.`);
  console.log(`Login at /login with your new password.`);
}

main();
