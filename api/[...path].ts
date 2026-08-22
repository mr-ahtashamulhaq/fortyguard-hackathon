import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "../server/_core/app";

export const config = { maxDuration: 60 };

const appPromise = createApp();

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  const app = await appPromise;
  return app(request, response);
}
