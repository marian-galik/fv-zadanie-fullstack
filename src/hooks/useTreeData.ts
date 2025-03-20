import { useQuery } from "@tanstack/react-query";
import { TreeNode } from "@/types/tree";
import { DELIMITER } from "@/consts";

/**
 * Creates a consistent query key array for React Query caching.
 *
 * @param path - Optional node path to fetch (defaults to "root")
 * @param searchTerm - Optional search term to filter nodes
 * @returns An array to be used as React Query's queryKey
 */
export const getNodeQueryKey = (path?: string, searchTerm?: string) => [
  "imagenet-lazy",
  path || "root",
  searchTerm || "",
];

/**
 * Fetches tree node data from the API with optional path and search filtering.
 *
 * @param path - Optional path string to fetch specific node children
 * @param searchTerm - Optional search term to filter nodes
 * @param signal - Optional AbortSignal for fetch cancellation
 * @returns Promise resolving to an object with children array
 * @throws Error if the fetch request fails
 */
async function fetchNodeData(
  path?: string,
  searchTerm?: string,
  signal?: AbortSignal
): Promise<{ children: TreeNode[] }> {
  const queryParams = new URLSearchParams();

  if (path) {
    queryParams.append("path", path);
  }

  if (searchTerm) {
    queryParams.append("search", searchTerm);
  }

  const url = `/api/imagenet-lazy?${queryParams.toString()}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch tree data");
  }

  return response.json();
}

interface UseTreeDataParams {
  /** Path to fetch (undefined means root node) */
  path?: string;
  /** Optional search term to filter nodes */
  searchTerm?: string;
  /** Whether the query should execute automatically */
  enabled?: boolean;
  /** Garbage collection time in milliseconds */
  gcTime?: number;
  /** Stale time in milliseconds */
  staleTime?: number;
}

/**
 * Custom hook for fetching tree data with React Query caching.
 * Provides optimized data fetching with proper caching, loading states,
 * and error handling.
 *
 * @param params - Configuration parameters for the tree data query
 * @returns React Query result object with data, loading state, and error handling
 */
export function useTreeData({
  path,
  searchTerm,
  enabled = true,
  gcTime = 10 * 60 * 1000, // 10 minutes
  staleTime = 5 * 60 * 1000, // 5 minutes
}: UseTreeDataParams = {}) {
  return useQuery({
    queryKey: getNodeQueryKey(path, searchTerm),
    queryFn: ({ signal }) => fetchNodeData(path, searchTerm, signal),
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

/**
 * Custom hook for fetching the root tree data.
 * Transforms the API response into a properly structured root node.
 *
 * @param searchTerm - Optional search term to filter nodes
 * @returns Object containing:
 *   - rootNode: The formatted root node with children
 *   - isLoading: Loading state indicator
 *   - isError: Error state indicator
 *   - error: Error object if an error occurred
 */
export function useRootTreeData(searchTerm?: string) {
  const { data, isLoading, isError, error } = useTreeData({
    searchTerm,
    staleTime: 0, // Always fetch fresh data for root
    gcTime: 0, // Don't cache root data
  });

  // Create a root node if we have children data
  const rootNode: TreeNode | null =
    data?.children && data.children.length > 0
      ? {
          // We use the first child's name before the delimiter as the root name
          name: data.children[0]?.name.split(DELIMITER)[0] || "ImageNet",
          size: data.children[0]?.size || 0,
          hasChildren: true,
          children: data.children,
        }
      : null;

  return {
    rootNode,
    isLoading,
    isError,
    error,
  };
}
