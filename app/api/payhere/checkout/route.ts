import { NextResponse } from "next/server";

/** PayHere prep: returns checkout URL once MERCHANT_ID + MERCHANT_SECRET and hash logic are wired. */

export async function POST(request: Request) {
  try {
    const merchantId = process.env.PAYHERE_MERCHANT_ID?.trim();
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET?.trim();

    if (!merchantId || !merchantSecret) {
      return NextResponse.json(
        {
          ok: false,
          configured: false,
          message:
            "PayHere is not configured. Add PAYHERE_MERCHANT_ID and PAYHERE_MERCHANT_SECRET.",
        },
        { status: 503 },
      );
    }

    const bodyUnknown: unknown = await request.json();

    /** Validate minimal shape — full PayHere hashing comes in a later pass */
    const body =
      bodyUnknown &&
      typeof bodyUnknown === "object" &&
      "draft" in (bodyUnknown as object)
        ? (bodyUnknown as { draft?: unknown; billing?: unknown })
        : null;

    if (!body?.draft) {
      return NextResponse.json(
        { ok: false, message: "Invalid request payload." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        configured: true,
        message:
          "Merchant credentials are set, but checkout hash / redirect generation is not implemented yet. Complete this in PayHere docs next.",
      },
      { status: 501 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not process checkout request." },
      { status: 500 },
    );
  }
}
