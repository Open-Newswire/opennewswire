"use client";

import { FeedIcon } from "@/components/admin/feeds/FeedIcon";
import { LicenseBadge } from "@/components/admin/licenses/LicenseBadge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  ContentSourceDisplayNames,
  FeedsWithLicenseAndLanguage,
} from "@/domains/feeds/types";
import { Badge, ColorSwatch, Group } from "@mantine/core";
import { IconSource } from "@prisma/client";

const iconSourceStrings = {
  [IconSource.FAVICON]: "Website Favicon",
  [IconSource.NONE]: "None",
  [IconSource.UPLOAD]: "Upload",
};

function MetadataTableRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <TableRow>
      <TableCell className="font-semibold w-45">{label}</TableCell>
      <TableCell>{children}</TableCell>
    </TableRow>
  );
}

export function FeedMetadata({ feed }: { feed: FeedsWithLicenseAndLanguage }) {
  return (
    <div className="rounded-md border">
      <Table className="table-fixed">
        <TableBody>
          <MetadataTableRow label="Title">{feed.title}</MetadataTableRow>
          <MetadataTableRow label="URL">
            {feed.url ? (
              <a
                target="_blank"
                rel="noreferrer"
                href={feed.url}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                {feed.url}
              </a>
            ) : null}
          </MetadataTableRow>
          <MetadataTableRow label="Status">
            {!feed.isActive ? (
              <Badge variant="light" color="gray" size="sm">
                Inactive
              </Badge>
            ) : (
              <Badge variant="light" color="green" size="sm">
                Active
              </Badge>
            )}
          </MetadataTableRow>
          <MetadataTableRow label="Logo">
            <FeedIcon
              source={feed.iconSource}
              faviconUrl={feed.iconUrl}
              assetUrl={feed.iconAssetUrl}
            />
          </MetadataTableRow>
          <MetadataTableRow label="Logo Source">
            {iconSourceStrings[feed.iconSource]}
          </MetadataTableRow>
          <MetadataTableRow label="Logo URL">
            {feed.iconUrl ? (
              <a
                target="_blank"
                rel="noreferrer"
                href={feed.iconUrl}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                {feed.iconUrl}
              </a>
            ) : null}
          </MetadataTableRow>
          <MetadataTableRow label="Language">
            {feed.language?.name}
          </MetadataTableRow>
          <MetadataTableRow label="License">
            {feed.license ? <LicenseBadge license={feed.license} /> : null}
          </MetadataTableRow>
          <MetadataTableRow label="License Url">
            {feed.licenseUrl ? (
              <a
                target="_blank"
                rel="noreferrer"
                href={feed.licenseUrl}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                {feed.licenseUrl}
              </a>
            ) : null}
          </MetadataTableRow>
          <MetadataTableRow label="License Text">
            {feed.licenseText}
          </MetadataTableRow>
          <MetadataTableRow label="Article Content Source">
            {ContentSourceDisplayNames[feed.contentSource]}
          </MetadataTableRow>
          <MetadataTableRow label="Filtered Keywords">
            {feed.filterKeywords}
          </MetadataTableRow>
          <MetadataTableRow label="Background Color">
            <Group>
              <ColorSwatch color={feed.backgroundColor} />
              {feed.backgroundColor}
            </Group>
          </MetadataTableRow>
          <MetadataTableRow label="Text Color">
            <Group>
              <ColorSwatch color={feed.textColor} />
              {feed.textColor}
            </Group>
          </MetadataTableRow>
        </TableBody>
      </Table>
    </div>
  );
}
