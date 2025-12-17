import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
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
      const err = await hfRes.text();
      return res.status(500).json({ error: err });
    }

    const data = await hfRes.json();
    const top = data?.[0]?.[0];

    return res.status(200).json({
      mood: top?.label ?? "unknown",
      confidence: top?.score ?? 0,
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
