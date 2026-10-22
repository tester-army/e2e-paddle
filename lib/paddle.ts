import "server-only";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";

let paddle: Paddle | undefined;

export function getPaddle(): Paddle {
  const key = process.env.PADDLE_API_KEY ?? "";
  // Sandbox keys contain _sdbx; live keys never do.
  if (!key.includes("_sdbx")) {
    throw new Error("Set PADDLE_API_KEY to a Paddle sandbox API key (pdl_sdbx_…) in .env.local.");
  }
  paddle ??= new Paddle(key, { environment: Environment.sandbox });
  return paddle;
}
