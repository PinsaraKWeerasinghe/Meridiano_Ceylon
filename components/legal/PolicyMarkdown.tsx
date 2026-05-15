"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

type PolicyMarkdownVariant = "inline" | "page";

/** Monospace stack: official “machine type” feel for legal policy text only */
const POLICY_SURFACE_CLASS =
  "font-mono text-stone-900 antialiased [font-variant-ligatures:none]";

export function PolicyMarkdown({
  content,
  className,
  variant = "inline",
}: {
  content: string;
  className?: string;
  variant?: PolicyMarkdownVariant;
}) {
  const isPage = variant === "page";

  const components: Components = {
    h1: ({ children }) => (
      <h1
        className={
          isPage
            ? "mb-5 text-4xl font-bold leading-tight tracking-tight text-forest sm:mb-6 sm:text-5xl"
            : "mb-3 text-2xl font-bold leading-snug tracking-tight text-forest sm:text-3xl"
        }
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={
          isPage
            ? "mb-4 mt-11 text-2xl font-bold leading-snug tracking-tight text-forest first:mt-0 sm:mt-14 sm:text-3xl"
            : "mb-3 mt-6 text-lg font-bold leading-snug tracking-tight text-forest first:mt-0 sm:text-xl"
        }
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={
          isPage
            ? "mb-2 mt-8 text-xl font-bold tracking-tight text-forest sm:text-2xl"
            : "mb-2 mt-4 text-base font-bold tracking-tight text-forest sm:text-lg"
        }
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p
        className={
          isPage
            ? "mb-4 text-base font-normal leading-relaxed text-stone-800 sm:text-[17px] [&:last-child]:mb-0"
            : "mb-3 text-[13px] font-normal leading-relaxed text-stone-800 last:mb-0 sm:text-sm"
        }
      >
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul
        className={
          isPage
            ? "mb-5 ml-5 list-disc space-y-2.5 text-base font-normal leading-relaxed text-stone-800 sm:text-[17px]"
            : "mb-3 ml-4 list-disc space-y-2 text-[13px] font-normal leading-relaxed text-stone-800 sm:text-sm"
        }
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        className={
          isPage
            ? "mb-5 ml-5 list-decimal space-y-2.5 text-base font-normal leading-relaxed text-stone-800 sm:text-[17px]"
            : "mb-3 ml-4 list-decimal space-y-2 text-[13px] font-normal leading-relaxed text-stone-800 sm:text-sm"
        }
      >
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="pl-0.5 marker:font-normal marker:text-forest/70">
        {children}
      </li>
    ),
    /** Markdown **…** stays structural only — body weight matches paragraphs (bold reserved for headings). */
    strong: ({ children }) => (
      <span className="font-normal text-stone-800">{children}</span>
    ),
    em: ({ children }) => (
      <em className="italic text-stone-800">{children}</em>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="font-normal text-lagoon underline-offset-2 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    hr: () => <hr className="my-8 border-stone-300 sm:my-10" />,
  };

  return (
    <div className={cn(POLICY_SURFACE_CLASS, className)}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
