import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { prisma } from '@/lib/prisma';



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dimensions: string[] }> },
) {
  try {
    const resolvedParams = await params;
    const dimensions = resolvedParams.dimensions;

    // Parse dimensions (e.g., ["400", "300"] or ["400"])
    const width = parseInt(dimensions[0] || "400", 10);
    const height = parseInt(dimensions[1] || dimensions[0] || "400", 10);

    // Validate dimensions
    const validWidth = Math.min(Math.max(width, 50), 2000);
    const validHeight = Math.min(Math.max(height, 50), 2000);

    // Generate a subtle gradient based on dimensions for variety
    const hue = (validWidth + validHeight) % 360;
    const color1 = `hsl(${hue}, 15%, 85%)`;
    const color2 = `hsl(${hue}, 15%, 75%)`;

    // Create SVG placeholder
    const svg = `
      <svg width="${validWidth}" height="${validHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${validWidth}" height="${validHeight}" fill="url(#grad)"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="system-ui, -apple-system, sans-serif" 
          font-size="18" 
          fill="var(--grey-600)" 
          text-anchor="middle" 
          dominant-baseline="middle"
        >
          ${validWidth} × ${validHeight}
        </text>
      </svg>
    `.trim();

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error('Placeholder generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate placeholder' },
      { status: 500 }
    );
  }
}
