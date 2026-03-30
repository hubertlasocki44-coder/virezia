import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent-gold focus:px-4 focus:py-2 focus:font-sans focus:text-[13px] focus:text-bg-primary"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main-content">{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
