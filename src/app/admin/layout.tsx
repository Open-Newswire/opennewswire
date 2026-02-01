import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import { MainNavigation } from "@/components/admin/layout/MainNavigation";
import { modalProps, modals } from "@/components/shared/modal-types";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { validateRequest } from "@/domains/auth/service";
import { ModalsProvider } from "@mantine/modals";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user) {
    const headersList = await headers();
    const referer = headersList.get("referer");

    let currentPath = "/admin";

    if (referer) {
      try {
        const url = new URL(referer);
        currentPath = url.pathname;
      } catch {
        // Fall back to /admin if URL parsing fails
      }
    }

    const loginUrl = `/login?next=${encodeURIComponent(currentPath)}`;
    return redirect(loginUrl);
  }

  return (
    <NuqsAdapter>
      <ModalsProvider modals={modals} modalProps={modalProps}>
        <SidebarProvider>
          <MainNavigation user={user} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </ModalsProvider>
    </NuqsAdapter>
  );
}
