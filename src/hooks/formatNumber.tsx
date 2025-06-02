import type React from "react";

import { useState, useEffect } from "react";

interface UseFormattedNumberOptions {
  initialValue?: number;
  onChange?: (value: number | undefined) => void;
  separator?: string;
}

export function useFormattedNumber({
  initialValue,
  onChange,
  separator = " ",
}: UseFormattedNumberOptions = {}) {
  const [numericValue, setNumericValue] = useState<number | undefined>(
    initialValue
  );
  const [displayValue, setDisplayValue] = useState<string>("");

  // Format number with thousand separators
  const formatNumber = (num: number | undefined): string => {
    if (num === undefined) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  // Parse formatted string back to number
  const parseFormattedNumber = (formatted: string): number | undefined => {
    const digitsOnly = formatted.replace(new RegExp(`\\${separator}`, "g"), "");
    if (digitsOnly === "") return undefined;
    return Number.parseInt(digitsOnly, 10);
  };

  // Update display value when numeric value changes
  useEffect(() => {
    setDisplayValue(formatNumber(numericValue));
  }, [numericValue]);

  // Initialize display value
  useEffect(() => {
    if (initialValue !== undefined) {
      setNumericValue(initialValue);
      setDisplayValue(formatNumber(initialValue));
    }
  }, [initialValue]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Only allow digits and the separator
    const validChars = new RegExp(`^[\\d\\${separator}]*$`);
    if (!validChars.test(inputValue) && inputValue !== "") {
      return;
    }

    // Remove existing separators
    const rawValue = inputValue.replace(new RegExp(`\\${separator}`, "g"), "");

    if (rawValue === "") {
      setDisplayValue("");
      setNumericValue(undefined);
      onChange?.(undefined);
      return;
    }

    // Format with separators
    const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    setDisplayValue(formattedValue);

    // Update numeric value
    const newNumericValue = Number.parseInt(rawValue, 10);
    setNumericValue(newNumericValue);
    onChange?.(newNumericValue);
  };

  return {
    value: numericValue,
    displayValue,
    handleChange: handleInputChange,
    formatNumber,
    parseFormattedNumber,
  };
}
