import { callAuth } from "../session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return callAuth("/auth/login", await request.json().catch(() => ({})));
}
