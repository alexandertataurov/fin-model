"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "./Button";
import { Input } from "./Input";
import { Separator } from "./Separator";
import {
  Sheet,
  SheetContent,
} from "./Sheet";
import { Skeleton } from "./Skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
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
  const [isMobile, setIsMobile] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
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

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // This effect sets the initial state of the sidebar from the cookie.
  React.useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`));
    if (cookie) {
      const value = cookie.split("=")[1];
      if (value === "true" || value === "false") {
        setOpen(value === "true");
      }
    }
  }, [setOpen]);

  // This effect sets the mobile state.
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const value: SidebarContextProps = React.useMemo(
    () => ({
      state: open ? "expanded" : "collapsed",
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        className={cn("relative", className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

const sidebarVariants = cva(
  "group/sidebar relative flex h-full w-full flex-col gap-4 bg-background",
  {
    variants: {
      variant: {
        sidebar: "border-r",
        floating: "rounded-lg border shadow-lg",
        inset: "border rounded-lg",
      },
    },
    defaultVariants: {
      variant: "sidebar",
    },
  },
);

const sidebarMenuButtonVariants = cva(
  "group relative flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground [&[data-state=open]>svg]:rotate-90",
  {
    variants: {
      variant: {
        default: "",
        ghost: "hover:bg-transparent",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10",
        sm: "h-8",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { open, isMobile } = useSidebar();

  if (isMobile && collapsible === "offcanvas") {
    return (
      <Sheet>
        <SheetContent
          side={side}
          className={cn(
            "w-[var(--sidebar-width)] p-0",
            side === "left" ? "left-0" : "right-0",
          )}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
        >
          <div className={cn(sidebarVariants({ variant }), className)} {...props}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (collapsible === "icon" && !open) {
    return (
      <div
        className={cn(
          "group/sidebar relative flex h-full w-full flex-col gap-4 bg-background border-r",
          className,
        )}
        style={
          {
            width: SIDEBAR_WIDTH_ICON,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(sidebarVariants({ variant }), className)}
      style={
        {
          width: open ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6", className)}
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className={cn(
        "absolute -right-3 top-7 z-40 h-6 w-6 rounded-full border bg-background shadow-sm transition-colors hover:bg-accent",
        className,
      )}
      onClick={toggleSidebar}
      {...props}
    >
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "flex-1 overflow-auto",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn("h-8", className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-[60px] items-center px-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-[60px] items-center px-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn("-mx-2", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-2 overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        "px-2 text-xs font-semibold",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "h-auto w-auto p-0 text-xs",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "flex flex-col gap-1",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "relative",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const { open } = useSidebar();
  const Comp = asChild ? Slot : "button";

  const content = (
    <Comp
      className={cn(
        sidebarMenuButtonVariants({ variant, size }),
        isActive && "bg-accent text-accent-foreground",
        className,
      )}
      {...props}
    />
  );

  if (!open && tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent
            side="right"
            {...(typeof tooltip === "string" ? {} : tooltip)}
          >
            {typeof tooltip === "string" ? tooltip : tooltip.children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "h-auto w-auto p-0 opacity-0 transition-opacity group-hover:opacity-100",
        showOnHover && "group-hover:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2",
        className,
      )}
      {...props}
    >
      {showIcon && <Skeleton className="h-4 w-4" />}
      <Skeleton className="h-4 flex-1" />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "flex flex-col gap-1",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "relative",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        size === "sm" && "text-xs",
        isActive && "bg-accent text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
