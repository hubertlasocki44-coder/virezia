import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

export default async function BlogAdminPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*, author:profiles!blog_posts_author_id_fkey(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] font-light text-text-primary">Blog</h1>
          <p className="mt-1 font-sans text-sm text-text-muted">{posts?.length ?? 0} articles</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-accent-gold px-5 py-2 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
        >
          New Article
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-secondary">
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Title</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Status</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Author</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Date</th>
              <th className="px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.1em] text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((post) => (
              <tr key={post.id} className="border-b border-border-subtle bg-bg-card hover:bg-bg-secondary">
                <td className="px-4 py-3 font-sans text-sm text-text-primary">{post.title}</td>
                <td className="px-4 py-3">
                  <AdminStatusBadge status={post.published ? "active" : "pending"} />
                </td>
                <td className="px-4 py-3 font-sans text-sm text-text-secondary">{post.author?.full_name || "—"}</td>
                <td className="px-4 py-3 font-sans text-[12px] text-text-muted">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="font-sans text-[12px] text-accent-gold hover:text-accent-gold-light"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-8 text-center font-sans text-sm text-text-muted">No articles yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
