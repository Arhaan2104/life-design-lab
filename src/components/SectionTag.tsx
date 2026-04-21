type Kind = "awareness" | "cps" | "bias";

const LABELS: Record<Kind, string> = {
  awareness: "Awareness",
  cps: "Creative Problem Solving",
  bias: "Bias to Action",
};

const CLASSES: Record<Kind, string> = {
  awareness: "tag tag-peach",
  cps: "tag tag-sky",
  bias: "tag tag-mint",
};

export function SectionTag({ kind }: { kind: Kind }) {
  return <span className={CLASSES[kind]}>{LABELS[kind]}</span>;
}

export const SECTION_LABELS = LABELS;
