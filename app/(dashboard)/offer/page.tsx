"use client";

import { useEffect, useState } from "react";

export default function OfferPage() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const stored = localStorage.getItem("virezia_lang");
    if (stored === "es" || stored === "en") setLang(stored);
  }, []);

  return (
    <div className="min-h-screen -m-6 md:-m-10">
      <iframe
        src={`/api/partner-offer?lang=${lang}`}
        className="w-full border-0"
        style={{ height: "100vh", minHeight: "900px" }}
        title="Virezia Partner Offer"
      />
    </div>
  );
}
