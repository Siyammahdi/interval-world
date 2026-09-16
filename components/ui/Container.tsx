import { cn } from "@/lib/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "header" | "footer";
};

/** Centered content column matching live ~960px canvas */
export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-iw px-3", className)}>{children}</Tag>;
}
