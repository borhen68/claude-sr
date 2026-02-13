import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  
  // Mocked Stripe checkout session
  const session = {
    id: "cs_mock_" + Math.random().toString(36).slice(2),
    url: "/dashboard?checkout=success",
    plan: body.plan || "studio",
    amount: body.plan === "starter" ? 2900 : body.plan === "professional" ? 9900 : 5900,
    currency: "usd",
    status: "complete",
  };

  return NextResponse.json(session);
}
