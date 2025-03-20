/**
 * Renders a message when a node has no children to display.
 * Used as a fallback when an expanded node has empty children array.
 *
 * @returns A simple message indicating no children were found
 */
export function TreeEmptyChildren() {
  return (
    <div className="ml-6 py-2 text-muted-foreground">No children found</div>
  );
}
