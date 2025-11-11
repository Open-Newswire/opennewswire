import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export interface Tab {
  label: string;
  value: string;
  isBase?: boolean;
}

export function useTabs(basePath: string, tabs: Tab[]) {
  const router = useRouter();
  const path = usePathname();

  const baseTab = useMemo(() => {
    return tabs.findLast((tab) => tab.isBase);
  }, [tabs]);

  const value = useMemo(() => {
    const lastPath = path.split("/").pop();

    return (
      tabs.findLast((tab) => {
        return tab.value === lastPath;
      })?.value || baseTab?.value
    );
  }, [baseTab, path, tabs]);

  return {
    value,
    handleChange: (value: string) => {
      const newTab = tabs.find((tab) => tab.value === value);
      const pathComponent = newTab?.isBase || !newTab ? "" : `/${newTab.value}`;

      router.push(`${basePath}${pathComponent}`);
    },
  };
}
