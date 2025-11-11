import { FilterSelectOption } from "@/components/shared/FilterSelect";
import { useEffect, useState } from "react";

export function useFilterOptions<T>(
  url: string,
  mapping: (value: T) => { label: string; value: string },
) {
  const [options, setOptions] = useState<FilterSelectOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);
      const json = (await response.json()) as T[];
      const selectValues = json.map(mapping);

      setOptions(selectValues);
    };

    fetchData();
  }, [url]);

  return options;
}
