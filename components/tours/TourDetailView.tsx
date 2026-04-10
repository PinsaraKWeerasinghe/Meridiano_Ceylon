import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { packagesGreenCard } from "@/lib/packages-section-theme";
import type { TourDetailContent } from "@/data/tour-details/types";
import { fixedPackageGalleryById } from "@/data/tour-galleries";
import { SpecialtyDetailBlocks } from "@/components/tours/SpecialtyDetailBlocks";
import { cn } from "@/lib/utils";

function DaySection({
  day,
}: {
  day: { title: string; bullets: string[] };
}) {
  return (
    <section>
      <h2 className="font-serif text-lg font-semibold text-forest">
        {day.title}
      </h2>
      {day.bullets.length > 0 ? (
        <ul className="mt-3 list-inside list-disc space-y-2">
          {day.bullets.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function TourDetailView({ detail }: { detail: TourDetailContent }) {
  const heading = [detail.optionLabel, detail.pageTitle].filter(Boolean).join(" ");
  const isSpecialty = Boolean(detail.specialtyDetail);
  const gallerySrcs = fixedPackageGalleryById[detail.tourId] ?? [];

  return (
    <div className="min-h-screen bg-lagoon/10 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/packages"
          className="text-sm font-semibold text-lagoon underline-offset-4 transition hover:text-lagoon/80 hover:underline"
        >
          ← Packages &amp; tours
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          {heading}
        </h1>
        {!isSpecialty ? (
          <p className="mt-2 text-sm font-medium text-stone-600">
            {detail.durationLabel}
          </p>
        ) : null}
        {detail.intro.map((p) => (
          <p
            key={p}
            className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-700"
          >
            {p}
          </p>
        ))}
        {!isSpecialty && detail.theme ? (
          <p className="mt-4 text-sm leading-relaxed text-stone-700">
            <span className="font-semibold text-forest">Theme:</span>{" "}
            {detail.theme}
          </p>
        ) : null}
        {!isSpecialty && detail.focus ? (
          <p className="mt-4 text-sm leading-relaxed text-stone-700">
            <span className="font-semibold text-forest">Focus:</span>{" "}
            {detail.focus}
          </p>
        ) : null}

        <Card
          className={cn(
            "mt-8 space-y-8 text-sm leading-relaxed text-stone-700",
            packagesGreenCard,
          )}
        >
          {detail.specialtyDetail ? (
            <SpecialtyDetailBlocks detail={detail.specialtyDetail} />
          ) : null}
          {!detail.specialtyDetail && detail.days?.map((day) => (
            <DaySection key={day.title} day={day} />
          ))}
          {!detail.specialtyDetail &&
            detail.phases?.map((phase) => (
            <div key={phase.title} className="space-y-8">
              <h2 className="border-b border-lagoon/20 pb-2 font-serif text-xl font-semibold text-forest">
                {phase.title}
              </h2>
              {phase.days.map((day) => (
                <DaySection
                  key={`${phase.title}-${day.title}`}
                  day={day}
                />
              ))}
            </div>
          ))}

          {!detail.specialtyDetail && detail.tips && detail.tips.length > 0 ? (
            <aside className="rounded-lg border border-lagoon/25 bg-lagoon/10 px-4 py-3 text-stone-800">
              <p className="font-semibold text-forest">Tips</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                {detail.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </aside>
          ) : null}

          {!detail.specialtyDetail &&
            detail.notes?.map((n) => (
            <aside
              key={n.title}
              className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-amber-950"
            >
              <p className="font-semibold">{n.title}</p>
              <p className="mt-2 whitespace-pre-line">{n.body}</p>
            </aside>
          ))}

          {!detail.specialtyDetail && detail.closingLine ? (
            <p className="border-t border-lagoon/20 pt-6 text-stone-700">
              {detail.closingLine}
            </p>
          ) : null}

          {!detail.specialtyDetail &&
            detail.highlightBullets &&
            detail.highlightBullets.length > 0 ? (
            <div className="border-t border-lagoon/20 pt-6">
              <p className="font-semibold text-forest">
                Tour highlights for your clients
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                {detail.highlightBullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {!detail.specialtyDetail && detail.tenDayClientSummary ? (
            <aside className="rounded-lg border border-lagoon/25 bg-white/60 px-4 py-3 text-stone-800">
              <p className="font-semibold text-forest">
                Quick summary for your clients
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  Option 01 is the best for History &amp; Culture lovers.
                </li>
                <li>
                  Option 02 is the best for Relaxation &amp; Safari lovers.
                </li>
                <li>
                  Option 04 (Special) is the best for Adventure &amp; Nature
                  lovers — it shows the true beauty of the Wellawaya area.
                </li>
              </ul>
            </aside>
          ) : null}
        </Card>

        {gallerySrcs.length > 0 ? (
          <section className="mt-10" aria-labelledby="tour-detail-gallery-heading">
            <h2
              id="tour-detail-gallery-heading"
              className="font-serif text-xl font-semibold text-forest"
            >
              Gallery
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {gallerySrcs.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-200 shadow-sm ring-1 ring-black/5"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
