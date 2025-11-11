import { Item } from "@/lib/feed-parser/types";
import { faker } from "@faker-js/faker";
import { ContentSource } from "@prisma/client";
import { expect, test } from "vitest";
import { Context } from "../types";
import { sanitize } from "./sanitizer";

const createMockContext = (overrides?: Partial<Context>): Context => ({
  logger: {
    info: async () => {},
  },
  feed: {
    id: "test-feed",
    title: "Test Feed",
    url: "https://example.com/feed",
    contentSource: ContentSource.CONTENT,
    ...overrides?.feed,
  } as any,
  policy: {
    cutoffDate: new Date(),
    minimumItems: 10,
  },
  count: 0,
  ...overrides,
});

test("extracts guid from item if exists", () => {
  const item: Item = {
    guid: "123",
    title: "Test",
    isoDate: new Date().toISOString(),
  };

  const context = createMockContext();
  const result = sanitize(item, context);

  expect(result.guid).toEqual("123");
});

test("extracts id from item if exists", () => {
  const item: Item & { id: string } = {
    id: "123",
    title: "Test",
    isoDate: new Date().toISOString(),
  };

  const context = createMockContext();
  const result = sanitize(item, context);

  expect(result.guid).toEqual("123");
});

test("creates guid hash from item if guid does not exist", () => {
  const item: Item = {
    title: "a new title",
    summary: "a summary",
  };

  const context = createMockContext();
  const result = sanitize(item, context);

  // The hash should be deterministic based on the item content
  expect(result.guid).toBeTruthy();
  expect(typeof result.guid).toBe("string");
  expect(result.guid.length).toBeGreaterThan(0);

  // Test that the same item produces the same hash
  const result2 = sanitize(item, context);
  expect(result2.guid).toEqual(result.guid);
});

test("extracts misc metadata from item", () => {
  const url = faker.internet.url();
  const creator = faker.person.fullName();
  const item: Item = {
    guid: "guid",
    title: "title",
    pubDate: "",
    link: url,
    creator: creator,
    isoDate: new Date().toISOString(),
  };

  const context = createMockContext();
  const result = sanitize(item, context);

  expect(result.title).toEqual(item.title);
  expect(result.link).toEqual(url);
  expect(result.author).toEqual(creator);
});
