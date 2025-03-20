import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { DELIMITER, DB_TABLE_IMAGE_NET } from "@/consts";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get("path") || "";
    const searchTerm = url.searchParams.get("search") || "";

    // Only perform search if search term has at least 3 characters
    const shouldSearch = searchTerm.length >= 3;

    // If search term is provided and no path, search across all nodes
    if (shouldSearch && !path) {
      // Search for nodes matching the search term and calculate total size for each top-level node
      const searchQuery = `
        WITH matched_nodes AS (
          SELECT name, size
          FROM ${DB_TABLE_IMAGE_NET}
          WHERE name ILIKE $1
        ),
        top_level_nodes AS (
          SELECT DISTINCT split_part(name, $2, 1) as top_name
          FROM matched_nodes
        )
        SELECT
          t.top_name as name,
          CAST(COALESCE(SUM(m.size), 0) AS INTEGER) as size
        FROM top_level_nodes t
        LEFT JOIN matched_nodes m ON m.name ILIKE t.top_name || $2 || '%'
        GROUP BY t.top_name
        ORDER BY t.top_name
      `;

      const entries = await prisma.$queryRawUnsafe<
        Array<{ name: string; size: number }>
      >(searchQuery, `%${searchTerm}%`, DELIMITER);

      return NextResponse.json({ children: entries });
    }

    // Base query to get immediate children
    const childrenQuery =
      path === ""
        ? `SELECT name, size FROM ${DB_TABLE_IMAGE_NET} WHERE name NOT ILIKE '%${DELIMITER}%' ORDER BY id`
        : `SELECT name, size FROM ${DB_TABLE_IMAGE_NET} WHERE name ILIKE $1 AND name NOT ILIKE $2 ORDER BY id`;

    const childrenQueryParams =
      path === ""
        ? []
        : [`${path}${DELIMITER}%`, `${path}${DELIMITER}%${DELIMITER}%`];

    // Execute the main query to get children
    const entries = await prisma.$queryRawUnsafe<
      Array<{ name: string; size: number }>
    >(childrenQuery, ...childrenQueryParams);

    // Process the children to determine if they have children
    const children = await Promise.all(
      entries.map(async (entry) => {
        const nodeName =
          path === "" ? entry.name : entry.name.split(DELIMITER).pop() || "";

        const childPath =
          path === "" ? nodeName : `${path}${DELIMITER}${nodeName}`;
        // Check if this node has children
        const hasChildrenCheck = await prisma.$queryRawUnsafe<
          Array<{ 1: number }>
        >(
          `SELECT 1 FROM ${DB_TABLE_IMAGE_NET} WHERE name ILIKE $1 LIMIT 1`,
          `${childPath}${DELIMITER}%`
        );
        const hasChildren = hasChildrenCheck.length > 0;

        // Check if this node matches the search term (if provided and long enough)
        const matchesSearch = shouldSearch
          ? nodeName.toLowerCase().includes(searchTerm.toLowerCase())
          : false;

        // Check if this node has any children that match the search term
        const hasSearchMatchInChildren = shouldSearch
          ? await prisma
              .$queryRawUnsafe<Array<{ 1: number }>>(
                `SELECT 1 FROM ${DB_TABLE_IMAGE_NET}
               WHERE name ILIKE $1
               AND name ILIKE $2
               LIMIT 1`,
                `${childPath}${DELIMITER}%`,
                `%${searchTerm}%`
              )
              .then((results) => results.length > 0)
          : false;

        return {
          name: nodeName,
          size: entry.size,
          hasChildren,
          matchesSearch,
          hasSearchMatchInChildren,
        };
      })
    );

    return NextResponse.json({ children });
  } catch (error) {
    console.error("Error loading lazy data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
