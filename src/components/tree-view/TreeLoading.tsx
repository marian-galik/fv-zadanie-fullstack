import { Loader2 } from "lucide-react";

interface TreeLoadingProps {
  /** Custom loading message to display */
  message?: string;
  /** Size of the loading indicator */
  size?: "sm" | "default";
  /** Horizontal alignment of the loading indicator */
  align?: "left" | "center" | "right";
}

/**
 * Renders a loading indicator with a customizable message.
 * Used during data fetching operations in the tree view.
 *
 * @param props - The TreeLoading component props
 * @returns A loading indicator with message
 */
export function TreeLoading({
  message = "Loading tree data...",
  size = "default",
  align = "center",
}: TreeLoadingProps) {
  const iconSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";

  return (
    <div
      className={`flex items-center justify-${align} py-2 gap-2 text-muted-foreground`}
    >
      <Loader2 className={`${iconSize} animate-spin`} />
      <span>{message}</span>
    </div>
  );
}
