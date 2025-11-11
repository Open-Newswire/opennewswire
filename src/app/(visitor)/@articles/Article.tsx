import { FeedBadge } from "@/components/FeedBadge";
import { FeedIcon } from "@/components/feeds/FeedIcon";
import { LicenseBadge as SharedLicenseBadge } from "@/components/licenses/LicenseBadge";
import { ArticleWithMetadata, CondensedFeed } from "@/types/article";
import { License } from "@/types/licenses";
import {
  Anchor,
  Box,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { format, formatDistanceToNowStrict } from "date-fns";
import { forwardRef } from "react";

interface ArticleProps {
  article: ArticleWithMetadata;
}

const ArticleMobile = forwardRef(({ article }: ArticleProps, ref: any) => {
  return (
    <Stack p="sm" gap="xs" ref={ref} hiddenFrom="sm">
      <ArticleMetadataMobile article={article} />
      <ArticleTitleMobile article={article} />
      <ArticleContent article={article} />
    </Stack>
  );
});

ArticleMobile.displayName = "ArticleMobile";

const ArticleDesktop = forwardRef(({ article }: ArticleProps, ref: any) => {
  return (
    <Stack p="sm" gap="xs" ref={ref} visibleFrom="sm">
      <Flex justify="space-between">
        <ArticleTitle article={article} />
        <ArticleMetadataDesktop article={article} />
      </Flex>
      <ArticleContent article={article} />
    </Stack>
  );
});

ArticleDesktop.displayName = "ArticleDesktop";

export const Article = forwardRef(({ article }: ArticleProps, ref: any) => {
  return (
    <Box ref={ref}>
      <ArticleDesktop article={article} />
      <ArticleMobile article={article} />
      <Divider />
    </Box>
  );
});

Article.displayName = "Article";

function FeedLogo({ feed }: { feed: CondensedFeed }) {
  return (
    <FeedIcon
      source={feed.iconSource}
      faviconUrl={feed.iconUrl}
      assetUrl={feed.assetIconUrl}
    />
  );
}

function ArticleTitle({ article }: ArticleProps) {
  const isRtl = article.feed.language?.isRtl;

  return (
    <Flex
      flex={1}
      direction={isRtl ? "row-reverse" : "row"}
      align="center"
      justify={isRtl ? "end" : "start"}
    >
      <Anchor
        href={`/article/${article.id}`}
        target="_blank"
        fw="500"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {article.title}
      </Anchor>
      <Flex align="center" style={{ flexShrink: 0 }} mx="sm">
        <LicenseBadge article={article} />
      </Flex>
    </Flex>
  );
}

function ArticleTitleMobile({ article }: ArticleProps) {
  const isRtl = article.feed.language?.isRtl;

  return (
    <Flex
      flex={1}
      direction={isRtl ? "row-reverse" : "row"}
      align="center"
      justify={isRtl ? "end" : "start"}
    >
      <Box style={{ flex: 1, textAlign: isRtl ? "end" : "start" }}>
        <Anchor
          href={`/article/${article.id}`}
          target="_blank"
          fw="500"
          style={{ direction: isRtl ? "rtl" : "ltr" }}
        >
          {article.title}
        </Anchor>
      </Box>

      <Box>
        <ArticleDate article={article} />
      </Box>
    </Flex>
  );
}

function ArticleMetadataDesktop({ article }: ArticleProps) {
  return (
    <Group ml="sm" style={{ flexShrink: 0 }}>
      <ArticleDate article={article} />
      <FeedBadge feed={article.feed} />
      <FeedLogo feed={article.feed} />
    </Group>
  );
}

function ArticleMetadataMobile({ article }: ArticleProps) {
  return (
    <Group justify="space-between">
      <Group ml="0" style={{ flexShrink: 0 }}>
        <FeedLogo feed={article.feed} />
        <FeedBadge feed={article.feed} />
      </Group>
      <Flex align="center" style={{ flexShrink: 0 }}>
        <LicenseBadge article={article} />
      </Flex>
    </Group>
  );
}

function ArticleDate({ article }: ArticleProps) {
  return article.date ? (
    <Tooltip label={format(article.date, "PP p")} openDelay={500}>
      <Text size="xs" fw="500">
        {formatDistanceToNowStrict(article.date)}
      </Text>
    </Tooltip>
  ) : null;
}

function ArticleContent({ article }: ArticleProps) {
  const isRtl = article.feed.language?.isRtl;

  return (
    <Box style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <Text
        size="sm"
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {article.content}
      </Text>
    </Box>
  );
}

function LicenseBadge({ article }: ArticleProps) {
  if (!article.feed.license) {
    return null;
  }

  function handleClick() {
    if (article.feed.licenseUrl) {
      window.open(article.feed.licenseUrl, "_blank");
    }
  }

  return <LicenseBadgeWrapper feed={article.feed} onClick={handleClick} />;
}

function LicenseBadgeWrapper({
  feed,
  onClick,
}: {
  feed: CondensedFeed;
  onClick?: () => void;
}) {
  if (feed.licenseText) {
    return (
      <Tooltip label={feed.licenseText} openDelay={500} w={400} multiline>
        <LicenseBadgeInner feed={feed} onClick={onClick} />
      </Tooltip>
    );
  }

  return <LicenseBadgeInner feed={feed} onClick={onClick} />;
}

const LicenseBadgeInner = forwardRef<
  any,
  { feed: CondensedFeed; onClick?: () => void }
>(({ feed, onClick }, ref) => {
  if (!feed.license) {
    return null;
  }

  return (
    <SharedLicenseBadge
      license={feed.license as License}
      ref={ref}
      mx="0"
      onClick={onClick ? () => onClick() : undefined}
      style={{ cursor: onClick ? "pointer" : "default" }}
    />
  );
});

LicenseBadgeInner.displayName = "LicenseBadgeInner";
