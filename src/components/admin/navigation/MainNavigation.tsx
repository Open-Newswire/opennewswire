"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconArticle,
  IconChartBarPopular,
  IconCopyright,
  IconHome2,
  IconLanguage,
  IconNews,
  IconRefresh,
  IconSettings,
  IconSquareArrowUp,
} from "@tabler/icons-react";
import Link from "next/link";
import { Logo } from "./Logo";
import { MainNavLink } from "./MainNavigationLink";
import { MainUserAvatar } from "./MainUserAvatar";

export function MainNavigation({ user }: any) {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroup className="border-b h-14">
          <Logo />
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <MainNavLink href="/admin" label="Home" Icon={IconHome2} />
            <MainNavLink
              href="/admin/analytics"
              label="Analytics"
              Icon={IconChartBarPopular}
            />
            <MainNavLink href="/admin/feeds" label="Feeds" Icon={IconNews} />
            <MainNavLink
              href="/admin/articles"
              label="Articles"
              Icon={IconArticle}
            />
            <MainNavLink
              href="/admin/licenses"
              label="Licenses"
              Icon={IconCopyright}
            />
            <MainNavLink
              href="/admin/languages"
              label="Languages"
              Icon={IconLanguage}
            />
            <MainNavLink
              href="/admin/jobs"
              label="Sync Jobs"
              Icon={IconRefresh}
            />
            <MainNavLink
              href="/admin/settings"
              label="Settings"
              Icon={IconSettings}
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/" target="_blank">
                <IconSquareArrowUp className="!w-6 !h-6" />
                View Feed Reader
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator />
        <MainUserAvatar name={user.name} email={user.email} />
      </SidebarFooter>
    </Sidebar>
  );
}
