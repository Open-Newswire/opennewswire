import { Image, ImageProps } from "@mantine/core";
import { IconSource } from "@prisma/client";
import placeholder from "./feed-icon-placeholder.png";

interface FeedIconProps {
  source: IconSource;
  faviconUrl?: string | null;
  assetUrl?: string | null;
}

function getSource(props: FeedIconProps) {
  switch (props.source) {
    case IconSource.FAVICON:
      return props.faviconUrl;
    case IconSource.UPLOAD:
      return props.assetUrl;
    default:
      return null;
  }
}

export function FeedIcon({
  source,
  faviconUrl,
  assetUrl,
  ...imageProps
}: FeedIconProps & ImageProps) {
  const src = getSource({ source, faviconUrl, assetUrl });

  return (
    <Image
      {...imageProps}
      alt="Feed icon"
      src={src}
      fallbackSrc={placeholder.src}
      w={24}
      miw={24}
      h={24}
      mih={24}
    />
  );
}
