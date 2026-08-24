import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createScan, createStoredFile, getScanStats, linkStoredFileToScan, listScans, listStoredFiles } from "./db";
import { storagePut } from "./storage";

const scanInput = z.object({
  inputType: z.enum(["url", "email", "sms", "qr"]),
  inputLabel: z.string().min(1).max(255),
  inputContent: z.string().min(1).max(200_000),
  score: z.number().int().min(0).max(100),
  verdict: z.string().min(1).max(32),
  summary: z.string().min(1).max(10_000),
  evidence: z.array(z.string().min(1).max(1_000)).max(30),
  nextSteps: z.array(z.string().min(1).max(1_000)).max(30),
});

const fileInput = z.object({
  originalName: z.string().min(1).max(255),
  mimeType: z.enum(["image/png", "image/jpeg", "image/webp", "image/gif"]),
  dataBase64: z.string().min(1).max(10_000_000),
  scanId: z.number().int().positive().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  scans: router({
    create: publicProcedure.input(scanInput).mutation(async ({ input, ctx }) => {
      const id = await createScan({
        userId: ctx.user?.id,
        inputType: input.inputType,
        inputLabel: input.inputLabel,
        inputContent: input.inputContent,
        score: input.score,
        verdict: input.verdict,
        summary: input.summary,
        evidenceJson: JSON.stringify(input.evidence),
        nextStepsJson: JSON.stringify(input.nextSteps),
      });
      return { id };
    }),
    list: publicProcedure.input(z.object({ limit: z.number().int().min(1).max(100).default(50) }).optional()).query(({ input }) =>
      listScans(input?.limit ?? 50),
    ),
    stats: publicProcedure.query(() => getScanStats()),
  }),
  files: router({
    upload: publicProcedure.input(fileInput).mutation(async ({ input, ctx }) => {
      const payload = input.dataBase64.includes(",") ? input.dataBase64.split(",").pop() : input.dataBase64;
      if (!payload) throw new Error("File payload is empty");
      const buffer = Buffer.from(payload, "base64");
      if (buffer.byteLength > 5 * 1024 * 1024) throw new Error("File must be 5 MB or smaller");
      const safeName = input.originalName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
      const uploaded = await storagePut(`adya-vigil/${ctx.user?.id ?? "anonymous"}/${safeName}`, buffer, input.mimeType);
      const id = await createStoredFile({
        userId: ctx.user?.id,
        scanId: input.scanId,
        originalName: input.originalName,
        mimeType: input.mimeType,
        sizeBytes: buffer.byteLength,
        storageKey: uploaded.key,
        storageUrl: uploaded.url,
      });
      return { id, ...uploaded, originalName: input.originalName, sizeBytes: buffer.byteLength };
    }),
    linkToScan: publicProcedure.input(z.object({ fileId: z.number().int().positive(), scanId: z.number().int().positive() })).mutation(({ input }) =>
      linkStoredFileToScan(input.fileId, input.scanId),
    ),
    list: publicProcedure.input(z.object({ limit: z.number().int().min(1).max(100).default(50) }).optional()).query(({ input }) =>
      listStoredFiles(input?.limit ?? 50),
    ),
  }),
});

export type AppRouter = typeof appRouter;
