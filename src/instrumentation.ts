export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Import the worker dynamically inside the nodejs guard so it never enters
    // the Edge runtime's module graph. The worker pulls in the Prisma client,
    // which imports Node-only built-ins (node:path, node:url, …) that the Edge
    // runtime rejects at build time.
    const { startWorker } = await import("@/lib/worker");
    await startWorker();
  } else {
    console.warn(
      `[instrumentation] Skipping worker startup: unsupported runtime "${process.env.NEXT_RUNTIME}"`,
    );
  }
}
