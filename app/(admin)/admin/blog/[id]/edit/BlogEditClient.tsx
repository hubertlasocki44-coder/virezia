"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { updateBlogPost, deleteBlogPost } from "@/lib/actions/blog";

interface Props {
  post: Record<string, unknown>;
}

export default function BlogEditClient({ post }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(post.title as string);
  const [slug, setSlug] = useState(post.slug as string);
  const [excerpt, setExcerpt] = useState((post.excerpt as string) || "");
  const [content, setContent] = useState(post.content as string);
  const [featuredImage, setFeaturedImage] = useState((post.featured_image as string) || "");
  const [seoTitle, setSeoTitle] = useState((post.seo_title as string) || "");
  const [seoDescription, setSeoDescription] = useState((post.seo_description as string) || "");
  const [published, setPublished] = useState(post.published as boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateBlogPost(post.id as string, {
        title,
        slug,
        content,
        excerpt,
        featured_image: featuredImage,
        published,
        seo_title: seoTitle,
        seo_description: seoDescription,
      });
      router.push("/admin/blog");
    } catch {
      alert("Failed to update post.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this article?")) return;
    await deleteBlogPost(post.id as string);
    router.push("/admin/blog");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-[28px] font-light text-text-primary">Edit Article</h1>
        <button
          onClick={handleDelete}
          className="font-sans text-[12px] text-red-400 hover:text-red-300"
        >
          Delete Article
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6">
        <FormInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <FormInput label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <FormInput label="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        <FormInput label="Featured Image URL" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} />
        <FormTextarea
          label="Content (HTML)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[400px] font-mono text-xs"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <FormInput label="SEO Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          <FormInput label="SEO Description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4" />
          <span className="font-sans text-sm text-text-secondary">Published</span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
