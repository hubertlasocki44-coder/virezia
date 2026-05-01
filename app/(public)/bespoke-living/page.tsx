import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import SectionLabel from "@/components/SectionLabel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bespoke Living",
  description:
    "Notes on architecture, design, and life across the places VIREZIA features.",
  alternates: {
    canonical: "https://virezia.com/bespoke-living",
  },
};

export default async function BespokeLivingPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, featured_image, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-content px-6">
        <AnimatedSection>
          <SectionLabel text="Bespoke Living" />
          <h1 className="mt-6 font-serif text-[clamp(36px,5vw,56px)] font-light">
            Bespoke Living
          </h1>
          <p className="mt-4 max-w-xl font-sans text-base font-light text-text-secondary">
            Notes on architecture, design, and life across the places
            VIREZIA features.
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {posts?.map((post, i) => (
            <AnimatedSection key={post.id} delay={i * 0.1}>
              <Link
                href={`/bespoke-living/${post.slug}`}
                className="group block border border-border bg-bg-card transition-colors hover:border-accent-gold/30"
              >
                {post.featured_image && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />
                  </div>
                )}
                <div className="p-8">
                  <h2 className="font-serif text-[22px] font-light leading-[1.3] text-text-primary">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-3 font-sans text-sm font-light leading-relaxed text-text-secondary line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.published_at && (
                    <p className="mt-4 font-sans text-[12px] text-text-muted">
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {(!posts || posts.length === 0) && (
          <AnimatedSection className="mt-16">
            <p className="font-sans text-base text-text-muted">
              Articles are being prepared. Check back soon.
            </p>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
