import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
};

/** Primary Interval blue CTA — Sign In, Learn more, etc. */
export function Button({
  children,
  href,
  type = "button",
  className,
  onClick,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md border border-iw-blue bg-iw-blue px-5 py-2.5 text-sm text-white transition-colors hover:bg-iw-blue-dark hover:border-iw-blue-dark",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
