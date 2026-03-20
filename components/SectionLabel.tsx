interface SectionLabelProps {
  text: string;
  className?: string;
}

export default function SectionLabel({ text, className = "" }: SectionLabelProps) {
  return (
    <span
      className={`inline-block font-sans text-[11px] font-normal uppercase tracking-[0.18em] text-accent ${className}`}
    >
      {text}
    </span>
  );
}
