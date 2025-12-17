import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/dima806/facial_emotions_image_detection",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: imageBase64,
        }),
      }
    );

    if (!hfRes.ok) {
      const text = await hfRes.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }

    const data = await hfRes.json();

    const top = data?.[0]?.[0];

    return NextResponse.json({
      mood: top?.label ?? "unknown",
      confidence: top?.score ?? 0,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
