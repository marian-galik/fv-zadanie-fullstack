import { DELIMITER } from "@/consts";
import { TreeNode } from "./TreeNode";
import { TreeNode as TreeNodeType } from "@/types/tree";

export interface TreeNodeChildrenProps {
  /** Array of child tree node data objects */
  children: TreeNodeType[];
  /** The path to the parent node (used for constructing child paths) */
  nodePath: string;
  /** Optional search term to highlight matching nodes */
  searchTerm?: string;
  /** The nesting level of the parent node (children will be level + 1) */
  level: number;
}

/**
 * Renders a list of child nodes for a parent tree node.
 * Maps over the children array and renders a TreeNode component for each child.
 *
 * @param props - The TreeNodeChildren component props
 * @returns A fragment containing all child tree nodes
 */
export function TreeNodeChildren({
  children,
  nodePath,
  searchTerm,
  level,
}: TreeNodeChildrenProps) {
  return (
    <>
      {children.map((child: TreeNodeType, index: number) => (
        <TreeNode
          key={`${child.name}-${index}`}
          node={child}
          path={nodePath ? `${nodePath}${DELIMITER}` : ""}
          searchTerm={searchTerm}
          level={level + 1}
        />
      ))}
    </>
  );
}
