"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

/* -- YouTube video teaser (19s clip: 3:29-3:48) -------------------- */
function VideoTeaser() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="relative aspect-video w-full max-w-4xl mx-auto bg-black overflow-hidden">
      {showVideo ? (
        <iframe
          src="https://www.youtube.com/embed/scE6aC4XyyY?start=209&end=228&autoplay=1&rel=0&modestbranding=1&color=white"
          title="Robert Couturier on Las Orcas"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          onClick={() => setShowVideo(true)}
          className="absolute inset-0 w-full h-full group cursor-pointer"
        >
          <Image
            src="https://img.youtube.com/vi/scE6aC4XyyY/maxresdefault.jpg"
            alt="Robert Couturier on Las Orcas"
            fill
            className="object-cover opacity-70 group-hover:opacity-80 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-white/60 flex items-center justify-center group-hover:border-white/90 group-hover:scale-105 transition-all">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

/* ================================================================== */
export default function LasOrcasPage() {
  return (
    <Suspense>
      <LasOrcasContent />
    </Suspense>
  );
}

function LasOrcasContent() {
  return (
    <>
      {/* ============================================================ */}
      {/* 1. HERO                                                      */}
      {/* ============================================================ */}
      <section className="relative min-h-screen flex items-end pb-20 md:pb-28">
        <div className="absolute inset-0">
          <Image
            src="/images/las-orcas/hero-aerial.webp"
            alt="Las Orcas — beachfront villas, Puerto Escondido"
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/70 via-bg-primary/40 to-bg-primary" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-content px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-accent-gold/90 mb-4">
              A VIREZIA Selection
            </p>
            <p className="font-sans text-[12px] uppercase tracking-[0.15em] text-text-primary/70 mb-10">
              Robert Couturier &middot; Oaxacan Coast &middot; 2026
            </p>
            <h1 className="font-serif text-[clamp(36px,7vw,80px)] font-light leading-[1.05] max-w-4xl">
              Forty years after Cuixmala,
              <br className="hidden md:block" />
              he returns to the Pacific.
            </h1>
            <p className="font-sans text-base font-light text-text-secondary mt-8 max-w-xl">
              Design legend Robert Couturier &mdash; the architect behind one of the greatest private estates ever built &mdash; designs seven beachfront residences in Puerto Escondido, Oaxaca.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 1b. THE ARCHITECT                                            */}
      {/* ============================================================ */}
      <section className="border-t border-border-subtle py-28 md:py-36">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 md:gap-16 items-start">
            <AnimatedSection>
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/images/las-orcas/couturier-architecture.jpg"
                  alt="Robert Couturier"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 280px"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-6">
                The Architect
              </p>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-light leading-[1.15]">
                Robert Couturier
              </h2>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary mt-6">
                Paris-trained architect and interior designer. Based in New York since 1981. His work spans four continents &mdash; from Manhattan townhouses to estates in France, England, Russia, the Middle East, and Mexico.
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary mt-4">
                Named to the <span className="text-text-primary">AD100</span> &mdash; Architectural Digest&apos;s definitive list of the world&apos;s top architects and designers. Author of <span className="text-text-primary italic">Designing Paradises</span>, published by Rizzoli. Clients have included Sir James Goldsmith and Jeff Koons.
              </p>

              {/* Press logos inline */}
              <div className="mt-8 pt-6 border-t border-border/40">
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-text-muted mb-5">
                  Published in
                </p>
                <div className="flex items-center gap-6 md:gap-10 flex-wrap">
                  <Image src="/images/las-orcas/logo-ad.png" alt="Architectural Digest" width={102} height={75} className="h-5 md:h-6 w-auto opacity-50" />
                  <Image src="/images/las-orcas/logo-nyt.png" alt="The New York Times" width={94} height={75} className="h-5 md:h-6 w-auto opacity-50" />
                  <Image src="/images/las-orcas/logo-elle.png" alt="Elle" width={210} height={75} className="h-5 md:h-6 w-auto opacity-50" />
                  <Image src="/images/las-orcas/logo-1stdibs.png" alt="1stDibs" width={243} height={75} className="h-5 md:h-6 w-auto opacity-50" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE COMMISSION                                            */}
      {/* ============================================================ */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            <AnimatedSection>
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/images/las-orcas/villa-exterior.webp"
                  alt="Las Orcas — villa render by Robert Couturier"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="font-sans text-[11px] text-text-muted mt-3">
                Las Orcas &mdash; Puerto Escondido, Oaxaca
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="md:pt-8">
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold mb-8">
                1987
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
                In the autumn of 1987, after the stock market crash, Sir James Goldsmith &mdash; the Anglo-French financier &mdash; withdrew from the world he had spent thirty years building. He bought twenty thousand acres on the Pacific Coast of Mexico and began to imagine what it might become.
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary mt-6">
                He had recently commissioned a young French architect, newly arrived in New York, to decorate his Manhattan townhouse. He now offered him something larger: the design of an entire world.
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary mt-6">
                Robert Couturier was thirty-two. The commission was, by his own biographer&apos;s account, the single greatest private commission of modern times. It would last a decade. It would expand to include a sixty-thousand-square-foot palace called La Loma, its blue-and-yellow tiled dome modeled after Hagia Sophia. A Boeing 757 &mdash; &ldquo;a flying carpet with a motor,&rdquo; Couturier called it. A French ch&acirc;teau. A double-width Manhattan home.
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary mt-6">
                The estate became Cuixmala &mdash; &ldquo;the soul&apos;s resting place&rdquo; in the Nahuatl language. Architectural Digest later named it among the seven most beautiful resorts on Mexico&apos;s Pacific Coast. It hosted Henry Kissinger, Madonna, Bill Gates. It launched Robert Couturier&apos;s career.
              </p>
              <p className="font-serif text-[clamp(20px,2.5vw,28px)] text-accent-gold mt-12 leading-snug">
                Las Orcas is his return to that coast.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. IN HIS WORDS (video)                                      */}
      {/* ============================================================ */}
      <section className="bg-bg-secondary py-28 md:py-40">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <AnimatedSection>
            <VideoTeaser />
            <div className="max-w-2xl mx-auto mt-10 text-center">
              <p className="font-sans text-sm font-light leading-relaxed text-text-secondary">
                Robert Couturier on Las Orcas, Oaxaca, and his return to Mexico&apos;s Pacific Coast.
              </p>
              <p className="font-sans text-sm font-light leading-relaxed text-text-muted mt-3">
                The full conversation is shared with members of the VIREZIA Circle.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. WHY HE RETURNED                                           */}
      {/* ============================================================ */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <AnimatedSection>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-10 text-center">
              Why He Returned
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary text-center mb-16">
              Couturier has worked in Mexico for over four decades. When the developers of Las Orcas approached him about Puerto Escondido, his answer was personal before it was professional.
            </p>

            <div className="space-y-16">
              <blockquote className="text-center">
                <p className="font-serif text-[clamp(20px,3vw,32px)] font-light leading-[1.35]">
                  &ldquo;What I love about Mexico is the incredible kindness of its people, the devotion of its workers, and their intelligence in making your dream come true.&rdquo;
                </p>
              </blockquote>

              <blockquote className="text-center">
                <p className="font-serif text-[clamp(20px,3vw,32px)] font-light leading-[1.35]">
                  &ldquo;Puerto Escondido is being discovered. Most of the developments there are environmentally friendly, family-friendly. You don&apos;t have the feeling that you live on top of each other.&rdquo;
                </p>
              </blockquote>
            </div>

            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold mt-12 text-center">
              &mdash; Robert Couturier
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4b. THE RESIDENCES (image gallery)                           */}
      {/* ============================================================ */}
      <section className="bg-bg-secondary py-28 md:py-40">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <AnimatedSection>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-10 text-center">
              The Residences
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedSection>
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/las-orcas/villa-exterior.webp"
                  alt="Las Orcas — villa exterior render"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/las-orcas/villa-detail.webp"
                  alt="Las Orcas — villa detail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>
          </div>
          <AnimatedSection className="mt-6">
            <div className="relative aspect-[21/9] w-full overflow-hidden">
              <Image
                src="/images/las-orcas/location-coast.webp"
                alt="Puerto Escondido — Oaxacan Coast"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <p className="font-sans text-[11px] text-text-muted mt-3 text-center">
              Puerto Escondido, Oaxaca &mdash; the Oaxacan Coast
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. ON LUXURY (manifest)                                      */}
      {/* ============================================================ */}
      <section className="py-32 md:py-48">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <AnimatedSection className="text-center">
            <blockquote className="font-serif text-[clamp(24px,4vw,48px)] font-light leading-[1.3]">
              &ldquo;Luxury there is the ability to live simply, comfortably, with excellent food, with great services, with access to most pleasant things in life &mdash; and to have sort of a slow, peaceful life.&rdquo;
            </blockquote>
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold mt-10">
              &mdash; Robert Couturier
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. VIREZIA SELECTIONS (trust block)                          */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <AnimatedSection className="text-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-8">
              VIREZIA Selections
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
              Las Orcas is part of VIREZIA Selections &mdash; a small set of curated opportunities selected for architectural significance, location, and the story behind them.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. THE WORK                                                  */}
      {/* ============================================================ */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-content px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            <AnimatedSection>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src="/images/las-orcas/villa-front.webp"
                  alt="Las Orcas villa — designed by Robert Couturier"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="md:pt-12">
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold mb-8">
                Las Orcas
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
                Seven private residences on a single beachfront parcel in Puerto Escondido, Oaxaca &mdash; four villas and three casitas, designed by Robert Couturier as a small village. &ldquo;So that when you walk through from the entrance to the upper bungalows,&rdquo; he says, &ldquo;you have a feeling that you&apos;re walking through a small little city.&rdquo;
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary mt-6">
                The construction is in concrete and stone &mdash; materials chosen, in his words, &ldquo;that will live in the sea air and age gracefully &mdash; as we all should.&rdquo; Spaces are designed to be open but cozy. &ldquo;You don&apos;t have the feeling that you live outside all the time. You have the ability to be outside, and the ability to stay inside and read a book.&rdquo;
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary mt-6">
                Each residence has its own private deed and rooftop plunge pool. Pre-construction. Pre-titled lots. Direct access to the uncrowded beach of La Barra. Five residences remain available to founding members.
              </p>
              <p className="font-sans text-lg font-normal text-text-primary mt-10">
                From $561,000.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. COUTURIER ON LAS ORCAS (quotes)                           */}
      {/* ============================================================ */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <AnimatedSection className="space-y-20 md:space-y-28">
            <blockquote className="text-center">
              <p className="font-serif text-[clamp(22px,3.5vw,40px)] font-light leading-[1.3]">
                &ldquo;What will distinguish Las Orcas is the care with which it was designed and built. Luxury but also simplicity.&rdquo;
              </p>
            </blockquote>

            <blockquote className="text-center">
              <p className="font-serif text-[clamp(22px,3.5vw,40px)] font-light leading-[1.3]">
                &ldquo;Materials that will live in the sea air and age gracefully &mdash; as we all should.&rdquo;
              </p>
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-accent-gold mt-10">
                &mdash; Robert Couturier
              </p>
            </blockquote>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. THE NEIGHBORHOOD                                         */}
      {/* ============================================================ */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <AnimatedSection>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-10 text-center">
              The Neighborhood
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary text-center mb-16">
              The Pacific Coast of Oaxaca has become, quietly, the most concentrated architectural destination in Mexico. Within thirty minutes of Las Orcas:
            </p>

            <div className="space-y-6 max-w-lg mx-auto">
              <p className="font-sans text-[15px] font-light text-text-secondary">
                <span className="text-text-primary">Casa Wabi</span> &mdash; Tadao Ando. Pritzker Prize, 1995. With pavilions by &Aacute;lvaro Siza, Kengo Kuma, Alberto Kalach, Solano Ben&iacute;tez and Gloria Cabral.
              </p>
              <p className="font-sans text-[15px] font-light text-text-secondary">
                <span className="text-text-primary">Casona Sforza</span> &mdash; Alberto Kalach. La Barra.
              </p>
              <p className="font-sans text-[15px] font-light text-text-secondary">
                <span className="text-text-primary">Hotel Escondido</span> &mdash; Grupo Habita. Member of Design Hotels.
              </p>
              <p className="font-sans text-[15px] font-light text-text-secondary">
                <span className="text-text-primary">Hotel Terrestre</span> &mdash; Alberto Kalach. Solar-powered, member of Design Hotels.
              </p>
              <p className="font-sans text-[15px] font-light text-text-secondary">
                <span className="text-text-primary">Casa TO</span> &mdash; Ludwig Godefroy. La Punta.
              </p>
            </div>

            <div className="mt-16 text-center">
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
                Until now, this architecture could be visited. It could not be inhabited.
              </p>
              <p className="font-serif text-xl text-accent-gold mt-6">
                Las Orcas is the first private residential project at this tier on the Oaxacan Coast.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. THE BUILD                                                */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <AnimatedSection className="text-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-10">
              The Build
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
              Construction by Quantia, the Puerto Escondido studio responsible for Casa Sicar&uacute; and Casa Madrina. Materials drawn from the region &mdash; Cantera Verde stone, Parota wood, Talavera tile, breeze blocks &mdash; selected for permanence in the sea air. Saltwater pools. Whole-home water filtration. Ten-inch walls and dual-pane glass to soften the climate. Each residence is delivered with private deed under Mexican federal title.
            </p>
            <p className="font-sans text-sm text-text-muted mt-8">
              Estimated construction: Q2 2026 &mdash; Q3 2027.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. JOIN THE VIREZIA CIRCLE (CTA)                            */}
      {/* ============================================================ */}
      <section className="bg-bg-secondary py-28 md:py-40">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <AnimatedSection className="text-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-8">
              Join the VIREZIA Circle
            </p>
            <p className="font-serif text-[clamp(20px,3vw,32px)] font-light leading-[1.4] mb-6">
              There is more to this story. The full conversation with Robert Couturier, the dossier, and the introductions to Las Orcas and future Selections are shared with members of the VIREZIA Circle.
            </p>
            <p className="font-sans text-sm font-light text-text-muted mb-10">
              Membership is by inquiry. There is no fee.
            </p>
            <Link
              href="/circle/join"
              className="inline-block bg-accent-gold px-12 py-4 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
            >
              Join the VIREZIA Circle
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 13. FOUNDING MEMBERS                                         */}
      {/* ============================================================ */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <AnimatedSection className="text-center">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-10">
              Founding Members
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
              Las Orcas opens to seven founding members &mdash; the first owners of a Robert Couturier residence on the Oaxacan Coast. Founding members select their residence from those remaining. They participate, where they wish, in the architect&apos;s final decisions on their home. They join a small group whose names will be associated with the project&apos;s first chapter.
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-text-secondary mt-6">
              Founding membership is offered to members of the VIREZIA Circle who indicate alignment with the project. A short conversation precedes any introduction to the developer.
            </p>
            <Link
              href="/circle/join?intent=founding"
              className="inline-block mt-10 border border-accent-gold/60 px-10 py-4 font-sans text-[13px] uppercase tracking-[0.1em] text-accent-gold transition-all hover:bg-accent-gold/10 hover:border-accent-gold"
            >
              Express Interest as a Founding Member
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 14. FOOTER                                                   */}
      {/* ============================================================ */}
      <footer className="py-16 border-t border-border">
        <div className="mx-auto max-w-content px-6 md:px-10 text-center">
          <p className="font-sans text-[12px] text-text-muted tracking-wide">
            VIREZIA &middot; Curated Selections in Mexico and Latin America
          </p>
          <a
            href="/privacy"
            className="inline-block font-sans text-[11px] text-text-muted/60 hover:text-text-muted mt-4 transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </>
  );
}
