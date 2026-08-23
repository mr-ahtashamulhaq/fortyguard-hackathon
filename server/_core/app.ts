import { type Express } from "express";
import { type Server } from "http";
import { configureApiApp } from "./api-app";
import { serveStatic, setupVite } from "./vite";

type AppOptions = {
  server?: Server;
  serveClient?: boolean;
};

export async function configureApp(app: Express, { server, serveClient = false }: AppOptions = {}) {
  configureApiApp(app);

  if (!serveClient) return app;
  if (process.env.NODE_ENV === "development" && server) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  return app;
}

export async function createApp(options: AppOptions = {}) {
  const { default: express } = await import("express");
  return configureApp(express(), options);
}
