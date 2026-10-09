import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerEmail } = body;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty. Please add items before checking out." },
        { status: 400 }
      );
    }

    // If Stripe secret key is configured, create live Stripe Checkout session
    if (stripeSecretKey) {
      const stripe = new Stripe(stripeSecretKey);

      const lineItems = items.map((item: { name: string; price: number; quantity: number; description?: string; image?: string }) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description || "PRMPT Fresh Food Archive — Made Daily",
            images: item.image?.startsWith("http") ? [item.image] : undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      }));

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        customer_email: customerEmail || undefined,
        success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?checkout=canceled`,
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "GB"],
        },
      });

      return NextResponse.json({
        url: session.url,
        sessionId: session.id,
        configured: true,
      });
    }

    // Graceful Fallback / Demo Mode when STRIPE_SECRET_KEY is not yet in .env
    const total = items.reduce(
      (sum: number, it: { price: number; quantity: number }) => sum + it.price * (it.quantity || 1),
      0
    );

    return NextResponse.json({
      configured: false,
      mock: true,
      url: `${origin}/?checkout=demo_success&total=${total.toFixed(2)}`,
      message:
        "Stripe API endpoint is live and ready! To process actual payments, set STRIPE_SECRET_KEY in your .env.local file.",
      orderSummary: {
        itemCount: items.length,
        totalUSD: `$${total.toFixed(2)}`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("Stripe Checkout Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  return NextResponse.json({
    status: "online",
    stripeConfigured: Boolean(stripeSecretKey),
    endpoint: "/api/checkout",
    availableMethods: ["POST", "GET"],
    currency: "USD",
    brand: "PRMPT (R) — FRESH FOOD ARCHIVE",
    instructions:
      "Send POST with { items: [{ name, price, quantity, description }] } to create a checkout session.",
  });
}
