"use client";

import { Suspense } from "react";
import { useRootTreeData } from "@/hooks/useTreeData";
import {
  TreeNode,
  TreeLoading,
  TreeError,
  TreeEmptyChildren,
} from "@/components/tree-view";

export interface TreeViewLazyProps {
  /** Optional search term to highlight matching nodes */
  searchTerm?: string;
}

/**
 * Lazy-loading tree view component that dynamically fetches data as needed.
 * Key features:
 * - Only fetches data for expanded nodes
 * - Uses React Suspense for loading states
 * - Supports search with automatic node expansion
 * - Handles loading and error states
 *
 * @param props - Component props
 * @returns A tree view component with lazy-loading capabilities
 */
export function TreeViewLazy({ searchTerm }: TreeViewLazyProps) {
  // Only perform search if search term has at least 3 characters
  const shouldSearch = searchTerm && searchTerm.length >= 3;
  const effectiveSearchTerm = shouldSearch ? searchTerm : undefined;

  const { rootNode, isLoading, isError, error } =
    useRootTreeData(effectiveSearchTerm);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg bg-background">
      <Suspense fallback={<TreeLoading />}>
        {isLoading ? (
          <TreeLoading />
        ) : isError ? (
          <TreeError error={error} />
        ) : rootNode ? (
          <TreeNode
            node={rootNode}
            searchTerm={effectiveSearchTerm}
            isExpanded={true}
          />
        ) : (
          <TreeEmptyChildren />
        )}
      </Suspense>
    </div>
  );
}
