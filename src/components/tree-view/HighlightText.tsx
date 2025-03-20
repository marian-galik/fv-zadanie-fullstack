import React from "react";

interface HighlightTextProps {
  text: string;
  searchTerm?: string;
}

/**
 * Component that highlights portions of text that match a search term
 */
export function HighlightText({ text, searchTerm = "" }: HighlightTextProps) {
  // If no search term or too short, just return the text
  if (!searchTerm || searchTerm.length < 3) {
    return <>{text}</>;
  }

  // Case insensitive search
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        // Check if this part matches the search term (case insensitive)
        const isMatch =
          part.toLowerCase() === searchTerm.toLowerCase() ||
          searchTerm.toLowerCase() === part.toLowerCase();
        return isMatch ? (
          <span
            key={i}
            className="bg-yellow-100 dark:bg-yellow-900/30 font-medium"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

// Helper function to escape special characters for RegExp
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
