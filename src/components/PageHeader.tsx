import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { Fragment } from "react";

export interface PageHeaderHistory {
  title: string;
  href: string;
}

export function PageHeader({
  title,
  history,
  children,
}: {
  title: string;
  history?: PageHeaderHistory[];
  children?: React.ReactNode;
}) {
  return (
    <header className="flex h-16 shrink-0 justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {history && history.length > 0 ? (
          <Breadcrumb>
            <BreadcrumbList>
              {history.map((item) => (
                <Fragment key={item.href}>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-lg font-semibold">
                      <Link href={item.href}>{item.title}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </Fragment>
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage className="text-lg font-bold">
                  {title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <span className="text-lg font-bold">{title}</span>
        )}
      </div>
      <div className="flex items-center gap-4">{children}</div>
    </header>
  );
}
