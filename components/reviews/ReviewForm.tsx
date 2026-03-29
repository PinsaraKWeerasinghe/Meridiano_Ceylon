"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { StarRatingInput } from "@/components/ui/StarRatingInput";
import { reviewTourOptions } from "@/data/tours";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [tourType, setTourType] = useState(reviewTourOptions[0] ?? "");
  const [story, setStory] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [overall, setOverall] = useState(0);
  const [driver, setDriver] = useState(0);
  const [vehicle, setVehicle] = useState(0);
  const [safety, setSafety] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) return;
    if (!overall || !driver || !vehicle || !safety) {
      setFormError("Please tap a star rating in each category.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="text-center">
        <p className="font-serif text-xl font-semibold text-forest">
          Thank you, {name.trim()}!
        </p>
        <p className="mt-2 text-sm text-stone-600">
          Your feedback means the world to us. This demo does not store reviews
          yet — our team will enable submissions soon.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="review-name" className="text-sm font-medium text-forest">
            Your name
          </label>
          <input
            id="review-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 text-stone-900 outline-none ring-forest/20 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="review-tour" className="text-sm font-medium text-forest">
            Tour type
          </label>
          <select
            id="review-tour"
            value={tourType}
            onChange={(e) => setTourType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-stone-900 outline-none ring-forest/20 focus:ring-2"
          >
            {reviewTourOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="review-story" className="text-sm font-medium text-forest">
            Your story
          </label>
          <textarea
            id="review-story"
            rows={5}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="What was the highlight of your journey?"
            className="mt-1 w-full resize-y rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-2.5 text-stone-900 outline-none ring-forest/20 focus:ring-2"
          />
        </div>

        <div>
          <span className="text-sm font-medium text-forest">Photos</span>
          <p className="text-xs text-stone-500">
            Upload is UI-only for now — files stay on your device.
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="mt-2 block w-full text-sm text-stone-600 file:mr-4 file:rounded-full file:border-0 file:bg-forest file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream hover:file:bg-[#234a42]"
          />
          {files && files.length > 0 ? (
            <ul className="mt-2 text-xs text-stone-500">
              {Array.from(files).map((f) => (
                <li key={f.name}>{f.name}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <fieldset className="space-y-6 border-0 p-0">
          <legend className="text-sm font-semibold text-forest">
            Ratings
          </legend>
          <StarRatingInput
            id="overall"
            label="Overall experience"
            value={overall}
            onChange={setOverall}
          />
          <StarRatingInput
            id="driver"
            label="Driver & guide"
            value={driver}
            onChange={setDriver}
          />
          <StarRatingInput
            id="vehicle"
            label="Vehicle quality"
            value={vehicle}
            onChange={setVehicle}
          />
          <StarRatingInput
            id="safety"
            label="Safety"
            value={safety}
            onChange={setSafety}
          />
        </fieldset>

        {formError ? (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-full bg-forest py-3.5 text-sm font-semibold text-cream transition hover:bg-[#234a42]"
        >
          Submit review
        </button>
      </form>
    </Card>
  );
}
