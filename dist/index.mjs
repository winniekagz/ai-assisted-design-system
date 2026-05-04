var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/ui/avatar.tsx
import * as React2 from "react";
var Avatar = React2.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, src, alt, fallback, children } = _b, props = __objRest(_b, ["className", "src", "alt", "fallback", "children"]);
    return /* @__PURE__ */ React2.createElement(
      "div",
      __spreadValues({
        ref,
        className: cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )
      }, props),
      src ? /* @__PURE__ */ React2.createElement(
        "img",
        {
          src,
          alt,
          className: "aspect-square h-full w-full object-cover"
        }
      ) : fallback ? /* @__PURE__ */ React2.createElement("div", { className: "flex h-full w-full items-center justify-center rounded-full bg-muted" }, fallback) : children
    );
  }
);
Avatar.displayName = "Avatar";
var AvatarImage = React2.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React2.createElement(
    "img",
    __spreadValues({
      ref,
      className: cn("aspect-square h-full w-full object-cover", className)
    }, props)
  );
});
AvatarImage.displayName = "AvatarImage";
var AvatarFallback = React2.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React2.createElement(
    "div",
    __spreadValues({
      ref,
      className: cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )
    }, props)
  );
});
AvatarFallback.displayName = "AvatarFallback";

// src/components/ui/badge/badgeColors.tsx
var defaultBadgeStatusConfig = {
  success: {
    label: "Success",
    colors: {
      filled: "bg-success-500 dark:bg-success-600 text-white",
      outlined: "bg-transparent text-success-500 dark:text-success-600 border-success-500 dark:border-success-600",
      pastel: "bg-success-50 text-success-500"
    }
  },
  pending: {
    label: "Pending",
    colors: {
      filled: "bg-warning-500 dark:bg-warning-600 text-white",
      outlined: "bg-transparent text-warning-500 dark:text-warning-600 border-warning-500 dark:border-warning-600",
      pastel: "bg-warning-50 text-warning-500"
    }
  },
  error: {
    label: "Error",
    colors: {
      filled: "bg-error-500 dark:bg-error-600 text-white",
      outlined: "bg-transparent text-error-500 dark:text-error-600 border-error-500 dark:border-error-600",
      pastel: "bg-error-50 text-error-500"
    }
  },
  completed: {
    label: "Completed",
    colors: {
      filled: "bg-info-500 dark:bg-info-600 text-white",
      outlined: "bg-transparent text-info-500 dark:text-info-600 border-info-500 dark:border-info-600",
      pastel: "bg-info-50 text-info-500"
    }
  },
  neutral: {
    label: "Neutral",
    colors: {
      filled: "bg-neutral-500 dark:bg-neutral-600 text-white",
      outlined: "bg-transparent text-neutral-500 dark:text-neutral-600 border-neutral-500 dark:border-neutral-600",
      pastel: "bg-neutral-50 text-neutral-500"
    }
  }
};
var makeCustomColors = (colorName, status) => {
  console.log("[makeCustomColors] generating colors for:", colorName);
  return {
    filled: `bg-${colorName}-500 dark:bg-${colorName}-600 text-white`,
    outlined: `bg-transparent text-${colorName}-500 dark:text-${colorName}-600 border-${colorName}-500 dark:border-${colorName}-600`,
    pastel: `bg-${colorName}-50 text-${colorName}-500`
  };
};

// src/components/ui/badge/badgeVariants.ts
import { cva } from "class-variance-authority";
var badgeVariants = cva(
  "inline-flex items-center rounded-full border font-medium transition-colors focus:outline-none focus:ring-offset-2",
  {
    variants: {
      variant: {
        filled: "border-transparent",
        outlined: "bg-transparent",
        pastel: "border-transparent"
      },
      size: {
        sm: "text-xs px-2.5 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-2",
        xl: "text-lg px-6 py-3"
      }
    },
    defaultVariants: {
      variant: "filled",
      size: "md"
    }
  }
);

// src/components/ui/badge/badge.tsx
function Badge(_a) {
  var _b = _a, {
    className,
    variant = "filled",
    size = "md",
    status,
    statusConfig,
    colorStatus,
    icon: Icon,
    iconPosition = "start",
    children
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size",
    "status",
    "statusConfig",
    "colorStatus",
    // New prop to specify color status
    "icon",
    "iconPosition",
    "children"
  ]);
  let colors = "";
  let label = "";
  const colorKey = colorStatus || status;
  if (statusConfig && status && statusConfig[status]) {
    const customConfig = statusConfig[status];
    label = (customConfig == null ? void 0 : customConfig.label) || status;
    if (customConfig == null ? void 0 : customConfig.colors) {
      const variantColors = customConfig.colors[variant];
      if (variantColors) {
        colors = `${variantColors.bg} ${variantColors.text} ${variantColors.border || ""}`.trim();
      }
    }
  } else if (colorKey && defaultBadgeStatusConfig[colorKey]) {
    const defaultConfig = defaultBadgeStatusConfig[colorKey];
    label = status ? status.charAt(0).toUpperCase() + status.slice(1) : defaultConfig.label;
    colors = defaultConfig.colors[variant];
  } else if (status) {
    label = status.charAt(0).toUpperCase() + status.slice(1);
    const colorName = status.toLowerCase();
    const customColors = makeCustomColors(colorName, status);
    colors = customColors[variant] || "";
  }
  return /* @__PURE__ */ React.createElement(
    "div",
    __spreadValues({
      className: cn(badgeVariants({ variant, size }), colors, className)
    }, props),
    Icon && iconPosition === "start" && /* @__PURE__ */ React.createElement(Icon, { className: "mr-2 h-4 w-4" }),
    children || label,
    Icon && iconPosition === "end" && /* @__PURE__ */ React.createElement(Icon, { className: "ml-2 h-4 w-4" })
  );
}

// src/components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva as cva2 } from "class-variance-authority";
import * as React3 from "react";
var buttonVariants = cva2(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 ",
  {
    variants: {
      variant: {
        // Contained variant (default filled button)
        contained: "bg-primary text-primary-foreground  hover:bg-primary/90 active:bg-primary/80 focus-visible:ring-primary/20 font-medium text-base radius-md ",
        // Outlined variant (bordered button)
        outlined: "border border-border bg-background text-foreground  hover:bg-accent hover:text-accent-foreground active:bg-accent/80  font-medium text-base radius-md",
        // Text variant (minimal button)
        text: "bg-transparent text-primary hover:bg-primary/10  active:bg-primary/20 focus-visible:ring-primary/20 font-medium text-base radius-md",
        // Destructive variant
        destructive: "bg-destructive hover:bg-destructive/90 active:bg-destructive/80 font-medium text-base radius-md text-white",
        // Secondary variant
        secondary: "bg-secondary text-secondary-foreground  hover:bg-secondary/80 active:bg-secondary/70 font-medium text-base radius-md",
        // Ghost variant
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 focus-visible:ring-accent/20 font-medium text-base radius-md",
        // Link variant
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary/20 font-medium text-base radius-md"
      },
      size: {
        sm: "h-8 px-3 py-1.5 text-xs rounded-md gap-1.5",
        default: "h-10 px-[30px] py-[10px] text-sm rounded-md gap-2",
        lg: "h-11 px-6 py-2.5 text-base rounded-md gap-2.5",
        xl: "h-12 px-8 py-3 text-lg rounded-lg gap-3",
        icon: "h-9 w-9 p-0"
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto"
      }
    },
    defaultVariants: {
      variant: "contained",
      size: "default",
      fullWidth: false
    }
  }
);
var Button = React3.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      startIcon,
      endIcon,
      leftIcon,
      rightIcon: rightIcon,
      children: children,
      disabled,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      "aria-expanded": ariaExpanded,
      "aria-pressed": ariaPressed,
      "aria-haspopup": ariaHaspopup
    } = _b, props = __objRest(_b, [
      "className",
      "variant",
      "size",
      "fullWidth",
      "asChild",
      "loading",
      "startIcon",
      "endIcon",
      "leftIcon",
      // Backward compatibility
      "rightIcon",
      // Backward compatibility
      "children",
      "disabled",
      "aria-label",
      "aria-describedby",
      "aria-expanded",
      "aria-pressed",
      "aria-haspopup"
    ]);
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    const finalStartIcon = startIcon || leftIcon;
    const finalEndIcon = endIcon || rightIcon;
    const accessibilityProps = {
      disabled: isDisabled,
      "aria-disabled": isDisabled,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      "aria-expanded": ariaExpanded,
      "aria-pressed": ariaPressed,
      "aria-haspopup": ariaHaspopup,
      "aria-busy": loading,
      role: props.role || "button",
      tabIndex: isDisabled ? -1 : props.tabIndex
    };
    const LoadingSpinner = () => /* @__PURE__ */ React3.createElement(
      "svg",
      {
        className: "animate-spin size-4",
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "aria-hidden": "true"
      },
      /* @__PURE__ */ React3.createElement(
        "circle",
        {
          className: "opacity-25",
          cx: "12",
          cy: "12",
          r: "10",
          stroke: "currentColor",
          strokeWidth: "4"
        }
      ),
      /* @__PURE__ */ React3.createElement(
        "path",
        {
          className: "opacity-75",
          fill: "currentColor",
          d: "m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        }
      )
    );
    return /* @__PURE__ */ React3.createElement(
      Comp,
      __spreadValues(__spreadValues({
        ref,
        "data-slot": "button",
        className: cn(buttonVariants({ variant, size, fullWidth, className }))
      }, accessibilityProps), props),
      asChild ? children : /* @__PURE__ */ React3.createElement(React3.Fragment, null, loading && /* @__PURE__ */ React3.createElement(LoadingSpinner, null), !loading && finalStartIcon && /* @__PURE__ */ React3.createElement("span", { className: "flex-shrink-0", "aria-hidden": "true" }, finalStartIcon), /* @__PURE__ */ React3.createElement("span", { className: "flex-shrink-0" }, children), !loading && finalEndIcon && /* @__PURE__ */ React3.createElement("span", { className: "flex-shrink-0", "aria-hidden": "true" }, finalEndIcon))
    );
  }
);
Button.displayName = "Button";

// src/components/ui/calendar.tsx
import * as React4 from "react";
import { DayPicker } from "react-day-picker";
function Calendar(_a) {
  var _b = _a, {
    className,
    classNames,
    showOutsideDays = true
  } = _b, props = __objRest(_b, [
    "className",
    "classNames",
    "showOutsideDays"
  ]);
  return /* @__PURE__ */ React4.createElement(
    DayPicker,
    __spreadValues({
      showOutsideDays: false,
      className: cn("p-3  min-w-72", className),
      classNames: __spreadValues({
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 gap-4 ",
        month: "space-y-4 bg-paper rounded-1",
        caption: "hidden",
        caption_label: "hidden",
        nav: "space-x-1 flex gap-4  bg-primary",
        nav_button: cn(
          "h-7 w-7 bg-blue-50 p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-sm"
        ),
        button_previous: "absolute left-1 bg-primary-500 text-white rounded-[4px]",
        button_next: "absolute right-1 bg-primary-500 text-white rounded-[4px]",
        table: "w-full border-collapse space-y-1 bg-red-500",
        head_row: "flex flex-row bg-yellow-500",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] ",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:bg-primary aria-selected:rounded-full  aria-selected:text-white text-center hover:bg-accent hover:text-primary rounded-md"
        ),
        day_range_end: "day-range-end",
        day_selected: "rdp-day_selected bg-primary-500",
        day_today: "bg-primary-500 rounded-full text-primary",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        dropdown_month: "rdp-dropdown_month",
        dropdown_year: "rdp-dropdown_year"
      }, classNames)
    }, props)
  );
}
Calendar.displayName = "Calendar";

// src/components/ui/card.tsx
import * as React5 from "react";
function Card(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React5.createElement(
    "div",
    __spreadValues({
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-none py-6 shadow-none",
        className
      )
    }, props)
  );
}
function CardHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React5.createElement(
    "div",
    __spreadValues({
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )
    }, props)
  );
}
function CardTitle(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React5.createElement(
    "div",
    __spreadValues({
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className)
    }, props)
  );
}
function CardDescription(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React5.createElement(
    "div",
    __spreadValues({
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className)
    }, props)
  );
}
function CardAction(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React5.createElement(
    "div",
    __spreadValues({
      "data-slot": "card-action",
      className: cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )
    }, props)
  );
}
function CardContent(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React5.createElement(
    "div",
    __spreadValues({
      "data-slot": "card-content",
      className: cn("px-6", className)
    }, props)
  );
}
function CardFooter(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React5.createElement(
    "div",
    __spreadValues({
      "data-slot": "card-footer",
      className: cn("flex items-center px-6 [.border-t]:pt-6", className)
    }, props)
  );
}

// src/components/ui/container.tsx
import * as React6 from "react";
function Container(_a) {
  var _b = _a, {
    children,
    width = "fit",
    variant = "white",
    gap = 16,
    padding = 2,
    radius = 10,
    bordered = false,
    shadowed = false,
    className
  } = _b, props = __objRest(_b, [
    "children",
    "width",
    "variant",
    "gap",
    "padding",
    "radius",
    "bordered",
    "shadowed",
    "className"
  ]);
  const widthClasses = {
    full: "w-full",
    fit: "w-fit"
  };
  const variantClasses2 = {
    white: "bg-white",
    transparent: "bg-transparent",
    gray: "bg-gray-50",
    primary: "bg-primary",
    secondary: "bg-secondary"
  };
  const borderClasses = bordered ? "border border-gray-200" : "";
  const shadowClasses = shadowed ? "shadow-md" : "shadow-none";
  return /* @__PURE__ */ React6.createElement(
    "div",
    __spreadValues({
      "data-slot": "container",
      className: cn(
        "flex flex-col",
        widthClasses[width],
        variantClasses2[variant],
        borderClasses,
        shadowClasses,
        className
      ),
      style: {
        gap: `${gap}px`,
        padding: `${padding}px`,
        borderRadius: `${radius}px`
      }
    }, props),
    children
  );
}

// src/components/ui/dropdown/dropdown-menu.tsx
import * as React7 from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
function DropdownMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ React7.createElement(DropdownMenuPrimitive.Root, __spreadValues({ "data-slot": "dropdown-menu" }, props));
}
function DropdownMenuPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ React7.createElement(DropdownMenuPrimitive.Portal, __spreadValues({ "data-slot": "dropdown-menu-portal" }, props));
}
function DropdownMenuTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ React7.createElement(
    DropdownMenuPrimitive.Trigger,
    __spreadValues({
      "data-slot": "dropdown-menu-trigger"
    }, props)
  );
}
function DropdownMenuContent(_a) {
  var _b = _a, {
    className,
    sideOffset = 4
  } = _b, props = __objRest(_b, [
    "className",
    "sideOffset"
  ]);
  return /* @__PURE__ */ React7.createElement(DropdownMenuPrimitive.Portal, null, /* @__PURE__ */ React7.createElement(
    DropdownMenuPrimitive.Content,
    __spreadValues({
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      )
    }, props)
  ));
}
function DropdownMenuGroup(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ React7.createElement(DropdownMenuPrimitive.Group, __spreadValues({ "data-slot": "dropdown-menu-group" }, props));
}
function DropdownMenuItem(_a) {
  var _b = _a, {
    className,
    inset,
    variant = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "variant"
  ]);
  return /* @__PURE__ */ React7.createElement(
    DropdownMenuPrimitive.Item,
    __spreadValues({
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-primary-50/50 focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}
function DropdownMenuCheckboxItem(_a) {
  var _b = _a, {
    className,
    children,
    checked
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "checked"
  ]);
  return /* @__PURE__ */ React7.createElement(
    DropdownMenuPrimitive.CheckboxItem,
    __spreadValues({
      "data-slot": "dropdown-menu-checkbox-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      checked
    }, props),
    /* @__PURE__ */ React7.createElement("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, /* @__PURE__ */ React7.createElement(DropdownMenuPrimitive.ItemIndicator, null, /* @__PURE__ */ React7.createElement(CheckIcon, { className: "size-4" }))),
    children
  );
}
function DropdownMenuRadioGroup(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ React7.createElement(
    DropdownMenuPrimitive.RadioGroup,
    __spreadValues({
      "data-slot": "dropdown-menu-radio-group"
    }, props)
  );
}
function DropdownMenuRadioItem(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ React7.createElement(
    DropdownMenuPrimitive.RadioItem,
    __spreadValues({
      "data-slot": "dropdown-menu-radio-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props),
    /* @__PURE__ */ React7.createElement("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, /* @__PURE__ */ React7.createElement(DropdownMenuPrimitive.ItemIndicator, null, /* @__PURE__ */ React7.createElement(CircleIcon, { className: "size-2 fill-current" }))),
    children
  );
}
function DropdownMenuLabel(_a) {
  var _b = _a, {
    className,
    inset
  } = _b, props = __objRest(_b, [
    "className",
    "inset"
  ]);
  return /* @__PURE__ */ React7.createElement(
    DropdownMenuPrimitive.Label,
    __spreadValues({
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )
    }, props)
  );
}
function DropdownMenuSeparator(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React7.createElement(
    DropdownMenuPrimitive.Separator,
    __spreadValues({
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className)
    }, props)
  );
}
function DropdownMenuShortcut(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React7.createElement(
    "span",
    __spreadValues({
      "data-slot": "dropdown-menu-shortcut",
      className: cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )
    }, props)
  );
}
function DropdownMenuSub(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ React7.createElement(DropdownMenuPrimitive.Sub, __spreadValues({ "data-slot": "dropdown-menu-sub" }, props));
}
function DropdownMenuSubTrigger(_a) {
  var _b = _a, {
    className,
    inset,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "children"
  ]);
  return /* @__PURE__ */ React7.createElement(
    DropdownMenuPrimitive.SubTrigger,
    __spreadValues({
      "data-slot": "dropdown-menu-sub-trigger",
      "data-inset": inset,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      )
    }, props),
    children,
    /* @__PURE__ */ React7.createElement(ChevronRightIcon, { className: "ml-auto size-4" })
  );
}
function DropdownMenuSubContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React7.createElement(
    DropdownMenuPrimitive.SubContent,
    __spreadValues({
      "data-slot": "dropdown-menu-sub-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )
    }, props)
  );
}

// src/components/ui/input.tsx
import * as React8 from "react";
var Input = React8.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
    return /* @__PURE__ */ React8.createElement(
      "input",
      __spreadValues({
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref
      }, props)
    );
  }
);
Input.displayName = "Input";

// src/components/ui/navigation-menu.tsx
import * as React9 from "react";
var NavigationMenu = React9.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, children } = _b, props = __objRest(_b, ["className", "children"]);
    return /* @__PURE__ */ React9.createElement(
      "nav",
      __spreadValues({
        ref,
        className: cn("flex items-center space-x-4 lg:space-x-6", className)
      }, props),
      children
    );
  }
);
NavigationMenu.displayName = "NavigationMenu";
var NavigationMenuItem = React9.forwardRef((_a, ref) => {
  var _b = _a, { className, children } = _b, props = __objRest(_b, ["className", "children"]);
  return /* @__PURE__ */ React9.createElement("li", __spreadValues({ ref, className: cn("", className) }, props), children);
});
NavigationMenuItem.displayName = "NavigationMenuItem";
var NavigationMenuLink = React9.forwardRef((_a, ref) => {
  var _b = _a, { className, children, href, active } = _b, props = __objRest(_b, ["className", "children", "href", "active"]);
  return /* @__PURE__ */ React9.createElement(
    "a",
    __spreadValues({
      ref,
      href,
      className: cn(
        "text-sm font-medium transition-colors hover:text-primary",
        active ? "text-black dark:text-white" : "text-muted-foreground",
        className
      )
    }, props),
    children
  );
});
NavigationMenuLink.displayName = "NavigationMenuLink";

// src/components/ui/pagination.tsx
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React10 from "react";
var Pagination = (_a) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React10.createElement(
    "nav",
    __spreadValues({
      role: "navigation",
      "aria-label": "pagination",
      className: cn("mx-auto flex w-full justify-center", className)
    }, props)
  );
};
var PaginationContent = React10.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React10.createElement(
    "ul",
    __spreadValues({
      ref,
      className: cn("flex flex-row items-center gap-1", className)
    }, props)
  );
});
PaginationContent.displayName = "PaginationContent";
var PaginationItem = React10.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React10.createElement("li", __spreadValues({ ref, className: cn("", className) }, props));
});
PaginationItem.displayName = "PaginationItem";
var PaginationLink = (_a) => {
  var _b = _a, {
    className,
    isActive,
    size = "icon"
  } = _b, props = __objRest(_b, [
    "className",
    "isActive",
    "size"
  ]);
  return /* @__PURE__ */ React10.createElement(
    "a",
    __spreadValues({
      "aria-current": isActive ? "page" : void 0,
      className: cn(
        buttonVariants({
          variant: isActive ? "outlined" : "ghost",
          size
        }),
        isActive && "bg-primary-50 text-primary-600 border-primary-200 hover:bg-primary-100",
        className
      )
    }, props)
  );
};
PaginationLink.displayName = "PaginationLink";
var PaginationPrevious = (_a) => {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React10.createElement(
    PaginationLink,
    __spreadValues({
      "aria-label": "Go to previous page",
      size: "default",
      className: cn("gap-1 pl-2.5", className)
    }, props),
    /* @__PURE__ */ React10.createElement(ChevronLeft, { className: "h-4 w-4" }),
    /* @__PURE__ */ React10.createElement("span", null, "Previous")
  );
};
PaginationPrevious.displayName = "PaginationPrevious";
var PaginationNext = (_a) => {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React10.createElement(
    PaginationLink,
    __spreadValues({
      "aria-label": "Go to next page",
      size: "default",
      className: cn("gap-1 pr-2.5", className)
    }, props),
    /* @__PURE__ */ React10.createElement("span", null, "Next"),
    /* @__PURE__ */ React10.createElement(ChevronRight, { className: "h-4 w-4" })
  );
};
PaginationNext.displayName = "PaginationNext";
var PaginationEllipsis = (_a) => {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React10.createElement(
    "span",
    __spreadValues({
      "aria-hidden": true,
      className: cn("flex h-9 w-9 items-center justify-center", className)
    }, props),
    /* @__PURE__ */ React10.createElement(MoreHorizontal, { className: "h-4 w-4" }),
    /* @__PURE__ */ React10.createElement("span", { className: "sr-only" }, "More pages")
  );
};
PaginationEllipsis.displayName = "PaginationEllipsis";

// src/components/ui/form-fields/select.tsx
import { cva as cva3 } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import * as React11 from "react";
var selectVariants = cva3(
  "flex w-full font-rubik text-base font-normal leading-6 tracking-[0.15px] text-[color:var(--color-text-secondary)] max-h-14 h-auto px-3 py-2 rounded border border-[color:var(--color-border-default)] bg-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-colors",
  {
    variants: {
      variant: {
        default: "border-[color:var(--color-border-default)] focus:border-[color:var(--color-primary-500)]",
        error: "border-[color:var(--color-error-500)] focus:border-[color:var(--color-error-500)]",
        success: "border-[color:var(--color-success-500)] focus:border-[color:var(--color-success-500)]"
      },
      size: {
        default: "h-10 px-3",
        sm: "h-8 px-2 text-sm",
        lg: "h-12 px-4 text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Select = React11.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      className,
      variant,
      size,
      error,
      success,
      placeholder,
      children
    } = _b, props = __objRest(_b, [
      "className",
      "variant",
      "size",
      "error",
      "success",
      "placeholder",
      "children"
    ]);
    let finalVariant = variant;
    if (error) finalVariant = "error";
    if (success) finalVariant = "success";
    return /* @__PURE__ */ React11.createElement("div", { className: "relative" }, /* @__PURE__ */ React11.createElement(
      "select",
      __spreadValues({
        className: cn(
          selectVariants({ variant: finalVariant, size, className }),
          "pr-10"
          // Space for the chevron icon
        ),
        ref
      }, props),
      placeholder && /* @__PURE__ */ React11.createElement("option", { value: "", disabled: true }, placeholder),
      children
    ), /* @__PURE__ */ React11.createElement(ChevronDown, { className: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-muted-foreground pointer-events-none" }));
  }
);
Select.displayName = "Select";

// src/components/ui/typography.tsx
import { Slot as Slot2 } from "@radix-ui/react-slot";
import { cva as cva4 } from "class-variance-authority";
import * as React12 from "react";
var typographyVariants = cva4("font-rubik text-foreground", {
  variants: {
    variant: {
      // Heading variants
      h1: "text-[75px] font-bold leading-[100%] tracking-[-2px] text-[#E0E0E0]",
      h2: "text-[50px] font-bold leading-[100%] tracking-[-3%] text-[rgba(0,0,0,0.87)]",
      h3: "text-[30px] font-semibold leading-[100%] tracking-[-2px]",
      h4: "text-[21px] font-semibold leading-[120%] tracking-[0px]",
      h5: "text-[1.5em] font-medium leading-[133%] tracking-[0.5%]",
      h6: "text-[1.25rem] font-medium leading-[160%] tracking-[0.15px] text-[rgba(0,0,0,0.6)]",
      // Body text variants
      body1: "text-[1rem] font-normal leading-[150%] tracking-[0.15%] text-[rgba(0,0,0,0.6)]",
      body2: "text-[0.87rem] font-normal leading-[143%] tracking-[0.17%] text-[rgba(0,0,0,0.6)]",
      // Specialized variants
      caption: "text-[14px] font-normal leading-[100%] tracking-[0px]",
      small: "text-[14px] font-normal leading-[130%] tracking-[0px]",
      link: "text-[16px] font-medium leading-[130%] tracking-[0.15px] text-primary hover:text-primary/80 underline-offset-4 hover:underline",
      // Display variants
      display1: "text-[2.25rem] font-bold leading-tight tracking-tight",
      display2: "text-[3rem] font-bold leading-tight tracking-tight",
      display3: "text-[3.75rem] font-bold leading-tight tracking-tight",
      // Code variants
      code: "font-mono text-sm bg-muted px-1.5 py-0.5 rounded-md",
      pre: "font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto"
    },
    textColor: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      success: "text-success-500",
      warning: "text-warning-500",
      info: "text-info-500"
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold"
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify"
    },
    truncate: {
      true: "truncate",
      false: ""
    }
  },
  defaultVariants: {
    variant: "body1",
    textColor: "default",
    weight: "normal",
    align: "left",
    truncate: false
  }
});
var Typography = React12.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      className,
      variant,
      textColor,
      weight,
      align,
      truncate,
      asChild = false,
      as,
      children,
      href,
      target,
      rel
    } = _b, props = __objRest(_b, [
      "className",
      "variant",
      "textColor",
      "weight",
      "align",
      "truncate",
      "asChild",
      "as",
      "children",
      "href",
      "target",
      "rel"
    ]);
    const getElement = () => {
      if (as) return as;
      switch (variant) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return variant;
        case "code":
          return "code";
        case "pre":
          return "pre";
        default:
          return "p";
      }
    };
    const Comp = asChild ? Slot2 : getElement();
    const anchorProps = as === "a" || getElement() === "a" ? { href, target, rel } : {};
    return /* @__PURE__ */ React12.createElement(
      Comp,
      __spreadValues(__spreadValues({
        ref,
        "data-slot": "typography",
        className: cn(
          typographyVariants({
            variant,
            textColor,
            weight,
            align,
            truncate,
            className
          })
        )
      }, anchorProps), props),
      children
    );
  }
);
Typography.displayName = "Typography";

// src/hooks/use-pagination.ts
import { useMemo } from "react";
function usePagination({
  currentPage,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1
}) {
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };
  const items = useMemo(() => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + boundaryCount * 2;
    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }
    const leftSiblingIndex = Math.max(
      currentPage - siblingCount,
      boundaryCount
    );
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - boundaryCount
    );
    const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - boundaryCount - 1;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = leftSiblingIndex + 1;
      const leftRange = range(1, leftItemCount);
      return [
        ...leftRange,
        "ellipsis",
        ...range(totalPages - boundaryCount + 1, totalPages)
      ];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = totalPages - rightSiblingIndex;
      const rightRange = range(rightSiblingIndex, totalPages);
      return [...range(1, boundaryCount), "ellipsis", ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [
        ...range(1, boundaryCount),
        "ellipsis",
        ...middleRange,
        "ellipsis",
        ...range(totalPages - boundaryCount + 1, totalPages)
      ];
    }
    return range(1, totalPages);
  }, [currentPage, totalPages, siblingCount, boundaryCount]);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const nextPage = hasNextPage ? currentPage + 1 : currentPage;
  const previousPage = hasPreviousPage ? currentPage - 1 : currentPage;
  const startPage = Math.max(1, (currentPage - 1) * siblingCount);
  const endPage = Math.min(totalPages, currentPage * siblingCount);
  return {
    items,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    startPage,
    endPage
  };
}

// src/components/ui/pagination/data-table-pagination.tsx
function DataTablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  className,
  showPageSizeSelector = true,
  showItemCount = true,
  siblingCount = 1,
  boundaryCount = 1
}) {
  const pagination = usePagination({
    currentPage,
    totalPages,
    siblingCount,
    boundaryCount
  });
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  return /* @__PURE__ */ React.createElement(Card, { className: cn("mt-4", className) }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, showItemCount && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sm text-muted-foreground" }, /* @__PURE__ */ React.createElement("span", null, "Page ", currentPage, " of ", totalPages), /* @__PURE__ */ React.createElement("span", null, "\u2022"), /* @__PURE__ */ React.createElement("span", null, startItem, "-", endItem, " of ", totalItems, " items")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, showPageSizeSelector && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Typography, { variant: "small", className: "text-muted-foreground" }, "Rows per page:"), /* @__PURE__ */ React.createElement(
    Select,
    {
      value: pageSize.toString(),
      onChange: (e) => onPageSizeChange(Number(e.target.value)),
      size: "sm",
      className: "w-[70px]"
    },
    pageSizeOptions.map((size) => /* @__PURE__ */ React.createElement("option", { key: size, value: size }, size))
  )), /* @__PURE__ */ React.createElement(Pagination, null, /* @__PURE__ */ React.createElement(PaginationContent, null, /* @__PURE__ */ React.createElement(PaginationItem, null, /* @__PURE__ */ React.createElement(
    PaginationPrevious,
    {
      href: "#",
      onClick: (e) => {
        e.preventDefault();
        if (pagination.hasPreviousPage) {
          onPageChange(pagination.previousPage);
        }
      },
      className: cn(
        !pagination.hasPreviousPage && "pointer-events-none opacity-50"
      )
    }
  )), pagination.items.map((item, index) => /* @__PURE__ */ React.createElement(PaginationItem, { key: index }, item === "ellipsis" ? /* @__PURE__ */ React.createElement(PaginationEllipsis, null) : /* @__PURE__ */ React.createElement(
    PaginationLink,
    {
      href: "#",
      className: "border-none bg-none",
      isActive: item === currentPage,
      onClick: (e) => {
        e.preventDefault();
        onPageChange(item);
      }
    },
    item
  ))), /* @__PURE__ */ React.createElement(PaginationItem, null, /* @__PURE__ */ React.createElement(
    PaginationNext,
    {
      href: "#",
      onClick: (e) => {
        e.preventDefault();
        if (pagination.hasNextPage) {
          onPageChange(pagination.nextPage);
        }
      },
      className: cn(
        !pagination.hasNextPage && "pointer-events-none opacity-50"
      )
    }
  ))))))));
}

// src/components/ui/pagination/pagination.tsx
import {
  ChevronLeftIcon,
  ChevronRightIcon as ChevronRightIcon2,
  MoreHorizontalIcon
} from "lucide-react";
import * as React13 from "react";
function Pagination2(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ React13.createElement(
    "nav",
    __spreadValues({
      role: "navigation",
      "aria-label": "pagination",
      "data-slot": "pagination",
      className: cn("mx-auto flex w-full justify-center", className)
    }, props)
  );
}
function PaginationContent2(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React13.createElement(
    "ul",
    __spreadValues({
      "data-slot": "pagination-content",
      className: cn("flex flex-row items-center gap-1", className)
    }, props)
  );
}
function PaginationItem2(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ React13.createElement("li", __spreadValues({ "data-slot": "pagination-item" }, props));
}
function PaginationLink2(_a) {
  var _b = _a, {
    className,
    isActive,
    size = "icon"
  } = _b, props = __objRest(_b, [
    "className",
    "isActive",
    "size"
  ]);
  return /* @__PURE__ */ React13.createElement(
    "a",
    __spreadValues({
      "aria-current": isActive ? "page" : void 0,
      "data-slot": "pagination-link",
      "data-active": isActive,
      className: cn(
        isActive ? "text-primary font-medium" : "text-primary-foreground border-none",
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-9 rounded-md px-3",
        size === "lg" && "h-11 rounded-md px-8",
        size === "icon" && "h-10 w-10",
        className
      )
    }, props)
  );
}
function PaginationPrevious2(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React13.createElement(
    PaginationLink2,
    __spreadValues({
      "aria-label": "Go to previous page",
      size: "default",
      className: cn("gap-1 px-2.5 sm:pl-2.5", className)
    }, props),
    /* @__PURE__ */ React13.createElement(ChevronLeftIcon, null),
    /* @__PURE__ */ React13.createElement("span", { className: "hidden sm:block" }, "Previous")
  );
}
function PaginationNext2(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React13.createElement(
    PaginationLink2,
    __spreadValues({
      "aria-label": "Go to next page",
      size: "default",
      className: cn("gap-1 px-2.5 sm:pr-2.5", className)
    }, props),
    /* @__PURE__ */ React13.createElement("span", { className: "hidden sm:block" }, "Next"),
    /* @__PURE__ */ React13.createElement(ChevronRightIcon2, null)
  );
}
function PaginationEllipsis2(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React13.createElement(
    "span",
    __spreadValues({
      "aria-hidden": true,
      "data-slot": "pagination-ellipsis",
      className: cn("flex size-9 items-center justify-center", className)
    }, props),
    /* @__PURE__ */ React13.createElement(MoreHorizontalIcon, { className: "size-4" }),
    /* @__PURE__ */ React13.createElement("span", { className: "sr-only" }, "More pages")
  );
}

// src/hooks/use-enhanced-pagination.ts
import { useCallback, useMemo as useMemo2, useState } from "react";
function useEnhancedPagination({
  totalItems,
  initialPageSize = 10,
  initialPage = 1,
  siblingCount = 1,
  boundaryCount = 1,
  pageSizeOptions = [5, 10, 20, 50, 100]
}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = useMemo2(
    () => Math.ceil(totalItems / pageSize),
    [totalItems, pageSize]
  );
  useMemo2(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  const startItem = useMemo2(
    () => (currentPage - 1) * pageSize + 1,
    [currentPage, pageSize]
  );
  const endItem = useMemo2(
    () => Math.min(currentPage * pageSize, totalItems),
    [currentPage, pageSize, totalItems]
  );
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const nextPage = hasNextPage ? currentPage + 1 : currentPage;
  const previousPage = hasPreviousPage ? currentPage - 1 : currentPage;
  const paginationItems = useMemo2(() => {
    const range = (start, end) => {
      const length = end - start + 1;
      return Array.from({ length }, (_, idx) => idx + start);
    };
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + boundaryCount * 2;
    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }
    const leftSiblingIndex = Math.max(
      currentPage - siblingCount,
      boundaryCount
    );
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - boundaryCount
    );
    const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - boundaryCount - 1;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = leftSiblingIndex + 1;
      const leftRange = range(1, leftItemCount);
      return [
        ...leftRange,
        "ellipsis",
        ...range(totalPages - boundaryCount + 1, totalPages)
      ];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = totalPages - rightSiblingIndex;
      const rightRange = range(rightSiblingIndex, totalPages);
      return [...range(1, boundaryCount), "ellipsis", ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [
        ...range(1, boundaryCount),
        "ellipsis",
        ...middleRange,
        "ellipsis",
        ...range(totalPages - boundaryCount + 1, totalPages)
      ];
    }
    return range(1, totalPages);
  }, [currentPage, totalPages, siblingCount, boundaryCount]);
  const setPage = useCallback(
    (page) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );
  const setPageSizeHandler = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);
  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(nextPage);
    }
  }, [hasNextPage, nextPage]);
  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(previousPage);
    }
  }, [hasPreviousPage, previousPage]);
  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);
  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);
  const paginationState = useMemo2(
    () => ({
      pageIndex: currentPage - 1,
      // TanStack uses 0-based indexing
      pageSize
    }),
    [currentPage, pageSize]
  );
  const setPaginationState = useCallback(
    (state) => {
      setCurrentPage(state.pageIndex + 1);
      setPageSize(state.pageSize);
    },
    []
  );
  return {
    // Current state
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    // Computed values
    startItem,
    endItem,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    // Pagination items for rendering
    paginationItems,
    // Actions
    setPage,
    setPageSize: setPageSizeHandler,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    // Page size options
    pageSizeOptions,
    // TanStack Table integration
    paginationState,
    setPaginationState
  };
}

// src/components/ui/pagination/enhanced-pagination.tsx
import React14 from "react";
function EnhancedPagination({
  totalItems,
  initialPageSize = 10,
  initialPage = 1,
  siblingCount = 1,
  boundaryCount = 1,
  pageSizeOptions = [5, 10, 20, 50, 100],
  className,
  showPageSizeSelector = true,
  showItemCount = true,
  showPageInfo = true,
  variant = "default",
  onPageChange,
  onPageSizeChange,
  children
}) {
  const pagination = useEnhancedPagination({
    totalItems,
    initialPageSize,
    initialPage,
    siblingCount,
    boundaryCount,
    pageSizeOptions
  });
  const handlePageChange = (page) => {
    pagination.setPage(page);
    onPageChange == null ? void 0 : onPageChange(page);
  };
  const handlePageSizeChange = (pageSize) => {
    pagination.setPageSize(pageSize);
    onPageSizeChange == null ? void 0 : onPageSizeChange(pageSize);
  };
  const renderPaginationContent = () => /* @__PURE__ */ React14.createElement(Pagination2, null, /* @__PURE__ */ React14.createElement(PaginationContent2, null, /* @__PURE__ */ React14.createElement(PaginationItem2, null, /* @__PURE__ */ React14.createElement(
    PaginationPrevious2,
    {
      href: "#",
      onClick: (e) => {
        e.preventDefault();
        if (pagination.hasPreviousPage) {
          handlePageChange(pagination.previousPage);
        }
      },
      className: cn(
        !pagination.hasPreviousPage && "pointer-events-none opacity-50"
      )
    }
  )), pagination.paginationItems.map((item, index) => /* @__PURE__ */ React14.createElement(PaginationItem2, { key: index }, item === "ellipsis" ? /* @__PURE__ */ React14.createElement(PaginationEllipsis2, null) : /* @__PURE__ */ React14.createElement(
    PaginationLink2,
    {
      href: "#",
      isActive: item === pagination.currentPage,
      onClick: (e) => {
        e.preventDefault();
        handlePageChange(item);
      }
    },
    item
  ))), /* @__PURE__ */ React14.createElement(PaginationItem2, null, /* @__PURE__ */ React14.createElement(
    PaginationNext2,
    {
      href: "#",
      onClick: (e) => {
        e.preventDefault();
        if (pagination.hasNextPage) {
          handlePageChange(pagination.nextPage);
        }
      },
      className: cn(
        !pagination.hasNextPage && "pointer-events-none opacity-50"
      )
    }
  ))));
  if (variant === "minimal") {
    return /* @__PURE__ */ React14.createElement("div", { className: cn("flex items-center justify-center", className) }, renderPaginationContent());
  }
  if (variant === "compact") {
    return /* @__PURE__ */ React14.createElement("div", { className: cn("flex items-center justify-between", className) }, showItemCount && /* @__PURE__ */ React14.createElement(Typography, { variant: "body2", className: "text-primary" }, pagination.startItem, "-", pagination.endItem, " of", " ", pagination.totalItems), /* @__PURE__ */ React14.createElement("div", { className: "flex items-center gap-4" }, showPageSizeSelector && /* @__PURE__ */ React14.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React14.createElement(Typography, { variant: "small", className: "text-primary" }, "Rows:"), /* @__PURE__ */ React14.createElement(
      Select,
      {
        value: pagination.pageSize.toString(),
        onChange: (e) => handlePageSizeChange(Number(e.target.value)),
        size: "sm",
        className: "w-[70px]"
      },
      pagination.pageSizeOptions.map((size) => /* @__PURE__ */ React14.createElement("option", { key: size, value: size }, size))
    )), renderPaginationContent()));
  }
  return /* @__PURE__ */ React14.createElement(Card, { className: cn("mt-4", className) }, /* @__PURE__ */ React14.createElement(CardContent, { className: "p-4" }, /* @__PURE__ */ React14.createElement("div", { className: "flex items-center justify-between" }, showItemCount && /* @__PURE__ */ React14.createElement("div", { className: "flex items-center gap-2 text-sm text-primary" }, showPageInfo && /* @__PURE__ */ React14.createElement(React14.Fragment, null, /* @__PURE__ */ React14.createElement("span", null, "Page ", pagination.currentPage, " of ", pagination.totalPages), /* @__PURE__ */ React14.createElement("span", null, "\u2022")), /* @__PURE__ */ React14.createElement("span", null, pagination.startItem, "-", pagination.endItem, " of", " ", pagination.totalItems, " items")), /* @__PURE__ */ React14.createElement("div", { className: "flex items-center gap-4" }, showPageSizeSelector && /* @__PURE__ */ React14.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React14.createElement(Typography, { variant: "body2", className: "text-muted-foreground" }, "Rows per page:"), /* @__PURE__ */ React14.createElement(
    Select,
    {
      value: pagination.pageSize.toString(),
      onChange: (e) => handlePageSizeChange(Number(e.target.value)),
      size: "sm",
      className: "w-[70px]"
    },
    pagination.pageSizeOptions.map((size) => /* @__PURE__ */ React14.createElement("option", { key: size, value: size }, size))
  )), renderPaginationContent())), children));
}

// src/components/ui/popover.tsx
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React15 from "react";
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
var PopoverContent = React15.forwardRef((_a, ref) => {
  var _b = _a, { className, align = "center", sideOffset = 4 } = _b, props = __objRest(_b, ["className", "align", "sideOffset"]);
  return /* @__PURE__ */ React15.createElement(PopoverPrimitive.Portal, null, /* @__PURE__ */ React15.createElement(
    PopoverPrimitive.Content,
    __spreadValues({
      ref,
      align,
      sideOffset,
      className: cn(
        "z-50 w-full rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )
    }, props)
  ));
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// src/components/ui/scroll-area.tsx
import * as React16 from "react";
var ScrollArea = React16.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, children, orientation = "vertical" } = _b, props = __objRest(_b, ["className", "children", "orientation"]);
    return /* @__PURE__ */ React16.createElement(
      "div",
      __spreadValues({
        ref,
        className: cn(
          "relative overflow-auto",
          orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
          orientation === "horizontal" && "overflow-x-auto overflow-y-hidden",
          className
        )
      }, props),
      children
    );
  }
);
ScrollArea.displayName = "ScrollArea";

// src/components/ui/separator.tsx
import * as React17 from "react";
var Separator2 = React17.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, orientation = "horizontal", decorative = true } = _b, props = __objRest(_b, ["className", "orientation", "decorative"]);
    return /* @__PURE__ */ React17.createElement(
      "div",
      __spreadValues({
        ref,
        role: decorative ? "none" : "separator",
        "aria-orientation": orientation,
        className: cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )
      }, props)
    );
  }
);
Separator2.displayName = "Separator";

// src/components/ui/sidebar.tsx
import * as React18 from "react";
var Sidebar = React18.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, children } = _b, props = __objRest(_b, ["className", "children"]);
    return /* @__PURE__ */ React18.createElement(
      "div",
      __spreadValues({
        ref,
        className: cn("flex flex-col h-full bg-background border-r", className)
      }, props),
      children
    );
  }
);
Sidebar.displayName = "Sidebar";
var SidebarHeader = React18.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, children } = _b, props = __objRest(_b, ["className", "children"]);
    return /* @__PURE__ */ React18.createElement(
      "div",
      __spreadValues({
        ref,
        className: cn("flex h-16 items-center px-4 border-b", className)
      }, props),
      children
    );
  }
);
SidebarHeader.displayName = "SidebarHeader";
var SidebarContent = React18.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, children } = _b, props = __objRest(_b, ["className", "children"]);
    return /* @__PURE__ */ React18.createElement("div", __spreadValues({ ref, className: cn("flex-1 overflow-auto", className) }, props), children);
  }
);
SidebarContent.displayName = "SidebarContent";
var SidebarFooter = React18.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, children } = _b, props = __objRest(_b, ["className", "children"]);
    return /* @__PURE__ */ React18.createElement(
      "div",
      __spreadValues({
        ref,
        className: cn("flex items-center gap-4 p-4 border-t", className)
      }, props),
      children
    );
  }
);
SidebarFooter.displayName = "SidebarFooter";

// src/components/ui/skeleton.tsx
import React19 from "react";
function Skeleton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React19.createElement(
    "div",
    __spreadValues({
      className: cn("animate-pulse rounded-md bg-muted", className)
    }, props)
  );
}

// src/components/ui/tab/tabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { cva as cva5 } from "class-variance-authority";
import * as React20 from "react";
var tabTriggerVariants = cva5(
  "inline-flex items-center justify-center whitespace-nowrap text-[0.87rem] leading-[24px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-none",
  {
    variants: {
      variant: {
        underlined: "border-b-2 border-transparent text-muted-foreground hover:text-primary uppercase hover:border-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary",
        outlined: "rounded-lg data-[state=active]:border data-[state=active]:border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-primary",
        contained: "rounded-lg bg-transparent text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        rounded: "rounded-full bg-transparent text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1",
        lg: "h-12 px-6 py-3"
      }
    },
    defaultVariants: {
      variant: "underlined",
      size: "default"
    }
  }
);
var tabListVariants = cva5(
  "inline-flex h-10 items-center justify-center text-muted-foreground",
  {
    variants: {
      variant: {
        underlined: " px-2 py-1 gap-6",
        outlined: "rounded-lg bg-transparent px-2 py-1 gap-2",
        contained: "rounded-lg bg-muted px-2 py-1 gap-2",
        rounded: "rounded-lg bg-transparent p-1 px-2 py-1 gap-2"
      }
    },
    defaultVariants: {
      variant: "underlined"
    }
  }
);
var ReusableTabs = React20.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      items,
      variant = "underlined",
      size = "default",
      defaultValue,
      className,
      triggerClassName,
      contentClassName
    } = _b, props = __objRest(_b, [
      "items",
      "variant",
      "size",
      "defaultValue",
      "className",
      "triggerClassName",
      "contentClassName"
    ]);
    var _a2;
    const defaultTabValue = defaultValue || ((_a2 = items[0]) == null ? void 0 : _a2.value);
    return /* @__PURE__ */ React20.createElement(
      Tabs,
      __spreadValues({
        ref,
        defaultValue: defaultTabValue,
        className: cn("w-full", className)
      }, props),
      /* @__PURE__ */ React20.createElement(TabsList, { className: cn(tabListVariants({ variant })) }, items.map((item) => /* @__PURE__ */ React20.createElement(
        TabsTrigger,
        {
          key: item.value,
          value: item.value,
          className: cn(
            tabTriggerVariants({ variant, size }),
            triggerClassName
          )
        },
        item.label
      ))),
      items.map((item) => /* @__PURE__ */ React20.createElement(
        TabsContent,
        {
          key: item.value,
          value: item.value,
          className: cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            contentClassName
          )
        },
        item.content
      ))
    );
  }
);
ReusableTabs.displayName = "ReusableTabs";

// src/components/ui/form-fields/autocomplete.tsx
import { cva as cva6 } from "class-variance-authority";
import { ChevronDown as ChevronDown2, X } from "lucide-react";
import * as React21 from "react";
var autocompleteVariants = cva6(
  "flex w-full font-rubik text-base font-normal leading-6 tracking-[0.15px] text-[color:var(--color-text-secondary)] max-h-14 h-auto px-3 py-2 rounded border border-[color:var(--color-border-default)] bg-paper focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-[color:var(--color-border-default)] focus:border-[color:var(--color-primary-500)]",
        error: "border-[color:var(--color-error-500)] focus:border-[color:var(--color-error-500)]",
        success: "border-[color:var(--color-success-500)] focus:border-[color:var(--color-success-500)]"
      },
      size: {
        default: "h-10 px-3",
        sm: "h-8 px-2 text-sm",
        lg: "h-12 px-4 text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Autocomplete = React21.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      className,
      variant,
      size,
      error,
      success,
      placeholder,
      options,
      value,
      onChange,
      onSelect,
      multiple = false,
      selectedValues = [],
      onSelectedValuesChange
    } = _b, props = __objRest(_b, [
      "className",
      "variant",
      "size",
      "error",
      "success",
      "placeholder",
      "options",
      "value",
      "onChange",
      "onSelect",
      "multiple",
      "selectedValues",
      "onSelectedValuesChange"
    ]);
    const [isOpen, setIsOpen] = React21.useState(false);
    const [inputValue, setInputValue] = React21.useState(() => {
      if (typeof value === "string") return value;
      if (value && typeof value === "object" && "value" in value)
        return String(value.value);
      return "";
    });
    const [filteredOptions, setFilteredOptions] = React21.useState(options);
    const containerRef = React21.useRef(null);
    let finalVariant = variant;
    if (error) finalVariant = "error";
    if (success) finalVariant = "success";
    React21.useEffect(() => {
      const inputValueStr = typeof inputValue === "string" ? inputValue : "";
      const filtered = options.filter(
        (option) => option.label.toLowerCase().includes(inputValueStr.toLowerCase())
      );
      setFilteredOptions(filtered);
    }, [inputValue, options]);
    React21.useEffect(() => {
      if (typeof value === "string") {
        setInputValue(value);
      } else if (value && typeof value === "object" && "value" in value) {
        setInputValue(String(value.value));
      }
    }, [value]);
    React21.useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleInputChange = (e) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsOpen(true);
      onChange == null ? void 0 : onChange(newValue);
    };
    const handleOptionClick = (option) => {
      if (multiple) {
        const newSelectedValues = selectedValues.includes(option.value) ? selectedValues.filter((v) => v !== option.value) : [...selectedValues, option.value];
        onSelectedValuesChange == null ? void 0 : onSelectedValuesChange(newSelectedValues);
        setInputValue("");
      } else {
        setInputValue(option.label);
        setIsOpen(false);
        onSelect == null ? void 0 : onSelect(option);
        onChange == null ? void 0 : onChange(option.value);
      }
    };
    const handleRemoveValue = (valueToRemove) => {
      const newSelectedValues = selectedValues.filter((v) => v !== valueToRemove);
      onSelectedValuesChange == null ? void 0 : onSelectedValuesChange(newSelectedValues);
    };
    const selectedOptions = options.filter(
      (option) => selectedValues.includes(option.value)
    );
    return /* @__PURE__ */ React21.createElement("div", { className: "relative", ref: containerRef }, /* @__PURE__ */ React21.createElement("div", { className: "relative" }, /* @__PURE__ */ React21.createElement(
      "input",
      __spreadValues({
        className: cn(
          autocompleteVariants({ variant: finalVariant, size, className }),
          "pr-10"
        ),
        ref,
        value: inputValue,
        onChange: handleInputChange,
        onFocus: () => setIsOpen(true),
        placeholder
      }, props)
    ), /* @__PURE__ */ React21.createElement(ChevronDown2, { className: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" })), multiple && selectedOptions.length > 0 && /* @__PURE__ */ React21.createElement("div", { className: "flex flex-wrap gap-1 mt-2  rounded" }, selectedOptions.map((option) => /* @__PURE__ */ React21.createElement(
      "span",
      {
        key: option.value,
        className: "inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded "
      },
      option.label,
      /* @__PURE__ */ React21.createElement(
        "button",
        {
          type: "button",
          onClick: () => handleRemoveValue(option.value),
          className: "ml-1 hover:bg-primary-50 rounded-full p-0.5"
        },
        /* @__PURE__ */ React21.createElement(X, { className: "h-3 w-3" })
      )
    ))), isOpen && filteredOptions.length > 0 && /* @__PURE__ */ React21.createElement("div", { className: "absolute z-50 w-full mt-1 bg-white border-none rounded shadow-lg max-h-60 overflow-auto" }, filteredOptions.map((option) => /* @__PURE__ */ React21.createElement(
      "button",
      {
        key: option.value,
        type: "button",
        className: cn(
          "w-full px-3 py-2 text-left hover:bg-primary/10 focus:bg-primary-100 focus:outline-none font-rubik text-[rgba(0,0,0,0.60)]",
          multiple && selectedValues.includes(option.value) && "bg-primary/10"
        ),
        onClick: () => handleOptionClick(option)
      },
      option.label
    ))));
  }
);
Autocomplete.displayName = "Autocomplete";

// src/components/ui/form-fields/checkbox.tsx
import { cva as cva7 } from "class-variance-authority";
import { Check } from "lucide-react";
import * as React22 from "react";
var checkboxVariants = cva7(
  "peer h-4 w-4 shrink-0 rounded border border-[color:var(--color-border-default)] bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary",
  {
    variants: {
      variant: {
        default: "border-[color:var(--color-border-default)] data-[state=checked]:border-[color:var(--color-primary-500)] data-[state=checked]:bg-[color:var(--color-primary-500)]",
        error: "border-[color:var(--color-error-500)] data-[state=checked]:border-[color:var(--color-error-500)] data-[state=checked]:bg-[color:var(--color-error-500)]",
        success: "border-[color:var(--color-success-500)] data-[state=checked]:border-[color:var(--color-success-500)] data-[state=checked]:bg-[color:var(--color-success-500)]"
      },
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-5 w-5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Checkbox = React22.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      className,
      variant,
      size,
      error,
      success,
      label,
      required,
      checked,
      onChange
    } = _b, props = __objRest(_b, [
      "className",
      "variant",
      "size",
      "error",
      "success",
      "label",
      "required",
      "checked",
      "onChange"
    ]);
    let finalVariant = variant;
    if (error) finalVariant = "error";
    if (success) finalVariant = "success";
    const handleToggle = () => {
      if (onChange) {
        const event = {
          target: { checked: !checked }
        };
        onChange(event);
      }
    };
    return /* @__PURE__ */ React22.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React22.createElement("div", { className: "relative" }, /* @__PURE__ */ React22.createElement(
      "input",
      __spreadValues({
        type: "checkbox",
        className: cn(
          checkboxVariants({ variant: finalVariant, size, className }),
          "sr-only"
        ),
        ref,
        checked,
        onChange
      }, props)
    ), /* @__PURE__ */ React22.createElement(
      "div",
      {
        className: cn(
          checkboxVariants({ variant: finalVariant, size }),
          "flex items-center justify-center cursor-pointer hover:bg-primary-50/50 transition-colors"
        ),
        "data-state": checked ? "checked" : "unchecked",
        onClick: handleToggle,
        role: "checkbox",
        "aria-checked": checked,
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }
      },
      checked && /* @__PURE__ */ React22.createElement(Check, { className: "h-3 w-3 text-white" })
    )), label && /* @__PURE__ */ React22.createElement(
      "label",
      {
        htmlFor: props.id,
        className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)] cursor-pointer",
        onClick: handleToggle
      },
      label,
      required && /* @__PURE__ */ React22.createElement("span", { className: "text-[color:var(--color-error-500)] ml-1" }, "*")
    ));
  }
);
Checkbox.displayName = "Checkbox";

// src/components/ui/form-fields/DatePicker.tsx
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React23 from "react";
function formatDate(date, formatStr = "PPP") {
  if (!date) {
    return "";
  }
  return format(date, formatStr);
}
function isValidDate(date) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}
var ComponentIqDatePicker = ({
  value,
  onChange,
  variant = "single",
  placeholder = "Pick a date",
  disabled = false,
  className = "",
  minDate,
  maxDate,
  format: dateFormat = "PPP",
  displayFormat = "PPP",
  readOnly = false,
  calendarProps = {}
}) => {
  const [open, setOpen] = React23.useState(false);
  const [month, setMonth] = React23.useState(
    value.startDate || /* @__PURE__ */ new Date()
  );
  const [inputValue, setInputValue] = React23.useState(
    formatDate(value.startDate || void 0, displayFormat)
  );
  const handleSelect = (date) => {
    if (variant === "single") {
      const newValue = {
        startDate: date || null,
        endDate: null
      };
      onChange(newValue);
      setInputValue(formatDate(date, displayFormat));
      setOpen(false);
    } else {
      if (!value.startDate || value.startDate && value.endDate) {
        const newValue = {
          startDate: date || null,
          endDate: null
        };
        onChange(newValue);
        setInputValue(formatDate(date, displayFormat));
      } else {
        const startDate = value.startDate;
        const endDate = date || null;
        if (startDate && endDate && endDate < startDate) {
          const newValue = {
            startDate: endDate,
            endDate: startDate
          };
          onChange(newValue);
          setInputValue(
            `${formatDate(endDate || void 0, displayFormat)} - ${formatDate(startDate || void 0, displayFormat)}`
          );
        } else {
          const newValue = {
            startDate,
            endDate
          };
          onChange(newValue);
          setInputValue(
            `${formatDate(startDate || void 0, displayFormat)} - ${formatDate(endDate || void 0, displayFormat)}`
          );
        }
        setOpen(false);
      }
    }
  };
  const handleInputChange = (e) => {
    if (!open) {
      setOpen(true);
    }
    setInputValue(e.target.value);
    const date = new Date(e.target.value);
    if (isValidDate(date)) {
      handleSelect(date);
    }
  };
  const formatDisplayValue = () => {
    if (variant === "single") {
      return value.startDate ? formatDate(value.startDate, displayFormat) : placeholder;
    } else {
      if (value.startDate && value.endDate) {
        return `${formatDate(value.startDate, displayFormat)} - ${formatDate(
          value.endDate,
          displayFormat
        )}`;
      } else if (value.startDate) {
        return `${formatDate(value.startDate, displayFormat)} - ${placeholder}`;
      }
      return placeholder;
    }
  };
  return /* @__PURE__ */ React23.createElement("div", { className: cn("w-full", className) }, /* @__PURE__ */ React23.createElement("div", { className: "relative flex gap-2" }, /* @__PURE__ */ React23.createElement(
    Input,
    {
      value: inputValue,
      placeholder,
      className: "bg-background pr-10 w-full flex-1",
      disabled: disabled || readOnly,
      onChange: handleInputChange,
      onKeyDown: (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
        }
      }
    }
  ), /* @__PURE__ */ React23.createElement(Popover, { open, onOpenChange: setOpen }, /* @__PURE__ */ React23.createElement(PopoverTrigger, { asChild: true }, /* @__PURE__ */ React23.createElement(
    Button,
    {
      variant: "ghost",
      className: "absolute top-1/2 right-2 size-6 -translate-y-1/2",
      disabled: disabled || readOnly
    },
    /* @__PURE__ */ React23.createElement(CalendarIcon, { className: "size-3.5" }),
    /* @__PURE__ */ React23.createElement("span", { className: "sr-only" }, "Select date")
  )), /* @__PURE__ */ React23.createElement(
    PopoverContent,
    {
      className: "w-full overflow-hidden p-0 flex-1",
      align: "start"
    },
    /* @__PURE__ */ React23.createElement(
      Calendar,
      __spreadValues({
        mode: "single",
        selected: value.startDate || void 0,
        captionLayout: "dropdown",
        month,
        onMonthChange: setMonth,
        onSelect: handleSelect,
        disabled,
        fromDate: minDate,
        toDate: maxDate
      }, calendarProps)
    )
  ))));
};
var DatePicker_default = ComponentIqDatePicker;

// src/components/ui/form-fields/input.tsx
import { cva as cva8 } from "class-variance-authority";
import * as React24 from "react";
var inputVariants = cva8(
  "flex w-full font-rubik text-base font-normal leading-6 tracking-[0.15px] text-[color:var(--color-text-secondary)] max-h-14 h-auto px-2 py-2 rounded border border-[color:var(--color-border-default)] bg-transparent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-[color:var(--color-border-default)] focus:border-[color:var(--color-primary-500)]",
        outline: "border-[color:var(--color-border-default)] focus:border-[color:var(--color-primary-500)] bg-transparent",
        text: "border-transparent bg-transparent focus:border-transparent hover:bg-[color:var(--color-neutral-50)]",
        error: "border-[color:var(--color-error-500)] focus:border-[color:var(--color-error-500)]",
        success: "border-[color:var(--color-success-500)] focus:border-[color:var(--color-success-500)]"
      },
      size: {
        default: "h-10 px-3",
        sm: "h-8 px-2 text-sm",
        lg: "h-12 px-4 text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Input2 = React24.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      className,
      variant,
      size,
      error,
      success,
      startIcon,
      endIcon,
      onStartIconClick,
      onEndIconClick
    } = _b, props = __objRest(_b, [
      "className",
      "variant",
      "size",
      "error",
      "success",
      "startIcon",
      "endIcon",
      "onStartIconClick",
      "onEndIconClick"
    ]);
    let finalVariant = variant;
    if (error) finalVariant = "error";
    if (success) finalVariant = "success";
    return /* @__PURE__ */ React24.createElement("div", { className: "relative" }, /* @__PURE__ */ React24.createElement(
      "input",
      __spreadValues({
        className: cn(
          inputVariants({ variant: finalVariant, size, className }),
          startIcon && "pl-10",
          endIcon && "pr-10"
        ),
        ref
      }, props)
    ), startIcon && /* @__PURE__ */ React24.createElement(
      "div",
      {
        className: cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
          onStartIconClick && "cursor-pointer hover:text-foreground"
        ),
        onClick: onStartIconClick
      },
      startIcon
    ), endIcon && /* @__PURE__ */ React24.createElement(
      "div",
      {
        className: cn(
          "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
          onEndIconClick && "cursor-pointer hover:text-foreground"
        ),
        onClick: onEndIconClick
      },
      endIcon
    ));
  }
);
Input2.displayName = "Input";

// src/components/ui/form-fields/radio.tsx
import { cva as cva9 } from "class-variance-authority";
import * as React25 from "react";
var radioVariants = cva9(
  "peer h-4 w-4 shrink-0 rounded-full border border-[color:var(--color-border-default)] bg-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary",
  {
    variants: {
      variant: {
        default: "border-[color:var(--color-border-default)] data-[state=checked]:border-[color:var(--color-primary-500)] data-[state=checked]:bg-[color:var(--color-primary-500)]",
        error: "border-[color:var(--color-error-500)] data-[state=checked]:border-[color:var(--color-error-500)] data-[state=checked]:bg-[color:var(--color-error-500)]",
        success: "border-[color:var(--color-success-500)] data-[state=checked]:border-[color:var(--color-success-500)] data-[state=checked]:bg-[color:var(--color-success-500)]"
      },
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-5 w-5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Radio = React25.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      className,
      variant,
      size,
      error,
      success,
      label,
      required,
      checked,
      onChange
    } = _b, props = __objRest(_b, [
      "className",
      "variant",
      "size",
      "error",
      "success",
      "label",
      "required",
      "checked",
      "onChange"
    ]);
    let finalVariant = variant;
    if (error) finalVariant = "error";
    if (success) finalVariant = "success";
    const handleSelect = () => {
      if (onChange) {
        const event = {
          target: { checked: true }
        };
        onChange(event);
      }
    };
    return /* @__PURE__ */ React25.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React25.createElement("div", { className: "relative" }, /* @__PURE__ */ React25.createElement(
      "input",
      __spreadValues({
        type: "radio",
        className: cn(
          radioVariants({ variant: finalVariant, size, className }),
          "sr-only"
        ),
        ref,
        checked,
        onChange
      }, props)
    ), /* @__PURE__ */ React25.createElement(
      "div",
      {
        className: cn(
          radioVariants({ variant: finalVariant, size }),
          "flex items-center justify-center cursor-pointer hover:bg-primary-50/50 transition-colors"
        ),
        "data-state": checked ? "checked" : "unchecked",
        onClick: handleSelect,
        role: "radio",
        "aria-checked": checked,
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSelect();
          }
        }
      },
      checked && /* @__PURE__ */ React25.createElement("div", { className: "h-2 w-2 rounded-full bg-white" })
    )), label && /* @__PURE__ */ React25.createElement(
      "label",
      {
        htmlFor: props.id,
        className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)] cursor-pointer",
        onClick: handleSelect
      },
      label,
      required && /* @__PURE__ */ React25.createElement("span", { className: "text-[color:var(--color-error-500)] ml-1" }, "*")
    ));
  }
);
Radio.displayName = "Radio";

// src/components/ui/form-fields/textarea.tsx
import { cva as cva10 } from "class-variance-authority";
import * as React26 from "react";
var textareaVariants = cva10(
  "flex min-h-[80px] w-full font-rubik text-base font-normal leading-6 tracking-[0.15px] text-[color:var(--color-text-secondary)] rounded border border-[color:var(--color-border-default)] bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
  {
    variants: {
      variant: {
        default: "border-[color:var(--color-border-default)] focus:border-[color:var(--color-primary-500)]",
        error: "border-[color:var(--color-error-500)] focus:border-[color:var(--color-error-500)]",
        success: "border-[color:var(--color-success-500)] focus:border-[color:var(--color-success-500)]"
      },
      size: {
        default: "min-h-[80px] px-3 py-2",
        sm: "min-h-[60px] px-2 py-1 text-sm",
        lg: "min-h-[100px] px-4 py-3 text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Textarea = React26.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      className,
      variant,
      size,
      error,
      success,
      autoGrow = false,
      startIcon,
      endIcon,
      onStartIconClick,
      onEndIconClick
    } = _b, props = __objRest(_b, [
      "className",
      "variant",
      "size",
      "error",
      "success",
      "autoGrow",
      "startIcon",
      "endIcon",
      "onStartIconClick",
      "onEndIconClick"
    ]);
    const textareaRef = React26.useRef(null);
    let finalVariant = variant;
    if (error) finalVariant = "error";
    if (success) finalVariant = "success";
    React26.useEffect(() => {
      if (autoGrow && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [props.value, autoGrow]);
    const handleChange = (e) => {
      var _a2;
      if (autoGrow && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
      (_a2 = props.onChange) == null ? void 0 : _a2.call(props, e);
    };
    return /* @__PURE__ */ React26.createElement("div", { className: "relative" }, /* @__PURE__ */ React26.createElement(
      "textarea",
      __spreadValues({
        className: cn(
          textareaVariants({ variant: finalVariant, size, className }),
          startIcon && "pl-10",
          endIcon && "pr-10"
        ),
        ref: (node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          textareaRef.current = node;
        },
        onChange: handleChange
      }, props)
    ), startIcon && /* @__PURE__ */ React26.createElement(
      "div",
      {
        className: cn(
          "absolute left-3 top-3 text-muted-foreground",
          onStartIconClick && "cursor-pointer hover:text-foreground"
        ),
        onClick: onStartIconClick
      },
      startIcon
    ), endIcon && /* @__PURE__ */ React26.createElement(
      "div",
      {
        className: cn(
          "absolute right-3 top-3 text-muted-foreground",
          onEndIconClick && "cursor-pointer hover:text-foreground"
        ),
        onClick: onEndIconClick
      },
      endIcon
    ));
  }
);
Textarea.displayName = "Textarea";

// src/components/ui/dataTable/enhanced-data-table.tsx
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Edit,
  Eye,
  MoreHorizontal as MoreHorizontal2,
  Search,
  Trash2
} from "lucide-react";
import * as React27 from "react";

// src/hooks/useTable.ts
import { useState as useState4 } from "react";
function useTableState() {
  const [sorting, setSorting] = useState4([]);
  const [columnFilters, setColumnFilters] = useState4([]);
  const [columnVisibility, setColumnVisibility] = useState4({});
  const [rowSelection, setRowSelection] = useState4({});
  const [globalFilter, setGlobalFilter] = useState4("");
  const [pagination, setPagination] = useState4({
    pageIndex: 0,
    pageSize: 10
  });
  return {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination
  };
}

// src/styles/components/table/table.tsx
var variantClasses = {
  default: "border border-border",
  bordered: "border-2 border-border",
  striped: "[&_tr:nth-child(even)]:bg-muted/30",
  compact: "text-sm"
};
var sizeClasses = {
  sm: "[&_td]:p-2 [&_th]:p-2",
  default: "[&_td]:p-4 [&_th]:p-4",
  lg: "[&_td]:p-6 [&_th]:p-6"
};

// src/components/ui/dataTable/Tablecell.tsx
function TableCell({
  content,
  subContent,
  icon,
  variant = "default",
  status = "neutral",
  align = "left",
  className
}) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };
  if (variant === "badge") {
    return /* @__PURE__ */ React.createElement("div", { className: cn(alignClasses[align], className) }, /* @__PURE__ */ React.createElement(Badge, { status, variant: "filled", size: "sm" }, content));
  }
  if (variant === "status") {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: cn(
          "flex items-center gap-2",
          alignClasses[align],
          className
        )
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: cn("h-2 w-2 rounded-full", {
            "bg-success": status === "success",
            "bg-warning": status === "pending",
            "bg-error": status === "error",
            "bg-info": status === "completed",
            "bg-muted": status === "neutral"
          })
        }
      ),
      /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium" }, content)
    );
  }
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn("flex items-center gap-2", alignClasses[align], className)
    },
    icon && /* @__PURE__ */ React.createElement("div", { className: "flex-shrink-0" }, icon),
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React.createElement(Typography, { variant: "body1" }, content), subContent && /* @__PURE__ */ React.createElement(Typography, { variant: "body2", className: "text-neutral-500" }, subContent))
  );
}

// src/components/ui/dataTable/enhanced-data-table.tsx
function EnhancedDataTable({
  columns,
  data,
  title,
  variant = "default",
  size = "default",
  enableSearch = true,
  enableSorting = true,
  enableRowSelection = false,
  enablePagination = true,
  enableRowNumbers = false,
  enableActions = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No data available",
  loading = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  onRowClick,
  onRowSelectionChange,
  renderRowActions,
  className
}) {
  var _a;
  const {
    pagination,
    setPagination,
    setSorting,
    sorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setGlobalFilter,
    globalFilter,
    setRowSelection
  } = useTableState();
  const columnsWithRowNumbers = React27.useMemo(() => {
    if (!enableRowNumbers) return columns;
    const rowNumberColumn = {
      id: "rowNumber",
      header: "#",
      cell: ({ row }) => /* @__PURE__ */ React27.createElement(
        TableCell,
        {
          content: row.index + 1 + pagination.pageIndex * pagination.pageSize,
          variant: "default",
          align: "center"
        }
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 60
    };
    return [rowNumberColumn, ...columns];
  }, [columns, enableRowNumbers, pagination.pageIndex, pagination.pageSize]);
  const columnsWithActions = React27.useMemo(() => {
    if (!enableActions) return columnsWithRowNumbers;
    const actionsColumn = {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowData = row.original;
        return /* @__PURE__ */ React27.createElement("div", { className: "flex items-center gap-2" }, renderRowActions ? renderRowActions(rowData) : /* @__PURE__ */ React27.createElement(DropdownMenu, null, /* @__PURE__ */ React27.createElement(DropdownMenuTrigger, { asChild: true }, /* @__PURE__ */ React27.createElement(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0" }, /* @__PURE__ */ React27.createElement(MoreHorizontal2, { className: "h-4 w-4" }))), /* @__PURE__ */ React27.createElement(DropdownMenuContent, { align: "end" }, /* @__PURE__ */ React27.createElement(DropdownMenuItem, null, /* @__PURE__ */ React27.createElement(Eye, { className: "mr-2 h-4 w-4" }), "View"), /* @__PURE__ */ React27.createElement(DropdownMenuItem, null, /* @__PURE__ */ React27.createElement(Edit, { className: "mr-2 h-4 w-4" }), "Edit"), /* @__PURE__ */ React27.createElement(DropdownMenuSeparator, null), /* @__PURE__ */ React27.createElement(DropdownMenuItem, { className: "text-error" }, /* @__PURE__ */ React27.createElement(Trash2, { className: "mr-2 h-4 w-4" }), "Delete"))));
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 100
    };
    return [...columnsWithRowNumbers, actionsColumn];
  }, [columnsWithRowNumbers, enableActions, renderRowActions]);
  const table = useReactTable({
    data,
    columns: columnsWithActions,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination
    },
    enableSorting,
    enableRowSelection,
    enableGlobalFilter: true
  });
  React27.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, onRowSelectionChange, table]);
  return /* @__PURE__ */ React27.createElement("div", { className: cn("w-full space-y-4", className) }, enableSearch && /* @__PURE__ */ React27.createElement(Card, null, /* @__PURE__ */ React27.createElement(CardHeader, { className: "pb-3" }, /* @__PURE__ */ React27.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React27.createElement("div", { className: "flex items-center gap-4" }, title && /* @__PURE__ */ React27.createElement(CardTitle, { className: "text-lg font-semibold" }, title)), /* @__PURE__ */ React27.createElement("div", { className: "flex items-center gap-2" }, enableSearch && /* @__PURE__ */ React27.createElement("div", { className: "relative" }, /* @__PURE__ */ React27.createElement(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ React27.createElement(
    Input,
    {
      placeholder: searchPlaceholder,
      value: globalFilter != null ? globalFilter : "",
      onChange: (event) => setGlobalFilter(event.target.value),
      className: "pl-9 w-[300px]"
    }
  )))))), /* @__PURE__ */ React27.createElement(Card, { className: cn(variantClasses[variant], sizeClasses[size]) }, /* @__PURE__ */ React27.createElement(CardContent, { className: "p-0" }, /* @__PURE__ */ React27.createElement("div", { className: "rounded-md border" }, /* @__PURE__ */ React27.createElement("table", { className: "w-full caption-bottom text-sm" }, /* @__PURE__ */ React27.createElement("thead", { className: "border-b bg-muted/50" }, table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ React27.createElement("tr", { key: headerGroup.id }, headerGroup.headers.map((header) => /* @__PURE__ */ React27.createElement(
    "th",
    {
      key: header.id,
      className: cn(
        "h-12 px-4 text-left align-middle font-medium text-neutral-900 ",
        header.column.getCanSort() && "cursor-pointer select-none"
      ),
      style: { width: header.getSize() }
    },
    header.isPlaceholder ? null : /* @__PURE__ */ React27.createElement(
      "div",
      {
        className: cn(
          "flex items-center gap-2",
          header.column.getCanSort() && "hover:text-foreground"
        ),
        onClick: header.column.getToggleSortingHandler()
      },
      flexRender(
        header.column.columnDef.header,
        header.getContext()
      ),
      header.column.getCanSort() && /* @__PURE__ */ React27.createElement(ArrowUpDown, { className: "h-4 w-4" })
    )
  ))))), /* @__PURE__ */ React27.createElement("tbody", null, ((_a = table.getRowModel().rows) == null ? void 0 : _a.length) ? table.getRowModel().rows.map((row) => /* @__PURE__ */ React27.createElement(
    "tr",
    {
      key: row.id,
      className: cn(
        "border-b transition-colors hover:bg-muted/50",
        onRowClick && "cursor-pointer"
      ),
      onClick: () => onRowClick == null ? void 0 : onRowClick(row.original)
    },
    row.getVisibleCells().map((cell) => /* @__PURE__ */ React27.createElement(
      "td",
      {
        key: cell.id,
        className: "p-4 align-middle",
        style: { width: cell.column.getSize() }
      },
      flexRender(
        cell.column.columnDef.cell,
        cell.getContext()
      )
    ))
  )) : /* @__PURE__ */ React27.createElement("tr", null, /* @__PURE__ */ React27.createElement(
    "td",
    {
      colSpan: columnsWithActions.length,
      className: "h-24 text-center"
    },
    /* @__PURE__ */ React27.createElement("div", { className: "flex flex-col items-center justify-center gap-2" }, /* @__PURE__ */ React27.createElement(
      Typography,
      {
        variant: "body1",
        className: "text-muted-foreground"
      },
      loading ? "Loading..." : emptyMessage
    ))
  ))))))), enablePagination && /* @__PURE__ */ React27.createElement(
    DataTablePagination,
    {
      currentPage: table.getState().pagination.pageIndex + 1,
      totalPages: table.getPageCount(),
      pageSize: table.getState().pagination.pageSize,
      totalItems: table.getFilteredRowModel().rows.length,
      pageSizeOptions,
      onPageChange: (page) => table.setPageIndex(page - 1),
      onPageSizeChange: (newPageSize) => table.setPageSize(newPageSize)
    }
  ));
}

// src/components/form/rhf-autocomplete.tsx
import * as React28 from "react";
import { Controller, useFormContext } from "react-hook-form";
var RHFAutocomplete = React28.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      name,
      label,
      formError,
      disabled,
      required,
      className,
      options,
      placeholder,
      multiple = false
    } = _b, props = __objRest(_b, [
      "name",
      "label",
      "formError",
      "disabled",
      "required",
      "className",
      "options",
      "placeholder",
      "multiple"
    ]);
    var _a2;
    const formContext = useFormContext();
    if (!formContext) {
      console.warn(
        `RHFAutocomplete "${name}" is not wrapped in a FormProvider. Please wrap your form with FormProvider from react-hook-form.`
      );
      return /* @__PURE__ */ React28.createElement("div", { className: cn("space-y-2", className) }, label && /* @__PURE__ */ React28.createElement(
        "label",
        {
          htmlFor: name,
          className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)]"
        },
        label,
        required && /* @__PURE__ */ React28.createElement("span", { className: "text-[color:var(--color-error-500)] ml-1" }, "*")
      ), /* @__PURE__ */ React28.createElement(
        Autocomplete,
        __spreadProps(__spreadValues({}, props), {
          ref,
          id: name,
          error: !!formError,
          disabled,
          options,
          placeholder,
          multiple,
          value: props.value || ""
        })
      ), formError && /* @__PURE__ */ React28.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, formError));
    }
    const { control, formState } = formContext;
    const fieldError = (_a2 = formState.errors[name]) == null ? void 0 : _a2.message;
    const hasError = !!fieldError || !!formError;
    return /* @__PURE__ */ React28.createElement("div", { className: cn("space-y-2", className) }, label && /* @__PURE__ */ React28.createElement(
      "label",
      {
        htmlFor: name,
        className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)]"
      },
      label,
      required && /* @__PURE__ */ React28.createElement("span", { className: "text-[color:var(--color-error-500)] ml-1" }, "*")
    ), /* @__PURE__ */ React28.createElement(
      Controller,
      {
        name,
        control,
        render: ({ field }) => /* @__PURE__ */ React28.createElement(
          Autocomplete,
          __spreadProps(__spreadValues({}, props), {
            ref,
            id: name,
            error: hasError,
            disabled,
            options,
            placeholder,
            multiple,
            value: field.value || "",
            onChange: (value) => field.onChange(value),
            onSelect: (option) => field.onChange(option.value)
          })
        )
      }
    ), (fieldError || formError) && /* @__PURE__ */ React28.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, fieldError || formError));
  }
);
RHFAutocomplete.displayName = "RHFAutocomplete";

// src/components/form/rhf-checkbox.tsx
import * as React29 from "react";
import { Controller as Controller2, useFormContext as useFormContext2 } from "react-hook-form";
var RHFCheckbox = React29.forwardRef(
  (_a, ref) => {
    var _b = _a, { name, label, formError, disabled, required, className } = _b, props = __objRest(_b, ["name", "label", "formError", "disabled", "required", "className"]);
    var _a2;
    const formContext = useFormContext2();
    if (!formContext) {
      console.warn(
        `RHFCheckbox "${name}" is not wrapped in a FormProvider. Please wrap your form with FormProvider from react-hook-form.`
      );
      return /* @__PURE__ */ React29.createElement("div", { className: cn("space-y-2", className) }, /* @__PURE__ */ React29.createElement(
        Checkbox,
        __spreadProps(__spreadValues({}, props), {
          ref,
          id: name,
          label,
          required,
          error: !!formError,
          disabled
        })
      ), formError && /* @__PURE__ */ React29.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, formError));
    }
    const { control, formState } = formContext;
    const fieldError = (_a2 = formState.errors[name]) == null ? void 0 : _a2.message;
    const hasError = !!fieldError || !!formError;
    return /* @__PURE__ */ React29.createElement("div", { className: cn("space-y-2", className) }, /* @__PURE__ */ React29.createElement(
      Controller2,
      {
        name,
        control,
        render: ({ field }) => /* @__PURE__ */ React29.createElement(
          Checkbox,
          __spreadProps(__spreadValues({}, props), {
            ref,
            id: name,
            label,
            required,
            error: hasError,
            disabled,
            checked: field.value,
            onChange: field.onChange
          })
        )
      }
    ), (fieldError || formError) && /* @__PURE__ */ React29.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, fieldError || formError));
  }
);
RHFCheckbox.displayName = "RHFCheckbox";

// src/components/form/rhf-datepicker.tsx
import React30 from "react";
import { Controller as Controller3, useFormContext as useFormContext3 } from "react-hook-form";
var RHFDDatePicker = ({
  name,
  label,
  required = false,
  helperText,
  error,
  variant = "single",
  placeholder,
  disabled,
  className = "",
  minDate,
  maxDate,
  format: format2 = "PPP",
  displayFormat = "PPP",
  readOnly = false,
  calendarProps = {}
}) => {
  const {
    control,
    formState: { errors }
  } = useFormContext3();
  const fieldError = errors[name];
  return /* @__PURE__ */ React30.createElement("div", { className: `space-y-2 ${className}` }, label && /* @__PURE__ */ React30.createElement(Typography, { variant: "body2", className: "font-medium" }, label, required && /* @__PURE__ */ React30.createElement("span", { className: "text-red-500 ml-1" }, "*")), /* @__PURE__ */ React30.createElement(
    Controller3,
    {
      name,
      control,
      render: ({ field }) => /* @__PURE__ */ React30.createElement(
        DatePicker_default,
        {
          value: field.value || { startDate: null, endDate: null },
          onChange: (value) => field.onChange(value),
          variant,
          placeholder,
          disabled,
          minDate,
          maxDate,
          format: format2,
          displayFormat,
          readOnly,
          calendarProps
        }
      )
    }
  ), (fieldError || helperText) && /* @__PURE__ */ React30.createElement(
    Typography,
    {
      variant: "caption",
      className: fieldError ? "text-red-500" : "text-gray-500"
    },
    (fieldError == null ? void 0 : fieldError.message) || helperText
  ));
};

// src/components/form/rhf-input.tsx
import * as React31 from "react";
import { Controller as Controller4, useFormContext as useFormContext4 } from "react-hook-form";
var RHFInput = React31.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      name,
      label,
      formError,
      disabled,
      required,
      className,
      startIcon,
      endIcon,
      onStartIconClick,
      onEndIconClick
    } = _b, props = __objRest(_b, [
      "name",
      "label",
      "formError",
      "disabled",
      "required",
      "className",
      "startIcon",
      "endIcon",
      "onStartIconClick",
      "onEndIconClick"
    ]);
    var _a2;
    const formContext = useFormContext4();
    if (!formContext) {
      console.warn(
        `RHFInput "${name}" is not wrapped in a FormProvider. Please wrap your form with FormProvider from react-hook-form.`
      );
      return /* @__PURE__ */ React31.createElement("div", { className: cn("space-y-2", className) }, label && /* @__PURE__ */ React31.createElement(
        "label",
        {
          htmlFor: name,
          className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)]"
        },
        label,
        required && /* @__PURE__ */ React31.createElement("span", { className: "text-[color:var(--color-error-500)] ml-1" }, "*")
      ), /* @__PURE__ */ React31.createElement(
        Input2,
        __spreadProps(__spreadValues({}, props), {
          ref,
          id: name,
          error: !!formError,
          disabled,
          startIcon,
          endIcon,
          onStartIconClick,
          onEndIconClick
        })
      ), formError && /* @__PURE__ */ React31.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, formError));
    }
    const { control, formState } = formContext;
    const fieldError = (_a2 = formState.errors[name]) == null ? void 0 : _a2.message;
    const hasError = !!fieldError || !!formError;
    return /* @__PURE__ */ React31.createElement("div", { className: cn("space-y-2", className) }, label && /* @__PURE__ */ React31.createElement(
      "label",
      {
        htmlFor: name,
        className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)]"
      },
      label,
      required && /* @__PURE__ */ React31.createElement("span", { className: "text-[color:var(--color-error-500)] ml-1" }, "*")
    ), /* @__PURE__ */ React31.createElement(
      Controller4,
      {
        name,
        control,
        render: ({ field }) => /* @__PURE__ */ React31.createElement(
          Input2,
          __spreadProps(__spreadValues(__spreadValues({}, field), props), {
            ref,
            id: name,
            error: hasError,
            disabled,
            startIcon,
            endIcon,
            onStartIconClick,
            onEndIconClick
          })
        )
      }
    ), (fieldError || formError) && /* @__PURE__ */ React31.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, fieldError || formError));
  }
);
RHFInput.displayName = "RHFInput";

// src/components/form/rhf-radio.tsx
import * as React32 from "react";
import { Controller as Controller5, useFormContext as useFormContext5 } from "react-hook-form";
var RHFRadio = React32.forwardRef(
  (_a, ref) => {
    var _b = _a, { name, label, formError, disabled, required, className, value } = _b, props = __objRest(_b, ["name", "label", "formError", "disabled", "required", "className", "value"]);
    var _a2;
    const formContext = useFormContext5();
    if (!formContext) {
      console.warn(
        `RHFRadio "${name}" is not wrapped in a FormProvider. Please wrap your form with FormProvider from react-hook-form.`
      );
      return /* @__PURE__ */ React32.createElement("div", { className: cn("space-y-2", className) }, /* @__PURE__ */ React32.createElement(
        Radio,
        __spreadProps(__spreadValues({}, props), {
          ref,
          id: name,
          name,
          value,
          label,
          required,
          error: !!formError,
          disabled
        })
      ), formError && /* @__PURE__ */ React32.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, formError));
    }
    const { control, formState } = formContext;
    const fieldError = (_a2 = formState.errors[name]) == null ? void 0 : _a2.message;
    const hasError = !!fieldError || !!formError;
    return /* @__PURE__ */ React32.createElement("div", { className: cn("space-y-2", className) }, /* @__PURE__ */ React32.createElement(
      Controller5,
      {
        name,
        control,
        render: ({ field }) => /* @__PURE__ */ React32.createElement(
          Radio,
          __spreadProps(__spreadValues({}, props), {
            ref,
            id: name,
            value,
            label,
            required,
            error: hasError,
            disabled,
            checked: field.value === value,
            onChange: field.onChange
          })
        )
      }
    ), (fieldError || formError) && /* @__PURE__ */ React32.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, fieldError || formError));
  }
);
RHFRadio.displayName = "RHFRadio";

// src/components/form/rhf-select.tsx
import * as React33 from "react";
import { Controller as Controller6, useFormContext as useFormContext6 } from "react-hook-form";
var RHFSelect = React33.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      name,
      label,
      formError,
      disabled,
      required,
      className,
      options,
      placeholder
    } = _b, props = __objRest(_b, [
      "name",
      "label",
      "formError",
      "disabled",
      "required",
      "className",
      "options",
      "placeholder"
    ]);
    var _a2;
    const formContext = useFormContext6();
    if (!formContext) {
      console.warn(
        `RHFSelect "${name}" is not wrapped in a FormProvider. Please wrap your form with FormProvider from react-hook-form.`
      );
      return /* @__PURE__ */ React33.createElement("div", { className: cn("space-y-2", className) }, label && /* @__PURE__ */ React33.createElement(
        "label",
        {
          htmlFor: name,
          className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)]"
        },
        label,
        required && /* @__PURE__ */ React33.createElement("span", { className: "text-[color:var(--color-error-500)] ml-1" }, "*")
      ), /* @__PURE__ */ React33.createElement(
        Select,
        __spreadProps(__spreadValues({}, props), {
          ref,
          id: name,
          error: !!formError,
          disabled,
          placeholder
        }),
        options.map((option) => /* @__PURE__ */ React33.createElement("option", { key: option.value, value: option.value }, option.label))
      ), formError && /* @__PURE__ */ React33.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, formError));
    }
    const { control, formState } = formContext;
    const fieldError = (_a2 = formState.errors[name]) == null ? void 0 : _a2.message;
    const hasError = !!fieldError || !!formError;
    return /* @__PURE__ */ React33.createElement("div", { className: cn("space-y-2", className) }, label && /* @__PURE__ */ React33.createElement(
      "label",
      {
        htmlFor: name,
        className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)]"
      },
      label,
      required && /* @__PURE__ */ React33.createElement("span", { className: "text-[color:var(--color-error-500)] ml-1" }, "*")
    ), /* @__PURE__ */ React33.createElement(
      Controller6,
      {
        name,
        control,
        render: ({ field }) => /* @__PURE__ */ React33.createElement(
          Select,
          __spreadProps(__spreadValues(__spreadValues({}, field), props), {
            ref,
            id: name,
            error: hasError,
            disabled,
            placeholder
          }),
          options.map((option) => /* @__PURE__ */ React33.createElement("option", { key: option.value, value: option.value }, option.label))
        )
      }
    ), (fieldError || formError) && /* @__PURE__ */ React33.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, fieldError || formError));
  }
);
RHFSelect.displayName = "RHFSelect";

// src/components/form/rhf-textarea.tsx
import * as React34 from "react";
import { Controller as Controller7, useFormContext as useFormContext7 } from "react-hook-form";
var RHFTextarea = React34.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      name,
      label,
      formError,
      disabled,
      required,
      className,
      startIcon,
      endIcon,
      onStartIconClick,
      onEndIconClick,
      autoGrow
    } = _b, props = __objRest(_b, [
      "name",
      "label",
      "formError",
      "disabled",
      "required",
      "className",
      "startIcon",
      "endIcon",
      "onStartIconClick",
      "onEndIconClick",
      "autoGrow"
    ]);
    var _a2;
    const formContext = useFormContext7();
    if (!formContext) {
      console.warn(
        `RHFTextarea "${name}" is not wrapped in a FormProvider. Please wrap your form with FormProvider from react-hook-form.`
      );
      return /* @__PURE__ */ React34.createElement("div", { className: cn("space-y-2", className) }, label && /* @__PURE__ */ React34.createElement(
        "label",
        {
          htmlFor: name,
          className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)]"
        },
        label,
        required && /* @__PURE__ */ React34.createElement("span", { className: "text-[color:var(--color-error-500)] ml-1" }, "*")
      ), /* @__PURE__ */ React34.createElement(
        Textarea,
        __spreadProps(__spreadValues({}, props), {
          ref,
          id: name,
          error: !!formError,
          disabled,
          startIcon,
          endIcon,
          onStartIconClick,
          onEndIconClick,
          autoGrow
        })
      ), formError && /* @__PURE__ */ React34.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, formError));
    }
    const { control, formState } = formContext;
    const fieldError = (_a2 = formState.errors[name]) == null ? void 0 : _a2.message;
    const hasError = !!fieldError || !!formError;
    return /* @__PURE__ */ React34.createElement("div", { className: cn("space-y-2", className) }, label && /* @__PURE__ */ React34.createElement(
      "label",
      {
        htmlFor: name,
        className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)]"
      },
      label,
      required && /* @__PURE__ */ React34.createElement("span", { className: "text-[color:var(--color-error-500)] ml-1" }, "*")
    ), /* @__PURE__ */ React34.createElement(
      Controller7,
      {
        name,
        control,
        render: ({ field }) => /* @__PURE__ */ React34.createElement(
          Textarea,
          __spreadProps(__spreadValues(__spreadValues({}, field), props), {
            ref,
            id: name,
            error: hasError,
            disabled,
            startIcon,
            endIcon,
            onStartIconClick,
            onEndIconClick,
            autoGrow
          })
        )
      }
    ), (fieldError || formError) && /* @__PURE__ */ React34.createElement("p", { className: "text-sm text-[color:var(--color-error-500)]" }, fieldError || formError));
  }
);
RHFTextarea.displayName = "RHFTextarea";

// src/components/layout/branding-component.tsx
import { Shield } from "lucide-react";
import React35 from "react";
var BrandingComponent = ({
  data,
  className,
  onLogoClick
}) => {
  const renderLogo = () => {
    if (!data.logo) {
      return /* @__PURE__ */ React35.createElement(Shield, { className: "h-8 w-8 text-primary" });
    }
    if (typeof data.logo === "function") {
      const LogoComponent2 = data.logo;
      return /* @__PURE__ */ React35.createElement(LogoComponent2, null);
    }
    if (React35.isValidElement(data.logo)) {
      return data.logo;
    }
    const LogoComponent = data.logo;
    return /* @__PURE__ */ React35.createElement(LogoComponent, { className: "h-[56px] w-[56px] object-contain" });
  };
  return /* @__PURE__ */ React35.createElement(
    "div",
    {
      className: cn(
        "flex items-center justify-between p-4 border-none",
        className
      )
    },
    /* @__PURE__ */ React35.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React35.createElement(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: onLogoClick,
        className: "p-0 h-auto min-w-0"
      },
      renderLogo()
    ), /* @__PURE__ */ React35.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React35.createElement(Typography, { variant: "body2", className: "text-neutral-600" }, data.title), data.subtitle && /* @__PURE__ */ React35.createElement(Typography, { variant: "body2", className: "text-neutral-500" }, data.subtitle)))
  );
};
var BrandingComponentSkeleton = ({
  className
}) => {
  return /* @__PURE__ */ React35.createElement(
    "div",
    {
      className: cn(
        "flex items-center justify-between p-4 border-none",
        className
      )
    },
    /* @__PURE__ */ React35.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React35.createElement(Skeleton, { className: "h-8 w-8 rounded" }), /* @__PURE__ */ React35.createElement("div", { className: "flex flex-col space-y-1" }, /* @__PURE__ */ React35.createElement(Skeleton, { className: "h-5 w-32" }), /* @__PURE__ */ React35.createElement(Skeleton, { className: "h-4 w-24" }))),
    /* @__PURE__ */ React35.createElement("div", { className: "flex items-center space-x-3" }, /* @__PURE__ */ React35.createElement(Skeleton, { className: "h-8 w-8 rounded-full" }), /* @__PURE__ */ React35.createElement("div", { className: "hidden sm:flex flex-col space-y-1" }, /* @__PURE__ */ React35.createElement(Skeleton, { className: "h-4 w-20" }), /* @__PURE__ */ React35.createElement(Skeleton, { className: "h-3 w-16" })))
  );
};
var branding_component_default = BrandingComponent;

// src/components/layout/dashboard-layout.tsx
import React41, { useCallback as useCallback3, useMemo as useMemo5, useState as useState6 } from "react";

// src/components/layout/sidebar/SidebarComponent.tsx
import React40, { useCallback as useCallback2, useState as useState5 } from "react";

// src/components/layout/sidebar/SidebarHeader.tsx
import React36 from "react";
function SidebarHeaderComponent({
  isCollapsed,
  branding,
  onToggle
}) {
  return /* @__PURE__ */ React36.createElement(SidebarHeader, { className: "border-none" }, /* @__PURE__ */ React36.createElement(
    "div",
    {
      className: cn(
        "flex items-center",
        isCollapsed ? "justify-center" : "justify-between"
      )
    },
    !isCollapsed && /* @__PURE__ */ React36.createElement("div", { className: "flex items-center space-x-2" }, branding.logo)
  ));
}

// src/components/layout/sidebar/SidebarContent.tsx
import React37 from "react";
function SidebarContentComponent({
  navigation,
  renderNavigationItem
}) {
  console.log("SidebarContentComponent navigation:", navigation);
  return /* @__PURE__ */ React37.createElement(SidebarContent, { className: "border-none px-3 py-2" }, /* @__PURE__ */ React37.createElement(ScrollArea, { className: "h-full px-3 py-4" }, /* @__PURE__ */ React37.createElement("div", { className: "space-y-2" }, (navigation == null ? void 0 : navigation.length) === 0 ? /* @__PURE__ */ React37.createElement("div", { className: "text-sm text-gray-500" }, "No navigation items") : navigation == null ? void 0 : navigation.map((item) => /* @__PURE__ */ React37.createElement(
    "div",
    {
      key: item.id,
      className: "w-full h-10 px-3 flex items-center gap-3 rounded hover:bg-primary/10 cursor-pointer"
    },
    renderNavigationItem(item)
  )))));
}

// src/components/layout/sidebar/SidebarNavItem.tsx
import * as React38 from "react";
import { ChevronDown as ChevronDown3 } from "lucide-react";
var SidebarNavItem = React38.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      icon,
      title,
      active,
      disabled,
      level = 0,
      expandable,
      expanded,
      className,
      children
    } = _b, props = __objRest(_b, [
      "icon",
      "title",
      "active",
      "disabled",
      "level",
      "expandable",
      "expanded",
      "className",
      "children"
    ]);
    const levelPadding = `pl-${level * 4}`;
    return /* @__PURE__ */ React38.createElement(
      "li",
      __spreadValues({
        ref,
        className: cn(
          "group flex w-full items-center rounded px-2 py-1 transition-colors",
          disabled && "opacity-50 pointer-events-none",
          active ? "bg-background-hover" : "hover:bg-background-hover",
          className,
          levelPadding
        )
      }, props),
      /* @__PURE__ */ React38.createElement("div", { className: "flex items-center gap-3 flex-grow min-w-0" }, icon && /* @__PURE__ */ React38.createElement("span", { className: "h-4 w-4 shrink-0" }, icon), /* @__PURE__ */ React38.createElement(Typography, { variant: "body1", className: "truncate" }, title)),
      /* @__PURE__ */ React38.createElement("div", { className: "ml-2 h-4 w-4 flex items-center justify-center" }, expandable && /* @__PURE__ */ React38.createElement(
        ChevronDown3,
        {
          className: cn("h-4 w-4 ", expanded ? "rotate-180" : "rotate-0")
        }
      )),
      children
    );
  }
);
SidebarNavItem.displayName = "SidebarNavItem";

// src/components/layout/sidebar/RenderNavigationItem.tsx
var RenderNavigationItem = ({
  item,
  level = 0,
  handleItemClick,
  isCollapsed,
  activeItem,
  expandedItems
}) => {
  const isActive = activeItem === item.id;
  const isExpanded = expandedItems.has(item.id);
  const hasChildren = item.children && item.children.length > 0;
  console.log("sidebarIttem", item);
  return /* @__PURE__ */ React.createElement("div", { key: item.id, className: "w-full flex flex-col gap-1 " }, /* @__PURE__ */ React.createElement("div", { className: "" }, /* @__PURE__ */ React.createElement(
    SidebarNavItem,
    {
      icon: item.icon,
      title: item.title,
      active: isActive,
      disabled: item.disabled,
      level,
      expandable: hasChildren,
      expanded: isExpanded,
      onClick: () => !item.disabled && handleItemClick(item)
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "" }, hasChildren && isExpanded && !isCollapsed && /* @__PURE__ */ React.createElement("ul", { className: "ml-2 space-y-1" }, item.children.map((child) => /* @__PURE__ */ React.createElement(
    RenderNavigationItem,
    {
      key: child.id,
      item: child,
      level: level + 1,
      handleItemClick,
      isCollapsed,
      activeItem,
      expandedItems
    }
  )))));
};

// src/components/layout/sidebar/SidebarFooter.tsx
import React39 from "react";
function SidebarFooterComponent({
  sidebarFooter
}) {
  return /* @__PURE__ */ React39.createElement(SidebarFooter, { className: "border-none px-3 py-2" }, /* @__PURE__ */ React39.createElement("ul", { className: "w-full space-y-1" }, sidebarFooter.map((item) => /* @__PURE__ */ React39.createElement(
    SidebarNavItem,
    {
      key: item.id,
      title: item.title,
      icon: item.icon,
      disabled: item.disabled,
      onClick: item.onClick,
      className: "h-10"
    }
  ))));
}

// src/components/layout/sidebar/SidebarComponent.tsx
var SidebarComponent = ({
  navigation,
  sidebarFooter,
  branding,
  isCollapsed,
  onToggle,
  onNavigationChange
}) => {
  const [activeItem, setActiveItem] = useState5("");
  const [expandedItems, setExpandedItems] = useState5(/* @__PURE__ */ new Set());
  console.log(navigation, "navigation in SidebarComponent");
  const handleItemClick = useCallback2(
    (item) => {
      if (item.children) {
        setExpandedItems((prev) => {
          const newSet = new Set(prev);
          newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id);
          return newSet;
        });
      } else if (item.href) {
        setActiveItem(item.id);
        onNavigationChange == null ? void 0 : onNavigationChange(item);
      }
    },
    [onNavigationChange]
  );
  return /* @__PURE__ */ React40.createElement(Sidebar, { className: cn("w-[256px]", "flex flex-col h-full border-none") }, /* @__PURE__ */ React40.createElement(
    SidebarHeaderComponent,
    {
      branding,
      isCollapsed,
      onToggle
    }
  ), /* @__PURE__ */ React40.createElement(
    SidebarContentComponent,
    {
      navigation,
      renderNavigationItem: (item, level = 0) => RenderNavigationItem({
        item,
        level,
        handleItemClick,
        isCollapsed,
        activeItem,
        expandedItems
      }),
      isCollapsed,
      activeItem,
      expandedItems,
      handleItemClick
    }
  ), Array.isArray(sidebarFooter) && sidebarFooter.length > 0 && /* @__PURE__ */ React40.createElement(
    SidebarFooterComponent,
    {
      sidebarFooter,
      isCollapsed
    }
  ));
};
var SidebarComponent_default = SidebarComponent;

// src/components/layout/topnav/TopNav.tsx
import { Bell, Menu, Search as Search2, User } from "lucide-react";
var TopNav = ({
  onMenuToggle,
  showMenuButton = true
}) => {
  return /* @__PURE__ */ React.createElement("header", { className: "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-none" }, /* @__PURE__ */ React.createElement("div", { className: "container flex h-14 items-center" }, showMenuButton && /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "ghost",
      size: "sm",
      onClick: onMenuToggle,
      className: "mr-2 h-8 w-8 p-0"
    },
    /* @__PURE__ */ React.createElement(Menu, { className: "h-4 w-4" })
  ), /* @__PURE__ */ React.createElement("div", { className: "ml-auto flex items-center space-x-4" }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm" }, /* @__PURE__ */ React.createElement(Search2, { className: "h-4 w-4" })), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm" }, /* @__PURE__ */ React.createElement(Bell, { className: "h-4 w-4" })), /* @__PURE__ */ React.createElement(Button, { variant: "ghost", size: "sm" }, /* @__PURE__ */ React.createElement(User, { className: "h-4 w-4" })))));
};
var TopNav_default = TopNav;

// src/components/layout/dashboard-layout.tsx
var DashboardLayout = ({
  children,
  navigation,
  sidebarFooter,
  branding,
  className,
  showTopNav = true,
  onNavigationChange
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState6(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState6(false);
  const handleSidebarToggle = useCallback3(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);
  const handleSidebarCollapse = useCallback3(() => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }, [isSidebarCollapsed]);
  const sidebarWidth = useMemo5(() => {
    if (!isSidebarOpen) return 0;
    return isSidebarCollapsed ? 64 : 256;
  }, [isSidebarOpen, isSidebarCollapsed]);
  return /* @__PURE__ */ React41.createElement("div", { className: cn("flex h-screen bg-background", className) }, isSidebarOpen && /* @__PURE__ */ React41.createElement(
    "div",
    {
      className: "fixed left-0 top-0 z-40 h-full p-4",
      style: { width: sidebarWidth }
    },
    /* @__PURE__ */ React41.createElement(
      SidebarComponent_default,
      {
        navigation: navigation.navigation,
        sidebarFooter,
        branding,
        isCollapsed: isSidebarCollapsed,
        onToggle: handleSidebarCollapse,
        onNavigationChange
      }
    )
  ), /* @__PURE__ */ React41.createElement(
    "div",
    {
      className: "flex-1 flex flex-col",
      style: { marginLeft: isSidebarOpen ? sidebarWidth : 0 }
    },
    showTopNav && /* @__PURE__ */ React41.createElement(
      TopNav_default,
      {
        branding,
        onMenuToggle: handleSidebarToggle,
        showMenuButton: !isSidebarOpen
      }
    ),
    /* @__PURE__ */ React41.createElement("main", { className: "flex-1 overflow-auto" }, /* @__PURE__ */ React41.createElement("div", { className: "container mx-auto p-6" }, children))
  ), isSidebarOpen && /* @__PURE__ */ React41.createElement(
    "div",
    {
      className: "fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden",
      onClick: handleSidebarToggle
    }
  ));
};
var dashboard_layout_default = DashboardLayout;

// src/components/layout/navigation-config.tsx
import {
  BarChart3,
  FileText,
  HelpCircle,
  Key,
  LayoutDashboard,
  List,
  LogOut,
  Settings,
  UserCheck,
  Wallet
} from "lucide-react";
var defaultNavigation = [
  {
    id: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: /* @__PURE__ */ React.createElement(LayoutDashboard, { className: "h-4 w-4" })
  },
  {
    id: "transactions",
    title: "Transactions",
    href: "/transactions",
    icon: /* @__PURE__ */ React.createElement(List, { className: "h-4 w-4" })
  },
  {
    id: "analytics",
    title: "Analytics",
    href: "/analytics",
    icon: /* @__PURE__ */ React.createElement(BarChart3, { className: "h-4 w-4" })
  },
  {
    id: "reports",
    title: "Reports",
    href: "/reports",
    icon: /* @__PURE__ */ React.createElement(FileText, { className: "h-4 w-4" })
  },
  {
    id: "admin",
    title: "Admin",
    icon: /* @__PURE__ */ React.createElement(Settings, { className: "h-4 w-4" }),
    children: [
      {
        id: "team",
        title: "Team",
        href: "/admin/team",
        icon: /* @__PURE__ */ React.createElement(UserCheck, { className: "h-4 w-4" })
      },
      {
        id: "api-keys",
        title: "API Keys",
        href: "/admin/api-keys",
        icon: /* @__PURE__ */ React.createElement(Key, { className: "h-4 w-4" })
      },
      {
        id: "balances",
        title: "Account Balances",
        href: "/admin/balances",
        icon: /* @__PURE__ */ React.createElement(Wallet, { className: "h-4 w-4" })
      }
    ]
  }
];
var defaultFooterItems = [
  {
    id: "help",
    title: "Help & Support",
    icon: /* @__PURE__ */ React.createElement(HelpCircle, { className: "h-4 w-4" }),
    onClick: () => {
      console.log("Help clicked");
    }
  },
  {
    id: "logout",
    title: "Logout",
    icon: /* @__PURE__ */ React.createElement(LogOut, { className: "h-4 w-4" }),
    onClick: () => {
      console.log("Logout clicked");
    }
  }
];
var NavigationBuilder = class {
  constructor() {
    this.items = [];
    this.footerItems = [];
  }
  addItem(item) {
    this.items.push(item);
    return this;
  }
  addFooterItem(item) {
    this.footerItems.push(item);
    return this;
  }
  addSection(title, items) {
    this.items.push({
      id: `section-${title.toLowerCase().replace(/\s+/g, "-")}`,
      title,
      children: items
    });
    return this;
  }
  build() {
    return {
      navigation: this.items,
      footer: this.footerItems
    };
  }
};

// src/hooks/useMenu.ts
import { useState as useState7 } from "react";
function useMenu() {
  const [open, setOpen] = useState7(false);
  const [anchorEl, setAnchorEl] = useState7(null);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  return {
    open,
    anchorEl,
    handleOpen,
    handleClose
  };
}

// src/lib/button-utils.ts
var baseButtonVariantClasses = {
  contained: "bg-primary text-primary-foreground  hover:bg-primary/90 active:bg-primary/80 focus-visible:ring-primary/20 font-medium text-base radius-md ",
  outlined: "border border-border bg-background text-foreground  hover:bg-accent hover:text-accent-foreground active:bg-accent/80  font-medium text-base radius-md",
  text: "bg-transparent text-primary hover:bg-primary/10  active:bg-primary/20 focus-visible:ring-primary/20 font-medium text-base radius-md",
  destructive: "bg-destructive hover:bg-destructive/90 active:bg-destructive/80 font-medium text-base radius-md text-white",
  secondary: "bg-secondary text-secondary-foreground  hover:bg-secondary/80 active:bg-secondary/70 font-medium text-base radius-md",
  ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 focus-visible:ring-accent/20 font-medium text-base radius-md",
  link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary/20 font-medium text-base radius-md"
};
var baseButtonSizeClasses = {
  sm: "h-8 px-3 py-1.5 text-xs rounded-md gap-1.5",
  default: "h-10 px-[30px] py-[10px] text-sm rounded-md gap-2",
  lg: "h-11 px-6 py-2.5 text-base rounded-md gap-2.5",
  xl: "h-12 px-8 py-3 text-lg rounded-lg gap-3",
  icon: "h-9 w-9 p-0"
};
function createCustomButtonVariants(customVariants = {}, customSizes = {}) {
  return {
    variants: {
      variant: __spreadValues(__spreadValues({}, baseButtonVariantClasses), customVariants),
      size: __spreadValues(__spreadValues({}, baseButtonSizeClasses), customSizes),
      fullWidth: {
        true: "w-full",
        false: "w-auto"
      }
    },
    defaultVariants: {
      variant: "contained",
      size: "default",
      fullWidth: false
    }
  };
}
function getButtonStyles(variant = "contained", size = "default", fullWidth = false, className) {
  return buttonVariants({ variant, size, fullWidth, className });
}
var buttonPresets = {
  // Common button combinations
  primary: {
    variant: "contained",
    size: "default"
  },
  secondary: {
    variant: "outlined",
    size: "default"
  },
  danger: {
    variant: "destructive",
    size: "default"
  },
  small: {
    variant: "contained",
    size: "sm"
  },
  large: {
    variant: "contained",
    size: "lg"
  },
  icon: {
    variant: "ghost",
    size: "icon"
  },
  link: {
    variant: "link",
    size: "default"
  }
};
function validateButtonProps(props) {
  const errors = [];
  const validVariants = [
    "contained",
    "outlined",
    "text",
    "secondary",
    "destructive",
    "ghost",
    "link"
  ];
  if (props.variant && !validVariants.includes(props.variant)) {
    errors.push(`Invalid variant: ${props.variant}`);
  }
  const validSizes = ["sm", "default", "lg", "xl", "icon"];
  if (props.size && !validSizes.includes(props.size)) {
    errors.push(`Invalid size: ${props.size}`);
  }
  if (typeof props.fullWidth !== "undefined" && typeof props.fullWidth !== "boolean") {
    errors.push("fullWidth must be a boolean");
  }
  if (typeof props.loading !== "undefined" && typeof props.loading !== "boolean") {
    errors.push("loading must be a boolean");
  }
  if (typeof props.disabled !== "undefined" && typeof props.disabled !== "boolean") {
    errors.push("disabled must be a boolean");
  }
  return errors;
}
function generateThemeButtonVariants(theme = "light") {
  const baseVariants = {
    contained: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
    outlined: "border border-border bg-background text-foreground shadow-sm hover:bg-accent",
    text: "bg-transparent text-primary hover:bg-primary/10",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
  };
  if (theme === "dark") {
    return __spreadProps(__spreadValues({}, baseVariants), {
      contained: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 dark:bg-primary/90",
      outlined: "border border-border bg-background text-foreground shadow-sm hover:bg-accent dark:border-border/50"
    });
  }
  return baseVariants;
}
function createResponsiveButtonVariants() {
  return {
    sm: "h-8 px-3 py-1.5 text-xs rounded-md gap-1.5 md:h-9 md:px-4 md:py-2 md:text-sm",
    default: "h-10 px-[30px] py-[10px] text-sm rounded-md gap-2 md:h-11 md:px-6 md:py-2.5 md:text-base",
    lg: "h-11 px-6 py-2.5 text-base rounded-md gap-2.5 md:h-12 md:px-8 md:py-3 md:text-lg"
  };
}
export {
  Autocomplete,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Input as BaseInput,
  branding_component_default as BrandingComponent,
  BrandingComponentSkeleton,
  Button,
  Calendar,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Container,
  dashboard_layout_default as DashboardLayout,
  DataTablePagination,
  DatePicker_default as DatePicker,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  EnhancedDataTable,
  EnhancedPagination,
  Input2 as Input,
  NavigationBuilder,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RHFAutocomplete,
  RHFCheckbox,
  RHFDDatePicker,
  RHFInput,
  RHFRadio,
  RHFSelect,
  RHFTextarea,
  Radio,
  ReusableTabs,
  ScrollArea,
  Select,
  Separator2 as Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  Skeleton,
  TableCell,
  Textarea,
  Typography,
  badgeVariants,
  buttonPresets,
  buttonVariants,
  cn,
  createCustomButtonVariants,
  createResponsiveButtonVariants,
  defaultBadgeStatusConfig,
  defaultFooterItems,
  defaultNavigation,
  generateThemeButtonVariants,
  getButtonStyles,
  makeCustomColors,
  tabListVariants,
  tabTriggerVariants,
  typographyVariants,
  useEnhancedPagination,
  useEnhancedPagination as useEnhancedPaginationState,
  useMenu,
  usePagination,
  useTableState,
  validateButtonProps
};
//# sourceMappingURL=index.mjs.map