import { Field } from "@/lib/feed-parser/types";

interface Fields {
  feed: Field[];
  item: Field[];
}

function includeITunes(f: string) {
  return ["itunes:" + f, f];
}

const fields: Fields = {
  feed: [
    ["author", "creator"],
    ["dc:publisher", "publisher"],
    ["dc:creator", "creator"],
    ["dc:source", "source"],
    ["dc:title", "title"],
    ["dc:type", "type"],
    "title",
    "description",
    "author",
    "pubDate",
    "webMaster",
    "managingEditor",
    "generator",
    "link",
    "language",
    "copyright",
    "lastBuildDate",
    "docs",
    "generator",
    "ttl",
    "rating",
    "skipHours",
    "skipDays",
  ],
  item: [
    ["author", "creator"],
    ["dc:creator", "creator"],
    ["dc:date", "date"],
    ["dc:language", "language"],
    ["dc:rights", "rights"],
    ["dc:source", "source"],
    ["dc:title", "title"],
    "title",
    "link",
    "pubDate",
    "author",
    "summary",
    ["content:encoded", "content:encoded", { includeSnippet: true }],
    "enclosure",
    "dc:creator",
    "dc:date",
    "comments",
  ],
};

export default fields;
