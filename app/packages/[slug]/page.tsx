import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TourDetailView } from "@/components/tours/TourDetailView";
import {
  getTourDetailBySlug,
  tourDetailSlugs,
} from "@/data/tour-detail-content";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return tourDetailSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const detail = getTourDetailBySlug(params.slug);
  if (!detail) {
    return { title: "Tour" };
  }
  return {
    title: detail.specialtyDetail
      ? detail.pageTitle
      : `${detail.pageTitle} — ${detail.durationLabel}`,
    description: detail.metaDescription,
  };
}

export default function TourDetailPage({ params }: PageProps) {
  const detail = getTourDetailBySlug(params.slug);
  if (!detail) {
    notFound();
  }
  return <TourDetailView detail={detail} />;
}
