import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, seo_title, seo_description, excerpt, featured_image")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) return { title: "Article — VIREZIA" };

  return {
    title: post.seo_title || `${post.title} — VIREZIA`,
    description: post.seo_description || post.excerpt || "",
    alternates: {
      canonical: `https://virezia.com/bespoke-living/${slug}`,
    },
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || undefined,
      ...(post.featured_image ? {
        images: [{ url: post.featured_image, alt: post.title }],
      } : {}),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*, author:profiles(full_name)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    author: { "@type": "Person", name: post.author?.full_name || "VIREZIA" },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    publisher: { "@type": "Organization", name: "VIREZIA" },
    description: post.excerpt || "",
  };

  return (
    <section className="py-[120px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection className="max-w-3xl">
          <Link
            href="/bespoke-living"
            className="font-sans text-[12px] uppercase tracking-[0.1em] text-text-muted transition-colors hover:text-text-secondary"
          >
            ← Back to Bespoke Living
          </Link>

          <h1 className="mt-8 font-serif text-[clamp(32px,4vw,48px)] font-light leading-[1.15]">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 font-sans text-[12px] text-text-muted">
            {post.author?.full_name && <span>{post.author.full_name}</span>}
            {post.published_at && (
              <span>
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mt-12 max-w-3xl">
          <div
            className="prose prose-invert max-w-none font-sans text-base font-light leading-relaxed text-text-secondary
              [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-[24px] [&_h2]:font-light [&_h2]:text-text-primary
              [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-serif [&_h3]:text-[20px] [&_h3]:font-light [&_h3]:text-text-primary
              [&_p]:mb-4 [&_p]:leading-[1.75]
              [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6
              [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6
              [&_li]:mb-2
              [&_strong]:font-medium [&_strong]:text-text-primary
              [&_a]:text-accent-gold [&_a]:underline [&_a]:underline-offset-4
              [&_blockquote]:border-l-2 [&_blockquote]:border-accent-gold/30 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-text-secondary"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
        </AnimatedSection>

        {/* Bottom CTA */}
        <AnimatedSection className="mt-20 max-w-3xl border-t border-border pt-12">
          <p className="font-serif text-[22px] font-light text-text-primary">
            Considering a move into emerging markets?
          </p>
          <p className="mt-3 font-sans text-sm text-text-secondary">
            Apply for private access. We review every application individually.
          </p>
          <Link
            href="/apply"
            className="mt-6 inline-block bg-accent-gold px-8 py-[14px] font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
          >
            Apply for Private Access
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
