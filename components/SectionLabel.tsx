interface SectionLabelProps {
  text: string;
  className?: string;
}

export default function SectionLabel({ text, className = "" }: SectionLabelProps) {
  return (
    <span
      className={`inline-block font-sans text-xs font-normal uppercase tracking-label text-accent-gold ${className}`}
    >
      {text}
    </span>
  );
}
