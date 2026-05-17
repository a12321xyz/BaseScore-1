import { NextResponse } from "next/server";

/**
 * Farcaster Mini App webhook endpoint.
 * Handles frame lifecycle events (e.g. frame_added, frame_removed, notifications_enabled).
 * Required by the Farcaster Mini App spec even if no-op for now.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[BaseScore] Farcaster webhook event:", body.event, body);

    // Handle specific events as needed
    switch (body.event) {
      case "frame_added":
        // User added the Mini App
        break;
      case "frame_removed":
        // User removed the Mini App
        break;
      case "notifications_enabled":
        // User enabled notifications
        break;
      case "notifications_disabled":
        // User disabled notifications
        break;
      default:
        break;
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
