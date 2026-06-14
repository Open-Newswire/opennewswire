import { JobHelpers, Task } from "graphile-worker";

export class TaskTimeoutError extends Error {
  constructor(taskName: string, timeoutMs: number) {
    super(
      `Task "${taskName}" exceeded its timeout of ${timeoutMs}ms and was aborted`,
    );
    this.name = "TaskTimeoutError";
  }
}

export interface TimeoutAwareHelpers extends JobHelpers {
  signal: AbortSignal;
}

/**
 * Wraps a task so it rejects with {@link TaskTimeoutError} if it runs longer
 * than `timeoutMs`.
 *
 * Note: racing a promise does not, by itself, stop the work behind it.
 * The orphaned promise keeps running until it settles on its own. We additionally
 * abort an {@link AbortController} so tasks that honour `helpers.signal` can
 * unwind cleanly. Tasks that don't will still free their worker slot here.
 */
export function withTimeout(
  taskName: string,
  timeoutMs: number,
  task: Task,
): Task {
  if (Number.isNaN(timeoutMs) || timeoutMs <= 0) {
    throw new Error(
      `withTimeout("${taskName}") requires a positive timeout in milliseconds (or Infinity to disable); received ${timeoutMs}`,
    );
  }

  return async (payload, helpers) => {
    // Infinity means "no timeout" — run the task as-is without arming a timer.
    if (!Number.isFinite(timeoutMs)) {
      return task(payload, helpers);
    }

    const controller = new AbortController();
    const augmentedHelpers: TimeoutAwareHelpers = Object.assign(
      Object.create(Object.getPrototypeOf(helpers)),
      helpers,
      { signal: controller.signal },
    );

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        helpers.logger.error(
          `Task "${taskName}" exceeded ${timeoutMs}ms, aborting and failing the attempt`,
        );
        reject(new TaskTimeoutError(taskName, timeoutMs));
      }, timeoutMs);
    });

    try {
      return await Promise.race([task(payload, augmentedHelpers), timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };
}

/**
 * Applies {@link withTimeout} to every task in a task list.
 *
 * `timeouts` maps task names to their time budget in milliseconds.
 */
export function withTimeouts(
  taskList: Record<string, Task>,
  timeouts: Record<string, number>,
  defaultMs: number,
): Record<string, Task> {
  return Object.fromEntries(
    Object.entries(taskList).map(([name, task]) => [
      name,
      withTimeout(name, timeouts[name] ?? defaultMs, task),
    ]),
  );
}
