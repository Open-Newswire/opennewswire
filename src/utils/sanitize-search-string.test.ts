import { describe, expect, test } from "vitest";
import { sanitizeSearchString } from "./sanitize-search-string";

describe("sanitizeSearchString", () => {
  test("returns empty string for null or undefined input", () => {
    expect(sanitizeSearchString("")).toBe("");
    expect(sanitizeSearchString(null as any)).toBe("");
    expect(sanitizeSearchString(undefined as any)).toBe("");
  });

  test("handles basic alphanumeric search terms", () => {
    expect(sanitizeSearchString("hello world")).toBe("hello & world");
    expect(sanitizeSearchString("test123")).toBe("test123");
    expect(sanitizeSearchString("JavaScript programming")).toBe(
      "JavaScript & programming",
    );
  });

  test("removes special characters that could be SQL injection vectors", () => {
    // PostgreSQL tsquery injection attempts
    expect(sanitizeSearchString("test'); DROP TABLE users; --")).toBe(
      "test & DROP & TABLE & users",
    );
    expect(sanitizeSearchString("admin'OR'1'='1")).toBe("admin & OR & 1 & 1");
    expect(sanitizeSearchString("test & !evil")).toBe("test & evil");
    expect(sanitizeSearchString("test | malicious")).toBe("test & malicious");
    expect(sanitizeSearchString("test <-> proximity")).toBe("test & proximity");
  });

  test("preserves safe punctuation", () => {
    expect(sanitizeSearchString("mother-in-law")).toBe("mother-in-law");
    expect(sanitizeSearchString("don't")).toBe("don't");
    expect(sanitizeSearchString("it's great")).toBe("it's & great");
  });

  test("handles multiple spaces and whitespace", () => {
    expect(sanitizeSearchString("hello    world")).toBe("hello & world");
    expect(sanitizeSearchString("  trimmed  ")).toBe("trimmed");
    expect(sanitizeSearchString("tab\there")).toBe("tab & here");
    expect(sanitizeSearchString("new\nline")).toBe("new & line");
  });

  test("limits word count to prevent DoS", () => {
    const manyWords = Array(15).fill("word").join(" ");
    const result = sanitizeSearchString(manyWords);
    const wordCount = result.split(" & ").length;
    expect(wordCount).toBeLessThanOrEqual(10);
  });

  test("limits string length to prevent DoS", () => {
    const longString = "a".repeat(300);
    const result = sanitizeSearchString(longString);
    expect(result.length).toBeLessThanOrEqual(200);
  });

  test("filters out empty words", () => {
    expect(sanitizeSearchString("hello  & && world")).toBe("hello & world");
    expect(sanitizeSearchString("!@#$%")).toBe("");
  });

  test("handles edge cases", () => {
    expect(sanitizeSearchString("a")).toBe("a");
    expect(sanitizeSearchString("1")).toBe("1");
    expect(sanitizeSearchString("123")).toBe("123");
  });

  test("prevents PostgreSQL function injection", () => {
    expect(sanitizeSearchString("plainto_tsquery('malicious')")).toBe(
      "plainto & tsquery & malicious",
    );
    expect(sanitizeSearchString("to_tsvector(version())")).toBe(
      "to & tsvector & version",
    );
  });

  test("prevents common SQL injection patterns", () => {
    expect(sanitizeSearchString("1' UNION SELECT * FROM")).toBe(
      "1 & UNION & SELECT & FROM",
    );
    expect(sanitizeSearchString("'; SELECT pg_sleep(10); --")).toBe(
      "SELECT & pg & sleep & 10",
    );
    expect(sanitizeSearchString("/**/UNION/**/SELECT")).toBe("UNION & SELECT");
  });
});
