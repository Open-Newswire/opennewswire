import { describe, it, expect } from "vitest";
import { compactAuthors, getTextContent } from "./utils";

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

describe("getTextContent", () => {
  it("should return plain string after decoding HTML entities", () => {
    expect(getTextContent("Simple string")).toBe("Simple string");
    expect(getTextContent("")).toBe("");
    expect(getTextContent("String with &amp; entity")).toBe("String with & entity");
  });

  it("should extract text from object with #text property", () => {
    const obj = {
      "#text": "Text content",
      $type: "text",
    };
    expect(getTextContent(obj)).toBe("Text content");
  });

  it("should extract text from object with _ property (legacy format)", () => {
    const obj = {
      _: "Text content",
      type: "text",
    };
    expect(getTextContent(obj)).toBe("Text content");
  });

  it("should prefer #text over _ when both are present", () => {
    const obj = {
      "#text": "Primary text",
      _: "Fallback text",
    };
    expect(getTextContent(obj)).toBe("Primary text");
  });

  it("should decode HTML entities when $type is html", () => {
    const obj = {
      "#text": "Title with &#8216;quotes&#8217; and &amp; ampersand",
      $type: "html",
    };
    // &#8216; = ' (left single quote), &#8217; = ' (right single quote)
    expect(getTextContent(obj)).toBe("Title with \u2018quotes\u2019 and & ampersand");
  });

  it("should decode HTML entities when $type is text", () => {
    const obj = {
      "#text": "Title with &amp; ampersand",
      $type: "text",
    };
    expect(getTextContent(obj)).toBe("Title with & ampersand");
  });

  it("should decode HTML entities when $type is absent", () => {
    const obj = {
      "#text": "Title with &amp; ampersand",
    };
    expect(getTextContent(obj)).toBe("Title with & ampersand");
  });

  it("should decode common HTML entities correctly", () => {
    const testCases = [
      {
        input: { "#text": "&#8220;curly quotes&#8221;", $type: "html" },
        expected: "\u201Ccurly quotes\u201D", // " and "
      },
      {
        input: { "#text": "Em&mdash;dash", $type: "html" },
        expected: "Em\u2014dash", // —
      },
      {
        input: { "#text": "Non&nbsp;breaking&nbsp;space", $type: "html" },
        expected: "Non\u00A0breaking\u00A0space", // non-breaking spaces
      },
      {
        input: { "#text": "&lt;tag&gt;", $type: "html" },
        expected: "<tag>",
      },
    ];

    testCases.forEach(({ input, expected }) => {
      expect(getTextContent(input)).toBe(expected);
    });
  });

  it("should return non-object, non-string values unchanged", () => {
    expect(getTextContent(123)).toBe(123);
    expect(getTextContent(true)).toBe(true);
    expect(getTextContent(null)).toBe(null);
    expect(getTextContent(undefined)).toBe(undefined);
  });

  it("should return object without #text or _ unchanged", () => {
    const obj = { foo: "bar", baz: "qux" };
    expect(getTextContent(obj)).toEqual(obj);
  });

  it("should handle object with #text undefined", () => {
    const obj = { "#text": undefined };
    expect(getTextContent(obj)).toEqual(obj);
  });

  it("should handle empty string in #text with html type", () => {
    const obj = {
      "#text": "",
      $type: "html",
    };
    expect(getTextContent(obj)).toBe("");
  });
});
