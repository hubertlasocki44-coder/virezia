"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { createBlogPost } from "@/lib/actions/blog";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [published, setPublished] = useState(false);

  const generateSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBlogPost({
        title,
        slug: slug || generateSlug(title),
        content,
        excerpt,
        featured_image: featuredImage || undefined,
        published,
        seo_title: seoTitle || undefined,
        seo_description: seoDescription || undefined,
      });
      router.push("/admin/blog");
    } catch {
      alert("Failed to create post.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="font-serif text-[28px] font-light text-text-primary">New Article</h1>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6">
        <FormInput
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slug) setSlug(generateSlug(e.target.value));
          }}
          placeholder="Article title"
        />
        <FormInput
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="url-friendly-slug"
        />
        <FormInput
          label="Excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief description"
        />
        <FormInput
          label="Featured Image URL"
          value={featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
          placeholder="/images/filename.jpg"
        />
        <FormTextarea
          label="Content (HTML)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="<h2>Section Title</h2><p>Content here...</p>"
          className="min-h-[400px] font-mono text-xs"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <FormInput
            label="SEO Title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="SEO title override"
          />
          <FormInput
            label="SEO Description"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="SEO description override"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="font-sans text-sm text-text-secondary">Publish immediately</span>
        </label>
        <button
          type="submit"
          disabled={loading || !title || !content}
          className="bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Article"}
        </button>
      </form>
    </div>
  );
}
