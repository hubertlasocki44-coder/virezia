import { redirect } from "next/navigation";

// Incomplete leads were folded into the Leads Pipeline as a tab.
export default function IncompleteRedirect() {
  redirect("/admin/leads?view=incomplete");
}
