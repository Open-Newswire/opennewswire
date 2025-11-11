"use client";

import { Slot } from "@radix-ui/react-slot";
import { X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const INSPECTOR_COOKIE_NAME = "inspector_state";
const INSPECTOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const INSPECTOR_WIDTH = "24rem";
const INSPECTOR_WIDTH_MOBILE = "100vw";
const INSPECTOR_WIDTH_ICON = "3rem";

type InspectorContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleInspector: () => void;
  showInspector: (node: React.ReactNode) => void;
  dismissInspector: () => void;
  node?: React.ReactNode;
};

const InspectorContext = React.createContext<InspectorContextProps | null>(
  null,
);

function useInspector() {
  const context = React.useContext(InspectorContext);
  if (!context) {
    throw new Error("useInspector must be used within a InspectorProvider.");
  }

  return context;
}

function InspectorProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [node, setNode] = React.useState<React.ReactNode>(null);

  // This is the internal state of the inspector.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the inspector state.
      document.cookie = `${INSPECTOR_COOKIE_NAME}=${openState}; path=/; max-age=${INSPECTOR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the inspector.
  const toggleInspector = React.useCallback(() => {
    setOpen((open) => !open);
  }, [setOpen]);

  const showInspector = React.useCallback(
    (node: React.ReactNode) => {
      setNode(node);
      setOpen(true);
    },
    [setOpen, setNode],
  );

  const dismissInspector = React.useCallback(() => {
    setOpen(false);

    setTimeout(() => {
      setNode(null);
    }, 300);
  }, [setOpen, setNode]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the inspector with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<InspectorContextProps>(
    () => ({
      state,
      node,
      open,
      setOpen,
      isMobile,
      toggleInspector,
      showInspector,
      dismissInspector,
    }),
    [
      state,
      open,
      setOpen,
      isMobile,
      toggleInspector,
      node,
      dismissInspector,
      showInspector,
    ],
  );

  return (
    <InspectorContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="inspector-wrapper"
          style={
            {
              "--inspector-width": INSPECTOR_WIDTH,
              "--inspector-width-icon": INSPECTOR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/inspector-wrapper has-data-[variant=inset]:bg-inspector flex min-h-svh w-full",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </InspectorContext.Provider>
  );
}

function Inspector({
  side = "right",
  collapsible = "offcanvas",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  collapsible?: "offcanvas" | "none";
}) {
  const { isMobile, state, open, setOpen, node } = useInspector();

  if (collapsible === "none") {
    return (
      <div
        data-slot="inspector"
        className={cn(
          "bg-inspector text-inspector-foreground flex h-full w-(--inspector-width) flex-col",
          className,
        )}
        {...props}
      >
        {node}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen} {...props}>
        <SheetContent
          data-inspector="inspector"
          data-slot="inspector"
          data-mobile="true"
          className="bg-inspector text-inspector-foreground w-(--inspector-width) p-0 [&>button]:hidden"
          style={
            {
              "--inspector-width": INSPECTOR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Inspector</SheetTitle>
            <SheetDescription>Displays the mobile inspector.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{node}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer text-inspector-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-side={side}
      data-slot="inspector"
    >
      {/* This is what handles the inspector gap on desktop */}
      <div
        data-slot="inspector-gap"
        className={cn(
          "relative w-(--inspector-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
        )}
      />
      <div
        data-slot="inspector-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--inspector-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--inspector-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--inspector-width)*-1)]",
          "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-inspector="inspector"
          data-slot="inspector-inner"
          className="bg-inspector group-data-[variant=floating]:border-inspector-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {node}
        </div>
      </div>
    </div>
  );
}

function InspectorCloseButton({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { dismissInspector } = useInspector();

  return (
    <Button
      data-inspector="trigger"
      data-slot="inspector-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        dismissInspector();
      }}
      {...props}
    >
      <X />
      <span className="sr-only">Toggle Inspector</span>
    </Button>
  );
}

function InspectorInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="inspector-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col overflow-hidden",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className,
      )}
      {...props}
    />
  );
}

function InspectorInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="inspector-input"
      data-inspector="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  );
}

function InspectorHeader({
  title,
  className,
  ...props
}: { title: string } & React.ComponentProps<"div">) {
  return (
    <header
      data-slot="inspector-header"
      data-inspector="header"
      className={cn(
        "flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4",
        className,
      )}
      {...props}
    >
      <span className="font-bold">{title}</span>
      <InspectorCloseButton />
    </header>
  );
}

function InspectorFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="inspector-footer"
      data-inspector="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function InspectorSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="inspector-separator"
      data-inspector="separator"
      className={cn("bg-inspector-border mx-2 w-auto", className)}
      {...props}
    />
  );
}

function InspectorContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="inspector-content"
      data-inspector="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function InspectorGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <section
      data-slot="inspector-group"
      data-inspector="group"
      className={cn("p-5", className)}
      {...props}
    />
  );
}

function InspectorGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="inspector-group-label"
      data-inspector="group-label"
      className={cn(
        "text-inspector-foreground/70 ring-inspector-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function InspectorGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="inspector-group-action"
      data-inspector="group-action"
      className={cn(
        "text-inspector-foreground ring-inspector-ring hover:bg-inspector-accent hover:text-inspector-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function InspectorGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="inspector-group-content"
      data-inspector="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

export {
  Inspector,
  InspectorCloseButton,
  InspectorContent,
  InspectorFooter,
  InspectorGroup,
  InspectorGroupAction,
  InspectorGroupContent,
  InspectorGroupLabel,
  InspectorHeader,
  InspectorInput,
  InspectorInset,
  InspectorProvider,
  InspectorSeparator,
  useInspector,
};
