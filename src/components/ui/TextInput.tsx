/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the TextInput component.
 * Extends standard HTML input element attributes.
 */
export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * A styled text input component.
 * Provides consistent styling for text inputs throughout the application.
 * Supports all standard HTML input attributes.
 *
 * @param props - Component props (including standard HTML input attributes)
 * @param ref - React ref forwarded to the input element
 * @returns A styled input element
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

TextInput.displayName = "TextInput";
