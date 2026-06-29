"use client";
import { useLang } from "@/lib/lang";
import { t } from "@/lib/translations";
export default function SettingsTitle() {
  const { lang } = useLang();
  return (
    <div>
      <h1 className="font-sans text-[22px] font-medium text-white/90 tracking-tight">{t("settings_title", lang)}</h1>
      <p className="mt-1 font-sans text-[13px] text-white/30">{t("settings_subtitle", lang)}</p>
    </div>
  );
}
