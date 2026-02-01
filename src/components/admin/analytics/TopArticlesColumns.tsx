import { FeedIcon } from "@/components/admin/feeds/FeedIcon";
import { TopArticleCount } from "@/domains/analytics";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<TopArticleCount>[] = [
  {
    accessorKey: "title",
    header: "Article",
    cell: (props) => {
      const feed = props.row.original.feed!;

      return (
        <Link
          target="_blank"
          href={props.row.original.link!}
          className="underline"
        >
          <FeedIcon
            source={feed.iconSource}
            faviconUrl={feed.iconUrl}
            assetUrl={feed.iconAssetUrl}
            display="inline-block"
            mr="0.5rem"
            style={{ verticalAlign: "bottom" }}
          />
          {props.row.original.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "count",
    header: "Count",
  },
  {
    accessorKey: "feed.title",
    header: "Feed",
    cell: (props) => {
      return (
        <Link
          href={`/admin/feeds/${props.row.original.feed?.id}`}
          className="underline"
        >
          {props.row.original.feed?.title}
        </Link>
      );
    },
  },
];
