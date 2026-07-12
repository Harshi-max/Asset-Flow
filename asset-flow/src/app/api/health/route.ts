import { successResponse } from "@/lib/api-response";

export async function GET() {
  return Response.json(successResponse({ status: "ok" }));
}
