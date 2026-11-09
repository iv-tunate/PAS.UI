import Link from "next/link";
import type { ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
};

type ButtonAsLink = BaseProps & {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
};

type ButtonAsButton = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

const VARIANT_STYLES: Record<NonNullable<BaseProps["variant"]>, string> = {
   primary:
    "bg-brand-gradient-solid text-white hover:opacity-90 border border-transparent",
  outline:
    "bg-transparent text-ink dark:text-paper border border-ink/20 dark:border-paper/20 hover:border-ink/40 dark:hover:border-paper/40",
  ghost:
    "bg-transparent text-ink dark:text-paper border border-transparent hover:bg-ink/5 dark:hover:bg-paper/10",
};

const BASE =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap";


export default function Button(props: ButtonProps) {
  const { children, variant = "primary", className = "" } = props;
  const classes = `${BASE} ${VARIANT_STYLES[variant]} ${className}`;

  if (props.href !== undefined) {
    if (props.external) {
      return (
        <a href={props.href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={`${classes} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
