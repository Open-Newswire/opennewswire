export type Field = string | [string, string, object?];

export interface Enclosure {
  url: string;
  length?: number;
  type?: string;
}

export interface Item {
  [name: string]: any;
  link?: string;
  guid?: string;
  title?: string;
  pubDate?: string;
  creator?: string;
  author?: string;
  summary?: string;
  content?: string;
  isoDate?: string;
  categories?: string[];
  contentSnippet?: string;
  enclosure?: Enclosure;
  mediaContent?: any;
}

export interface PaginationLinks {
  self?: string;
  first?: string;
  next?: string;
  last?: string;
  prev?: string;
}

export interface ParserOutput {
  [name: string]: any;
  image?: {
    link?: string;
    url?: string;
    title?: string;
    width?: string;
    height?: string;
  };
  paginationLinks?: PaginationLinks;
  link?: string;
  title?: string;
  items: Item[];
  feedUrl?: string;
  description?: string;
  lastBuildDate?: string;
  itunes?: {
    [key: string]: any;
    image?: string;
    owner?: {
      name?: string;
      email?: string;
    };
    author?: string;
    summary?: string;
    explicit?: string;
    categories?: string[];
    keywords?: string[];
  };
}
