export interface TreeNode {
  /** The display name of the node */
  name: string;
  /** The size value associated with this node (e.g., file size, item count) */
  size: number;
  /** Child nodes nested under this node */
  children?: TreeNode[];
  /** Flag indicating if the node has children, even if not loaded yet */
  hasChildren?: boolean;
  /** Flag indicating if this node matches the current search criteria */
  matchesSearch?: boolean;
  /** Flag indicating if any descendant of this node matches the search criteria */
  hasSearchMatchInChildren?: boolean;
}

export interface TreeProps {
  /** The root node of the tree to display */
  data: TreeNode;
  /** Optional search term to filter and highlight nodes */
  searchTerm?: string;
}
