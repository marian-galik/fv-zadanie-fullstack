"use client";

import { useState, useEffect } from "react";
import { useTreeData } from "@/hooks/useTreeData";
import { TreeLoading } from "./TreeLoading";
import { TreeEmptyChildren } from "./TreeEmptyChildren";
import { TreeError } from "./TreeError";
import { TreeNodeChildren } from "./TreeNodeChildren";
import { TreeNodeHeader } from "./TreeNodeHeader";
import { TreeNode as TreeNodeType } from "@/types/tree";

export interface TreeNodeProps {
  /** The tree node data object */
  node: TreeNodeType;
  /** The path to the current node (used for lazy loading children) */
  path?: string;
  /** Optional search term to highlight matching nodes */
  searchTerm?: string;
  /** The nesting level of the node (controls indentation) */
  level?: number;
  /** Whether the node should be expanded by default */
  isExpanded?: boolean;
}

/**
 * Renders a single node in the lazy-loading tree view.
 * Handles:
 * - Dynamic expansion/collapse of nodes
 * - Lazy loading of child nodes
 * - Search highlighting and auto-expansion
 * - Loading and error states
 *
 * @param props - The TreeNode component props
 * @returns A tree node with dynamically loaded children
 */
export function TreeNode({
  node,
  path,
  searchTerm = "",
  level = 0,
  isExpanded: defaultExpanded = false,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Determine the current node path
  const nodePath = path ? `${path}${node.name}` : node.name;

  const hasChildren = node.hasChildren;

  // Only perform search if search term has at least 3 characters
  const shouldSearch = searchTerm.length >= 3;

  // Check if this node matches the search term
  const isMatch =
    (shouldSearch && node.matchesSearch) ||
    (shouldSearch &&
      node.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Auto-expand nodes with matches when search term changes
  useEffect(() => {
    if (
      shouldSearch &&
      (isMatch || node.hasSearchMatchInChildren) &&
      hasChildren &&
      !isExpanded
    ) {
      setIsExpanded(true);
    }
  }, [
    searchTerm,
    isMatch,
    node.hasSearchMatchInChildren,
    hasChildren,
    isExpanded,
    shouldSearch,
  ]);

  // Query for children when expanded
  const {
    data: childrenData,
    isLoading,
    isError,
    error,
  } = useTreeData({
    path: nodePath,
    searchTerm: shouldSearch ? searchTerm : undefined,
    enabled: isExpanded && !!hasChildren,
  });

  /**
   * Handles the expand/collapse toggle for the node.
   * Only triggers for nodes that have children.
   */
  function handleToggle() {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  }

  return (
    <div className="select-none">
      <TreeNodeHeader
        name={node.name}
        size={node.size}
        level={level}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        isLoading={isLoading}
        onToggle={handleToggle}
        searchTerm={shouldSearch ? searchTerm : undefined}
      />

      {isExpanded && (
        <div className="mt-1 ml-6">
          {isLoading ? (
            <TreeLoading message="Loading..." size="sm" align="left" />
          ) : isError ? (
            <TreeError error={error} message="Error loading data:" />
          ) : childrenData?.children && childrenData.children.length > 0 ? (
            <TreeNodeChildren
              nodePath={nodePath}
              searchTerm={shouldSearch ? searchTerm : undefined}
              level={level}
            >
              {childrenData.children}
            </TreeNodeChildren>
          ) : (
            <TreeEmptyChildren />
          )}
        </div>
      )}
    </div>
  );
}
