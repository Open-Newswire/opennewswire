import { Field } from "@/lib/feed-parser/types";
import { decodeHTML } from "entities";
import { XMLBuilder } from "fast-xml-parser";

export function stripHtml(str: string) {
  str = str.replace(
    /([^\n])<\/?(h|br|p|ul|ol|li|blockquote|section|table|tr|div)(?:.|\n)*?>([^\n])/gm,
    "$1\n$3",
  );
  str = str.replace(/<(?:.|\n)*?>/gm, "");
  return str;
}

export function getSnippet(str: string | undefined) {
  return str ? decodeHTML(stripHtml(str)).trim() : undefined;
}

export function getLink(links: any[], rel: string, fallbackIdx: number) {
  if (!links || !Array.isArray(links)) return;
  for (let i = 0; i < links.length; ++i) {
    if (links[i].$rel === rel) return links[i].$href;
  }
  if (links[fallbackIdx]) return links[fallbackIdx].$href;
}

export function getContent(content: any) {
  if (typeof content._ === "string") {
    return content._;
  } else if (typeof content === "object") {
    let builder = new XMLBuilder({
      format: false,
    });
    return builder.build(content);
  } else {
    return content;
  }
}

export function copyFromXML(
  xml: any,
  dest: { [name: string]: any },
  fields: Field[],
) {
  fields.forEach(function (f) {
    let from: string;
    let to: string;
    let options: any = {};

    if (Array.isArray(f)) {
      from = f[0];
      to = f[1];
      if (f.length > 2) {
        options = f[2];
      }
    } else {
      from = f;
      to = f;
    }

    const { includeSnippet } = options;

    // Only set if source exists and destination doesn't already have a value
    if (xml[from] !== undefined && dest[to] === undefined) {
      let value = xml[from];
      // If it's an array with a single string element, unwrap it
      if (Array.isArray(value) && value.length === 1 && typeof value[0] === "string") {
        value = value[0];
      }
      dest[to] = value;
    }

    if (dest[to] && typeof dest[to]._ === "string") {
      dest[to] = dest[to]._;
    }

    if (includeSnippet && dest[to] && typeof dest[to] === "string") {
      dest[to + "Snippet"] = getSnippet(dest[to]);
    }
  });
}

const DEFAULT_ENCODING = "utf8";
const ENCODING_REGEX = /(encoding|charset)\s*=\s*(\S+)/;
const SUPPORTED_ENCODINGS = [
  "ascii",
  "utf8",
  "utf16le",
  "ucs2",
  "base64",
  "latin1",
  "binary",
  "hex",
];
const ENCODING_ALIASES: Record<string, string> = {
  "utf-8": "utf8",
  "iso-8859-1": "latin1",
};

export function getEncodingFromContentType(contentType: string) {
  contentType = contentType || "";
  let match = contentType.match(ENCODING_REGEX);
  let encoding = (match || [])[2] || "";
  encoding = encoding.toLowerCase();

  encoding = ENCODING_ALIASES[encoding] || encoding;

  if (!encoding || SUPPORTED_ENCODINGS.indexOf(encoding) === -1) {
    encoding = DEFAULT_ENCODING;
  }
  return encoding;
}

/**
 * Compacts an array of authors into a single string.
 * If input is already a string, returns it unchanged.
 * If input is an array, joins authors with ", ".
 *
 * @param authors - String, array of strings, or array of author objects with name property
 * @returns Compacted author string or undefined
 */
export function compactAuthors(authors: any): string | undefined {
  if (!authors) {
    return undefined;
  }

  // Already a string
  if (typeof authors === "string") {
    return authors;
  }

  // Handle array of authors
  if (Array.isArray(authors)) {
    const authorNames = authors
      .map((author) => {
        // Handle author objects with name property (Atom format)
        if (typeof author === "object" && author !== null && author.name) {
          return author.name;
        }
        // Handle string authors (RSS format)
        if (typeof author === "string") {
          return author;
        }
        return null;
      })
      .filter((name) => name !== null && name.trim() !== "");

    return authorNames.length > 0 ? authorNames.join(", ") : undefined;
  }

  // Handle single author object (Atom format)
  if (typeof authors === "object" && authors !== null && authors.name) {
    return authors.name;
  }

  return undefined;
}
