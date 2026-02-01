import { ccsymbols } from "@/app/fonts";
import { License } from "@/domains/licenses/types";
import { Badge, BadgeProps } from "@mantine/core";
import { forwardRef } from "react";
import classes from "./LicenseBadge.module.css";

export const LicenseBadge = forwardRef<
  any,
  { license: License; ref?: any; onClick?: any } & BadgeProps
>(({ license, ...props }, ref) => {
  return (
    <Badge
      className={ccsymbols.variable}
      bg={license.backgroundColor}
      c={license.textColor}
      tt="none"
      ref={ref}
      {...props}
    >
      <span>{license.name}</span>
      {license.symbols ? (
        <span className={classes.symbols}>{license.symbols}</span>
      ) : null}
    </Badge>
  );
});

LicenseBadge.displayName = "LicenseBadge";
