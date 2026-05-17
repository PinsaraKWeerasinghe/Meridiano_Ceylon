import { redirect } from "next/navigation";

/** Former summary page — legal policy lives under `/legal/terms`. */
export default function LegacyTermsRedirect() {
  redirect("/legal/terms");
}
