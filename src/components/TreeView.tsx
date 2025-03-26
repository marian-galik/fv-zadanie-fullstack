"use client";

import { useState, useEffect, useMemo } from "react";
import { TreeNode } from "@/types/tree";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { HighlightText } from "@/components/tree-view/HighlightText";

/**
 * Recursively checks if a node or any of its children match the search term
 */
function getNodeSearchStatus(
  node: TreeNode,
  searchTerm: string
): {
  matchesSearch: boolean;
  hasMatchInChildren: boolean;
} {
  // Only perform search if search term has at least 3 characters
  const shouldSearch = searchTerm.length >= 3;

  // Direct match on current node
  const matchesSearch =
    shouldSearch && node.name.toLowerCase().includes(searchTerm.toLowerCase());

  // Check children
  let hasMatchInChildren = false;

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      const childStatus = getNodeSearchStatus(child, searchTerm);
      if (childStatus.matchesSearch || childStatus.hasMatchInChildren) {
        hasMatchInChildren = true;
        break;
      }
    }
  }

  return { matchesSearch, hasMatchInChildren };
}

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

  // Determine if this node or its children match the search
  const { matchesSearch, hasMatchInChildren } = useMemo(
    () => getNodeSearchStatus(node, searchTerm),
    [node, searchTerm]
  );

  // Auto-expand nodes with matching children during search
  useEffect(() => {
    if (shouldSearch && hasMatchInChildren) {
      setIsExpanded(true);
    } else if (!shouldSearch) {
      setIsExpanded(defaultExpanded);
    }
  }, [searchTerm, hasMatchInChildren, shouldSearch, defaultExpanded]);

  // In search mode, only render nodes that match or have matching children
  if (shouldSearch && !matchesSearch && !hasMatchInChildren) {
    return null;
  }

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 hover:bg-accent rounded-lg cursor-pointer",
          shouldSearch && matchesSearch && "bg-accent/50"
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
            shouldSearch={shouldSearch}
            text={node.name}
            searchTerm={shouldSearch ? searchTerm : undefined}
          />
        </span>
        <span className="text-sm text-muted-foreground">({node.size})</span>
      </div>

      {isExpanded && hasChildren && (
        <div className="mt-1 ml-6">
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
  const isSearchMode = searchTerm && searchTerm.length >= 3;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg bg-background">
      {isSearchMode && (
        <div className="mb-2 text-sm text-muted-foreground">
          Showing search results for:{" "}
          <span className="font-medium">{searchTerm}</span>
        </div>
      )}
      <TreeViewItem node={data} searchTerm={searchTerm} isExpanded={true} />
    </div>
  );
}
