import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getEvidenceRecord, getFieldDetail, getPayoutLedger, getPortfolioData, runSyntheticHeatWaveScenario } from "./services/monitoring-service";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  agriGuard: router({
    portfolio: publicProcedure.query(() => getPortfolioData()),
    fieldDetail: publicProcedure.input(z.object({ fieldId: z.string().min(1) })).query(({ input }) => getFieldDetail(input.fieldId)),
    runSyntheticHeatWave: publicProcedure.mutation(() => runSyntheticHeatWaveScenario()),
    evidence: publicProcedure.input(z.object({ recordCode: z.string().min(1) })).query(({ input }) => getEvidenceRecord(input.recordCode)),
    ledger: publicProcedure.query(() => getPayoutLedger()),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
