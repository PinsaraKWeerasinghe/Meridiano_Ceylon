import type { TourSpecialtyDetailBlock } from "@/data/tour-details/types";

type SpecialtyDetailBlocksProps = {
  detail: TourSpecialtyDetailBlock;
};

export function SpecialtyDetailBlocks({ detail }: SpecialtyDetailBlocksProps) {
  const highlightsBlock =
    detail.highlights && detail.highlights.length > 0 ? (
      <ul className="mt-4 space-y-1 text-sm text-stone-700">
        {detail.highlights.map((h) => (
          <li key={h} className="flex gap-2">
            <span className="text-lagoon" aria-hidden>
              ·
            </span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
    ) : null;

  const firstSectionMargin =
    detail.highlightSectionsFirst
      ? "mt-4"
      : detail.highlights && detail.highlights.length > 0
        ? "mt-5"
        : "mt-4";

  const highlightSectionsBlock =
    detail.highlightSections && detail.highlightSections.length > 0
      ? detail.highlightSections.map((section, si) => (
          <div
            key={section.title}
            className={si === 0 ? firstSectionMargin : "mt-5"}
          >
            <h2 className="font-serif text-lg font-semibold text-forest">
              {section.title}
            </h2>
            <ul className="mt-2 space-y-1 text-sm text-stone-700">
              {section.items.map((item, ii) => (
                <li key={`${section.title}-${ii}`} className="flex gap-2">
                  <span className="text-lagoon" aria-hidden>
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      : null;

  return (
    <>
      {detail.tagline ? (
        <p className="mt-2 text-sm font-semibold leading-snug text-forest/95">
          {detail.tagline}
        </p>
      ) : null}
      {detail.bodyParagraphs.map((para, i) => (
        <p
          key={i}
          className="mt-3 text-sm leading-relaxed text-stone-700"
        >
          {para}
        </p>
      ))}
      {detail.highlightSectionsFirst ? (
        <>
          {highlightSectionsBlock}
          {highlightsBlock}
        </>
      ) : (
        <>
          {highlightsBlock}
          {highlightSectionsBlock}
        </>
      )}
      {detail.note ? (
        <p className="mt-4 rounded-lg bg-amber-50/90 px-3 py-2 text-xs text-amber-900/90">
          {detail.note}
        </p>
      ) : null}
    </>
  );
}
