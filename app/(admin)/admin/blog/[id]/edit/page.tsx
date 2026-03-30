import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogEditClient from "./BlogEditClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return <BlogEditClient post={post} />;
}
