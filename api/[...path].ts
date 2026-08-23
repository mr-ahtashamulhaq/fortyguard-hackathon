import type { IncomingMessage, ServerResponse } from "http";
import { createApiApp } from "../dist/serverless/api-app.js";

export const config = { maxDuration: 60 };

const app = createApiApp();

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  return app(request, response);
}
