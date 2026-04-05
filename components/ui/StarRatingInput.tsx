"use client";

import { Star } from "lucide-react";

interface StarRatingInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
}

export function StarRatingInput({
  id,
  label,
  value,
  onChange,
}: StarRatingInputProps) {
  return (
    <div>
      <p id={`${id}-label`} className="text-sm font-medium text-forest">
        {label}
      </p>
      <div
        className="mt-2 flex gap-1"
        role="group"
        aria-labelledby={`${id}-label`}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= value;
          return (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={active}
              onClick={() => onChange(n)}
              className="rounded p-1 text-lagoon transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-lagoon"
            >
              <Star
                className={`h-8 w-8 ${active ? "fill-lagoon" : "fill-transparent"}`}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
