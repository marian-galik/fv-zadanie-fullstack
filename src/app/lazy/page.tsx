"use client";

import { useState } from "react";
import { TreeViewLazy } from "@/components/TreeViewLazy";
import { QueryProvider } from "@/providers/QueryProvider";
import { TextInput } from "@/components/ui";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function LazyPage() {
  // Track the input value for immediate UI feedback
  const [inputValue, setInputValue] = useState("");

  // Debounce the search term that gets passed to the TreeViewLazy component
  const debouncedSearchTerm = useDebounce(inputValue, 300);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-6">ImageNet Lazy Tree View</h1>
      <p className="mb-6 text-muted-foreground">
        This tree view demonstrates lazy loading - nodes are only loaded when
        expanded.
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

      <QueryProvider>
        <TreeViewLazy searchTerm={debouncedSearchTerm} />
      </QueryProvider>
    </main>
  );
}
