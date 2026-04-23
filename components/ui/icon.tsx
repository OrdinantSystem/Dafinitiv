import { cn } from "@/lib/utils";

export type IconName =
  | "arrow-up"
  | "arrow-right"
  | "book"
  | "chart"
  | "check"
  | "clock"
  | "focus-mark"
  | "headphones"
  | "home"
  | "layers"
  | "menu"
  | "mic"
  | "notebook"
  | "pencil"
  | "rocket"
  | "settings"
  | "sparkles"
  | "stop"
  | "target"
  | "wave"
  | "x";

function Path({ name }: { name: IconName }) {
  switch (name) {
    case "arrow-up":
      return (
        <>
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </>
      );
    case "arrow-right":
      return (
        <>
          <path d="M5 12h13" />
          <path d="m13 7 5 5-5 5" />
        </>
      );
    case "book":
      return (
        <>
          <path d="M12 5v15" />
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H12v15H6.5A2.5 2.5 0 0 1 4 17.5Z" />
          <path d="M20 7.5A2.5 2.5 0 0 0 17.5 5H12v15h5.5a2.5 2.5 0 0 0 2.5-2.5Z" />
        </>
      );
    case "chart":
      return (
        <>
          <path d="M4 5v14" />
          <path d="M4 19h16" />
          <path d="m7 14 3.5-3.5 3 3 5.5-6.5" />
        </>
      );
    case "check":
      return <path d="m5 12 4.5 4.5L19 7" />;
    case "clock":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </>
      );
    case "focus-mark":
      return (
        <>
          <path d="M8 5H5v3" />
          <path d="M16 5h3v3" />
          <path d="M19 16v3h-3" />
          <path d="M5 16v3h3" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      );
    case "headphones":
      return (
        <>
          <path d="M4 13a8 8 0 0 1 16 0" />
          <path d="M4 13v4a2 2 0 0 0 2 2h2v-7H6a2 2 0 0 0-2 2Z" />
          <path d="M20 13v4a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2Z" />
        </>
      );
    case "home":
      return (
        <>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9.5V20h14V9.5" />
          <path d="M10 20v-5h4v5" />
        </>
      );
    case "layers":
      return (
        <>
          <path d="m12 4 8 4-8 4-8-4 8-4Z" />
          <path d="m4 12 8 4 8-4" />
          <path d="m4 16 8 4 8-4" />
        </>
      );
    case "menu":
      return (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      );
    case "mic":
      return (
        <>
          <path d="M12 16a4 4 0 0 0 4-4V8a4 4 0 0 0-8 0v4a4 4 0 0 0 4 4Z" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v3" />
          <path d="M8.5 21h7" />
        </>
      );
    case "notebook":
      return (
        <>
          <path d="M7 4h11a2 2 0 0 1 2 2v14H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" />
          <path d="M8 4v16" />
          <path d="M12 8h5" />
          <path d="M12 12h5" />
          <path d="M12 16h3" />
        </>
      );
    case "pencil":
      return (
        <>
          <path d="m14 6 4 4" />
          <path d="M6 20l3.5-.5L19 10a2.8 2.8 0 1 0-4-4L5.5 15.5 5 19.9Z" />
        </>
      );
    case "rocket":
      return (
        <>
          <path d="M15 15c-3.5 1.5-7.5 5.5-9 7 1.5-1.5 5.5-5.5 7-9l5-5a6.5 6.5 0 0 0-5-5l-5 5c-3.5 1.5-7.5 5.5-9 7 1.5-1.5 5.5-5.5 7-9" />
          <path d="M9 15 4 20" />
          <path d="M14.5 9.5 19 5" />
          <circle cx="14.5" cy="9.5" r="1.5" />
        </>
      );
    case "settings":
      return (
        <>
          <path d="M6 4v5" />
          <path d="M6 15v5" />
          <path d="M12 4v9" />
          <path d="M12 19v1" />
          <path d="M18 4v1" />
          <path d="M18 11v9" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="12" cy="16" r="3" />
          <circle cx="18" cy="8" r="3" />
        </>
      );
    case "sparkles":
      return (
        <>
          <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z" />
          <path d="m5.5 14 1 2.5L9 17.5 6.5 18.5 5.5 21l-1-2.5L2 17.5l2.5-1Z" />
          <path d="m18.5 14.5.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z" />
        </>
      );
    case "stop":
      return <rect height="10" rx="1.5" width="10" x="7" y="7" />;
    case "target":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1.5" />
        </>
      );
    case "wave":
      return (
        <>
          <path d="M2 12c1.2 0 1.6-4 2.8-4s1.6 8 2.8 8 1.6-8 2.8-8 1.6 8 2.8 8 1.6-8 2.8-8 1.6 4 2.8 4" />
        </>
      );
    case "x":
      return (
        <>
          <path d="M6 6 18 18" />
          <path d="M18 6 6 18" />
        </>
      );
  }
}

export function AppIcon({
  className,
  name,
  strokeWidth = 1.85
}: {
  className?: string;
  name: IconName;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      vectorEffect="non-scaling-stroke"
      viewBox="0 0 24 24"
    >
      <Path name={name} />
    </svg>
  );
}
