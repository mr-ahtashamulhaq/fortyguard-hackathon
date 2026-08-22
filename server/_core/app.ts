import express, { type Express } from "express";
import { type Server } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

type AppOptions = {
  server?: Server;
  serveClient?: boolean;
};

export async function configureApp(app: Express, { server, serveClient = false }: AppOptions = {}) {
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  if (!serveClient) return app;
  if (process.env.NODE_ENV === "development" && server) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  return app;
}

export async function createApp(options: AppOptions = {}) {
  return configureApp(express(), options);
}
