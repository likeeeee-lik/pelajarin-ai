import { forward } from "../../forward";

export const dynamic = "force-dynamic";

export const POST = (request: Request) => forward(request, "/auth/verify/confirm");
