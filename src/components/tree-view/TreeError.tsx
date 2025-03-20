interface TreeErrorProps {
  /** The error object to display */
  error: unknown;
  /** Optional custom error message prefix */
  message?: string;
}

/**
 * Renders an error message for tree data loading failures.
 * Extracts and displays the error message if available.
 *
 * @param props - The TreeError component props
 * @returns An error message component
 */
export function TreeError({
  error,
  message = "Error loading tree data:",
}: TreeErrorProps) {
  return (
    <div className="py-8 text-center text-red-500">
      {message} {error instanceof Error ? error.message : "Unknown error"}
    </div>
  );
}
