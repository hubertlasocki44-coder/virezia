"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireEmployee } from "@/lib/auth-guard";

export async function getBlogPosts() {
  await requireEmployee();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, author:profiles!blog_posts_author_id_fkey(full_name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createBlogPost(post: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  published?: boolean;
  seo_title?: string;
  seo_description?: string;
}) {
  await requireEmployee();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("blog_posts").insert({
    ...post,
    author_id: user?.id,
    published_at: post.published ? new Date().toISOString() : null,
  });

  if (error) throw error;
  revalidatePath("/admin/blog");
  revalidatePath("/bespoke-living");
}

export async function updateBlogPost(
  id: string,
  updates: Partial<{
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: string;
    published: boolean;
    seo_title: string;
    seo_description: string;
  }>
) {
  await requireEmployee();
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({
      ...updates,
      published_at: updates.published ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/blog");
  revalidatePath("/bespoke-living");
}

export async function deleteBlogPost(id: string) {
  await requireEmployee();
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/blog");
  revalidatePath("/bespoke-living");
}
