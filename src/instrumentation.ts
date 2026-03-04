export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startWorker, stopWorker } = await import("@/lib/worker");

    await startWorker();

    const shutdown = async () => {
      await stopWorker();
      process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  }
}