"use-client";

import { DesktopSearch } from "./DesktopSearch";
import { LogoTitle } from "./LogoTitle";
import { MobileSearch } from "./MobileSearch";
import {
  ActionIcon,
  Box,
  Burger,
  Flex,
  FocusTrap,
  Group,
  rem,
  Transition,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Suspense } from "react";
import styles from "./shell.module.css";

const SearchIcon = <IconSearch style={{ width: rem(24), height: rem(24) }} />;

export function Header({
  mobileOpened,
  searchOpened,
  toggleMobile,
  toggleDesktop,
  toggleSearch,
}: {
  mobileOpened: boolean;
  searchOpened: boolean;
  toggleMobile: () => void;
  toggleDesktop: () => void;
  toggleSearch: () => void;
}) {
  return (
    <Box>
      <Flex h="60" className={styles.innerheader}>
        <Group miw={300} gap="sm" className={styles.menugroup}>
          <Burger
            lineSize={2}
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            lineSize={2}
            pl="-2px"
            opened={false}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          <LogoTitle />
        </Group>
        <>
          <Suspense>
            <DesktopSearch />
          </Suspense>

          <ActionIcon
            hiddenFrom="sm"
            variant="transparent"
            onClick={toggleSearch}
            mx="sm"
            color="black"
          >
            {SearchIcon}
          </ActionIcon>
        </>
      </Flex>
      <Suspense>
        <FocusTrap active={searchOpened}>
          <Transition mounted={searchOpened}>
            {(styles) => (
              <Box px="sm" style={styles}>
                <MobileSearch />
              </Box>
            )}
          </Transition>
        </FocusTrap>
      </Suspense>
    </Box>
  );
}
