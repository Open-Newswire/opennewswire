import { startWorker } from "@/lib/worker";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await startWorker();
  } else {
    console.warn(
      `[instrumentation] Skipping worker startup: unsupported runtime "${process.env.NEXT_RUNTIME}"`,
    );
  }
}
