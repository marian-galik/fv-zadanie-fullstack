import { cn } from "@/lib/utils";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { HighlightText } from "./HighlightText";

export interface TreeNodeHeaderProps {
  /** The display name of the node */
  name: string;
  /** The size value associated with this node */
  size: number;
  /** The nesting level of the node (used for indentation) */
  level: number;
  /** Whether the node has children (controls chevron display) */
  hasChildren?: boolean;
  /** Whether the node is currently expanded */
  isExpanded: boolean;
  /** Whether the node's children are currently loading */
  isLoading: boolean;
  /** Callback function for handling expansion toggle */
  onToggle: () => void;
  /** Optional search term for text highlighting */
  searchTerm?: string;
}

/**
 * Renders the header portion of a tree node.
 * Includes:
 * - Expand/collapse chevron or loading indicator
 * - Node name with optional search term highlighting
 * - Size indicator
 *
 * @param props - The TreeNodeHeader component props
 * @returns A tree node header with appropriate indicators
 */
export function TreeNodeHeader({
  name,
  size,
  hasChildren,
  isExpanded,
  isLoading,
  onToggle,
  searchTerm,
}: TreeNodeHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 py-1 px-2 hover:bg-accent rounded-lg cursor-pointer"
      )}
      onClick={onToggle}
    >
      {hasChildren && (
        <span className="w-4 h-4">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>
      )}
      <span className="flex-1">
        <HighlightText text={name} searchTerm={searchTerm} />
      </span>
      <span className="text-sm text-muted-foreground">({size})</span>
    </div>
  );
}
