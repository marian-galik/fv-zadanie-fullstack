import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { TreeNode } from "@/types/tree";
import { DELIMITER } from "@/consts";

function buildTree(entries: { name: string; size: number }[]): TreeNode {
  const root: TreeNode = { name: "", size: 0, children: [] };
  const map: Record<string, TreeNode> = { "": root };

  entries.forEach((entry) => {
    const path = entry.name.split(DELIMITER);
    let currentNode = root;

    path.forEach((part, index) => {
      if (!map[part]) {
        const newNode: TreeNode = { name: part, size: 0, children: [] };
        map[part] = newNode;
        currentNode.children!.push(newNode);
      }
      currentNode = map[part];
      if (index === path.length - 1) {
        currentNode.size = entry.size;
      }
    });
  });

  return root.children![0];
}

export async function GET() {
  try {
    const entries = await prisma.imageNet.findMany({
      orderBy: { id: "asc" },
    });
    const tree = buildTree(entries);
    return NextResponse.json(tree);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data", details: error },
      { status: 500 }
    );
  }
}
