import { validateRedirectUrl, getSafeRedirectUrl } from "./redirect-validation";

describe("validateRedirectUrl", () => {
  it("should allow valid internal paths", () => {
    expect(validateRedirectUrl("/admin")).toBe("/admin");
    expect(validateRedirectUrl("/admin/feeds")).toBe("/admin/feeds");
    expect(validateRedirectUrl("/admin/feeds/123")).toBe("/admin/feeds/123");
    expect(validateRedirectUrl("/admin/feeds?page=2")).toBe("/admin/feeds?page=2");
    expect(validateRedirectUrl("/admin/feeds#section")).toBe("/admin/feeds#section");
  });

  it("should reject external URLs", () => {
    expect(validateRedirectUrl("https://example.com")).toBeNull();
    expect(validateRedirectUrl("http://example.com")).toBeNull();
    expect(validateRedirectUrl("ftp://example.com")).toBeNull();
  });

  it("should reject protocol-relative URLs", () => {
    expect(validateRedirectUrl("//example.com")).toBeNull();
    expect(validateRedirectUrl("//example.com/path")).toBeNull();
  });

  it("should reject javascript: schemes", () => {
    expect(validateRedirectUrl("javascript:alert('xss')")).toBeNull();
    expect(validateRedirectUrl("JAVASCRIPT:alert('xss')")).toBeNull();
  });

  it("should reject data: schemes", () => {
    expect(validateRedirectUrl("data:text/html,<script>alert('xss')</script>")).toBeNull();
    expect(validateRedirectUrl("DATA:text/html,<script>alert('xss')</script>")).toBeNull();
  });

  it("should reject other dangerous schemes", () => {
    expect(validateRedirectUrl("file:///etc/passwd")).toBeNull();
    expect(validateRedirectUrl("mailto:test@example.com")).toBeNull();
    expect(validateRedirectUrl("tel:+1234567890")).toBeNull();
  });

  it("should handle null/undefined/empty inputs", () => {
    expect(validateRedirectUrl(null)).toBeNull();
    expect(validateRedirectUrl(undefined)).toBeNull();
    expect(validateRedirectUrl("")).toBeNull();
    expect(validateRedirectUrl("   ")).toBeNull();
  });

  it("should trim whitespace", () => {
    expect(validateRedirectUrl("  /admin  ")).toBe("/admin");
    expect(validateRedirectUrl("\n/admin\t")).toBe("/admin");
  });

  it("should reject extremely long URLs", () => {
    const longUrl = "/" + "a".repeat(2000);
    expect(validateRedirectUrl(longUrl)).toBeNull();
  });

  it("should reject URLs that don't start with /", () => {
    expect(validateRedirectUrl("admin")).toBeNull();
    expect(validateRedirectUrl("relative/path")).toBeNull();
    expect(validateRedirectUrl("./admin")).toBeNull();
    expect(validateRedirectUrl("../admin")).toBeNull();
  });
});

describe("getSafeRedirectUrl", () => {
  it("should return valid URLs as-is", () => {
    expect(getSafeRedirectUrl("/admin/feeds")).toBe("/admin/feeds");
    expect(getSafeRedirectUrl("/admin")).toBe("/admin");
    expect(getSafeRedirectUrl("/admin/feeds?page=2")).toBe("/admin/feeds?page=2");
  });

  it("should return fallback for invalid URLs", () => {
    expect(getSafeRedirectUrl("https://example.com")).toBe("/admin");
    expect(getSafeRedirectUrl("//example.com")).toBe("/admin");
    expect(getSafeRedirectUrl("javascript:alert('xss')")).toBe("/admin");
  });

  it("should use custom fallback", () => {
    expect(getSafeRedirectUrl("https://example.com", "/dashboard")).toBe("/dashboard");
    expect(getSafeRedirectUrl("invalid", "/custom")).toBe("/custom");
  });

  it("should handle null/undefined inputs", () => {
    expect(getSafeRedirectUrl(null)).toBe("/admin");
    expect(getSafeRedirectUrl(undefined)).toBe("/admin");
    expect(getSafeRedirectUrl(null, "/custom")).toBe("/custom");
    expect(getSafeRedirectUrl(undefined, "/custom")).toBe("/custom");
  });

  it("should handle empty/whitespace inputs", () => {
    expect(getSafeRedirectUrl("")).toBe("/admin");
    expect(getSafeRedirectUrl("   ")).toBe("/admin");
    expect(getSafeRedirectUrl("", "/custom")).toBe("/custom");
  });
});