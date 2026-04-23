import Link from "next/link";

import { cn } from "@/lib/utils";

export type ButtonVariant = "ghost" | "inverse" | "primary" | "secondary" | "quiet";
export type ButtonSize = "sm" | "md" | "lg";

export function buttonClasses({
  className,
  size = "md",
  variant = "primary"
}: {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-extrabold uppercase tracking-[0.16em] transition-all duration-200 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45",
    size === "sm" && "px-4 py-2.5 text-[0.63rem]",
    size === "md" && "px-5 py-3 text-[0.68rem]",
    size === "lg" && "px-7 py-4 text-[0.72rem]",
    variant === "primary" &&
      "bg-cta-gradient text-on-primary shadow-lift hover:brightness-[1.04]",
    variant === "secondary" &&
      "bg-surface-container-highest text-on-surface hover:bg-surface-variant",
    variant === "quiet" &&
      "bg-surface-container-lowest text-on-surface ghost-outline hover:bg-surface-bright",
    variant === "ghost" &&
      "bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
    variant === "inverse" &&
      "bg-white/10 text-white backdrop-blur-xl hover:bg-white/15",
    className
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({
  className,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return <button className={buttonClasses({ className, size, variant })} type={type} {...props} />;
}

export function ButtonLink({
  children,
  className,
  href,
  size = "md",
  variant = "primary"
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return (
    <Link className={buttonClasses({ className, size, variant })} href={href}>
      {children}
    </Link>
  );
}
