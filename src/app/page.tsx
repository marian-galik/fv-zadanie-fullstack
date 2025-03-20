"use client";

import { useState, useEffect } from "react";
import { TreeView } from "@/components/TreeView";
import { TextInput } from "@/components/ui";
import { Search } from "lucide-react";
import { TreeNode } from "@/types/tree";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Home page component that displays the ImageNet hierarchy as a tree view.
 * Features include:
 * - Search functionality with debounced input
 * - Loading states and error handling
 * - Responsive layout
 *
 * @returns The application's main page with tree view visualization
 */
export default function Home() {
  // Track the input value for immediate UI feedback
  const [inputValue, setInputValue] = useState("");

  // Debounce the search term that gets passed to the TreeView component
  const debouncedSearchTerm = useDebounce(inputValue, 300);

  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches tree data from the API endpoint.
     * Handles loading states and error conditions.
     */
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("/api/imagenet");

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        setTreeData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Failed to fetch tree data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-6">ImageNet Standard Tree View</h1>
      <p className="mb-6 text-muted-foreground">
        This tree view loads the entire tree structure upfront.
      </p>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <TextInput
          type="text"
          placeholder="Search nodes..."
          className="pl-9"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading tree data...</span>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : treeData ? (
        <TreeView data={treeData} searchTerm={debouncedSearchTerm} />
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          No data available
        </div>
      )}
    </main>
  );
}
