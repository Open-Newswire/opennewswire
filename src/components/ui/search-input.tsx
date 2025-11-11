import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import { forwardRef } from "react";

interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, placeholder = "Search...", ...props }, ref) => {
    return (
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          className="pl-9 h-8"
          placeholder={placeholder}
          {...props}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
