import { beforeEach, describe, expect, it } from "vitest";
import { Parser } from "./parser";

describe("Parser", () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  describe("RSS 2.0 feeds", () => {
    it("should parse a basic RSS 2.0 feed", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Sample RSS 2.0 Feed</title>
    <link>https://example.com</link>
    <description>A sample RSS 2.0 feed for testing</description>
    <language>en-us</language>
    <lastBuildDate>Mon, 09 Nov 2025 10:00:00 GMT</lastBuildDate>
    <item>
      <title>First Article</title>
      <link>https://example.com/article1</link>
      <description>This is the first article</description>
      <pubDate>Mon, 09 Nov 2025 09:00:00 GMT</pubDate>
      <guid>article1</guid>
    </item>
    <item>
      <title>Second Article</title>
      <link>https://example.com/article2</link>
      <description>This is the second article</description>
      <pubDate>Mon, 09 Nov 2025 08:00:00 GMT</pubDate>
      <guid>article2</guid>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.title).toBe("Sample RSS 2.0 Feed");
      expect(result.link).toBe("https://example.com");
      expect(result.description).toBe("A sample RSS 2.0 feed for testing");
      expect(result.language).toBe("en-us");
      expect(result.lastBuildDate).toBe("Mon, 09 Nov 2025 10:00:00 GMT");
      expect(result.items).toHaveLength(2);
      expect(result.items[0].title).toBe("First Article");
      expect(result.items[0].link).toBe("https://example.com/article1");
      expect(result.items[0].content).toBe("This is the first article");
      expect(result.items[0].guid).toBe("article1");
      expect(result.items[1].title).toBe("Second Article");
    });

    it("should parse RSS 2.0 feed with enclosures", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Podcast Feed</title>
    <link>https://example.com</link>
    <description>A podcast feed</description>
    <item>
      <title>Episode 1</title>
      <link>https://example.com/episode1</link>
      <description>First episode</description>
      <enclosure url="https://example.com/episode1.mp3" length="12345" type="audio/mpeg" />
      <guid>episode1</guid>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].enclosure).toBeDefined();
      expect(result.items[0].enclosure?.url).toBe(
        "https://example.com/episode1.mp3",
      );
      expect(result.items[0].enclosure?.length).toBe("12345");
      expect(result.items[0].enclosure?.type).toBe("audio/mpeg");
    });

    it("should parse RSS 2.0 feed with categories", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>News Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article</title>
      <category>Technology</category>
      <category>Science</category>
      <category>News</category>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].categories).toBeDefined();
      expect(result.items[0].categories).toHaveLength(3);
      expect(result.items[0].categories).toEqual([
        "Technology",
        "Science",
        "News",
      ]);
    });

    it("should parse RSS 2.0 feed with media:content", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Media Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Video Article</title>
      <media:content url="https://example.com/video.mp4" type="video/mp4" width="640" height="480" />
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].mediaContent).toBeDefined();
      expect(result.items[0].mediaContent.url).toBe(
        "https://example.com/video.mp4",
      );
      expect(result.items[0].mediaContent.type).toBe("video/mp4");
    });

    it("should parse RSS 2.0 feed with channel image", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed with Image</title>
    <link>https://example.com</link>
    <image>
      <url>https://example.com/logo.png</url>
      <title>Site Logo</title>
      <link>https://example.com</link>
      <width>144</width>
      <height>144</height>
    </image>
    <item>
      <title>Article</title>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.image).toBeDefined();
      expect(result.image?.url).toBe("https://example.com/logo.png");
      expect(result.image?.title).toBe("Site Logo");
      expect(result.image?.link).toBe("https://example.com");
      expect(result.image?.width).toBe("144");
      expect(result.image?.height).toBe("144");
    });

    it("should parse RSS 2.0 feed with atom:link for feedUrl", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Feed with Self Link</title>
    <link>https://example.com</link>
    <atom:link href="https://example.com/feed.xml" rel="self" type="application/rss+xml" />
    <item>
      <title>Article</title>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.feedUrl).toBe("https://example.com/feed.xml");
    });

    it("should parse RSS 2.0 feed with pagination links", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Paginated Feed</title>
    <link>https://example.com</link>
    <atom:link href="https://example.com/feed.xml" rel="self" />
    <atom:link href="https://example.com/feed.xml" rel="first" />
    <atom:link href="https://example.com/feed.xml?page=2" rel="next" />
    <atom:link href="https://example.com/feed.xml?page=10" rel="last" />
    <item>
      <title>Article</title>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.paginationLinks).toBeDefined();
      expect(result.paginationLinks?.self).toBe("https://example.com/feed.xml");
      expect(result.paginationLinks?.first).toBe(
        "https://example.com/feed.xml",
      );
      expect(result.paginationLinks?.next).toBe(
        "https://example.com/feed.xml?page=2",
      );
      expect(result.paginationLinks?.last).toBe(
        "https://example.com/feed.xml?page=10",
      );
    });

    it("should parse RSS 2.0 feed with Dublin Core fields", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Feed with DC</title>
    <link>https://example.com</link>
    <dc:creator>John Doe</dc:creator>
    <dc:publisher>Example Publisher</dc:publisher>
    <item>
      <title>Article</title>
      <dc:creator>Jane Smith</dc:creator>
      <dc:date>2025-11-09</dc:date>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.creator).toBe("John Doe");
      expect(result.publisher).toBe("Example Publisher");
      expect(result.items[0].creator).toBe("Jane Smith");
      expect(result.items[0].date).toBe("2025-11-09");
    });

    it("should set isoDate for items with pubDate", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article</title>
      <pubDate>Mon, 09 Nov 2025 09:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].isoDate).toBeDefined();
      expect(result.items[0].isoDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it("should parse RSS 2.0 feed with content:encoded", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article</title>
      <description>Short description</description>
      <content:encoded><![CDATA[<p>Full <strong>HTML</strong> content here</p>]]></content:encoded>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0]["content:encoded"]).toContain("HTML");
      expect(result.items[0]["content:encodedSnippet"]).toBeDefined();
    });
  });

  describe("RSS 1.0 feeds", () => {
    it("should parse a basic RSS 1.0 feed", async () => {
      const rss1Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns="http://purl.org/rss/1.0/">
  <channel>
    <title>Sample RSS 1.0 Feed</title>
    <link>https://example.com</link>
    <description>A sample RSS 1.0 feed for testing</description>
  </channel>
  <item rdf:about="https://example.com/article1">
    <title>First Article</title>
    <link>https://example.com/article1</link>
    <description>This is the first article</description>
  </item>
  <item rdf:about="https://example.com/article2">
    <title>Second Article</title>
    <link>https://example.com/article2</link>
    <description>This is the second article</description>
  </item>
</rdf:RDF>`;

      const result = await parser.parseString(rss1Feed);

      expect(result.title).toBe("Sample RSS 1.0 Feed");
      expect(result.link).toBe("https://example.com");
      expect(result.description).toBe("A sample RSS 1.0 feed for testing");
      expect(result.items).toHaveLength(2);
      expect(result.items[0].title).toBe("First Article");
      expect(result.items[0].link).toBe("https://example.com/article1");
      expect(result.items[0]["rdf:about"]).toBe("https://example.com/article1");
      expect(result.items[1].title).toBe("Second Article");
    });

    it("should parse RSS 1.0 feed with Dublin Core fields", async () => {
      const rss1Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns="http://purl.org/rss/1.0/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Feed</title>
    <link>https://example.com</link>
    <dc:creator>Channel Creator</dc:creator>
    <dc:publisher>Channel Publisher</dc:publisher>
  </channel>
  <item rdf:about="https://example.com/article1">
    <title>Article</title>
    <link>https://example.com/article1</link>
    <dc:creator>Article Author</dc:creator>
    <dc:date>2025-11-09T10:00:00Z</dc:date>
    <dc:title>Article DC Title</dc:title>
  </item>
</rdf:RDF>`;

      const result = await parser.parseString(rss1Feed);

      expect(result.creator).toBe("Channel Creator");
      expect(result.publisher).toBe("Channel Publisher");
      expect(result.items[0].creator).toBe("Article Author");
      expect(result.items[0].date).toBe("2025-11-09T10:00:00Z");
      expect(result.items[0].title).toBe("Article DC Title");
    });
  });

  describe("Atom feeds", () => {
    it("should parse a basic Atom feed", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Sample Atom Feed</title>
  <link href="https://example.com" rel="alternate" />
  <link href="https://example.com/feed.xml" rel="self" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title>First Article</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <published>2025-11-09T09:00:00Z</published>
    <updated>2025-11-09T09:30:00Z</updated>
    <summary>This is a summary</summary>
    <content>This is the full content</content>
  </entry>
  <entry>
    <title>Second Article</title>
    <link href="https://example.com/article2" rel="alternate" />
    <id>article2</id>
    <updated>2025-11-09T08:00:00Z</updated>
    <content>Second article content</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      expect(result.title).toBe("Sample Atom Feed");
      expect(result.link).toBe("https://example.com");
      expect(result.feedUrl).toBe("https://example.com/feed.xml");
      expect(result.lastBuildDate).toBe("2025-11-09T10:00:00Z");
      expect(result.items).toHaveLength(2);
      expect(result.items[0].title).toBe("First Article");
      expect(result.items[0].link).toBe("https://example.com/article1");
      expect(result.items[0].id).toBe("article1");
      expect(result.items[0].summary).toBe("This is a summary");
      expect(result.items[0].content).toBe("This is the full content");
      expect(result.items[0].pubDate).toBe("2025-11-09T09:00:00Z");
      expect(result.items[1].title).toBe("Second Article");
    });

    it("should parse Atom feed with author", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Feed with Author</title>
  <link href="https://example.com" rel="alternate" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title>Article</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <updated>2025-11-09T09:00:00Z</updated>
    <author>
      <name>Jane Smith</name>
      <email>jane@example.com</email>
    </author>
    <content>Article content</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      expect(result.items[0].author).toBe("Jane Smith");
    });

    it("should use updated date when published is not available", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Feed</title>
  <link href="https://example.com" rel="alternate" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title>Article</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <updated>2025-11-09T09:00:00Z</updated>
    <content>Content</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      expect(result.items[0].pubDate).toBe("2025-11-09T09:00:00Z");
    });

    it("should prefer published over updated date", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Feed</title>
  <link href="https://example.com" rel="alternate" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title>Article</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <published>2025-11-09T08:00:00Z</published>
    <updated>2025-11-09T09:00:00Z</updated>
    <content>Content</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      expect(result.items[0].pubDate).toBe("2025-11-09T08:00:00Z");
    });

    it("should generate content snippet from HTML content", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Feed</title>
  <link href="https://example.com" rel="alternate" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title>Article</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <updated>2025-11-09T09:00:00Z</updated>
    <content type="html">&lt;p&gt;This is &lt;strong&gt;HTML&lt;/strong&gt; content&lt;/p&gt;</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      expect(result.items[0].contentSnippet).toBeDefined();
      expect(result.items[0].contentSnippet).toContain("This is");
      expect(result.items[0].contentSnippet).toContain("HTML");
    });

    it("should handle title with underscore notation", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="text">Sample Feed</title>
  <link href="https://example.com" rel="alternate" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title type="text">Article Title</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <updated>2025-11-09T09:00:00Z</updated>
    <content>Content</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      expect(result.title).toBeDefined();
      expect(result.items[0].title).toBeDefined();
    });

    it("should handle Atom feed with title having type='html' attribute", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="html">Feed Title with &amp;#8216;HTML&amp;#8217; entities</title>
  <link href="https://example.com" rel="alternate" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title type="html">LAUSD receives mostly &amp;#8216;B&amp;#8217; grades from district parents, survey reveals</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <updated>2025-11-09T09:00:00Z</updated>
    <content>Content</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      // Title should be extracted as a string (not an object)
      expect(typeof result.title).toBe("string");
      expect(typeof result.items[0].title).toBe("string");

      // HTML entities should be decoded (&#8216; = ', &#8217; = ')
      expect(result.title).toBe("Feed Title with \u2018HTML\u2019 entities");
      expect(result.items[0].title).toBe(
        "LAUSD receives mostly \u2018B\u2019 grades from district parents, survey reveals",
      );
    });

    it("should handle Atom feed with summary and content having type='html' attribute", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Feed</title>
  <link href="https://example.com" rel="alternate" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title>Article</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <updated>2025-11-09T09:00:00Z</updated>
    <summary type="html">Summary with &amp;#8220;curly quotes&amp;#8221; and &amp;mdash; dashes</summary>
    <content type="html">Content with &amp;nbsp; non-breaking spaces</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      // Summary and content should be extracted as strings with decoded entities
      // &#8220; = " (left double quote), &#8221; = " (right double quote)
      // &mdash; = — (em dash), &nbsp; = non-breaking space
      expect(typeof result.items[0].summary).toBe("string");
      expect(typeof result.items[0].content).toBe("string");
      expect(result.items[0].summary).toBe(
        'Summary with \u201Ccurly quotes\u201D and \u2014 dashes',
      );
      expect(result.items[0].content).toBe(
        "Content with \u00A0 non-breaking spaces",
      );
    });

    it("should handle Atom feed with author names having type attribute", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Feed</title>
  <link href="https://example.com" rel="alternate" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title>Article</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <updated>2025-11-09T09:00:00Z</updated>
    <author>
      <name type="text">John Doe</name>
      <email>john@example.com</email>
    </author>
    <content>Content</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      // Author should be extracted as string
      expect(typeof result.items[0].author).toBe("string");
      expect(result.items[0].author).toBe("John Doe");
    });

    it("should handle mixed text types in Atom feed", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="text">Plain Text Title</title>
  <link href="https://example.com" rel="alternate" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title type="html">HTML Title with &amp;amp; ampersand</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <updated>2025-11-09T09:00:00Z</updated>
    <summary type="text">Plain summary</summary>
    <content type="html">HTML content with &amp;lt; entities</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      // All should be strings
      expect(typeof result.title).toBe("string");
      expect(typeof result.items[0].title).toBe("string");
      expect(typeof result.items[0].summary).toBe("string");
      expect(typeof result.items[0].content).toBe("string");

      // HTML entities should be decoded for all content
      expect(result.title).toBe("Plain Text Title");
      expect(result.items[0].title).toBe("HTML Title with & ampersand");
      expect(result.items[0].summary).toBe("Plain summary");
      expect(result.items[0].content).toBe("HTML content with < entities");
    });
  });

  describe("RSS 0.9 feeds", () => {
    it("should parse RSS 0.9 feed", async () => {
      const rss09Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="0.9">
  <channel>
    <title>RSS 0.9 Feed</title>
    <link>https://example.com</link>
    <description>An RSS 0.9 feed</description>
    <item>
      <title>Article</title>
      <link>https://example.com/article1</link>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss09Feed);

      expect(result.title).toBe("RSS 0.9 Feed");
      expect(result.link).toBe("https://example.com");
      expect(result.description).toBe("An RSS 0.9 feed");
      expect(result.items).toHaveLength(1);
      expect(result.items[0].title).toBe("Article");
    });
  });

  describe("Error handling", () => {
    it("should throw error for invalid XML", async () => {
      const invalidXml = "This is not XML";

      await expect(parser.parseString(invalidXml)).rejects.toThrow(
        "Unable to parse feed",
      );
    });

    it("should throw error for unrecognized feed format", async () => {
      const unknownFormat = `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <title>Not a feed</title>
</document>`;

      await expect(parser.parseString(unknownFormat)).rejects.toThrow(
        "Feed not recognized",
      );
    });

    it("should handle malformed dates gracefully", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article</title>
      <pubDate>invalid date format</pubDate>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      // Should not throw, but isoDate should not be set
      expect(result.items[0].isoDate).toBeUndefined();
    });
  });

  describe("Author array compaction", () => {
    it("should compact multiple authors in RSS 2.0 feed into a single string", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Multi-author Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article with Multiple Authors</title>
      <author>john@example.com (John Doe)</author>
      <author>jane@example.com (Jane Smith)</author>
      <author>bob@example.com (Bob Johnson)</author>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].author).toBe(
        "john@example.com (John Doe), jane@example.com (Jane Smith), bob@example.com (Bob Johnson)",
      );
    });

    it("should compact multiple DC creators in RSS 2.0 feed into a single string", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Multi-creator Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article with Multiple Creators</title>
      <dc:creator>Alice Williams</dc:creator>
      <dc:creator>Charlie Brown</dc:creator>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].creator).toBe("Alice Williams, Charlie Brown");
    });

    it("should handle single author as string in RSS feed", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Single Author Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article</title>
      <author>single@example.com (Single Author)</author>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].author).toBe("single@example.com (Single Author)");
    });

    it("should compact multiple authors in Atom feed into a single string", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Multi-author Atom Feed</title>
  <link href="https://example.com" rel="alternate" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title>Article with Multiple Authors</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <updated>2025-11-09T09:00:00Z</updated>
    <author>
      <name>Emily Davis</name>
      <email>emily@example.com</email>
    </author>
    <author>
      <name>Frank Miller</name>
      <email>frank@example.com</email>
    </author>
    <author>
      <name>Grace Lee</name>
      <email>grace@example.com</email>
    </author>
    <content>Article content</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      expect(result.items[0].author).toBe(
        "Emily Davis, Frank Miller, Grace Lee",
      );
    });

    it("should handle single author object in Atom feed", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Feed</title>
  <link href="https://example.com" rel="alternate" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title>Article</title>
    <link href="https://example.com/article1" rel="alternate" />
    <id>article1</id>
    <updated>2025-11-09T09:00:00Z</updated>
    <author>
      <name>Henry Wilson</name>
      <email>henry@example.com</email>
    </author>
    <content>Content</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      expect(result.items[0].author).toBe("Henry Wilson");
    });

    it("should handle empty author array gracefully", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>No Author Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article without Author</title>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].author).toBeUndefined();
    });

    it("should filter out empty author strings from array", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article</title>
      <author>Valid Author</author>
      <author></author>
      <author>   </author>
      <author>Another Valid Author</author>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].author).toBe("Valid Author, Another Valid Author");
    });

    it("should compact multiple authors in RSS 1.0 feed", async () => {
      const rss1Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns="http://purl.org/rss/1.0/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>RSS 1.0 Feed</title>
    <link>https://example.com</link>
  </channel>
  <item rdf:about="https://example.com/article1">
    <title>Article</title>
    <link>https://example.com/article1</link>
    <dc:creator>Author One</dc:creator>
    <dc:creator>Author Two</dc:creator>
  </item>
</rdf:RDF>`;

      const result = await parser.parseString(rss1Feed);

      expect(result.items[0].creator).toBe("Author One, Author Two");
    });
  });

  describe("HTML entity decoding in RSS feeds", () => {
    it("should decode HTML entities in RSS 2.0 item titles", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed Title</title>
    <link>https://example.com</link>
    <item>
      <title>Article with &amp;quot;quotes&amp;quot; and &amp;amp; ampersand</title>
      <description>Content here</description>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].title).toBe('Article with "quotes" and & ampersand');
    });

    it("should decode HTML entities in RSS 2.0 item descriptions", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed Title</title>
    <link>https://example.com</link>
    <item>
      <title>Article</title>
      <description>Content with &amp;lt;tag&amp;gt; and &amp;apos;apostrophes&amp;apos;</description>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].content).toBe("Content with <tag> and 'apostrophes'");
    });

    it("should decode numeric HTML entities in RSS 2.0 feeds", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed with &#8216;curly&#8217; quotes</title>
    <link>https://example.com</link>
    <item>
      <title>Article &#8212; with &#8220;entities&#8221;</title>
      <description>Content with &#169; copyright symbol</description>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      // &#8216; = ', &#8217; = '
      expect(result.title).toBe("Feed with \u2018curly\u2019 quotes");
      // &#8212; = —, &#8220; = ", &#8221; = "
      expect(result.items[0].title).toBe("Article \u2014 with \u201Centities\u201D");
      // &#169; = ©
      expect(result.items[0].content).toBe("Content with \u00A9 copyright symbol");
    });

    it("should decode HTML entities in RSS 2.0 channel title", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Tech &amp; Science News</title>
    <link>https://example.com</link>
    <description>Latest tech &amp; science updates</description>
    <item>
      <title>Article</title>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.title).toBe("Tech & Science News");
      expect(result.description).toBe("Latest tech & science updates");
    });

    it("should decode HTML entities in content:encoded", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article</title>
      <description>Short description</description>
      <content:encoded>Full content with &amp;ndash; dash and &amp;hellip; ellipsis</content:encoded>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      // &ndash; = –, &hellip; = …
      expect(result.items[0]["content:encoded"]).toBe("Full content with \u2013 dash and \u2026 ellipsis");
    });

    it("should decode HTML entities in RSS 1.0 feeds", async () => {
      const rss1Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns="http://purl.org/rss/1.0/">
  <channel>
    <title>News &amp; Updates</title>
    <link>https://example.com</link>
    <description>Latest news &amp; updates</description>
  </channel>
  <item rdf:about="https://example.com/article1">
    <title>Article with &amp;mdash; dash</title>
    <link>https://example.com/article1</link>
    <description>Content with &amp;nbsp; spaces</description>
  </item>
</rdf:RDF>`;

      const result = await parser.parseString(rss1Feed);

      expect(result.title).toBe("News & Updates");
      expect(result.description).toBe("Latest news & updates");
      // &mdash; = —
      expect(result.items[0].title).toBe("Article with \u2014 dash");
      // &nbsp; = non-breaking space
      expect(result.items[0].content).toBe("Content with \u00A0 spaces");
    });
  });

  describe("Edge cases", () => {
    it("should handle feed with no items", async () => {
      const emptyFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Empty Feed</title>
    <link>https://example.com</link>
    <description>A feed with no items</description>
  </channel>
</rss>`;

      const result = await parser.parseString(emptyFeed);

      expect(result.title).toBe("Empty Feed");
      expect(result.items).toHaveLength(0);
    });

    it("should handle item with guid having underscore notation", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Article</title>
      <guid isPermaLink="false">unique-id-123</guid>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].guid).toBeDefined();
      expect(typeof result.items[0].guid).toBe("string");
    });

    it("should handle Atom feed with multiple link elements", async () => {
      const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Feed</title>
  <link href="https://example.com/html" rel="alternate" type="text/html" />
  <link href="https://example.com/feed.xml" rel="self" type="application/atom+xml" />
  <updated>2025-11-09T10:00:00Z</updated>
  <entry>
    <title>Article</title>
    <link href="https://example.com/article1.html" rel="alternate" type="text/html" />
    <link href="https://example.com/article1.json" rel="alternate" type="application/json" />
    <id>article1</id>
    <updated>2025-11-09T09:00:00Z</updated>
    <content>Content</content>
  </entry>
</feed>`;

      const result = await parser.parseString(atomFeed);

      expect(result.link).toBe("https://example.com/html");
      expect(result.feedUrl).toBe("https://example.com/feed.xml");
      expect(result.items[0].link).toBe("https://example.com/article1.html");
    });

    it("should handle empty or whitespace-only fields", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title></title>
    <link>https://example.com</link>
    <item>
      <title>   </title>
      <description></description>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
    });

    it("should handle feed with special characters in content", async () => {
      const rss2Feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Feed with Special Chars</title>
    <link>https://example.com</link>
    <item>
      <title>Article &amp; More</title>
      <description>&lt;p&gt;Content with &quot;quotes&quot; and &apos;apostrophes&apos;&lt;/p&gt;</description>
    </item>
  </channel>
</rss>`;

      const result = await parser.parseString(rss2Feed);

      expect(result.items[0].title).toContain("&");
      expect(result.items[0].content).toBeDefined();
    });
  });
});
