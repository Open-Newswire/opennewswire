import { Badge, BadgeProps } from "@mantine/core";

interface FeedProp {
  textColor?: string;
  backgroundColor?: string;
  title?: string;
}

export function FeedBadge({ feed, ...props }: { feed: FeedProp } & BadgeProps) {
  return (
    <Badge bg={feed.backgroundColor} c={feed.textColor} tt="none" {...props}>
      {feed.title}
    </Badge>
  );
}
