"use client";

import { useState } from "react";
import { TreeNode } from "@/types/tree";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { HighlightText } from "@/components/tree-view/HighlightText";

interface TreeViewItemProps {
  /** Tree node data to render */
  node: TreeNode;
  /** Optional search term for highlighting matching text */
  searchTerm?: string;
  /** Nesting level of the current tree node */
  level?: number;
  /** Whether the node should be initially expanded */
  isExpanded?: boolean;
}

/**
 * Renders a single item in the tree view with its children.
 * Handles expansion state, indentation, and search highlighting.
 *
 * @param props - TreeViewItem component props
 * @returns A tree view item with optional children
 */
const TreeViewItem = ({
  node,
  searchTerm = "",
  level = 0,
  isExpanded: defaultExpanded = false,
}: TreeViewItemProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = node.children && node.children.length > 0;

  // Only perform search if search term has at least 3 characters
  const shouldSearch = searchTerm.length >= 3;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 hover:bg-accent rounded-lg cursor-pointer",
          level > 0 && "ml-6"
        )}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <span className="w-4 h-4">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
        <span className="flex-1">
          <HighlightText
            text={node.name}
            searchTerm={shouldSearch ? searchTerm : undefined}
          />
        </span>
        <span className="text-sm text-muted-foreground">({node.size})</span>
      </div>

      {isExpanded && hasChildren && (
        <div className="mt-1">
          {node.children?.map((child, index) => (
            <TreeViewItem
              key={`${child.name}-${index}`}
              node={child}
              searchTerm={searchTerm}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Renders a hierarchical tree view component with search capabilities.
 * This component loads all data upfront and handles the search client-side.
 *
 * @param data - Root tree node containing the entire tree structure
 * @param searchTerm - Optional search term to highlight matching nodes
 * @returns A tree view component displaying hierarchical data
 */
export function TreeView({
  data,
  searchTerm,
}: {
  data: TreeNode;
  searchTerm?: string;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg bg-background">
      <TreeViewItem node={data} searchTerm={searchTerm} isExpanded={true} />
    </div>
  );
}
