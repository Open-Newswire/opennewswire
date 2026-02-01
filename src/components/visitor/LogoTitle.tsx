import { Group, Title } from "@mantine/core";
import Image from "next/image";
import logo from "./onw-logo.png";

const HOMEPAGE_URL = "https://opennewswire.org";

export function LogoTitle() {
  return (
    <Group gap="8px">
      <a href={HOMEPAGE_URL}>
        <Image src={logo} width={24} alt="Open Newswire Logo" />
      </a>
      <a href={HOMEPAGE_URL}>
        <Title size="h3" mt="2px" style={{ letterSpacing: "-0.06rem" }}>
          Open Newswire
        </Title>
      </a>
    </Group>
  );
}
