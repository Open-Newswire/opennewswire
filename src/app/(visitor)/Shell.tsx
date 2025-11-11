"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ReactNode } from "react";
import { Header } from "./Header";
import styles from "./shell.module.css";

export function Shell({
  navigation,
  children,
}: {
  navigation: ReactNode;
  children: ReactNode;
}) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [searchOpened, { toggle: toggleSearch }] = useDisclosure();

  return (
    <AppShell
      header={{ height: searchOpened ? 120 : 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      classNames={{
        header: styles.header,
      }}
    >
      <AppShellHeader>
        <Header
          searchOpened={searchOpened}
          toggleSearch={toggleSearch}
          mobileOpened={mobileOpened}
          toggleMobile={toggleMobile}
          toggleDesktop={toggleDesktop}
        />
      </AppShellHeader>
      <AppShellNavbar bg="gray.1">{navigation}</AppShellNavbar>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
