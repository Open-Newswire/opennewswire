import { describe, it, expect } from "vitest";
import { compactAuthors } from "./utils";

describe("compactAuthors", () => {
  it("should return undefined for null or undefined input", () => {
    expect(compactAuthors(null)).toBeUndefined();
    expect(compactAuthors(undefined)).toBeUndefined();
  });

  it("should return the same string if input is already a string", () => {
    expect(compactAuthors("John Doe")).toBe("John Doe");
    expect(compactAuthors("jane@example.com (Jane Smith)")).toBe(
      "jane@example.com (Jane Smith)",
    );
  });

  it("should compact an array of string authors", () => {
    expect(compactAuthors(["Alice", "Bob", "Charlie"])).toBe(
      "Alice, Bob, Charlie",
    );
    expect(compactAuthors(["Single Author"])).toBe("Single Author");
  });

  it("should compact an array of author objects with name property", () => {
    const authors = [
      { name: "Emily Davis", email: "emily@example.com" },
      { name: "Frank Miller", email: "frank@example.com" },
      { name: "Grace Lee", email: "grace@example.com" },
    ];
    expect(compactAuthors(authors)).toBe("Emily Davis, Frank Miller, Grace Lee");
  });

  it("should handle mixed array of strings and objects", () => {
    const authors = [
      "Alice Williams",
      { name: "Bob Johnson", email: "bob@example.com" },
      "Charlie Brown",
    ];
    expect(compactAuthors(authors)).toBe(
      "Alice Williams, Bob Johnson, Charlie Brown",
    );
  });

  it("should filter out empty strings from array", () => {
    expect(compactAuthors(["Alice", "", "Bob", "   ", "Charlie"])).toBe(
      "Alice, Bob, Charlie",
    );
  });

  it("should filter out null values from array", () => {
    const authors = ["Alice", null, "Bob", undefined, "Charlie"];
    expect(compactAuthors(authors)).toBe("Alice, Bob, Charlie");
  });

  it("should return undefined for empty array", () => {
    expect(compactAuthors([])).toBeUndefined();
  });

  it("should return undefined for array with only empty strings", () => {
    expect(compactAuthors(["", "   ", ""])).toBeUndefined();
  });

  it("should handle single author object with name property", () => {
    const author = { name: "Henry Wilson", email: "henry@example.com" };
    expect(compactAuthors(author)).toBe("Henry Wilson");
  });

  it("should return undefined for author object without name property", () => {
    const author = { email: "test@example.com" };
    expect(compactAuthors(author)).toBeUndefined();
  });

  it("should handle array of author objects where some lack name property", () => {
    const authors = [
      { name: "Valid Author", email: "valid@example.com" },
      { email: "noname@example.com" },
      { name: "Another Valid", email: "another@example.com" },
    ];
    expect(compactAuthors(authors)).toBe("Valid Author, Another Valid");
  });

  it("should preserve whitespace within author names", () => {
    expect(compactAuthors(["Dr. John Smith III", "Prof. Jane Doe"])).toBe(
      "Dr. John Smith III, Prof. Jane Doe",
    );
  });

  it("should handle special characters in author names", () => {
    expect(compactAuthors(["José García", "François Müller", "李明"])).toBe(
      "José García, François Müller, 李明",
    );
  });

  it("should handle email format authors", () => {
    expect(
      compactAuthors([
        "john@example.com (John Doe)",
        "jane@example.com (Jane Smith)",
      ]),
    ).toBe("john@example.com (John Doe), jane@example.com (Jane Smith)");
  });
});
