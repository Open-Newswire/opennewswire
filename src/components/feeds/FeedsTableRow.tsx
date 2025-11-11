import { FeedIcon } from "@/components/feeds/FeedIcon";
import { LicenseBadge } from "@/components/licenses/LicenseBadge";
import { FeedsWithLicenseAndLanguage } from "@/types/feeds";
import { Badge, Box, Group, TableTd, TableTr } from "@mantine/core";
import { useRouter } from "next/navigation";
import { FeedTableActionMenu } from "./FeedsTableActionMenu";

export function FeedsTableRow({ feed }: { feed: FeedsWithLicenseAndLanguage }) {
  const router = useRouter();
  const onClick = (id: string) => router.push(`./feeds/${id}`);
  const handleClick = onClick.bind(null, feed.id);
  return (
    <TableTr key={feed.id} style={{ cursor: "pointer" }}>
      <TableTd onClick={handleClick}>
        <Group justify="space-between">
          <Box>
            <FeedIcon
              source={feed.iconSource}
              faviconUrl={feed.iconUrl}
              assetUrl={feed.iconAssetUrl}
              display="inline-block"
              mr="1rem"
              style={{ verticalAlign: "bottom" }}
            />
            {feed.title}
          </Box>

          {!feed.isActive ? (
            <Badge variant="light" color="gray" size="sm">
              Inactive
            </Badge>
          ) : null}
        </Group>
      </TableTd>
      <TableTd onClick={handleClick} style={{ lineBreak: "anywhere" }}>
        {feed.url}
      </TableTd>
      <TableTd onClick={handleClick}>
        {feed.license ? <LicenseBadge license={feed.license} /> : null}
      </TableTd>
      <TableTd onClick={handleClick}>
        {feed.language ? feed.language.name : null}
      </TableTd>
      <TableTd>
        <FeedTableActionMenu feed={feed} />
      </TableTd>
    </TableTr>
  );
}
