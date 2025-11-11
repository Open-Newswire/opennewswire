import { ArticleQuery } from "@/schemas/articles";
import { ArticleVisibility } from "@/types/article";
import { FeedStatus } from "@/types/feeds";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  buildArticleQueryStatement,
  buildOrderBy,
  buildWhere,
} from "./article-query-converter";

vi.mock("@/lib/prisma", () => ({
  default: {
    $kysely: {
      selectFrom: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
    },
  },
}));

vi.mock("@/utils/sanitize-search-string", () => ({
  sanitizeSearchString: vi.fn((str) => str.replace(/[^\w\s]/g, "")),
}));

// Helper function to create valid ArticleQuery objects
function createArticleQuery(
  overrides: Partial<ArticleQuery> = {},
): ArticleQuery {
  return {
    page: 1,
    size: 10,
    sortBy: "date",
    sortDirection: "desc",
    feedStatus: FeedStatus.all,
    visibility: ArticleVisibility.all,
    ...overrides,
  } as ArticleQuery;
}

// Get references to mocked functions
import prisma from "@/lib/prisma";
const mockKysely = prisma.$kysely as any;
const mockWhere = mockKysely.where;
const mockOrderBy = mockKysely.orderBy;
const mockLimit = mockKysely.limit;
const mockOffset = mockKysely.offset;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("buildOrderBy", () => {
  test("returns feed title ordering when sortBy is feed", () => {
    const query = createArticleQuery({
      sortBy: "feed",
      sortDirection: "asc",
    });

    const result = buildOrderBy(query);

    expect(result).toEqual({
      feed: {
        title: "asc",
      },
    });
  });

  test("returns direct field ordering for non-feed sortBy", () => {
    const query = createArticleQuery({
      sortBy: "title",
      sortDirection: "desc",
    });

    const result = buildOrderBy(query);

    expect(result).toEqual({
      title: "desc",
    });
  });

  test("returns date ordering by default", () => {
    const query = createArticleQuery({
      sortBy: "date",
      sortDirection: "asc",
    });

    const result = buildOrderBy(query);

    expect(result).toEqual({
      date: "asc",
    });
  });
});

describe("buildWhere", () => {
  test("returns empty where clause for empty query", () => {
    const query = createArticleQuery();

    const result = buildWhere(query);

    expect(result).toEqual({});
  });

  test("builds search conditions for title and content", () => {
    const query = createArticleQuery({
      search: "test query",
    });

    const result = buildWhere(query);

    expect(result).toEqual({
      title: {
        search: "test query:*",
      },
      content: {
        search: "test query:*",
      },
    });
  });

  test("builds feed status condition for active feeds", () => {
    const query = createArticleQuery({
      feedStatus: FeedStatus.active,
    });

    const result = buildWhere(query);

    expect(result).toEqual({
      feed: {
        isActive: true,
      },
    });
  });

  test("builds feed status condition for inactive feeds", () => {
    const query = createArticleQuery({
      feedStatus: FeedStatus.inactive,
    });

    const result = buildWhere(query);

    expect(result).toEqual({
      feed: {
        isActive: false,
      },
    });
  });

  test("ignores feed status when set to all", () => {
    const query = createArticleQuery({
      feedStatus: FeedStatus.all,
    });

    const result = buildWhere(query);

    expect(result).toEqual({});
  });

  test("builds visibility condition for hidden articles", () => {
    const query = createArticleQuery({
      visibility: ArticleVisibility.hidden,
    });

    const result = buildWhere(query);

    expect(result).toEqual({
      isHidden: true,
    });
  });

  test("builds visibility condition for visible articles", () => {
    const query = createArticleQuery({
      visibility: ArticleVisibility.visible,
    });

    const result = buildWhere(query);

    expect(result).toEqual({
      isHidden: false,
    });
  });

  test("ignores visibility when set to all", () => {
    const query = createArticleQuery({
      visibility: ArticleVisibility.all,
    });

    const result = buildWhere(query);

    expect(result).toEqual({});
  });

  test("builds license condition", () => {
    const query = createArticleQuery({
      license: "cc-by",
    });

    const result = buildWhere(query);

    expect(result).toEqual({
      feed: {
        licenseId: "cc-by",
      },
    });
  });

  test("builds language condition", () => {
    const query = createArticleQuery({
      language: "en",
    });

    const result = buildWhere(query);

    expect(result).toEqual({
      feed: {
        languageId: "en",
      },
    });
  });

  test("builds combined license and language conditions", () => {
    const query = createArticleQuery({
      license: "cc-by",
      language: "en",
    });

    const result = buildWhere(query);

    expect(result).toEqual({
      feed: {
        licenseId: "cc-by",
        languageId: "en",
      },
    });
  });

  test("builds complex query with multiple conditions", () => {
    const query = createArticleQuery({
      search: "breaking news",
      feedStatus: FeedStatus.active,
      visibility: ArticleVisibility.visible,
      license: "cc-by-sa",
      language: "en",
    });

    const result = buildWhere(query);

    expect(result).toEqual({
      title: {
        search: "breaking news:*",
      },
      content: {
        search: "breaking news:*",
      },
      feed: {
        licenseId: "cc-by-sa",
        languageId: "en",
      },
      isHidden: false,
    });
  });
});

describe("buildArticleQueryStatement", () => {
  test("applies licenses filter", () => {
    const query = createArticleQuery({
      page: 1,
      size: 20,
      licenses: ["cc-by", "cc-by-sa"],
    });

    buildArticleQueryStatement(query);

    expect(mockWhere).toHaveBeenCalledWith("li.slug", "in", [
      "cc-by",
      "cc-by-sa",
    ]);
  });

  test("applies languages filter", () => {
    const query = createArticleQuery({
      page: 1,
      size: 20,
      languages: ["en", "es"],
    });

    buildArticleQueryStatement(query);

    expect(mockWhere).toHaveBeenCalledWith("la.slug", "in", ["en", "es"]);
  });

  test("applies feed status filter for active feeds", () => {
    const query = createArticleQuery({
      page: 1,
      size: 20,
      feedStatus: FeedStatus.active,
    });

    buildArticleQueryStatement(query);

    expect(mockWhere).toHaveBeenCalledWith("f.isActive", "=", true);
  });

  test("applies visibility filter for hidden articles", () => {
    const query = createArticleQuery({
      page: 1,
      size: 20,
      visibility: ArticleVisibility.hidden,
    });

    buildArticleQueryStatement(query);

    expect(mockWhere).toHaveBeenCalledWith("a.isHidden", "=", true);
  });

  test("applies correct ordering for feed sortBy", () => {
    const query = createArticleQuery({
      page: 1,
      size: 20,
      sortBy: "feed",
      sortDirection: "asc",
    });

    buildArticleQueryStatement(query);

    expect(mockOrderBy).toHaveBeenCalledWith("f.title", "asc");
  });

  test("applies correct ordering for title sortBy", () => {
    const query = createArticleQuery({
      page: 2,
      size: 15,
      sortBy: "title",
      sortDirection: "desc",
    });

    buildArticleQueryStatement(query);

    expect(mockOrderBy).toHaveBeenCalledWith("a.title", "desc");
    expect(mockLimit).toHaveBeenCalledWith(15);
    expect(mockOffset).toHaveBeenCalledWith(15);
  });

  test("applies pagination correctly", () => {
    const query = createArticleQuery({
      page: 3,
      size: 25,
    });

    buildArticleQueryStatement(query);

    expect(mockLimit).toHaveBeenCalledWith(25);
    expect(mockOffset).toHaveBeenCalledWith(50); // (3-1) * 25
  });

  test("safely handles search queries", () => {
    const query = createArticleQuery({
      page: 1,
      size: 10,
      search: "test search",
    });

    buildArticleQueryStatement(query);

    expect(mockWhere).toHaveBeenCalled();
  });

  test("sanitizes malicious search input", () => {
    const query = createArticleQuery({
      page: 1,
      size: 10,
      search: "'; DROP TABLE users; --",
    });

    expect(() => buildArticleQueryStatement(query)).not.toThrow();
    expect(mockWhere).toHaveBeenCalled();
  });
});
