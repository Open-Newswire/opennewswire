"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNavLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ size?: string | number }>;
}) {
  const pathname = usePathname();
  const isActive =
    (pathname === "/admin" && href === "/admin") ||
    (href !== "/admin" && pathname.includes(href));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} size="lg">
        <Link href={href}>
          {/* @ts-ignore */}
          <Icon className="!w-6 !h-6" />
          {label}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
