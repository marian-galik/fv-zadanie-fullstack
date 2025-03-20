import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for conditionally joining CSS class names together.
 * Combines clsx and tailwind-merge for optimal class name handling.
 *
 * @param inputs - Array of class values, conditionals, or objects
 * @returns Merged and normalized className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
