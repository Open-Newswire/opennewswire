import { Task, JobHelpers } from "graphile-worker";
import {
  withTimeout,
  withTimeouts,
  TaskTimeoutError,
  TimeoutAwareHelpers,
} from "./task-timeout";

function fakeHelpers(): JobHelpers {
  return {
    logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
  } as unknown as JobHelpers;
}

describe("withTimeout", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the task result when it finishes before the deadline", async () => {
    const wrapped = withTimeout("fast", 1000, async () => "done" as never);
    await expect(wrapped({}, fakeHelpers())).resolves.toBe("done");
  });

  it("rejects with TaskTimeoutError and aborts the signal when it overruns", async () => {
    vi.useFakeTimers();
    const helpers = fakeHelpers();

    let observedSignal: AbortSignal | undefined;
    const hangs: Task = (_payload, h) => {
      observedSignal = (h as TimeoutAwareHelpers).signal;
      return new Promise<void>(() => {}); // never settles
    };

    const wrapped = withTimeout("hangs", 5000, hangs);
    const result = wrapped({}, helpers);
    const assertion = expect(result).rejects.toBeInstanceOf(TaskTimeoutError);

    await vi.advanceTimersByTimeAsync(5000);
    await assertion;

    expect(observedSignal?.aborted).toBe(true);
    expect(helpers.logger.error).toHaveBeenCalledOnce();
  });

  it("exposes the abort signal on helpers without mutating the original", async () => {
    const helpers = fakeHelpers();
    let received: JobHelpers | undefined;
    const wrapped = withTimeout("inspect", 1000, async (_p, h) => {
      received = h;
      return undefined;
    });

    await wrapped({}, helpers);

    expect((received as TimeoutAwareHelpers).signal).toBeInstanceOf(AbortSignal);
    expect("signal" in helpers).toBe(false);
  });

  it("throws when the budget is zero, negative, or NaN", () => {
    expect(() => withTimeout("zero", 0, async () => undefined)).toThrow();
    expect(() => withTimeout("negative", -1, async () => undefined)).toThrow();
    expect(() => withTimeout("nan", NaN, async () => undefined)).toThrow();
  });

  it("does not arm a timer when the budget is infinite", async () => {
    vi.useFakeTimers();
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");

    const wrappedInf = withTimeout("disabled", Infinity, async () => "ok2" as never);
    await expect(wrappedInf({}, fakeHelpers())).resolves.toBe("ok2");

    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  it("propagates the task's own error untouched", async () => {
    const boom = new Error("task failed");
    const wrapped = withTimeout("boom", 1000, async () => {
      throw boom;
    });
    await expect(wrapped({}, fakeHelpers())).rejects.toBe(boom);
  });
});

describe("withTimeouts", () => {
  it("applies per-task budgets and falls back to the default", async () => {
    vi.useFakeTimers();
    const helpers = fakeHelpers();

    const list: Record<string, Task> = {
      mapped: () => new Promise<void>(() => {}),
      unmapped: () => new Promise<void>(() => {}),
    };
    const wrapped = withTimeouts(list, { mapped: 1000 }, 3000);

    const mapped = wrapped.mapped({}, helpers);
    const mappedAssertion = expect(mapped).rejects.toBeInstanceOf(TaskTimeoutError);
    await vi.advanceTimersByTimeAsync(1000);
    await mappedAssertion;

    // The unmapped task uses the 3000ms default, so it is still pending at 1000ms.
    const unmapped = wrapped.unmapped({}, helpers);
    const unmappedAssertion = expect(unmapped).rejects.toBeInstanceOf(TaskTimeoutError);
    await vi.advanceTimersByTimeAsync(3000);
    await unmappedAssertion;
  });
});
